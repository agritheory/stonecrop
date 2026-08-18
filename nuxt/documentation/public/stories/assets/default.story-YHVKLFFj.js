import { ap as resolveComponent, aq as openBlock, ar as createBlock, as as withCtx, at as createVNode, au as createBaseVNode, av as defineComponent, ay as ref } from "./vendor-BFYlYCwc.js";
import { E as Ee } from "./code-editor-s9mGxGEt.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const block0 = (Comp) => {
  Comp.doc = '<h2 id="supported-languages" tabindex="-1">Supported languages <a class="header-anchor" href="#supported-languages" aria-hidden="true">#</a></h2>\n<p>The <a href="https://github.com/microsoft/monaco-editor" target="_blank">Monaco editor</a> currently supports the following languages:</p>\n<p>Standard Worker:</p>\n<ul>\n<li><code>batch</code></li>\n<li><code>c#</code></li>\n<li><code>c++</code></li>\n<li><code>coffeescript</code></li>\n<li><code>diff</code></li>\n<li><code>f#</code></li>\n<li><code>java</code></li>\n<li><code>lua</code></li>\n<li><code>markdown</code></li>\n<li><code>objective-c</code></li>\n<li><code>php</code></li>\n<li><code>powershell</code></li>\n<li><code>pug</code></li>\n<li><code>python</code></li>\n<li><code>r</code></li>\n<li><code>ruby</code></li>\n<li><code>sass</code></li>\n<li><code>vb</code></li>\n<li><code>xml</code></li>\n</ul>\n<p>JSON worker:</p>\n<ul>\n<li><code>json</code></li>\n</ul>\n<p>CSS worker:</p>\n<ul>\n<li><code>css</code></li>\n<li><code>scss</code></li>\n<li><code>less</code></li>\n</ul>\n<p>HTML worker:</p>\n<ul>\n<li><code>html</code></li>\n<li><code>handlebars</code></li>\n<li><code>razor</code></li>\n</ul>\n<p>TypeScript worker:</p>\n<ul>\n<li><code>typescript</code></li>\n<li><code>javascript</code></li>\n</ul>\n';
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const code = ref(`type Person = {
	name: string
}

type Company = {
	name: string
	manager: Person
}`);
    const __returned__ = { code, get ACodeEditor() {
      return Ee;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "story-container" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { title: "default" }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "edit mode" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createVNode($setup["ACodeEditor"], {
              modelValue: $setup.code,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.code = $event),
              language: "typescript",
              options: { minimap: { enabled: false } }
            }, null, 8, ["modelValue"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "read mode" }, {
        default: withCtx(() => [
          createVNode($setup["ACodeEditor"], {
            modelValue: $setup.code,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.code = $event),
            language: "typescript",
            mode: "read",
            options: { minimap: { enabled: false } }
          }, null, 8, ["modelValue"])
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
_sfc_main.__file = "code_editor/default.story.vue";
const default_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-92c6b537"], ["__file", "/home/dell/StoneCrop/stonecrop/examples/code_editor/default.story.vue"]]);
export {
  default_story as default
};
