# STONECROP

This repository contains all the packages used in the Sedum project. It is managed with [Rush](rushjs.io).

## What is it?
These packages in combination create an application that creates a schema driven UI and system of event driven hooks (actual hooks, not the React kind which are not hooks at all). These are available in both the UI and as server middleware.


## Getting Started
 This project has the following system dependencies:
 - pnpm ^6.10.3 [link](https://pnpm.io/) (using yarn or npm will break packages)
 - rush ^5.50.0 [link](https://rushjs.io/)
 - nvm and node ^16.13: `nvm install --lts && nvm use --lts`
 - prettier and pretty-quick: `pnpm install prettier && pnpm install pretty-quick`
 - (TODO): rush auto-installer scripts for prettier, pretty quick and/or tslint


```bash
git clone stonecrop
# or 
git pull
cd stonecrop
rush update
rush rebuild
# Work on stonecrop, for example
cd stonecrop
rushx story:dev
```



