---
'@stonecrop/atable': patch
---

A quantity or currency cell being edited now shows only the cell's own focus ring: its picker handle no longer draws the browser's ring inside it. The rule removing that ring was dropped by the browser, and printed a warning in every app's production build.
