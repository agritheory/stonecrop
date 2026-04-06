<template>
	<Story title="links" group="aform">
		<Variant title="schema with links">
			<div>
				<h3>Schema-Driven Relationships</h3>
				<p>
					Recipe declares two links: <code>tasks</code> (noneOrMany → recipe-task) and
					<code>supersededBy</code> (atMostOne → recipe, self-referential).
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
					The <code>layout</code> array on Recipe controls where each field and link renders. Without
					<code>layout</code>, scalar fields render first, then links.
				</p>
				<p>Layout: {{ recipeDoctype.layout?.join(', ') }}</p>
			</div>
		</Variant>

		<Variant title="resolved schema">
			<div>
				<h3>Resolved Schema (resolveSchema)</h3>
				<p>
					For 1:1 nested forms, <code>registry.resolveSchema()</code> processes the doctype's
					<code>links</code> declarations and embeds child schemas into the resolved output. The
					<code>links</code> object provides relationship metadata for query building.
				</p>
			</div>
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import type { SchemaTypes } from '@stonecrop/aform'
import { Registry, Doctype } from '@stonecrop/stonecrop'

// Define the Recipe doctype with links
const recipeDoctype = Doctype.fromObject({
	name: 'Recipe',
	slug: 'recipe',
	tableName: 'recipe',
	fields: [
		{ fieldname: 'name', fieldtype: 'Data', component: 'ATextInput', label: 'Recipe Name', required: true },
		{ fieldname: 'description', fieldtype: 'Data', component: 'ATextInput', label: 'Description' },
		{ fieldname: 'status', fieldtype: 'Data', component: 'ATextInput', label: 'Status', required: true, mode: 'read' },
	] as SchemaTypes[],
	links: {
		tasks: {
			target: 'recipe-task',
			cardinality: 'noneOrMany',
			backlink: 'recipe',
		},
		supersededBy: {
			target: 'recipe',
			cardinality: 'atMostOne',
			backlink: 'supersededBy',
		},
	},
	layout: ['name', 'status', 'description', 'tasks', 'supersededBy'],
})

const recipeTaskDoctype = Doctype.fromObject({
	name: 'RecipeTask',
	slug: 'recipe-task',
	tableName: 'recipe_task',
	fields: [
		{ fieldname: 'name', fieldtype: 'Data', component: 'ATextInput', label: 'Task Name', required: true },
		{ fieldname: 'description', fieldtype: 'Data', component: 'ATextInput', label: 'Description' },
	] as SchemaTypes[],
	links: {
		recipe: {
			target: 'recipe',
			cardinality: 'one',
			backlink: 'tasks',
		},
	},
})

// Set up registry
const registry = new Registry()
registry.addDoctype(recipeDoctype)
registry.addDoctype(recipeTaskDoctype)

// Query the registry for relationships
const recipeDescendants = registry.getDescendantLinks('recipe')
const taskAncestors = registry.getAncestorLinks('recipe-task')
</script>
