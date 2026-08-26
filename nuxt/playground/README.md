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

The five GraphQL-backed doctypes (`country`, `continent`, `language`, `state`, `subdivision`) were **scaffolded by the generator and have since been curated**. From this directory:

```bash
# from the checked-in snapshot (works offline)
stonecrop-schema generate -i introspection.json -o doctypes \
  --include Country,Continent,Language,State,Subdivision

# or against the live endpoint
stonecrop-schema generate -e https://countries.trevorblades.com/graphql -o doctypes \
  --include Country,Continent,Language,State,Subdivision

# report drift without writing — what CI runs
stonecrop-schema generate -i introspection.json -o doctypes --check \
  --include Country,Continent,Language,State,Subdivision
```

Re-running that command over these files is a **no-op**. Once a doctype exists it is the source of truth: generation verifies each field against the schema, adds `"source": "introspected"` markers, and *reports* anything it disagrees with instead of overwriting it. Hand-tuning survives regeneration, which is why there is no side file of overrides to keep in sync.

Two files play distinct roles:

| File | Role |
| --- | --- |
| `introspection.json` | What the API said — a checked-in introspection snapshot, so regeneration is reproducible and offline-capable. |
| `doctypes/*.json` | The doctypes themselves, curation included. Edit them directly, in the DocBuilder or by hand. |

That no-op property is enforced in CI: `nuxt/test/playground-doctype-generation.test.ts` fails if regenerating would change any checked-in file.

The one thing this costs: a **first** generation into an empty directory produces raw output — `"Aws Region"`, not `"AWS Region"`. Generate once, curate, and every run after that preserves the curation.

Why all five types? Introspection follows the schema's relationships: `Country` links to `State` and `Subdivision`, so excluding them would leave dangling link targets. The nav only surfaces the three interesting ones.

## Provenance: why some fields are locked in the builder

The generator stamps every emitted field with `"source": "introspected"`. The DocBuilder reads that marker and freezes the field's **identity set** (`fieldname`, `primaryKey`, `required`, `options`, `cardinality`, `doctype`) — `fieldname` is the GraphQL binding, so renaming it would silently break reads, and `doctype` is the link's FK target. Labels, components, and display options stay editable. Fields you add by hand carry no marker and are fully editable.

Builder edits survive regeneration. The CLI only ever adds provenance markers to an existing doctype; identity it disagrees with is reported for a human to adjudicate, never rewritten.

## Sample workflow doctypes

`issue`, `assignment`, and `user` are hand-authored fixtures, not API-backed: the countries API is **read-only**, so its doctypes have no workflow states — and the DocBuilder's workflow graph and actions panel need doctypes that do. `issue` is the richest exerciser (branching transition + reopen loop). They render an empty list on their data pages by design.

## What this example deliberately does not show

The countries API accepts no mutations, so actions are no-ops here and no server-side transition enforcement runs. For those, see:

- [`fullstack`](../fullstack) — the middleware **core** (`applyGuardedTransition`) on the app's own GraphQL server, no database.
- [`nuxt_grafserv/playground`](../../nuxt_grafserv/playground) — the full PostGraphile + Postgres integration.

## Generated artifacts

- `schema.graphql` — rewritten by `nuxt-graphql-middleware` (`downloadSchema: 'dev-only'`) on every dev boot; excluded from formatting, its downloaded formatting is canonical.
- `.nuxt/` — Nuxt's generated types; `npm run dev:prepare` (package root) refreshes it.

## Layout

```
playground/
├── doctypes/            # all doctypes — module reads this (docbuilder + routes); sibling of app/ by design
├── introspection.json   # checked-in introspection snapshot
├── schema.graphql       # generated — see above
├── app/
│   ├── pages/index.vue          # home dashboard
│   ├── views/DoctypePage.vue    # generic list/detail (mounted by routeStrategy, outside pages/)
│   ├── composables/             # doctype glob-loader + Desktop route adapter
│   ├── plugins/stonecrop.client.ts  # registers doctypes + meta resolver
│   └── graphql/                 # nuxt-graphql-middleware operations
└── server/              # nothing app-specific; docbuilder API routes come from the module
```
