---
'@stonecrop/schema': minor
---

`stonecrop-schema generate --endpoint` reads the server's state machines (`allStateMachines`, or `listWorkflowEntityTypes` and `getStonecropWorkflowMeta` where the catalog is absent) and maps each onto its doctype's `workflow`. Adds `fetchWorkflowMachines`, `machinesFromCatalog`, `machineToWorkflow`, `attachWorkflows`, `fromStonecropBridge` and `fromMachineConfig`, and `DoctypeDrift` gains `workflowDrift`.
