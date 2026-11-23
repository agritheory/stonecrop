---
'@stonecrop/atable': patch
---

A table now follows changes to its `config` and `schema` while it is shown (#564). When a form turns read-only, its tables lock too: their cells stop being editable and Add row goes away. When the form turns editable again, the tables unlock. A column width the user dragged stays as it was.
