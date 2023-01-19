---
title: "The Long Journey of Solving Gradient Problem"
date: 2023-01-19T20:43:03+07:00
draft: false
math: true
weight: 1
cover:
  image: "/blog/gradient-problem/banner.png"
---

## Introduction

In neural networks, we use gradients to examine and tweak our weight so it can converge and hopefully have a good general performance. Neural networks were invented around 1944 by Warren McCullough and Walter Pitts. But why is it just trending recently? In the early 2000s, deep neural networks were considered as abandoned technology because they tend to have unstable gradients. This problem is known as vanishing gradient or the opposite, exploding gradient problem. After 10 years of uncertain cause, Xavier Glorot and Yoshua Bengio finally found a few suspects. What are the causes? Let's find out!

## What is the Vanishing and Exploding Gradient Problem?

In the neural network training phase, especially with the backpropagation algorithm, we use the gradient descent principle to get the most minimal cost function possible. If you are not familiar with gradient descent, you can check my other article about [gradient descent](https://sulthanabiyyu.medium.com/unboxing-batch-gradient-descent-705502545890).

In linear regression, we can guarantee that our cost function will always converge because our cost function is convex. One and only problem in linear regression cases is if we set the learning rate too big. It will jump around and never touch slope equals to zero. If the learning rate is too small, it will eventually converge but it will take a lot of time. So, what about neural networks?
There's a problem called the vanishing gradient problem (we will talk about exploding gradient problem later). The vanishing gradient problem is when our gradient is getting smaller and smaller. It will have a similar effect as in linear regression case if we have a small learning rate. The difference is, it won't converge because it is nearly zero changes between learning batch. What makes things worse is that neural networks that are powerful enough to solve a modern problem require a deep layer (more than 2) and this numerous layer makes the gradient smaller and smaller due to small partial derivative operation.
What about exploding gradient problem? Basically, it is the opposite of the vanishing gradient problem. It is similar to linear regression with a big learning rate. It will jump around and never converge. The difference is, in neural networks, the gradient will "explode". Getting bigger and bigger and never going to learn anything.

## How is this happen?

Earlier, I mention that Xavier Glorot and Yoshua Bengio found a few suspects. The suspect is a combination of saturating activation function and weight initialization technique.

![](img1.png)

Logistic Function; Source: WikipediaAs we know, the logistic or sigmoid function is widely used in a lot of deep neural network models. When we have a large input in any direction, the function will saturate (Tends to asymptote the horizontal axis). If we have 6 as the input, we will get meaningless changes if we have 1000 as the input.
Various known weight initialization techniques back then also lead to several problems. Zero initialization will lead to a symmetry problem where our neural network becomes a linear model. Random but small initialization leads to vanishing gradients because when we multiply our partial derivative according to the chain rule, we will get a really small gradient and will keep getting smaller as we propagate. Random but large initialization leads to exploding gradient because the output variance of each layer is much bigger than the input's variance. The problem is, there was no "just right" initialization.

## Glorot and He Initialization

Glorot and Bengio purpose that the variance of the outputs of each layer needs to be equal to the variance of its inputs in forward direction. Meanwhile, in the reverse direction (backpropagate) we need the gradients to have an equal variance between layers. We can't actually guarantee that we can get both conditions. But, we have a good compromise that the weights of each layer must get a random initialization according to glorot initialization equation
This initialization works well in practice, especially when dealing with logistic/sigmoid, tanh, softmax activation functions. What about another type of activation function? A researcher named Kaiming He used a similar strategy with Glorot's. The difference is only the variance scale. He initialization is proven best when dealing with the ReLU activation function and its variants.

## Non-Saturating Functions

Poor choice of activation function could lead to unreliable gradient and results. In some cases, we need to use a non-saturating function like ReLU. But, ReLU suffers from a problem called dying ReLU. This happens because in some cases after the weights get tweaked, it leads to getting a negative result over and over. Meanwhile, in ReLU, if we get negative output, it will always return 0, that's why it is called dying ReLU. We have Leaky ReLU where we have additional hyperparameter alpha for setting how leaky is our function is (how steep is the third quadrant angle). With this "leak" we can ensure ReLU eventually "wake up" again. There are more leaky ReLU variants, Randomized Leaky ReLU (RReLU) where alpha is randomly initialized and fixed to an average value during testing. Parametric Leaky ReLU (PReLU) where alpha is being a trainable parameter that adjusted during backpropagation. Another ReLU variant is ELU or exponential linear unit. ELU has outperformed all Leaky ReLU variants. As the name, ELU uses an exponential function and is much smoother than other ReLU variants that have been explained earlier. This smoothness tends to speed up gradient descent. The only drawback of ELU is slow computation due to exponential function. But it's even because of fast convergence. There is an ELU variant that is interesting, named SELU (Scaled ELU). As the name suggests, it will self-normalize each output so that each layer will have a mean around 0 and a standard deviation of 1. But, there are a lot of requirements so that SELU can guarantee self-normalize:

1. Input must be standardized
2. We have to initialize out weights with LeCun's normal initialization
3. Our networks must be a sequential model (wide model not allowed)
4. All layers must be dense layers.

## Batch Normalization

This technique can reduce the risk of gradient problems significantly. Batch normalization purposed by Sergey Ioffe and Christian Szegedy that makes a set of operations that normalize each input, then scale and shift accordingly. So, we get a new parameter, one vector is for scaling and the other one for shifting. The model will learn the optimal scale of each layer while training. One of the good things about batch normalization is if we put it on the first layer, it means that we don't need to normalize our data.
If we want to make predictions, especially for individual instances (not in batches), we get a new problem, which we can't compute the input's mean and standard deviation. If we have too small data for predictions, our instances will be identically distributed and be an unreliable model. We actually can use our last mean and standard deviation from training, but in most cases, the implementation like in keras uses moving averages. With this being said, it means that we have 2 trainable parameters (scale vector and shift vector) and 2 non-trainable parameters (mean and standard deviation) that are estimated with EMA.
With batch normalization, we were able to reduce gradients problems significantly. We can even use a saturated activation function, use a bigger learning rate for speeding up the training process, and neural networks get much more insensitive with random weight initialization.

## Conclusion

Neural networks have been through a lot of problems, from all of the problems, researchers have been discovering the solution 1 by 1. What I would like to say is, it is just amazing to see a dying technology have arisen from its grave and be one of the hottest technology today. That's all from me and thank you for reading!
