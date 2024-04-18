# STONECROP

This repository contains all the packages used in the Sedum project. It is managed with [Rush](rushjs.io).

## What is it?

These packages in combination create an application that creates a schema driven UI and system of event driven hooks (actual hooks, not the React kind which are not hooks at all). These are available in both the UI and as server middleware.

## Getting Started

This project has the following system dependencies:

- [`pnpm`](https://pnpm.io/) (using yarn or npm will break packages)
- [`rush`](https://rushjs.io/)
- `nvm` and `node v20`: `nvm install 20 --lts && nvm use 20 --lts`

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

# sometimes, when changing branches or updating dependencies you may have issues
# this command removes and re-links all dependencies
rush purge && rush update && rush rebuild

# Provide changelog for release
rush change

# Stage changes and run linters
rushx lint
```
