---
"@stonecrop/stonecrop": minor
"@stonecrop/desktop": minor
---

Add document-level defaults for new records: doctype defaults JSON, registry providers, and compose-time now and uuidv7 tokens. A new record is filled once, after every starting value has arrived: Desktop shows its loading state until then, a value that fails or takes longer than 5 seconds is skipped and reported, and nothing is written to the form afterwards.
