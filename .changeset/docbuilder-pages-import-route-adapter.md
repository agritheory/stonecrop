---
'@stonecrop/nuxt': patch
---

The DocBuilder pages import their route adapter, so they no longer fail with a 500 ("useDocBuilderRouteAdapter is not defined") in an app that installs the module from npm.
