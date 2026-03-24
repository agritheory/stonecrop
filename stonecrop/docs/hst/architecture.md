### High-Level Architecture Diagram

```mermaid
graph TB
    subgraph "Vue Application Layer"
        VC[Vue Components]
        USC[useStonecrop]
    end

    subgraph "Stonecrop Core"
        SC[Stonecrop Class]
        REG[Registry]
        DT[Doctype]
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

    VC --> US
    US --> SC
    US --> FD
    US --> WD
    US --> PR

    SC --> REG
    SC --> HST
    SC --> DT

    HST --> HSTN
    HSTN --> HSTP

    WD -.-> HST
    FD -.-> HST

    style US fill:#e1f5fe
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

    subgraph "useStonecrop HST Composable"
        BHP[buildHSTPath]
        HHST[handleHSTChange]
        SDUP[setupDeepReactivity]
        INR[initializeNewRecord]
    end

    subgraph "HST Path Management"
        PG[Path Generation<br/>doctype.id.field]
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

    FC --> BHP
    IC --> HHST
    TC --> HHST

    BHP --> PG
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
    participant US as useStonecrop
    participant HST as HST Store
    participant FD as formData
    participant VW as Vue Watcher

    Note over C,VW: Field-level Change Flow

    C->>US: handleHSTChange({path, value, fieldname})

    US->>HST: Check record exists
    alt Record doesn't exist
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

### Component Integration Sequence

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

    US->>REG: inject('$registry')
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

    US->>IC: provide('hstPathProvider', provideHSTPath)
    US->>IC: provide('hstChangeHandler', handleHSTChange)

    Note over IC: Input component usage
    IC->>US: inject('hstPathProvider')
    IC->>US: provideHSTPath('fieldname')
    US-->>IC: 'doctype.id.fieldname'

    IC->>IC: User interaction
    IC->>US: handleHSTChange(changeData)

    US->>HST: Update HST store
    US->>FC: Update formData (reactive)
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
        BPF[buildHSTPath Function]
        HCF[handleHSTChange Function]
        UNF[updateNestedObject Function]
    end

    subgraph "HST Store Layer"
        HST[HST Store Root]
        DT_REC[doctype.recordId]
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
    PR --> BPF
    BPF --> HCF
    HCF --> UNF

    UNF --> FD
    HCF --> HST

    HST --> DT_REC
    DT_REC --> REC_DATA

    HST -.-> SR
    HST -.-> LC

    style FD fill:#c8e6c9
    style HST fill:#f3e5f5
    style BPF fill:#fff3e0
    style HCF fill:#ffcdd2
```