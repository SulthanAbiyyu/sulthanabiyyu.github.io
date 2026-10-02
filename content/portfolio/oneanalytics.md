---
title: "OneAnalytics"
subtitle: "Internal analytics and dashboarding platform"
summary: "A multi-tenant Plotly Dash platform serving 30+ dashboards across the organization, with SSO, row-level access control, and a two-tier cache over BigQuery."
group: work
weight: 10
role: "Led development"
period: "2025 to present"
highlight: "50+ daily users, manager level and above"
stack: ["Python", "Plotly Dash", "BigQuery", "Docker", "GCP"]
---

## The problem

Getting a number meant filing a request and waiting for someone in the data team
to run it. That cost twice: the person who needed the number lost a day, and the
analyst lost an afternoon to work that was essentially lookup.

Worse, it made numbers scarce. When a metric is expensive to obtain, people stop
asking, and decisions quietly get made on memory instead.

The obvious fix is "build a dashboard". The real problem is that one dashboard
solves one department's question, and the next department wants a different one.
What was needed was not a dashboard but a platform that makes dashboards cheap
to add.

## What I built

A modular analytics platform in **Plotly Dash**, now carrying **30+ dashboards**
across directorates, all behind one login, one navigation shell, and one visual
language.

**A registry instead of a codebase.** Every dashboard registers itself in a
central registry that drives routing, navigation, and permissions. Adding a
dashboard means adding a module and an entry, not editing the shell. A shared
layout wrapper keeps every page visually consistent whoever builds it, which
matters once you are past the first handful.

**Access control that survives reorganization.** Authentication runs through
company SSO, and authorization through a rules engine backed by a declarative
RBAC file. Permissions resolve per user down to what they are allowed to see
inside a dashboard, not just which dashboards they can open. The rules
hot-reload from disk, so an access change takes effect without a restart or a
deploy. Finance and Sales genuinely should not see each other's numbers, and
that constraint had to be cheap to adjust.

**Two-tier caching over BigQuery.** Dashboards read from BigQuery, which is fast
but billed per query and far too slow to hit on every interaction. Each data
source is cached in process memory and again on disk, with a refresh service
that can be triggered on a schedule or manually. The result is that a page
interaction costs nothing, while the data behind it stays on a predictable
refresh cycle.

**Deployment built for a small team.** The container image carries dependencies
only and mounts application code at runtime, so shipping a change is a reload
rather than a rebuild. Reloads are zero-downtime, and staging runs the same
compose setup on its own port. When you are the person who gets called if the
dashboard is down during a board meeting, this part stops being incidental.

There is also an embed mode that renders a dashboard canvas without the
navigation shell, so individual views can be dropped into other internal tools
instead of forcing people to come to the platform.

## Where it landed

The platform is used **daily by 50+ users at manager level and above**, spanning
the Board of Directors, Finance, Sales, and other directorates, for both routine
monitoring and reporting.

The engineering was the easy half. The interesting half was organizational:
finding out which metrics different directorates actually argue about, deciding
whose definition wins when two departments compute the same word differently,
and making the agreed numbers the ones that are easiest to find.

The outcome I did not expect: once the numbers became cheap to get, meetings
changed. Arguments that used to be about whose figure was right became arguments
about what to do, which is the argument worth having.
