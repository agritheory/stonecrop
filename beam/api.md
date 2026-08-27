# Beam API Reference

> This documentation is automatically generated from the TypeScript API.

## Vue Components

### ActionFooter

Vue component exported from @stonecrop/beam.

```typescript
import { ActionFooter } from '@stonecrop/beam'
```

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| click | `[]` |  |

**Slots:**

| Slot | Props | Description |
|------|-------|-------------|
| default | `{}` |  |

### BeamArrow

Vue component exported from @stonecrop/beam.

```typescript
import { BeamArrow } from '@stonecrop/beam'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| color | `string \| undefined` | no | `"#c4c4c4"` |  |

### BeamBtn

Vue component exported from @stonecrop/beam.

```typescript
import { BeamBtn } from '@stonecrop/beam'
```

**Slots:**

| Slot | Props | Description |
|------|-------|-------------|
| default | `{}` |  |

### BeamDayDivider

Vue component exported from @stonecrop/beam.

```typescript
import { BeamDayDivider } from '@stonecrop/beam'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| item | `ListViewItem` | yes |  |  |

**Slots:**

| Slot | Props | Description |
|------|-------|-------------|
| default | `any` |  |

### BeamFilter

Vue component exported from @stonecrop/beam.

```typescript
import { BeamFilter } from '@stonecrop/beam'
```

**Slots:**

| Slot | Props | Description |
|------|-------|-------------|
| default | `any` |  |

### BeamFilterOption

Vue component exported from @stonecrop/beam.

```typescript
import { BeamFilterOption } from '@stonecrop/beam'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| choices | `BeamFilterChoice[]` | yes |  |  |
| title | `string \| undefined` | no | `"title"` |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| select | `[choice: BeamFilterChoice]` |  |

### BeamHeading

Vue component exported from @stonecrop/beam.

```typescript
import { BeamHeading } from '@stonecrop/beam'
```

**Slots:**

| Slot | Props | Description |
|------|-------|-------------|
| default | `{}` |  |

### BeamMetadata

Vue component exported from @stonecrop/beam.

```typescript
import { BeamMetadata } from '@stonecrop/beam'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| order | `{ orderNumber: string; product: string; quantity: number; total: number; complete: boolean; }` | yes |  |  |

**Slots:**

| Slot | Props | Description |
|------|-------|-------------|
| default | `{}` |  |

### BeamModal

Vue component exported from @stonecrop/beam.

```typescript
import { BeamModal } from '@stonecrop/beam'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| showModal | `boolean` | yes |  |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| closemodal | `[]` |  |
| confirmmodal | `[]` |  |

**Slots:**

| Slot | Props | Description |
|------|-------|-------------|
| default | `{ onConfirmmodal: ($event: any) => void; onClosemodal: ($event: any) => void; }` |  |

### BeamModalOutlet

Vue component exported from @stonecrop/beam.

```typescript
import { BeamModalOutlet } from '@stonecrop/beam'
```

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| closemodal | `[]` |  |
| confirmmodal | `[]` |  |

### BeamProgress

Vue component exported from @stonecrop/beam.

```typescript
import { BeamProgress } from '@stonecrop/beam'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| label | `string \| undefined` | no | `"Status"` |  |
| progressMessage | `string \| undefined` | no | `"In Progress"` |  |
| completeMessage | `string \| undefined` | no | `"Complete"` |  |
| complete | `boolean \| undefined` | no | `false` |  |

### Confirm

Vue component exported from @stonecrop/beam.

```typescript
import { Confirm } from '@stonecrop/beam'
```

### FixedTop

Vue component exported from @stonecrop/beam.

```typescript
import { FixedTop } from '@stonecrop/beam'
```

**Slots:**

| Slot | Props | Description |
|------|-------|-------------|
| default | `{}` |  |

### ItemCheck

Vue component exported from @stonecrop/beam.

```typescript
import { ItemCheck } from '@stonecrop/beam'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| modelValue | `boolean \| undefined` | no | `false` |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| update:modelValue | `[value: boolean]` |  |

### ItemCount

Vue component exported from @stonecrop/beam.

```typescript
import { ItemCount } from '@stonecrop/beam'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| denominator | `number \| undefined` | no | `0` |  |
| debounce | `number \| undefined` | no | `300` |  |
| editable | `Booleanish \| "inherit" \| "plaintext-only" \| undefined` | no | `true` |  |
| uom | `string \| undefined` | no | `""` |  |
| modelValue | `number` | yes |  |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| update:modelValue | `[value: number]` |  |

### ListAnchor

Vue component exported from @stonecrop/beam.

```typescript
import { ListAnchor } from '@stonecrop/beam'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| to | `string \| undefined` | no | `""` |  |

**Slots:**

| Slot | Props | Description |
|------|-------|-------------|
| default | `{}` |  |

### ListItem

Vue component exported from @stonecrop/beam.

```typescript
import { ListItem } from '@stonecrop/beam'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| item | `ListViewItem` | yes |  |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| update | `[item: ListViewItem]` |  |

### ListView

Vue component exported from @stonecrop/beam.

```typescript
import { ListView } from '@stonecrop/beam'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| items | `ListViewItem[]` | yes |  |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| update | `[item: ListViewItem]` |  |
| scrollbottom | `[]` |  |

### Navbar

Vue component exported from @stonecrop/beam.

```typescript
import { Navbar } from '@stonecrop/beam'
```

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| click | `[]` |  |

**Slots:**

| Slot | Props | Description |
|------|-------|-------------|
| title | `{}` |  |
| navbaraction | `{}` |  |

### ScanInput

Vue component exported from @stonecrop/beam.

```typescript
import { ScanInput } from '@stonecrop/beam'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| scanHandler | `(barcode: string, qty: number) => void` | yes |  |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| scanInstance | `[instance: OnScan]` |  |

