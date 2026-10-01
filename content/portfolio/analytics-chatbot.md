---
title: "Self-service analytics chatbot"
subtitle: "Data-grounded internal assistant"
summary: "An LLM that answers business questions directly against company data, grounded hard enough to be trusted."
group: work
weight: 20
role: "Led development"
org: "PT Lautan Natural Krimerindo"
period: "2025"
highlight: "Time-to-insight: 25 hours → 3 minutes"
stack: ["LLM", "RAG", "Python", "SQL"]
---

## The problem

Even with dashboards, plenty of questions fall outside what anyone pre-built.
Those went through the manual request process, and the round trip averaged about
**25 hours**.

## What I built

An internal chatbot that answers business questions against company data
directly, so the person asking does not need to know where the data lives or how
to query it.

The hard problem here was never fluency. It was grounding. An analytics chatbot
that is confidently wrong is strictly worse than no chatbot at all — it produces
numbers that look authoritative, travel into decks, and get acted on. A
dashboard that is down is obviously down; a chatbot that is subtly wrong is
invisible.

So most of the work went into two things:

- **Retrieval** — making sure the model is looking at the right slice of data
  before it says anything.
- **Constraint** — limiting what the model is allowed to assert, and making it
  decline rather than guess when the data does not support an answer.

## Where it landed

**Time-to-insight dropped from 25 hours to 3 minutes.**

The number I actually watch, though, is how often it declines to answer. A
system like this earns trust by being boring and reliable, not by being
impressive, and the refusals are what make the answers worth something.
