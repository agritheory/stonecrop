---
'@stonecrop/aform': minor
---

BREAKING: Login requires `identity` and `authenticate`, adds `loginIdentities` and `useLoginPreset`, and replaces the inert forgot-password control with an `alternateSignIn` slot. A Login without `headerSubtitle` now shows no subtitle, and the email field no longer has a "name@example.com" placeholder.
