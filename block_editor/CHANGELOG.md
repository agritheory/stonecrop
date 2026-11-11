# @stonecrop/block-editor

## 0.61.0

### Minor Changes

- 3c3539d: Add `@stonecrop/block-editor`, an Editor.js block editor (`AEditor`) for rich-text fields, with the Paragraph, Header, List, Quote and Delimiter blocks. The field holds Editor.js `OutputData`; AForm binds it with `v-model`, and it renders as static HTML outside `edit` mode. `@stonecrop/schema` gives `AEditor` the new `richtext` category, `@stonecrop/utilities` adds `formatRichTextCell`, and ATable shows a rich-text column as its plain text, read-only. The Nuxt module installs the editor.

### Patch Changes

- Updated dependencies [3c3539d]
  - @stonecrop/utilities@0.61.0
