---
title: "Marzuki-7B"
subtitle: "An Indonesian LLM, end to end"
summary: "Continued pretraining, SFT, and DPO alignment on top of Mistral-7B. Three checkpoints published."
group: lab
weight: 10
period: "2023 to 2024"
highlight: "3 models on HuggingFace"
stack: ["PyTorch", "LoRA", "DPO", "HuggingFace"]
links:
  - name: "Code"
    url: "https://github.com/SulthanAbiyyu/Marzuki-7B"
  - name: "Base"
    url: "https://huggingface.co/SulthanAbiyyu/marzuki-7B-v2-base"
  - name: "Instruct"
    url: "https://huggingface.co/SulthanAbiyyu/marzuki-7B-v2-instruct"
  - name: "DPO"
    url: "https://huggingface.co/SulthanAbiyyu/marzuki-7B-v2-dpo"
---

A full language model training pipeline built on **Mistral-7B**, taken through
every stage rather than stopping at fine-tuning:

1. **Continued pretraining** on Indonesian Wikipedia, to move the base model's
   distribution toward Indonesian.
2. **Supervised fine-tuning** on translated Alpaca and OASST, for
   instruction-following.
3. **DPO alignment** on Wikipedia-derived preference data.

All three checkpoints are published (base, instruct, and aligned), so the
effect of each stage can be inspected separately instead of taken on trust.

## What I got out of it

This is the project where I learned what end-to-end LLM training actually costs
you, and the answer is mostly patience and disk space. The training code is the
small part. The real work is data: translating it, cleaning it, discovering that
your preference pairs are subtly degenerate, and doing it again.

It is also where the thinking behind [Anak Baik]({{< ref "anak-baik" >}})
started. Building an Indonesian model and then asking what it would refuse to do
turned out to be a short path to a research question.
