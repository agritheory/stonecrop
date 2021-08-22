# STONECROP

This repository contains all the packages used in the Sedum project. It is managed with [Rush](rushjs.io).

## What is it?
These packages in combination create an application that creates a schema driven UI and system of event driven hooks (actual hooks, not the React kind which are not hooks at all). These are available in both the UI and as server middleware.

Visit sedum.io/stonecrop

## To Do
 - Build and example project with some real features
	- Get Overmind working with stonecrop.config.js
	- Create a theme-able design with (s)css classes and color variables
	- Get CRUD-type data updates to work with MirageJS
 - Make Beam components compatible with AForm API
	

 
## Getting Started
 This project has the following system dependencies:
 - pnpm ^6.10.3 [link](https://pnpm.io/)
 - rush ^5.50.0 [link](https://rushjs.io/)
 - nvm and node ^14.17: `nvm install --lts && nvm use --lts`
 - Overmind Devtools for VSCode [link](https://marketplace.visualstudio.com/items?itemName=christianalfoni.overmind-devtools-vscode) (recommended)
 
```bash
git clone stonecrop
# or 
git pull
cd stonecrop
rush update
rush rebuild
# Work on stonecrop, for example
cd stonecrop
rushx dev
```

## Libraries
 - Stonecrop 
 - ATable
 - AForm
 - Beam (Mobile-specific components )
 - Desktop (Desktop/ SPA components)
 - Themes (including icon fonts)
 - HTTP Client
 - GraphQL Client
 - Print (TBD)
