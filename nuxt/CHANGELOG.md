# Change Log - @stonecrop/nuxt

This log was last generated on Thu, 20 Aug 2026 09:10:32 GMT and should not be manually modified.

## 0.25.0
Thu, 20 Aug 2026 09:10:32 GMT

_Version update only_

## 0.24.0
Thu, 20 Aug 2026 08:19:12 GMT

_Version update only_

## 0.23.0
Tue, 18 Aug 2026 09:16:50 GMT

_Version update only_

## 0.22.0
Mon, 17 Aug 2026 19:46:36 GMT

_Version update only_

## 0.21.0
Mon, 17 Aug 2026 19:08:23 GMT

_Version update only_

## 0.20.0
Mon, 17 Aug 2026 18:41:19 GMT

_Version update only_

## 0.19.0
Mon, 17 Aug 2026 12:46:25 GMT

### Minor changes

- Pass a doctype's `displayField` through the metadata resolvers.

## 0.18.0
Fri, 14 Aug 2026 08:05:46 GMT

_Version update only_

## 0.17.0
Tue, 11 Aug 2026 12:49:04 GMT

### Minor changes

- Add an onError option to useClientAction so a host can route action failures into its own notification system instead of the built-in alert.
- useClientAction now omits id from the argument envelope for a draft, which is what the write path reads as create. A draft result carrying no identity is no longer stored.
- BREAKING: remove stonecropCreate, stonecropUpdate and stonecropDelete from the scaffold and playground schemas. stonecropAction is the only write path; saving a record that does not exist creates it
- useClientAction now writes an action result back under the identity the server settled on and follows the route there, so creating a record from the UI lands on the real record instead of stranding it under a synthetic new- id; the scaffolded page dispatches through it rather than restating the writeback

### Patches

- Fix scaffolded Save actions that could never dispatch, and wire the server-side action effect seam into the scaffold resolvers
- Re-export useClientAction from @stonecrop/stonecrop so every Vue host can reach it; the Nuxt auto-import and existing @action bindings are unchanged.
- Update the scaffolded and fullstack resolvers for the records contract: both answer hasMore and withhold the total unless includeTotal is set.
- Report a missing record from the scaffold and playground action resolvers so a save against one cannot report a false success
- The scaffolded page keys list rows by the identity the doctype declares rather than a hardcoded `id`, so a natural-keyed doctype no longer has every row silently dropped and its list render empty; the draft-id guard in its load handler is gone now that Desktop does not ask for a draft
- recordLookupField now calls @stonecrop/schema's getRecordIdField instead of restating the rule. No behaviour change.
- Create a record when a save targets one that does not exist, resolve action records by the declared primary key, and cover the scaffold resolvers with executed tests
- Fix templates/plugins.ts, which ships into every scaffolded app. It imported GraphileConfig from graphile-config — an optional peer dependency that is never installed — and the unresolved type degraded both example plugins to any, hiding that they were written against the Web Request API (request.url, request.headers.get) rather than grafserv's RequestDigest (request.path, request.getHeader), and that event.request is optional. Its docblock also showed an inline preset object, which is unsupported; preset is a path to a preset file. templates/ is now type-checked by test:types
- The scaffolded app no longer binds load-records or load-record and ships no fetch helpers: the registered StonecropClient is its whole data layer.
- Extract the docbuilder save merge into mergeSavedDoctype and the fields-panel write helpers into docbuilderFields, so the two hops of the unknown-key preservation chain that carried no test now have one. No behavioural change: the save handler and the panel call the extracted helpers verbatim

## 0.16.6
Tue, 04 Aug 2026 12:14:33 GMT

### Patches

- Resolve records by the declared primaryKey in scaffolded resolvers, and declare a primary key on every doctype

## 0.16.5
Mon, 03 Aug 2026 11:12:57 GMT

### Patches

- Inline @stonecrop/desktop and @stonecrop/code-editor for SSR, fixing an 'Unknown file extension .css' crash under pnpm installs where a transitively-externalized parent hid atable's stylesheet. DocBuilder now locks introspected identity fields from the shared schema constant, and the playground no longer needs overrides.json.

## 0.16.4
Tue, 28 Jul 2026 09:58:37 GMT

_Version update only_

## 0.16.3
Wed, 22 Jul 2026 11:52:14 GMT

### Patches

- Exclude prebuilt Stonecrop dists from the Nuxt auto-import transform, fixing "Identifier 'h' has already been declared" in symlinked workspace dev; fold symlinked-package fs.allow handling into module setup

## 0.16.2
Wed, 22 Jul 2026 08:50:22 GMT

### Patches

- Update example doctypes from ATextarea to ATextboxInput

## 0.16.1
Wed, 22 Jul 2026 08:03:10 GMT

