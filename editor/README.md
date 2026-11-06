# @stonecrop/editor

A block editor for rich-text fields, built on [Editor.js](https://editorjs.io). It ships one component, `AEditor`, which AForm renders for any field whose schema names it:

```json
{ "fieldname": "notes", "label": "Notes", "component": "AEditor" }
```

## Install

The Stonecrop Nuxt module installs it for you. Elsewhere, register the component with `install`:

```ts
import { install as Editor } from '@stonecrop/editor'

app.use(Editor)
```

## The value

The field holds the Editor.js `OutputData` that `save()` returns: `{ time, blocks, version }`. The whole document is one field, so `blocks` and the text inside them are properties of its value, not fields of their own.

- `AEditor` binds it with `v-model`. On each change it calls `save()` and emits the new object `save()` returns. It never mutates an object it has emitted.
- A field the user has not edited stays `null`.
- A record loaded from a JSON column already holds the object, and the field binds it directly.

## Modes

- `edit` mounts Editor.js. It is imported the first time a field is edited, so a page that only shows documents never loads it.
- `read` and `display` render the saved blocks as static HTML (`read` with the field outline). Stored text is rebuilt tag by tag, so a value can never put its own elements or attributes on the page.

## Blocks

Paragraph, Header (levels 1–4), List (ordered, unordered, checklist), Quote and Delimiter. A block from any other tool is shown as its text, if it has any.

## In ATable

A column whose component is `AEditor` (category `richtext`) shows the document's plain text, cut off with an ellipsis, and its text filter searches that text. The cell is not editable.
