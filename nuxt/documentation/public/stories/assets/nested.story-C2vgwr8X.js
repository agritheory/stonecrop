import { ap as resolveComponent, aq as openBlock, ar as createBlock, as as withCtx, at as createVNode, au as createBaseVNode, av as defineComponent, aE as h, aF as dn, ay as ref, ax as computed } from "./vendor-BFYlYCwc.js";
import { m as me, I as Ii, A as At } from "./stonecrop-DamNJegO.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const name$2 = "Address";
const slug$2 = "address";
const fields$2 = [{ "fieldname": "street", "fieldtype": "Data", "component": "ATextInput", "label": "Street" }, { "fieldname": "city", "fieldtype": "Data", "component": "ATextInput", "label": "City" }, { "fieldname": "state", "fieldtype": "Data", "component": "ATextInput", "label": "State" }, { "fieldname": "zip_code", "fieldtype": "Data", "component": "ATextInput", "label": "Zip Code" }];
const addressSchemaJson = {
  name: name$2,
  slug: slug$2,
  fields: fields$2
};
const name$1 = "Customer";
const slug$1 = "customer";
const fields$1 = [{ "fieldname": "customer_name", "fieldtype": "Data", "component": "ATextInput", "label": "Customer Name", "required": true }, { "fieldname": "email", "fieldtype": "Data", "component": "ATextInput", "label": "Email" }, { "fieldname": "phone", "fieldtype": "Data", "component": "ATextInput", "label": "Phone" }];
const links$1 = { "address": { "target": "address", "cardinality": "one", "backlink": "customer" } };
const customerSchemaJson = {
  name: name$1,
  slug: slug$1,
  fields: fields$1,
  links: links$1
};
const name = "CustomerWithAddresses";
const slug = "customer_with_addresses";
const fields = [{ "fieldname": "customer_name", "fieldtype": "Data", "component": "ATextInput", "label": "Customer Name", "required": true }, { "fieldname": "email", "fieldtype": "Data", "component": "ATextInput", "label": "Email" }, { "fieldname": "phone", "fieldtype": "Data", "component": "ATextInput", "label": "Phone" }];
const links = { "addresses": { "target": "address", "cardinality": "noneOrMany", "backlink": "customer" } };
const customerWithAddressesSchemaJson = {
  name,
  slug,
  fields,
  links
};
const block0 = (Comp) => {
  Comp.doc = `<h1 id="nested-schema-support" tabindex="-1">Nested Schema Support <a class="header-anchor" href="#nested-schema-support" aria-hidden="true">#</a></h1>
<p>Demonstrates how <code>Registry.resolveSchema()</code> embeds child schemas on <code>Doctype</code> fields.
For 1:1 nested forms, it attaches <code>schema</code> arrays; for 1:many tables (<code>cardinality: 'noneOrMany'</code>),
it auto-derives table columns. AForm renders both patterns without knowing anything about the Registry.</p>
<h2 id="how-it-works" tabindex="-1">How It Works <a class="header-anchor" href="#how-it-works" aria-hidden="true">#</a></h2>
<h3 id="_1-1-doctype-fields-default-cardinality" tabindex="-1">1:1 (Doctype fields, default cardinality) <a class="header-anchor" href="#_1-1-doctype-fields-default-cardinality" aria-hidden="true">#</a></h3>
<ol>
<li>Register doctypes in the Registry</li>
<li>Call <code>registry.resolveSchema(schema)</code> — attaches <code>schema</code> arrays to Doctype fields</li>
<li>Pass the resolved schema to <code>&lt;AForm&gt;</code> — it checks <code>'schema' in field</code> and recurses</li>
</ol>
<h3 id="_1-many-doctype-fields-with-cardinality-noneormany" tabindex="-1">1:Many (Doctype fields with cardinality: 'noneOrMany') <a class="header-anchor" href="#_1-many-doctype-fields-with-cardinality-noneormany" aria-hidden="true">#</a></h3>
<ol>
<li>Register parent and child doctypes in the Registry</li>
<li>Call <code>registry.resolveSchema(schema)</code> — for <code>links</code> with <code>cardinality: 'noneOrMany'</code>, auto-derives
<code>columns</code> from the child doctype's schema, sets <code>component: 'ATable'</code> and <code>config: { view: 'list' }</code></li>
<li>Pass the resolved schema to <code>&lt;AForm&gt;</code> — the child array data at <code>data[fieldname]</code>
flows into ATable's rows via the <code>componentProps</code> fallback</li>
</ol>
<p>AForm is a pure renderer. Resolution lives in the framework (Registry).</p>
<h2 id="variants" tabindex="-1">Variants <a class="header-anchor" href="#variants" aria-hidden="true">#</a></h2>
<h3 id="resolved-schema" tabindex="-1">Resolved Schema <a class="header-anchor" href="#resolved-schema" aria-hidden="true">#</a></h3>
<p>Shows <code>registry.resolveSchema()</code> for 1:1 nesting. One call, one <code>&lt;AForm&gt;</code>, automatic nesting.</p>
<h3 id="standalone-no-framework" tabindex="-1">Standalone (no framework) <a class="header-anchor" href="#standalone-no-framework" aria-hidden="true">#</a></h3>
<p>Manually attaches a <code>schema</code> array to a field. No Registry, no framework.</p>
<h3 id="hst-integration" tabindex="-1">HST Integration <a class="header-anchor" href="#hst-integration" aria-hidden="true">#</a></h3>
<p>A single resolved schema passed to one <code>&lt;AForm&gt;</code>, with HST managing the underlying state tree.</p>
<h3 id="_1-many-address-list" tabindex="-1">1:Many (Address List) <a class="header-anchor" href="#_1-many-address-list" aria-hidden="true">#</a></h3>
<p>A parent Customer form with scalar fields + an <code>addresses</code> array rendered as ATable.
<code>resolveSchema()</code> auto-derives columns from the Address doctype. Users can override
columns, config, or component by specifying them explicitly on the schema field.</p>
<h2 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-hidden="true">#</a></h2>
<pre><code class="language-typescript"><div class="htw-relative htw-not-prose __histoire-code"><div class="htw-absolute htw-top-0 htw-right-0 htw-text-xs htw-text-white/40">typescript</div><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#6A737D">// 1:1 nesting (default cardinality)</span></span>
<span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> resolved</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> registry.</span><span style="color:#B392F0">resolveSchema</span><span style="color:#E1E4E8">(customerSchema)</span></span>
<span class="line"><span style="color:#6A737D">// resolved[3].schema === [street, city, state, zip_code]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">// 1:many table (cardinality: 'noneOrMany')</span></span>
<span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> resolved</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> registry.</span><span style="color:#B392F0">resolveSchema</span><span style="color:#E1E4E8">(customerWithAddressesSchema)</span></span>
<span class="line"><span style="color:#6A737D">// resolved[3].columns === [{ name: 'street', ... }, { name: 'city', ... }, ...]</span></span>
<span class="line"><span style="color:#6A737D">// resolved[3].component === 'ATable'</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">&#x3C;</span><span style="color:#B392F0">AForm</span><span style="color:#E1E4E8"> :schema</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"resolved"</span><span style="color:#E1E4E8"> v</span><span style="color:#F97583">-</span><span style="color:#B392F0">model</span><span style="color:#E1E4E8">:data</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"customerData"</span><span style="color:#F97583"> /></span></span>
<span class="line"></span></code></pre></div></code></pre>
`;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "nested.story",
  setup(__props, { expose: __expose }) {
    __expose();
    let registryInstance;
    const setupApp = ({ app }) => {
      registryInstance = new me();
      registryInstance.addDoctype(Ii.fromObject(addressSchemaJson));
      registryInstance.addDoctype(Ii.fromObject(customerSchemaJson));
      registryInstance.addDoctype(Ii.fromObject(customerWithAddressesSchemaJson));
      app.provide("$registry", registryInstance);
    };
    const ResolvedSchemaDemo = defineComponent({
      name: "ResolvedSchemaDemo",
      setup() {
        const customerData = ref({
          customer_name: "John Doe",
          email: "john@example.com",
          phone: "555-0123",
          address: {
            street: "123 Main St",
            city: "Springfield",
            state: "IL",
            zip_code: "62701"
          }
        });
        const resolvedSchema = ref(registryInstance.resolveSchema(registryInstance.registry["customer"]));
        return { resolvedSchema, customerData };
      },
      render() {
        return h("div", { class: "nested-form-example" }, [
          h("h4", "Customer Information"),
          h(
            "p",
            { class: "info-text" },
            "registry.resolveSchema() embeds the Address schema inside the resolved link entry. AForm renders it automatically."
          ),
          h(dn, {
            schema: this.resolvedSchema,
            data: this.customerData
          }),
          h("div", { class: "data-preview" }, [
            h("h4", "Resolved Schema (abbreviated):"),
            h(
              "pre",
              JSON.stringify(
                this.resolvedSchema.map((f) => ({
                  fieldname: f.fieldname,
                  fieldtype: f.fieldtype,
                  ...f.schema ? { schema: `[${f.schema.length} fields]` } : {}
                })),
                null,
                2
              )
            )
          ]),
          h("div", { class: "data-preview" }, [
            h("h4", "Form Data:"),
            h("pre", JSON.stringify(this.customerData, null, 2))
          ])
        ]);
      }
    });
    const StandaloneDemo = defineComponent({
      name: "StandaloneDemo",
      setup() {
        const data = ref({
          invoice_number: "INV-001",
          billing: {
            street: "99 Commerce Blvd",
            city: "Austin",
            state: "TX",
            zip_code: "73301"
          }
        });
        const schema = ref([
          {
            fieldname: "invoice_number",
            fieldtype: "Data",
            component: "ATextInput",
            label: "Invoice Number"
          },
          {
            fieldname: "billing",
            options: "address",
            label: "Billing Address",
            // Manually embedded child schema — AForm checks `'schema' in field`
            schema: [
              { fieldname: "street", fieldtype: "Data", component: "ATextInput", label: "Street" },
              { fieldname: "city", fieldtype: "Data", component: "ATextInput", label: "City" },
              { fieldname: "state", fieldtype: "Data", component: "ATextInput", label: "State" },
              { fieldname: "zip_code", fieldtype: "Data", component: "ATextInput", label: "Zip Code" }
            ]
          }
        ]);
        return { schema, data };
      },
      render() {
        return h("div", { class: "nested-form-example" }, [
          h("h4", "Invoice with Billing Address"),
          h(
            "p",
            { class: "info-text" },
            "No Registry involved — the schema property is set manually. AForm just checks for its presence."
          ),
          h(dn, {
            schema: this.schema,
            data: this.data
          }),
          h("div", { class: "data-preview" }, [h("h4", "Form Data:"), h("pre", JSON.stringify(this.data, null, 2))])
        ]);
      }
    });
    const HSTDemo = defineComponent({
      name: "HSTDemo",
      setup() {
        const stonecrop = new At(registryInstance);
        const store = stonecrop.getStore();
        const customerId = "cust-001";
        const initialData = {
          customer_name: "Alice Johnson",
          email: "alice@example.com",
          phone: "555-9876",
          address: {
            street: "456 Oak Ave",
            city: "Portland",
            state: "OR",
            zip_code: "97205"
          }
        };
        stonecrop.addRecord("customer", customerId, initialData);
        const resolvedSchema = ref(registryInstance.resolveSchema(registryInstance.registry["customer"]));
        const customerPath = `customer.${customerId}`;
        const customerFormData = computed({
          get: () => {
            const data = store.get(customerPath);
            return data || {};
          },
          set: (newData) => {
            Object.keys(newData).forEach((key) => {
              store.set(`${customerPath}.${key}`, newData[key]);
            });
          }
        });
        const hstData = computed(() => ({
          customer: store.get(customerPath),
          customerNode: {
            path: customerPath,
            exists: store.has(customerPath),
            parent: store.getNode(customerPath)?.getAncestor()?.getPath() || "root",
            breadcrumbs: store.getNode(customerPath)?.getBreadcrumbs().map((n) => store.getNode(n).getPath())
          },
          address: store.get(`${customerPath}.address`),
          addressNode: {
            path: `${customerPath}.address`,
            exists: store.has(`${customerPath}.address`),
            parent: store.getNode(`${customerPath}.address`)?.getAncestor()?.getPath() || "root",
            breadcrumbs: store.getNode(`${customerPath}.address`)?.getBreadcrumbs().map((n) => store.getNode(n).getPath())
          }
        }));
        const resetData = () => {
          stonecrop.addRecord("customer", customerId, initialData);
        };
        return {
          resolvedSchema,
          customerFormData,
          hstData,
          customerPath,
          resetData
        };
      },
      render() {
        return h("div", { class: "hst-demo" }, [
          h("p", { class: "hst-description" }, [
            "One resolved schema, one AForm, one data object. The ",
            h("strong", "HST"),
            " manages the tree; AForm renders the full hierarchy via the embedded schema property."
          ]),
          h("div", { class: "hst-layout" }, [
            // Left: Single form with resolved schema
            h("div", { class: "hst-forms" }, [
              h("div", { class: "hst-form-section" }, [
                h("h4", "Customer + Address (single AForm)"),
                h("div", { class: "path-indicator" }, `HST Path: ${this.customerPath}`),
                h(dn, {
                  schema: this.resolvedSchema,
                  data: this.customerFormData,
                  "onUpdate:data": (val) => {
                    this.customerFormData = val;
                  }
                })
              ]),
              h("button", { class: "reset-button", onClick: this.resetData }, "Reset Data")
            ]),
            // Right: HST State Visualization
            h("div", { class: "hst-state" }, [
              h("h4", "HST State Tree"),
              h("div", { class: "hst-node-card" }, [
                h("div", { class: "node-header" }, [
                  h("span", { class: "node-type" }, "Customer"),
                  h("span", { class: "node-status exists" }, "exists")
                ]),
                h("div", { class: "node-details" }, [
                  h("div", { class: "detail-row" }, [
                    h("strong", "Path:"),
                    h("code", this.hstData.customerNode?.path || "")
                  ]),
                  h("div", { class: "detail-row" }, [
                    h("strong", "Breadcrumbs:"),
                    h("code", (this.hstData.customerNode?.breadcrumbs || []).join(" > ") || "None")
                  ])
                ]),
                h("div", { class: "node-data" }, [
                  h("strong", "Data:"),
                  h("pre", JSON.stringify(this.hstData.customer, null, 2))
                ])
              ]),
              h("div", { class: "hst-node-card nested" }, [
                h("div", { class: "node-header" }, [
                  h("span", { class: "node-type" }, "Address (nested)"),
                  h(
                    "span",
                    {
                      class: this.hstData.addressNode?.exists ? "node-status exists" : "node-status deleted"
                    },
                    this.hstData.addressNode?.exists ? "exists" : "deleted"
                  )
                ]),
                h("div", { class: "node-details" }, [
                  h("div", { class: "detail-row" }, [
                    h("strong", "Path:"),
                    h("code", this.hstData.addressNode?.path || "")
                  ]),
                  h("div", { class: "detail-row" }, [
                    h("strong", "Parent:"),
                    h("code", this.hstData.addressNode?.parent || "")
                  ])
                ]),
                h("div", { class: "node-data" }, [
                  h("strong", "Data:"),
                  h("pre", this.hstData.address ? JSON.stringify(this.hstData.address, null, 2) : "(not present)")
                ])
              ])
            ])
          ])
        ]);
      }
    });
    const AddressListDemo = defineComponent({
      name: "AddressListDemo",
      setup() {
        const customerData = ref({
          customer_name: "Alice Johnson",
          email: "alice@example.com",
          phone: "555-9876",
          addresses: [
            { street: "123 Main St", city: "Springfield", state: "IL", zip_code: "62701" },
            { street: "456 Oak Ave", city: "Portland", state: "OR", zip_code: "97205" },
            { street: "789 Pine Rd", city: "Austin", state: "TX", zip_code: "73301" }
          ]
        });
        const resolvedSchema = ref(
          registryInstance.resolveSchema(registryInstance.registry["customer-with-addresses"])
        );
        return { resolvedSchema, customerData };
      },
      render() {
        return h("div", { class: "nested-form-example" }, [
          h("h4", "Customer with Multiple Addresses"),
          h(
            "p",
            { class: "info-text" },
            "The \"addresses\" field is declared via a `links` entry with cardinality: 'noneOrMany' and target: 'address'. resolveSchema() auto-derives columns from the Address doctype and sets component to ATable."
          ),
          h(dn, {
            schema: this.resolvedSchema,
            data: this.customerData,
            "onUpdate:data": (val) => {
              this.customerData = val;
            }
          }),
          h("div", { class: "data-preview" }, [
            h("h4", "Resolved Schema (abbreviated):"),
            h(
              "pre",
              JSON.stringify(
                this.resolvedSchema.map((f) => ({
                  fieldname: f.fieldname,
                  fieldtype: f.fieldtype,
                  ...f.component ? { component: f.component } : {},
                  ...f.columns ? {
                    columns: f.columns.map((c) => ({
                      name: c.name,
                      label: c.label,
                      fieldtype: c.fieldtype
                    }))
                  } : {},
                  ...f.config ? { config: f.config } : {}
                })),
                null,
                2
              )
            )
          ]),
          h("div", { class: "data-preview" }, [
            h("h4", "Form Data:"),
            h("pre", JSON.stringify(this.customerData, null, 2))
          ])
        ]);
      }
    });
    const __returned__ = { get registryInstance() {
      return registryInstance;
    }, set registryInstance(v) {
      registryInstance = v;
    }, setupApp, ResolvedSchemaDemo, StandaloneDemo, HSTDemo, AddressListDemo };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, {
    title: "nested schema",
    group: "aform"
  }, {
    default: withCtx(() => [
      createVNode(_component_Variant, {
        title: "resolved schema",
        "setup-app": $setup.setupApp
      }, {
        default: withCtx(() => [
          createBaseVNode("div", null, [
            _cache[0] || (_cache[0] = createBaseVNode(
              "h3",
              null,
              "Registry.resolveSchema() — Automatic Nested Forms",
              -1
              /* CACHED */
            )),
            createVNode($setup["ResolvedSchemaDemo"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, {
        title: "standalone (no framework)",
        "setup-app": $setup.setupApp
      }, {
        default: withCtx(() => [
          createBaseVNode("div", null, [
            _cache[1] || (_cache[1] = createBaseVNode(
              "h3",
              null,
              "Standalone — Manual Schema Embedding",
              -1
              /* CACHED */
            )),
            createVNode($setup["StandaloneDemo"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, {
        title: "HST integration",
        "setup-app": $setup.setupApp
      }, {
        default: withCtx(() => [
          createBaseVNode("div", null, [
            _cache[2] || (_cache[2] = createBaseVNode(
              "h3",
              null,
              "HST + Resolved Schema",
              -1
              /* CACHED */
            )),
            createVNode($setup["HSTDemo"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, {
        title: "1:many (address list)",
        "setup-app": $setup.setupApp
      }, {
        default: withCtx(() => [
          createBaseVNode("div", null, [
            _cache[3] || (_cache[3] = createBaseVNode(
              "h3",
              null,
              "1:Many — Parent Form with Child Table",
              -1
              /* CACHED */
            )),
            createVNode($setup["AddressListDemo"])
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
_sfc_main.__file = "aform/nested.story.vue";
const nested_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c904814b"], ["__file", "/home/dell/StoneCrop/stonecrop/examples/aform/nested.story.vue"]]);
export {
  nested_story as default
};
