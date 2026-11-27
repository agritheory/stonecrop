---
'@stonecrop/atable': patch
---

A dropdown opened in an expanded row's panel now shows over the pinned columns of the rows below it (#576). Before, where the list crossed a pinned column, that column's cells in the rows below were drawn over it and hid its options, such as most of Unit Price's currency list with the Product column of an order's lines pinned. Pinned cells now sit just above the table's own layers and below dropdown lists, so a list is drawn over them wherever it was opened: in a row's panel, above the table, or left open when the window loses focus.
