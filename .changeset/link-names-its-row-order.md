---
'@stonecrop/schema': patch
'@stonecrop/graphql-middleware': patch
---

A many-side link can name the order of its rows with `orderBy`, a field of the target and an optional direction (`{ "fieldname": "rowOrder" }`), so rows that keep their own position, such as an order's lines, load in that order instead of by id. Identity now breaks ties in both the link and the list query, so a capped read always keeps the same rows.

A list or link ordered by a one-word field, or by an integer identity, now sorts by the column's own type. Such a field was sorted as text, so a position of 10 came before 9, and a list sorted by `amount` descending put 999.6 above 2060.8.
