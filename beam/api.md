# Beam API Reference

> This documentation is automatically generated from the TypeScript API.

## Vue Components

### ActionFooter

Vue component exported from @stonecrop/beam.

```typescript
import { ActionFooter } from '@stonecrop/beam'
```

### BeamArrow

Vue component exported from @stonecrop/beam.

```typescript
import { BeamArrow } from '@stonecrop/beam'
```

### BeamBtn

Vue component exported from @stonecrop/beam.

```typescript
import { BeamBtn } from '@stonecrop/beam'
```

### BeamDayDivider

Vue component exported from @stonecrop/beam.

```typescript
import { BeamDayDivider } from '@stonecrop/beam'
```

### BeamFilter

Vue component exported from @stonecrop/beam.

```typescript
import { BeamFilter } from '@stonecrop/beam'
```

### BeamFilterOption

Vue component exported from @stonecrop/beam.

```typescript
import { BeamFilterOption } from '@stonecrop/beam'
```

### BeamHeading

Vue component exported from @stonecrop/beam.

```typescript
import { BeamHeading } from '@stonecrop/beam'
```

### BeamMetadata

Vue component exported from @stonecrop/beam.

```typescript
import { BeamMetadata } from '@stonecrop/beam'
```

### BeamModal

Vue component exported from @stonecrop/beam.

```typescript
import { BeamModal } from '@stonecrop/beam'
```

### BeamModalOutlet

Vue component exported from @stonecrop/beam.

```typescript
import { BeamModalOutlet } from '@stonecrop/beam'
```

### BeamProgress

Vue component exported from @stonecrop/beam.

```typescript
import { BeamProgress } from '@stonecrop/beam'
```

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

### ItemCheck

Vue component exported from @stonecrop/beam.

```typescript
import { ItemCheck } from '@stonecrop/beam'
```

### ItemCount

Vue component exported from @stonecrop/beam.

```typescript
import { ItemCount } from '@stonecrop/beam'
```

### ListAnchor

Vue component exported from @stonecrop/beam.

```typescript
import { ListAnchor } from '@stonecrop/beam'
```

### ListItem

Vue component exported from @stonecrop/beam.

```typescript
import { ListItem } from '@stonecrop/beam'
```

### ListView

Vue component exported from @stonecrop/beam.

```typescript
import { ListView } from '@stonecrop/beam'
```

### Navbar

Vue component exported from @stonecrop/beam.

```typescript
import { Navbar } from '@stonecrop/beam'
```

### ScanInput

Vue component exported from @stonecrop/beam.

```typescript
import { ScanInput } from '@stonecrop/beam'
```

### SegmentedDisplay

Vue component exported from @stonecrop/beam.

```typescript
import { SegmentedDisplay } from '@stonecrop/beam'
```

### SplitColumn

Vue component exported from @stonecrop/beam.

```typescript
import { SplitColumn } from '@stonecrop/beam'
```

### ToggleArrow

Vue component exported from @stonecrop/beam.

```typescript
import { ToggleArrow } from '@stonecrop/beam'
```

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

