import { defineComponent as u, openBlock as c, createElementBlock as r, createElementVNode as l, renderSlot as d, resolveComponent as b, createBlock as _, withCtx as k, withDirectives as g, vShow as M, createTextVNode as $, ref as v, pushScopeId as V, popScopeId as B, computed as S, normalizeStyle as N, toDisplayString as p, createCommentVNode as h, onMounted as C, onUnmounted as I, Fragment as E, renderList as A, resolveDynamicComponent as T, createVNode as D } from "vue";
const F = { class: "beam__actionfooter" }, O = { class: "footer-action-wrapper" }, H = /* @__PURE__ */ u({
  __name: "ActionFooter",
  emits: ["click"],
  setup(t, { emit: e }) {
    const o = e, s = () => {
      o("click");
    };
    return (n, a) => (c(), r("footer", F, [
      l("span", O, [
        l("button", {
          class: "footer-action",
          onClick: s
        }, [
          d(n.$slots, "default")
        ])
      ])
    ]));
  }
}), P = { class: "beam__modal" }, U = /* @__PURE__ */ u({
  __name: "BeamModal",
  props: {
    showModal: Boolean
  },
  emits: ["closemodal", "confirmmodal"],
  setup(t) {
    return (e, o) => {
      const s = b("portal");
      return c(), _(s, { to: "beam__modal_outlet" }, {
        default: k(() => [
          g(l("div", P, [
            l("button", {
              onClick: o[0] || (o[0] = (n) => e.$emit("closemodal"))
            }, "Close Modal"),
            d(e.$slots, "default", {
              onClosemodal: o[1] || (o[1] = (n) => e.$emit("closemodal")),
              onConfirmmodal: o[2] || (o[2] = (n) => e.$emit("confirmmodal"))
            }, void 0, !0)
          ], 512), [
            [M, t.showModal]
          ])
        ]),
        _: 3
      });
    };
  }
}), w = (t, e) => {
  const o = t.__vccOpts || t;
  for (const [s, n] of e)
    o[s] = n;
  return o;
}, z = /* @__PURE__ */ w(U, [["__scopeId", "data-v-a1013a78"]]), W = /* @__PURE__ */ u({
  __name: "BeamModalOutlet",
  emits: ["confirmmodal", "closemodal"],
  setup(t, { emit: e }) {
    return (o, s) => {
      const n = b("portal-target");
      return c(), _(n, { name: "beam__modal_outlet" });
    };
  }
}), Y = /* @__PURE__ */ l("br", null, null, -1), j = /* @__PURE__ */ l("br", null, null, -1), q = /* @__PURE__ */ u({
  __name: "Confirm",
  emits: ["confirmmodal", "closemodal"],
  setup(t, { emit: e }) {
    const o = e, s = () => {
      o("confirmmodal");
    }, n = () => {
      o("closemodal");
    };
    return (a, i) => (c(), r("div", null, [
      $(" Would you like to continue?"),
      Y,
      l("button", { onClick: s }, "Yes"),
      j,
      l("button", { onClick: n }, "No")
    ]));
  }
}), G = (t) => (V("data-v-a7b71d4b"), t = t(), B(), t), J = { class: "container" }, K = ["checked"], Q = /* @__PURE__ */ G(() => /* @__PURE__ */ l("span", {
  class: "checkmark",
  tabindex: "0"
}, null, -1)), R = /* @__PURE__ */ u({
  __name: "ItemCheck",
  props: {
    value: { type: Boolean }
  },
  emits: ["input"],
  setup(t, { emit: e }) {
    const o = t, s = e, n = v(o.value), a = (i) => {
      s("input", n.value);
    };
    return (i, m) => (c(), r("label", J, [
      l("input", {
        type: "checkbox",
        checked: i.value,
        onInput: a,
        tabindex: "-1"
      }, null, 40, K),
      Q
    ]));
  }
}), y = /* @__PURE__ */ w(R, [["__scopeId", "data-v-a7b71d4b"]]), X = { class: "beam__itemcount" }, Z = ["contenteditable"], x = { key: 0 }, L = /* @__PURE__ */ u({
  __name: "ItemCount",
  props: {
    value: { default: 0 },
    denominator: {},
    uom: { default: "" },
    editable: { type: Boolean, default: !0 }
  },
  emits: ["input"],
  setup(t, { emit: e }) {
    const o = e, s = t, n = v(s.value), a = (m) => {
      m.preventDefault(), m.stopPropagation(), n.value = Number(m.target.innerHTML.replace(/[^0-9]/g, "")), o("input", n.value);
    }, i = S(() => n.value === s.denominator);
    return (m, de) => (c(), r("div", X, [
      l("span", {
        contenteditable: m.editable,
        style: N({ color: i.value === !0 ? "#3c5014" : "#e63c28" }),
        onInput: a,
        onClick: a
      }, p(n.value), 45, Z),
      l("span", null, "/" + p(m.denominator), 1),
      m.uom ? (c(), r("span", x, "  " + p(m.uom), 1)) : h("", !0)
    ]));
  }
}), ee = ["href"], te = /* @__PURE__ */ u({
  __name: "ListAnchor",
  props: {
    to: { default: "" }
  },
  setup(t) {
    return (e, o) => (c(), r("a", {
      href: e.to,
      class: "beam__listanchor"
    }, [
      d(e.$slots, "default")
    ], 8, ee));
  }
}), oe = {
  tabindex: "0",
  class: "beam__listitem"
}, f = /* @__PURE__ */ u({
  __name: "ListItem",
  props: {
    item: {}
  },
  setup(t) {
    return (e, o) => (c(), r("li", oe, [
      l("span", null, [
        l("label", null, p(e.item.label), 1),
        l("p", null, p(e.item.description), 1)
      ]),
      e.item.count ? (c(), _(L, {
        key: 0,
        modelValue: e.item.count.count,
        "onUpdate:modelValue": o[0] || (o[0] = (s) => e.item.count.count = s),
        denominator: e.item.count.of,
        uom: e.item.count.uom,
        editable: !0
      }, null, 8, ["modelValue", "denominator", "uom"])) : h("", !0),
      e.item.hasOwnProperty("checked") ? (c(), _(y, {
        key: 1,
        modelValue: e.item.checked,
        "onUpdate:modelValue": o[1] || (o[1] = (s) => e.item.checked = s)
      }, null, 8, ["modelValue"])) : h("", !0)
    ]));
  }
}), ne = { class: "beam__listview" }, se = /* @__PURE__ */ u({
  __name: "ListView",
  props: {
    items: {}
  },
  emits: ["scrollbottom"],
  setup(t, { emit: e }) {
    const o = e;
    C(() => {
      window.addEventListener("scroll", s);
    }), I(() => {
      window.removeEventListener("scroll", s);
    });
    const s = () => {
      const n = document.documentElement.scrollHeight - window.innerHeight, a = document.documentElement.scrollTop;
      n - a <= 2 && o("scrollbottom");
    };
    return (n, a) => (c(), r("ul", ne, [
      (c(!0), r(E, null, A(n.items, (i, m) => (c(), r("li", { key: m }, [
        i.linkComponent ? (c(), _(T(i.linkComponent), {
          key: 0,
          to: i.route,
          tabindex: "-1"
        }, {
          default: k(() => [
            D(f, { item: i }, null, 8, ["item"])
          ]),
          _: 2
        }, 1032, ["to"])) : (c(), _(f, {
          key: 1,
          item: i
        }, null, 8, ["item"]))
      ]))), 128))
    ]));
  }
}), ae = { class: "beam__navbar" }, le = /* @__PURE__ */ l("span", { class: "home-icon" }, "⬣", -1), ce = /* @__PURE__ */ l("h1", { class: "nav-title" }, "TITLE", -1), ie = { class: "navbar-action-wrapper" }, re = /* @__PURE__ */ u({
  __name: "Navbar",
  emits: ["click"],
  setup(t, { emit: e }) {
    const o = e, s = () => {
      o("click");
    };
    return (n, a) => (c(), r("nav", ae, [
      d(n.$slots, "icon", {}, () => [
        le
      ]),
      d(n.$slots, "title", {}, () => [
        ce
      ]),
      l("div", ie, [
        l("button", {
          class: "navbar-action",
          onClick: s
        }, [
          d(n.$slots, "navbaraction", {}, () => [
            $("Action")
          ])
        ])
      ])
    ]));
  }
}), me = { id: "scan_input" }, ue = /* @__PURE__ */ u({
  __name: "ScanInput",
  emits: ["scaninput"],
  setup(t, { emit: e }) {
    const o = e, s = v(""), n = (a) => {
      a.target.tagName !== "INPUT" && (a.key !== "Enter" ? s.value += `${a.key}` : (o("scaninput", s.value), s.value = ""));
    };
    return C(() => {
      document.addEventListener("keypress", (a) => {
        n(a);
      });
    }), I(() => {
      window.removeEventListener("keypress", (a) => {
        n(a);
      });
    }), (a, i) => (c(), r("div", me));
  }
});
function pe(t) {
  t.component("ActionFooter", H), t.component("BeamModal", z), t.component("BeamModalOutlet", W), t.component("Confirm", q), t.component("ItemCheck", y), t.component("ItemCount", L), t.component("ListAnchor", te), t.component("ListItem", f), t.component("ListView", se), t.component("Navbar", re), t.component("ScanInput", ue);
}
export {
  H as ActionFooter,
  z as BeamModal,
  W as BeamModalOutlet,
  q as Confirm,
  y as ItemCheck,
  L as ItemCount,
  te as ListAnchor,
  f as ListItem,
  se as ListView,
  re as Navbar,
  ue as ScanInput,
  pe as install
};
//# sourceMappingURL=beam.js.map
