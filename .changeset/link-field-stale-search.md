---
'@stonecrop/aform': patch
---

A link field now shows only the results of its latest search: with an async `filterFunction`, an earlier search that answered after a later one replaced the later one's matches, so typing a name quickly could leave the matches for its first few letters on screen. An older search also no longer clears the loading state while the latest is still pending.