### SegmentedDisplay

Vue component exported from @stonecrop/beam.

```typescript
import { SegmentedDisplay } from '@stonecrop/beam'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| displayInput | `number \| undefined` | no | `120.2568` |  |
| decimalPlaces | `number \| undefined` | no | `2` |  |
| displayColor | `BeamColor` | no | `"gray"` |  |
| textColor | `BeamColor` | no | `"white"` |  |

### SplitColumn

Vue component exported from @stonecrop/beam.

```typescript
import { SplitColumn } from '@stonecrop/beam'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| justifyContent | `Property.JustifyContent \| undefined` | no | `"space-between"` |  |
| alignItems | `Property.AlignItems \| undefined` | no | `"flex-start"` |  |

**Slots:**

| Slot | Props | Description |
|------|-------|-------------|
| left | `{}` |  |
| right | `{}` |  |

### ToggleArrow

Vue component exported from @stonecrop/beam.

```typescript
import { ToggleArrow } from '@stonecrop/beam'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| open | `boolean` | yes |  |  |

## Functions

### install

Install all Beam components

**Signature:**

```typescript
declare function install(app: App): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| app | `App` | Vue app instance |

### useMqttStream

Use MQTT stream

**Signature:**

```typescript
useMqttStream: (options: IMqttStream) => Promise<{
    messages: import("vue").Ref<Record<string, string[]>, Record<string, string[]>>;
}>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| options | `IMqttStream` | MQTT stream options |

## Interfaces

### IMqttStream

MQTT stream options

**Definition:**

```typescript
export interface IMqttStream {
  topics?: string[];
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| topics? | `string[]` | MQTT topics to subscribe to |

## Type Aliases

### BeamColor

Union type for color values - supports RGB, RGBA, HEX, HSL, HSLA, or CSS color string

**Definition:**

```typescript
export type BeamColor = RGB | RGBA | HEX | HSL | HSLA | CSSProperties['color'];
```

### BeamFilterChoice

Filter choice with label and value for BeamFilter component

**Definition:**

```typescript
export type BeamFilterChoice = {
    label: string;
    value: string;
};
```

### HEX

HEX color string representation

**Definition:**

```typescript
export type HEX = `#${string}`;
```

### HSL

HSL color string representation

**Definition:**

```typescript
export type HSL = `hsl(${number}, ${number}%, ${number}%)`;
```

### HSLA

HSLA color string representation

**Definition:**

```typescript
export type HSLA = `hsl(${number}, ${number}%, ${number}%), ${number}`;
```

### ListViewItem

Configuration object for ListView component items

**Definition:**

```typescript
export type ListViewItem = {
    barcode?: string;
    checked?: boolean;
    count?: {
        count: number;
        of: number;
        uom?: string;
    };
    date?: string;
    dateFormat?: string;
    debounce?: number;
    description?: string;
    label?: string;
    linkComponent?: string;
    route?: string;
};
```

### RGB

RGB color string representation

**Definition:**

```typescript
export type RGB = `rgb(${number}, ${number}, ${number})`;
```

### RGBA

RGBA color string representation

**Definition:**

```typescript
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
```

## Variables

### ActionFooter

**Type:**

```typescript
export const ActionFooter: typeof __VLS_export
```

### BeamArrow

**Type:**

```typescript
export const BeamArrow: typeof __VLS_export
```

### BeamBtn

**Type:**

```typescript
export const BeamBtn: typeof __VLS_export
```

### BeamDayDivider

**Type:**

```typescript
export const BeamDayDivider: typeof __VLS_export
```

### BeamFilter

**Type:**

```typescript
export const BeamFilter: typeof __VLS_export
```

### BeamFilterOption

**Type:**

```typescript
export const BeamFilterOption: typeof __VLS_export
```

### BeamHeading

**Type:**

```typescript
export const BeamHeading: typeof __VLS_export
```

### BeamMetadata

**Type:**

```typescript
export const BeamMetadata: typeof __VLS_export
```

### BeamModal

**Type:**

```typescript
export const BeamModal: typeof __VLS_export
```

### BeamModalOutlet

**Type:**

```typescript
export const BeamModalOutlet: typeof __VLS_export
```

### BeamProgress

**Type:**

```typescript
export const BeamProgress: typeof __VLS_export
```

### Confirm

**Type:**

```typescript
export const Confirm: typeof __VLS_export
```

### FixedTop

**Type:**

```typescript
export const FixedTop: typeof __VLS_export
```

### ItemCheck

**Type:**

```typescript
export const ItemCheck: typeof __VLS_export
```

### ItemCount

**Type:**

```typescript
export const ItemCount: typeof __VLS_export
```

### ListAnchor

**Type:**

```typescript
export const ListAnchor: typeof __VLS_export
```

### ListItem

**Type:**

```typescript
export const ListItem: typeof __VLS_export
```

### ListView

**Type:**

```typescript
export const ListView: typeof __VLS_export
```

### Navbar

**Type:**

```typescript
export const Navbar: typeof __VLS_export
```

### ScanInput

**Type:**

```typescript
export const ScanInput: typeof __VLS_export
```

### SegmentedDisplay

**Type:**

```typescript
export const SegmentedDisplay: typeof __VLS_export
```

### SplitColumn

**Type:**

```typescript
export const SplitColumn: typeof __VLS_export
```

### ToggleArrow

**Type:**

```typescript
export const ToggleArrow: typeof __VLS_export
```

