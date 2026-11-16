---
'@stonecrop/atable': patch
'@stonecrop/schema': patch
'@stonecrop/desktop': patch
---

A column's `cellComponent` is now drawn inside the table cell and receives the cell's value as `value` and the column's `cellComponentProps`, as the schema says (#510). Before, ATable drew the component in place of the cell and passed it neither, so a custom status chip showed up empty and uncoloured. The component also gets the table's `store` and the cell's `rowIndex` and `colIndex`, so a cell that acts on its row can still find it. Desktop's list link no longer draws its own cell.
