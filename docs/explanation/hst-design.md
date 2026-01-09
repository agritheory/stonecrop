---
title: HST Design
description: Understanding the Hierarchical State Tree architecture
---

# HST Design

The Hierarchical State Tree (HST) is Stonecrop's core state management system. It provides a tree-based data structure with path-based navigation, Vue reactivity integration, and automatic operation logging.

## High-Level Architecture

```mermaid
graph TB
    subgraph VueAppLayer [Vue Application Layer]
        VC[Vue Components]
        USC[useStonecrop]
    end

    subgraph StonecropCore [Stonecrop Core]
        SC[Stonecrop Class]
        REG[Registry]
        DT[DoctypeMeta]
    end

    subgraph HSTStateLayer [HST State Layer]
        HST[HST Store]
        HSTN[HSTNode]
        HSTP[HSTProxy]
    end

    subgraph VueReactivity [Vue Reactivity]
        FD[formData ref]
        WD[Deep Watcher]
        PR[Provide/Inject]
    end

    VC --> USC
    USC --> SC
    USC --> FD
    USC --> WD
    USC --> PR

    SC --> REG
    SC --> HST
    SC --> DT

    HST --> HSTN
    HSTN --> HSTP

    WD -.-> HST
    FD -.-> HST
```

## HST Reactive Integration

The `useStonecrop` composable bridges Vue's reactivity system with the HST store.

```mermaid
graph TB
    subgraph ComponentIntegration [Component Integration]
        FC[Form Component]
        IC[Input Components]
        TC[Table Components]
    end

    subgraph UseStonecropComposable [useStonecrop Composable]
        PHST[provideHSTPath]
        HHST[handleHSTChange]
        SDUP[setupDeepReactivity]
        INR[initializeNewRecord]
    end

    subgraph HSTPathManagement [HST Path Management]
        PG[Path Generation]
        PS[Path Validation]
        NS[Nested Structure]
    end

    subgraph ReactiveBridge [Reactive Bridge]
        FDR[formData Ref]
        VW[Vue Deep Watcher]
        ORep[Object Replacement]
    end

    subgraph HSTStoreOps [HST Store Operations]
        SA[Store Access]
        SU[Store Updates]
        REC[Record Management]
    end

    FC --> PHST
    IC --> HHST
    TC --> HHST

    PHST --> PG
    HHST --> PS
    HHST --> NS
    HHST --> ORep

    SDUP --> VW
    VW --> SU

    FDR --> ORep
    ORep --> FDR

    PS --> SA
    SU --> REC
    NS --> REC
```

## Field Change Flow

When a user modifies a field, the following sequence occurs:

```mermaid
sequenceDiagram
    participant C as Component
    participant US as useStonecrop
    participant HST as HST Store
    participant FD as formData
    participant VW as Vue Watcher

    Note over C,VW: Field-level Change Flow

    C->>US: handleHSTChange({path, value, fieldname})

    US->>HST: Check record exists
    alt Record does not exist
        US->>HST: addRecord(doctype, recordId, formData)
    end

    alt Nested path
        US->>HST: Ensure parent structure exists
        US->>HST: Create arrays/objects as needed
    end

    US->>HST: set(path, value)

    US->>US: Create newFormData copy

    alt Simple field
        US->>US: newFormData[field] = value
    else Nested field
        US->>US: updateNestedObject(newFormData, path, value)
    end

    US->>FD: formData.value = newFormData

    Note over FD,VW: Vue Reactivity Triggered
    FD->>VW: Reactive change detected
    VW->>HST: Sync all formData to HST
```

## Component Integration

Form and input components integrate with HST through provide/inject:

```mermaid
sequenceDiagram
    participant FC as Form Component
    participant US as useStonecrop
    participant IC as Input Component
    participant REG as Registry
    participant SC as Stonecrop
    participant HST as HST Store

    Note over FC,HST: Component Setup and Integration

    FC->>US: useStonecrop({ doctype, recordId })

    US->>REG: inject $registry
    US->>SC: new Stonecrop(registry)
    US->>HST: stonecrop.getStore()

    alt Existing record
        US->>SC: getRecordById(doctype, recordId)
        SC->>HST: get record data
        HST-->>US: existing formData
    else New record
        US->>US: initializeNewRecord(doctype)
    end

    US->>US: setupDeepReactivity(formData, hstStore)

    US->>IC: provide hstPathProvider
    US->>IC: provide hstChangeHandler

    Note over IC: Input component usage
    IC->>US: inject hstPathProvider
    IC->>US: provideHSTPath fieldname
    US-->>IC: doctype.id.fieldname

    IC->>IC: User interaction
    IC->>US: handleHSTChange(changeData)

    US->>HST: Update HST store
    US->>FC: Update formData reactive
```

## Data Flow Architecture

The complete data flow from user input to persistence:

```mermaid
graph TB
    subgraph UserInterface [User Interface]
        UI[User Input]
        VB[v-model Binding]
    end

    subgraph VueReactiveLayer [Vue Reactive Layer]
        FD[formData ref]
        WA[Deep Watch]
        PR[Provide/Inject]
    end

    subgraph HSTIntegrationBridge [HST Integration Bridge]
        PHF[provideHSTPath]
        HCF[handleHSTChange]
        UNF[updateNestedObject]
    end

    subgraph HSTStoreLayer [HST Store Layer]
        HST[HST Store Root]
        DT_REC[doctype.recordId]
        REC_DATA[record.field.data]
    end

    subgraph PersistenceLayer [Persistence Layer]
        SR[Server Requests]
        LC[Local Cache]
    end

    UI --> VB
    VB --> FD
    FD --> WA

    WA --> HST
    PR --> PHF
    PHF --> HCF
    HCF --> UNF

    UNF --> FD
    HCF --> HST

    HST --> DT_REC
    DT_REC --> REC_DATA

    HST -.-> SR
    HST -.-> LC
```

## Path Structure

HST uses dot-notation paths to address data:

```
doctype.recordId.fieldname
```

For example:
- `Todo.123.title` - The title field of Todo record 123
- `User.abc.profile.email` - Nested email in user profile
- `Order.456.items.0.quantity` - First item quantity in an order

## Operation Log Integration

Every HST mutation is tracked in the Operation Log:

1. **Reversible operations**: `set`, `delete`, `batch`
2. **Non-reversible operations**: `transition`, `action`

This enables:
- Undo/redo functionality
- Cross-tab synchronization
- Audit trails
- Time-travel debugging

## Related Documentation

- [State Machines](./state-machines) — XState transition integration
- [Stonecrop API Reference](/reference/stonecrop) — Full API documentation

