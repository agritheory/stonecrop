# Change Log - @stonecrop/schema

This log was last generated on Tue, 25 Aug 2026 08:06:54 GMT and should not be manually modified.

## 0.28.0
Tue, 25 Aug 2026 08:06:54 GMT

_Version update only_

## 0.27.0
Fri, 21 Aug 2026 09:43:22 GMT

### Minor changes

- Add an optional height to ValueField and categorize ASegmentedControl as a select component

## 0.26.0
Fri, 21 Aug 2026 08:57:32 GMT

### Minor changes

- Generate an aggregate doctype per table alongside the entity, named as its plural
- Generate each doctype's `route`, giving a collection and its records one URL segment

### Patches

- Honour an authored `primaryKey`, including one declared inside a fieldset
- Stop writing the internal `kind` discriminant into generated doctype JSON

## 0.25.0
Thu, 20 Aug 2026 09:10:32 GMT

_Version update only_

## 0.24.0
Thu, 20 Aug 2026 08:19:12 GMT

### Patches

- Update LINK_DISPLAY_SUFFIX and linkDisplayFieldname deprecation notes to point at middleware { id, displayText } enrichment.

## 0.23.0
Tue, 18 Aug 2026 09:16:50 GMT

### Updates

- Add Badge component with cell-fill and input-accent presentations for Select fields

## 0.22.0
Mon, 17 Aug 2026 19:46:36 GMT

_Version update only_

## 0.21.0
Mon, 17 Aug 2026 19:08:23 GMT

### Patches

- Deprecate LINK_DISPLAY_SUFFIX and linkDisplayFieldname in favor of native PostGraphile query link objects.

## 0.20.0
Mon, 17 Aug 2026 18:41:19 GMT

_Version update only_

## 0.19.0
Mon, 17 Aug 2026 12:46:25 GMT

### Minor changes

- Add optional `displayField` to doctypes, naming the field shown when a link points at them.

## 0.18.0
Fri, 14 Aug 2026 08:05:46 GMT

_Version update only_

## 0.17.0
Tue, 11 Aug 2026 12:49:04 GMT

### Minor changes

- Add getRecordIdField(fields), the single definition of which field identifies a record. DoctypeMeta now rejects a doctype declaring more than one primaryKey; declaring none stays legal and resolves through the id fallback.
- Return a page from DataClient.getRecords instead of a bare array: the result carries hasMore, so a truncated list is distinguishable from a complete one, plus a count that is opt-in behind the new includeTotal option.

## 0.16.6
Tue, 04 Aug 2026 12:14:33 GMT

_Version update only_

## 0.16.5
Mon, 03 Aug 2026 11:12:57 GMT

### Patches

- Add getPrimaryKeyField/getRecordIdentity and INTROSPECTED_IDENTITY_PROPS; generation now verifies an existing doctype and stamps provenance instead of overwriting it, deriving primaryKey only for an unambiguous id. Replaces --overrides/typeOverrides with --names, and adds --check.

## 0.16.4
Tue, 28 Jul 2026 09:58:37 GMT

### Patches

- [AForm] Currency Component

## 0.16.3
Wed, 22 Jul 2026 11:52:14 GMT

### Patches

- Clean dist on every build to stop publishing stale artifacts

## 0.16.2
Wed, 22 Jul 2026 08:50:22 GMT

### Patches

- Register ATextboxInput as a 'text' component category (replacing ATextarea)

## 0.16.1
Wed, 22 Jul 2026 08:03:10 GMT

### Patches

- [AForm] Quantity Component

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

- add nextState to ActionDefinition
- add clientHandler field to ActionDefinition for client-side JS handler authoring
- add vsPath and extraLibs props to ACodeEditor for offline Monaco support and JS type checking
- add source: 'introspected' provenance marker to ValueField; the GraphQL converter/CLI stamps it on every emitted field

## 0.13.14
Wed, 01 Jul 2026 08:35:25 GMT

_Version update only_

## 0.13.13
Thu, 18 Jun 2026 12:32:33 GMT

_Version update only_

## 0.13.12
Tue, 16 Jun 2026 10:50:50 GMT

_Version update only_

## 0.13.11
Mon, 15 Jun 2026 06:52:28 GMT

_Version update only_

## 0.13.10
Thu, 11 Jun 2026 10:23:31 GMT

_Version update only_

## 0.13.9
Mon, 08 Jun 2026 13:12:21 GMT

### Minor changes

- define new schema types

## 0.13.8
Thu, 04 Jun 2026 12:04:15 GMT

_Version update only_

## 0.13.7
Thu, 04 Jun 2026 11:09:19 GMT

_Version update only_

## 0.13.6
Thu, 04 Jun 2026 09:33:09 GMT

### Patches

- add fieldset fieldtype

## 0.13.5
Tue, 02 Jun 2026 11:07:21 GMT

### Patches

- migrate linter from eslint to oxlint

## 0.13.4
Tue, 02 Jun 2026 07:09:16 GMT

