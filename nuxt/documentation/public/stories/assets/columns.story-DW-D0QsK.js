import { ap as resolveComponent, aq as openBlock, ar as createBlock, as as withCtx, at as createVNode, au as createBaseVNode, aA as toDisplayString, az as createTextVNode, av as defineComponent, ay as ref } from "./vendor-BFYlYCwc.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "columns.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const sampleData = [
      { id: 1, name: "Alice", age: 30, department: "Engineering" },
      { id: 2, name: "Bob", age: 25, department: "Design" },
      { id: 3, name: "Carol", age: 35, department: "Product" }
    ];
    const tableRows = ref([...sampleData]);
    const tableColumns = ref([
      { name: "id", label: "ID", width: "80px", fieldtype: "Int" },
      { name: "name", label: "Name", width: "150px", fieldtype: "Data" },
      { name: "age", label: "Age", width: "100px", fieldtype: "Int" }
    ]);
    const tableConfig = {
      view: "list",
      fullWidth: true
    };
    const onColumnsUpdate = (columns) => {
      console.log("Columns updated:", columns);
    };
    const addColumn = () => {
      const columnCount = tableColumns.value.length;
      const newColumn = {
        name: `column_${columnCount + 1}`,
        label: `Column ${columnCount + 1}`,
        width: "120px",
        fieldtype: "Data"
      };
      tableColumns.value.push(newColumn);
      tableRows.value.forEach((row, index) => {
        row[newColumn.name] = `Value ${index + 1}`;
      });
    };
    const removeColumn = () => {
      if (tableColumns.value.length > 1) {
        const removedColumn = tableColumns.value.pop();
        if (removedColumn) {
          tableRows.value.forEach((row) => {
            delete row[removedColumn.name];
          });
        }
      }
    };
    const resizeFirstColumn = () => {
      if (tableColumns.value.length > 0) {
        const currentWidth = parseInt(tableColumns.value[0].width || "80");
        const newWidth = currentWidth === 80 ? 200 : 80;
        tableColumns.value[0] = {
          ...tableColumns.value[0],
          width: `${newWidth}px`
        };
      }
    };
    const schemaFields = [
      { fieldname: "id", fieldtype: "Int", label: "ID", width: "80px" },
      { fieldname: "name", fieldtype: "Data", label: "Name", width: "150px" },
      { fieldname: "department", fieldtype: "Data", label: "Department", width: "150px" },
      { fieldname: "age", fieldtype: "Int", label: "Age", width: "80px", align: "right" },
      { fieldname: "internal_notes", fieldtype: "Data", label: "Internal Notes", hidden: true }
    ];
    const schemaRows = ref([
      { id: 1, name: "Alice", department: "Engineering", age: 30, internal_notes: "confidential" },
      { id: 2, name: "Bob", department: "Design", age: 25, internal_notes: "confidential" },
      { id: 3, name: "Carol", department: "Product", age: 35, internal_notes: "confidential" }
    ]);
    const schemaConfig = { view: "list", fullWidth: true };
    const __returned__ = { sampleData, tableRows, tableColumns, tableConfig, onColumnsUpdate, addColumn, removeColumn, resizeFirstColumn, schemaFields, schemaRows, schemaConfig };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { style: { "margin-top": "20px" } };
const _hoisted_2 = { style: { "margin-top": "20px" } };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ATable = resolveComponent("ATable");
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { title: "columns" }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "v-model:columns" }, {
        default: withCtx(() => [
          createBaseVNode("div", { style: { "margin-bottom": "20px" } }, [
            _cache[3] || (_cache[3] = createBaseVNode(
              "h3",
              null,
              "Columns Model Example",
              -1
              /* CACHED */
            )),
            _cache[4] || (_cache[4] = createBaseVNode(
              "p",
              null,
              "This example shows how to use v-model:columns to make columns reactive.",
              -1
              /* CACHED */
            )),
            createBaseVNode("button", {
              onClick: $setup.addColumn,
              style: { "margin-right": "10px" }
            }, "Add Column"),
            createBaseVNode("button", {
              onClick: $setup.removeColumn,
              style: { "margin-right": "10px" }
            }, "Remove Column"),
            createBaseVNode("button", { onClick: $setup.resizeFirstColumn }, "Resize First Column")
          ]),
          createVNode(_component_ATable, {
            rows: $setup.tableRows,
            "onUpdate:rows": _cache[0] || (_cache[0] = ($event) => $setup.tableRows = $event),
            columns: $setup.tableColumns,
            "onUpdate:columns": _cache[1] || (_cache[1] = ($event) => $setup.tableColumns = $event),
            config: $setup.tableConfig,
            "onColumns:update": $setup.onColumnsUpdate
          }, null, 8, ["rows", "columns"]),
          createBaseVNode("div", _hoisted_1, [
            _cache[5] || (_cache[5] = createBaseVNode(
              "h4",
              null,
              "Current Columns Configuration:",
              -1
              /* CACHED */
            )),
            createBaseVNode(
              "pre",
              null,
              toDisplayString(JSON.stringify($setup.tableColumns, null, 2)),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Schema-driven columns" }, {
        default: withCtx(() => [
          _cache[8] || (_cache[8] = createBaseVNode(
            "div",
            { style: { "margin-bottom": "20px" } },
            [
              createBaseVNode("h3", null, "Schema-driven columns"),
              createBaseVNode("p", null, [
                createTextVNode(" Pass a "),
                createBaseVNode("code", null, ":schema"),
                createTextVNode(" prop instead of "),
                createBaseVNode("code", null, "v-model:columns"),
                createTextVNode(". ATable calls "),
                createBaseVNode("code", null, "schemaToColumns()"),
                createTextVNode(" internally — "),
                createBaseVNode("code", null, "fieldname"),
                createTextVNode(" becomes "),
                createBaseVNode("code", null, "name"),
                createTextVNode(", "),
                createBaseVNode("code", null, "hidden: true"),
                createTextVNode(" fields are excluded, and form-only properties are stripped. ")
              ])
            ],
            -1
            /* CACHED */
          )),
          createVNode(_component_ATable, {
            rows: $setup.schemaRows,
            "onUpdate:rows": _cache[2] || (_cache[2] = ($event) => $setup.schemaRows = $event),
            schema: $setup.schemaFields,
            config: $setup.schemaConfig
          }, null, 8, ["rows"]),
          createBaseVNode("div", _hoisted_2, [
            _cache[6] || (_cache[6] = createBaseVNode(
              "h4",
              null,
              "Schema (source of truth):",
              -1
              /* CACHED */
            )),
            createBaseVNode(
              "pre",
              null,
              toDisplayString(JSON.stringify($setup.schemaFields, null, 2)),
              1
              /* TEXT */
            ),
            _cache[7] || (_cache[7] = createBaseVNode(
              "p",
              { style: { "font-style": "italic", "color": "#666", "margin-top": "8px" } },
              [
                createBaseVNode("code", null, "internal_notes"),
                createTextVNode(" has "),
                createBaseVNode("code", null, "hidden: true"),
                createTextVNode(" and does not appear as a column. ")
              ],
              -1
              /* CACHED */
            ))
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
_sfc_main.__file = "atable/columns.story.vue";
const columns_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-be0f6750"], ["__file", "/home/dell/StoneCrop/stonecrop/examples/atable/columns.story.vue"]]);
export {
  columns_story as default
};
