---
'@stonecrop/aform': minor
---

`ASemverInput` is a text field for a semantic version such as `v1.4.0-beta`, holding a `SemverValue`: the version as typed in `raw`, with the `major`, `minor` and `patch` read from it. Its `semver` mask keeps only the characters a version can hold, and a half-typed version leaves the value at the last one that parsed.
