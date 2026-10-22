---
'@stonecrop/desktop': minor
---

`present()` takes `replacesDrawer: true` to let a preview take the slot drawer's place. The drawer is hidden rather than closed, so the slot keeps its state, and closing the preview shows it again. The preview pane is resizable: drag, arrow keys or double-click on its left edge, with the width kept for the session.
