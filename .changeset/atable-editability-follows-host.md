---
'@stonecrop/atable': patch
---

A table now follows a new `config` or `schema` handed to it while it is shown (#564). When a form turns read-only, its tables lock too: their cells stop being editable and Add row goes away. When the form turns editable again, the tables unlock. This holds after columns were added, hidden, reordered or resized, and for columns the host hands over itself, since each cell now reads its column from the table rather than keeping the one it was drawn with. Changes made in place to the schema objects already handed over are not followed; hand over a new schema instead, as AForm does.
