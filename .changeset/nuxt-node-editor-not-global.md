---
'@stonecrop/nuxt': patch
---

`NodeEditor` and `StateEditor` now load the first time a page renders one, instead of with every page: the Nuxt module put Vue Flow and dagre, about 200 kB minified, in every app's entry chunk. Both stay registered by name, so a doctype naming either still renders it.
