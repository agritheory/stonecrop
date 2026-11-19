---
'@stonecrop/stonecrop': patch
---

Stonecrop now warns the developer when a record is changed without going through the store (#557). A component or app code that wrote straight into an object it read from the store, such as an app's line table setting `row.qty = 5` on the row it was handed, changed the record without the operation log hearing of it, so Undo skipped that edit and reversed the one before it, with nothing saying why. The write is still let through, but outside production Stonecrop now logs a warning naming the path that was written and pointing to `useStonecrop`, the way for a component to make a change. The operation log's docs no longer say every change is logged automatically.
