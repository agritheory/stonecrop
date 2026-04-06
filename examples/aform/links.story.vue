<template>
	<Story title="links" group="aform">
		<Variant title="schema with links">
			<div>
				<h3>Schema-Driven Relationships</h3>
				<p>
					Two doctypes are registered: <code>recipe</code> (with layout) and <code>recipe-nolayout</code> (without).
					Both declare a <code>tasks</code> link targeting <code>recipe-task</code>, so
					<code>getAncestorLinks('recipe-task')</code> returns an entry for each. <code>recipe</code> also declares a
					self-referential <code>supersededBy</code> link (<code>atMostOne → recipe</code>).
				</p>
				<h4>getDescendantLinks('recipe')</h4>
				<pre>{{ JSON.stringify(recipeDescendants, null, 2) }}</pre>
				<h4>getAncestorLinks('recipe-task')</h4>
				<pre>{{ JSON.stringify(taskAncestors, null, 2) }}</pre>
			</div>
		</Variant>

		<Variant title="layout render order">
			<div>
				<h3>Layout: Controlled Render Order</h3>
				<p>
					The <code>layout</code> array
					<code>['name', 'status', 'description', 'tasks', 'supersededBy']</code> interleaves scalar fields and links.
					Without <code>layout</code>, scalar fields always render before links.
				</p>
				<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem">
					<div>
						<h4>With layout (tasks between scalar fields)</h4>
						<pre>{{
							JSON.stringify(
								withLayout.map(f => f.fieldname),
								null,
								2
							)
						}}</pre>
						<AForm :schema="withLayout" v-model:data="recipeData" />
					</div>
					<div>
						<h4>Without layout (links appended after scalars)</h4>
						<pre>{{
							JSON.stringify(
								withoutLayout.map(f => f.fieldname),
								null,
								2
							)
						}}</pre>
						<AForm :schema="withoutLayout" v-model:data="recipeData" />
					</div>
				</div>
			</div>
		</Variant>

		<Variant title="resolved schema">
			<div>
				<h3>Resolved Schema (resolveSchema)</h3>
				<p>
					<code>registry.resolveSchema()</code> walks the doctype's <code>links</code> declarations, resolves each
					target doctype, and embeds a <code>schema</code> array on 1:1 entries or a <code>columns</code> array on
					1:many entries. AForm checks <code>'schema' in field</code>
					and recurses automatically — no knowledge of the registry is required at render time.
				</p>
				<p>See <strong>nested schema → resolved schema</strong> for the rendered result.</p>
				<h4>Resolved schema structure</h4>
				<pre>{{
					JSON.stringify(
						resolvedSchema.map(f => ({
							fieldname: f.fieldname,
							component: f.component,
							...('schema' in f ? { schema: `[${(f as any).schema.length} fields]` } : {}),
							...('columns' in f ? { columns: `[${(f as any).columns?.length ?? 0} columns]` } : {}),
						})),
						null,
						2
					)
				}}</pre>
			</div>
		</Variant>

		<Variant title="cardinality types">
			<div>
				<h3>All Four Cardinality Types</h3>
				<p>
					The four cardinality values control how <code>resolveSchema</code> renders a link. The two
					<em>many</em> values produce an ATable entry; the two <em>singular</em> values embed an AForm. The difference
					between <code>one</code>/<code>noneOrMany</code> and <code>atMostOne</code>/<code>atLeastOne</code> is
					semantic — it signals to the application whether the relationship is required or optional — the rendered
					components are identical.
				</p>
				<table style="border-collapse: collapse; width: 100%; margin-bottom: 1rem">
					<thead>
						<tr style="text-align: left; border-bottom: 1px solid #ccc">
							<th style="padding: 0.5rem 1rem">Cardinality</th>
							<th style="padding: 0.5rem 1rem">Meaning</th>
							<th style="padding: 0.5rem 1rem">Resolves to</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td style="padding: 0.5rem 1rem"><code>one</code></td>
							<td style="padding: 0.5rem 1rem">Exactly 1 — required</td>
							<td style="padding: 0.5rem 1rem">AForm with embedded schema</td>
						</tr>
						<tr>
							<td style="padding: 0.5rem 1rem"><code>atMostOne</code></td>
							<td style="padding: 0.5rem 1rem">0 or 1 — optional</td>
							<td style="padding: 0.5rem 1rem">AForm with embedded schema</td>
						</tr>
						<tr>
							<td style="padding: 0.5rem 1rem"><code>noneOrMany</code></td>
							<td style="padding: 0.5rem 1rem">0 or more — optional list</td>
							<td style="padding: 0.5rem 1rem">ATable with auto-derived columns</td>
						</tr>
						<tr>
							<td style="padding: 0.5rem 1rem"><code>atLeastOne</code></td>
							<td style="padding: 0.5rem 1rem">1 or more — required list</td>
							<td style="padding: 0.5rem 1rem">ATable with auto-derived columns</td>
						</tr>
					</tbody>
				</table>
				<h4>Resolved schema entries for a doctype with all four cardinalities</h4>
				<pre>{{
					JSON.stringify(
						allCardinalitiesResolved.map(f => ({
							fieldname: f.fieldname,
							component: f.component,
							...('schema' in f ? { schema: `[${(f as any).schema.length} fields]` } : {}),
							...('columns' in f ? { columns: `[${(f as any).columns?.length ?? 0} columns]` } : {}),
						})),
						null,
						2
					)
				}}</pre>
			</div>
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import { Registry, Doctype, type DoctypeConfig } from '@stonecrop/stonecrop'
import { ref } from 'vue'

