---
title: "Rec2Slide"
subtitle: "Video recording → PDF slides"
summary: "Reconstructs a slide deck as a PDF from a screen recording. Published on PyPI."
group: lab
weight: 40
period: "2024"
highlight: "pip install rec2slide"
stack: ["Python", "OpenCV", "PyPI"]
links:
  - name: "Code"
    url: "https://github.com/SulthanAbiyyu/rec2slide"
  - name: "PyPI"
    url: "https://pypi.org/project/rec2slide/"
---

You attended the lecture. You have the recording. You do not have the slides.

Rec2Slide reconstructs them:

1. Sample every *n*-th frame of the video.
2. Compare each frame against the previous one with a similarity score.
3. If the difference crosses a threshold, treat it as a new distinct slide.
4. Assemble the distinct slides into a PDF.

Both knobs are exposed, because the right values depend on the recording. A
small interval is slower but catches quick transitions; an aggressive threshold
finds more slides at the cost of duplicates from animations and cursor movement.

```python
from rec2slide import Engine, Config

config = Config(interval=20, threshold=1000.0, score="mse")
Engine(config).run("lecture.mp4", "lecture.pdf")
```

Small, finished, and actually published, which is rarer in my GitHub account
than I would like to admit.
