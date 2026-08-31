# Change Log - @stonecrop/graphql-middleware

## 0.30.0
Thu, 27 Aug 2026 12:30:32 GMT

### Minor changes

- Return resolved link display text from stonecropAction, and reduce inline links to their column values before an action reaches its guard or handler

## 0.29.0
Tue, 25 Aug 2026 08:42:39 GMT

_Version update only_

## 0.28.0
Tue, 25 Aug 2026 08:06:54 GMT

_Version update only_

## 0.27.0
Fri, 21 Aug 2026 09:43:22 GMT

### Minor changes

- Add height to StonecropFieldMeta so the field survives the meta query

## 0.26.0
Fri, 21 Aug 2026 08:57:32 GMT

### Minor changes

- Expose the many side of `ON DELETE CASCADE` foreign keys, so a parent type carries the rows it owns

### Patches

- Keep a real `id` column named `id`, moving Relay's identifier to `nodeId`
- Resolve a `primaryKey` declared inside a fieldset instead of refusing the doctype

## 0.25.0
Thu, 20 Aug 2026 09:10:32 GMT

### Minor changes

- Order a limited stonecropRecords read by the declared identity when the caller names no orderBy, so paging cannot skip or repeat a row.
- Order a capped many-side relation by the target's declared identity, so a truncated child list keeps the same rows between reads.

## 0.24.0
Thu, 20 Aug 2026 08:19:12 GMT

### Minor changes

- Restore server-side link display enrichment on stonecropRecord and stonecropRecords; inline link fields return { id, displayText } objects.

## 0.23.0
Tue, 18 Aug 2026 09:16:50 GMT

_Version update only_

## 0.22.0
Mon, 17 Aug 2026 19:46:36 GMT

_Version update only_

## 0.21.0
Mon, 17 Aug 2026 19:08:23 GMT

### Minor changes

- Remove server-side link display enrichment; stonecropRecord and stonecropRecords again return scalar FK values for inline links.

## 0.20.0
Mon, 17 Aug 2026 18:41:19 GMT

_Version update only_

## 0.19.0
Mon, 17 Aug 2026 12:46:25 GMT

### Minor changes

- Include a link's display text alongside its id in record payloads.

## 0.18.0
Fri, 14 Aug 2026 08:05:46 GMT

### Minor changes

- `includeNested: true` now expands lazy links as the name-list form already did, instead of admitting them and silently dropping each one.
- Schema build now refuses a one-side link bound to a field with no database column of its own, which previously failed the whole record read on a missing column at runtime.
- Schema build now refuses a link that binds to nothing — a many-side link with no `backlink`, or a one-side link whose `fieldname ?? key` names no declared field — and the one-side fetch path now honours that same key fallback.
- Many-side link rows are now capped by defaultRecordLimit instead of a hard-coded 50 that declaring the default fetch method silently removed, and truncation is reported in the new truncatedLinks field.
- A one-side link now expands only when its render mode says it should: an inline picker keeps its own id instead of being replaced by the target record, and an expanding link resolves instead of always answering null.
- stonecropAction can now save and create records on the Postgres adapter, writing only the doctype's declared columns and reporting any discarded keys in the new droppedFields field.

## 0.17.0
Tue, 11 Aug 2026 12:49:04 GMT

### Minor changes

- stonecropAction now runs the guard read, the effect and the state write in one transaction with the guarded row locked FOR UPDATE, so a failed action rolls back its handler's writes instead of leaving them committed.
- Add server-side action effects via createStonecropPlugin({ actionHandlers }), making stateless commands executable
- stonecropRecords now applies a default row cap of 200 when the caller names no limit, configurable via createStonecropPlugin({ defaultRecordLimit }), and reports the true total rather than the page size.
- Answer hasMore on every list query by requesting one row past the limit, and make the total opt-in behind a new includeTotal argument so a full-scan COUNT no longer runs on every list read.
- Report an action against a nonexistent record as missing instead of guarding around it, which could report success while writing nothing
- Schema build now refuses a doctype whose link or `inherits` names a doctype nothing registered, instead of silently dropping the relation at fetch time; the unused `validateReferences` export is removed.
- Resolve a record's identity field through getRecordIdField, so this adapter and the client name the same field — a doctype declaring no primaryKey is now fetchable through the id fallback instead of answering data: null. When no identity can be resolved at all, stonecropRecord and link target lookups throw instead of reporting not-found.
- Saving a record that does not exist now creates it: GuardedTransitionIO.writeData is an upsert and takes an `exists` flag, so creation goes through stonecropAction rather than a create mutation
- Verify at schema build that every actionHandlers key names a registered doctype and an action it declares, throwing with every offender listed — an unreachable handler was silently skipped at dispatch. stonecropRecord now also refuses when the declared identity column matches more than one row, instead of returning an arbitrary one.

### Patches

- Correct two public docstrings that promised a transaction the dispatcher never opens: ActionHandlerContext.pgClient claimed it was already inside the mutation's transaction, and GuardedTransitionIO.runEffect claimed a throw meant nothing was written. Dispatch uses sideEffectWithPgClient, so the guard read, the handler and the state write are separate autocommit statements and a handler's own writes are not rolled back

