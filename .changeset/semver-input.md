---
'@stonecrop/aform': minor
---

`ASemverInput` is a text field for a SemVer 2.0.0 version such as `1.4.0-beta.2`. It holds the version as a string, or null while the box is empty or the version is half-typed, and refuses any edit that no version could start with, so a `v` prefix, a leading zero or a fourth number never gets in.
