# STONECROP

This repository contains all the packages used in the Sedum project. It is managed with [Rush](rushjs.io).

## What is it?
These packages in combination create an application that creates a schema driven UI and system of event driven hooks (actual hooks, not the React kind which are not hooks at all). These are available in both the UI and as server middleware.

Visit sedum.io/stonecrop

## To Do
 - Move desktop components out of Stonecrop and into Desktop
 - Make Beam components compatible with AForm API
 - Build and example project with things
 
## Getting Started
 This project has the following system dependencies:
 - pnpm ^6.10.3 [link]()
 - rush ^5.50.0 [link]()
 - nvm and node ^14.7: `nvm install --lts && nvm use --lts`
 
This is a guess for now
```bash
git clone {{url}} stonecrop
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
 - Themes
 - Print (TBD)
