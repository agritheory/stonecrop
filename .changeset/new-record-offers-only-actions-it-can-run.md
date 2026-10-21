---
'@stonecrop/schema': minor
'@stonecrop/stonecrop': minor
'@stonecrop/desktop': minor
---

A record not created yet is offered only the actions the server guard runs on one (a self-transition, or an action declaring no `allowedStates` and no `nextState`), a rule now exported as `isActionAllowedOnNewRecord`, so Desktop no longer offers a new record a transition the server refuses.
