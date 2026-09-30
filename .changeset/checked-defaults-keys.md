---
"@stonecrop/schema": minor
"@stonecrop/stonecrop": minor
---

`validateDoctype` refuses a `defaults` key that names no field of the doctype, such as a typo or a grouped section's name, and says which. `registry.registerDefaults` takes a doctype's name as well as its slug (`'OrderItem'` or `'order-item'`), so defaults registered under the name apply instead of being ignored.