_Version update only_

## 0.16.0
Wed, 22 Jul 2026 07:11:33 GMT

_Version update only_

## 0.15.0
Fri, 17 Jul 2026 11:29:31 GMT

### Patches

- sort package JSON

## 0.14.0
Fri, 17 Jul 2026 07:01:54 GMT

### Minor changes

- update fullstack doctype schemas
- add clientHandler field to ActionDefinition for client-side JS handler authoring
- add vsPath and extraLibs props to ACodeEditor for offline Monaco support and JS type checking

### Patches

- template server SDL/resolvers reconciled with @stonecrop/schema: field type carries the full ValueField contract, workflow actions are a structured list, stale handler/args removed; resolvers pass doctype meta through instead of enumerating keys
- type-check the fullstack example in test:types (add a fullstack tsconfig + wire it in), making the Desktop `@action="run"` payload contract a compile-time regression guard; add the @stonecrop/graphql-client dependency it and the templates already import
- expose the field `format` (display formatter) as an editable text property in the docbuilder fields panel, alongside `mask` (input) — the two are distinct and only `mask` was authorable

## 0.13.14
Wed, 01 Jul 2026 08:35:25 GMT

### Patches

- update ATable row click handlers

## 0.13.13
Thu, 18 Jun 2026 12:32:33 GMT

### Patches

- add commands for countries example

## 0.13.12
Tue, 16 Jun 2026 10:50:50 GMT

_Version update only_

## 0.13.11
Mon, 15 Jun 2026 06:52:28 GMT

_Version update only_

## 0.13.10
Thu, 11 Jun 2026 10:23:31 GMT

### Patches

- fix CLI bootstrap example
- add Countries GraphQL playground example

## 0.13.9
Mon, 08 Jun 2026 13:12:21 GMT

### Minor changes

- update examples to use new schema types

## 0.13.8
Thu, 04 Jun 2026 12:04:15 GMT

_Version update only_

## 0.13.7
Thu, 04 Jun 2026 11:09:19 GMT

_Version update only_

## 0.13.6
Thu, 04 Jun 2026 09:33:09 GMT

_Version update only_

## 0.13.5
Tue, 02 Jun 2026 11:07:21 GMT

_Version update only_

## 0.13.4
Tue, 02 Jun 2026 07:09:16 GMT

_Version update only_

## 0.13.3
Tue, 02 Jun 2026 05:55:11 GMT

_Version update only_

## 0.13.2
Thu, 28 May 2026 06:18:59 GMT

_Version update only_

## 0.13.1
Tue, 26 May 2026 14:15:00 GMT

### Patches

- remove tableName from schemas

## 0.13.0
Wed, 20 May 2026 11:08:30 GMT

_Version update only_

## 0.12.8
Mon, 18 May 2026 11:24:35 GMT

### Patches

- add test tags

## 0.12.7
Mon, 18 May 2026 10:41:42 GMT

### Patches

- apply missing options for graphql records API

## 0.12.6
Thu, 14 May 2026 11:55:38 GMT

_Version update only_

## 0.12.5
Thu, 14 May 2026 10:29:38 GMT

_Version update only_

## 0.12.4
Thu, 14 May 2026 07:19:11 GMT

_Version update only_

## 0.12.3
Wed, 13 May 2026 12:28:05 GMT

_Version update only_

## 0.12.2
Wed, 13 May 2026 10:58:06 GMT

_Version update only_

## 0.12.1
Wed, 13 May 2026 09:25:06 GMT

### Patches

- fix lint errors
- update node to v24

## 0.12.0
Mon, 11 May 2026 06:46:46 GMT

_Version update only_

## 0.11.10
Fri, 08 May 2026 06:36:28 GMT

_Version update only_

## 0.11.9
Tue, 05 May 2026 12:04:46 GMT

_Version update only_

## 0.11.8
Tue, 05 May 2026 09:51:14 GMT

### Patches

- update major dependencies

## 0.11.7
Thu, 30 Apr 2026 07:14:26 GMT

_Version update only_

## 0.11.6
Thu, 30 Apr 2026 06:41:02 GMT

_Version update only_

## 0.11.5
Tue, 28 Apr 2026 12:21:29 GMT

_Version update only_

## 0.11.4
Thu, 23 Apr 2026 05:13:40 GMT

_Version update only_

## 0.11.3
Tue, 21 Apr 2026 11:58:44 GMT

_Version update only_

## 0.11.2
Tue, 21 Apr 2026 09:18:00 GMT

### Patches

- update fullstack example to use options

## 0.11.1
Mon, 20 Apr 2026 09:04:08 GMT

_Version update only_

## 0.11.0
Mon, 13 Apr 2026 13:16:48 GMT

### Minor changes

