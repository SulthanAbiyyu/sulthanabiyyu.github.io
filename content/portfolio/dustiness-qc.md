---
title: "Automatic dustiness powder QC"
subtitle: "Computer vision for quality control"
summary: "Video analysis that measures the dust plume from falling powder, turning a subjective QC judgment into a number."
group: work
weight: 30
role: "Built end to end"
period: "2025"
highlight: "100+ samples measured daily"
stack: ["Computer Vision", "Segmentation", "Python"]
---

## The problem

Dustiness is a real quality attribute of powder products: how much of it goes
airborne when handled. It was being judged by eye.

Judging by eye has two failure modes that compound. It is inconsistent between
inspectors, and it is unrecordable: you cannot plot an opinion over time, so you
cannot tell whether a process change made things better or worse.

## What I built

An automated quality-control system that analyzes video footage of a powder
sample being dropped, segments the resulting dust plume, and turns it into a
measurement.

The QC team now runs it on **100+ powder samples daily**.

## Where it landed

The part I am most pleased with is not the model. It is that the measurement
became a **new quantitative QC standard** at the company.

Dustiness used to be a sentence in a report. Now it is a number that can be
tracked, compared between batches, set as a threshold, and argued about with
evidence. The computer vision was the means; replacing a subjective standard
with an objective one was the actual deliverable.
