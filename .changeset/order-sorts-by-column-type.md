---
'@stonecrop/graphql-middleware': patch
---

A list or link ordered by a field named as its column (`position`, `created_at`), or by an identity named as its column (`id`), now sorts by the column's own type. Such a field was sorted as text, so a position of 10 came before 9, and a list sorted by `amount` descending put 999.6 above 2060.8. An enum field now sorts in its declared order. Ordering by a `json` field now fails in Postgres, which has no order for that type; it used to sort as text.
