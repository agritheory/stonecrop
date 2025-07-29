# GitHub Copilot Instructions for Stonecrop

## Project Context
This is the Stonecrop monorepo - a **schema-driven UI framework** with **event-driven workflows** using XState finite state machines and **hierarchical state management** via Pinia with specialized plugins.

## Architecture Reference
Always reference `.github/ARCHITECTURE.md` in the repository for comprehensive architectural understanding before making suggestions or changes.

## Core Technology Stack
- **Framework**: Vue.js 3.5+ with Composition API
- **State Management**: Pinia 3.0+ with plugins (shared-state, undo, xstate)
- **Workflow Engine**: XState 4.38+ for finite state machines
- **Monorepo**: Rush.js 5.155+ with pnpm 9.15+
- **TypeScript**: 5.8+ with strict typing
- **Build System**: Vite + Heft for compilation and bundling
- **Testing**: Vitest for unit testing
- **Documentation**: Custom API documentation generator using API Extractor Model + Histoire.js for component stories

## Key Guidelines
1. **Schema-driven** approach - UI components are generated from JSON schemas
2. **FSM workflows** with XState control application behavior and state transitions
3. **Rush.js monorepo** with TypeScript project references and pnpm workspaces
4. **Vue.js composables** with reactive state management
5. **Component composition** patterns with theme-aware styling

## Development Context
- Use Rush commands: `rush update`, `rush rebuild`, `rushx <command>`
- Package structure: `@stonecrop/<package-name>`
- Development examples: `rushx dev:aform`, `rushx dev:atable`, etc.
- Build process: Heft → Vite → API documentation
- Testing: Individual package tests with `rushx test`
- Documentation: Auto-generated API.md files using doc-tools autoinstaller

## State Management Architecture
- **Registry**: Singleton pattern for doctype definitions (immutable)
- **Pinia Stores**: Reactive state with specialized plugins
- **XState Integration**: FSM workflow management via pinia-xstate
- **Data Store**: Record and form data management
- **Shared State**: Cross-component state synchronization

## Always Consider
- Type safety and TypeScript best practices with strict mode
- Component composition patterns and reusability
- Performance implications of state changes and reactive updates
- Monorepo package dependencies and circular dependency avoidance
- Vue.js reactivity patterns and proper composable usage
- XState state machine design for predictable workflows
- Schema validation and runtime type checking

## Package-Specific Considerations
- **stonecrop**: Core orchestration, Registry, and Stonecrop class
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
4. Use Pinia stores for all mutable state management
5. Design XState machines for complex workflows
6. Write unit tests with Vitest for new functionality
7. Generate API documentation with `rush docs` (all projects) or `rushx docs` (current project)
8. API documentation is auto-generated as `API.md` files in each project directory
