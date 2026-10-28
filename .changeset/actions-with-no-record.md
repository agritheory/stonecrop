---
'@stonecrop/stonecrop': minor
---

`useClientAction` runs an action raised with no record, as a list's is, only through its `clientHandler`, which gets no `record` or `runAction`, so `ActionEventPayload.recordId` is now optional; `Doctype.getActions()` lists every action a workflow declares.
