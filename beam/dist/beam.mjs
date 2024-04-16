import { openBlock as i, createElementBlock as m, renderSlot as _, createElementVNode as d, createTextVNode as j, normalizeClass as U, toDisplayString as h, createCommentVNode as y, pushScopeId as H, popScopeId as z, resolveComponent as $, createBlock as f, Fragment as W, renderList as Y, resolveDynamicComponent as G, withCtx as M, createVNode as J, withDirectives as K, vShow as Q, defineComponent as S, computed as R, watch as N, h as I, inject as X, onMounted as Z, onUpdated as tt, onBeforeUnmount as et, reactive as nt, readonly as ot } from "vue";
const p = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [r, l] of e)
    n[r] = l;
  return n;
}, at = {
  name: "Navbar",
  methods: {
    handlePrimaryAction() {
      this.$emit("click");
    }
  }
}, st = { class: "beam__navbar" }, rt = /* @__PURE__ */ d("span", { class: "home-icon" }, "⬣", -1), lt = /* @__PURE__ */ d("h1", { class: "nav-title" }, "TITLE", -1), ct = { class: "navbar-action-wrapper" };
function it(t, e, n, r, l, o) {
  return i(), m("nav", st, [
    _(t.$slots, "icon", {}, () => [
      rt
    ]),
    _(t.$slots, "title", {}, () => [
      lt
    ]),
    d("div", ct, [
      d("button", {
        class: "navbar-action btn",
        onClick: e[0] || (e[0] = (...a) => o.handlePrimaryAction && o.handlePrimaryAction(...a))
      }, [
        _(t.$slots, "navbaraction", {}, () => [
          j("Action")
        ])
      ])
    ])
  ]);
}
const E = /* @__PURE__ */ p(at, [["render", it]]), dt = {
  name: "ListAnchor",
  props: {
    to: {
      type: String,
      required: !1,
      default: ""
    }
  }
}, ut = ["href"];
function mt(t, e, n, r, l, o) {
  return i(), m("a", {
    href: n.to,
    class: "beam__listanchor"
  }, [
    _(t.$slots, "default")
  ], 8, ut);
}
const k = /* @__PURE__ */ p(dt, [["render", mt]]), pt = {
  name: "ItemCount",
  props: {
    value: {
      type: Number,
      required: !1,
      default: 0
    },
    denominator: {
      type: Number,
      required: !0
    },
    uom: {
      type: String,
      required: !1,
      default: null
    },
    editable: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  data() {
    return {
      count: this.value
    };
  },
  methods: {
    handleInput(t) {
      t.preventDefault(), t.stopPropagation(), this.count = Number(t.target.innerHTML.replace(/[^0-9]/g, "")), this.$emit("input", this.count);
    }
  },
  computed: {
    countColor() {
      return this.count === this.denominator;
    }
  },
  watch: {
    value() {
      this.count = this.value;
    }
  }
}, _t = { class: "beam__itemcount" }, ft = ["contenteditable"], ht = { key: 0 };
function $t(t, e, n, r, l, o) {
  return i(), m("div", _t, [
    d("span", {
      contenteditable: n.editable,
      class: U({ alert: o.countColor === !1 }),
      onInput: e[0] || (e[0] = (a) => o.handleInput(a)),
      onClick: e[1] || (e[1] = (a) => o.handleInput(a))
    }, h(l.count), 43, ft),
    d("span", null, "/" + h(n.denominator), 1),
    n.uom ? (i(), m("span", ht, "  " + h(n.uom), 1)) : y("", !0)
  ]);
}
const g = /* @__PURE__ */ p(pt, [["render", $t]]);
const bt = {
  // make this v-model sensitive from parent
  name: "ItemCheck",
  props: {
    value: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  data() {
    return {
      checked: this.value
    };
  },
  methods: {
    handleInput(t) {
      this.$emit("input", this.checked);
    }
  }
}, vt = (t) => (H("data-v-66aa3656"), t = t(), z(), t), yt = { class: "container" }, kt = ["checked"], gt = /* @__PURE__ */ vt(() => /* @__PURE__ */ d("div", {
  class: "checkmark",
  tabindex: "0"
}, null, -1));
function wt(t, e, n, r, l, o) {
  return i(), m("label", yt, [
    d("input", {
      type: "checkbox",
      checked: n.value,
      onInput: e[0] || (e[0] = (...a) => o.handleInput && o.handleInput(...a)),
      tabindex: "-1"
    }, null, 40, kt),
    gt
  ]);
}
const w = /* @__PURE__ */ p(bt, [["render", wt], ["__scopeId", "data-v-66aa3656"]]), Ct = {
  name: "ListItem",
  components: {
    ItemCount: g,
    ItemCheck: w
  },
  props: {
    item: {
      type: Object,
      required: !0
    }
  }
}, It = {
  tabindex: "0",
  class: "beam__listitem"
}, Mt = { class: "beam__listtext" };
function St(t, e, n, r, l, o) {
  const a = $("ItemCount"), s = $("ItemCheck");
  return i(), m("li", It, [
    d("div", Mt, [
      d("label", null, h(n.item.label), 1),
      d("p", null, h(n.item.description), 1)
    ]),
    n.item.count ? (i(), f(a, {
      key: 0,
      modelValue: n.item.count.count,
      "onUpdate:modelValue": e[0] || (e[0] = (c) => n.item.count.count = c),
      denominator: n.item.count.of,
      uom: n.item.count.uom,
      editable: !0
    }, null, 8, ["modelValue", "denominator", "uom"])) : y("", !0),
    n.item.hasOwnProperty("checked") ? (i(), f(s, {
      key: 1,
      modelValue: n.item.checked,
      "onUpdate:modelValue": e[1] || (e[1] = (c) => n.item.checked = c)
    }, null, 8, ["modelValue"])) : y("", !0)
  ]);
}
const C = /* @__PURE__ */ p(Ct, [["render", St]]), Nt = {
  name: "ListView",
  components: {
    ListItem: C,
    ListAnchor: k
  },
  props: {
    items: {
      type: Array,
      required: !0
    }
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      const t = document.documentElement.scrollHeight - window.innerHeight, e = document.documentElement.scrollTop;
      t - e <= 2 && this.$emit("scrollbottom");
    }
  }
}, Et = { class: "beam__listview" };
function Lt(t, e, n, r, l, o) {
  const a = $("ListItem");
  return i(), m("ul", Et, [
    (i(!0), m(W, null, Y(n.items, (s, c) => (i(), m("li", { key: c }, [
      s.linkComponent ? (i(), f(G(s.linkComponent), {
        key: 0,
        to: s.route,
        tabindex: "-1"
      }, {
        default: M(() => [
          J(a, { item: s }, null, 8, ["item"])
        ]),
        _: 2
      }, 1032, ["to"])) : (i(), f(a, {
        key: 1,
        item: s
      }, null, 8, ["item"]))
    ]))), 128))
  ]);
}
const L = /* @__PURE__ */ p(Nt, [["render", Lt]]), xt = {
  name: "ScanInput",
  data() {
    return {
      barcode: ""
    };
  },
  methods: {
    handleScanInput(t) {
      t.target.tagName !== "INPUT" && (t.key !== "Enter" ? this.barcode += `${t.key}` : (this.$emit("scaninput", this.barcode), this.barcode = ""));
    }
  },
  mounted() {
    document.addEventListener("keypress", (t) => {
      this.handleScanInput(t);
    });
  },
  destroyed() {
    window.removeEventListener("keypress", (t) => {
      this.handleScanInput(t);
    });
  }
}, At = { id: "scan_input" };
function Bt(t, e, n, r, l, o) {
  return i(), m("div", At);
}
const x = /* @__PURE__ */ p(xt, [["render", Bt]]), Pt = {
  name: "ActionFooter",
  methods: {
    handleFooterAction() {
      this.$emit("click");
    }
  }
}, Vt = { class: "beam__actionfooter" }, Tt = { class: "footer-action-wrapper" };
function Dt(t, e, n, r, l, o) {
  return i(), m("footer", Vt, [
    d("span", Tt, [
      d("button", {
        class: "footer-action btn btn--dark",
        onClick: e[0] || (e[0] = (...a) => o.handleFooterAction && o.handleFooterAction(...a))
      }, [
        _(t.$slots, "default")
      ])
    ])
  ]);
}
const A = /* @__PURE__ */ p(Pt, [["render", Dt]]), Ft = {
  name: "BeamModal",
  props: ["showModal"]
}, qt = { class: "beam__modal" };
function Ot(t, e, n, r, l, o) {
  const a = $("portal");
  return i(), f(a, { to: "beam__modal_outlet" }, {
    default: M(() => [
      K(d("div", qt, [
        d("button", {
          class: "btn",
          onClick: e[0] || (e[0] = (s) => t.$emit("closemodal"))
        }, "Close Modal"),
        _(t.$slots, "default", {
          onClosemodal: e[1] || (e[1] = (s) => t.$emit("closemodal")),
          onConfirmmodal: e[2] || (e[2] = (s) => t.$emit("confirmmodal"))
        })
      ], 512), [
        [Q, n.showModal]
      ])
    ]),
    _: 3
  });
}
const B = /* @__PURE__ */ p(Ft, [["render", Ot]]), jt = {
  name: "BeamModalOutlet"
};
function Ut(t, e, n, r, l, o) {
  const a = $("portal-target");
  return i(), f(a, { name: "beam__modal_outlet" });
}
const P = /* @__PURE__ */ p(jt, [["render", Ut]]), Ht = {
  name: "ConfirmDialog",
  methods: {
    confirmModal() {
      this.$emit("confirmmodal");
    },
    closeModal() {
      this.$emit("closemodal");
    }
  }
}, zt = { class: "beam__modal-confirm" }, Wt = /* @__PURE__ */ d("h2", null, "Would you like to continue?", -1);
function Yt(t, e, n, r, l, o) {
  return i(), m("div", zt, [
    Wt,
    d("button", {
      class: "btn btn--dark",
      onClick: e[0] || (e[0] = (...a) => o.confirmModal && o.confirmModal(...a))
    }, "Yes"),
    d("button", {
      class: "btn btn--dark",
      onClick: e[1] || (e[1] = (...a) => o.closeModal && o.closeModal(...a))
    }, "No")
  ]);
}
const V = /* @__PURE__ */ p(Ht, [["render", Yt]]), T = Symbol("wormhole");
function D() {
  const t = X(T);
  if (!t)
    throw new Error(`
    [portal-vue]: Necessary Injection not found. Make sur you installed the plugin properly.`);
  return t;
}
const F = typeof window < "u";
function Gt(t, e) {
  return t.map((n, r) => [r, n]).sort(function(n, r) {
    return e(n[1], r[1]) || n[0] - r[0];
  }).map((n) => n[1]);
}
function Jt(t, e) {
  const n = D();
  function r() {
    if (!F)
      return;
    const { to: o, name: a, order: s } = t;
    e.default ? n.open({
      to: o,
      from: a,
      order: s,
      content: e.default
    }) : l();
  }
  function l(o) {
    n.close({
      to: o ?? t.to,
      from: t.name
    });
  }
  Z(() => {
    t.disabled || r();
  }), tt(() => {
    t.disabled ? l() : r();
  }), et(() => {
    l();
  }), N(
    () => t.to,
    (o, a) => {
      t.disabled || (a && a !== o && l(a), r());
    }
  );
}
const Kt = S({
  compatConfig: { MODE: 3 },
  name: "portal",
  props: {
    disabled: { type: Boolean },
    name: { type: [String, Symbol], default: () => Symbol() },
    order: { type: Number },
    slotProps: { type: Object, default: () => ({}) },
    to: {
      type: String,
      default: () => String(Math.round(Math.random() * 1e7))
    }
  },
  setup(t, { slots: e }) {
    return Jt(t, e), () => t.disabled && e.default ? e.default(t.slotProps) : null;
  }
}), Qt = (t, { slots: e }) => {
  var n;
  return (n = e.default) == null ? void 0 : n.call(e);
}, Rt = S({
  compatConfig: { MODE: 3 },
  name: "portalTarget",
  props: {
    multiple: { type: Boolean, default: !1 },
    name: { type: String, required: !0 },
    slotProps: { type: Object, default: () => ({}) }
  },
  emits: ["change"],
  setup(t, { emit: e, slots: n }) {
    const r = D(), l = R(
      () => {
        const o = r.getContentForTarget(
          t.name,
          t.multiple
        ), a = n.wrapper, s = o.map((u) => u.content(t.slotProps)), c = a ? s.flatMap(
          (u) => u.length ? a(u) : []
        ) : s.flat(1);
        return {
          vnodes: c,
          vnodesFn: () => c
        };
      }
    );
    return N(
      l,
      ({ vnodes: o }) => {
        const a = o.length > 0, s = r.transports.get(t.name), c = s ? [...s.keys()] : [];
        e("change", { hasContent: a, sources: c });
      },
      { flush: "post" }
    ), () => {
      var o;
      return l.value.vnodes.length ? [
        I("div", {
          style: "display: none",
          key: "__portal-vue-hacky-scoped-slot-repair__"
        }),
        I(Qt, l.value.vnodesFn)
      ] : (o = n.default) == null ? void 0 : o.call(n);
    };
  }
});
function Xt(t = !0) {
  const e = nt(/* @__PURE__ */ new Map());
  function n(a) {
    if (!F)
      return;
    const { to: s, from: c, content: u, order: b = 1 / 0 } = a;
    if (!s || !c || !u)
      return;
    e.has(s) || e.set(s, /* @__PURE__ */ new Map());
    const v = e.get(s), O = {
      to: s,
      from: c,
      content: u,
      order: b
    };
    v.set(c, O);
  }
  function r(a) {
    const { to: s, from: c } = a;
    if (!s || !c)
      return;
    const u = e.get(s);
    !u || (u.delete(c), u.size || e.delete(s));
  }
  function l(a, s) {
    const c = e.get(a);
    if (!c)
      return [];
    const u = Array.from((c == null ? void 0 : c.values()) || []);
    return s ? Gt(
      u,
      (b, v) => b.order - v.order
    ) : [u.pop()];
  }
  const o = {
    open: n,
    close: r,
    transports: e,
    getContentForTarget: l
  };
  return t ? ot(o) : o;
}
const Zt = Xt();
function te(t, e = {}) {
  e.portalName !== !1 && t.component(e.portalName || "Portal", Kt), e.portalTargetName !== !1 && t.component(e.portalTargetName || "PortalTarget", Rt);
  const n = e.wormhole ?? Zt;
  t.provide(T, n);
}
const ee = [
  E,
  L,
  C,
  k,
  g,
  w,
  x,
  A,
  B,
  V,
  P
], q = function(t, e = {}) {
  t.use(te), ee.forEach((n) => {
    t.component(n.name, n);
  });
};
typeof window < "u" && window.Vue && q(window.Vue);
const oe = {
  version: "0.1.0",
  install: q,
  Navbar: E,
  ListView: L,
  ListItem: C,
  ListAnchor: k,
  ItemCount: g,
  ItemCheck: w,
  ScanInput: x,
  ActionFooter: A,
  BeamModal: B,
  ConfirmDialog: V,
  BeamModalOutlet: P
};
export {
  oe as default
};
