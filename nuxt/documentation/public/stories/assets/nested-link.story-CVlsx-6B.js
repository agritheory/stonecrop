import { ap as resolveComponent, aq as openBlock, ar as createBlock, as as withCtx, at as createVNode, au as createBaseVNode, az as createTextVNode, aA as toDisplayString, av as defineComponent, ay as ref } from "./vendor-BFYlYCwc.js";
import { I as Ii, m as me } from "./stonecrop-DamNJegO.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const name$2 = "Recipe";
const slug$2 = "recipe";
const fields$2 = [{ "fieldname": "name", "fieldtype": "Data", "component": "ATextInput", "label": "Recipe Name", "required": true }, { "fieldname": "tasks", "fieldtype": "Link", "component": "ATable", "label": "Tasks", "options": "recipe-task" }, { "fieldname": "status", "fieldtype": "Data", "component": "ATextInput", "label": "Status", "required": true, "mode": "read" }, { "fieldname": "description", "fieldtype": "Data", "component": "ATextInput", "label": "Description" }, { "fieldname": "supersededBy", "fieldtype": "Link", "component": "AForm", "label": "Superseded By", "options": "recipe" }];
const links$2 = { "tasks": { "target": "recipe-task", "cardinality": "noneOrMany", "backlink": "recipe", "fieldname": "tasks" }, "supersededBy": { "target": "recipe", "cardinality": "atMostOne", "backlink": "supersededBy", "fieldname": "supersededBy" } };
const recipeSchemaJson = {
  name: name$2,
  slug: slug$2,
  fields: fields$2,
  links: links$2
};
const name$1 = "RecipeTask";
const slug$1 = "recipe-task";
const fields$1 = [{ "fieldname": "name", "fieldtype": "Data", "component": "ATextInput", "label": "Task Name", "required": true }, { "fieldname": "description", "fieldtype": "Data", "component": "ATextInput", "label": "Description" }, { "fieldname": "recipe", "fieldtype": "Link", "component": "AForm", "label": "Recipe", "options": "recipe", "readOnly": true }];
const links$1 = { "recipe": { "target": "recipe", "cardinality": "one", "backlink": "tasks", "fieldname": "recipe" } };
const recipeTaskSchemaJson = {
  name: name$1,
  slug: slug$1,
  fields: fields$1,
  links: links$1
};
const name = "cardinality-demo";
const slug = "cardinality-demo";
const fields = [{ "fieldname": "name", "fieldtype": "Data", "component": "ATextInput", "label": "Name" }, { "fieldname": "required_task", "fieldtype": "Link", "component": "AForm", "label": "Required Task", "options": "recipe-task" }, { "fieldname": "optional_task", "fieldtype": "Link", "component": "AForm", "label": "Optional Task", "options": "recipe-task" }, { "fieldname": "optional_tasks", "fieldtype": "Link", "component": "ATable", "label": "Optional Tasks", "options": "recipe-task" }, { "fieldname": "required_tasks", "fieldtype": "Link", "component": "ATable", "label": "Required Tasks", "options": "recipe-task" }];
const links = { "required_task": { "target": "recipe-task", "cardinality": "one", "fieldname": "required_task" }, "optional_task": { "target": "recipe-task", "cardinality": "atMostOne", "fieldname": "optional_task" }, "optional_tasks": { "target": "recipe-task", "cardinality": "noneOrMany", "fieldname": "optional_tasks" }, "required_tasks": { "target": "recipe-task", "cardinality": "atLeastOne", "fieldname": "required_tasks" } };
const cardinalityDemoSchemaJson = {
  name,
  slug,
  fields,
  links
};
const block0 = (Comp) => {
  Comp.doc = `<h1 id="links" tabindex="-1">Links <a class="header-anchor" href="#links" aria-hidden="true">#</a></h1>
<p>Demonstrates the <code>links</code> system — schema-declared relationships between doctypes. Links make relationship metadata first-class: cardinality, direction, and target are declared on the doctype rather than inferred from field names or database conventions.</p>
<p>For rendering resolved schemas in <code>AForm</code>, see <a href="/stories/story/aform-nested-story-vue" data-route="true">nested schema</a>.</p>
<h2 id="schema-with-links" tabindex="-1">Schema with links <a class="header-anchor" href="#schema-with-links" aria-hidden="true">#</a></h2>
<p>Doctype relationships are declared in the <code>links</code> object alongside <code>fields</code>. The <code>fields</code> array contains both scalar fields and Link fields (<code>fieldtype: 'Link'</code>), positioned at the location where they should render:</p>
<pre><code class="language-typescript"><div class="htw-relative htw-not-prose __histoire-code"><div class="htw-absolute htw-top-0 htw-right-0 htw-text-xs htw-text-white/40">typescript</div><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">Doctype.</span><span style="color:#B392F0">fromObject</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">	slug: </span><span style="color:#9ECBFF">'recipe'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">	fields: [</span></span>
<span class="line"><span style="color:#E1E4E8">		{ fieldname: </span><span style="color:#9ECBFF">'name'</span><span style="color:#E1E4E8">, fieldtype: </span><span style="color:#9ECBFF">'Data'</span><span style="color:#E1E4E8"> },</span></span>
<span class="line"><span style="color:#E1E4E8">		{ fieldname: </span><span style="color:#9ECBFF">'tasks'</span><span style="color:#E1E4E8">, fieldtype: </span><span style="color:#9ECBFF">'Link'</span><span style="color:#E1E4E8">, options: </span><span style="color:#9ECBFF">'recipe-task'</span><span style="color:#E1E4E8"> },</span></span>
<span class="line"><span style="color:#E1E4E8">		{ fieldname: </span><span style="color:#9ECBFF">'status'</span><span style="color:#E1E4E8">, fieldtype: </span><span style="color:#9ECBFF">'Data'</span><span style="color:#E1E4E8"> },</span></span>
<span class="line"><span style="color:#E1E4E8">	],</span></span>
<span class="line"><span style="color:#E1E4E8">	links: {</span></span>
<span class="line"><span style="color:#E1E4E8">		tasks: { target: </span><span style="color:#9ECBFF">'recipe-task'</span><span style="color:#E1E4E8">, cardinality: </span><span style="color:#9ECBFF">'noneOrMany'</span><span style="color:#E1E4E8">, backlink: </span><span style="color:#9ECBFF">'recipe'</span><span style="color:#E1E4E8">, fieldname: </span><span style="color:#9ECBFF">'tasks'</span><span style="color:#E1E4E8"> },</span></span>
<span class="line"><span style="color:#E1E4E8">		supersededBy: { target: </span><span style="color:#9ECBFF">'recipe'</span><span style="color:#E1E4E8">, cardinality: </span><span style="color:#9ECBFF">'atMostOne'</span><span style="color:#E1E4E8">, backlink: </span><span style="color:#9ECBFF">'supersededBy'</span><span style="color:#E1E4E8">, fieldname: </span><span style="color:#9ECBFF">'supersededBy'</span><span style="color:#E1E4E8"> },</span></span>
<span class="line"><span style="color:#E1E4E8">	},</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"></span></code></pre></div></code></pre>
<p>The Registry indexes these at load time. Two accessors expose the graph:</p>
<ul>
<li><code>registry.getDescendantLinks(slug)</code> — links declared <em>on</em> this doctype (pointing outward)</li>
<li><code>registry.getAncestorLinks(slug)</code> — links on <em>other</em> doctypes that point back here via <code>backlink</code></li>
</ul>
<h2 id="scaffolding-record-data" tabindex="-1">Scaffolding record data <a class="header-anchor" href="#scaffolding-record-data" aria-hidden="true">#</a></h2>
<p>Use <code>registry.initializeRecord(registry.resolveSchema(doctype))</code> to derive an empty record whose shape matches the schema, then patch in display values:</p>
<pre><code class="language-typescript"><div class="htw-relative htw-not-prose __histoire-code"><div class="htw-absolute htw-top-0 htw-right-0 htw-text-xs htw-text-white/40">typescript</div><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> recipeData</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> ref</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#F97583">	...</span><span style="color:#E1E4E8">registry.</span><span style="color:#B392F0">initializeRecord</span><span style="color:#E1E4E8">(registry.</span><span style="color:#B392F0">resolveSchema</span><span style="color:#E1E4E8">(recipeDoctype)),</span></span>
<span class="line"><span style="color:#E1E4E8">	name: </span><span style="color:#9ECBFF">'Sourdough Bread'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">	status: </span><span style="color:#9ECBFF">'draft'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">	tasks: [{ name: </span><span style="color:#9ECBFF">'Mix dough'</span><span style="color:#E1E4E8">, description: </span><span style="color:#9ECBFF">'...'</span><span style="color:#E1E4E8"> }],</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"></span></code></pre></div></code></pre>
<p><code>initializeRecord</code> produces correct defaults per field type: <code>''</code> for Data fields, <code>[]</code> for <code>noneOrMany</code>/<code>atLeastOne</code> links, and a nested initialized object for <code>one</code>/<code>atMostOne</code> links. Hard-coding the shape directly bypasses this and will silently break if the linked doctype's fields change.</p>
<h2 id="resolved-schema" tabindex="-1">Resolved schema <a class="header-anchor" href="#resolved-schema" aria-hidden="true">#</a></h2>
<p><code>registry.resolveSchema()</code> produces a flat <code>SchemaTypes[]</code> ready for <code>AForm</code>. For each link entry it embeds the child schema directly on the field object:</p>
<ul>
<li><strong>1:1 links</strong> (<code>atMostOne</code>, <code>one</code>) — <code>schema: SchemaTypes[]</code> attached; AForm renders a nested form</li>
<li><strong>1:many links</strong> (<code>noneOrMany</code>, <code>atLeastOne</code>) — <code>schema</code> array + <code>kind: 'table'</code>; ATable derives its own columns</li>
</ul>
<p>AForm has no knowledge of the registry — it checks <code>'schema' in field &amp;&amp; kind !== 'table'</code> to decide whether to recurse into a nested form.</p>
<h2 id="cardinality-types" tabindex="-1">Cardinality types <a class="header-anchor" href="#cardinality-types" aria-hidden="true">#</a></h2>
<p>All four cardinality values are valid on <code>LinkDeclaration</code>:</p>
<table>
<thead>
<tr>
<th>Value</th>
<th>Meaning</th>
<th>Renders as</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>one</code></td>
<td>Exactly 1 — required</td>
<td>AForm</td>
</tr>
<tr>
<td><code>atMostOne</code></td>
<td>0 or 1 — optional</td>
<td>AForm</td>
</tr>
<tr>
<td><code>noneOrMany</code></td>
<td>0 or more — optional list</td>
<td>ATable</td>
</tr>
<tr>
<td><code>atLeastOne</code></td>
<td>1 or more — required list</td>
<td>ATable</td>
</tr>
</tbody>
</table>
<p>The cardinality value is semantic: the registry uses it to determine the default rendering component but does not enforce the constraint at the UI level. Application-level validation is the caller's responsibility.</p>
`;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "nested-link.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const recipeDoctype = Ii.fromObject(recipeSchemaJson);
    const recipeTaskDoctype = Ii.fromObject(recipeTaskSchemaJson);
    const allCardinalitiesDoctype = Ii.fromObject(cardinalityDemoSchemaJson);
    const registry = new me();
    registry.addDoctype(recipeDoctype);
    registry.addDoctype(recipeTaskDoctype);
    registry.addDoctype(allCardinalitiesDoctype);
    const recipeDescendants = registry.getDescendantLinks("recipe");
    const taskAncestors = registry.getAncestorLinks("recipe-task");
    const resolvedSchema = ref(registry.resolveSchema(recipeDoctype));
    const allCardinalitiesResolved = ref(registry.resolveSchema(allCardinalitiesDoctype));
    const recipeData = ref({
      ...registry.initializeRecord(resolvedSchema.value),
      name: "Sourdough Bread",
      description: "Classic long-fermentation sourdough",
      status: "draft",
      tasks: [
        { name: "Mix dough", description: "Combine flour, water, salt and starter" },
        { name: "Bulk ferment", description: "Rest at room temperature for 4–6 hours" },
        { name: "Shape and proof", description: "Shape loaf and cold-proof overnight" }
      ]
    });
    const __returned__ = { recipeDoctype, recipeTaskDoctype, allCardinalitiesDoctype, registry, recipeDescendants, taskAncestors, resolvedSchema, allCardinalitiesResolved, recipeData };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, {
    title: "nested link",
    group: "aform"
  }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "schema with links" }, {
        default: withCtx(() => [
          createBaseVNode("div", null, [
            _cache[0] || (_cache[0] = createBaseVNode(
              "h3",
              null,
              "Schema-Driven Relationships",
              -1
              /* CACHED */
            )),
            _cache[1] || (_cache[1] = createBaseVNode(
              "p",
              null,
              [
                createTextVNode(" Two doctypes are registered: "),
                createBaseVNode("code", null, "recipe"),
                createTextVNode(" and "),
                createBaseVNode("code", null, "recipe-task"),
                createTextVNode(". "),
                createBaseVNode("code", null, "recipe"),
                createTextVNode(" declares a "),
                createBaseVNode("code", null, "tasks"),
                createTextVNode(" link targeting "),
                createBaseVNode("code", null, "recipe-task"),
                createTextVNode(", so "),
                createBaseVNode("code", null, "getAncestorLinks('recipe-task')"),
                createTextVNode(" returns an entry. "),
                createBaseVNode("code", null, "recipe"),
                createTextVNode(" also declares a self-referential "),
                createBaseVNode("code", null, "supersededBy"),
                createTextVNode(" link ("),
                createBaseVNode("code", null, "atMostOne → recipe"),
                createTextVNode("). ")
              ],
              -1
              /* CACHED */
            )),
            _cache[2] || (_cache[2] = createBaseVNode(
              "h4",
              null,
              "getDescendantLinks('recipe')",
              -1
              /* CACHED */
            )),
            createBaseVNode(
              "pre",
              null,
              toDisplayString(JSON.stringify($setup.recipeDescendants, null, 2)),
              1
              /* TEXT */
            ),
            _cache[3] || (_cache[3] = createBaseVNode(
              "h4",
              null,
              "getAncestorLinks('recipe-task')",
              -1
              /* CACHED */
            )),
            createBaseVNode(
              "pre",
              null,
              toDisplayString(JSON.stringify($setup.taskAncestors, null, 2)),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "resolved schema" }, {
        default: withCtx(() => [
          createBaseVNode("div", null, [
            _cache[4] || (_cache[4] = createBaseVNode(
              "h3",
              null,
              "Resolved Schema (resolveSchema)",
              -1
              /* CACHED */
            )),
            _cache[5] || (_cache[5] = createBaseVNode(
              "p",
              null,
              [
                createBaseVNode("code", null, "registry.resolveSchema()"),
                createTextVNode(" walks the doctype's "),
                createBaseVNode("code", null, "links"),
                createTextVNode(" declarations, resolves each target doctype, and embeds a "),
                createBaseVNode("code", null, "schema"),
                createTextVNode(" array on 1:1 entries or a "),
                createBaseVNode("code", null, "schema"),
                createTextVNode(" array with "),
                createBaseVNode("code", null, "kind: 'table'"),
                createTextVNode(" on 1:many entries. AForm checks "),
                createBaseVNode("code", null, "'schema' in field"),
                createTextVNode(" and recurses automatically — no knowledge of the registry is required at render time. ")
              ],
              -1
              /* CACHED */
            )),
            _cache[6] || (_cache[6] = createBaseVNode(
              "p",
              null,
              [
                createTextVNode("See "),
                createBaseVNode("strong", null, "nested schema → resolved schema"),
                createTextVNode(" for the rendered result.")
              ],
              -1
              /* CACHED */
            )),
            _cache[7] || (_cache[7] = createBaseVNode(
              "h4",
              null,
              "Resolved schema structure",
              -1
              /* CACHED */
            )),
            createBaseVNode(
              "pre",
              null,
              toDisplayString(JSON.stringify(
                $setup.resolvedSchema.map((f) => ({
                  fieldname: f.fieldname,
                  component: f.component,
                  ..."schema" in f ? { schema: `[${f.schema.length} fields]` } : {},
                  ...f.kind === "table" ? { kind: "table", schema: `[${f.schema?.length ?? 0} fields]` } : {}
                })),
                null,
                2
              )),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "cardinality types" }, {
        default: withCtx(() => [
          createBaseVNode("div", null, [
            _cache[8] || (_cache[8] = createBaseVNode(
              "h3",
              null,
              "All Four Cardinality Types",
              -1
              /* CACHED */
            )),
            _cache[9] || (_cache[9] = createBaseVNode(
              "p",
              null,
              [
                createTextVNode(" The four cardinality values control how "),
                createBaseVNode("code", null, "resolveSchema"),
                createTextVNode(" renders a link. The two "),
                createBaseVNode("em", null, "many"),
                createTextVNode(" values produce an ATable entry; the two "),
                createBaseVNode("em", null, "singular"),
                createTextVNode(" values embed an AForm. The difference between "),
                createBaseVNode("code", null, "one"),
                createTextVNode("/"),
                createBaseVNode("code", null, "noneOrMany"),
                createTextVNode(" and "),
                createBaseVNode("code", null, "atMostOne"),
                createTextVNode("/"),
                createBaseVNode("code", null, "atLeastOne"),
                createTextVNode(" is semantic — it signals to the application whether the relationship is required or optional — the rendered components are identical. ")
              ],
              -1
              /* CACHED */
            )),
            _cache[10] || (_cache[10] = createBaseVNode(
              "table",
              { style: { "border-collapse": "collapse", "width": "100%", "margin-bottom": "1rem" } },
              [
                createBaseVNode("thead", null, [
                  createBaseVNode("tr", { style: { "text-align": "left", "border-bottom": "1px solid #ccc" } }, [
                    createBaseVNode("th", { style: { "padding": "0.5rem 1rem" } }, "Cardinality"),
                    createBaseVNode("th", { style: { "padding": "0.5rem 1rem" } }, "Meaning"),
                    createBaseVNode("th", { style: { "padding": "0.5rem 1rem" } }, "Resolves to")
                  ])
                ]),
                createBaseVNode("tbody", null, [
                  createBaseVNode("tr", null, [
                    createBaseVNode("td", { style: { "padding": "0.5rem 1rem" } }, [
                      createBaseVNode("code", null, "one")
                    ]),
                    createBaseVNode("td", { style: { "padding": "0.5rem 1rem" } }, "Exactly 1 — required"),
                    createBaseVNode("td", { style: { "padding": "0.5rem 1rem" } }, "AForm with embedded schema")
                  ]),
                  createBaseVNode("tr", null, [
                    createBaseVNode("td", { style: { "padding": "0.5rem 1rem" } }, [
                      createBaseVNode("code", null, "atMostOne")
                    ]),
                    createBaseVNode("td", { style: { "padding": "0.5rem 1rem" } }, "0 or 1 — optional"),
                    createBaseVNode("td", { style: { "padding": "0.5rem 1rem" } }, "AForm with embedded schema")
                  ]),
                  createBaseVNode("tr", null, [
                    createBaseVNode("td", { style: { "padding": "0.5rem 1rem" } }, [
                      createBaseVNode("code", null, "noneOrMany")
                    ]),
                    createBaseVNode("td", { style: { "padding": "0.5rem 1rem" } }, "0 or more — optional list"),
                    createBaseVNode("td", { style: { "padding": "0.5rem 1rem" } }, "ATable with auto-derived columns")
                  ]),
                  createBaseVNode("tr", null, [
                    createBaseVNode("td", { style: { "padding": "0.5rem 1rem" } }, [
                      createBaseVNode("code", null, "atLeastOne")
                    ]),
                    createBaseVNode("td", { style: { "padding": "0.5rem 1rem" } }, "1 or more — required list"),
                    createBaseVNode("td", { style: { "padding": "0.5rem 1rem" } }, "ATable with auto-derived columns")
                  ])
                ])
              ],
              -1
              /* CACHED */
            )),
            _cache[11] || (_cache[11] = createBaseVNode(
              "h4",
              null,
              "Resolved schema entries for a doctype with all four cardinalities",
              -1
              /* CACHED */
            )),
            createBaseVNode(
              "pre",
              null,
              toDisplayString(JSON.stringify(
                $setup.allCardinalitiesResolved.map((f) => ({
                  fieldname: f.fieldname,
                  component: f.component,
                  ..."schema" in f ? { schema: `[${f.schema.length} fields]` } : {},
                  ...f.kind === "table" ? { kind: "table", schema: `[${f.schema?.length ?? 0} fields]` } : {}
                })),
                null,
                2
              )),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
if (typeof block0 === "function") block0(_sfc_main);
_sfc_main.__file = "aform/nested-link.story.vue";
const nestedLink_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/dell/StoneCrop/stonecrop/examples/aform/nested-link.story.vue"]]);
export {
  nestedLink_story as default
};
