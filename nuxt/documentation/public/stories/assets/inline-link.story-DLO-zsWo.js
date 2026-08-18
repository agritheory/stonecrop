import { ap as resolveComponent, aq as openBlock, ar as createBlock, as as withCtx, at as createVNode, au as createBaseVNode, az as createTextVNode, aA as toDisplayString, av as defineComponent, ay as ref, aH as vs, aF as dn } from "./vendor-BFYlYCwc.js";
import { m as me, I as Ii } from "./stonecrop-DamNJegO.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const block0 = (Comp) => {
  Comp.doc = `<h1 id="aformlink" tabindex="-1">AFormLink <a class="header-anchor" href="#aformlink" aria-hidden="true">#</a></h1>
<p>A form input for selecting and navigating to linked documents. Handles display, search/selection via a dropdown, and navigation to the linked record.</p>
<h2 id="modes" tabindex="-1">Modes <a class="header-anchor" href="#modes" aria-hidden="true">#</a></h2>
<table>
<thead>
<tr>
<th>Mode</th>
<th>Input</th>
<th>Arrow</th>
<th>Dropdown</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>edit</code></td>
<td>Enabled</td>
<td>Visible (if has id)</td>
<td>Opens on focus/type</td>
</tr>
<tr>
<td><code>read</code></td>
<td>Disabled</td>
<td>Visible (if has id)</td>
<td>Never opens</td>
</tr>
<tr>
<td><code>display</code></td>
<td>Hidden</td>
<td>Hidden</td>
<td>—</td>
</tr>
</tbody>
</table>
<h2 id="value-shape-—-aformlinkvalue" tabindex="-1">Value shape — <code>AFormLinkValue</code> <a class="header-anchor" href="#value-shape-—-aformlinkvalue" aria-hidden="true">#</a></h2>
<pre><code class="language-typescript"><div class="htw-relative htw-not-prose __histoire-code"><div class="htw-absolute htw-top-0 htw-right-0 htw-text-xs htw-text-white/40">typescript</div><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">interface</span><span style="color:#B392F0"> AFormLinkValue</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">	id</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> string</span><span style="color:#F97583"> |</span><span style="color:#79B8FF"> number</span><span style="color:#6A737D"> // the linked record's ID; id: 0 is valid</span></span>
<span class="line"><span style="color:#FFAB70">	displayText</span><span style="color:#F97583">?:</span><span style="color:#79B8FF"> string</span><span style="color:#6A737D"> // shown in the input; falls back to String(id)</span></span>
<span class="line"><span style="color:#E1E4E8">	[</span><span style="color:#FFAB70">extra</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> string</span><span style="color:#E1E4E8">]</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> any</span><span style="color:#6A737D"> // extra fields available to formatter</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span></code></pre></div></code></pre>
<p>When <code>id</code> is falsy (<code>''</code>, <code>null</code>, <code>undefined</code>), the component shows a <code>—</code> placeholder and hides the navigation arrow.</p>
<h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-hidden="true">#</a></h2>
<pre><code class="language-typescript"><div class="htw-relative htw-not-prose __histoire-code"><div class="htw-absolute htw-top-0 htw-right-0 htw-text-xs htw-text-white/40">typescript</div><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#E1E4E8">{</span></span>
<span class="line"><span style="color:#B392F0">  modelValue</span><span style="color:#E1E4E8">: AFormLinkValue</span></span>
<span class="line"><span style="color:#E1E4E8">  label</span><span style="color:#F97583">?:</span><span style="color:#E1E4E8"> string</span></span>
<span class="line"><span style="color:#E1E4E8">  doctype</span><span style="color:#F97583">?:</span><span style="color:#E1E4E8"> string          </span><span style="color:#6A737D">// target doctype slug for navigation</span></span>
<span class="line"><span style="color:#E1E4E8">  filterFunction</span><span style="color:#F97583">?:</span><span style="color:#E1E4E8"> (</span><span style="color:#FFAB70">search</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> string</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> AFormLinkValue[] </span><span style="color:#F97583">|</span><span style="color:#79B8FF"> Promise</span><span style="color:#F97583">&#x3C;</span><span style="color:#E1E4E8">AFormLinkValue[]</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#E1E4E8">  isAsync</span><span style="color:#F97583">?:</span><span style="color:#E1E4E8"> boolean         </span><span style="color:#6A737D">// show loading state while filterFunction resolves</span></span>
<span class="line"><span style="color:#E1E4E8">  formatter</span><span style="color:#F97583">?:</span><span style="color:#E1E4E8"> (</span><span style="color:#FFAB70">value</span><span style="color:#F97583">:</span><span style="color:#B392F0"> AFormLinkValue</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> string  </span><span style="color:#6A737D">// custom display text transform</span></span>
<span class="line"><span style="color:#E1E4E8">  icon</span><span style="color:#F97583">?:</span><span style="color:#9ECBFF"> 'arrow-right'</span><span style="color:#F97583"> |</span><span style="color:#9ECBFF"> 'chevron-right'</span></span>
<span class="line"><span style="color:#E1E4E8">  disabled</span><span style="color:#F97583">?:</span><span style="color:#E1E4E8"> boolean</span></span>
<span class="line"><span style="color:#E1E4E8">  mode</span><span style="color:#F97583">?:</span><span style="color:#9ECBFF"> 'edit'</span><span style="color:#F97583"> |</span><span style="color:#9ECBFF"> 'read'</span><span style="color:#F97583"> |</span><span style="color:#9ECBFF"> 'display'</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span></code></pre></div></code></pre>
<h2 id="filter-function" tabindex="-1">Filter function <a class="header-anchor" href="#filter-function" aria-hidden="true">#</a></h2>
<p>Provide <code>filterFunction</code> to enable the search dropdown. The function receives the current input text and returns matching <code>AFormLinkValue[]</code>. For async lookups, set <code>isAsync: true</code> to show a loading indicator while the promise resolves.</p>
<pre><code class="language-typescript"><div class="htw-relative htw-not-prose __histoire-code"><div class="htw-absolute htw-top-0 htw-right-0 htw-text-xs htw-text-white/40">typescript</div><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#6A737D">// Sync</span></span>
<span class="line"><span style="color:#F97583">const</span><span style="color:#B392F0"> filterFunction</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> (</span><span style="color:#FFAB70">search</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> string</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=></span></span>
<span class="line"><span style="color:#E1E4E8">	records.</span><span style="color:#B392F0">filter</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">r</span><span style="color:#F97583"> =></span><span style="color:#E1E4E8"> r.name.</span><span style="color:#B392F0">toLowerCase</span><span style="color:#E1E4E8">().</span><span style="color:#B392F0">includes</span><span style="color:#E1E4E8">(search.</span><span style="color:#B392F0">toLowerCase</span><span style="color:#E1E4E8">())).</span><span style="color:#B392F0">map</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">r</span><span style="color:#F97583"> =></span><span style="color:#E1E4E8"> ({ id: r.id, displayText: r.name }))</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// Async</span></span>
<span class="line"><span style="color:#F97583">const</span><span style="color:#B392F0"> filterFunction</span><span style="color:#F97583"> =</span><span style="color:#F97583"> async</span><span style="color:#E1E4E8"> (</span><span style="color:#FFAB70">search</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> string</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">	const</span><span style="color:#79B8FF"> results</span><span style="color:#F97583"> =</span><span style="color:#F97583"> await</span><span style="color:#E1E4E8"> api.</span><span style="color:#B392F0">search</span><span style="color:#E1E4E8">(search)</span></span>
<span class="line"><span style="color:#F97583">	return</span><span style="color:#E1E4E8"> results.</span><span style="color:#B392F0">map</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">r</span><span style="color:#F97583"> =></span><span style="color:#E1E4E8"> ({ id: r.id, displayText: r.name }))</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span></code></pre></div></code></pre>
<h2 id="navigation" tabindex="-1">Navigation <a class="header-anchor" href="#navigation" aria-hidden="true">#</a></h2>
<p>AFormLink uses <code>provide</code>/<code>inject</code> for navigation so it remains decoupled from vue-router. Provide <code>aformLinkNavigator</code> once in your app plugin:</p>
<pre><code class="language-typescript"><div class="htw-relative htw-not-prose __histoire-code"><div class="htw-absolute htw-top-0 htw-right-0 htw-text-xs htw-text-white/40">typescript</div><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#F97583"> type</span><span style="color:#E1E4E8"> { AFormLinkNavigator } </span><span style="color:#F97583">from</span><span style="color:#9ECBFF"> '@stonecrop/aform'</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">app.</span><span style="color:#B392F0">provide</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">'aformLinkNavigator'</span><span style="color:#E1E4E8">, {</span></span>
<span class="line"><span style="color:#B392F0">	navigate</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">doctype</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> string</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">id</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> string</span><span style="color:#F97583"> |</span><span style="color:#79B8FF"> number</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#E1E4E8">		router.</span><span style="color:#B392F0">push</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">\`/\${</span><span style="color:#E1E4E8">doctype</span><span style="color:#9ECBFF">}/\${</span><span style="color:#E1E4E8">id</span><span style="color:#9ECBFF">}\`</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">	},</span></span>
<span class="line"><span style="color:#E1E4E8">} </span><span style="color:#F97583">satisfies</span><span style="color:#B392F0"> AFormLinkNavigator</span><span style="color:#E1E4E8">)</span></span>
<span class="line"></span></code></pre></div></code></pre>
<p>If no navigator is provided, the arrow is still rendered when <code>hasValidId</code> is true but clicks are no-ops.</p>
<h2 id="via-resolveschema" tabindex="-1">Via resolveSchema <a class="header-anchor" href="#via-resolveschema" aria-hidden="true">#</a></h2>
<p>For <code>fieldtype: 'Link'</code> fields with no matching <code>links</code> declaration, <code>resolveSchema()</code> automatically assigns <code>component: 'AFormLink'</code> and sets <code>doctype</code> from <code>field.options</code>. No manual wiring needed:</p>
<pre><code class="language-typescript"><div class="htw-relative htw-not-prose __histoire-code"><div class="htw-absolute htw-top-0 htw-right-0 htw-text-xs htw-text-white/40">typescript</div><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> config</span><span style="color:#F97583">:</span><span style="color:#B392F0"> DoctypeConfig</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">	slug: </span><span style="color:#9ECBFF">'sales-order'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">	fields: [{ fieldname: </span><span style="color:#9ECBFF">'territory'</span><span style="color:#E1E4E8">, fieldtype: </span><span style="color:#9ECBFF">'Link'</span><span style="color:#E1E4E8">, options: </span><span style="color:#9ECBFF">'territory'</span><span style="color:#E1E4E8">, label: </span><span style="color:#9ECBFF">'Territory'</span><span style="color:#E1E4E8"> }],</span></span>
<span class="line"><span style="color:#6A737D">	// no 'links' entry for territory — resolveSchema handles it</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> resolved</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> registry.</span><span style="color:#B392F0">resolveSchema</span><span style="color:#E1E4E8">(registry.registry[</span><span style="color:#9ECBFF">'sales-order'</span><span style="color:#E1E4E8">])</span></span>
<span class="line"><span style="color:#6A737D">// resolved[0] === { fieldname: 'territory', component: 'AFormLink', doctype: 'territory', label: 'Territory', ... }</span></span>
<span class="line"></span></code></pre></div></code></pre>
`;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "inline-link.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const navigatorSetup = ({ app }) => {
      app.provide("aformLinkNavigator", {
        navigate(doctype, id) {
          alert(`Navigate to ${doctype}/${id}`);
        }
      });
    };
    const selectedValue = ref({ id: "TERR-001", displayText: "North America" });
    const emptyValue = ref({ id: "" });
    const territories = [
      { id: "TERR-001", displayText: "North America" },
      { id: "TERR-002", displayText: "Europe" },
      { id: "TERR-003", displayText: "Asia Pacific" },
      { id: "TERR-004", displayText: "Latin America" },
      { id: "TERR-005", displayText: "Middle East & Africa" }
    ];
    const customers = [
      { id: "CUST-001", displayText: "Acme Corp" },
      { id: "CUST-002", displayText: "Globex Corp" },
      { id: "CUST-003", displayText: "Initech" },
      { id: "CUST-004", displayText: "Umbrella Corp" }
    ];
    const syncValue = ref({ id: "" });
    const asyncValue = ref({ id: "" });
    function syncFilter(search) {
      return territories.filter((t) => t.displayText.toLowerCase().includes(search.toLowerCase()));
    }
    async function asyncFilter(search) {
      await new Promise((resolve) => setTimeout(resolve, 750));
      return customers.filter((c) => c.displayText.toLowerCase().includes(search.toLowerCase()));
    }
    const salesOrderConfig = {
      name: "Sales Order",
      slug: "sales-order",
      fields: [
        { fieldname: "order_number", fieldtype: "Data", component: "ATextInput", label: "Order Number" },
        { fieldname: "customer", fieldtype: "Data", component: "ATextInput", label: "Customer Name" },
        { fieldname: "territory", fieldtype: "Link", options: "territory", label: "Territory" }
      ]
    };
    const registry = new me();
    registry.addDoctype(Ii.fromObject(salesOrderConfig));
    const resolvedSchema = ref(registry.resolveSchema(registry.registry["sales-order"]));
    const formData = ref({
      order_number: "SO-00001",
      customer: "Acme Corp",
      territory: { id: "", displayText: "" }
    });
    const __returned__ = { navigatorSetup, selectedValue, emptyValue, territories, customers, syncValue, asyncValue, syncFilter, asyncFilter, salesOrderConfig, registry, resolvedSchema, formData, get AForm() {
      return dn;
    }, get AFormLink() {
      return vs;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "link-grid" };
const _hoisted_2 = { class: "link-section" };
const _hoisted_3 = { class: "link-section" };
const _hoisted_4 = { class: "link-section" };
const _hoisted_5 = { class: "link-section" };
const _hoisted_6 = { class: "link-section" };
const _hoisted_7 = { class: "link-section wide" };
const _hoisted_8 = { class: "data-note" };
const _hoisted_9 = { class: "link-section wide" };
const _hoisted_10 = { class: "data-note" };
const _hoisted_11 = { class: "link-section wide" };
const _hoisted_12 = { class: "data-preview" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, {
    title: "inline link",
    group: "aform"
  }, {
    default: withCtx(() => [
      createVNode(_component_Variant, {
        title: "modes",
        "setup-app": $setup.navigatorSetup
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createBaseVNode("div", _hoisted_2, [
              _cache[3] || (_cache[3] = createBaseVNode(
                "h4",
                null,
                "Edit — with value",
                -1
                /* CACHED */
              )),
              createVNode($setup["AFormLink"], {
                label: "Territory",
                modelValue: $setup.selectedValue,
                doctype: "territory"
              }, null, 8, ["modelValue"])
            ]),
            createBaseVNode("div", _hoisted_3, [
              _cache[4] || (_cache[4] = createBaseVNode(
                "h4",
                null,
                "Edit — empty",
                -1
                /* CACHED */
              )),
              createVNode($setup["AFormLink"], {
                label: "Territory",
                modelValue: $setup.emptyValue,
                doctype: "territory"
              }, null, 8, ["modelValue"])
            ]),
            createBaseVNode("div", _hoisted_4, [
              _cache[5] || (_cache[5] = createBaseVNode(
                "h4",
                null,
                "Read",
                -1
                /* CACHED */
              )),
              createVNode($setup["AFormLink"], {
                label: "Territory",
                modelValue: $setup.selectedValue,
                doctype: "territory",
                mode: "read"
              }, null, 8, ["modelValue"])
            ]),
            createBaseVNode("div", _hoisted_5, [
              _cache[6] || (_cache[6] = createBaseVNode(
                "h4",
                null,
                "Display",
                -1
                /* CACHED */
              )),
              createVNode($setup["AFormLink"], {
                label: "Territory",
                modelValue: $setup.selectedValue,
                doctype: "territory",
                mode: "display"
              }, null, 8, ["modelValue"])
            ]),
            createBaseVNode("div", _hoisted_6, [
              _cache[7] || (_cache[7] = createBaseVNode(
                "h4",
                null,
                "Disabled",
                -1
                /* CACHED */
              )),
              createVNode($setup["AFormLink"], {
                label: "Territory",
                modelValue: $setup.selectedValue,
                doctype: "territory",
                disabled: true
              }, null, 8, ["modelValue"])
            ])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, {
        title: "filter function",
        "setup-app": $setup.navigatorSetup
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_7, [
            _cache[9] || (_cache[9] = createBaseVNode(
              "h4",
              null,
              "Sync filter",
              -1
              /* CACHED */
            )),
            createVNode($setup["AFormLink"], {
              label: "Territory",
              modelValue: $setup.syncValue,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.syncValue = $event),
              doctype: "territory",
              filterFunction: $setup.syncFilter
            }, null, 8, ["modelValue"]),
            createBaseVNode("p", _hoisted_8, [
              _cache[8] || (_cache[8] = createTextVNode(
                " Selected: ",
                -1
                /* CACHED */
              )),
              createBaseVNode(
                "code",
                null,
                toDisplayString(JSON.stringify($setup.syncValue)),
                1
                /* TEXT */
              )
            ])
          ]),
          createBaseVNode("div", _hoisted_9, [
            _cache[11] || (_cache[11] = createBaseVNode(
              "h4",
              null,
              "Async filter (750ms delay)",
              -1
              /* CACHED */
            )),
            createVNode($setup["AFormLink"], {
              label: "Customer",
              modelValue: $setup.asyncValue,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.asyncValue = $event),
              doctype: "customer",
              filterFunction: $setup.asyncFilter,
              isAsync: true
            }, null, 8, ["modelValue"]),
            createBaseVNode("p", _hoisted_10, [
              _cache[10] || (_cache[10] = createTextVNode(
                " Selected: ",
                -1
                /* CACHED */
              )),
              createBaseVNode(
                "code",
                null,
                toDisplayString(JSON.stringify($setup.asyncValue)),
                1
                /* TEXT */
              )
            ])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, {
        title: "via resolveSchema",
        "setup-app": $setup.navigatorSetup
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_11, [
            _cache[14] || (_cache[14] = createBaseVNode(
              "h4",
              null,
              "Sales Order — undeclared Link resolved to AFormLink",
              -1
              /* CACHED */
            )),
            _cache[15] || (_cache[15] = createBaseVNode(
              "p",
              { class: "info-text" },
              [
                createTextVNode(" The "),
                createBaseVNode("code", null, "territory"),
                createTextVNode(" field has "),
                createBaseVNode("code", null, "fieldtype: 'Link'"),
                createTextVNode(" and "),
                createBaseVNode("code", null, "options: 'territory'"),
                createTextVNode(" but no entry in "),
                createBaseVNode("code", null, "links"),
                createTextVNode(". "),
                createBaseVNode("code", null, "resolveSchema()"),
                createTextVNode(" assigns "),
                createBaseVNode("code", null, "component: 'AFormLink'"),
                createTextVNode(" and "),
                createBaseVNode("code", null, "doctype: 'territory'"),
                createTextVNode(" automatically. ")
              ],
              -1
              /* CACHED */
            )),
            createVNode($setup["AForm"], {
              schema: $setup.resolvedSchema,
              data: $setup.formData,
              "onUpdate:data": _cache[2] || (_cache[2] = ($event) => $setup.formData = $event)
            }, null, 8, ["schema", "data"]),
            createBaseVNode("div", _hoisted_12, [
              _cache[12] || (_cache[12] = createBaseVNode(
                "h4",
                null,
                "Resolved schema:",
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
                    doctype: f.doctype
                  })),
                  null,
                  2
                )),
                1
                /* TEXT */
              ),
              _cache[13] || (_cache[13] = createBaseVNode(
                "h4",
                null,
                "Form data:",
                -1
                /* CACHED */
              )),
              createBaseVNode(
                "pre",
                null,
                toDisplayString(JSON.stringify($setup.formData, null, 2)),
                1
                /* TEXT */
              )
            ])
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
_sfc_main.__file = "aform/inline-link.story.vue";
const inlineLink_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6451178a"], ["__file", "/home/dell/StoneCrop/stonecrop/examples/aform/inline-link.story.vue"]]);
export {
  inlineLink_story as default
};
