import { W as markRaw } from "./vendor-BFYlYCwc.js";
let searchData$1 = { "index": [{ "id": 0, "text": "Fetch Strategies #\nDemonstrates the fetch property on LinkDeclaration and how it affects data loading behavior.\nSync Fetch #\nLinked data is included in the initial GraphQL query. Use for data that is:\n\nSmall and always needed\nRequired for workflow actions\nCheap to include in every query\n\nLazy Fetch #\nLinked data is loaded on demand in a separate query. Use for data that is:\n\nLarge or expensive to load\nRarely needed\nUser-initiated\n\nblockWorkflows #\nControls whether workflow actions are blocked until linked data loads:\n\nsync links default to blockWorkflows: true\nlazy links default to blockWorkflows: false\nCan be overridden explicitly on either strategy\n\n" }, { "id": 1, "text": "AFormLink #\nA form input for selecting and navigating to linked documents. Handles display, search/selection via a dropdown, and navigation to the linked record.\nModes #\n\n\n\nMode\nInput\nArrow\nDropdown\n\n\n\n\nedit\nEnabled\nVisible (if has id)\nOpens on focus/type\n\n\nread\nDisabled\nVisible (if has id)\nNever opens\n\n\ndisplay\nHidden\nHidden\n—\n\n\n\nValue shape — AFormLinkValue #\ntypescriptinterface AFormLinkValue {\n	id: string | number // the linked record's ID; id: 0 is valid\n	displayText?: string // shown in the input; falls back to String(id)\n	[extra: string]: any // extra fields available to formatter\n}\n\nWhen id is falsy ('', null, undefined), the component shows a — placeholder and hides the navigation arrow.\nProps #\ntypescript{\n  modelValue: AFormLinkValue\n  label?: string\n  doctype?: string          // target doctype slug for navigation\n  filterFunction?: (search: string) => AFormLinkValue[] | Promise<AFormLinkValue[]>\n  isAsync?: boolean         // show loading state while filterFunction resolves\n  formatter?: (value: AFormLinkValue) => string  // custom display text transform\n  icon?: 'arrow-right' | 'chevron-right'\n  disabled?: boolean\n  mode?: 'edit' | 'read' | 'display'\n}\n\nFilter function #\nProvide filterFunction to enable the search dropdown. The function receives the current input text and returns matching AFormLinkValue[]. For async lookups, set isAsync: true to show a loading indicator while the promise resolves.\ntypescript// Sync\nconst filterFunction = (search: string) =>\n	records.filter(r => r.name.toLowerCase().includes(search.toLowerCase())).map(r => ({ id: r.id, displayText: r.name }))\n\n// Async\nconst filterFunction = async (search: string) => {\n	const results = await api.search(search)\n	return results.map(r => ({ id: r.id, displayText: r.name }))\n}\n\nNavigation #\nAFormLink uses provide/inject for navigation so it remains decoupled from vue-router. Provide aformLinkNavigator once in your app plugin:\ntypescriptimport type { AFormLinkNavigator } from '@stonecrop/aform'\n\napp.provide('aformLinkNavigator', {\n	navigate(doctype: string, id: string | number) {\n		router.push(`/${doctype}/${id}`)\n	},\n} satisfies AFormLinkNavigator)\n\nIf no navigator is provided, the arrow is still rendered when hasValidId is true but clicks are no-ops.\nVia resolveSchema #\nFor fieldtype: 'Link' fields with no matching links declaration, resolveSchema() automatically assigns component: 'AFormLink' and sets doctype from field.options. No manual wiring needed:\ntypescriptconst config: DoctypeConfig = {\n	slug: 'sales-order',\n	fields: [{ fieldname: 'territory', fieldtype: 'Link', options: 'territory', label: 'Territory' }],\n	// no 'links' entry for territory — resolveSchema handles it\n}\n\nconst resolved = registry.resolveSchema(registry.registry['sales-order'])\n// resolved[0] === { fieldname: 'territory', component: 'AFormLink', doctype: 'territory', label: 'Territory', ... }\n\n" }, { "id": 2, "text": "Links #\nDemonstrates the links system — schema-declared relationships between doctypes. Links make relationship metadata first-class: cardinality, direction, and target are declared on the doctype rather than inferred from field names or database conventions.\nFor rendering resolved schemas in AForm, see nested schema.\nSchema with links #\nDoctype relationships are declared in the links object alongside fields. The fields array contains both scalar fields and Link fields (fieldtype: 'Link'), positioned at the location where they should render:\ntypescriptDoctype.fromObject({\n	slug: 'recipe',\n	fields: [\n		{ fieldname: 'name', fieldtype: 'Data' },\n		{ fieldname: 'tasks', fieldtype: 'Link', options: 'recipe-task' },\n		{ fieldname: 'status', fieldtype: 'Data' },\n	],\n	links: {\n		tasks: { target: 'recipe-task', cardinality: 'noneOrMany', backlink: 'recipe', fieldname: 'tasks' },\n		supersededBy: { target: 'recipe', cardinality: 'atMostOne', backlink: 'supersededBy', fieldname: 'supersededBy' },\n	},\n})\n\nThe Registry indexes these at load time. Two accessors expose the graph:\n\nregistry.getDescendantLinks(slug) — links declared on this doctype (pointing outward)\nregistry.getAncestorLinks(slug) — links on other doctypes that point back here via backlink\n\nScaffolding record data #\nUse registry.initializeRecord(registry.resolveSchema(doctype)) to derive an empty record whose shape matches the schema, then patch in display values:\ntypescriptconst recipeData = ref({\n	...registry.initializeRecord(registry.resolveSchema(recipeDoctype)),\n	name: 'Sourdough Bread',\n	status: 'draft',\n	tasks: [{ name: 'Mix dough', description: '...' }],\n})\n\ninitializeRecord produces correct defaults per field type: '' for Data fields, [] for noneOrMany/atLeastOne links, and a nested initialized object for one/atMostOne links. Hard-coding the shape directly bypasses this and will silently break if the linked doctype's fields change.\nResolved schema #\nregistry.resolveSchema() produces a flat SchemaTypes[] ready for AForm. For each link entry it embeds the child schema directly on the field object:\n\n1:1 links (atMostOne, one) — schema: SchemaTypes[] attached; AForm renders a nested form\n1:many links (noneOrMany, atLeastOne) — schema array + kind: 'table'; ATable derives its own columns\n\nAForm has no knowledge of the registry — it checks 'schema' in field && kind !== 'table' to decide whether to recurse into a nested form.\nCardinality types #\nAll four cardinality values are valid on LinkDeclaration:\n\n\n\nValue\nMeaning\nRenders as\n\n\n\n\none\nExactly 1 — required\nAForm\n\n\natMostOne\n0 or 1 — optional\nAForm\n\n\nnoneOrMany\n0 or more — optional list\nATable\n\n\natLeastOne\n1 or more — required list\nATable\n\n\n\nThe cardinality value is semantic: the registry uses it to determine the default rendering component but does not enforce the constraint at the UI level. Application-level validation is the caller's responsibility.\n" }, { "id": 3, "text": `Nested Schema Support #
Demonstrates how Registry.resolveSchema() embeds child schemas on Doctype fields.
For 1:1 nested forms, it attaches schema arrays; for 1:many tables (cardinality: 'noneOrMany'),
it auto-derives table columns. AForm renders both patterns without knowing anything about the Registry.
How It Works #
1:1 (Doctype fields, default cardinality) #

Register doctypes in the Registry
Call registry.resolveSchema(schema) — attaches schema arrays to Doctype fields
Pass the resolved schema to <AForm> — it checks 'schema' in field and recurses

1:Many (Doctype fields with cardinality: 'noneOrMany') #

Register parent and child doctypes in the Registry
Call registry.resolveSchema(schema) — for links with cardinality: 'noneOrMany', auto-derives
columns from the child doctype's schema, sets component: 'ATable' and config: { view: 'list' }
Pass the resolved schema to <AForm> — the child array data at data[fieldname]
flows into ATable's rows via the componentProps fallback

AForm is a pure renderer. Resolution lives in the framework (Registry).
Variants #
Resolved Schema #
Shows registry.resolveSchema() for 1:1 nesting. One call, one <AForm>, automatic nesting.
Standalone (no framework) #
Manually attaches a schema array to a field. No Registry, no framework.
HST Integration #
A single resolved schema passed to one <AForm>, with HST managing the underlying state tree.
1:Many (Address List) #
A parent Customer form with scalar fields + an addresses array rendered as ATable.
resolveSchema() auto-derives columns from the Address doctype. Users can override
columns, config, or component by specifying them explicitly on the schema field.
Usage #
typescript// 1:1 nesting (default cardinality)
const resolved = registry.resolveSchema(customerSchema)
// resolved[3].schema === [street, city, state, zip_code]

// 1:many table (cardinality: 'noneOrMany')
const resolved = registry.resolveSchema(customerWithAddressesSchema)
// resolved[3].columns === [{ name: 'street', ... }, { name: 'city', ... }, ...]
// resolved[3].component === 'ATable'

<AForm :schema="resolved" v-model:data="customerData" />

` }, { "id": 4, "text": "Supported languages #\nThe Monaco editor currently supports the following languages:\nStandard Worker:\n\nbatch\nc#\nc++\ncoffeescript\ndiff\nf#\njava\nlua\nmarkdown\nobjective-c\nphp\npowershell\npug\npython\nr\nruby\nsass\nvb\nxml\n\nJSON worker:\n\njson\n\nCSS worker:\n\ncss\nscss\nless\n\nHTML worker:\n\nhtml\nhandlebars\nrazor\n\nTypeScript worker:\n\ntypescript\njavascript\n\n" }, { "id": 5, "text": `Tree View #
The tree view displays hierarchical data with expandable/collapsible nodes. The tree-gantt variant combines this with gantt chart functionality for project and phase levels.
Tree View Features #

Hierarchical data display with indentation
Expandable/collapsible parent nodes
Visual indicators for parent/child relationships

Tree-Gantt View Features #

Combines tree structure with gantt visualization
Gantt bars appear on project (indent: 0) and phase (indent: 1) levels
Task level (indent: 2) contains actual data values
Maintains tree navigation while showing timeline data
Draggable and resizable gantt bars
Pinned columns for project information

Dependency Graph Configuration #
Both gantt and tree-gantt views support optional dependency graph functionality:

With dependencies (default): Connection handles and dependency lines are visible
Without dependencies: Connection handles and dependency lines are hidden

Configuration Examples #
vue<!-- Gantt with dependencies (default) -->
<ATable :config="{ view: 'gantt' }" />

<!-- Gantt without dependencies -->
<ATable :config="{ view: 'gantt', dependencyGraph: false }" />

<!-- Tree-Gantt with dependencies (default) -->
<ATable :config="{ view: 'tree-gantt' }" />

<!-- Tree-Gantt without dependencies -->
<ATable :config="{ view: 'tree-gantt', dependencyGraph: false }" />

Project-Gantt View Features #

3-level hierarchy: Project > Phase > Task
Visual project status indicators
Time tracking data only at task level
Color-coded gantt bars for projects and phases
Assignee information for tasks
Progress tracking across time periods

Usage #
vue<ATable
	v-model:rows="treeData"
	v-model:columns="treeColumns"
	:config="{ view: 'tree-gantt' }"
	@gantt:drag="handleGanttDrag" />

The tree-gantt view is perfect for displaying hierarchical project data with timeline visualization, where:

Projects and phases provide visual timeline context via gantt bars
Tasks contain the actual time tracking and progress data
Hierarchical structure maintains project organization

` }, { "id": 6, "text": "Row Actions #\nThe rowActions configuration allows you to add row-level action buttons to each row in the table.\nConfiguration Options #\ntypescriptrowActions: {\n  enabled: boolean           // Enable/disable row actions\n  position?: 'before-index' | 'after-index' | 'end'  // Button position\n  dropdownThreshold?: number // Width threshold for dropdown mode (px)\n  forceDropdown?: boolean    // Always use dropdown mode\n  actions?: {\n    add?: boolean | RowActionOptions\n    delete?: boolean | RowActionOptions\n    duplicate?: boolean | RowActionOptions\n    insertAbove?: boolean | RowActionOptions\n    insertBelow?: boolean | RowActionOptions\n    move?: boolean | RowActionOptions\n  }\n}\n\nEvents #\n\nrow:add - Emitted when a row is added\nrow:delete - Emitted when a row is deleted\nrow:duplicate - Emitted when a row is duplicated\nrow:insert-above - Emitted when a row is inserted above\nrow:insert-below - Emitted when a row is inserted below\nrow:move - Emitted when a row move is requested\n\n" }], "idMap": { "0": { "id": "aform-fetch-strategies-story-vue", "kind": "story" }, "1": { "id": "aform-inline-link-story-vue", "kind": "story" }, "2": { "id": "aform-nested-link-story-vue", "kind": "story" }, "3": { "id": "aform-nested-story-vue", "kind": "story" }, "4": { "id": "code-editor-default-story-vue", "kind": "story" }, "5": { "id": "atable-gantt-story-vue", "kind": "story" }, "6": { "id": "atable-row-actions-story-vue", "kind": "story" } } };
const searchData = markRaw(searchData$1);
function onUpdate(cb) {
}
export {
  onUpdate,
  searchData
};