- use nested doctypes in playground

## 0.10.16
Wed, 01 Apr 2026 14:54:57 GMT

_Version update only_

## 0.10.15
Tue, 31 Mar 2026 14:13:49 GMT

### Updates

- Updated z-index values to adhere to z-index hierarchy guidelines

## 0.10.14
Tue, 31 Mar 2026 12:49:57 GMT

### Updates

- fix nuxt fullstack example

## 0.10.13
Wed, 25 Mar 2026 14:29:05 GMT

_Version update only_

## 0.10.12
Tue, 24 Mar 2026 10:41:22 GMT

### Patches

- update playground to show doctype cardinality

## 0.10.11
Fri, 20 Mar 2026 09:13:21 GMT

_Version update only_

## 0.10.10
Fri, 20 Mar 2026 08:28:51 GMT

_Version update only_

## 0.10.9
Thu, 19 Mar 2026 11:25:47 GMT

### Patches

- update return format on nuxt plugin

## 0.10.8
Thu, 19 Mar 2026 10:18:16 GMT

### Patches

- add name to runtime plugin

## 0.10.7
Thu, 19 Mar 2026 06:26:37 GMT

_Version update only_

## 0.10.6
Thu, 19 Mar 2026 06:12:08 GMT

### Patches

- use Doctype definition class

## 0.10.5
Wed, 18 Mar 2026 12:05:59 GMT

### Patches

- use separate Nuxt composable for Stonecrop setup

## 0.10.4
Wed, 18 Mar 2026 06:27:10 GMT

_Version update only_

## 0.10.3
Tue, 17 Mar 2026 13:56:02 GMT

### Patches

- add stonecrop registry composable to set client and doctype metas

## 0.10.2
Mon, 16 Mar 2026 06:07:45 GMT

_Version update only_

## 0.10.1
Fri, 13 Mar 2026 12:42:27 GMT

_Version update only_

## 0.10.0
Wed, 11 Mar 2026 12:07:57 GMT

_Version update only_

## 0.9.2
Tue, 10 Mar 2026 11:23:09 GMT

### Patches

- expose doctypes directory to runtime config + add fallback for schema fields

## 0.9.1
Tue, 10 Mar 2026 10:44:46 GMT

_Version update only_

## 0.9.0
Mon, 09 Mar 2026 13:28:09 GMT

_Version update only_

## 0.8.13
Wed, 04 Mar 2026 10:33:21 GMT

### Patches

- set doctypes dir relative to apps dir in Nuxt

## 0.8.12
Wed, 04 Mar 2026 09:14:53 GMT

### Patches

- allow configuring route strategy for Nuxt-Stonecrop module

## 0.8.11
Fri, 27 Feb 2026 09:52:57 GMT

### Patches

- update doctype meta import

## 0.8.10
Tue, 24 Feb 2026 12:37:35 GMT

### Patches

- allow components to be rendered correctly

## 0.8.9
Thu, 19 Feb 2026 10:23:03 GMT

### Patches

- avoid duplicate pinia installation

## 0.8.8
Wed, 18 Feb 2026 12:40:37 GMT

_Version update only_

## 0.8.7
Tue, 17 Feb 2026 15:48:19 GMT

### Patches

- update form API usage

## 0.8.6
Mon, 16 Feb 2026 15:59:33 GMT

_Version update only_

## 0.8.5
Mon, 16 Feb 2026 15:53:50 GMT

_Version update only_

## 0.8.4
Mon, 16 Feb 2026 12:52:52 GMT

### Patches

- update deps

## 0.8.3
Mon, 16 Feb 2026 12:41:19 GMT

_Version update only_

## 0.8.2
Mon, 16 Feb 2026 12:36:20 GMT

_Version update only_

## 0.8.1
Mon, 16 Feb 2026 12:31:33 GMT

_Version update only_

## 0.8.0
Sun, 15 Feb 2026 23:48:12 GMT

_Version update only_

## 0.7.9
Mon, 02 Feb 2026 09:13:25 GMT

_Version update only_

## 0.7.8
Mon, 02 Feb 2026 05:56:02 GMT

_Version update only_

## 0.7.7
Fri, 30 Jan 2026 15:29:48 GMT

### Patches

- update nuxt-grafserv configuration for fullstack

## 0.7.6
Thu, 29 Jan 2026 14:44:10 GMT

_Version update only_

## 0.7.5
Thu, 22 Jan 2026 09:30:36 GMT

### Patches

- add npx installer

## 0.7.4
Tue, 20 Jan 2026 08:45:49 GMT

_Version update only_

## 0.7.3
Fri, 16 Jan 2026 10:57:34 GMT

_Version update only_

## 0.7.2
Thu, 15 Jan 2026 12:08:58 GMT

