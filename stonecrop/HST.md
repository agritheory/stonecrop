### High-Level Architecture Diagram

```mermaid
graph TB
    subgraph "Vue Application Layer"
        VC[Vue Components]
        USR[useStonecropReactive]
        USC[useStonecrop]
    end

    subgraph "Stonecrop Core"
        SC[Stonecrop Class]
        REG[Registry]
        DT[DoctypeMeta]
    end

    subgraph "HST State Layer"
        HST[HST Store]
        HSTN[HSTNode]
        HSTP[HSTProxy]
    end

    subgraph "Vue Reactivity"
        FD[formData ref]
        WD[Deep Watcher]
        PR[Provide/Inject]
    end

    VC --> USR
    USR --> SC
    USR --> FD
    USR --> WD
    USR --> PR

    SC --> REG
    SC --> HST
    SC --> DT

    HST --> HSTN
    HSTN --> HSTP

    WD -.-> HST
    FD -.-> HST

    style USR fill:#e1f5fe
    style HST fill:#f3e5f5
    style FD fill:#e8f5e8
```

### HST Reactive Integration Architecture

```mermaid
graph TB
    subgraph "Component Integration"
        FC[Form Component]
        IC[Input Components]
        TC[Table Components]
    end

    subgraph "useStonecropReactive Composable"
        PHST[provideHSTPath]
        HHST[handleHSTChange]
        SDUP[setupDeepReactivity]
        INR[initializeNewRecord]
    end

    subgraph "HST Path Management"
        PG[Path Generation<br/>doctype.records.id.field]
        PS[Path Structure Validation]
        NS[Nested Structure Creation]
    end

    subgraph "Reactive Bridge"
        FDR[formData Ref]
        VW[Vue Deep Watcher]
        OR[Object Replacement]
    end

    subgraph "HST Store Operations"
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
    HHST --> OR

    SDUP --> VW
    VW --> SU

    FDR --> OR
    OR --> FDR

    PS --> SA
    SU --> REC
    NS --> REC

    style HHST fill:#ffcdd2
    style FDR fill:#c8e6c9
    style PG fill:#fff3e0
```

### Field Change Sequence Diagram

```mermaid
sequenceDiagram
    participant C as Component
    participant USR as useStonecropReactive
    participant HST as HST Store
    participant FD as formData
    participant VW as Vue Watcher

    Note over C,VW: Field-level Change Flow

    C->>USR: handleHSTChange({path, value, fieldname})

    USR->>HST: Check record exists
    alt Record doesn't exist
        USR->>HST: addRecord(doctype, recordId, formData)
    end

    alt Nested path
        USR->>HST: Ensure parent structure exists
        USR->>HST: Create arrays/objects as needed
    end

    USR->>HST: set(path, value)

    USR->>USR: Create newFormData copy

    alt Simple field
        USR->>USR: newFormData[field] = value
    else Nested field
        USR->>USR: updateNestedObject(newFormData, path, value)
    end

    USR->>FD: formData.value = newFormData

    Note over FD,VW: Vue Reactivity Triggered
    FD->>VW: Reactive change detected
    VW->>HST: Sync all formData to HST
```

### Component Integration Sequence

```mermaid
sequenceDiagram
    participant FC as Form Component
    participant USR as useStonecropReactive
    participant IC as Input Component
    participant REG as Registry
    participant SC as Stonecrop
    participant HST as HST Store

    Note over FC,HST: Component Setup and Integration

    FC->>USR: useStonecropReactive(doctype, recordId)

    USR->>REG: inject('$registry')
    USR->>SC: new Stonecrop(registry)
    USR->>HST: stonecrop.getStore()

    alt Existing record
        USR->>SC: getRecordById(doctype, recordId)
        SC->>HST: get record data
        HST-->>USR: existing formData
    else New record
        USR->>USR: initializeNewRecord(doctype)
    end

    USR->>USR: setupDeepReactivity(formData, hstStore)

    USR->>IC: provide('hstPathProvider', provideHSTPath)
    USR->>IC: provide('hstChangeHandler', handleHSTChange)

    Note over IC: Input component usage
    IC->>USR: inject('hstPathProvider')
    IC->>USR: provideHSTPath('fieldname')
    USR-->>IC: 'doctype.records.id.fieldname'

    IC->>IC: User interaction
    IC->>USR: handleHSTChange(changeData)

    USR->>HST: Update HST store
    USR->>FC: Update formData (reactive)
```

### Deep Reactivity Flow

```mermaid
graph LR
    subgraph "Vue Reactive System"
        FD[formData.value]
        DW[Deep Watcher]
        RU[Reactive Updates]
    end

    subgraph "HST Integration"
        HC[handleHSTChange]
        UNO[updateNestedObject]
        OR[Object Replacement]
    end

    subgraph "HST Store"
        SP[Set Path]
        RS[Record Structure]
        NSC[Nested Structure Creation]
    end

    FD --> DW
    DW --> HST_SYNC[HST Sync]
    HST_SYNC --> SP

    HC --> UNO
    UNO --> OR
    OR --> FD

    HC --> NSC
    NSC --> RS
    RS --> SP

    FD -.-> RU
    RU -.-> FD

    style FD fill:#e8f5e8
    style DW fill:#e3f2fd
    style HC fill:#fff3e0
    style SP fill:#f3e5f5
```

### Data Flow Architecture

```mermaid
graph TB
    subgraph "User Interface"
        UI[User Input]
        VB[v-model Binding]
    end

    subgraph "Vue Reactive Layer"
        FD[formData ref]
        WA[Deep Watch]
        PR[Provide/Inject]
    end

    subgraph "HST Integration Bridge"
        PHF[provideHSTPath Function]
        HCF[handleHSTChange Function]
        UNF[updateNestedObject Function]
    end

    subgraph "HST Store Layer"
        HST[HST Store Root]
        DT_REC[doctype.records]
        REC_DATA[record.field.data]
    end

    subgraph "Persistence Layer"
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

    style FD fill:#c8e6c9
    style HST fill:#f3e5f5
    style PHF fill:#fff3e0
    style HCF fill:#ffcdd2
```