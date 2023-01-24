---
title: "UNBOXING: FNet, Mixing Tokens with Fouriers Transforms"
date: 2023-01-24T15:51:56+07:00
draft: false
weight: 1
math: true
cover:
  image: "img in static"
---

Last Sunday, I was waiting for my order at the food court with my family. That second I decided to skim the FNet paper to kill time. In this article, I will explain everything I know about FNet: Mixing Tokens with Fourier Transforms. Please correct me if you find something incorrect 😀

## Introduction

In the FNet paper, the author uses the fourier transform as a sublayer that replaces the multi head attention sublayer in transformer. As far as I know, this layer is not accepting masking since this paper aims to speed up the transformer's encoder.

The author shows that with FNet, we can achieve at least 92% accuracy on the GLUE benchmark, with 80% faster on GPU and 70% faster on TPU. The author also shows that the longer the input lengths are, the faster FNet is, since transformer attention is pretty expensive (quadratic time and memory bottleneck with respect to the sequence length). The cool thing about FNet is that this layer doesn't contain any trainable parameter. It means we don't need to backpropagate through this layer and update the weights. An unparameterized Fourier Transform can be achieved since everything can be calculated numerically. Before implementing FNet, I would like to explain more about Discrete Fourier Transform.

## Discrete Fourier Transform

Whenever I hear about _fourier_, I always think of some cosine and sine wave that tries to approximate periodic functions. Well, that is fourier series that I learn in calculus and numerical method class. So, what is fourier transform? It is a transformation of periodic function from time domain into frequency domain. I'm not too fond of this fancy term, I like to think in NLP context: we are transforming sequence data (time domain) into some weight (magnitude of the frequency domain) that represent the relation of a token with all other tokens. This concept is the same as the attention score in the vanilla transformer.

As we know, periodic function is continuous. In Discrete Fourier Transform (DFT), we will sample points with a uniform distance. There are two way of calculating DFT: Fast Fourier Transform (FFT) or using DFT Matrix. FFT can be formulated as follows
$$X_k = \sum\limits_{n=0}^{N-1} x_n \ \cdot e^{-\dfrac{2 \pi i kn}{N}} $$
Where $X_{k}$ is the new representation and $k$ is the $k^{\text{th}}$ frequency bin. This formula scares me because we exponents an imaginary number. But we can make it easier to calculate with euler's formula.

let $\dfrac{2 \pi kn}{N} = b_{n}$, then
$$X_k = x_0 e^{-b_0i} + \ ...$$
In euler's formula, we know that,
$$e^{i x} = \cos{x} + i \sin{x}$$
So, the calculation is much simpler,
$$X_k = x_0 \left[ \cos{(-b_0) + i \sin{(-b_0)}} \right] +  \ ...$$
When we sum everything up, we will end up with
$$X_k = A_k + B_k i$$
Concerning imaginary number and real number spaces, we can use $A_k$ and $B_k$ as a coordinate of the head of a vector from the initial point (0, 0). Then, we can compute the magnitude using the pythagorean theorem and compute the angle with arc tan. But, in FNet we discard the complex number and just using the Real number to simplify our computation. The complexity is end up to be $\mathcal{O}(N \log N)$.

The second way to do DFT is through matrix multiplication with DFT matrix, $W$; Means that $X = Wx$. It seems simple but to compute and multiply $W$ is quite expensive because $W$ is a Vandermorde matrix:
$$W_{nk} =  e^{-\dfrac{2 \pi i kn}{\small{N}}} \cdot \dfrac{1}{\sqrt{N}}$$
The complexity became $\mathcal{O}(N^2)$ which is higher than FFT. I'm really curious of implementing FFT in python, turns out it is straightforward:

```python
import torch

def fft(x):
    X_k = torch.zeros_like(x, dtype=torch.complex64)
    N = x.shape[-1]

    for k in range(N):
        for n in range(N):
            X_k[:, k] += x[:, n] * torch.exp(torch.tensor(-2j * torch.pi * k * n / N))
   
    return X_k

x = torch.randn(3, 8)
X_k = fft(x)
X_k_torch = torch.fft.fft(x)

assert torch.allclose(X_k, X_k_torch)
```

