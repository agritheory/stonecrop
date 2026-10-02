---
'@stonecrop/stonecrop': minor
---

`Stonecrop.getRecord` throws a `RECORD_NOT_FOUND` error when the server has no such record, as `fetchNestedData` already did, and `useStonecrop` reports a failed record read through `isLoading` and `error`, leaving `formData` empty instead of filling it with empty values.
