---
'@stonecrop/atable': patch
'@stonecrop/schema': patch
---

A table that can take new rows (`addable`) now keeps offering "Add row" once it has rows (#561). Before, Add row lived only in the empty-state row, so after the first row was added it was gone, and a table without row actions had no way to take a second one. ATable now shows an Add row line below its rows, drawn as a table row rather than a button and kept out of row navigation. It shows on the last page, where a row added at the end lands (following the new row to a new page when the last one is full), and not while filters are set. Clicking it clears a sort, so the new row lands next to it. Hosts can replace it through the new `add` slot. A form that can't edit the record still turns it off.
