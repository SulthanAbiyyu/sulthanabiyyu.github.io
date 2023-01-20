---
title: "Unboxing Batch Gradient Descent"
description: "blablbabalab"
date: 2022-12-14T10:02:36+07:00
draft: false
weight: 1
cover:
  image: "img in static"
---

If you familiar with linear regression, we need to define the slope and intercept to make the regression. What if we want to fit our linear regression model to numerical data? How do we get the best combination of slope and intercept with the least errors among the data? One of the answers is through gradient descent.

Gradient descent may be one of the most important concepts that machine learning practitioners or enthusiasts must understand. Gradient descent has some different approaches, but they all have the same concept of optimising. In this article, I want to explain the math behind batch gradient descent as simple as possible.

This is the first series of UNBOXING and the first time I write in medium. In this series, I would like to try to explain any machine learning related as simple as possible without losing any essential meaning.

## Linear Regression and Cost Function

![](/blog/batch-gradient-descent/1.png#center)

Linear Regression is one of the simplest machine learning algorithms out there. As the name, this algorithm means to solve regression problems. The simple linear regression or also known as univariate linear regression is a linear regression with one variable or a feature only.

Suppose that theta 0 is intercept and theta 1 is the slope, we will get linear regression's formula below:

![](/blog/batch-gradient-descent/2.png#center)

Linear Regression's FormulaIntercept basically is the expected value Y if X is 0. In easy terms, an intercept is the one that determines our starting point where the function crosses the y-axis. Meanwhile, the slope is the one that responsible for how steep our model will be.

Now, we will give numerical data in the plot.

![](/blog/batch-gradient-descent/3.png#center)

As a human, we can easily say how we must draw the linear regression model that has the least error according to the data. But can we say what is the most optimal theta 0 and theta 1? I doubt that. We need a system that is able to try and optimize the best parameter that we can achieve.

Let me introduce you to the cost function. A cost function is a measure of how much error that our model made. There's various form of cost function available out there and for now, I will stick to Mean Squared Error (MSE). The idea is to minimize the cost function with a minimal amount of brute-forcing the parameter.

## Let's Visualize Cost Function!

Before we jump into the visualization, I want to explain a little bit about our cost function, MSE. As the name (Mean Squared Error) means that we square the error and get the mean from the entire dataset. Error basically is the difference between retained value and true value. Note that retained value is our model hypothesis:

![](/blog/batch-gradient-descent/4.png#center)

Mean Squared Error formula is:

![](/blog/batch-gradient-descent/5.png#center)

Mean Squared Error FormulaMaybe you'll wonder why we divide with 2m instead of m as the number of data points. The answer is because later in gradient descent's algorithm, we'll take a partial derivative with respect to x and it will be cancelled. So, it won't take any effect and will make our derivative much more cleaner.

Enough with the MSE, now let's try to plot it. Suppose that theta 0 is zero, because I don't want to plot in 3d. With that being said, let's say that we have 3 data points [(1,1), (2,2), (3,3), (4,4)].

![](/blog/batch-gradient-descent/6.png#center)

If Theta 1 equals 1, then

![](/blog/batch-gradient-descent/7.png#center)
![](/blog/batch-gradient-descent/8.png#center)

If Theta 1 equals 0.5 and with the same way of calculating, then

![](/blog/batch-gradient-descent/9.png#center)
![](/blog/batch-gradient-descent/10.png#center)

If Theta 1 equals 1.5, then

![](/blog/batch-gradient-descent/11.png#center)
If we keep doing this, our final cost function will look like this:

![](/blog/batch-gradient-descent/12.png#center)

Notice that the minimal cost function is when theta 1 equals 1. We can confirm that it is the fittest model according to the data. Finding the minimal cost function is our objective. Let's say that our cost function is a hill and theta 1 is a guy. What we want is the guy to walk down from the hill to the valley right? This concept is called gradient descent.

## How do we "walk" down the hill?

As I mentioned earlier, gradient descent basically means walking down the hill mathematically. The idea is to start at a random position (random thetas). Then, we look around to find where is the way down from the hill (local minima). After that, we will walk as far as we are confident that our path is not upwards anymore (as far as the learning rate or alpha). We don't want to be reckless, the closer our position with the lowest ground the smaller steps that we take. We will repeat this process until we reach the bottom of the hill.

Now the question how exactly do we look around for lower ground with math? Well, we have something that is called slope. Then, we have a new question. How do we determine the distance of "walking confidently"? Now, let's see gradient descent's algorithm:

![](/blog/batch-gradient-descent/13.png#center)

If you familiar with derivatives, maybe you can guess immediately that the derivative is the slope for "looking around" the hills. We multiply the slope with the learning rate (in this case the alpha). Learning rate is a constant that is responsible to determine how far should we go constantly. Because we multiply it with a slope and the slope is constantly changing, so our steps should be different depending on how far are we with the lowest ground. As I mentioned earlier we don't want to be reckless, the closer our position with the lowest ground the smaller steps that we take. This means that the more plateau or the smaller the slope, then the smaller the step that we took.

Now, how do we walk in the correct direction?

![](/blog/batch-gradient-descent/14.png#center)

Let's say that our position is at the blue dot. Then we take the slope of the current position. Without knowing the exact value, we know that it must be negative right? And the learning rate is always positive. It means that:

![](/blog/batch-gradient-descent/15.png#center)

In other words, we add our current position with our step. So, we are walking to the right direction. It is working vice versa. Let's say that our position is at the red dot. Then because the slope is positive, our step will be to the left.

![](/blog/batch-gradient-descent/16.png#center)

## Connecting the Dots

We already have a gradient descent algorithm, linear regression hypothesis, and cost function concept. It's time to bring it up together.

First of all, we will pick a random position (random thetas). Then we calculate the slope of our MSE and multiply it with alpha. Now, our theta 0 is no longer equal to zero. So we need to perform partial derivative:

![](/blog/batch-gradient-descent/17.png#center)

After that, we update our new position with the new thetas. Note that we must update it simultaneously or we will get a logical error. After that, we will repeat this process until we reach local minima (slope equals zero). What if our cost function has multiple minima? Then we will end up in the closest local minima. That's why gradient descent performs best in a convex cost function or a bowl-shaped function which only have one local minima as a global minima. In each step, we will calculate the MSE with the whole training dataset, that's why this type of gradient descent is named batch gradient descent.

That's it! Now you understand what's under the hood of batch gradient descent. I hope that you enjoy our unboxing session for today. Any feedback and correction are appreciated. Thank you!
