import { ap as resolveComponent, aq as openBlock, ar as createBlock, as as withCtx, at as createVNode, az as createTextVNode, au as createBaseVNode, aV as withDirectives, aW as vShow, av as defineComponent, aL as onMounted, aw as reactive, ay as ref } from "./vendor-BFYlYCwc.js";
import { h as http_data } from "./http_logs-CrEV9SDE.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const loading = ref();
    onMounted(() => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
      }, 2500);
    });
    const columns = [
      {
        label: "Home Page",
        name: "home_page",
        fieldtype: "Data",
        align: "left",
        edit: false,
        width: "40ch",
        format: (value, context) => {
          return `<a href="${value.title}" target="_blank">${value.title} (IP: ${context.row.ip_address})</a>`;
        }
      },
      {
        label: "HTTP Method",
        name: "http_method",
        fieldtype: "Data",
        align: "left",
        edit: true,
        width: "20ch"
      },
      {
        label: "Report Date",
        name: "report_date",
        fieldtype: "Date",
        align: "center",
        edit: true,
        width: "25ch",
        modalComponent: "ADateSelection",
        format: (value) => new Date(value).toLocaleDateString("en-US")
      }
    ];
    const readonly_columns = [
      {
        label: "Home Page",
        name: "home_page",
        fieldtype: "Data",
        align: "left",
        edit: false,
        width: "40ch",
        format: "(value, { row }) => `${value.title} (IP: ${row.ip_address})`"
      },
      {
        label: "HTTP Method",
        name: "http_method",
        fieldtype: "Data",
        align: "left",
        edit: false,
        width: "20ch"
      },
      {
        label: "Report Date",
        name: "report_date",
        fieldtype: "Date",
        align: "center",
        edit: false,
        width: "25ch",
        modalComponent: "ADateSelection",
        modalComponentExtraProps: { mode: "read" },
        format: (value) => new Date(value).toLocaleDateString("en-US")
      }
    ];
    const columns_filterable = [
      {
        label: "Home Page",
        name: "home_page",
        fieldtype: "Data",
        align: "left",
        edit: false,
        width: "40ch",
        sortable: true,
        filterable: true,
        filterType: "text",
        format: (value, context) => {
          return `<a href="${value.title}" target="_blank">${value.title} (IP: ${context.row.ip_address})</a>`;
        }
      },
      {
        label: "HTTP Method",
        name: "http_method",
        fieldtype: "Data",
        align: "left",
        edit: true,
        width: "20ch",
        sortable: true,
        filterable: true,
        filterType: "select",
        filterOptions: [
          { label: "GET", value: "GET" },
          { label: "POST", value: "POST" },
          { label: "PUT", value: "PUT" },
          { label: "DELETE", value: "DELETE" }
        ]
      },
      {
        label: "Status",
        name: "status",
        fieldtype: "Data",
        align: "center",
        edit: true,
        width: "15ch",
        sortable: true,
        filterable: true,
        filterType: "select"
        // Auto-generate options from data
      },
      {
        label: "Report Date",
        name: "report_date",
        fieldtype: "Date",
        align: "center",
        edit: true,
        width: "25ch",
        sortable: true,
        filterable: true,
        filterType: "dateRange",
        modalComponent: "DateInput",
        format: (value) => {
          const originalDate = new Date(value);
          const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
          const updatedDate = new Date(currentYear, originalDate.getMonth(), originalDate.getDate());
          return updatedDate.toLocaleDateString("en-US");
        }
      }
    ];
    const default_table = reactive({
      rows: http_data,
      columns,
      config: { view: "list" }
    });
    const uncounted_table = reactive({
      rows: http_data,
      columns,
      config: { view: "uncounted" }
    });
    const readonly_table = reactive({
      rows: http_data,
      columns: readonly_columns,
      config: { view: "list" }
    });
    const resizable_1 = reactive({
      rows: http_data,
      columns: [...columns].map((column) => ({ ...column, resizable: true })),
      config: { view: "list" }
    });
    const resizable_2 = reactive({
      rows: http_data,
      columns: [...columns].map((column) => ({ ...column, resizable: true })),
      config: { view: "list" }
    });
    const full_width_table = reactive({
      rows: http_data,
      columns,
      config: { view: "list", fullWidth: true }
    });
    const filterable_table = reactive({
      rows: http_data,
      columns: columns_filterable,
      config: { view: "list" }
    });
    const __returned__ = { loading, columns, readonly_columns, columns_filterable, default_table, uncounted_table, readonly_table, resizable_1, resizable_2, full_width_table, filterable_table };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ATable = resolveComponent("ATable");
  const _component_Variant = resolveComponent("Variant");
  const _component_ATableLoading = resolveComponent("ATableLoading");
  const _component_ATableLoadingBar = resolveComponent("ATableLoadingBar");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { title: "default" }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "default" }, {
        default: withCtx(() => [
          createVNode(_component_ATable, {
            rows: $setup.default_table.rows,
            "onUpdate:rows": _cache[0] || (_cache[0] = ($event) => $setup.default_table.rows = $event),
            columns: $setup.default_table.columns,
            "onUpdate:columns": _cache[1] || (_cache[1] = ($event) => $setup.default_table.columns = $event),
            config: $setup.default_table.config
          }, null, 8, ["rows", "columns", "config"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "uncounted" }, {
        default: withCtx(() => [
          createVNode(_component_ATable, {
            rows: $setup.uncounted_table.rows,
            "onUpdate:rows": _cache[2] || (_cache[2] = ($event) => $setup.uncounted_table.rows = $event),
            columns: $setup.uncounted_table.columns,
            "onUpdate:columns": _cache[3] || (_cache[3] = ($event) => $setup.uncounted_table.columns = $event),
            config: $setup.uncounted_table.config
          }, null, 8, ["rows", "columns", "config"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "read-only" }, {
        default: withCtx(() => [
          createVNode(_component_ATable, {
            rows: $setup.readonly_table.rows,
            "onUpdate:rows": _cache[4] || (_cache[4] = ($event) => $setup.readonly_table.rows = $event),
            columns: $setup.readonly_table.columns,
            "onUpdate:columns": _cache[5] || (_cache[5] = ($event) => $setup.readonly_table.columns = $event),
            config: $setup.readonly_table.config
          }, null, 8, ["rows", "columns", "config"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "full width" }, {
        default: withCtx(() => [
          createVNode(_component_ATable, {
            rows: $setup.full_width_table.rows,
            "onUpdate:rows": _cache[6] || (_cache[6] = ($event) => $setup.full_width_table.rows = $event),
            columns: $setup.full_width_table.columns,
            "onUpdate:columns": _cache[7] || (_cache[7] = ($event) => $setup.full_width_table.columns = $event),
            config: $setup.full_width_table.config
          }, null, 8, ["rows", "columns", "config"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "resizable" }, {
        default: withCtx(() => [
          createVNode(_component_ATable, {
            rows: $setup.resizable_1.rows,
            "onUpdate:rows": _cache[8] || (_cache[8] = ($event) => $setup.resizable_1.rows = $event),
            columns: $setup.resizable_1.columns,
            "onUpdate:columns": _cache[9] || (_cache[9] = ($event) => $setup.resizable_1.columns = $event),
            config: $setup.resizable_1.config
          }, null, 8, ["rows", "columns", "config"]),
          createVNode(_component_ATable, {
            rows: $setup.resizable_2.rows,
            "onUpdate:rows": _cache[10] || (_cache[10] = ($event) => $setup.resizable_2.rows = $event),
            columns: $setup.resizable_2.columns,
            "onUpdate:columns": _cache[11] || (_cache[11] = ($event) => $setup.resizable_2.columns = $event),
            config: $setup.resizable_2.config
          }, null, 8, ["rows", "columns", "config"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "filterable" }, {
        default: withCtx(() => [
          createVNode(_component_ATable, {
            rows: $setup.filterable_table.rows,
            "onUpdate:rows": _cache[12] || (_cache[12] = ($event) => $setup.filterable_table.rows = $event),
            columns: $setup.filterable_table.columns,
            "onUpdate:columns": _cache[13] || (_cache[13] = ($event) => $setup.filterable_table.columns = $event),
            config: $setup.filterable_table.config
          }, null, 8, ["rows", "columns", "config"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "loading options" }, {
        default: withCtx(() => [
          createVNode(_component_ATableLoading, null, {
            default: withCtx(() => [..._cache[16] || (_cache[16] = [
              createTextVNode(
                "Loading",
                -1
                /* CACHED */
              )
            ])]),
            _: 1
            /* STABLE */
          }),
          _cache[19] || (_cache[19] = createBaseVNode(
            "br",
            null,
            null,
            -1
            /* CACHED */
          )),
          createVNode(_component_ATableLoadingBar, null, {
            default: withCtx(() => [..._cache[17] || (_cache[17] = [
              createTextVNode(
                "Loading",
                -1
                /* CACHED */
              )
            ])]),
            _: 1
            /* STABLE */
          }),
          _cache[20] || (_cache[20] = createBaseVNode(
            "br",
            null,
            null,
            -1
            /* CACHED */
          )),
          withDirectives(createVNode(
            _component_ATableLoading,
            null,
            {
              default: withCtx(() => [..._cache[18] || (_cache[18] = [
                createTextVNode(
                  "Loading",
                  -1
                  /* CACHED */
                )
              ])]),
              _: 1
              /* STABLE */
            },
            512
            /* NEED_PATCH */
          ), [
            [vShow, $setup.loading]
          ]),
          withDirectives(createVNode(_component_ATable, {
            rows: $setup.full_width_table.rows,
            "onUpdate:rows": _cache[14] || (_cache[14] = ($event) => $setup.full_width_table.rows = $event),
            columns: $setup.full_width_table.columns,
            "onUpdate:columns": _cache[15] || (_cache[15] = ($event) => $setup.full_width_table.columns = $event),
            config: $setup.full_width_table.config
          }, null, 8, ["rows", "columns", "config"]), [
            [vShow, !$setup.loading]
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
_sfc_main.__file = "atable/default.story.vue";
const default_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/dell/StoneCrop/stonecrop/examples/atable/default.story.vue"]]);
export {
  default_story as default
};
