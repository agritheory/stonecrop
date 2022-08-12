# ATable

## User Guide

<details><summary>Key navigation</summary>

|               |           |
| :------------ | :-------- |
| Enter         | downCell  |
| Tab           | nextCell  |
| Shift + Enter | upCell    |
| Shift+ Tab    | prevCell  |
| &#8592;       | prevCell  |
| &#8593;       | upCell    |
| &#8594;       | nextCell  |
| &#8595;       | downCell  |
| Home          | lastCell  |
| End           | firstCell |

</details>

## Column API

The primary API for ATable is the column object.

- title: String
- name: required, a String reference to the column, must follow rules for valid JS variable naming
- type: String, one of the valid data types, full ist below
- align: String: 'left', 'right' or 'center'
- edit: Boolean, indicates if the field is editable
- width: String, default of '40ch', used to indicate the width of the cell
- mask: a custom mask for the field, serveral are provided with types by default
- options: used with 'Select', 'Currency', and 'Quantity' fields detailed below

```js
          {
            title: "Batch Name",
            name: "name",
            type: "Data",
            align: 'Right',
            edit: false,
          },
          {
            title: "Species",
            name: "species",
            type: "Select",
            align: 'left',
            edit: true,
            width: '30ch',
            required: true,
            options: () => ['Rainbow Trout', 'Steelhead', 'Golden Trout', 'Pacific Salmon']
          },
          {
            title: "Date",
            name: "set_date",
            type: "Date",
            align: 'center',
            edit: true,
            width: '30ch',
            mask: value => `${value}+/-`,
          }
```

## Column Data Types

V 0.1:

- Data/ Text (unformatted text)
- Number (can be backed by int, decimal or float)
- Hyperlink
- Currency
- Quantity
- Date
- Date Range
- Select/ Datalist/ Combobox

V > 0.2:

- Rich Text Editor
- Image
- File
- Diagram
