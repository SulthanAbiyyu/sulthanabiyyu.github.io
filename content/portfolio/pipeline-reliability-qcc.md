---
title: "Data pipeline reliability"
subtitle: "1st Place, Quality Control Circle"
summary: "Took a critical pipeline from recurring SLA breaches to full compliance, and won the group-level QCC."
group: work
weight: 50
role: "Continuous improvement project"
org: "Lautan Luas Tbk. & PT Lautan Natural Krimerindo"
period: "2025"
highlight: "100% SLA compliance on ~27K runs per week"
stack: ["Data Engineering", "Monitoring", "Process design"]
---

## The problem

A critical data pipeline running roughly **27,000 executions per week** kept
breaching its SLA, with delays reaching **6 hours**. Downstream, that meant
people making the morning's decisions on yesterday's numbers without knowing it.

Recurring failure at that volume is rarely one bug. It is usually a system that
has no way of telling you it is unwell.

## What I changed

Three things, in order of how much they mattered:

1. **Monitoring** — making failures visible immediately rather than discovered
   downstream by a confused user.
2. **Error handling** — so a single bad record degrades one row instead of
   taking down a run.
3. **Operational process** — who gets told, what they do, and how a failed run
   gets recovered without a person reconstructing state by hand.

## Where it landed

**100% SLA compliance.** The delays stopped.

The project took **1st Place** at the company level, then went on to take **1st
Place at the Lautan Luas Group level**.
