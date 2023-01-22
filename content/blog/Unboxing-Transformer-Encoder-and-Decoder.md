---
title: "UNBOXING: Transformer Encoder and Decoder"
date: 2023-01-22T22:13:14+07:00
draft: false
weight: 1
math: true
cover:
  image: "img in static"
---

I always forget things I've learned; It doesn't seem right. I wrote this blog mainly to refresh my own knowledge about transformer. I hope someone who reads this blog will find it useful. If something isn't correct, please let me know 😀

## Architecture

The transformer architecture from the famous "Attention Is All You Need" paper looks like this:

![Transformer Architecture](/blog/transformer-encoder-decoder/transformer_architecture.png#center)


Basically, it has two main parts: the encoder block (left) and the decoder block (right). The encoder block's main duty is to vectorize the input into some representation based on the whole context before and after the current time step that will be used later on. I like to think of it as a feature extractor. Meanwhile, the decoder block has the ability to predict the next sequence based on the whole context before the current time step; It's an autoregressive model. Before we get into the encoder or decoder itself, we have to embed our text data into some vector that is able to represent the semantic distance (similarity between words) and positional distance (position of a word in the sentence). This embedding technique is called positional embedding.

Before implementing the transformer, let's import all necessary libraries.

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

from transformers import AutoTokenizer
```

## Positional Embedding

The embedding layer is a lookup table of a random initialized vector with a size of `vocab_size x embedding_dim`. If we refer to embedding the position, this means that we don't use `vocab_size` anymore since we are not using it. So we need to have some constant that will control the number of maximal sentence length on each row. This is related to how much padding we have to add in an undersized sentence or how many words we must truncate in an oversized sentence.

The idea is to have a regular embedding layer and a positional embedding layer and add them. I will add layer normalization to make sure that our data is normalized at row level and some dropout, so it doesn't overfit. Note that adding the embedding vector is not the only way.

```python
class Embeddings(nn.Module):
    def __init__(self, vocab_size, embed_dim, max_position):
        super().__init__()
        self.token_embeddings = nn.Embedding(vocab_size, embed_dim)
        self.position_embeddings = nn.Embedding(max_position, embed_dim)
        self.layernorm = nn.LayerNorm(embed_dim, eps=1e-12)
        self.dropout = nn.Dropout()

    def forward(self, input_ids):
        seq_len = input_ids.size(-1)
        position_ids = torch.arange(seq_len, dtype=torch.long).view(1, -1)
        token_embed = self.token_embeddings(input_ids)
        position_embed = self.position_embeddings(position_ids)
        embeddings = token_embed + position_embed
        embeddings = self.layernorm(embeddings)
        return self.dropout(embeddings)
```

First, we define all layers that we need. Then we need to get the current sequence length so that i can arrange it from $0$ to $n-1$ for position id. Then, we call token embeddings and position embedding and add them, normalize, and dropout.

I think this is pretty straightforward. I like to think that the addition is basically shifting the original vector to some point but not that far. If it is too far, it will crush the semantic distance. This can add a sense of position since transformer model is not trained sequentially. The beautiful thing about the embedding layer is: it is trainable.

## Self Attention

In language or sequential data in general, we always need context. In RNN, we suffer from gradients problems which means we have a little contextual window at each time step. In LSTM or GRU, the window is getting larger. With the attention mechanism, the window size is infinite. We can preseve all context without losing too much important context because we only pay huge attention to important information. The weights of how important some time step are to each other is defined with the formula below:
$$\text{Attention}(Q, K, V) = \text{softmax}(\dfrac{QK^{T}}{\sqrt{d_k}}) V$$
Where $Q, K, V$ is query, key, and value respectively; It is a linear transformation. $d_k$ is head dimension or query's linear transformation output dimension that used for scaling.

In the decoder part, before we feed to softmax we have to mask it with a triangular matrix so that we get a lower triangular matrix. Intuitively, we gave the the decoder only information from the past but not the future. In encoder part, we don't need to do this because it's much better to be able to vectorize with a bidirectional context.

```python
class Attention(nn.Module):
    def __init__(self, embed_dim, head_dim, mask=None):
        super().__init__()
        self.mask = mask
        self.q = nn.Linear(embed_dim, head_dim)
        self.k = nn.Linear(embed_dim, head_dim)
        self.v = nn.Linear(embed_dim, head_dim)

    def forward(self, x):
        q = self.q(x)
        k = self.k(x)
        v = self.v(x)
        d_k = q.size(-1)  # head_dim
        scores = torch.bmm(q, k.transpose(1, 2)) / d_k ** 0.5

        if self.mask is not None:
            scores = scores.masked_fill(self.mask == 0, -float("inf"))
           
        weights = F.softmax(scores, dim=-1)
        return torch.bmm(weights, v)
```

I set `mask` argument as optional so that we can use it for the encoder and decoder. If `mask` is filled with a masked matrix (lower triangular matrix), it will replace zero with $-\infty$ because softmax is a normalized exponent and $e^{-\infty} = 0$ so this is just like we want earlier. Note that if we sum up every row, we will get $1$ because it is normalized. This means that we are averaging $V$ with our weight score because the average is a linear combination that could be achieved by matrix multiplication.

## Multi Head Attention

"Head" refers to our previous self-attention layer. This means Multi Head Attention == Multiple self-attention layer.

```python
class MultiHeadAttention(nn.Module):
    def __init__(self, embed_dim, num_heads, mask=None):
        super().__init__()
        self.head_dim = embed_dim // num_heads
        self.heads = nn.ModuleList([
            Attention(embed_dim, self.head_dim, mask) for _ in range(num_heads)
        ])
        self.out_fc = nn.Linear(embed_dim, embed_dim)

    def forward(self, x):
        x = torch.cat([h(x) for h in self.heads], dim=-1)
        return self.out_fc(x)
```

As you can see at the `self.heads` property we have multiple `Attention` classes. The dimension of the head is obtained from a division between the embedding dimension and the number of heads. This means we have to set the number of heads that is divisible by the embedding dimension. After we calculate each head, we need to concate the result with respect to the dimension of embedding or the last dimension, then apply linear transformation.

## Feed Forward

After Multi Head Attention, we have a block of feed forward layer. This layer is pretty simple:

```python
class FeedForward(nn.Module):
    def __init__(self, embed_dim, hidden_size, dropout_p):
        super().__init__()
        self.linear_in = nn.Linear(embed_dim, hidden_size)
        self.linear_out = nn.Linear(hidden_size, embed_dim)
        self.gelu = nn.GELU()
        self.dropout = nn.Dropout(dropout_p)

    def forward(self, x):
        x = self.linear_in(x)
        x = self.gelu(x)
        x = self.linear_out(x)
        return self.dropout(x)
```

Basically, we transform our inputs into a larger dimension and then bring it back into the original dimension; This dimension is called the intermediate dimension. I use GeLU in between the linear transformation and do some amount of dropout at the end.

## Encoder Block

Based on the architecture, in encoder block we only need one Multi Head Attention and doesn't need any masking. Observe that we also have skip connection or residual connection and layer normalization. Note that in original paper, layer normalization is applied after the operation. Meanwhile, in the current common implementation, we apply layer normalization before the operation.

```python
class EncoderBlock(nn.Module):
    def __init__(self, embed_dim, num_heads, intermediate_size, dropout_p):
        super().__init__()
        self.layernorm_1 = nn.LayerNorm(embed_dim)
        self.layernorm_2 = nn.LayerNorm(embed_dim)
        self.mha = MultiHeadAttention(embed_dim, num_heads)
        self.ff = FeedForward(embed_dim, intermediate_size, dropout_p)

    def forward(self, x):
        x = x + self.mha(self.layernorm_1(x))
        x = x + self.ff(self.layernorm_2(x))
        return x
```

Notice that we add a raw `x` as an implementation of skip connection. Also, notice that we apply layer normalization first, then fed the result into Multi Head Attention and Feed Forward layer.

## Decoder Block

Based on the architecture, we need 2 Multi Head Attention layers and need to mask. In my implementation, we create the matrix mask inside the class.

```python
class DecoderBlock(nn.Module):
    def __init__(self, embed_dim, num_heads, intermediate_size, dropout_p, seq_len):
        super().__init__()
        self.layernorm_1 = nn.LayerNorm(embed_dim)
        self.layernorm_2 = nn.LayerNorm(embed_dim)
        self.layernorm_3 = nn.LayerNorm(embed_dim)
        self.mask = torch.tril(torch.ones(seq_len, seq_len))
        self.mha_1 = MultiHeadAttention(embed_dim, num_heads, mask=self.mask)
        self.mha_2 = MultiHeadAttention(embed_dim, num_heads, mask=self.mask)
        self.ff = FeedForward(embed_dim, intermediate_size, dropout_p)

    def forward(self, x):
        x = x + self.mha_1(self.layernorm_1(x))
        x = x + self.mha_2(self.layernorm_2(x))
        x = x + self.ff(self.layernorm_3(x))
        return x
```

In the decoder block we need to define the mask matrix size. So we add `seq_len`, which refers to the length of our sequence or the first dimension of our `inputs.input_ids`. This mask will produce a lower triangular weight matrix so the model can't cheat by looking at the next token. I think the forward pass stage is pretty similar to before; just adjust it so, it is exactly like the architecture.

## Let's try it out!

```python
MODEL_CHECKPOINT = "bert-base-uncased"
VOCAB_SIZE = 30522
HIDDEN_SIZE = 768
MAX_POSITION = 512
NUM_HEADS = 12
INTERMEDIATE_SIZE = 3072
DROPOUT_P = 0.1

if __name__ == "__main__":
    tokenizer = AutoTokenizer.from_pretrained(MODEL_CHECKPOINT)
    text = "i love being myself!"
    inputs = tokenizer(text, return_tensors="pt", add_special_tokens=False)
    embed = Embeddings(VOCAB_SIZE, HIDDEN_SIZE, MAX_POSITION)
    inputs_embedded = embed(inputs.input_ids)
   
    encoder = EncoderBlock(HIDDEN_SIZE, NUM_HEADS,
                           INTERMEDIATE_SIZE, DROPOUT_P)
    encoder_output = encoder(inputs_embedded)

    seq_len = inputs_embedded.size(-2)
    decoder = DecoderBlock(HIDDEN_SIZE, NUM_HEADS,
                           INTERMEDIATE_SIZE, DROPOUT_P, seq_len)
    decoder_output = decoder(encoder_output)

    assert decoder_output.size() == encoder_output.size()
    assert decoder_output.size() == inputs_embedded.size()
```

Let's just use the tokenizer from BERT model with "i love being myself!" as the text that needs to be encoded. First, we need to embed it to the positional embeddings that we have created. Then, fed it to our encoder and decoder block. A simple and naive way to make sure that everything is correct is by checking if the original embedded size is the same as decoder and encoder output size.

I guess that's it! Thank you for reading my blog post. Please let me know if you found something incorrect. 🤗

**References**: \
[1] Natural Language Processing with Transformers by Leandro von Werra, Lewis Tunstall, Thomas Wolf \
[2] Machine Learning with Pytorch and Scikit-Learn by Sebastian Raschka , Yuxi (Hayden) Liu , Vahid Mirjalili
