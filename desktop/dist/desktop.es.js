import { defineComponent, resolveComponent, openBlock, createElementBlock, createElementVNode, withKeys, normalizeClass, normalizeStyle, createVNode, withCtx, withDirectives, vModelText, Fragment, renderList, createTextVNode, toDisplayString, pushScopeId, popScopeId } from "vue";
var SheetNav_vue_vue_type_style_index_0_scoped_true_lang = "";
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$1 = defineComponent({
  name: "SheetNav",
  data() {
    return {
      breadcrumbs: [],
      breadcrumbsVisibile: true,
      searchVisibile: false,
      searchText: ""
    };
  },
  methods: {
    toggleBreadcrumbs() {
      this.breadcrumbsVisibile = !this.breadcrumbsVisibile;
    },
    toggleSearch() {
      this.searchVisibile = !this.searchVisibile;
      this.$nextTick(() => {
        this.$refs.searchinput.focus();
      });
    },
    handleSearchInput(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    handleSearch(e) {
      e.preventDefault();
      e.stopPropagation();
      this.toggleSearch();
    },
    navigateHome(e) {
      console.log(e);
    }
  },
  computed: {
    rotateHideTabIcon() {
      return this.breadcrumbsVisibile ? "unrotated" : "rotated";
    }
  },
  mounted() {
    this.breadcrumbs = this.$props.breadcrumbs || [];
  }
});
const _withScopeId = (n) => (pushScopeId("data-v-36caa8ec"), n = n(), popScopeId(), n);
const _hoisted_1 = { class: "tabs" };
const _hoisted_2 = { tabindex: "0" };
const _hoisted_3 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("svg", {
  version: "1.1",
  id: "Capa_1",
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  x: "0px",
  y: "0px",
  viewBox: "0 0 424.098 424.098",
  style: { "enable-background": "new 0 0 424.098 424.098" },
  "xml:space": "preserve"
}, [
  /* @__PURE__ */ createElementVNode("g", null, [
    /* @__PURE__ */ createElementVNode("path", {
      style: { "fill": "#010002" },
      d: "M351.191,401.923H72.901c-4.487,0-8.129-3.633-8.129-8.129V242.262l-56.664-0.114\r\n								c-3.284-0.008-6.243-1.992-7.495-5.023c-1.252-3.04-0.553-6.527,1.764-8.852L206.104,24.546c1.853-1.845,4.503-2.666,7.047-2.276\r\n								c2.414,0.39,4.511,1.845,5.731,3.942l47.43,47.43V58.499c0-4.487,3.633-8.129,8.129-8.129h47.755c4.495,0,8.129,3.642,8.129,8.129\r\n								v79.156l91.39,91.398c2.325,2.325,3.024,5.828,1.764,8.868c-1.26,3.032-4.227,5.007-7.511,5.007c-0.008,0-0.008,0-0.016,0\r\n								l-56.64-0.114v150.98C359.32,398.29,355.686,401.923,351.191,401.923z M81.03,385.666h262.033V234.67\r\n								c0-2.162,0.854-4.235,2.39-5.755c1.528-1.52,3.585-2.374,5.739-2.374c0.008,0,0.008,0,0.016,0l45.105,0.089l-79.855-79.863\r\n								c-1.528-1.528-2.382-3.593-2.382-5.747V66.628h-31.498v26.645c0,3.284-1.975,6.251-5.015,7.511\r\n								c-3.032,1.268-6.527,0.569-8.86-1.764l-57.038-57.038l-183.95,183.95l45.203,0.089c4.487,0.008,8.112,3.642,8.112,8.129\r\n								C81.03,234.149,81.03,385.666,81.03,385.666z"
    })
  ])
], -1));
const _hoisted_4 = { tabindex: "0" };
const _hoisted_5 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("svg", { style: { "width": "11pt" } }, [
  /* @__PURE__ */ createElementVNode("g", { transform: "matrix(-0.08088215,0,0,0.08088215,9.8016177,3.1263021e-6)" }, [
    /* @__PURE__ */ createElementVNode("path", {
      d: "M 93.148438,80.832031 C 109.5,57.742188 104.03125,25.769531 80.941406,9.421875 57.851562,-6.925781 25.878906,-1.460938 9.53125,21.632812 -6.816406,44.722656 -1.351562,76.691406 21.742188,93.039062 38.222656,104.70703 60.011719,105.60547 77.394531,95.339844 l 37.769529,37.542966 c 4.07813,4.29297 10.86328,4.46485 15.15625,0.38672 4.29297,-4.07422 4.46485,-10.85937 0.39063,-15.15234 -0.12891,-0.13672 -0.25391,-0.26172 -0.39063,-0.39063 z m -41.839844,3.5 C 33.0625,84.335938 18.269531,69.554688 18.257812,51.308594 18.253906,33.0625 33.035156,18.269531 51.285156,18.261719 c 18.222656,-0.0078 33.007813,14.75 33.042969,32.972656 0.03125,18.25 -14.742187,33.066406 -32.996094,33.097656 -0.0078,0 -0.01172,0 -0.02344,0 z m 0,0",
      style: { "fill": "#000000", "fill-opacity": "1", "fill-rule": "nonzero", "stroke": "none" },
      id: "path2"
    })
  ])
], -1));
const _hoisted_6 = [
  _hoisted_5
];
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  return openBlock(), createElementBlock("footer", null, [
    createElementVNode("ul", _hoisted_1, [
      createElementVNode("li", {
        class: "hidebreadcrumbs",
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.toggleBreadcrumbs && _ctx.toggleBreadcrumbs(...args)),
        onKeydown: _cache[1] || (_cache[1] = withKeys((...args) => _ctx.toggleBreadcrumbs && _ctx.toggleBreadcrumbs(...args), ["enter"]))
      }, [
        createElementVNode("a", _hoisted_2, [
          createElementVNode("div", {
            class: normalizeClass(_ctx.rotateHideTabIcon)
          }, "\xD7", 2)
        ])
      ], 32),
      createElementVNode("li", {
        class: "hometab",
        onClick: _cache[2] || (_cache[2] = (...args) => _ctx.navigateHome && _ctx.navigateHome(...args)),
        onKeydown: _cache[3] || (_cache[3] = withKeys((...args) => _ctx.navigateHome && _ctx.navigateHome(...args), ["enter"])),
        style: normalizeStyle({ "display": _ctx.breadcrumbsVisibile ? "block" : "none" })
      }, [
        createVNode(_component_router_link, {
          to: "/home",
          tabindex: "0"
        }, {
          default: withCtx(() => [
            _hoisted_3
          ]),
          _: 1
        })
      ], 36),
      createElementVNode("li", {
        class: "searchtab",
        onClick: _cache[9] || (_cache[9] = (...args) => _ctx.toggleSearch && _ctx.toggleSearch(...args)),
        onKeydown: _cache[10] || (_cache[10] = withKeys((...args) => _ctx.toggleSearch && _ctx.toggleSearch(...args), ["enter"])),
        style: normalizeStyle({ "display": _ctx.breadcrumbsVisibile ? "block" : "none" })
      }, [
        createElementVNode("a", _hoisted_4, [
          createElementVNode("span", {
            style: normalizeStyle({ "display": _ctx.searchVisibile ? "none" : "block" })
          }, _hoisted_6, 4),
          withDirectives(createElementVNode("input", {
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => _ctx.searchText = $event),
            ref: "searchinput",
            style: normalizeStyle({ "display": _ctx.searchVisibile ? "block" : "none" }),
            onClick: _cache[5] || (_cache[5] = ($event) => _ctx.handleSearchInput($event)),
            onInput: _cache[6] || (_cache[6] = ($event) => _ctx.handleSearchInput($event)),
            onBlur: _cache[7] || (_cache[7] = ($event) => _ctx.handleSearch($event)),
            onKeydown: _cache[8] || (_cache[8] = withKeys(($event) => _ctx.handleSearch($event), ["enter"])),
            type: "text"
          }, null, 36), [
            [vModelText, _ctx.searchText]
          ])
        ])
      ], 36),
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.breadcrumbs, (breadcrumb, index2) => {
        return openBlock(), createElementBlock("li", {
          key: index2,
          style: normalizeStyle({ "display": _ctx.breadcrumbsVisibile ? "block" : "none" })
        }, [
          createVNode(_component_router_link, {
            tabindex: "0",
            to: breadcrumb.to
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(breadcrumb.title), 1)
            ]),
            _: 2
          }, 1032, ["to"])
        ], 4);
      }), 128))
    ])
  ]);
}
var SheetNav = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-36caa8ec"]]);
const _sfc_main = defineComponent({
  name: "CommandPalette",
  setup() {
    return {};
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("dialog");
}
var CommandPalette = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
function install(app, options) {
  app.component("SheetNav", SheetNav);
  app.component("CommandPalette", CommandPalette);
}
var index = {
  install
};
export { index as default };
