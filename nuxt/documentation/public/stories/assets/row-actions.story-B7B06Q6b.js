import { ap as resolveComponent, aq as openBlock, ar as createBlock, as as withCtx, at as createVNode, au as createBaseVNode, aU as createElementBlock, aX as Fragment, aY as renderList, aA as toDisplayString, av as defineComponent, aw as reactive, ay as ref } from "./vendor-BFYlYCwc.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const block0 = (Comp) => {
  Comp.doc = `<h1 id="row-actions" tabindex="-1">Row Actions <a class="header-anchor" href="#row-actions" aria-hidden="true">#</a></h1>
<p>The <code>rowActions</code> configuration allows you to add row-level action buttons to each row in the table.</p>
<h2 id="configuration-options" tabindex="-1">Configuration Options <a class="header-anchor" href="#configuration-options" aria-hidden="true">#</a></h2>
<pre><code class="language-typescript"><div class="htw-relative htw-not-prose __histoire-code"><div class="htw-absolute htw-top-0 htw-right-0 htw-text-xs htw-text-white/40">typescript</div><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#B392F0">rowActions</span><span style="color:#E1E4E8">: {</span></span>
<span class="line"><span style="color:#B392F0">  enabled</span><span style="color:#E1E4E8">: boolean           </span><span style="color:#6A737D">// Enable/disable row actions</span></span>
<span class="line"><span style="color:#E1E4E8">  position</span><span style="color:#F97583">?:</span><span style="color:#9ECBFF"> 'before-index'</span><span style="color:#F97583"> |</span><span style="color:#9ECBFF"> 'after-index'</span><span style="color:#F97583"> |</span><span style="color:#9ECBFF"> 'end'</span><span style="color:#6A737D">  // Button position</span></span>
<span class="line"><span style="color:#E1E4E8">  dropdownThreshold</span><span style="color:#F97583">?:</span><span style="color:#E1E4E8"> number </span><span style="color:#6A737D">// Width threshold for dropdown mode (px)</span></span>
<span class="line"><span style="color:#E1E4E8">  forceDropdown</span><span style="color:#F97583">?:</span><span style="color:#E1E4E8"> boolean    </span><span style="color:#6A737D">// Always use dropdown mode</span></span>
<span class="line"><span style="color:#E1E4E8">  actions</span><span style="color:#F97583">?:</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    add?: boolean </span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> RowActionOptions</span></span>
<span class="line"><span style="color:#F97583">    delete?:</span><span style="color:#E1E4E8"> boolean </span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> RowActionOptions</span></span>
<span class="line"><span style="color:#E1E4E8">    duplicate</span><span style="color:#F97583">?:</span><span style="color:#E1E4E8"> boolean </span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> RowActionOptions</span></span>
<span class="line"><span style="color:#E1E4E8">    insertAbove</span><span style="color:#F97583">?:</span><span style="color:#E1E4E8"> boolean </span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> RowActionOptions</span></span>
<span class="line"><span style="color:#E1E4E8">    insertBelow</span><span style="color:#F97583">?:</span><span style="color:#E1E4E8"> boolean </span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> RowActionOptions</span></span>
<span class="line"><span style="color:#E1E4E8">    move</span><span style="color:#F97583">?:</span><span style="color:#E1E4E8"> boolean </span><span style="color:#F97583">|</span><span style="color:#E1E4E8"> RowActionOptions</span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"></span></code></pre></div></code></pre>
<h2 id="events" tabindex="-1">Events <a class="header-anchor" href="#events" aria-hidden="true">#</a></h2>
<ul>
<li><code>row:add</code> - Emitted when a row is added</li>
<li><code>row:delete</code> - Emitted when a row is deleted</li>
<li><code>row:duplicate</code> - Emitted when a row is duplicated</li>
<li><code>row:insert-above</code> - Emitted when a row is inserted above</li>
<li><code>row:insert-below</code> - Emitted when a row is inserted below</li>
<li><code>row:move</code> - Emitted when a row move is requested</li>
</ul>
`;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "row-actions.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const createSampleRows = () => [
      { id: 1, name: "Alice Johnson", email: "alice@example.com", status: "active" },
      { id: 2, name: "Bob Smith", email: "bob@example.com", status: "inactive" },
      { id: 3, name: "Charlie Brown", email: "charlie@example.com", status: "active" },
      { id: 4, name: "Diana Ross", email: "diana@example.com", status: "pending" },
      { id: 5, name: "Edward Norton", email: "edward@example.com", status: "active" }
    ];
    const columns = [
      {
        label: "ID",
        name: "id",
        fieldtype: "Int",
        align: "left",
        edit: false,
        width: "3ch"
      },
      {
        label: "Name",
        name: "name",
        fieldtype: "Data",
        align: "left",
        edit: true,
        width: "25ch"
      },
      {
        label: "Email",
        name: "email",
        fieldtype: "Data",
        align: "left",
        edit: true,
        width: "30ch"
      },
      {
        label: "Status",
        name: "status",
        fieldtype: "Data",
        align: "center",
        edit: true,
        width: "15ch"
      }
    ];
    const basicEvents = ref([]);
    const allActionsEvents = ref([]);
    const logEvent = (eventLog, type, event) => {
      const msg = `${type}: row ${event.rowIndex}`;
      eventLog.unshift(msg);
      if (eventLog.length > 5) eventLog.pop();
    };
    const basic_table = reactive({
      rows: createSampleRows(),
      columns: [...columns],
      config: {
        view: "list",
        rowActions: {
          enabled: true,
          position: "before-index",
          actions: {
            add: true,
            delete: true
          }
        }
      }
    });
    const all_actions_table = reactive({
      rows: createSampleRows(),
      columns: [...columns],
      config: {
        view: "list",
        rowActions: {
          enabled: true,
          position: "before-index",
          actions: {
            add: true,
            delete: true,
            duplicate: true,
            insertAbove: true,
            insertBelow: true
          }
        }
      }
    });
    const dropdown_table = reactive({
      rows: createSampleRows(),
      columns: [...columns],
      config: {
        view: "list",
        rowActions: {
          enabled: true,
          forceDropdown: true,
          actions: {
            add: true,
            delete: true,
            duplicate: true,
            insertAbove: true,
            insertBelow: true
          }
        }
      }
    });
    const after_index_table = reactive({
      rows: createSampleRows(),
      columns: [...columns],
      config: {
        view: "list",
        rowActions: {
          enabled: true,
          position: "after-index",
          actions: {
            add: true,
            delete: true,
            duplicate: true
          }
        }
      }
    });
    const end_position_table = reactive({
      rows: createSampleRows(),
      columns: [...columns],
      config: {
        view: "list",
        rowActions: {
          enabled: true,
          position: "end",
          actions: {
            add: true,
            delete: true
          }
        }
      }
    });
    const custom_labels_table = reactive({
      rows: createSampleRows(),
      columns: [...columns],
      config: {
        view: "list",
        rowActions: {
          enabled: true,
          forceDropdown: true,
          actions: {
            add: { enabled: true, label: "New Row" },
            delete: { enabled: true, label: "Remove" },
            duplicate: { enabled: true, label: "Copy Row" },
            insertAbove: { enabled: true, label: "Add Above" },
            insertBelow: { enabled: true, label: "Add Below" }
          }
        }
      }
    });
    const uncounted_table = reactive({
      rows: createSampleRows(),
      columns: [...columns],
      config: {
        view: "uncounted",
        rowActions: {
          enabled: true,
          actions: {
            add: true,
            delete: true,
            duplicate: true
          }
        }
      }
    });
    const __returned__ = { createSampleRows, columns, basicEvents, allActionsEvents, logEvent, basic_table, all_actions_table, dropdown_table, after_index_table, end_position_table, custom_labels_table, uncounted_table };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "event-log" };
