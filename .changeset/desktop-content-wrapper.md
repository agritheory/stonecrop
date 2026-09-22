---
'@stonecrop/desktop': minor
---

Desktop's form, list and default-slot content now sits in `.desktop__main` inside `.desktop__workspace`, so host CSS written against `.desktop > form.aform` must target `.desktop__main > form.aform` instead.
