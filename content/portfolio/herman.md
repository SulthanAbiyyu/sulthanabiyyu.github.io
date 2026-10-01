---
title: "Herman"
subtitle: "Indonesian JSON-mode dataset"
summary: "An Indonesian adaptation of the Hermes function-calling dataset, for training models to emit reliable structured output."
group: lab
weight: 20
period: "2024"
highlight: "Published dataset on HuggingFace"
stack: ["Dataset Creation", "SFT", "JSON Schema"]
links:
  - name: "Code"
    url: "https://github.com/SulthanAbiyyu/herman-json-mode-indo"
  - name: "Dataset"
    url: "https://huggingface.co/datasets/SulthanAbiyyu/herman-json-mode"
---

An Indonesian adaptation of NousResearch's **Hermes** function-calling dataset,
built for supervised fine-tuning on single-turn JSON mode. The target schema is
passed in the system prompt between `<schema>` tags, and the model learns to
return output that conforms to it.

## Why this one matters more than it looks

Structured output is the unglamorous thing that decides whether a language model
can be wired into real software at all. A model that writes beautiful prose but
cannot reliably close a JSON object is a demo. A model that returns valid,
schema-conforming output every time is a component you can build on.

English-language models got this capability early, through datasets like Hermes.
Indonesian models mostly did not, which quietly limits what anyone can build
with them. Translating and adapting the dataset was the cheapest useful fix I
could think of.

Pairs naturally with [Anak Baik]({{< ref "anak-baik" >}}): one makes Indonesian
models safer to deploy, the other makes them possible to deploy.
