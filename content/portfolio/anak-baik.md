---
title: "Anak Baik"
subtitle: "A low-cost approach to curating Indonesian ethical and unethical instructions"
summary: "An Indonesian dataset for teaching language models to tell ethical instructions from unethical ones. Published at SEALP 2025."
group: research
weight: 10
role: "First author"
org: "SEALP 2025, ACL Anthology"
period: "January 2025"
highlight: "Peer-reviewed, pp. 52-62"
stack: ["Language Modeling", "Dataset Creation", "LoRA"]
links:
  - name: "Paper"
    url: "https://aclanthology.org/2025.sealp-1.5/"
  - name: "Dataset"
    url: "https://huggingface.co/datasets/SulthanAbiyyu/anak-baik"
  - name: "Model"
    url: "https://huggingface.co/SulthanAbiyyu/anak-baik-7b"
  - name: "Code"
    url: "https://github.com/SulthanAbiyyu/anak-baik-code"
---

*Sulthan Abiyyu Hakim, Rizal Setya Perdana, Tirana Noor Fatyanosa.*
*Proceedings of the Second Workshop in South East Asian Language Processing,
Association for Computational Linguistics, January 2025.*

## The gap

Indonesian LLMs are bad at distinguishing ethical instructions from unethical
ones, and there was no Indonesian dataset to fix that. Alignment resources are
overwhelmingly English, and what a model learns about harm in English does not
transfer cleanly into another language and culture.

## The dataset

*Anak Baik* means "good boy". The name is the thesis: a well-behaved child
refrains from harmful action, and that is the behavior we want a model to learn.

It is a set of Indonesian instruction-response pairs for supervised fine-tuning
that deliberately includes **both ethical and unethical responses**. The point is
to let a model learn the distinction, rather than memorize a list of refusal
phrases. A model that has only ever seen refusals learns to refuse, not to
reason.

## Results

Fine-tuning **Komodo** and **Cendol** with LoRA produced significant improvement
in ethical decision-making, validated with substantial gains in BLEU and ROUGE
against socially responsible reference behavior.

The constraint that shaped the whole project was cost. Ethical alignment work for
Indonesian cannot depend on a frontier-lab budget, or it will not happen at all.
LoRA on existing open models, with a carefully curated dataset instead of a huge
one, was the design that made it feasible.
