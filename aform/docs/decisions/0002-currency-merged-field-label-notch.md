# ADR: Merged-field floating label notch (currency / quantity pattern)

## Status

Proposed — team A/B; **not implemented** in product CSS as of this record. `ACurrencyInput` keeps a solid `--sc-form-background` on the label only; the U-shaped border treatment below is the candidate to evaluate.

## Context

Merged inputs (currency prefix + amount, quantity + UOM) place `.aform_field-label` on `.acurrency__group` / `.aquantity__group`, straddling the group’s 1px top border like other fields.

Shared label styling (`AForm.vue`) uses a half-height gradient: form colour above the border, transparent below. That reads poorly when long labels span tinted prefix and white amount areas.

We tried:

1. **Solid label background** — full `var(--sc-form-background)` on `.acurrency__group > .aform_field-label` (shipped).
2. **Notch border** — lower-half left, right, and bottom borders on the label, visually continuing the group outline around a small “tab” (not shipped).

Browser iteration showed corner alignment is sensitive: the label’s `translateY(-50%)` center must match the group top border centerline, and the pseudo-element legs must start at **50%** of the label box, not `calc(50% + 1px)` (which starts verticals below the group stroke and breaks the corner).

## Candidate design (A/B)

**Fill:** `background: var(--sc-form-background)` on the label (or `::before` inset fill if borders need a separate layer).

**Optional alignment tweak:**

```css
.acurrency__group > .aform_field-label {
  line-height: 1.05;
  padding: 0 0.45rem 0.04rem;
  top: 0;
  transform: translateY(calc(-50% - 0.5px)); /* 1px border → half-pixel nudge */
}
```

**Notch stroke (candidate only):**

```css
.acurrency__group > .aform_field-label::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  border-left: 1px solid var(--sc-input-border-color);
  border-right: 1px solid var(--sc-input-border-color);
  border-bottom: 1px solid var(--sc-input-border-color);
  pointer-events: none;
}

.acurrency__group:focus-within > .aform_field-label::after {
  border-color: var(--sc-input-active-border-color);
}
```

Variants to compare in A/B: no notch (solid fill only), notch with/without bottom edge, `top: calc(50% - 1px)` on `::after` for 1px stroke overlap, shared rule for `AQuantityInput` if approved.

## Decision (pending)

Defer notch borders until A/B picks a direction. Do not block currency label readability work on perfect corner geometry.

## Consequences

- Long labels on merged fields rely on solid form background until/unless notch borders ship.
- If adopted, `label-background.spec.ts` may need to allow `::before` fill rules; pseudo border rules do not affect background tests today.
- Quantity should follow the same pattern if the notch wins A/B.
