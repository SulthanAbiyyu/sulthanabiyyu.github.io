---
title: "Receipt & invoice recognition"
subtitle: "Hybrid OCR and LLM document parsing"
summary: "Automated extraction from receipts and invoices, built to run on edge devices."
group: work
weight: 40
role: "AI Engineer, project based"
org: "Vobis.io"
period: "Jan — Mar 2025"
highlight: "92% accuracy on internal benchmarks"
stack: ["OCR", "LLM", "Python", "Edge deployment"]
---

## The problem

Receipts and invoices are deceptively hard. The text is often legible to OCR
while the *structure* is not: which number is the total, which line is tax,
which column belongs to which item. Pure OCR reads characters but has no model
of a document; pure LLM reasoning is expensive and hallucinates digits.

## What I built

A hybrid system that gives each component the job it is actually good at:

- **Native OCR** for character recognition, where it is fast, cheap, and more
  accurate than a language model.
- **LLM-based parsing** for layout reasoning and field assignment — deciding
  what the extracted text *means*.

It reached **92% accuracy** on internal benchmarks, and was optimized for
deployment on edge devices rather than assuming a server round trip.

## Also built here

An LLM-powered chatbot that personalizes responses using hybrid RAG retrieval —
semantic and keyword search combined — so answers stay grounded in the specific
user's information rather than general knowledge.