## 0.16.6
Tue, 04 Aug 2026 12:14:33 GMT

### Patches

- Add a cross-adapter conformance test diffing the Postgres adapter against an in-memory host

## 0.16.5
Mon, 03 Aug 2026 11:12:57 GMT

### Patches

- Resolve record identity through the shared getPrimaryKeyField helper so the server and client agree on which key a doctype is addressed by.

## 0.16.4
Tue, 28 Jul 2026 09:58:37 GMT

_Version update only_

## 0.16.3
Wed, 22 Jul 2026 11:52:14 GMT

### Patches

- Clean dist on every build to stop publishing stale artifacts

## 0.16.2
Wed, 22 Jul 2026 08:50:22 GMT

_Version update only_

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

- change StonecropWorkflowAction SDL type
- add clientHandler field to ActionDefinition for client-side JS handler authoring
- add vsPath and extraLibs props to ACodeEditor for offline Monaco support and JS type checking
- align StonecropFieldMeta with ValueFieldSchema: add format/cardinality/source, remove phantom precision/scale; add field-level SDL drift test

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

### Patches

- don't skip display-mode fields

## 0.13.10
Thu, 11 Jun 2026 10:23:31 GMT

### Patches

- document the action handler casing contract on ActionContext and ActionHandler (ADR 0007)

## 0.13.9
Mon, 08 Jun 2026 13:12:21 GMT

### Minor changes

- use new field discriminators for logic branching

## 0.13.8
Thu, 04 Jun 2026 12:04:15 GMT

_Version update only_

## 0.13.7
Thu, 04 Jun 2026 11:09:19 GMT

### Patches

- add tests for fieldset schemas

## 0.13.6
Thu, 04 Jun 2026 09:33:09 GMT

### Patches

- update SQL column building logic

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

_Version update only_

## 0.13.1
Tue, 26 May 2026 14:15:00 GMT

### Patches

- sharpen database-related fields in schemas

## 0.13.0
Wed, 20 May 2026 11:08:30 GMT

### Minor changes

- use plan-step resolvers instead of HTTP queries

## 0.12.8
Mon, 18 May 2026 11:24:35 GMT

### Patches

- add test tags

## 0.12.7
Mon, 18 May 2026 10:41:42 GMT

### Patches

- add missing options for records API

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

- remove blanket ignore for doctype links

## 0.12.2
Wed, 13 May 2026 10:58:06 GMT

### Patches

- allow Display fieldtype for fields without db backing

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

### Patches

- update API reference

## 0.11.4
Thu, 23 Apr 2026 05:13:40 GMT

### Patches

- use correct amber preset inflection for doctypes

## 0.11.3
Tue, 21 Apr 2026 11:58:44 GMT

### Patches

- merge nested results correctly

## 0.11.2
Tue, 21 Apr 2026 09:18:00 GMT

### Patches

- add query construction logic

## 0.11.1
Mon, 20 Apr 2026 09:04:08 GMT

### Patches

- match server and client schema resolution for actions

## 0.11.0
Mon, 13 Apr 2026 13:16:48 GMT

### Minor changes

- remove list and record queries

## 0.10.16
Wed, 01 Apr 2026 14:54:57 GMT

_Version update only_

## 0.10.15
Tue, 31 Mar 2026 14:13:49 GMT

_Version update only_

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

- remove zod externalization

## 0.10.3
Tue, 17 Mar 2026 13:56:02 GMT

### Patches

- add missing field properties in query response

## 0.10.2
Mon, 16 Mar 2026 06:07:45 GMT

_Version update only_

## 0.10.1
Fri, 13 Mar 2026 12:42:27 GMT

### Patches

- remove sideEffects to avoid tree-shaking

## 0.10.0
Wed, 11 Mar 2026 12:07:57 GMT

_Version update only_

## 0.9.2
Tue, 10 Mar 2026 11:23:09 GMT

_Version update only_

## 0.9.1
Tue, 10 Mar 2026 10:44:46 GMT

### Patches

- add mutation builders and write handlers

## 0.9.0
Mon, 09 Mar 2026 13:28:09 GMT

### Minor changes

- only generate ESM output

## 0.8.13
Wed, 04 Mar 2026 10:33:21 GMT

_Version update only_

## 0.8.12
Wed, 04 Mar 2026 09:14:53 GMT

_Version update only_

## 0.8.11
Fri, 27 Feb 2026 09:52:57 GMT

### Patches

- allow configurable PKs for graphql inflection

## 0.8.10
Tue, 24 Feb 2026 12:37:35 GMT

### Patches

- use pluralize to correct inflection output

## 0.8.9
Thu, 19 Feb 2026 10:23:03 GMT

### Patches

- fix field argument resolvers for stonecrop

## 0.8.8
Wed, 18 Feb 2026 12:40:37 GMT

### Patches

- remove conflicting scalar description

## 0.8.7
Tue, 17 Feb 2026 15:48:19 GMT

### Patches

- update schema API exports

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

### Patches

- update deps

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

- add GraphQL middleware package

