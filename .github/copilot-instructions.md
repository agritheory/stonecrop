# GitHub Copilot Instructions for Stonecrop

## Project Context
This is the Stonecrop monorepo - a **schema-driven UI framework** with **event-driven workflows** using XState finite state machines and **Hierarchical State Tree (HST)** for advanced state management.

## Architecture Reference
Always reference `.github/ARCHITECTURE.md` in the repository for comprehensive architectural understanding before making suggestions or changes.

## Core Technology Stack
- **Framework**: Vue.js 3.5+ with Composition API
- **State Management**: HST (Hierarchical State Tree) with multi-store compatibility
- **Workflow Engine**: XState 4.38+ for finite state machines
- **Monorepo**: Rush.js 5.155+ with pnpm 9.15+
- **TypeScript**: 5.8+ with strict typing
- **Build System**: Vite + Heft for compilation and bundling
- **Testing**: Vitest for unit testing with jsdom environment
- **Documentation**: Custom API documentation generator using API Extractor Model + Histoire.js for component stories

## Key Guidelines
1. **Schema-driven** approach - UI components are generated from JSON schemas
2. **FSM workflows** with XState control application behavior and state transitions
3. **Rush.js monorepo** with TypeScript project references and pnpm workspaces
4. **Vue.js composables** with HST-based state management
5. **Component composition** patterns with theme-aware styling
6. **HST integration** for all state management needs

## Development Context
- Use Rush commands: `rush update`, `rush rebuild`, `rushx <command>`
- Package structure: `@stonecrop/<package-name>`
- Development examples: `rushx dev:aform`, `rushx dev:atable`, etc.
- Build process: Heft → Vite → API documentation
- Testing: Individual package tests with `rushx test`, `rushx test:watch`, `rushx test:coverage`
- Documentation: Auto-generated API.md files using doc-tools autoinstaller

## Critical Integration Patterns
- **useStonecrop Composable**: Primary Vue integration point with dual modes:
  - Basic mode: `useStonecrop()` for router-based setup
  - HST mode: `useStonecrop({ doctype, recordId })` for reactive forms
- **Provide/Inject**: HST components use `provideHSTPath` and `handleHSTChange` injections
- **Examples Shell Script**: `./dev-runner.sh <package>` in `/examples` for live development
- **Workspace Dependencies**: All packages use `workspace:*` for internal dependencies

## State Management Architecture
- **Registry**: Singleton pattern for doctype definitions (immutable)
- **HST (Hierarchical State Tree)**: Advanced state management with tree navigation
- **Multi-Store Compatibility**: Works with Vue reactive objects, Pinia stores, Immutable objects, and plain JavaScript objects
- **XState Integration**: FSM workflow management with HST state persistence
- **Path-Based Addressing**: Dot-notation access (e.g., `"user.profile.settings"`)

## Always Consider
- Type safety and TypeScript best practices with strict mode
- Component composition patterns and reusability
- Performance implications of state changes and reactive updates
- Monorepo package dependencies and circular dependency avoidance
- Vue.js reactivity patterns and proper composable usage
- XState state machine design for predictable workflows
- HST tree navigation and hierarchical state organization
- Schema validation and runtime type checking

## Package-Specific Considerations
- **stonecrop**: Core orchestration, Registry, HST system, and Stonecrop class
- **aform**: Schema-driven form components with validation
- **atable**: Advanced table with Excel-like navigation and editing
- **beam**: UI component library with consistent theming
- **desktop**: Desktop-specific UI patterns and command palette
- **node-editor**: Visual FSM editor with Vue Flow integration
- **utilities**: Shared helper functions and type utilities
- **doc-tools**: Autoinstaller for API documentation generation using API Extractor Model

## Development Workflow
1. Use component stories in `/examples` for interactive development
2. Follow TypeScript strict mode and proper type definitions
3. Leverage Rush.js for coordinated package development
4. Use HST stores for all mutable state management
5. Design XState machines for complex workflows
6. Write unit tests with Vitest for new functionality (including jsdom support)
7. Generate API documentation with `rush docs` (all projects) or `rushx docs` (current project)
8. API documentation is auto-generated as `API.md` files in each project directory

## HST Usage Patterns
```typescript
// Basic HST usage
const stonecrop = new Stonecrop(registry)
const store = stonecrop.getStore()

// Record management
stonecrop.addRecord('task', '123', recordData)
const currentRecord = stonecrop.currentRecord('task')
const records = stonecrop.records('task')

// Tree navigation
const record = store.getNode('task.records.123')
const parent = record.getParent()
const breadcrumbs = record.getBreadcrumbs()

// Path-based access
store.set('task.records.123.title', 'Updated Title')
const title = store.get('task.records.123.title')
const exists = store.has('task.records.123')
```

## Vue Integration Patterns
```typescript
// HST-reactive form setup
const { stonecrop, provideHSTPath, handleHSTChange, formData } = useStonecrop({
  doctype: myDoctype,
  recordId: 'record-123'
})

// Field path generation: "doctype.records.id.fieldname"
const fieldPath = provideHSTPath('title')

// Component change handling with automatic HST sync
handleHSTChange({ path: fieldPath, value: newValue, fieldname: 'title' })

// Basic Stonecrop (router-driven)
const { stonecrop } = useStonecrop() // Auto-loads from route params
```

## Essential Commands
```bash
# Initial setup
rush update && rush rebuild

# Development with hot reload
cd examples && rushx dev:aform  # or atable, beam, etc.

# Package development
cd <package> && rushx dev       # Vite dev server
cd <package> && rushx test:watch # Vitest watch mode

# Documentation generation
rush docs                       # All packages
rushx docs                      # Current package only

# Clean slate (when dependencies break)
rush purge && rush update && rush rebuild
```