import recipeSchemaJson from './assets/links/recipe_schema.json'
import recipeNolayoutSchemaJson from './assets/links/recipe_nolayout_schema.json'
import recipeTaskSchemaJson from './assets/links/recipe_task_schema.json'
import cardinalityDemoSchemaJson from './assets/links/cardinality_demo_schema.json'

const recipeDoctype = Doctype.fromObject(recipeSchemaJson as DoctypeConfig)
const recipeNolayoutDoctype = Doctype.fromObject(recipeNolayoutSchemaJson as DoctypeConfig)
const recipeTaskDoctype = Doctype.fromObject(recipeTaskSchemaJson as DoctypeConfig)
const allCardinalitiesDoctype = Doctype.fromObject(cardinalityDemoSchemaJson as DoctypeConfig)

const registry = new Registry()
registry.addDoctype(recipeDoctype)
registry.addDoctype(recipeNolayoutDoctype)
registry.addDoctype(recipeTaskDoctype)
registry.addDoctype(allCardinalitiesDoctype)

// Query the registry for relationships
const recipeDescendants = registry.getDescendantLinks('recipe')
const taskAncestors = registry.getAncestorLinks('recipe-task')

// Resolved schemas for rendering
const resolvedSchema = ref(registry.resolveSchema(recipeDoctype))
const withLayout = ref(registry.resolveSchema(recipeDoctype))
const withoutLayout = ref(registry.resolveSchema(recipeNolayoutDoctype))
const allCardinalitiesResolved = ref(registry.resolveSchema(allCardinalitiesDoctype))

const recipeData = ref({
	name: 'Sourdough Bread',
	description: 'Classic long-fermentation sourdough',
	status: 'draft',
	tasks: [
		{ name: 'Mix dough', description: 'Combine flour, water, salt and starter' },
		{ name: 'Bulk ferment', description: 'Rest at room temperature for 4–6 hours' },
		{ name: 'Shape and proof', description: 'Shape loaf and cold-proof overnight' },
	],
	supersededBy: null,
})
</script>

<docs lang="md">
# Links

Demonstrates the `links` system — schema-declared relationships between doctypes. Links make relationship metadata first-class: cardinality, direction, and target are declared on the doctype rather than inferred from field names or database conventions.

For rendering resolved schemas in `AForm`, see [nested schema](./nested.story.vue).

## Schema with links

Doctype relationships are declared in the `links` object alongside `fields`:

```typescript
Doctype.fromObject({
	slug: 'recipe',
	fields: [
		/* scalar fields only */
	],
	links: {
		tasks: { target: 'recipe-task', cardinality: 'noneOrMany', backlink: 'recipe' },
		supersededBy: { target: 'recipe', cardinality: 'atMostOne', backlink: 'supersededBy' },
	},
})
```

The Registry indexes these at load time. Two accessors expose the graph:

- `registry.getDescendantLinks(slug)` — links declared _on_ this doctype (pointing outward)
- `registry.getAncestorLinks(slug)` — links on _other_ doctypes that point back here via `backlink`

Multiple doctypes can declare links with the same `backlink` name. The story registers both
`recipe` and `recipe-nolayout` (both declare `tasks → recipe-task` with `backlink: 'recipe'`),
so `getAncestorLinks('recipe-task')` returns an entry for each.

## Layout render order

The optional `layout` array controls the order in which scalar fields and links render. Without it, scalar fields always appear before links. With it, links can be interleaved freely:

```typescript
layout: ['name', 'tasks', 'status', 'description', 'supersededBy']
// tasks renders between scalar fields, not appended at the end
```

## Resolved schema

`registry.resolveSchema()` produces a flat `SchemaTypes[]` ready for `AForm`. For each link entry it embeds the child schema directly on the field object:

- **1:1 links** (`atMostOne`, `one`) — `schema: SchemaTypes[]` attached; AForm renders a nested form
- **1:many links** (`noneOrMany`, `atLeastOne`) — `columns` derived from child fields; AForm renders a table

The resulting array respects `layout` ordering. AForm has no knowledge of the registry — it only checks `'schema' in field` to decide whether to recurse.

## Cardinality types

All four cardinality values are valid on `LinkDeclaration`:

| Value        | Meaning                   | Renders as |
| ------------ | ------------------------- | ---------- |
| `one`        | Exactly 1 — required      | AForm      |
| `atMostOne`  | 0 or 1 — optional         | AForm      |
| `noneOrMany` | 0 or more — optional list | ATable     |
| `atLeastOne` | 1 or more — required list | ATable     |

The cardinality value is semantic: the registry uses it to determine the default rendering component but does not enforce the constraint at the UI level. Application-level validation is the caller's responsibility.
</docs>
