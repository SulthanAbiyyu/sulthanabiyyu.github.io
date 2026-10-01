---
title: "Artinya"
subtitle: "An LLM translation pipeline"
summary: "Translation that tries to preserve tone, nuance, and cultural meaning — then evaluates whether it actually did."
group: lab
weight: 30
period: "2024"
stack: ["LLM", "Python", "Structured output"]
links:
  - name: "Code"
    url: "https://github.com/SulthanAbiyyu/artinya"
---

Most machine translation optimizes for meaning and drops everything else — tone,
register, irony, the cultural weight a phrase carries. Artinya is an attempt to
keep those, using a three-stage pipeline:

1. **Describe** — analyze the source text for style, tone, intent, cultural
   meaning, and symbolism.
2. **Translate** — translate *with that description as context*, so the model is
   working from an explicit account of what it needs to preserve.
3. **Evaluate** — score the output on accuracy, clarity, and preservation of
   style, and re-translate when it falls short.

## The honest part

The README keeps a running list of things I am genuinely unsure about, and I
think that list is the most valuable thing in the repository:

- How good is the translation, really?
- How expensive is it — how many API calls, how often does it re-translate?
- How often do the models fail to produce valid structured output?
- **Does the whole pipeline actually beat a plain translation call?**

That last one is the real experiment. A three-stage pipeline is more elaborate
than a single prompt, and more elaborate is not the same as better. The ablation
is the point of the project, not an afterthought to it — and I would rather
publish the question than pretend I had already answered it.
