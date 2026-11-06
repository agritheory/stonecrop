---
'@stonecrop/editor': minor
'@stonecrop/schema': minor
'@stonecrop/utilities': minor
'@stonecrop/atable': minor
'@stonecrop/nuxt': minor
---

Add `@stonecrop/editor`, an Editor.js block editor (`AEditor`) for rich-text fields, with the Paragraph, Header, List, Quote and Delimiter blocks. The field holds Editor.js `OutputData`; AForm binds it with `v-model`, and it renders as static HTML outside `edit` mode. `@stonecrop/schema` gives `AEditor` the new `richtext` category, `@stonecrop/utilities` adds `formatRichTextCell`, and ATable shows a rich-text column as its plain text, read-only. The Nuxt module installs the editor.
