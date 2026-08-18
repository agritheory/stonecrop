import { ap as resolveComponent, aq as openBlock, ar as createBlock, as as withCtx, at as createVNode, au as createBaseVNode, az as createTextVNode, av as defineComponent, aE as h, aF as dn, ax as computed, ay as ref } from "./vendor-BFYlYCwc.js";
import { m as me, I as Ii, A as At } from "./stonecrop-DamNJegO.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const name$3 = "Task";
const slug$3 = "task";
const fields$3 = [{ "fieldname": "name", "fieldtype": "Data", "component": "ATextInput", "label": "Task Name" }, { "fieldname": "status", "fieldtype": "Data", "component": "ATextInput", "label": "Status" }];
const taskSchema = {
  name: name$3,
  slug: slug$3,
  fields: fields$3
};
const name$2 = "Recipe";
const slug$2 = "recipe";
const fields$2 = [{ "fieldname": "name", "fieldtype": "Data", "component": "ATextInput", "label": "Recipe Name" }, { "fieldname": "description", "fieldtype": "Data", "component": "ATextInput", "label": "Description" }, { "fieldname": "tasks", "fieldtype": "Link", "component": "ATable", "label": "Tasks", "options": "task" }];
const links$2 = { "tasks": { "target": "task", "cardinality": "noneOrMany", "backlink": "recipe", "fieldname": "tasks", "fetch": { "method": "sync" } } };
const recipeSyncSchema = {
  name: name$2,
  slug: slug$2,
  fields: fields$2,
  links: links$2
};
const name$1 = "RecipeLazy";
const slug$1 = "recipe-lazy";
const fields$1 = [{ "fieldname": "name", "fieldtype": "Data", "component": "ATextInput", "label": "Recipe Name" }, { "fieldname": "description", "fieldtype": "Data", "component": "ATextInput", "label": "Description" }, { "fieldname": "tasks", "fieldtype": "Link", "component": "ATable", "label": "Tasks", "options": "task" }];
const links$1 = { "tasks": { "target": "task", "cardinality": "noneOrMany", "backlink": "recipe", "fieldname": "tasks", "fetch": { "method": "lazy" } } };
const recipeLazySchema = {
  name: name$1,
  slug: slug$1,
  fields: fields$1,
  links: links$1
};
const name = "RecipeBlock";
const slug = "recipe-block";
const fields = [{ "fieldname": "name", "fieldtype": "Data", "component": "ATextInput", "label": "Recipe Name" }, { "fieldname": "description", "fieldtype": "Data", "component": "ATextInput", "label": "Description" }, { "fieldname": "tasks", "fieldtype": "Link", "component": "ATable", "label": "Tasks (sync + blockWorkflows)", "options": "task" }, { "fieldname": "notes", "fieldtype": "Link", "component": "ATable", "label": "Notes (sync + no block)", "options": "task" }];
const links = { "tasks": { "target": "task", "cardinality": "noneOrMany", "backlink": "recipe", "fieldname": "tasks", "fetch": { "method": "sync" }, "blockWorkflows": true }, "notes": { "target": "task", "cardinality": "noneOrMany", "backlink": "recipe", "fieldname": "notes", "fetch": { "method": "sync" }, "blockWorkflows": false } };
const recipeBlockSchema = {
  name,
  slug,
  fields,
  links
};
const block0 = (Comp) => {
  Comp.doc = '<h1 id="fetch-strategies" tabindex="-1">Fetch Strategies <a class="header-anchor" href="#fetch-strategies" aria-hidden="true">#</a></h1>\n<p>Demonstrates the <code>fetch</code> property on <code>LinkDeclaration</code> and how it affects data loading behavior.</p>\n<h2 id="sync-fetch" tabindex="-1">Sync Fetch <a class="header-anchor" href="#sync-fetch" aria-hidden="true">#</a></h2>\n<p>Linked data is included in the initial GraphQL query. Use for data that is:</p>\n<ul>\n<li>Small and always needed</li>\n<li>Required for workflow actions</li>\n<li>Cheap to include in every query</li>\n</ul>\n<h2 id="lazy-fetch" tabindex="-1">Lazy Fetch <a class="header-anchor" href="#lazy-fetch" aria-hidden="true">#</a></h2>\n<p>Linked data is loaded on demand in a separate query. Use for data that is:</p>\n<ul>\n<li>Large or expensive to load</li>\n<li>Rarely needed</li>\n<li>User-initiated</li>\n</ul>\n<h2 id="blockworkflows" tabindex="-1">blockWorkflows <a class="header-anchor" href="#blockworkflows" aria-hidden="true">#</a></h2>\n<p>Controls whether workflow actions are blocked until linked data loads:</p>\n<ul>\n<li><code>sync</code> links default to <code>blockWorkflows: true</code></li>\n<li><code>lazy</code> links default to <code>blockWorkflows: false</code></li>\n<li>Can be overridden explicitly on either strategy</li>\n</ul>\n';
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "fetch-strategies.story",
  setup(__props, { expose: __expose }) {
    __expose();
    let registryInstance;
    let stonecropInstance;
    const setupApp = ({ app }) => {
      registryInstance = new me();
      registryInstance.addDoctype(Ii.fromObject(taskSchema));
      registryInstance.addDoctype(Ii.fromObject(recipeSyncSchema));
      registryInstance.addDoctype(Ii.fromObject(recipeLazySchema));
      registryInstance.addDoctype(Ii.fromObject(recipeBlockSchema));
      stonecropInstance = new At(registryInstance);
      app.provide("$registry", registryInstance);
    };
    const sampleTasks = [
      { name: "Prepare ingredients", status: "done" },
      { name: "Mix dough", status: "in progress" },
      { name: "Bake", status: "pending" }
    ];
    const SyncDemo = defineComponent({
      name: "SyncDemo",
      setup() {
        const resolvedSchema = computed(() => registryInstance.resolveSchema(registryInstance.registry["recipe"]));
        const data = ref({
          name: "Sourdough Bread",
          description: "Classic long-fermentation recipe",
          tasks: [...sampleTasks]
        });
        return { resolvedSchema, data };
      },
      render() {
        return h("div", { class: "demo-content" }, [
          h(dn, {
            schema: this.resolvedSchema,
            data: this.data,
            "onUpdate:data": (val) => {
              this.data = val;
            }
          }),
          h("div", { class: "data-inspector" }, [
            h("strong", "Tasks loaded:"),
            h("span", `${this.data.tasks?.length ?? 0} tasks (sync - loaded immediately)`)
          ])
        ]);
      }
    });
    const LazyDemo = defineComponent({
      name: "LazyDemo",
      setup() {
        const resolvedSchema = computed(() => registryInstance.resolveSchema(registryInstance.registry["recipe-lazy"]));
        const data = ref({
          name: "Sourdough Bread",
          description: "Classic long-fermentation recipe"
        });
        const tasksLoaded = ref(false);
        const loadTasks = () => {
          data.value.tasks = [...sampleTasks];
          tasksLoaded.value = true;
        };
        return { resolvedSchema, data, tasksLoaded, loadTasks };
      },
      render() {
        return h("div", { class: "demo-content" }, [
          h(dn, {
            schema: this.resolvedSchema,
            data: this.data,
            "onUpdate:data": (val) => {
              this.data = val;
            }
          }),
          h("div", { class: "lazy-controls" }, [
            h(
              "button",
              {
                class: "load-button",
                onClick: this.loadTasks,
                disabled: this.tasksLoaded
              },
              this.tasksLoaded ? "Tasks Loaded" : "Load Tasks (lazy)"
            )
          ]),
          h("div", { class: "data-inspector" }, [
            h("strong", "Tasks loaded:"),
            h(
              "span",
              `${this.data.tasks?.length ?? 0} tasks (lazy - ${this.tasksLoaded ? "manually loaded" : "not yet loaded"})`
            )
          ])
        ]);
      }
    });
    const BlockWorkflowsDemo = defineComponent({
      name: "BlockWorkflowsDemo",
      setup() {
        const resolvedSchema = computed(() => registryInstance.resolveSchema(registryInstance.registry["recipe-block"]));
        stonecropInstance.addRecord("recipe-block", "demo-1", {
          name: "Sourdough Bread",
          description: "Classic long-fermentation recipe",
          notes: [...sampleTasks]
        });
        const data = ref(stonecropInstance.getStore().get("recipe-block.demo-1") || {});
        const workflowStatus = computed(() => {
          if (!stonecropInstance) return { ready: true };
          const doctype = registryInstance.registry["recipe-block"];
          return stonecropInstance.isWorkflowReady(doctype, "demo-1");
        });
        const loadTasks = () => {
          const record = stonecropInstance.getStore().get("recipe-block.demo-1") || {};
          record.tasks = [...sampleTasks];
          stonecropInstance.addRecord("recipe-block", "demo-1", record);
          data.value = record;
        };
        return { resolvedSchema, data, workflowStatus, loadTasks };
      },
      render() {
        return h("div", { class: "demo-content" }, [
          h("p", { class: "demo-description" }, [
            "This form has two sync links: ",
            h("strong", "tasks"),
            " (blocks workflow) and ",
            h("strong", "notes"),
            " (does not block). Try the submit button below."
          ]),
          h(dn, {
            schema: this.resolvedSchema,
            data: this.data,
            "onUpdate:data": (val) => {
              this.data = val;
            }
          }),
          h("div", { class: "workflow-status" }, [
            h("strong", "Workflow status: "),
            h(
              "span",
              {
                class: this.workflowStatus.ready ? "status-ready" : "status-blocked"
              },
              this.workflowStatus.ready ? "Ready" : `Blocked by: ${this.workflowStatus.blockedLinks?.join(", ")}`
            )
          ]),
          h("div", { class: "action-buttons" }, [
            h(
              "button",
              {
                class: "action-button",
                disabled: !this.workflowStatus.ready,
                onClick: () => alert("Action executed!")
              },
              "Submit Recipe"
            ),
            h(
              "button",
              {
                class: "load-button",
                onClick: this.loadTasks,
                disabled: this.workflowStatus.ready
              },
              this.workflowStatus.ready ? "Tasks Loaded" : "Load Tasks (to unblock)"
            )
          ])
        ]);
      }
    });
    const __returned__ = { get registryInstance() {
      return registryInstance;
    }, set registryInstance(v) {
      registryInstance = v;
    }, get stonecropInstance() {
      return stonecropInstance;
    }, set stonecropInstance(v) {
      stonecropInstance = v;
    }, setupApp, sampleTasks, SyncDemo, LazyDemo, BlockWorkflowsDemo };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "fetch-demo" };
const _hoisted_2 = { class: "comparison-grid" };
const _hoisted_3 = { class: "demo-panel sync" };
const _hoisted_4 = { class: "demo-panel lazy" };
const _hoisted_5 = { class: "fetch-demo" };
const _hoisted_6 = { class: "fetch-demo" };
const _hoisted_7 = { class: "fetch-demo" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, {
    title: "fetch strategies",
    group: "aform"
  }, {
    default: withCtx(() => [
      createVNode(_component_Variant, {
        title: "sync vs lazy comparison",
        "setup-app": $setup.setupApp
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            _cache[4] || (_cache[4] = createBaseVNode(
              "div",
              { class: "explanation" },
              [
                createBaseVNode("h3", null, "Sync vs Lazy Fetch Strategies"),
                createBaseVNode("p", null, [
                  createBaseVNode("b", null, "Sync"),
                  createTextVNode(" fetches linked data in the initial query. "),
                  createBaseVNode("b", null, "Lazy"),
                  createTextVNode(" fetches it on demand when explicitly accessed. Both are shown below with the same data source. ")
                ])
              ],
              -1
              /* CACHED */
            )),
            createBaseVNode("div", _hoisted_2, [
              createBaseVNode("div", _hoisted_3, [
                _cache[0] || (_cache[0] = createBaseVNode(
                  "h4",
                  null,
                  "Sync Fetch",
                  -1
                  /* CACHED */
                )),
                _cache[1] || (_cache[1] = createBaseVNode(
                  "p",
                  { class: "strategy-desc" },
                  "Data loaded in initial query",
                  -1
                  /* CACHED */
                )),
                createVNode($setup["SyncDemo"])
              ]),
              createBaseVNode("div", _hoisted_4, [
                _cache[2] || (_cache[2] = createBaseVNode(
                  "h4",
                  null,
                  "Lazy Fetch",
                  -1
                  /* CACHED */
                )),
                _cache[3] || (_cache[3] = createBaseVNode(
                  "p",
                  { class: "strategy-desc" },
                  "Data loaded on demand",
                  -1
                  /* CACHED */
                )),
                createVNode($setup["LazyDemo"])
              ])
            ])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, {
        title: "sync fetch behavior",
        "setup-app": $setup.setupApp
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_5, [
            _cache[5] || (_cache[5] = createBaseVNode(
              "h3",
              null,
              "Sync Fetch — Data in Initial Query",
              -1
              /* CACHED */
            )),
            _cache[6] || (_cache[6] = createBaseVNode(
              "p",
              null,
              " With sync fetch, the linked data is included in the GraphQL query from the start. Notice the tasks appear immediately without any additional loading step. ",
              -1
              /* CACHED */
            )),
            createVNode($setup["SyncDemo"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, {
        title: "lazy fetch behavior",
        "setup-app": $setup.setupApp
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_6, [
            _cache[7] || (_cache[7] = createBaseVNode(
              "h3",
              null,
              "Lazy Fetch — On-Demand Loading",
              -1
              /* CACHED */
            )),
            _cache[8] || (_cache[8] = createBaseVNode(
              "p",
              null,
              " With lazy fetch, the parent form loads first. Linked data is only fetched when explicitly triggered (e.g., clicking the load button or switching tabs). ",
              -1
              /* CACHED */
            )),
            createVNode($setup["LazyDemo"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, {
        title: "blockWorkflows effect",
        "setup-app": $setup.setupApp
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_7, [
            _cache[9] || (_cache[9] = createBaseVNode(
              "h3",
              null,
              "blockWorkflows — Controlling Workflow Blocking",
              -1
              /* CACHED */
            )),
            _cache[10] || (_cache[10] = createBaseVNode(
              "p",
              null,
              [
                createTextVNode(" The "),
                createBaseVNode("code", null, "blockWorkflows"),
                createTextVNode(" property determines whether actions are blocked until linked data is loaded. ")
              ],
              -1
              /* CACHED */
            )),
            createVNode($setup["BlockWorkflowsDemo"])
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
_sfc_main.__file = "aform/fetch-strategies.story.vue";
const fetchStrategies_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8f2f7a7c"], ["__file", "/home/dell/StoneCrop/stonecrop/examples/aform/fetch-strategies.story.vue"]]);
export {
  fetchStrategies_story as default
};
