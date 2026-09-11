---
'@stonecrop/desktop': patch
---

SheetNav's footer is pinned to both viewport edges and passes clicks through its empty area, where it inherited its container's offset and swallowed clicks meant for the page beneath.
