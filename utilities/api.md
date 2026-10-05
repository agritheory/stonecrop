# Utilities API Reference

> This documentation is automatically generated from the TypeScript API.

## Functions

### currencyAmountEntryPattern

Characters allowed while typing in a masked currency amount field.

**Signature:**

```typescript
export declare function currencyAmountEntryPattern(currencyId: string | undefined): RegExp;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| currencyId | `string \| undefined` |  |

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

### currencyInputLocale

Locale for formatting/parsing the numeric portion of a currency amount in inputs.

**Signature:**

```typescript
export declare function currencyInputLocale(currencyId: string | undefined): string;
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

Format a numeric amount for display in a currency amount field (no currency symbol).

**Signature:**

```typescript
export declare function formatCurrencyAmountInput(amount: number | null | undefined, currencyId: string | undefined): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| amount | `number \| null \| undefined` |  |
| currencyId | `string \| undefined` |  |

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

### parseCurrencyAmountInput

Parse user-entered text in a currency amount field back to a number.

**Signature:**

```typescript
export declare function parseCurrencyAmountInput(text: string, currencyId: string | undefined): number | null;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| text | `string` |  |
| currencyId | `string \| undefined` |  |

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

