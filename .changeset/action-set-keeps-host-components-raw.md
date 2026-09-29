---
'@stonecrop/desktop': patch
---

A slot's component or icon, or a view passed to `present()`, that the host keeps in reactive state now renders as the plain component, so an open slot panel no longer resets on the host's first change to its slots, and Vue no longer warns.
