import { ap as resolveComponent, aq as openBlock, ar as createBlock, as as withCtx, au as createBaseVNode, aC as createCommentVNode, at as createVNode, av as defineComponent, aw as reactive } from "./vendor-BFYlYCwc.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dropdown.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const dropdown_data = reactive({
      items: ["Apple", "Orange", "Pear", "Kiwi", "Grape"],
      value: "Orange",
      label: "Fruit"
    });
    const async_dropdown_data = reactive({
      allItems: ["Dog", "Cat", "Lizard", "Mouse", "Bird"],
      items: ["Dog", "Cat", "Lizard", "Mouse", "Bird"],
      value: "Dog",
      label: "Animals"
    });
    const custom_filter_dropdown_data = reactive({
      allItems: ["Pizza", "Burger", "Pasta", "Sushi", "Tacos", "Salad", "Steak", "Soup"],
      items: ["Pizza", "Burger", "Pasta", "Sushi", "Tacos", "Salad", "Steak", "Soup"],
      value: "",
      label: "Food"
    });
    async function asyncFilterItems(search) {
      await delay(750);
      const filtered = async_dropdown_data.allItems.filter((item) => item.toLowerCase().includes(search.toLowerCase()));
      async_dropdown_data.items = filtered;
      return filtered;
    }
    function filterItems(search) {
      const filtered = custom_filter_dropdown_data.allItems.filter(
        (item) => item.toLowerCase().startsWith(search.toLowerCase())
      );
      custom_filter_dropdown_data.items = filtered;
      return filtered;
    }
    function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    const __returned__ = { dropdown_data, async_dropdown_data, custom_filter_dropdown_data, asyncFilterItems, filterItems, delay };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "dropdown-form" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ADropdown = resolveComponent("ADropdown");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, null, {
    default: withCtx(() => [
      createBaseVNode("div", _hoisted_1, [
        createCommentVNode(" normal dropdown story "),
        createVNode(_component_ADropdown, {
          "data-theme": "purple",
          options: $setup.dropdown_data.items,
          modelValue: $setup.dropdown_data.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.dropdown_data.value = $event),
          label: $setup.dropdown_data.label
        }, null, 8, ["options", "modelValue", "label"]),
        createCommentVNode(" dropdown with API request simulation "),
        createVNode(_component_ADropdown, {
          options: $setup.async_dropdown_data.items,
          modelValue: $setup.async_dropdown_data.value,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.async_dropdown_data.value = $event),
          label: $setup.async_dropdown_data.label,
          isAsync: true,
          filterFunction: $setup.asyncFilterItems
        }, null, 8, ["options", "modelValue", "label"]),
        createCommentVNode(" dropdown with custom filtering logic "),
        createVNode(_component_ADropdown, {
          options: $setup.custom_filter_dropdown_data.items,
          modelValue: $setup.custom_filter_dropdown_data.value,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.custom_filter_dropdown_data.value = $event),
          label: $setup.custom_filter_dropdown_data.label,
          isAsync: false,
          filterFunction: $setup.filterItems
        }, null, 8, ["options", "modelValue", "label"])
      ])
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "aform/dropdown.story.vue";
const dropdown_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/dell/StoneCrop/stonecrop/examples/aform/dropdown.story.vue"]]);
export {
  dropdown_story as default
};
