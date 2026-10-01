---
title: "Kuantil"
subtitle: "Quant finance modules"
summary: "Option pricing and quant primitives as small, tested Python modules."
group: lab
weight: 60
period: "2026"
stack: ["Python", "pytest", "uv"]
links:
  - name: "Code"
    url: "https://github.com/SulthanAbiyyu/kuantil"
---

Black-Scholes and friends, packaged as small, easy-to-use Python modules with a
real test suite.

```python
from kuantil.pricing import black_scholes_call

call = black_scholes_call(spot=100, strike=100, risk_free=0.05, sigma=0.2, expiry=1.0)
```

## Why

It started during a financial management course in my Master of Management, with
the thought: *is it fun if I turn this into a module?*

It was. It is also the most reliable way I know to find out whether I actually
understood a formula — a derivation can be nodded along to, but a function has
to produce the right number, and a test has to agree. Several things I was sure
I understood did not survive that.

This is the newest thing here, and it points somewhere different from the rest:
quantitative finance sitting next to the ML and data work.
