# Stonecrop Monorepo Architecture - LLM Context Prompt

## Overview
Stonecrop is a **schema-driven UI framework** and **event-driven application platform** that provides a unified system for building data-centric applications. It combines declarative schema definitions with finite state machines (FSM) for workflow management and reactive state management.

## Core Philosophy
- **Schema-Driven**: UI components are generated from declarative JSON schemas
- **Event-Driven**: Application behavior is controlled through FSM-based workflows
- **Reactive State Management**: Centralized state with hierarchical organization
- **Component Composition**: Reusable UI components that work together seamlessly

## Repository Structure

### Monorepo Management
- **Tool**: Rush.js v5.155.1 for monorepo management
- **Package Manager**: pnpm v9.15.5 (required - yarn/npm will break packages)
- **TypeScript**: Full TypeScript v5.8.3 support with project references
- **Build System**: Vite for all packages with Heft for TypeScript compilation
- **Testing**: Vitest for unit testing across packages
- **Documentation**: API Documenter for generated docs, Histoire.js for component stories
- **Development**: Examples package with interactive component stories

### Core Packages

#### 1. `@stonecrop/stonecrop` (Core Framework)
**Purpose**: The main orchestration layer and state management system

**Key Components**:
- `Stonecrop` class: Main application controller and orchestration layer
- `Registry` class: Manages doctype definitions with singleton pattern and lazy loading
- `DoctypeMeta` class: Defines schema, workflow (FSM), and actions for data types
- `useStonecrop()` composable: Vue.js integration hook
- **State Management**: Pinia with plugins for shared state, undo functionality, and XState integration

**Architecture Pattern**:
```
Stonecrop Application
├── Registry (singleton)               // immutable doctype definitions
│   ├── DoctypeMeta.schema            // JSON schema definitions
│   ├── DoctypeMeta.workflow          // XState finite state machines
│   └── DoctypeMeta.actions           // event-driven action handlers
└── Stores (Pinia)                    // mutable reactive state
    ├── useDataStore                  // record data management
    └── XState integration            // workflow state management
```

**Hierarchical Structure**:
```
Registry
├── DoctypeMeta
│   ├── .schema (SchemaTypes[])
│   ├── .workflow (XState machine config)
│   ├── .actions (action handlers)
│   └── .component (Vue component)
└── Routing integration (Vue Router)

Stores (Pinia + plugins)
├── Data stores (records/record)
├── Shared state (pinia-shared-state)
├── Undo/Redo (pinia-undo)
└── XState integration (pinia-xstate)
```

#### 2. `@stonecrop/aform` (Form Components)
**Purpose**: Schema-driven form generation and field components

**Key Features**:
- JSON schema → Vue form component generation
- Field types: Data, Select, Currency, Quantity, Date, etc.
- Validation and masking support
- Nested fieldsets and tables within forms
- Read-only and edit modes

#### 3. `@stonecrop/atable` (Table Components)
**Purpose**: Advanced data table with spreadsheet-like functionality

**Key Features**:
- Keyboard navigation (Excel-style)
- Inline editing capabilities
- Column API with type system
- Cell context and connection events
- Gantt chart integration
- Connection handles for node editor integration

#### 4. `@stonecrop/beam` (UI Components)
**Purpose**: Core UI component library

**Components**:
- Navigation (Navbar, Dropdowns, Drawers)
- List components (ListView, ListItem, ItemCounter)
- Input components (Calculator/Number input)
- Modal helpers
- Responsive design utilities

#### 5. `@stonecrop/desktop` (Desktop UI)
**Purpose**: Desktop/browser-specific UI patterns

**Features**:
- Spreadsheet/tabbed navigation
- Command palette with search
- Desktop-optimized layouts

#### 6. `@stonecrop/node-editor` (Visual Editor)
**Purpose**: Visual node-based editor for workflows and data relationships

**Key Features**:
- Visual FSM state editor with Vue Flow integration
- Drag-and-drop state machine design
- Real-time workflow visualization

#### 7. `@stonecrop/code-editor` (Code Editor)
**Purpose**: Integrated code editing capabilities

**Key Features**:
- CodeMirror-based code editor
- Syntax highlighting and code completion

#### 8. `@stonecrop/graphql-client` (Data Layer)
**Purpose**: GraphQL client integration for data fetching

**Key Features**:
- GraphQL query and mutation handling
- Data layer abstraction

#### 9. `@stonecrop/nuxt` (Nuxt Integration)
**Purpose**: Nuxt.js framework integration

**Key Features**:
- Nuxt 3 module support
- SSR compatibility
- Nuxt composables integration

#### 10. `@stonecrop/themes` (Styling)
**Purpose**: Theming system with multiple pre-built themes

