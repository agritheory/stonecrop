# ATable (component)

### Version 0.1

- ⬢ Row Number => ignore in navigation
- ⬢ Bind data back to parent
- ⬢ Tab, Enter, Shift+Tab, Shift+Enter
- ⬢ Home and End key navigation
- ⬢ Arrows key navigation
- ⬢ "Required" cell formatting and API
- ⬢ Put cursor at end of content on key navigation
- ⬢ Refactor CSS to variables and create a style guide

### Version 0.2

- ⬡ Custom collection inputs:
  - ⬢ Create a new element and then destroy it
  - ⬢ Prevent default on input - only allow editing in modal context
  - ⬢ When parent clicked outside parent or enter key, destroy modal input component
  - ⬢ Generic number with formatting (percent, decimal)
  - ⬢ Currency
    - ⬡ Click outside bug, tab cycling
  - ⬢ Quantity
    - ⬡ Click outside bug, tab cycling
  - ⬡ Date
    - ⬡ Abstract table key navigation into another file
    - ⬡ Add table key-nav utilities
    - ⬢ Add page up/ page down for month-wise navigation
  - ⬢ Select/ Combobox
  - ⬢ Hyperlink
- ⬢ Generic masking (function in column object)

### Version 0.3

- ⬡ Better sandbox app with multiple styles and data sets
  - ⬡ Financials (excel)
  - ⬡ Inbox (dark)
    - ⬡ EditorJS component
  - ⬢ Repos (vue)
  - ⬡ Parts (ubuntu)
  - ⬡ Forecast
- ⬡ API to register custom column type
- ⬡ [Change styles](https://css-tricks.com/updating-a-css-variable-with-javascript/)
- ⬡ Validation error/ inline help
  - ⬡ Use generic modal but position it below the element with the error message
  - ⬡ Set validation function in column object
- ⬡ Indent
- ⬡ Re-organize into multiple files
- ⬡ Formulas - start with small subset of numeric and text operators in formula.js
  - ⬡ Vendor and include [uom conversions](https://www.npmjs.com/package/convert-units) or [pqm](https://www.npmjs.com/package/pqm)
- ⬡ Date Range (don't build it 'til I need it)

### Later versions

- ⬡ Copy / paste
- ⬡ Pagination
- ⬡ Collapsible row groups
  - ⬡ Bind an attribute identifying a row to a row group
  - ⬡ Indent/ nest

### Framework

- ⬡ Expand, Insert, Delete, Duplicate, Drag with icons (un-tabbable column)
- ⬡ Skeleton
- ⬡ Drag-able rows
  - ⬡ Replace row number with cell
  - ⬡ Icons for Delete, Duplicate, Drag, Detail, Insert actions
  - ⬡ Check box/ bulk actions

### Application components

- ⬢ Split Input (Quantity/ Currency)
- ⬡ Map (multiple layers)
- ⬡ Note/ Editorjs component
- ⬡ Address
- ⬡ Contact

### Styling

- ⬡ Check these defaults for color contrast https://webaim.org/resources/contrastchecker/
- ⬡ Create demo page with a top nav bar with these styles
- ⬢ Angler (Gold + Gotham)
- ⬢ Parsimony (turquoise/ rgb(63, 178, 191) + Expressway)
- ⬢ AgriTheory/ TimeKeeper (Rust + Muli, gray background)
- ⬢ Lawg (Blues and greens, mix in some serifs)
- ⬢ Excel styling for the plebians
- ⬢ Ubuntu (purples and oranges with Ubuntu font, gradient background)
- ⬢ Dark
