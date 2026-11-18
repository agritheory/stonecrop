---
'@stonecrop/aform': patch
---

A dropdown, or a price's currency picker, now shows the results for what's in its box (#554). A search that asks a server could answer after a newer one, and its results replaced the newer list: typing "Eur" quickly could end with the list showing the results for "E". Each search's answer is now kept only while it is still the latest, and picking an option or closing the list drops any answer still on its way.

While the list shows "Loading results...", ↓ and Enter have nothing to pick, so typing "Eur" and pressing ↓ Enter before it answers no longer picks from the previous search's results.
