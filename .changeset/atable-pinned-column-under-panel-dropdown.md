---
'@stonecrop/atable': patch
---

A dropdown opened in an expanded row's panel now shows over the pinned columns of the rows below it (#576). Before, where the list crossed a pinned column, that column's cells in the rows below were drawn over it and hid its options, such as most of Unit Price's currency list with the Product column of an order's lines pinned. The panel is now lifted above the pinned cells while something in it has focus.
