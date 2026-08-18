import { ap as resolveComponent, aq as openBlock, ar as createBlock, as as withCtx, at as createVNode, az as createTextVNode, au as createBaseVNode, aA as toDisplayString, av as defineComponent, ax as computed, ay as ref, aw as reactive } from "./vendor-BFYlYCwc.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const data = [
  {
    barcode: "6281478257437327897",
    label: "Item 1 Long Title: Including Subtitle to demonstrate ellipsis",
    description: "iPhone this and that",
    count: {
      count: 0
    },
    linkComponent: "ListAnchor",
    route: "/item1"
  },
  {
    label: "Item 2",
    description: "More descriptions of stuff",
    count: {
      count: 3,
      of: 3
    },
    linkComponent: "ListAnchor",
    route: "/item2"
  },
  {
    label: "Item 3",
    description: "",
    count: {
      count: 1,
      of: 6
    },
    linkComponent: "ListAnchor",
    route: "/item3"
  },
  {
    label: "Item 4",
    description: "iPhone this and that plus even more text to demonstrate ellipsis and great savings! on things you can't see or touch",
    count: {
      count: 0,
      of: 3
    },
    linkComponent: "div",
    route: "/item4",
    barcode: "5564269659609843627"
  },
  {
    barcode: "6281478257437327898",
    label: "Item 5",
    description: "iPhone this and that",
    count: {
      count: 0,
      of: 2
    },
    linkComponent: "ListAnchor",
    route: "/item1"
  },
  {
    barcode: "6281478257437327899",
    label: "Item 6 Long Title: Including Subtitle to demonstrate ellipsis",
    description: "iPhone this and that",
    count: {
      count: 0,
      of: 3
    },
    linkComponent: "ListAnchor",
    route: "/item1"
  },
  {
    label: "Item 7",
    description: "More descriptions of stuff",
    count: {
      count: 3,
      of: 3
    },
    linkComponent: "ListAnchor",
    route: "/item2"
  },
  {
    label: "Item 8",
    description: "",
    count: {
      count: 1,
      of: 6
    },
    linkComponent: "ListAnchor",
    route: "/item3"
  },
  {
    label: "Item 9",
    description: "iPhone this and that plus even more text to demonstrate ellipsis and great savings! on things you can't see or touch",
    count: {
      count: 0,
      of: 3
    },
    linkComponent: "div",
    route: "/item4",
    barcode: "5564269659609843628"
  },
  {
    barcode: "6281478257437327900",
    label: "Item 10",
    description: "iPhone this and that",
    count: {
      count: 0,
      of: 2
    },
    linkComponent: "ListAnchor",
    route: "/item1"
  },
  {
    barcode: "6281478257437327901",
    label: "Item 11 Long Title: Including Subtitle to demonstrate ellipsis",
    description: "iPhone this and that",
    count: {
      count: 0,
      of: 3
    },
    linkComponent: "ListAnchor",
    route: "/item1"
  },
  {
    label: "Item 12",
    description: "More descriptions of stuff",
    count: {
      count: 3,
      of: 3
    },
    linkComponent: "ListAnchor",
    route: "/item2"
  },
  {
    label: "Item 13",
    description: "",
    count: {
      count: 1,
      of: 6
    },
    linkComponent: "ListAnchor",
    route: "/item3"
  },
  {
    label: "Item 14",
    description: "iPhone this and that plus even more text to demonstrate ellipsis and great savings! on things you can't see or touch",
    count: {
      count: 0,
      of: 3
    },
    linkComponent: "div",
    route: "/item4",
    barcode: "5564269659609843629"
  },
  {
    barcode: "6281478257437327902",
    label: "Item 15",
    description: "iPhone this and that",
    count: {
      count: 0,
      of: 2
    },
    linkComponent: "ListAnchor",
    route: "/item1"
  }
];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const items = ref(data);
    const showModal = ref(false);
    const workOrder = reactive({
      orderNumber: "WO#2024-01-00001",
      product: "Ambrosia Pie",
      quantity: 0,
      total: 20,
      complete: false
    });
    const itemsWithDivider = computed(() => {
      const itemsCopy = [...items.value];
      itemsCopy.splice(3, 0, {
        date: "2024-11-12T00:00:00.000Z",
        linkComponent: "BeamDayDivider",
        dateFormat: "default"
      });
      itemsCopy.splice(7, 0, {
        date: "2024-10-18T00:00:00.000Z",
        linkComponent: "BeamDayDivider",
        dateFormat: "iso"
      });
      return itemsCopy;
    });
    const incrementItemCount = (barcode, qty) => {
      const detectedItemsByIndex = items.value.map((item, index) => item.barcode === barcode ? index : null).filter((x) => x !== null);
      for (const [detectedIndex, rowIndex] of detectedItemsByIndex.entries()) {
        if (rowIndex) {
          const count = items.value[rowIndex].count;
          if (!count) continue;
          if (detectedIndex !== detectedItemsByIndex.length - 1) {
            if (count.count < count.of) {
              count.count = count.count + qty;
              break;
            } else {
              continue;
            }
          } else {
            count.count = count.count + qty;
            break;
          }
        }
      }
    };
    const filterItems = (choice) => {
      if (choice.value === "all") {
        items.value = data;
      } else if (choice.value === "complete") {
        items.value = data.filter((item) => item.count.count === item.count.of);
      } else if (choice.value === "incomplete") {
        items.value = data.filter((item) => item.count.count !== item.count.of);
      }
    };
    const loadMoreItems = () => {
      if (items.value.length > 40) {
        return;
      }
      window.setTimeout(() => {
        items.value.push(
          ...[
            {
              barcode: "6281478257437327950",
              label: `Item ${Math.floor(Math.random() * 100)} Long Title: Including Subtitle to demonstrate ellipsis`,
              description: "iPhone this and that",
              count: { count: 0, of: 3 },
              linkComponent: "ListAnchor",
              route: "/item1"
            },
            {
              label: `Item ${Math.floor(Math.random() * 100)}`,
              description: "More descriptions of stuff",
              count: { count: 3, of: 3 },
              linkComponent: "ListAnchor",
              route: "/item2"
            },
            {
              label: `Item ${Math.floor(Math.random() * 100)}`,
              description: "",
              count: { count: 1, of: 6 },
              linkComponent: "ListAnchor",
              route: "/item3"
            },
            {
              label: `Item ${Math.floor(Math.random() * 100)}`,
              description: "iPhone this and that plus even more text to demonstrate ellipsis and great savings! on things you can't see or touch",
              count: { count: 0, of: 3 },
              linkComponent: "div",
              route: "/item4",
              barcode: "5564269659609843650"
            },
            {
              barcode: "6281478257437327897",
              label: `Item ${Math.floor(Math.random() * 100)}`,
              description: "iPhone this and that",
              count: { count: 0, of: 2 },
              linkComponent: "ListAnchor",
              route: "/item1"
            }
          ]
        );
      }, 300);
    };
    const confirmModal = () => showModal.value = false;
    const closeModal = () => showModal.value = false;
    const handlePrimaryAction = () => showModal.value = true;
    const __returned__ = { items, showModal, workOrder, itemsWithDivider, incrementItemCount, filterItems, loadMoreItems, confirmModal, closeModal, handlePrimaryAction };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "beam_metadata_block" };
