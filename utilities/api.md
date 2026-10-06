# Utilities API Reference

> This documentation is automatically generated from the TypeScript API.

## Functions

### compareSemver

Orders two versions by SemVer 2.0.0 precedence: major, minor and patch as numbers, a prerelease before its release, and prerelease identifiers one by one. Build metadata does not count, so `1.4.0+a` and `1.4.0+b` compare equal. Text that is not a version comes after every version.

**Signature:**

```typescript
export declare function compareSemver(a: string, b: string): number;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| a | `string` | The first version |
| b | `string` | The second version |

### currencyAmountEntryPattern

Characters allowed while typing in a masked currency amount field.

**Signature:**

```typescript
export declare function currencyAmountEntryPattern(currencyId: string | undefined, locale?: string): RegExp;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| currencyId | `string \| undefined` |  |
| locale | `string` | The browser's own when omitted |

### currencyInputFractionDigits

Fraction digits for a currency in amount inputs (e.g. JPY → 0).

**Signature:**

```typescript
export declare function currencyInputFractionDigits(currencyId: string | undefined): number;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| currencyId | `string \| undefined` |  |

### formatCurrencyAmount

Format a currency amount for display (forms, table cells). Uses `Intl` when `currency.id` is a valid ISO code; otherwise falls back to symbol, display text, or id.

**Signature:**

```typescript
export declare function formatCurrencyAmount(amount: number | null | undefined, currency: CurrencyLike | undefined): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| amount | `number \| null \| undefined` |  |
| currency | `CurrencyLike \| undefined` |  |

### formatCurrencyAmountInput

Format a numeric amount for display in a currency amount field (no currency symbol). The currency sets the decimals; the separators are the locale's, as in the table cell.

**Signature:**

```typescript
export declare function formatCurrencyAmountInput(amount: number | null | undefined, currencyId: string | undefined, locale?: string): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| amount | `number \| null \| undefined` |  |
| currencyId | `string \| undefined` |  |
| locale | `string` | The browser's own when omitted |

### formatCurrencyCell

Render a composite currency value for table cells.

**Signature:**

```typescript
export declare function formatCurrencyCell(value: unknown): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| value | `unknown` |  |

### formatQuantityCell

Render a composite quantity value for table cells. Omits the UOM when it matches `stockUom`.

**Signature:**

```typescript
export declare function formatQuantityCell(value: unknown): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| value | `unknown` |  |

### fromISODate

Reads a `YYYY-MM-DD` day. Anything that is not a real day written exactly that way reads as no day.

Not `Temporal.PlainDate.from` alone: it also takes the day out of a date-time, which would show a day field over a date-time column as a day instead of as the mismatch it is.

**Signature:**

```typescript
export declare function fromISODate(day: string): Temporal.PlainDate | undefined;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| day | `string` | The day, as `YYYY-MM-DD` |

### install

Install all utility components

**Signature:**

```typescript
declare function install(_app: App): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| _app | `App` | Vue app instance |

### isSemver

Whether the text is a version under SemVer 2.0.0: `1.4.0`, `1.4.0-beta.2`, `1.4.0+build.5`. A `v` prefix, a missing part (`1.4`) and a leading zero (`01.4.0`) are not.

**Signature:**

```typescript
export declare function isSemver(text: string): boolean;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| text | `string` | The text to check |

### isSemverPrefix

Whether typing more could still make the text a version: `1.`, `1.4.0-` and the empty text can, while `v1`, `01` and `1.4-beta` cannot. Every version passes, so a box that refuses any edit failing this one never stops someone typing a version.

**Signature:**

```typescript
export declare function isSemverPrefix(text: string): boolean;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| text | `string` | The text so far |

### parseCurrencyAmountInput

Parse user-entered text in a currency amount field back to a number, read with the separators the field writes it with.

**Signature:**

```typescript
export declare function parseCurrencyAmountInput(text: string, locale?: string): number | null;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| text | `string` |  |
| locale | `string` | The browser's own when omitted |

### useKeyboardNav

Keyboard navigation composable

**Signature:**

```typescript
export declare function useKeyboardNav(options: KeyboardNavigationOptions[]): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| options | `KeyboardNavigationOptions[]` | Keyboard navigation options |

## Type Aliases

### KeyboardNavigationOptions

Keyboard navigation options

**Definition:**

```typescript
export type KeyboardNavigationOptions = {
    parent?: string | HTMLElement | Readonly<Ref<HTMLElement | null>>;
    selectors?: string | HTMLElement | HTMLElement[] | ComponentPublicInstance[] | Readonly<Ref<HTMLElement | null>> | Readonly<Ref<HTMLElement[] | null>> | Readonly<Ref<ComponentPublicInstance[] | null>>;
    handlers?: KeypressHandlers;
};
```

### KeypressHandlers

Key press handlers

**Definition:**

```typescript
export type KeypressHandlers = {
    [key: string]: (ev: KeyboardEvent) => any;
};
```

## Variables

### defaultKeypressHandlers

Default keypress handlers for keyboard navigation

**Type:**

```typescript
export const defaultKeypressHandlers: KeypressHandlers
```

