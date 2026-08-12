---
title: Components
description: Live, interactive documentation for Stonecrop's Vue components.
---

# Components

Interactive documentation for individual Stonecrop components — live demos alongside their source and API reference. This is a companion to the [API Reference](/reference/), which documents every package's full public surface; pages here go deeper on one component at a time, covering every field component in `@stonecrop/aform`.

## Inputs

- [Form](./form) — `AForm`, the schema-driven orchestrator that resolves and renders every field below
- [Form Loading](./form-loading) — `AFormLoading`, a loading-state placeholder
- [Fieldset](./fieldset) — `AFieldset`, a collapsible group of nested fields
- [Checkbox](./checkbox) — `ACheckbox`, a boolean field component
- [Text Input](./text-input) — `ATextInput`, a single-line text field
- [Textbox Input](./textbox-input) — `ATextboxInput`, a multi-line text field
- [Numeric Input](./numeric-input) — `ANumericInput`, a plain numeric field
- [Dropdown](./dropdown) — `ADropdown`, a filterable autocomplete over a flat list of strings
- [File Attach](./file-attach) — `AFileAttach`, a native file picker
- [Date](./date) — `ADate`, a single-date field with an inline calendar
- [Date Range](./date-range) — `ADateRange`, a start/end date range field
- [Date Time](./date-time) — `ADateTime`, a time-of-day input segment
- [Date Selection](./date-selection) — `ADateSelection`, a composed calendar + time picker
- [Date Picker](./date-picker) — `ADatePicker`, the underlying calendar grid
- [Duration](./duration) — `ADuration`, a start/end range that derives an elapsed duration
- [Form Link](./form-link) — `AFormLink`, an autocomplete for linked (foreign-key) records
- [Currency](./currency) — `ACurrencyInput`, a currency amount input with base-currency conversion
- [Quantity Input](./quantity-input) — `AQuantityInput`, a quantity input with unit-of-measure conversion
- [Login](./login) — `Login`, a standalone email/password sign-in form
- [Collapse Button](./collapse-button) — `CollapseButton`, the internal toggle glyph used by Fieldset
