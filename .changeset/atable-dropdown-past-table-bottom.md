---
'@stonecrop/atable': patch
---

A dropdown opened in a row's expanded panel near the table's bottom edge now shows its whole list. The table clipped everything drawn past its edges, so on a table with one row a link field's or currency picker's list stopped at the table's bottom and its lower options were hidden (#522). The table now clips only sideways.