While implementing FFT, I don't realize that I'm not using the derivation of euler's formula; But it's not a problem. I tried to compare my FFT result with torch's FFT, and as expected, it is true.

## FNet Architecture

![](/blog/fnet-implementation/fnet_architecture.png#center)

If you are familiar with transformer architecture, the only thing that differs is the multi head attention sublayer replaced by a fourier sublayer. Inside fourier sublayer, it applies a 2D DFT to its embedding input which can be formulated as follows

$$y = \mathcal{R}(\mathcal{F}_{seq}(\mathcal{F}_h(x)))$$

where $\mathcal{F}_h$ is one 1D DFT along the hidden/embedding dimension

and $\mathcal{F}_{seq}$ is one 1D DFT along the sequence dimension. Then we keep the real part of the result.

The author says that the fourier transform is an effective mechanism for mixing tokens which provides feed-forward sublayers sufficient access to all tokens. If we multiply this encoder block, it's the same as transforming back and forth between time and frequency domain since fourier transform is invertible. Now, let's implement the FNet encoder architecture!

```python
import torch
import torch.nn as nn

class FeedForward(nn.Module):
    def __init__(self, embed_dim, hidden_size):
        super().__init__()
        self.layernorm = nn.LayerNorm(embed_dim)
        self.ff = nn.Sequential(
            nn.Linear(embed_dim, hidden_size),
            nn.GELU(),
            nn.Linear(hidden_size, embed_dim),
            nn.Dropout()
        )
       
    def forward(self, x):
        x = self.layernorm(x)
        return self.ff(x)

class FNetSublayer(nn.Module):
    def __init__(self, embed_dim):
        super().__init__()
        self.layernorm = nn.LayerNorm(embed_dim)

    def forward(self, x):
        x = self.layernorm(x)
        f_h = torch.fft.fft(x, dim=-1)  # embedding dimension
        f_seq = torch.fft.fft(f_h, dim=-2)  # sequence dimension
        return f_seq.real  # "we only keep the real part of the result"

class FNet(nn.Module):
    def __init__(self, n_layers, embed_dim, hidden_size):
        super().__init__()
        self.layers = nn.ModuleList([
            nn.ModuleList(
                [
                    FNetSublayer(embed_dim),
                    FeedForward(embed_dim, hidden_size)
                ]) for _ in range(n_layers)
        ])

    def forward(self, x):
        for fnet, ff in self.layers:
            x = x + fnet(x)  # residual connection
            x = x + ff(x)
        return x


if __name__ == "__main__":
    dummy_data = torch.randn(10, 100, 768)  # Batch x Seq_len x embed_dim
    fnet = FNet(4, 768, 768 * 2)

    out = fnet(dummy_data)
    print(out.shape)
```

In my implementation above, I make 3 classes: `FeedForward`, `FNetSublayer`, and `FNet`. `FeedForward` class corresponds to the feed forward block in the encoder. I use the same sequential model as transformer's feed forward which consists of 2 linear layers, activation function, and dropout. `FNetSublayer` is a class of individual sublayers of fourier transformation. As you can see, I use pre-normalization since that's how I implemented the transformer before and use `torch.fft.ftt()` to do the transformation. As mentioned earlier, the first transformation is along the embedding dimension and the second is along the sequence length dimension. Finally, we take the real result of it. `FNet` class takes care of the $N$ times encoder stack and residual connection. This is very similar with transformer implementation, except we use fourier layer rather than self-attention layer.

That's it! Thank you for reading my blog post. Please let me know if you found something incorrect. 🤗

**References**: \
[1] J. Lee-Thorp, J. Ainslie, I. Eckstein, dan S. Ontanon, “FNet: Mixing Tokens with Fourier Transforms,” Mei 2021, DOI: [10.48550/arXiv.2105.03824](https://doi.org/10.48550/arXiv.2105.03824). \
[2] Discrete Fourier transform. (2023, January 23). In _Wikipedia_. https://en.wikipedia.org/wiki/Discrete_Fourier_transform