const _hoisted_2 = { class: "beam--normal" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Confirm = resolveComponent("Confirm");
  const _component_BeamModal = resolveComponent("BeamModal");
  const _component_BeamHeading = resolveComponent("BeamHeading");
  const _component_Navbar = resolveComponent("Navbar");
  const _component_ListView = resolveComponent("ListView");
  const _component_ActionFooter = resolveComponent("ActionFooter");
  const _component_ScanInput = resolveComponent("ScanInput");
  const _component_BeamModalOutlet = resolveComponent("BeamModalOutlet");
  const _component_Variant = resolveComponent("Variant");
  const _component_HstText = resolveComponent("HstText");
  const _component_HstNumber = resolveComponent("HstNumber");
  const _component_HstCheckbox = resolveComponent("HstCheckbox");
  const _component_ItemCount = resolveComponent("ItemCount");
  const _component_SplitColumn = resolveComponent("SplitColumn");
  const _component_BeamProgress = resolveComponent("BeamProgress");
  const _component_BeamMetadata = resolveComponent("BeamMetadata");
  const _component_BeamFilterOption = resolveComponent("BeamFilterOption");
  const _component_BeamFilter = resolveComponent("BeamFilter");
  const _component_FixedTop = resolveComponent("FixedTop");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, null, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "default" }, {
        default: withCtx(() => [
          createVNode(_component_BeamModal, {
            onConfirmmodal: $setup.confirmModal,
            onClosemodal: $setup.closeModal,
            showModal: $setup.showModal
          }, {
            default: withCtx(() => [
              createVNode(_component_Confirm, {
                onConfirmmodal: $setup.confirmModal,
                onClosemodal: $setup.closeModal
              })
            ]),
            _: 1
            /* STABLE */
          }, 8, ["showModal"]),
          createVNode(_component_Navbar, { onClick: $setup.handlePrimaryAction }, {
            title: withCtx(() => [
              createVNode(_component_BeamHeading, null, {
                default: withCtx(() => [..._cache[6] || (_cache[6] = [
                  createTextVNode(
                    "Items to Receive",
                    -1
                    /* CACHED */
                  )
                ])]),
                _: 1
                /* STABLE */
              })
            ]),
            navbaraction: withCtx(() => [..._cache[7] || (_cache[7] = [
              createTextVNode(
                "Done",
                -1
                /* CACHED */
              )
            ])]),
            _: 1
            /* STABLE */
          }),
          createVNode(_component_ListView, {
            items: $setup.items,
            onScrollbottom: $setup.loadMoreItems
          }, null, 8, ["items"]),
          createVNode(_component_ActionFooter, { onClick: $setup.handlePrimaryAction }, {
            default: withCtx(() => [..._cache[8] || (_cache[8] = [
              createTextVNode(
                "Done",
                -1
                /* CACHED */
              )
            ])]),
            _: 1
            /* STABLE */
          }),
          createVNode(_component_ScanInput, { scanHandler: $setup.incrementItemCount }),
          createVNode(_component_BeamModalOutlet, {
            onConfirmmodal: $setup.confirmModal,
            onClosemodal: $setup.closeModal
          })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "metadata" }, {
        controls: withCtx(() => [
          createVNode(_component_HstText, {
            modelValue: $setup.workOrder.orderNumber,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.workOrder.orderNumber = $event),
            title: "Order Number"
          }, null, 8, ["modelValue"]),
          createVNode(_component_HstText, {
            modelValue: $setup.workOrder.product,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.workOrder.product = $event),
            title: "Product"
          }, null, 8, ["modelValue"]),
          createVNode(_component_HstNumber, {
            modelValue: $setup.workOrder.quantity,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.workOrder.quantity = $event),
            step: 1,
            title: "Quantity"
          }, null, 8, ["modelValue"]),
          createVNode(_component_HstNumber, {
            modelValue: $setup.workOrder.total,
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.workOrder.total = $event),
            title: "Total"
          }, null, 8, ["modelValue"]),
          createVNode(_component_HstCheckbox, {
            modelValue: $setup.workOrder.complete,
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.workOrder.complete = $event),
            title: "Completed"
          }, null, 8, ["modelValue"])
        ]),
        default: withCtx(() => [
          createVNode(_component_BeamMetadata, { order: $setup.workOrder }, {
            default: withCtx(() => [
              createBaseVNode("div", _hoisted_1, [
                createVNode(_component_SplitColumn, null, {
                  left: withCtx(() => [
                    createVNode(_component_BeamHeading, null, {
                      default: withCtx(() => [
                        createTextVNode(
                          toDisplayString($setup.workOrder.orderNumber) + " ",
                          1
                          /* TEXT */
                        ),
                        createBaseVNode(
                          "span",
                          _hoisted_2,
                          toDisplayString($setup.workOrder.product),
                          1
                          /* TEXT */
                        )
                      ]),
                      _: 1
                      /* STABLE */
                    })
                  ]),
                  right: withCtx(() => [
                    createVNode(_component_ItemCount, {
                      denominator: $setup.workOrder.total,
                      modelValue: $setup.workOrder.quantity,
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.workOrder.quantity = $event)
                    }, null, 8, ["denominator", "modelValue"])
                  ]),
                  _: 1
                  /* STABLE */
                }),
                createVNode(_component_BeamProgress, {
                  complete: $setup.workOrder.complete,
                  "progress-message": "In Transit"
                }, null, 8, ["complete"]),
                createVNode(_component_SplitColumn, null, {
                  left: withCtx(() => [..._cache[9] || (_cache[9] = [
                    createBaseVNode(
                      "p",
                      { class: "beam_metadata_heading" },
                      "Source",
                      -1
                      /* CACHED */
                    )
                  ])]),
                  right: withCtx(() => [..._cache[10] || (_cache[10] = [
                    createBaseVNode(
                      "p",
                      { class: "beam_metadata_heading" },
                      "Receiving",
                      -1
                      /* CACHED */
                    )
                  ])]),
                  _: 1
                  /* STABLE */
                })
              ])
            ]),
            _: 1
            /* STABLE */
          }, 8, ["order"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "list with day-divider" }, {
        default: withCtx(() => [
          createVNode(_component_BeamModal, {
            onConfirmmodal: $setup.confirmModal,
            onClosemodal: $setup.closeModal,
            showModal: $setup.showModal
          }, {
            default: withCtx(() => [
              createVNode(_component_Confirm, {
                onConfirmmodal: $setup.confirmModal,
                onClosemodal: $setup.closeModal
              })
            ]),
            _: 1
            /* STABLE */
          }, 8, ["showModal"]),
          createVNode(_component_Navbar, { onClick: $setup.handlePrimaryAction }, {
            title: withCtx(() => [
              createVNode(_component_BeamHeading, null, {
                default: withCtx(() => [..._cache[11] || (_cache[11] = [
                  createTextVNode(
                    "Items to Receive",
                    -1
                    /* CACHED */
                  )
                ])]),
                _: 1
                /* STABLE */
              })
            ]),
            navbaraction: withCtx(() => [..._cache[12] || (_cache[12] = [
              createTextVNode(
                "Done",
                -1
                /* CACHED */
              )
            ])]),
            _: 1
            /* STABLE */
          }),
          createVNode(_component_ListView, {
            items: $setup.itemsWithDivider,
            onScrollbottom: $setup.loadMoreItems
          }, null, 8, ["items"]),
          createVNode(_component_ActionFooter, { onClick: $setup.handlePrimaryAction }, {
            default: withCtx(() => [..._cache[13] || (_cache[13] = [
              createTextVNode(
                "Done",
                -1
                /* CACHED */
              )
            ])]),
            _: 1
            /* STABLE */
          }),
          createVNode(_component_ScanInput, { scanHandler: $setup.incrementItemCount }),
          createVNode(_component_BeamModalOutlet, {
            onConfirmmodal: $setup.confirmModal,
            onClosemodal: $setup.closeModal
          })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "list filters" }, {
        default: withCtx(() => [
          createVNode(_component_FixedTop, null, {
            default: withCtx(() => [
              createVNode(_component_Navbar, { onClick: $setup.handlePrimaryAction }, {
                title: withCtx(() => [
                  createVNode(_component_BeamHeading, null, {
                    default: withCtx(() => [..._cache[14] || (_cache[14] = [
                      createTextVNode(
                        "Items to Receive",
                        -1
                        /* CACHED */
                      )
                    ])]),
                    _: 1
                    /* STABLE */
                  })
                ]),
                navbaraction: withCtx(() => [..._cache[15] || (_cache[15] = [
                  createTextVNode(
                    "Done",
                    -1
                    /* CACHED */
                  )
                ])]),
                _: 1
                /* STABLE */
              }),
              createVNode(_component_BeamFilter, null, {
                default: withCtx(() => [
                  createVNode(_component_BeamFilterOption, {
                    title: "Status",
                    choices: [
                      { label: "All", value: "all" },
                      { label: "Complete", value: "complete" },
                      { label: "Incomplete", value: "incomplete" }
                    ],
                    onSelect: $setup.filterItems
                  }),
                  createVNode(_component_BeamFilterOption, {
                    title: "Delivery Start Date",
                    choices: [
                      { label: "All", value: "all" },
                      { label: "Past", value: "past" },
                      { label: "Today", value: "today" },
                      { label: "Future", value: "future" }
                    ]
                  })
                ]),
                _: 1
                /* STABLE */
              })
            ]),
            _: 1
            /* STABLE */
          }),
          createVNode(_component_ListView, {
            items: $setup.items,
            onScrollbottom: $setup.loadMoreItems
          }, null, 8, ["items"]),
          createVNode(_component_ActionFooter, { onClick: $setup.handlePrimaryAction }, {
            default: withCtx(() => [..._cache[16] || (_cache[16] = [
              createTextVNode(
                "Done",
                -1
                /* CACHED */
              )
            ])]),
            _: 1
            /* STABLE */
          }),
          createVNode(_component_ScanInput, { scanHandler: $setup.incrementItemCount }),
          createVNode(_component_BeamModalOutlet, {
            onConfirmmodal: $setup.confirmModal,
            onClosemodal: $setup.closeModal
          })
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "beam/default.story.vue";
const default_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/dell/StoneCrop/stonecrop/examples/beam/default.story.vue"]]);
export {
  default_story as default
};