_Version update only_

## 0.13.3
Tue, 02 Jun 2026 05:55:11 GMT

_Version update only_

## 0.13.2
Thu, 28 May 2026 06:18:59 GMT

### Patches

- update conversion tool to treat foreign key as Link field

## 0.13.1
Tue, 26 May 2026 14:15:00 GMT

### Patches

- add PrimaryKey fieldtype

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

- update graphql packages

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

### Patches

- correct type for record response

## 0.12.2
Wed, 13 May 2026 10:58:06 GMT

_Version update only_

## 0.12.1
Wed, 13 May 2026 09:25:06 GMT

### Patches

- update node to v24

## 0.12.0
Mon, 11 May 2026 06:46:46 GMT

### Minor changes

- add table column schema type

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

### Patches

- allow extending in-built field types

## 0.11.4
Thu, 23 Apr 2026 05:13:40 GMT

_Version update only_

## 0.11.3
Tue, 21 Apr 2026 11:58:44 GMT

_Version update only_

## 0.11.2
Tue, 21 Apr 2026 09:18:00 GMT

### Patches

- update get record return type

## 0.11.1
Mon, 20 Apr 2026 09:04:08 GMT

_Version update only_

## 0.11.0
Mon, 13 Apr 2026 13:16:48 GMT

### Minor changes

- add schema validation for schema links

## 0.10.16
Wed, 01 Apr 2026 14:54:57 GMT

_Version update only_

## 0.10.15
Tue, 31 Mar 2026 14:13:49 GMT

### Updates

- Fix type cast for validation error paths

## 0.10.14
Tue, 31 Mar 2026 12:49:57 GMT

_Version update only_

## 0.10.13
Wed, 25 Mar 2026 14:29:05 GMT

_Version update only_

## 0.10.12
Tue, 24 Mar 2026 10:41:22 GMT

### Patches

- add 1:1 and 1:many doctype schema support

## 0.10.11
Fri, 20 Mar 2026 09:13:21 GMT

_Version update only_

## 0.10.10
Fri, 20 Mar 2026 08:28:51 GMT

_Version update only_

## 0.10.9
Thu, 19 Mar 2026 11:25:47 GMT

_Version update only_

## 0.10.8
Thu, 19 Mar 2026 10:18:16 GMT

_Version update only_

## 0.10.7
Thu, 19 Mar 2026 06:26:37 GMT

_Version update only_

## 0.10.6
Thu, 19 Mar 2026 06:12:08 GMT

_Version update only_

## 0.10.5
Wed, 18 Mar 2026 12:05:59 GMT

_Version update only_

## 0.10.4
Wed, 18 Mar 2026 06:27:10 GMT

### Patches

- update zod to v4

## 0.10.3
Tue, 17 Mar 2026 13:56:02 GMT

### Patches

- add new DataClient interface for Stonecrop setup

## 0.10.2
Mon, 16 Mar 2026 06:07:45 GMT

_Version update only_

## 0.10.1
Fri, 13 Mar 2026 12:42:27 GMT

### Patches

- update masking documentation

## 0.10.0
Wed, 11 Mar 2026 12:07:57 GMT

_Version update only_

## 0.9.2
Tue, 10 Mar 2026 11:23:09 GMT

_Version update only_

## 0.9.1
Tue, 10 Mar 2026 10:44:46 GMT

### Patches

- update eslint and tsconfig

## 0.9.0
Mon, 09 Mar 2026 13:28:09 GMT

### Minor changes

- only generate ESM output

## 0.8.13
Wed, 04 Mar 2026 10:33:21 GMT

### Patches

- update README with CLI documentation

## 0.8.12
Wed, 04 Mar 2026 09:14:53 GMT

_Version update only_

## 0.8.11
Fri, 27 Feb 2026 09:52:57 GMT

### Patches

- add route context type

## 0.8.10
Tue, 24 Feb 2026 12:37:35 GMT

_Version update only_

## 0.8.9
Thu, 19 Feb 2026 10:23:03 GMT

### Patches

- update dependencies

## 0.8.8
Wed, 18 Feb 2026 12:40:37 GMT

_Version update only_

## 0.8.7
Tue, 17 Feb 2026 15:48:19 GMT

### Patches

- replace DDL generator with GraphQL generator

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

_Version update only_

## 0.7.6
Thu, 29 Jan 2026 14:44:10 GMT

_Version update only_

## 0.7.5
Thu, 22 Jan 2026 09:30:36 GMT

_Version update only_

## 0.7.4
Tue, 20 Jan 2026 08:45:49 GMT

_Version update only_

## 0.7.3
Fri, 16 Jan 2026 10:57:34 GMT

_Version update only_

## 0.7.2
Thu, 15 Jan 2026 12:08:58 GMT

_Version update only_

## 0.7.1
Wed, 14 Jan 2026 13:22:37 GMT

### Patches

- update docs

## 0.7.0
Tue, 13 Jan 2026 09:40:41 GMT

### Minor changes

- add schema package

