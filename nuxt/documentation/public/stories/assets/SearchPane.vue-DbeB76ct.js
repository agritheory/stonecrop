const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/search-docs-data-DeWDzvmp.js","assets/vendor-BFYlYCwc.js"])))=>i.map(i=>d[i]);
import { n as ref, k as watch, c as computed, W as markRaw, d as defineComponent, o as openBlock, a as createElementBlock, a2 as renderSlot, v as withKeys, q as normalizeClass, y as createBlock, e as unref, I as Icon, f as createVNode, b as createBaseVNode, z as createTextVNode, t as toDisplayString, F as Fragment, x as renderList, g as createCommentVNode, l as useCssVars, Z as toRefs, $ as useRouter, p as withCtx, bn as useFocus, bo as refDebounced, w as withDirectives, ae as vModelText, a8 as withModifiers, bp as Fuse, _ as __vitePreload } from "./vendor-BFYlYCwc.js";
import { o as onKeyboardShortcut, u as useCommandStore } from "./bundle-main-BAohr2Aw.js";
import { u as useStoryStore } from "./story-CnvscxG8.js";
import "./mapping-DL6SWDil.js";
import { B as BaseEmpty } from "./BaseEmpty.vue-DJTXqGKP.js";
import { _ as _export_sfc, u as useScrollOnActive, B as BaseListItemLink } from "./responsive-B436oPBg.js";
function useSelection(list) {
  const selectedIndex = ref(0);
  watch(list, () => {
    selectedIndex.value = 0;
  });
  function selectNext() {
    selectedIndex.value++;
    if (selectedIndex.value > list.value.length - 1) {
      selectedIndex.value = 0;
    }
  }
  function selectPrevious() {
    selectedIndex.value--;
    if (selectedIndex.value < 0) {
      selectedIndex.value = list.value.length - 1;
    }
  }
  return {
    selectedIndex: computed(() => selectedIndex.value),
    selectNext,
    selectPrevious
  };
}
let searchData$1 = { "index": [{ "id": 0, "text": "a date" }, { "id": 1, "text": "a date time picker" }, { "id": 2, "text": "a date date picker" }, { "id": 3, "text": "a date date input with picker" }, { "id": 4, "text": "a date date selection date picker and time" }, { "id": 5, "text": "a date range" }, { "id": 6, "text": "a date range default edit mode" }, { "id": 7, "text": "a date range read mode" }, { "id": 8, "text": "a date range display mode" }, { "id": 9, "text": "dropdown" }, { "id": 10, "text": "dropdown default" }, { "id": 11, "text": "a duration" }, { "id": 12, "text": "a duration default edit mode" }, { "id": 13, "text": "a duration military time  seconds" }, { "id": 14, "text": "a duration display mode pre saved value" }, { "id": 15, "text": "a duration read mode" }, { "id": 16, "text": "fetch strategies" }, { "id": 17, "text": "fetch strategies sync vs lazy comparison" }, { "id": 18, "text": "fetch strategies sync fetch behavior" }, { "id": 19, "text": "fetch strategies lazy fetch behavior" }, { "id": 20, "text": "fetch strategies block workflows effect" }, { "id": 21, "text": "form" }, { "id": 22, "text": "form form" }, { "id": 23, "text": "form form read only" }, { "id": 24, "text": "form table" }, { "id": 25, "text": "form fieldset" }, { "id": 26, "text": "form fieldset with table" }, { "id": 27, "text": "form hidden fields" }, { "id": 28, "text": "form text box" }, { "id": 29, "text": "inline link" }, { "id": 30, "text": "inline link modes" }, { "id": 31, "text": "inline link filter function" }, { "id": 32, "text": "inline link via resolve schema" }, { "id": 33, "text": "login" }, { "id": 34, "text": "login default" }, { "id": 35, "text": "nested link" }, { "id": 36, "text": "nested link schema with links" }, { "id": 37, "text": "nested link resolved schema" }, { "id": 38, "text": "nested link cardinality types" }, { "id": 39, "text": "nested schema" }, { "id": 40, "text": "nested schema resolved schema" }, { "id": 41, "text": "nested schema standalone no framework" }, { "id": 42, "text": "nested schema hst integration" }, { "id": 43, "text": "nested schema 1 many address list" }, { "id": 44, "text": "components" }, { "id": 45, "text": "components split column" }, { "id": 46, "text": "components arrow" }, { "id": 47, "text": "components text elements" }, { "id": 48, "text": "components button" }, { "id": 49, "text": "components progress block" }, { "id": 50, "text": "components segmented display" }, { "id": 51, "text": "default" }, { "id": 52, "text": "default default" }, { "id": 53, "text": "default metadata" }, { "id": 54, "text": "default list with day divider" }, { "id": 55, "text": "default list filters" }, { "id": 56, "text": "mqtt" }, { "id": 57, "text": "mqtt subscribe to all" }, { "id": 58, "text": "mqtt subscribe to select topics" }, { "id": 59, "text": "default" }, { "id": 60, "text": "default edit mode" }, { "id": 61, "text": "default read mode" }, { "id": 62, "text": "languages" }, { "id": 63, "text": "languages sql" }, { "id": 64, "text": "languages javascript" }, { "id": 65, "text": "languages typescript" }, { "id": 66, "text": "languages python" }, { "id": 67, "text": "columns" }, { "id": 68, "text": "columns v model columns" }, { "id": 69, "text": "columns schema driven columns" }, { "id": 70, "text": "default" }, { "id": 71, "text": "default default" }, { "id": 72, "text": "default uncounted" }, { "id": 73, "text": "default read only" }, { "id": 74, "text": "default full width" }, { "id": 75, "text": "default resizable" }, { "id": 76, "text": "default filterable" }, { "id": 77, "text": "default loading options" }, { "id": 78, "text": "gantt" }, { "id": 79, "text": "gantt default" }, { "id": 80, "text": "gantt gantt no dependency graph" }, { "id": 81, "text": "gantt tree" }, { "id": 82, "text": "gantt tree no dependency graph" }, { "id": 83, "text": "list" }, { "id": 84, "text": "list row navigation" }, { "id": 85, "text": "list pinned columns" }, { "id": 86, "text": "list pinned columns with extra columns" }, { "id": 87, "text": "list expandable" }, { "id": 88, "text": "row actions" }, { "id": 89, "text": "row actions basic add delete" }, { "id": 90, "text": "row actions all actions" }, { "id": 91, "text": "row actions dropdown mode" }, { "id": 92, "text": "row actions position after index" }, { "id": 93, "text": "row actions position end" }, { "id": 94, "text": "row actions custom labels" }, { "id": 95, "text": "row actions uncounted view" }, { "id": 96, "text": "tree" }, { "id": 97, "text": "tree default collapsed" }, { "id": 98, "text": "tree root expansion" }, { "id": 99, "text": "tree branch expansion gantt nodes only" }, { "id": 100, "text": "tree leaf expansion fully expanded" }, { "id": 101, "text": "tree pinned columns" }, { "id": 102, "text": "node editor" }, { "id": 103, "text": "node editor default" }], "idMap": { "0": { "id": "aform-date-story-vue", "kind": "story" }, "1": { "id": "aform-date-story-vue:aform-date-story-vue-0", "kind": "variant" }, "2": { "id": "aform-date-story-vue:aform-date-story-vue-1", "kind": "variant" }, "3": { "id": "aform-date-story-vue:aform-date-story-vue-2", "kind": "variant" }, "4": { "id": "aform-date-story-vue:aform-date-story-vue-3", "kind": "variant" }, "5": { "id": "aform-daterange-story-vue", "kind": "story" }, "6": { "id": "aform-daterange-story-vue:aform-daterange-story-vue-0", "kind": "variant" }, "7": { "id": "aform-daterange-story-vue:aform-daterange-story-vue-1", "kind": "variant" }, "8": { "id": "aform-daterange-story-vue:aform-daterange-story-vue-2", "kind": "variant" }, "9": { "id": "aform-dropdown-story-vue", "kind": "story" }, "10": { "id": "aform-dropdown-story-vue:_default", "kind": "variant" }, "11": { "id": "aform-duration-story-vue", "kind": "story" }, "12": { "id": "aform-duration-story-vue:aform-duration-story-vue-0", "kind": "variant" }, "13": { "id": "aform-duration-story-vue:aform-duration-story-vue-1", "kind": "variant" }, "14": { "id": "aform-duration-story-vue:aform-duration-story-vue-2", "kind": "variant" }, "15": { "id": "aform-duration-story-vue:aform-duration-story-vue-3", "kind": "variant" }, "16": { "id": "aform-fetch-strategies-story-vue", "kind": "story" }, "17": { "id": "aform-fetch-strategies-story-vue:aform-fetch-strategies-story-vue-0", "kind": "variant" }, "18": { "id": "aform-fetch-strategies-story-vue:aform-fetch-strategies-story-vue-1", "kind": "variant" }, "19": { "id": "aform-fetch-strategies-story-vue:aform-fetch-strategies-story-vue-2", "kind": "variant" }, "20": { "id": "aform-fetch-strategies-story-vue:aform-fetch-strategies-story-vue-3", "kind": "variant" }, "21": { "id": "aform-form-story-vue", "kind": "story" }, "22": { "id": "aform-form-story-vue:aform-form-story-vue-0", "kind": "variant" }, "23": { "id": "aform-form-story-vue:aform-form-story-vue-1", "kind": "variant" }, "24": { "id": "aform-form-story-vue:aform-form-story-vue-2", "kind": "variant" }, "25": { "id": "aform-form-story-vue:aform-form-story-vue-3", "kind": "variant" }, "26": { "id": "aform-form-story-vue:aform-form-story-vue-4", "kind": "variant" }, "27": { "id": "aform-form-story-vue:aform-form-story-vue-5", "kind": "variant" }, "28": { "id": "aform-form-story-vue:aform-form-story-vue-6", "kind": "variant" }, "29": { "id": "aform-inline-link-story-vue", "kind": "story" }, "30": { "id": "aform-inline-link-story-vue:aform-inline-link-story-vue-0", "kind": "variant" }, "31": { "id": "aform-inline-link-story-vue:aform-inline-link-story-vue-1", "kind": "variant" }, "32": { "id": "aform-inline-link-story-vue:aform-inline-link-story-vue-2", "kind": "variant" }, "33": { "id": "aform-login-story-vue", "kind": "story" }, "34": { "id": "aform-login-story-vue:_default", "kind": "variant" }, "35": { "id": "aform-nested-link-story-vue", "kind": "story" }, "36": { "id": "aform-nested-link-story-vue:aform-nested-link-story-vue-0", "kind": "variant" }, "37": { "id": "aform-nested-link-story-vue:aform-nested-link-story-vue-1", "kind": "variant" }, "38": { "id": "aform-nested-link-story-vue:aform-nested-link-story-vue-2", "kind": "variant" }, "39": { "id": "aform-nested-story-vue", "kind": "story" }, "40": { "id": "aform-nested-story-vue:aform-nested-story-vue-0", "kind": "variant" }, "41": { "id": "aform-nested-story-vue:aform-nested-story-vue-1", "kind": "variant" }, "42": { "id": "aform-nested-story-vue:aform-nested-story-vue-2", "kind": "variant" }, "43": { "id": "aform-nested-story-vue:aform-nested-story-vue-3", "kind": "variant" }, "44": { "id": "beam-components-story-vue", "kind": "story" }, "45": { "id": "beam-components-story-vue:beam-components-story-vue-0", "kind": "variant" }, "46": { "id": "beam-components-story-vue:beam-components-story-vue-1", "kind": "variant" }, "47": { "id": "beam-components-story-vue:beam-components-story-vue-2", "kind": "variant" }, "48": { "id": "beam-components-story-vue:beam-components-story-vue-3", "kind": "variant" }, "49": { "id": "beam-components-story-vue:beam-components-story-vue-4", "kind": "variant" }, "50": { "id": "beam-components-story-vue:beam-components-story-vue-5", "kind": "variant" }, "51": { "id": "beam-default-story-vue", "kind": "story" }, "52": { "id": "beam-default-story-vue:beam-default-story-vue-0", "kind": "variant" }, "53": { "id": "beam-default-story-vue:beam-default-story-vue-1", "kind": "variant" }, "54": { "id": "beam-default-story-vue:beam-default-story-vue-2", "kind": "variant" }, "55": { "id": "beam-default-story-vue:beam-default-story-vue-3", "kind": "variant" }, "56": { "id": "beam-mqtt-story-vue", "kind": "story" }, "57": { "id": "beam-mqtt-story-vue:beam-mqtt-story-vue-0", "kind": "variant" }, "58": { "id": "beam-mqtt-story-vue:beam-mqtt-story-vue-1", "kind": "variant" }, "59": { "id": "code-editor-default-story-vue", "kind": "story" }, "60": { "id": "code-editor-default-story-vue:code-editor-default-story-vue-0", "kind": "variant" }, "61": { "id": "code-editor-default-story-vue:code-editor-default-story-vue-1", "kind": "variant" }, "62": { "id": "code-editor-languages-story-vue", "kind": "story" }, "63": { "id": "code-editor-languages-story-vue:code-editor-languages-story-vue-0", "kind": "variant" }, "64": { "id": "code-editor-languages-story-vue:code-editor-languages-story-vue-1", "kind": "variant" }, "65": { "id": "code-editor-languages-story-vue:code-editor-languages-story-vue-2", "kind": "variant" }, "66": { "id": "code-editor-languages-story-vue:code-editor-languages-story-vue-3", "kind": "variant" }, "67": { "id": "atable-columns-story-vue", "kind": "story" }, "68": { "id": "atable-columns-story-vue:atable-columns-story-vue-0", "kind": "variant" }, "69": { "id": "atable-columns-story-vue:atable-columns-story-vue-1", "kind": "variant" }, "70": { "id": "atable-default-story-vue", "kind": "story" }, "71": { "id": "atable-default-story-vue:atable-default-story-vue-0", "kind": "variant" }, "72": { "id": "atable-default-story-vue:atable-default-story-vue-1", "kind": "variant" }, "73": { "id": "atable-default-story-vue:atable-default-story-vue-2", "kind": "variant" }, "74": { "id": "atable-default-story-vue:atable-default-story-vue-3", "kind": "variant" }, "75": { "id": "atable-default-story-vue:atable-default-story-vue-4", "kind": "variant" }, "76": { "id": "atable-default-story-vue:atable-default-story-vue-5", "kind": "variant" }, "77": { "id": "atable-default-story-vue:atable-default-story-vue-6", "kind": "variant" }, "78": { "id": "atable-gantt-story-vue", "kind": "story" }, "79": { "id": "atable-gantt-story-vue:atable-gantt-story-vue-0", "kind": "variant" }, "80": { "id": "atable-gantt-story-vue:atable-gantt-story-vue-1", "kind": "variant" }, "81": { "id": "atable-gantt-story-vue:atable-gantt-story-vue-2", "kind": "variant" }, "82": { "id": "atable-gantt-story-vue:atable-gantt-story-vue-3", "kind": "variant" }, "83": { "id": "atable-list-story-vue", "kind": "story" }, "84": { "id": "atable-list-story-vue:atable-list-story-vue-0", "kind": "variant" }, "85": { "id": "atable-list-story-vue:atable-list-story-vue-1", "kind": "variant" }, "86": { "id": "atable-list-story-vue:atable-list-story-vue-2", "kind": "variant" }, "87": { "id": "atable-list-story-vue:atable-list-story-vue-3", "kind": "variant" }, "88": { "id": "atable-row-actions-story-vue", "kind": "story" }, "89": { "id": "atable-row-actions-story-vue:atable-row-actions-story-vue-0", "kind": "variant" }, "90": { "id": "atable-row-actions-story-vue:atable-row-actions-story-vue-1", "kind": "variant" }, "91": { "id": "atable-row-actions-story-vue:atable-row-actions-story-vue-2", "kind": "variant" }, "92": { "id": "atable-row-actions-story-vue:atable-row-actions-story-vue-3", "kind": "variant" }, "93": { "id": "atable-row-actions-story-vue:atable-row-actions-story-vue-4", "kind": "variant" }, "94": { "id": "atable-row-actions-story-vue:atable-row-actions-story-vue-5", "kind": "variant" }, "95": { "id": "atable-row-actions-story-vue:atable-row-actions-story-vue-6", "kind": "variant" }, "96": { "id": "atable-tree-story-vue", "kind": "story" }, "97": { "id": "atable-tree-story-vue:atable-tree-story-vue-0", "kind": "variant" }, "98": { "id": "atable-tree-story-vue:atable-tree-story-vue-1", "kind": "variant" }, "99": { "id": "atable-tree-story-vue:atable-tree-story-vue-2", "kind": "variant" }, "100": { "id": "atable-tree-story-vue:atable-tree-story-vue-3", "kind": "variant" }, "101": { "id": "atable-tree-story-vue:atable-tree-story-vue-4", "kind": "variant" }, "102": { "id": "node-editor-editor-story-vue", "kind": "story" }, "103": { "id": "node-editor-editor-story-vue:_default", "kind": "variant" } } };
const searchData = markRaw(searchData$1);
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "BaseListItem",
  props: {
    isActive: { type: Boolean }
  },
  emits: ["navigate"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    function handleNavigate() {
      emit("navigate");
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("a", {
        class: normalizeClass(["istoire-base-list-ite htw-flex htw-items-center htw-gap-2 htw-text-gray-900 dark:htw-text-gray-100", [
          _ctx.$attrs.class,
          __props.isActive ? "active htw-bg-primary-500 hover:htw-bg-primary-600 htw-text-white dark:htw-text-black" : "hover:htw-bg-primary-100 dark:hover:htw-bg-primary-900"
        ]]),
        onClick: _cache[0] || (_cache[0] = ($event) => handleNavigate()),
        onKeyup: [
          _cache[1] || (_cache[1] = withKeys(($event) => handleNavigate(), ["enter"])),
          _cache[2] || (_cache[2] = withKeys(($event) => handleNavigate(), ["space"]))
        ]
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 34);
    };
  }
});
const _hoisted_1$3 = ["src", "alt"];
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "BaseIcon",
  props: {
    icon: {}
  },
  setup(__props) {
    const props = __props;
    const isUrl = computed(() => props.icon.startsWith("http") || props.icon.startsWith("data:image") || props.icon.startsWith(".") || props.icon.startsWith("/"));
    return (_ctx, _cache) => {
      return isUrl.value ? (openBlock(), createElementBlock("img", {
        key: 0,
        src: __props.icon,
        alt: __props.icon,
        class: "histoire-base-icon"
      }, null, 8, _hoisted_1$3)) : (openBlock(), createBlock(unref(Icon), {
        key: 1,
        icon: __props.icon,
        class: "histoire-base-icon"
      }, null, 8, ["icon"]));
    };
  }
});
const BaseIcon = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-2114f510"]]);
const _hoisted_1$2 = { class: "htw-flex-1" };
const _hoisted_2 = { class: "htw-flex" };
const _hoisted_3 = { class: "htw-ml-auto htw-opacity-40" };
const _hoisted_4 = {
  key: 0,
  class: "htw-flex htw-items-center htw-gap-0.5 htw-opacity-60"
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "SearchItemContent",
  props: {
    result: {},
    selected: { type: Boolean }
  },
  setup(__props) {
    const defaultIcons = {
      story: "carbon:cube",
      variant: "carbon:cube"
    };
    const kindLabels = {
      story: "Story",
      variant: "Variant",
      command: "Command"
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(BaseIcon, {
          icon: __props.result.icon ?? defaultIcons[__props.result.kind],
          class: normalizeClass(["htw-w-4 htw-h-4", [
            !__props.selected ? [
              __props.result.iconColor ? "bind-icon-color" : {
                "htw-text-primary-500": __props.result.kind === "story",
                "htw-text-gray-500": __props.result.kind === "variant"
              }
            ] : [],
            {
              "colorize-black": __props.selected
            }
          ]])
        }, null, 8, ["icon", "class"]),
        createBaseVNode("div", _hoisted_1$2, [
          createBaseVNode("div", _hoisted_2, [
            createTextVNode(toDisplayString(__props.result.title) + " ", 1),
            createBaseVNode("span", _hoisted_3, toDisplayString(kindLabels[__props.result.kind]), 1)
          ]),
          __props.result.path?.length ? (openBlock(), createElementBlock("div", _hoisted_4, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(__props.result.path, (p, index) => {
              return openBlock(), createElementBlock("div", {
                key: index,
                class: "htw-flex htw-items-center htw-gap-0.5"
              }, [
                index > 0 ? (openBlock(), createBlock(unref(Icon), {
                  key: 0,
                  icon: "carbon:chevron-right",
                  class: "htw-w-4 htw-h-4 htw-mt-0.5 htw-opacity-50"
                })) : createCommentVNode("", true),
                createBaseVNode("span", null, toDisplayString(p), 1)
              ]);
            }), 128))
          ])) : createCommentVNode("", true)
        ])
      ], 64);
    };
  }
});
const _hoisted_1$1 = ["data-selected"];
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SearchItem",
  props: {
    result: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    close: () => true
  },
  setup(__props, { emit: __emit }) {
    useCssVars((_ctx) => ({
      "v1f9aa6ca": __props.result.iconColor
    }));
    const props = __props;
    const emit = __emit;
    const el = ref();
    const { selected } = toRefs(props);
    useScrollOnActive(selected, el);
    const router = useRouter();
    onKeyboardShortcut(["enter"], () => {
      if (!props.selected) return;
      action();
    });
    function action(fromClick = false) {
      if ("route" in props.result && !fromClick) {
        router.push(props.result.route);
      }
      if ("onActivate" in props.result) {
        props.result.onActivate();
      }
      emit("close");
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "el",
        ref: el,
        class: "histoire-search-item",
        "data-test-id": "search-item",
        "data-selected": unref(selected) ? "" : void 0
      }, [
        "route" in __props.result ? (openBlock(), createBlock(BaseListItemLink, {
          key: 0,
          to: __props.result.route,
          "is-active": unref(selected),
          class: "htw-px-6 htw-py-4 htw-gap-4",
          onNavigate: _cache[0] || (_cache[0] = ($event) => action(true))
        }, {
          default: withCtx(() => [
            createVNode(_sfc_main$2, {
              result: __props.result,
              selected: unref(selected)
            }, null, 8, ["result", "selected"])
          ]),
          _: 1
        }, 8, ["to", "is-active"])) : createCommentVNode("", true),
        "onActivate" in __props.result ? (openBlock(), createBlock(_sfc_main$4, {
          key: 1,
          "is-active": unref(selected),
          class: "htw-px-6 htw-py-4 htw-gap-4",
          onNavigate: _cache[1] || (_cache[1] = ($event) => action(true))
        }, {
          default: withCtx(() => [
            createVNode(_sfc_main$2, {
              result: __props.result,
              selected: unref(selected)
            }, null, 8, ["result", "selected"])
          ]),
          _: 1
        }, 8, ["is-active"])) : createCommentVNode("", true)
      ], 8, _hoisted_1$1);
    };
  }
});
const SearchItem = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-9f94ad2b"]]);
const _hoisted_1 = {
  key: 1,
  class: "htw-max-h-[400px] htw-overflow-y-auto htw-rounded-b-lg"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SearchPane",
  props: {
    shown: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    close: () => true
  },
  setup(__props, { emit: __emit }) {
    const DocSearchData = () => __vitePreload(() => import("./search-docs-data-DeWDzvmp.js"), true ? __vite__mapDeps([0,1]) : void 0);
    const props = __props;
    const emit = __emit;
    function close() {
      emit("close");
    }
    const input = ref();
    const { focused } = useFocus(input, {
      initialValue: true
    });
    watch(() => props.shown, (value) => {
      if (value) {
        requestAnimationFrame(() => {
          focused.value = true;
          input.value.select();
        });
      }
    });
    const searchInputText = ref("");
    const rateLimitedSearch = refDebounced(searchInputText, 50);
    const storyStore = useStoryStore();
    let titleSearchIndex;
    let titleIdMap;
    function createIndex() {
      return new Fuse([], {
        keys: ["text"]
      });
    }
    async function loadSearchIndex(data) {
      titleSearchIndex = createIndex();
      for (const document of data.index) {
        titleSearchIndex.add(document);
      }
      titleIdMap = data.idMap;
    }
    loadSearchIndex(searchData);
    let docSearchIndex;
    let docIdMap;
    async function loadDocSearchIndex() {
      async function load(data) {
        docSearchIndex = createIndex();
        for (const document of data.index) {
          docSearchIndex.add(document);
        }
        docIdMap = data.idMap;
        if (rateLimitedSearch.value) {
          await searchOnDocField(rateLimitedSearch.value);
        }
      }
      const searchDataModule = await DocSearchData();
      await load(searchDataModule.searchData);
      searchDataModule.onUpdate((searchData2) => {
        load(searchData2);
      });
    }
    loadDocSearchIndex();
    const titleResults = ref([]);
    watch(rateLimitedSearch, async (value) => {
      const list = [];
      const result = titleSearchIndex.search(value);
      let rank = 0;
      for (const document of result) {
        const idMapData = titleIdMap[document.item.id];
        if (!idMapData) continue;
        switch (idMapData.kind) {
          case "story": {
            list.push(storyResultFactory(storyStore.getStoryById(idMapData.id), rank));
            rank++;
            break;
          }
          case "variant": {
            const [storyId] = idMapData.id.split(":");
            const story = storyStore.getStoryById(storyId);
            const variant = storyStore.getVariantById(idMapData.id);
            list.push(variantResultFactory(story, variant, rank));
            rank++;
            break;
          }
        }
      }
      titleResults.value = list;
    });
    const docsResults = ref([]);
    async function searchOnDocField(query) {
      if (docSearchIndex) {
        const list = [];
        const result = docSearchIndex.search(query);
        let rank = 0;
        for (const document of result) {
          const idMapData = docIdMap[document.item.id];
          if (!idMapData) continue;
          switch (idMapData.kind) {
            case "story": {
              list.push(storyResultFactory(storyStore.getStoryById(idMapData.id), rank, "docs"));
              rank++;
              break;
            }
          }
        }
        docsResults.value = list;
      }
    }
    watch(rateLimitedSearch, searchOnDocField);
    function storyResultFactory(story, rank, type = "title") {
      return {
        kind: "story",
        rank,
        id: `story:${story.id}`,
        title: story.title,
        route: {
          name: "story",
          params: {
            storyId: story.id
          },
          query: {
            ...type === "docs" ? { tab: "docs" } : {}
          }
        },
        path: story.file.path.slice(0, -1),
        icon: story.icon,
        iconColor: story.iconColor
      };
    }
    function variantResultFactory(story, variant, rank, type = "title") {
      return {
        kind: "variant",
        rank,
        id: `variant:${story.id}:${variant.id}`,
        title: variant.title,
        route: {
          name: "story",
          params: {
            storyId: story.id
          },
          query: {
            variantId: variant.id,
            ...type === "docs" ? { tab: "docs" } : {}
          }
        },
        path: [...story.file.path ?? [], story.title],
        icon: variant.icon,
        iconColor: variant.iconColor
      };
    }
    const commandResults = computed(() => {
      return [];
    });
    useCommandStore();
    const results = computed(() => {
      const list = [
        ...commandResults.value,
        ...titleResults.value
      ];
      const seen = {};
      for (const r of titleResults.value) {
        seen[r.id] = true;
      }
      for (const r of docsResults.value) {
        if (!seen[r.id]) {
          list.push(r);
        }
      }
      return list;
    });
    const {
      selectedIndex,
      selectNext,
      selectPrevious
    } = useSelection(results);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("div", {
          class: "histoire-search-pane htw-flex htw-items-center htw-gap-4 htw-pl-6 htw-border htw-border-transparent focus-visible:htw-border-primary-500",
          onClick: _cache[4] || (_cache[4] = ($event) => focused.value = true)
        }, [
          createVNode(unref(Icon), {
            icon: "carbon:search",
            class: "flex-none htw-w-4 htw-h-4"
          }),
          withDirectives(createBaseVNode("input", {
            ref_key: "input",
            ref: input,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchInputText.value = $event),
            placeholder: "Search for stories, variants...",
            class: "htw-bg-transparent htw-w-full htw-flex-1 htw-pl-0 htw-pr-6 htw-py-4 htw-outline-none",
            onKeydown: [
              _cache[1] || (_cache[1] = withKeys(withModifiers(($event) => unref(selectNext)(), ["prevent"]), ["down"])),
              _cache[2] || (_cache[2] = withKeys(withModifiers(($event) => unref(selectPrevious)(), ["prevent"]), ["up"])),
              _cache[3] || (_cache[3] = withKeys(($event) => close(), ["escape"]))
            ]
          }, null, 544), [
            [vModelText, searchInputText.value]
          ])
        ]),
        unref(rateLimitedSearch) && !results.value.length ? (openBlock(), createBlock(BaseEmpty, {
          key: 0,
          class: "no-animation"
        }, {
          default: withCtx(() => [..._cache[6] || (_cache[6] = [
            createTextVNode(" No results ", -1)
          ])]),
          _: 1
        })) : results.value.length ? (openBlock(), createElementBlock("div", _hoisted_1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(results.value, (result, index) => {
            return openBlock(), createBlock(SearchItem, {
              key: result.id,
              result,
              selected: index === unref(selectedIndex),
              onClose: _cache[5] || (_cache[5] = ($event) => close())
            }, null, 8, ["result", "selected"]);
          }), 128))
        ])) : createCommentVNode("", true)
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};
