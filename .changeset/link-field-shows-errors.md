---
'@stonecrop/aform': patch
---

A link field now shows its `errors` (or a static `validation.errorMessage`) the way text inputs do, and marks its input `aria-invalid` with `aria-describedby` pointing at the message. Embedded link fields still leave the error to their host.