### Patches

- update readme

## 0.7.1
Wed, 14 Jan 2026 13:22:37 GMT

### Patches

- update docs

## 0.7.0
Tue, 13 Jan 2026 09:40:41 GMT

### Minor changes

- add fullstack example

## 0.6.3
Mon, 05 Jan 2026 10:50:40 GMT

### Patches

- update browserslist

## 0.6.2
Wed, 03 Dec 2025 13:42:21 GMT

### Patches

- add Stonecrop playground to Nuxt

## 0.6.1
Wed, 03 Dec 2025 11:14:09 GMT

_Version update only_

## 0.6.0
Fri, 14 Nov 2025 09:26:38 GMT

_Version update only_

## 0.5.0
Wed, 05 Nov 2025 12:38:13 GMT

_Version update only_

## 0.4.37
Fri, 31 Oct 2025 12:25:20 GMT

### Patches

- update dependencies

## 0.4.36
Mon, 27 Oct 2025 18:08:26 GMT

### Patches

- update nuxt to v4

## 0.4.35
Wed, 24 Sep 2025 13:45:35 GMT

_Version update only_

## 0.4.34
Fri, 22 Aug 2025 11:51:31 GMT

_Version update only_

## 0.4.33
Wed, 06 Aug 2025 11:40:05 GMT

_Version update only_

## 0.4.32
Tue, 05 Aug 2025 11:43:23 GMT

_Version update only_

## 0.4.31
Fri, 01 Aug 2025 11:21:44 GMT

### Patches

- update dependencies

## 0.4.30
Fri, 01 Aug 2025 11:03:07 GMT

_Version update only_

## 0.4.29
Fri, 01 Aug 2025 10:23:32 GMT

_Version update only_

## 0.4.28
Wed, 30 Jul 2025 06:18:12 GMT

_Version update only_

## 0.4.27
Mon, 28 Jul 2025 07:35:21 GMT

_Version update only_

## 0.4.26
Thu, 24 Jul 2025 10:51:13 GMT

_Version update only_

## 0.4.25
Wed, 23 Jul 2025 10:44:48 GMT

_Version update only_

## 0.4.24
Wed, 23 Jul 2025 06:27:53 GMT

_Version update only_

## 0.4.23
Mon, 21 Jul 2025 09:55:33 GMT

_Version update only_

## 0.4.22
Mon, 21 Jul 2025 07:27:47 GMT

_Version update only_

## 0.4.21
Mon, 21 Jul 2025 06:17:23 GMT

_Version update only_

## 0.4.20
Tue, 15 Jul 2025 07:37:14 GMT

_Version update only_

## 0.4.19
Tue, 15 Jul 2025 07:15:19 GMT

_Version update only_

## 0.4.18
Wed, 02 Jul 2025 09:19:21 GMT

### Patches

- update dependencies

## 0.4.17
Mon, 23 Jun 2025 12:02:50 GMT

_Version update only_

## 0.4.16
Fri, 23 May 2025 19:01:31 GMT

_Version update only_

## 0.4.15
Wed, 21 May 2025 08:56:14 GMT

_Version update only_

## 0.4.14
Tue, 20 May 2025 08:13:28 GMT

_Version update only_

## 0.4.13
Wed, 14 May 2025 15:59:57 GMT

_Version update only_

## 0.4.12
Tue, 15 Apr 2025 09:33:23 GMT

_Version update only_

## 0.4.11
Wed, 26 Mar 2025 06:51:27 GMT

_Version update only_

## 0.4.10
Fri, 07 Mar 2025 13:49:04 GMT

_Version update only_

## 0.4.9
Thu, 06 Mar 2025 17:20:07 GMT

_Version update only_

## 0.4.8
Tue, 04 Mar 2025 21:22:12 GMT

### Patches

- add incremental builds and watch mode for stories

## 0.4.7
Fri, 28 Feb 2025 14:47:14 GMT

### Patches

- update dependencies

## 0.4.6
Mon, 17 Feb 2025 14:07:39 GMT

_Version update only_

## 0.4.5
Sat, 08 Feb 2025 20:45:28 GMT

_Version update only_

## 0.4.4
Mon, 27 Jan 2025 16:00:06 GMT

_Version update only_

## 0.4.3
Fri, 24 Jan 2025 05:56:48 GMT

_Version update only_

## 0.4.2
Thu, 23 Jan 2025 20:24:26 GMT

_Version update only_

## 0.4.1
Thu, 23 Jan 2025 10:02:28 GMT

### Patches

- setup stonecrop when component has been mounted

## 0.4.0
Tue, 21 Jan 2025 10:56:53 GMT

### Minor changes

- add Nuxt module

### Patches

- update typescript dependency
- lock typescript dependency