const _hoisted_2 = { class: "event-log" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ATable = resolveComponent("ATable");
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { title: "row-actions" }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "basic (add/delete)" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            _cache[21] || (_cache[21] = createBaseVNode(
              "strong",
              null,
              "Events:",
              -1
              /* CACHED */
            )),
            (openBlock(true), createElementBlock(
              Fragment,
              null,
              renderList($setup.basicEvents, (event, i) => {
                return openBlock(), createElementBlock(
                  "span",
                  { key: i },
                  toDisplayString(event),
                  1
                  /* TEXT */
                );
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          createVNode(_component_ATable, {
            rows: $setup.basic_table.rows,
            "onUpdate:rows": _cache[0] || (_cache[0] = ($event) => $setup.basic_table.rows = $event),
            columns: $setup.basic_table.columns,
            "onUpdate:columns": _cache[1] || (_cache[1] = ($event) => $setup.basic_table.columns = $event),
            config: $setup.basic_table.config,
            "onRow:add": _cache[2] || (_cache[2] = (e) => $setup.logEvent($setup.basicEvents, "add", e)),
            "onRow:delete": _cache[3] || (_cache[3] = (e) => $setup.logEvent($setup.basicEvents, "delete", e))
          }, null, 8, ["rows", "columns", "config"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "all actions" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_2, [
            _cache[22] || (_cache[22] = createBaseVNode(
              "strong",
              null,
              "Events:",
              -1
              /* CACHED */
            )),
            (openBlock(true), createElementBlock(
              Fragment,
              null,
              renderList($setup.allActionsEvents, (event, i) => {
                return openBlock(), createElementBlock(
                  "span",
                  { key: i },
                  toDisplayString(event),
                  1
                  /* TEXT */
                );
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          createVNode(_component_ATable, {
            rows: $setup.all_actions_table.rows,
            "onUpdate:rows": _cache[4] || (_cache[4] = ($event) => $setup.all_actions_table.rows = $event),
            columns: $setup.all_actions_table.columns,
            "onUpdate:columns": _cache[5] || (_cache[5] = ($event) => $setup.all_actions_table.columns = $event),
            config: $setup.all_actions_table.config,
            "onRow:add": _cache[6] || (_cache[6] = (e) => $setup.logEvent($setup.allActionsEvents, "add", e)),
            "onRow:delete": _cache[7] || (_cache[7] = (e) => $setup.logEvent($setup.allActionsEvents, "delete", e)),
            "onRow:duplicate": _cache[8] || (_cache[8] = (e) => $setup.logEvent($setup.allActionsEvents, "duplicate", e)),
            "onRow:insertAbove": _cache[9] || (_cache[9] = (e) => $setup.logEvent($setup.allActionsEvents, "insert-above", e)),
            "onRow:insertBelow": _cache[10] || (_cache[10] = (e) => $setup.logEvent($setup.allActionsEvents, "insert-below", e))
          }, null, 8, ["rows", "columns", "config"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "dropdown mode" }, {
        default: withCtx(() => [
          _cache[23] || (_cache[23] = createBaseVNode(
            "p",
            null,
            "Row actions forced into dropdown mode for compact display.",
            -1
            /* CACHED */
          )),
          createVNode(_component_ATable, {
            rows: $setup.dropdown_table.rows,
            "onUpdate:rows": _cache[11] || (_cache[11] = ($event) => $setup.dropdown_table.rows = $event),
            columns: $setup.dropdown_table.columns,
            "onUpdate:columns": _cache[12] || (_cache[12] = ($event) => $setup.dropdown_table.columns = $event),
            config: $setup.dropdown_table.config
          }, null, 8, ["rows", "columns", "config"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "position: after-index" }, {
        default: withCtx(() => [
          _cache[24] || (_cache[24] = createBaseVNode(
            "p",
            null,
            "Row actions positioned after the row index column.",
            -1
            /* CACHED */
          )),
          createVNode(_component_ATable, {
            rows: $setup.after_index_table.rows,
            "onUpdate:rows": _cache[13] || (_cache[13] = ($event) => $setup.after_index_table.rows = $event),
            columns: $setup.after_index_table.columns,
            "onUpdate:columns": _cache[14] || (_cache[14] = ($event) => $setup.after_index_table.columns = $event),
            config: $setup.after_index_table.config
          }, null, 8, ["rows", "columns", "config"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "position: end" }, {
        default: withCtx(() => [
          _cache[25] || (_cache[25] = createBaseVNode(
            "p",
            null,
            "Row actions positioned at the end of each row.",
            -1
            /* CACHED */
          )),
          createVNode(_component_ATable, {
            rows: $setup.end_position_table.rows,
            "onUpdate:rows": _cache[15] || (_cache[15] = ($event) => $setup.end_position_table.rows = $event),
            columns: $setup.end_position_table.columns,
            "onUpdate:columns": _cache[16] || (_cache[16] = ($event) => $setup.end_position_table.columns = $event),
            config: $setup.end_position_table.config
          }, null, 8, ["rows", "columns", "config"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "custom labels" }, {
        default: withCtx(() => [
          _cache[26] || (_cache[26] = createBaseVNode(
            "p",
            null,
            "Row actions with custom labels in dropdown mode.",
            -1
            /* CACHED */
          )),
          createVNode(_component_ATable, {
            rows: $setup.custom_labels_table.rows,
            "onUpdate:rows": _cache[17] || (_cache[17] = ($event) => $setup.custom_labels_table.rows = $event),
            columns: $setup.custom_labels_table.columns,
            "onUpdate:columns": _cache[18] || (_cache[18] = ($event) => $setup.custom_labels_table.columns = $event),
            config: $setup.custom_labels_table.config
          }, null, 8, ["rows", "columns", "config"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "uncounted view" }, {
        default: withCtx(() => [
          _cache[27] || (_cache[27] = createBaseVNode(
            "p",
            null,
            "Row actions work with uncounted view (no row numbers).",
            -1
            /* CACHED */
          )),
          createVNode(_component_ATable, {
            rows: $setup.uncounted_table.rows,
            "onUpdate:rows": _cache[19] || (_cache[19] = ($event) => $setup.uncounted_table.rows = $event),
            columns: $setup.uncounted_table.columns,
            "onUpdate:columns": _cache[20] || (_cache[20] = ($event) => $setup.uncounted_table.columns = $event),
            config: $setup.uncounted_table.config
          }, null, 8, ["rows", "columns", "config"])
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
_sfc_main.__file = "atable/row-actions.story.vue";
const rowActions_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-20cb0dc1"], ["__file", "/home/dell/StoneCrop/stonecrop/examples/atable/row-actions.story.vue"]]);
export {
  rowActions_story as default
};
