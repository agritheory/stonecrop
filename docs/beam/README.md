# Beam Documentation

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

**Signature:**

```typescript
declare function install(app: App): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| app | `App` |  |

### useMqttStream

**Signature:**

```typescript
useMqttStream: (options: IMqttStream) => Promise<{
    messages: import("vue").Ref<Record<string, string[]>, Record<string, string[]>>;
} | undefined>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| options | `IMqttStream` |  |

## Interfaces

### IMqttStream

**Definition:**

```typescript
export interface IMqttStream {
  topics?: string[];
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| topics? | `string[]` |  |

## Type Aliases

### BeamColor

**Definition:**

```typescript
export type BeamColor = RGB | RGBA | HEX | HSL | HSLA | string;
```

### BeamFilterChoice

**Definition:**

```typescript
export type BeamFilterChoice = {
    label: string;
    value: string;
};
```

### HEX

**Definition:**

```typescript
export type HEX = `#${string}`;
```

### HSL

**Definition:**

```typescript
export type HSL = `hsl(${number}, ${number}%, ${number}%)`;
```

### HSLA

**Definition:**

```typescript
export type HSLA = `hsl(${number}, ${number}%, ${number}%), ${number}`;
```

### ListViewItem

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

**Definition:**

```typescript
export type RGB = `rgb(${number}, ${number}, ${number})`;
```

### RGBA

**Definition:**

```typescript
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
```

