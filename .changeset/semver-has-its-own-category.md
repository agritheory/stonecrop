---
'@stonecrop/schema': minor
'@stonecrop/atable': minor
---

`ASemverInput` has its own `semver` component category, so atable filters a semver column as text and sorts it by version precedence: `1.2.0` before `1.10.0`, and a prerelease before its release.
