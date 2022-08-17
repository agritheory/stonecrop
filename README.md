# STONECROP

This repository contains all the packages used in the Sedum project. It is managed with [Rush](rushjs.io).

## What is it?

These packages in combination create an application that creates a schema driven UI and system of event driven hooks (actual hooks, not the React kind which are not hooks at all). These are available in both the UI and as server middleware.

## Getting Started

This project has the following system dependencies:

- [`pnpm`](https://pnpm.io/) (using yarn or npm will break packages)
- [`rush`](https://rushjs.io/)
- `nvm` and `node v16`: `nvm install --lts && nvm use --lts`
- `prettier` and `pretty-quick`: `pnpm install prettier && pnpm install pretty-quick`
- (TODO): rush auto-installer scripts for prettier, pretty quick and/or tslint

```bash
git clone stonecrop
# or
git pull

# install dependencies
cd stonecrop
rush update
rush rebuild

# Work on stonecrop, for example
cd stonecrop
rushx story:dev

# Stage changes and run linters
rushx lint

# Format changes before committing
rushx pretty-quick
```
