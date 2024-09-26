# Stonecrop

![Test Status](https://github.com/agritheory/stonecrop/actions/workflows/tests.yml/badge.svg) ![Lint Status](https://github.com/agritheory/stonecrop/actions/workflows/lint.yml/badge.svg)

This repository contains all the packages used in the Stonecrop project. It is managed with [Rush](https://rushjs.io).

### What is it?

These packages in combination create an application that creates a schema driven UI and system of event driven hooks (actual hooks, not the React kind which are not hooks at all). These are available in both the UI and as server middleware.

### Getting Started

This project has the following system dependencies:

- [`pnpm`](https://pnpm.io/) (using yarn or npm will break packages)
- [`rush`](https://rushjs.io/)
- Node v20 LTS ([installation instructions](https://nodejs.org/en/download/package-manager))

```bash
git clone stonecrop
# or
git pull

# install dependencies
cd stonecrop
rush update
rush rebuild

# Work on aform, for example
cd aform

# sometimes, when changing branches or updating dependencies you may have issues
# this command removes and re-links all dependencies
rush purge && rush update && rush rebuild

# Provide changelog for release
rush change

# Stage changes and run linters
rushx lint
```

### Projects

- [`@stonecrop/aform`](./aform/CHANGELOG.md)
- [`@stonecrop/atable`](./atable/README.md)
- [`@stonecrop/beam`](./beam/README.md)
- [`@stonecrop/code_editor`](./code_editor/CHANGELOG.md)
- [`@stonecrop/desktop`](./desktop/README.md)
- [`@stonecrop/graphql_client`](./graphql_client/README.md)
- [`@stonecrop/node_editor`](./node_editor/README.md)
- [`@stonecrop/stonecrop`](./stonecrop/README.md)
- [`@stonecrop/themes`](./themes/README.md)
- [`@stonecrop/utilities`](./utilities/README.md)
