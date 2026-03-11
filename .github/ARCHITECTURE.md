# Stonecrop Monorepo Architecture - LLM Context Prompt

## Overview
Stonecrop is a **schema-driven UI framework** and **event-driven application platform** that provides a unified system for building data-centric applications. It combines declarative schema definitions with finite state machines (FSM) for workflow management and **Hierarchical State Tree (HST)** for advanced state management.

## Core Philosophy
- **Schema-Driven**: UI components are generated from declarative JSON schemas
- **Event-Driven**: Application behavior is controlled through FSM-based workflows
- **Hierarchical State Management**: Advanced tree-structured state with the HST system
- **Component Composition**: Reusable UI components that work together seamlessly

## Repository Structure

### Monorepo Management
- **Tool**: Rush.js v5.155.1 for monorepo management
- **Package Manager**: pnpm v9.15.5 (required - yarn/npm will break packages)
- **TypeScript**: Full TypeScript v5.8.3 support with project references
- **Build System**: Vite for all packages with Heft for TypeScript compilation
- **Testing**: Vitest for unit testing across packages
- **Documentation**: Custom API documentation generator using API Extractor Model, Histoire.js for component stories
- **Development**: Examples package with interactive component stories

### Core Packages

#### 1. `@stonecrop/stonecrop` (Core Framework)
**Purpose**: The main orchestration layer and hierarchical state management system

**Key Components**:
- `Stonecrop` class: Main application controller with HST integration
- `Registry` class: Manages doctype definitions with singleton pattern and lazy loading
- `DoctypeMeta` class: Defines schema, workflow (FSM), and actions for data types
- `useStonecrop()` composable: Vue.js integration hook
- **HST (Hierarchical State Tree)**: Advanced state management system with tree navigation and multi-store compatibility

**Architecture Pattern**:
```
Stonecrop Application
├── Registry (singleton)               // immutable doctype definitions
│   ├── DoctypeMeta.schema            // JSON schema definitions
│   ├── DoctypeMeta.workflow          // XState finite state machines
│   └── DoctypeMeta.actions           // event-driven action handlers
└── HST Store (hierarchical)           // mutable reactive state with tree navigation
    ├── Doctype sections             // per-doctype state containers
    │   └── records                   // record data with direct access
    └── Advanced navigation           // parent/child/sibling access
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

HST Store
├── Multi-store compatibility
│   ├── Vue reactive objects
│   ├── Pinia stores (when used)
│   ├── Immutable objects
│   └── Plain JavaScript objects
├── Tree navigation capabilities
│   ├── Parent/child relationships
│   ├── Breadcrumb generation
│   ├── Depth tracking
│   └── Path-based addressing
└── Data organization
    └── [doctype] sections
        └── records/[id]           // individual record data with direct access
```

#### 2. `@stonecrop/aform` (Form Components)
**Purpose**: Schema-driven form generation and field components

**Key Features**:
- JSON schema → Vue form component generation
- Field types: Data, Select, Currency, Quantity, Date, etc.
- Validation and masking support
- Nested fieldsets and tables within forms
- Multi-mode forms: `edit` (fully interactive), `read` (disabled inputs), `display` (visual-only)

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
- `API.md`: Generated API documentation in each project directory using custom doc-tools autoinstaller
- `/common/autoinstallers/doc-tools`: Custom documentation generator using @microsoft/api-extractor-model
- `/rigs`: Shared build configuration (stonecrop-rig) with standardized tooling

#### Configuration
- Rush.js v5.155.1 configuration with version policies and approved packages
- TypeScript v5.8.3 project references for efficient incremental compilation
- Shared ESLint, Prettier, and build configurations via stonecrop-rig
- Heft build system for TypeScript compilation and API extraction
- Unified Vite configuration across all packages

## Key Architectural Concepts

### 1. Hierarchical State Tree (HST)
**Advanced state management** with tree navigation capabilities:
- **Multi-Store Compatibility**: Works seamlessly with Vue reactive objects, Pinia stores, Immutable objects, and plain JavaScript objects
- **Path-Based Addressing**: Full dot-notation path support (e.g., `"users.123.profile.settings"`)
- **Tree Navigation**: Parent/child relationships, sibling access, root access, depth tracking, and breadcrumb generation
- **Automatic Wrapping**: Transparent integration with different data structure types
- **Singleton Management**: Global HST manager with registry access

### 2. Finite State Machines (FSM)
**Workflow management** through XState v4.38.3:
- State transitions for data lifecycle management
- Event-driven actions with type safety
- Predictable state changes with guards and actions
- CRUD operation workflows with visual editing
- Integration with HST stores for state persistence

### 3. Schema-Driven Architecture
**Declarative approach** where:
- UI components are generated from JSON schemas
- Forms, tables, and layouts defined declaratively
- Type safety through TypeScript
- Runtime validation and masking

### 4. Registry Pattern
**Central management** with singleton pattern:
- Doctype definitions (similar to database tables/models)
- Lazy loading of schemas via getMeta function
- Component registration with automatic routing
- Vue Router integration for automatic route generation
- Immutable configuration with mutable HST state separation

### 5. Component Composition
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

# Package development
cd <package-name>
rushx dev               # Vite dev server
rushx build             # Build with Heft + Vite
rushx test              # Vitest tests
rushx test:watch        # Vitest in watch mode
rushx test:coverage     # Vitest with coverage
rushx test:ui           # Vitest UI
rushx lint              # ESLint

# Documentation
rush docs               # Generate API.md files for all projects
rushx docs              # Generate API.md for current project only

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
import Stonecrop from '@stonecrop/stonecrop'
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

### HST State Management
```typescript
// Registry-based doctype management
const registry = new Registry(router, getMeta)
registry.addDoctype(doctypeMeta)

// HST integration with automatic store creation
const stonecrop = new Stonecrop(registry)

// Record management with HST
stonecrop.addRecord('task', '123', recordData)
const record = stonecrop.getRecordById('task', '123')
const records = stonecrop.records('task')

// Advanced HST usage
const store = stonecrop.getStore()
const record = store.getNode('task.123')
const parent = record.getParent()
const breadcrumbs = record.getBreadcrumbs()
```

### HST Tree Navigation
```typescript
// Path-based access
const user = hst.get('user.profile.settings')
hst.set('user.profile.settings.theme', 'dark')

// Tree navigation
const settingsNode = hst.getNode('user.profile.settings')
const profileNode = settingsNode.getParent()
const rootNode = settingsNode.getRoot()

// Navigation properties
const path = settingsNode.getPath()        // 'user.profile.settings'
const depth = settingsNode.getDepth()      // 3
const breadcrumbs = settingsNode.getBreadcrumbs()  // ['user', 'profile', 'settings']
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
8. **Hierarchical State Management**: Tree-structured state with advanced navigation capabilities
9. **Multi-Store Compatibility**: Seamless integration with different state management patterns

---

**Note**: This is an active development project with evolving APIs. The architecture supports both prototype development and production applications through its modular design, tooling, and the new Hierarchical State Tree (HST) system which provides advanced state management capabilities beyond traditional reactive stores.
