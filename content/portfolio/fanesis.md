---
title: "Fanesis (Facial Network Analysis)"
date: 2023-10-29T16:30:54+07:00
draft: false
weight: 1
cover:
  image: "img in static"
---

## Introduction

![diagram](https://raw.githubusercontent.com/SulthanAbiyyu/fanesis/main/img/diagram.png)

Fanesis is a Facial Network Analysis tool that analyzes the faces and behaviors of individuals in a group and creates a visual representation of their relationships. Fanesis uses computer vision and machine learning techniques to detect the emotions and interactions of each individual. It then creates two types of associations: group-based and emotion-based. Group-based associations show how individuals are connected within the group, such as who knows whom, who is close to whom, and who is influential to whom. Emotion-based associations show how individuals feel about each other, such as who likes whom, who dislikes whom, and who is neutral to whom. Fanesis provides insights into the dynamics and characteristics of the group, which can be useful for various applications such as social network analysis, group psychology, and team building.

![gba](https://raw.githubusercontent.com/SulthanAbiyyu/fanesis/main/img/gba.png)
Here is an example output from a very small dataset of images. We are presenting the results from a different embedding model. This allows us to analyze which person is more popular in the known dataset.

## Usage

First of all, we have to install the library first

```bash
pip install fanesis
```

To use it, there's to approach that we could do. First, we can utilize all individual classes. This approach will give you much more control over the available parameters to tweak on. The other approach is to use the `FanesisPipeline` which give you less custom option but easier to use because it's pretty straight forward.

Here is the example of using the first approach

```python
from fanesis import Individualize, Grouping, Visualize

imgs_path = "./data/"
base_path = "./output/"
output_path = "./output/output/"

i = Individualize(imgs_path, base_path)
i.run()

g = Grouping(output_path)
df = g.run()

v = Visualize(output_path)
v.visualize(df)
```

Then, here is how to use the `FanesisPipeline`:

```python
from fanesis import FanesisPipeline

imgs_path = "./data/"
base_path = "./output/"

pipeline = FanesisPipeline()
pipeline(imgs_path, base_path)
```

Both option works well depends of the quality of the face embedding. From the first approach, here is the list of available parameters:

1. `Individualize`

   - `imgs_path`: The path of images dataset
   - `base_path`: The base path for outputting the result
   - `file_type`: The image file type. Currently only supports 1 kind file type per run. Default = `jpg`
   - `embed_model`: The embedding model. Supports all embedding model that provided by [deepface|deepface](https://github.com/serengil/deepface). Default = `Facenet`
   - `verbose`: verbose. Default = `True`

2. `Grouping`

   - `output_path`: the output path from the base model

3. `Visualize`
   - `output_path`: the output path from the base model

`Visualize` will be much more tweakable on the next release. I will add support for facenet-pytorch embedding model since it gives much more diverse and accurate embedding.
