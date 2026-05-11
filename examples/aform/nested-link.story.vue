<template>
	<Story title="nested link" group="aform">
		<Variant title="schema with links">
			<div>
				<h3>Schema-Driven Relationships</h3>
				<p>
					Two doctypes are registered: <code>recipe</code> and <code>recipe-task</code>. <code>recipe</code> declares a
					<code>tasks</code> link targeting <code>recipe-task</code>, so
					<code>getAncestorLinks('recipe-task')</code> returns an entry. <code>recipe</code> also declares a
					self-referential <code>supersededBy</code> link (<code>atMostOne → recipe</code>).
				</p>
				<h4>getDescendantLinks('recipe')</h4>
				<pre>{{ JSON.stringify(recipeDescendants, null, 2) }}</pre>
				<h4>getAncestorLinks('recipe-task')</h4>
				<pre>{{ JSON.stringify(taskAncestors, null, 2) }}</pre>
			</div>
		</Variant>

		<Variant title="resolved schema">
			<div>
				<h3>Resolved Schema (resolveSchema)</h3>
				<p>
					<code>registry.resolveSchema()</code> walks the doctype's <code>links</code> declarations, resolves each
					target doctype, and embeds a <code>schema</code> array on 1:1 entries or a <code>schema</code> array with
					<code>kind: 'table'</code> on 1:many entries. AForm checks <code>'schema' in field</code>
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
							...((f as any).kind === 'table'
								? { kind: 'table', schema: `[${(f as any).schema?.length ?? 0} fields]` }
								: {}),
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
							...((f as any).kind === 'table'
								? { kind: 'table', schema: `[${(f as any).schema?.length ?? 0} fields]` }
								: {}),
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
import recipeTaskSchemaJson from './assets/links/recipe_task_schema.json'
import cardinalityDemoSchemaJson from './assets/links/cardinality_demo_schema.json'

const recipeDoctype = Doctype.fromObject(recipeSchemaJson as DoctypeConfig)
const recipeTaskDoctype = Doctype.fromObject(recipeTaskSchemaJson as DoctypeConfig)
const allCardinalitiesDoctype = Doctype.fromObject(cardinalityDemoSchemaJson as DoctypeConfig)

const registry = new Registry()
registry.addDoctype(recipeDoctype)
registry.addDoctype(recipeTaskDoctype)
registry.addDoctype(allCardinalitiesDoctype)

// Query the registry for relationships
const recipeDescendants = registry.getDescendantLinks('recipe')
const taskAncestors = registry.getAncestorLinks('recipe-task')

// Resolved schemas for rendering
const resolvedSchema = ref(registry.resolveSchema(recipeDoctype))
const allCardinalitiesResolved = ref(registry.resolveSchema(allCardinalitiesDoctype))

// Scaffold the record shape from the schema, then seed realistic display values.
// initializeRecord derives the correct shape (empty strings, [], nested {}) from the
// resolved schema — users should rely on this rather than manually constructing the shape.
const recipeData = ref({
	...registry.initializeRecord(resolvedSchema.value),
	name: 'Sourdough Bread',
	description: 'Classic long-fermentation sourdough',
	status: 'draft',
	tasks: [
		{ name: 'Mix dough', description: 'Combine flour, water, salt and starter' },
		{ name: 'Bulk ferment', description: 'Rest at room temperature for 4–6 hours' },
		{ name: 'Shape and proof', description: 'Shape loaf and cold-proof overnight' },
	],
})
</script>

<docs lang="md">
# Links

Demonstrates the `links` system — schema-declared relationships between doctypes. Links make relationship metadata first-class: cardinality, direction, and target are declared on the doctype rather than inferred from field names or database conventions.

For rendering resolved schemas in `AForm`, see [nested schema](./nested.story.vue).

## Schema with links

Doctype relationships are declared in the `links` object alongside `fields`. The `fields` array contains both scalar fields and Link fields (`fieldtype: 'Link'`), positioned at the location where they should render:

```typescript
Doctype.fromObject({
	slug: 'recipe',
	fields: [
		{ fieldname: 'name', fieldtype: 'Data' },
		{ fieldname: 'tasks', fieldtype: 'Link', options: 'recipe-task' },
		{ fieldname: 'status', fieldtype: 'Data' },
	],
	links: {
		tasks: { target: 'recipe-task', cardinality: 'noneOrMany', backlink: 'recipe', fieldname: 'tasks' },
		supersededBy: { target: 'recipe', cardinality: 'atMostOne', backlink: 'supersededBy', fieldname: 'supersededBy' },
	},
})
```

The Registry indexes these at load time. Two accessors expose the graph:

- `registry.getDescendantLinks(slug)` — links declared _on_ this doctype (pointing outward)
- `registry.getAncestorLinks(slug)` — links on _other_ doctypes that point back here via `backlink`

## Scaffolding record data

Use `registry.initializeRecord(registry.resolveSchema(doctype))` to derive an empty record whose shape matches the schema, then patch in display values:

```typescript
const recipeData = ref({
	...registry.initializeRecord(registry.resolveSchema(recipeDoctype)),
	name: 'Sourdough Bread',
	status: 'draft',
	tasks: [{ name: 'Mix dough', description: '...' }],
})
```

`initializeRecord` produces correct defaults per field type: `''` for Data fields, `[]` for `noneOrMany`/`atLeastOne` links, and a nested initialized object for `one`/`atMostOne` links. Hard-coding the shape directly bypasses this and will silently break if the linked doctype's fields change.

## Resolved schema

`registry.resolveSchema()` produces a flat `SchemaTypes[]` ready for `AForm`. For each link entry it embeds the child schema directly on the field object:

- **1:1 links** (`atMostOne`, `one`) — `schema: SchemaTypes[]` attached; AForm renders a nested form
- **1:many links** (`noneOrMany`, `atLeastOne`) — `schema` array + `kind: 'table'`; ATable derives its own columns

AForm has no knowledge of the registry — it checks `'schema' in field && kind !== 'table'` to decide whether to recurse into a nested form.

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
