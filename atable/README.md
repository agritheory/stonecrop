# ATable

## User Guide

<details><summary>Key navigation</summary>

| Key(s)        | Function    |
| :------------ | :--------   |
| Enter         | `downCell`  |
| Tab           | `nextCell`  |
| Shift + Enter | `upCell`    |
| Shift+ Tab    | `prevCell`  |
| &#8592;       | `prevCell`  |
| &#8593;       | `upCell`    |
| &#8594;       | `nextCell`  |
| &#8595;       | `downCell`  |
| Home          | `lastCell`  |
| End           | `firstCell` |

</details>

## Column API

The primary API for ATable is the column object.

- `title`: String; optional
- `name`: String; required (a reference to the column that must follow rules for valid JS variable naming)
- `type`: String; optional (a valid data types, full list [below](#column-data-types))
- `align`: String; optional (one of `left`, `right` or `center`; defaults to `center`)
- `edit`: Boolean; optional (indicates if the field is editable; defaults to `false`)
- `width`: String; optional (used to indicate the width of the cell; defaults to `40ch`)
- `mask`: Function; optional (a custom mask for the field, several are provided with types by default)
- `options`: Function; optional (used with `Select`, `Currency`, and `Quantity` fields)

```js
{
  title: 'Batch Name',
  name: 'name',
  type: 'Data',
  align: 'right',
  edit: false,
},
{
  title: 'Species',
  name: 'species',
  type: 'Select',
  align: 'left',
  edit: true,
  width: '30ch',
  required: true,
  options: () => ['Rainbow Trout', 'Steelhead', 'Golden Trout', 'Pacific Salmon']
},
{
  title: 'Date',
  name: 'set_date',
  type: 'Date',
  align: 'center',
  edit: true,
  width: '30ch',
  mask: value => `${value}+/-`,
}
```

## Column Data Types

`v0.1`

- Data/ Text (unformatted text)
- Number (can be backed by int, decimal or float)
- Hyperlink
- Currency
- Quantity
- Date
- Date Range
- Select / Datalist / Combobox

`v0.2`

- Rich Text Editor
- Image
- File
- Diagram
