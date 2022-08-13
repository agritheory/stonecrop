import { defineComponent as b, resolveComponent as y, openBlock as i, createElementBlock as a, createElementVNode as o, withKeys as l, normalizeClass as S, normalizeStyle as s, createVNode as u, withCtx as m, withDirectives as k, vModelText as V, Fragment as w, renderList as C, createTextVNode as $, toDisplayString as I, pushScopeId as B, popScopeId as H } from "vue";
const h = (t, e) => {
  const r = t.__vccOpts || t;
  for (const [d, p] of e)
    r[d] = p;
  return r;
}, T = b({
  name: "SheetNav",
  data() {
    return {
      breadcrumbs: [],
      breadcrumbsVisibile: !0,
      searchVisibile: !1,
      searchText: ""
    };
  },
  methods: {
    toggleBreadcrumbs() {
      this.breadcrumbsVisibile = !this.breadcrumbsVisibile;
    },
    toggleSearch() {
      this.searchVisibile = !this.searchVisibile, this.$nextTick(() => {
        this.$refs.searchinput.focus();
      });
    },
    handleSearchInput(t) {
      t.preventDefault(), t.stopPropagation();
    },
    handleSearch(t) {
      t.preventDefault(), t.stopPropagation(), this.toggleSearch();
    },
    navigateHome(t) {
      console.log(t);
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
}), g = (t) => (B("data-v-41651c7f"), t = t(), H(), t), z = { class: "tabs" }, N = { tabindex: "0" }, K = /* @__PURE__ */ g(() => /* @__PURE__ */ o("svg", {
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
  /* @__PURE__ */ o("g", null, [
    /* @__PURE__ */ o("path", {
      style: { fill: "#010002" },
      d: `M351.191,401.923H72.901c-4.487,0-8.129-3.633-8.129-8.129V242.262l-56.664-0.114
								c-3.284-0.008-6.243-1.992-7.495-5.023c-1.252-3.04-0.553-6.527,1.764-8.852L206.104,24.546c1.853-1.845,4.503-2.666,7.047-2.276
								c2.414,0.39,4.511,1.845,5.731,3.942l47.43,47.43V58.499c0-4.487,3.633-8.129,8.129-8.129h47.755c4.495,0,8.129,3.642,8.129,8.129
								v79.156l91.39,91.398c2.325,2.325,3.024,5.828,1.764,8.868c-1.26,3.032-4.227,5.007-7.511,5.007c-0.008,0-0.008,0-0.016,0
								l-56.64-0.114v150.98C359.32,398.29,355.686,401.923,351.191,401.923z M81.03,385.666h262.033V234.67
								c0-2.162,0.854-4.235,2.39-5.755c1.528-1.52,3.585-2.374,5.739-2.374c0.008,0,0.008,0,0.016,0l45.105,0.089l-79.855-79.863
								c-1.528-1.528-2.382-3.593-2.382-5.747V66.628h-31.498v26.645c0,3.284-1.975,6.251-5.015,7.511
								c-3.032,1.268-6.527,0.569-8.86-1.764l-57.038-57.038l-183.95,183.95l45.203,0.089c4.487,0.008,8.112,3.642,8.112,8.129
								C81.03,234.149,81.03,385.666,81.03,385.666z`
    })
  ])
], -1)), P = { tabindex: "0" }, D = /* @__PURE__ */ g(() => /* @__PURE__ */ o("svg", { style: { width: "11pt" } }, [
  /* @__PURE__ */ o("g", { transform: "matrix(-0.08088215,0,0,0.08088215,9.8016177,3.1263021e-6)" }, [
    /* @__PURE__ */ o("path", {
      d: "M 93.148438,80.832031 C 109.5,57.742188 104.03125,25.769531 80.941406,9.421875 57.851562,-6.925781 25.878906,-1.460938 9.53125,21.632812 -6.816406,44.722656 -1.351562,76.691406 21.742188,93.039062 38.222656,104.70703 60.011719,105.60547 77.394531,95.339844 l 37.769529,37.542966 c 4.07813,4.29297 10.86328,4.46485 15.15625,0.38672 4.29297,-4.07422 4.46485,-10.85937 0.39063,-15.15234 -0.12891,-0.13672 -0.25391,-0.26172 -0.39063,-0.39063 z m -41.839844,3.5 C 33.0625,84.335938 18.269531,69.554688 18.257812,51.308594 18.253906,33.0625 33.035156,18.269531 51.285156,18.261719 c 18.222656,-0.0078 33.007813,14.75 33.042969,32.972656 0.03125,18.25 -14.742187,33.066406 -32.996094,33.097656 -0.0078,0 -0.01172,0 -0.02344,0 z m 0,0",
      style: { fill: "#000000", "fill-opacity": "1", "fill-rule": "nonzero", stroke: "none" },
      id: "path2"
    })
  ])
], -1)), M = [
  D
];
function x(t, e, r, d, p, v) {
  const c = y("router-link");
  return i(), a("footer", null, [
    o("ul", z, [
      o("li", {
        class: "hidebreadcrumbs",
        onClick: e[0] || (e[0] = (...n) => t.toggleBreadcrumbs && t.toggleBreadcrumbs(...n)),
        onKeydown: e[1] || (e[1] = l((...n) => t.toggleBreadcrumbs && t.toggleBreadcrumbs(...n), ["enter"]))
      }, [
        o("a", N, [
          o("div", {
            class: S(t.rotateHideTabIcon)
          }, "\xD7", 2)
        ])
      ], 32),
      o("li", {
        class: "hometab",
        onClick: e[2] || (e[2] = (...n) => t.navigateHome && t.navigateHome(...n)),
        onKeydown: e[3] || (e[3] = l((...n) => t.navigateHome && t.navigateHome(...n), ["enter"])),
        style: s({ display: t.breadcrumbsVisibile ? "block" : "none" })
      }, [
        u(c, {
          to: "/home",
          tabindex: "0"
        }, {
          default: m(() => [
            K
          ]),
          _: 1
        })
      ], 36),
      o("li", {
        class: "searchtab",
        onClick: e[9] || (e[9] = (...n) => t.toggleSearch && t.toggleSearch(...n)),
        onKeydown: e[10] || (e[10] = l((...n) => t.toggleSearch && t.toggleSearch(...n), ["enter"])),
        style: s({ display: t.breadcrumbsVisibile ? "block" : "none" })
      }, [
        o("a", P, [
          o("span", {
            style: s({ display: t.searchVisibile ? "none" : "block" })
          }, M, 4),
          k(o("input", {
            "onUpdate:modelValue": e[4] || (e[4] = (n) => t.searchText = n),
            ref: "searchinput",
            style: s({ display: t.searchVisibile ? "block" : "none" }),
            onClick: e[5] || (e[5] = (n) => t.handleSearchInput(n)),
            onInput: e[6] || (e[6] = (n) => t.handleSearchInput(n)),
            onBlur: e[7] || (e[7] = (n) => t.handleSearch(n)),
            onKeydown: e[8] || (e[8] = l((n) => t.handleSearch(n), ["enter"])),
            type: "text"
          }, null, 36), [
            [V, t.searchText]
          ])
        ])
      ], 36),
      (i(!0), a(w, null, C(t.breadcrumbs, (n, f) => (i(), a("li", {
        key: f,
        style: s({ display: t.breadcrumbsVisibile ? "block" : "none" })
      }, [
        u(c, {
          tabindex: "0",
          to: n.to
        }, {
          default: m(() => [
            $(I(n.title), 1)
          ]),
          _: 2
        }, 1032, ["to"])
      ], 4))), 128))
    ])
  ]);
}
const E = /* @__PURE__ */ h(T, [["render", x], ["__scopeId", "data-v-41651c7f"]]), L = b({
  name: "CommandPalette",
  setup() {
    return {};
  }
});
function F(t, e, r, d, p, v) {
  return i(), a("dialog");
}
const O = /* @__PURE__ */ h(L, [["render", F]]);
function U(t, e) {
  t.component("SheetNav", E), t.component("CommandPalette", O);
}
const q = {
  install: U
};
export {
  q as default
};
