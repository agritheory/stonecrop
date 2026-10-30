---
'@stonecrop/schema': patch
---

A workflow action that declares both `stateless: true` and a `nextState` is now refused when the doctype loads, instead of the browser running it as a command that changes nothing while the server moves the record to the next state. `stateless` together with `selfTransition` stays allowed.
