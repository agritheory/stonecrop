---
'@stonecrop/aform': patch
---

A link field now shows its `errors` (or a static `validation.errorMessage`) under the field, the way text inputs do, and marks its input `aria-invalid` with `aria-describedby` pointing at the message. An empty required link now shows its "Required" message. Embedded link fields still leave the error to their host.
