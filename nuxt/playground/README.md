# Stonecrop Nuxt Playground

The default example for `@stonecrop/nuxt`: doctypes **introspected from a live GraphQL API** ([countries.trevorblades.com](https://countries.trevorblades.com/graphql)), browsed through the generic Desktop shell, and refined in the built-in DocBuilder.

```bash
# from the nuxt/ package root
npm run dev        # prepare + launch on http://localhost:3000
```

## The story this example tells

1. **Point the CLI at a GraphQL API** → validated doctype JSON appears in `doctypes/`.
2. **Refine in the DocBuilder** (`/docbuilder`, dev mode only) — introspected field identities are locked, labels and components stay editable.
3. **Browse** — the module's `routeStrategy` mounts a generic list/detail page (`app/views/DoctypePage.vue`) at `/:doctype` and `/:doctype/:id`, backed by [`nuxt-graphql-middleware`](https://nuxt-graphql-middleware.dulnan.net/) proxying the live API.

## How the doctypes were generated (and how to regenerate)

The five GraphQL-backed doctypes (`country`, `continent`, `language`, `state`, `subdivision`) are **generator output, not hand-written files**. From this directory:

```bash
# from the checked-in snapshot (works offline)
stonecrop-schema generate -i introspection.json -o doctypes \
  --include Country,Continent,Language,State,Subdivision \
  --overrides overrides.json

# or against the live endpoint
stonecrop-schema generate -e https://countries.trevorblades.com/graphql -o doctypes \
  --include Country,Continent,Language,State,Subdivision \
  --overrides overrides.json
```

Three files play distinct roles:

| File | Role |
| --- | --- |
| `introspection.json` | What the API said — a checked-in introspection snapshot, so regeneration is reproducible and offline-capable. |
| `overrides.json` | What we decided — every durable hand-tuning (labels like "Flag" and "Phone Code", `readOnly` on `code`). Lives at the playground root, **not** in `doctypes/`, because the module treats every JSON in `doctypes/` as a doctype. |
| `doctypes/*.json` | Pure output. **Never hand-edit the generated ones** — put the tuning in `overrides.json` and re-run the command. |

That equation is enforced in CI: `nuxt/test/playground-doctype-generation.test.ts` fails if the checked-in files aren't byte-identical to generator output for the snapshot + overrides.

Why all five types? Introspection follows the schema's relationships: `Country` links to `State` and `Subdivision`, so excluding them would leave dangling link targets. The nav only surfaces the three interesting ones.

## Provenance: why some fields are locked in the builder

The generator stamps every emitted field with `"source": "introspected"`. The DocBuilder reads that marker and freezes the field's **identity set** (`fieldname`, `fieldtype`, `required`, `options`, `cardinality`) — `fieldname` is the GraphQL binding, so renaming it would silently break reads. Labels, components, and display options stay editable. Fields you add by hand carry no marker and are fully editable.

Builder edits to *generated* doctypes survive only until the next CLI run — durable tuning belongs in `overrides.json`.

## Sample workflow doctypes

`issue`, `assignment`, and `user` are hand-authored fixtures, not API-backed: the countries API is **read-only**, so its doctypes have no workflow states — and the DocBuilder's workflow graph and actions panel need doctypes that do. `issue` is the richest exerciser (branching transition + reopen loop). They render an empty list on their data pages by design.

## What this example deliberately does not show

The countries API accepts no mutations, so actions are no-ops here and no server-side transition enforcement runs. For those, see:

- [`fullstack`](../fullstack) — the middleware **core** (`applyGuardedTransition`) on the app's own GraphQL server, no database.
- [`nuxt_grafserv/playground`](../../nuxt_grafserv/playground) — the full PostGraphile + Postgres integration.

## Generated artifacts

- `schema.graphql` — rewritten by `nuxt-graphql-middleware` (`downloadSchema: 'dev-only'`) on every dev boot; prettier-ignored, its downloaded formatting is canonical.
- `.nuxt/` — Nuxt's generated types; `npm run dev:prepare` (package root) refreshes it.

## Layout

```
playground/
├── doctypes/            # all doctypes — module reads this (docbuilder + routes); sibling of app/ by design
├── introspection.json   # checked-in introspection snapshot
├── overrides.json       # durable hand-tuning applied on regeneration
├── schema.graphql       # generated — see above
├── app/
│   ├── pages/index.vue          # home dashboard
│   ├── views/DoctypePage.vue    # generic list/detail (mounted by routeStrategy, outside pages/)
│   ├── composables/             # doctype glob-loader + Desktop route adapter
│   ├── plugins/stonecrop.client.ts  # registers doctypes + meta resolver
│   └── graphql/                 # nuxt-graphql-middleware operations
└── server/              # nothing app-specific; docbuilder API routes come from the module
```