**Available Themes**:
- agritheory, dark, default, excel, legal, verdant, vue

#### 11. `@stonecrop/utilities` (Utilities)
**Purpose**: Helper functions and utilities for other Stonecrop packages

### Support Infrastructure

#### Examples & Documentation
- `/examples`: Live component stories using Histoire.js for interactive development
  - Component playground with hot reload
  - Story-driven development workflow
  - Per-package example folders (aform, atable, beam, etc.)
- `/docs`: Generated API documentation using Microsoft API Documenter
- `/rigs`: Shared build configuration (stonecrop-rig) with standardized tooling

#### Configuration
- Rush.js v5.155.1 configuration with version policies and approved packages
- TypeScript v5.8.3 project references for efficient incremental compilation
- Shared ESLint, Prettier, and build configurations via stonecrop-rig
- Heft build system for TypeScript compilation and API extraction
- Unified Vite configuration across all packages

## Key Architectural Concepts

### 1. Finite State Machines (FSM)
**Workflow management** through XState v4.38.3:
- State transitions for data lifecycle management
- Event-driven actions with type safety
- Predictable state changes with guards and actions
- CRUD operation workflows with visual editing
- Integration with Pinia stores via pinia-xstate plugin

### 2. Schema-Driven Architecture
**Declarative approach** where:
- UI components are generated from JSON schemas
- Forms, tables, and layouts defined declaratively
- Type safety through TypeScript
- Runtime validation and masking

### 3. Registry Pattern
**Central management** with singleton pattern:
- Doctype definitions (similar to database tables/models)
- Lazy loading of schemas via getMeta function
- Component registration with automatic routing
- Vue Router integration for automatic route generation
- Immutable configuration with mutable state separation

### 4. Component Composition
**Modular design** allowing:
- Nested components (tables within forms, forms within fieldsets)
- Reusable component library
- Theme-aware styling
- Framework-agnostic core with Vue.js integration

## Development Workflow

### Commands
```bash
# Initial setup
rush update
rush rebuild

# Development with examples
cd examples
rushx dev:aform          # aform component stories
rushx dev:atable         # atable component stories
rushx dev:beam           # beam component stories
rushx dev:builder        # documentation builder

# Package development
cd <package-name>
rushx dev               # Vite dev server
rushx build             # Build with Heft + Vite
rushx test              # Vitest tests
rushx lint              # ESLint

# Documentation
rushx docs              # Generate API docs

# Release management
rush change             # Record changes for release
rush publish            # Publish packages
```

### Package Dependencies
- Internal packages depend on each other through the monorepo
- External dependencies managed through Rush's approved packages policy
- Version policy ensures consistent versioning across packages

## Integration Patterns

### Vue.js Integration
```typescript
import { useStonecrop } from '@stonecrop/stonecrop'

// In Vue component
const { stonecrop } = useStonecrop()

// Plugin installation
app.use(Stonecrop, {
  router: router,
  getMeta: async (doctype) => await fetchDoctypeMeta(doctype),
  components: {
    /* custom components */
  }
})
```

### Schema Usage
```typescript
// Form schema defines UI generation
const formSchema = {
  fields: [
    { name: 'title', type: 'Data', required: true },
    { name: 'status', type: 'Select', options: [...] }
  ]
}
```

### State Management
```typescript
// Registry-based doctype management
const registry = new Registry(router, getMeta)
registry.addDoctype(doctypeMeta)

// Pinia stores with plugins
const dataStore = useDataStore()  // record management

// Stonecrop orchestration
const stonecrop = new Stonecrop(registry, dataStore)
stonecrop.runAction(doctype, 'LOAD', recordId)
```

## Target Use Cases
- **Business Applications**: ERP, CRM, data management systems
- **Form-Heavy Applications**: Complex forms with validation
- **Data Visualization**: Tables, charts, and interactive displays
- **Workflow Management**: State-driven business processes
- **Desktop-Class Web Apps**: Rich, responsive interfaces

## Key Design Principles
1. **Declarative over Imperative**: Define what, not how - schemas drive UI generation
2. **Composition over Inheritance**: Build complex UIs from simple, reusable parts
3. **Type Safety**: Full TypeScript support with strict typing throughout
4. **Performance**: Lazy loading, efficient state management, and incremental compilation
5. **Developer Experience**: Rich tooling, component stories, and clear APIs
6. **Framework Integration**: Vue.js primary with extensible architecture
7. **Monorepo Benefits**: Shared tooling, consistent versioning, and coordinated releases
8. **State Separation**: Immutable configuration with mutable reactive state

---

**Note**: This is an active development project with evolving APIs. The architecture supports both prototype development and production applications through its modular design and comprehensive tooling.
