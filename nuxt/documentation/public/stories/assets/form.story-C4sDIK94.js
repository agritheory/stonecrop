import { ap as resolveComponent, aq as openBlock, ar as createBlock, as as withCtx, at as createVNode, au as createBaseVNode, az as createTextVNode, aA as toDisplayString, av as defineComponent, aG as watch, ay as ref } from "./vendor-BFYlYCwc.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const basic_form_schema = [
  {
    fieldname: "first_name",
    fieldtype: "Data",
    component: "ATextInput",
    label: "First Name"
  },
  {
    fieldname: "last_name",
    fieldtype: "Data",
    component: "ATextInput",
    label: "Last Name"
  },
  {
    fieldname: "enabled",
    fieldtype: "Check",
    component: "ACheckbox",
    label: "Enabled"
  },
  {
    fieldname: "age",
    fieldtype: "Int",
    component: "ANumericInput",
    label: "Age"
  },
  {
    fieldname: "date",
    fieldtype: "Date",
    component: "ATextInput",
    label: "Date"
  },
  {
    fieldname: "card",
    fieldtype: "Data",
    component: "ATextInput",
    label: "Card"
  },
  {
    fieldname: "phone",
    fieldtype: "Data",
    component: "ATextInput",
    label: "Phone",
    mask: "(locale) => { if (locale === 'en-US') { return '(###) ###-####' } else if (locale === 'en-IN') { return '####-######'} }"
  },
  {
    fieldname: "attach_file",
    fieldtype: "Attach",
    component: "AFileAttach",
    label: "Attach Files"
  }
];
const basic_fieldset_schema = [
  {
    fieldname: "basic_fieldset",
    fieldtype: "Fieldset",
    component: "AFieldset",
    collapsible: true,
    label: "Basic Fieldset",
    schema: [
      {
        fieldname: "first_name",
        fieldtype: "Data",
        component: "ATextInput",
        label: "First Name"
      },
      {
        fieldname: "middle_name",
        fieldtype: "Data",
        component: "ATextInput",
        label: "Middle Name"
      },
      {
        fieldname: "last_name",
        fieldtype: "Data",
        component: "ATextInput",
        label: "Last Name"
      },
      {
        fieldname: "age",
        fieldtype: "Int",
        component: "ANumericInput",
        label: "Age"
      }
    ]
  }
];
const basic_table_schema = [
  {
    fieldname: "http_logs",
    component: "ATable",
    columns: [
      {
        label: "Home Page",
        name: "home_page",
        fieldname: "home_page",
        fieldtype: "Data",
        align: "left",
        edit: false,
        width: "35ch",
        format: "value => {return value.title}"
      },
      {
        label: "HTTP Method",
        name: "http_method",
        fieldname: "http_method",
        fieldtype: "Data",
        align: "left",
        edit: true,
        width: "20ch"
      },
      {
        label: "IP Address",
        name: "ip_address",
        fieldname: "ip_address",
        fieldtype: "Data",
        align: "left",
        edit: false,
        width: "20ch"
      },
      {
        label: "Status",
        name: "status",
        fieldname: "status",
        fieldtype: "Data",
        align: "left",
        edit: true,
        width: "35ch"
      },
      {
        label: "Report Date",
        name: "report_date",
        fieldname: "report_date",
        fieldtype: "Date",
        modalComponent: "ADatePicker",
        align: "center",
        edit: true,
        width: "25ch",
        format: "value => { return (new Date(value).toLocaleDateString('en-US')) }"
      }
    ],
    config: {
      view: "list"
    },
    rows: [
      {
        home_page: {
          title: "https://ceara.berlin",
          url: "https://ceara.berlin"
        },
        http_method: "HEAD",
        ip_address: "75.228.138.84",
        report_date: 1580804064118311e-3,
        status: "503 Service Unavailable"
      },
      {
        home_page: {
          title: "https://queenweed.info",
          url: "https://queenweed.info"
        },
        http_method: "DELETE",
        ip_address: "235.108.58.48",
        report_date: 15811645256284841e-4,
        status: "510 Not Extended"
      },
      {
        home_page: {
          title: "https://cequi.mil",
          url: "https://cequi.mil"
        },
        http_method: "OPTIONS",
        ip_address: "200.232.58.22",
        report_date: 1583326905436858e-3,
        status: "504 Gateway Timeout"
      },
      {
        home_page: {
          title: "https://eel.net",
          url: "https://eel.net"
        },
        http_method: "DELETE",
        ip_address: "122.41.199.214",
        report_date: 1584696361760598e-3,
        status: "431 Request Header Fields Too Large"
      },
      {
        home_page: {
          title: "https://inmeats.jobs",
          url: "https://inmeats.jobs"
        },
        http_method: "PUT",
        ip_address: "5.123.57.245",
        report_date: 158540866385179e-2,
        status: "409 Conflict"
      },
      {
        home_page: {
          title: "https://plimsol.biz",
          url: "https://plimsol.biz"
        },
        http_method: "DELETE",
        ip_address: "206.197.127.159",
        report_date: 158753455617334e-2,
        status: "429 Too Many Requests"
      },
      {
        home_page: {
          title: "https://bogert.xxx",
          url: "https://bogert.xxx"
        },
        http_method: "HEAD",
        ip_address: "81.109.117.115",
        report_date: 1587553898966296e-3,
        status: "102 Processing"
      },
      {
        home_page: {
          title: "https://detail.helsinki",
          url: "https://detail.helsinki"
        },
        http_method: "GET",
        ip_address: "160.47.242.22",
        report_date: 15876198251500808e-4,
        status: "511 Network Authentication Required"
      },
      {
        home_page: {
          title: "https://attentional.net",
          url: "https://attentional.net"
        },
        http_method: "PUT",
        ip_address: "103.146.82.109",
        report_date: 158772784870899e-2,
        status: "424 Failed Dependency"
      },
      {
        home_page: {
          title: "https://abrar.com",
          url: "https://abrar.com"
        },
        http_method: "PUT",
        ip_address: "226.78.31.101",
        report_date: 1588241122692152e-3,
        status: "413 Request Entity Too Large"
      },
      {
        home_page: {
          title: "https://devastating.berlin",
          url: "https://devastating.berlin"
        },
        http_method: "OPTIONS",
        ip_address: "6.176.26.194",
        report_date: 1589238679474172e-3,
        status: "406 Not Acceptable"
      },
      {
        home_page: {
          title: "https://bedlamic.travel",
          url: "https://bedlamic.travel"
        },
        http_method: "OPTIONS",
        ip_address: "87.81.29.141",
        report_date: 1591099793866571e-3,
        status: "307 Temporary Redirect"
      },
      {
        home_page: {
          title: "https://busybody.com",
          url: "https://busybody.com"
        },
        http_method: "PUT",
        ip_address: "27.160.191.202",
        report_date: 15937902765855168e-4,
        status: "205 Reset Content"
      },
      {
        home_page: {
          title: "https://diviner.rio",
          url: "https://diviner.rio"
        },
        http_method: "GET",
        ip_address: "150.205.7.49",
        report_date: 1597194101311922e-3,
        status: "306 Reserved"
      },
      {
        home_page: {
          title: "https://cinter.wf",
          url: "https://cinter.wf"
        },
        http_method: "DELETE",
        ip_address: "49.84.170.124",
        report_date: 1597294401553942e-3,
        status: "417 Expectation Failed"
      },
      {
        home_page: {
          title: "https://amusing.istanbul",
          url: "https://amusing.istanbul"
        },
        http_method: "POST",
        ip_address: "133.171.161.201",
        report_date: 1597799367455279e-3,
        status: "409 Conflict"
      },
      {
        home_page: {
          title: "https://masseurs.ba",
          url: "https://masseurs.ba"
        },
        http_method: "OPTIONS",
        ip_address: "212.197.88.171",
        report_date: 1597877957532915e-3,
        status: "414 Request URI Too Long"
      },
      {
        home_page: {
          title: "https://darrel.om",
          url: "https://darrel.om"
        },
        http_method: "GET",
        ip_address: "81.50.236.159",
        report_date: 1597945294250901e-3,
        status: "501 Not Implemented"
      },
      {
        home_page: {
          title: "https://pityriasis.data",
          url: "https://pityriasis.data"
        },
        http_method: "PUT",
        ip_address: "2.35.182.4",
        report_date: 159856719682772e-2,
        status: "305 Use Proxy"
      },
      {
        home_page: {
          title: "https://carnell.int",
          url: "https://carnell.int"
        },
        http_method: "POST",
        ip_address: "254.216.8.135",
        report_date: 1598620551534259e-3,
        status: "406 Not Acceptable"
      },
      {
        home_page: {
          title: "https://spelter.dance",
          url: "https://spelter.dance"
        },
        http_method: "CONNECT",
        ip_address: "49.60.139.38",
        report_date: 1600670086438613e-3,
        status: "407 Proxy Authentication Required"
      },
      {
        home_page: {
          title: "https://apostrophe.mail",
          url: "https://apostrophe.mail"
        },
        http_method: "CONNECT",
        ip_address: "97.25.126.232",
        report_date: 1600735768366907e-3,
        status: "500 Internal Server Error"
      },
      {
        home_page: {
          title: "https://amelina.stockholm",
          url: "https://amelina.stockholm"
        },
        http_method: "POST",
        ip_address: "169.116.119.109",
        report_date: 1601126772802768e-3,
        status: "422 Unprocessable Entity"
      },
      {
        home_page: {
          title: "https://arming.net",
          url: "https://arming.net"
        },
        http_method: "POST",
        ip_address: "107.147.13.95",
        report_date: 1605215400250367e-3,
        status: "307 Temporary Redirect"
      },
      {
        home_page: {
          title: "https://whimbrels.com",
          url: "https://whimbrels.com"
        },
        http_method: "OPTIONS",
        ip_address: "60.233.119.67",
        report_date: 1606020776334481e-3,
        status: "417 Expectation Failed"
      }
    ]
  }
];
const fieldset_table_schema = [
  {
    fieldname: "table_fieldset",
    fieldtype: "Fieldset",
    component: "AFieldset",
    collapsible: true,
    label: "Table/Fieldset",
    schema: [
      {
        fieldname: "http_logs",
        component: "ATable",
        columns: [
          {
            label: "Home Page",
            name: "home_page",
            fieldname: "home_page",
            fieldtype: "Data",
            align: "left",
            edit: false,
            width: "35ch",
            format: "value => {return value.title}"
          },
          {
            label: "HTTP Method",
            name: "http_method",
            fieldname: "http_method",
            fieldtype: "Data",
            align: "left",
            edit: true,
            width: "20ch"
          },
          {
            label: "IP Address",
            name: "ip_address",
            fieldname: "ip_address",
            fieldtype: "Data",
            align: "left",
            edit: false,
            width: "20ch"
          },
          {
            label: "Status",
            name: "status",
            fieldname: "status",
            fieldtype: "Data",
            align: "left",
            edit: true,
            width: "35ch"
          },
          {
            label: "Report Date",
            name: "report_date",
            fieldname: "report_date",
            fieldtype: "Date",
            modalComponent: "ADatePicker",
            align: "center",
            edit: true,
            width: "25ch",
            format: "value => { return (new Date(value).toLocaleDateString('en-US')) }"
          }
        ],
        config: {
          view: "list"
        },
        rows: [
          {
            home_page: {
              title: "https://ceara.berlin",
              url: "https://ceara.berlin"
            },
            http_method: "HEAD",
            ip_address: "75.228.138.84",
            report_date: 1580804064118311e-3,
            status: "503 Service Unavailable"
          },
          {
            home_page: {
              title: "https://queenweed.info",
              url: "https://queenweed.info"
            },
            http_method: "DELETE",
            ip_address: "235.108.58.48",
            report_date: 15811645256284841e-4,
            status: "510 Not Extended"
          },
          {
            home_page: {
              title: "https://cequi.mil",
              url: "https://cequi.mil"
            },
            http_method: "OPTIONS",
            ip_address: "200.232.58.22",
            report_date: 1583326905436858e-3,
            status: "504 Gateway Timeout"
          },
          {
            home_page: {
              title: "https://eel.net",
              url: "https://eel.net"
            },
            http_method: "DELETE",
            ip_address: "122.41.199.214",
            report_date: 1584696361760598e-3,
            status: "431 Request Header Fields Too Large"
          },
          {
            home_page: {
              title: "https://inmeats.jobs",
              url: "https://inmeats.jobs"
            },
            http_method: "PUT",
            ip_address: "5.123.57.245",
            report_date: 158540866385179e-2,
            status: "409 Conflict"
          },
          {
            home_page: {
              title: "https://plimsol.biz",
              url: "https://plimsol.biz"
            },
            http_method: "DELETE",
            ip_address: "206.197.127.159",
            report_date: 158753455617334e-2,
            status: "429 Too Many Requests"
          },
          {
            home_page: {
              title: "https://bogert.xxx",
              url: "https://bogert.xxx"
            },
            http_method: "HEAD",
            ip_address: "81.109.117.115",
            report_date: 1587553898966296e-3,
            status: "102 Processing"
          },
          {
            home_page: {
              title: "https://detail.helsinki",
              url: "https://detail.helsinki"
            },
            http_method: "GET",
            ip_address: "160.47.242.22",
            report_date: 15876198251500808e-4,
            status: "511 Network Authentication Required"
          },
          {
            home_page: {
              title: "https://attentional.net",
              url: "https://attentional.net"
            },
            http_method: "PUT",
            ip_address: "103.146.82.109",
            report_date: 158772784870899e-2,
            status: "424 Failed Dependency"
          },
          {
            home_page: {
              title: "https://abrar.com",
              url: "https://abrar.com"
            },
            http_method: "PUT",
            ip_address: "226.78.31.101",
            report_date: 1588241122692152e-3,
            status: "413 Request Entity Too Large"
          },
          {
            home_page: {
              title: "https://devastating.berlin",
              url: "https://devastating.berlin"
            },
            http_method: "OPTIONS",
            ip_address: "6.176.26.194",
            report_date: 1589238679474172e-3,
            status: "406 Not Acceptable"
          },
          {
            home_page: {
              title: "https://bedlamic.travel",
              url: "https://bedlamic.travel"
            },
            http_method: "OPTIONS",
            ip_address: "87.81.29.141",
            report_date: 1591099793866571e-3,
            status: "307 Temporary Redirect"
          },
          {
            home_page: {
              title: "https://busybody.com",
              url: "https://busybody.com"
            },
            http_method: "PUT",
            ip_address: "27.160.191.202",
            report_date: 15937902765855168e-4,
            status: "205 Reset Content"
          },
          {
            home_page: {
              title: "https://diviner.rio",
              url: "https://diviner.rio"
            },
            http_method: "GET",
            ip_address: "150.205.7.49",
            report_date: 1597194101311922e-3,
            status: "306 Reserved"
          },
          {
            home_page: {
              title: "https://cinter.wf",
              url: "https://cinter.wf"
            },
            http_method: "DELETE",
            ip_address: "49.84.170.124",
            report_date: 1597294401553942e-3,
            status: "417 Expectation Failed"
          },
          {
            home_page: {
              title: "https://amusing.istanbul",
              url: "https://amusing.istanbul"
            },
            http_method: "POST",
            ip_address: "133.171.161.201",
            report_date: 1597799367455279e-3,
            status: "409 Conflict"
          },
          {
            home_page: {
              title: "https://masseurs.ba",
              url: "https://masseurs.ba"
            },
            http_method: "OPTIONS",
            ip_address: "212.197.88.171",
            report_date: 1597877957532915e-3,
            status: "414 Request URI Too Long"
          },
          {
            home_page: {
              title: "https://darrel.om",
              url: "https://darrel.om"
            },
            http_method: "GET",
            ip_address: "81.50.236.159",
            report_date: 1597945294250901e-3,
            status: "501 Not Implemented"
          },
          {
            home_page: {
              title: "https://pityriasis.data",
              url: "https://pityriasis.data"
            },
            http_method: "PUT",
            ip_address: "2.35.182.4",
            report_date: 159856719682772e-2,
            status: "305 Use Proxy"
          },
          {
            home_page: {
              title: "https://carnell.int",
              url: "https://carnell.int"
            },
            http_method: "POST",
            ip_address: "254.216.8.135",
            report_date: 1598620551534259e-3,
            status: "406 Not Acceptable"
          },
          {
            home_page: {
              title: "https://spelter.dance",
              url: "https://spelter.dance"
            },
            http_method: "CONNECT",
            ip_address: "49.60.139.38",
            report_date: 1600670086438613e-3,
            status: "407 Proxy Authentication Required"
          },
          {
            home_page: {
              title: "https://apostrophe.mail",
              url: "https://apostrophe.mail"
            },
            http_method: "CONNECT",
            ip_address: "97.25.126.232",
            report_date: 1600735768366907e-3,
            status: "500 Internal Server Error"
          },
          {
            home_page: {
              title: "https://amelina.stockholm",
              url: "https://amelina.stockholm"
            },
            http_method: "POST",
            ip_address: "169.116.119.109",
            report_date: 1601126772802768e-3,
            status: "422 Unprocessable Entity"
          },
          {
            home_page: {
              title: "https://arming.net",
              url: "https://arming.net"
            },
            http_method: "POST",
            ip_address: "107.147.13.95",
            report_date: 1605215400250367e-3,
            status: "307 Temporary Redirect"
          },
          {
            home_page: {
              title: "https://whimbrels.com",
              url: "https://whimbrels.com"
            },
            http_method: "OPTIONS",
            ip_address: "60.233.119.67",
            report_date: 1606020776334481e-3,
            status: "417 Expectation Failed"
          }
        ]
      }
    ]
  }
];
const hidden_field_schema_json = [
  {
    fieldname: "id",
    fieldtype: "Data",
    component: "ATextInput",
    label: "ID",
    mode: "display",
    hidden: true
  },
  {
    fieldname: "rowId",
    fieldtype: "Data",
    component: "ATextInput",
    label: "Row ID",
    hidden: true
  },
  {
    fieldname: "first_name",
    fieldtype: "Data",
    component: "ATextInput",
    label: "First Name"
  },
  {
    fieldname: "last_name",
    fieldtype: "Data",
    component: "ATextInput",
    label: "Last Name"
  },
  {
    fieldname: "email",
    fieldtype: "Data",
    component: "ATextInput",
    label: "Email"
  }
];
const basic_textbox_schema = [
  {
    fieldname: "title",
    label: "Title",
    fieldtype: "Data",
    component: "ATextInput",
    required: true
  },
  {
    fieldname: "description",
    label: "Description",
    fieldtype: "LongText",
    component: "ATextboxInput",
    required: false
  },
  {
    fieldname: "notes",
    label: "Notes",
    fieldtype: "LongText",
    component: "ATextboxInput",
    required: false
  }
];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "form.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const form_schema = ref(basic_form_schema);
    const fieldset_schema = ref(basic_fieldset_schema);
    const table_schema = ref(basic_table_schema);
    const fieldset_table_schema_ref = ref(fieldset_table_schema);
    const hidden_field_schema = ref(hidden_field_schema_json);
    const textbox_schema = ref(basic_textbox_schema);
    const data = ref({});
    const hidden_data = ref({
      id: "V2VyZTphcnRpY2xlOjE=",
      rowId: "018e4c3a-7b2f-7000-8d1e-3f4a5b6c7d8e",
      first_name: "",
      last_name: "",
      email: ""
    });
    const locale = ref("en-US");
    const formKey = ref(0);
    watch(locale, () => {
      formKey.value++;
    });
    const formSetup = ({ app }) => {
      app.provide("locale", locale);
    };
    const __returned__ = { form_schema, fieldset_schema, table_schema, fieldset_table_schema_ref, hidden_field_schema, textbox_schema, data, hidden_data, locale, formKey, formSetup, get basic_form_schema() {
      return basic_form_schema;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "data-preview" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_AForm = resolveComponent("AForm");
  const _component_HstRadio = resolveComponent("HstRadio");
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, null, {
    default: withCtx(() => [
      createVNode(_component_Variant, {
        title: "Form",
        "setup-app": $setup.formSetup
      }, {
        controls: withCtx(() => [
          createVNode(_component_HstRadio, {
            modelValue: $setup.locale,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.locale = $event),
            title: "Locale",
            options: [
              {
                label: "United States",
                value: "en-US"
              },
              {
                label: "India",
                value: "en-IN"
              }
            ]
          }, null, 8, ["modelValue"])
        ]),
        default: withCtx(() => [
          (openBlock(), createBlock(_component_AForm, {
            class: "aform-main",
            schema: $setup.form_schema,
            data: $setup.data,
            "onUpdate:data": _cache[0] || (_cache[0] = ($event) => $setup.data = $event),
            key: $setup.formKey
          }, null, 8, ["schema", "data"]))
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Form (Read-Only)" }, {
        default: withCtx(() => [
          createVNode(_component_AForm, {
            class: "aform-main",
            schema: $setup.basic_form_schema,
            data: $setup.data,
            "onUpdate:data": _cache[2] || (_cache[2] = ($event) => $setup.data = $event),
            mode: "read"
          }, null, 8, ["schema", "data"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Table" }, {
        default: withCtx(() => [
          createVNode(_component_AForm, {
            class: "aform-main",
            schema: $setup.table_schema,
            data: $setup.data,
            "onUpdate:data": _cache[3] || (_cache[3] = ($event) => $setup.data = $event)
          }, null, 8, ["schema", "data"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Fieldset" }, {
        default: withCtx(() => [
          createVNode(_component_AForm, {
            class: "aform-main",
            schema: $setup.fieldset_schema,
            data: $setup.data,
            "onUpdate:data": _cache[4] || (_cache[4] = ($event) => $setup.data = $event)
          }, null, 8, ["schema", "data"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Fieldset with Table" }, {
        default: withCtx(() => [
          createVNode(_component_AForm, {
            class: "aform-main",
            schema: $setup.fieldset_table_schema_ref,
            data: $setup.data,
            "onUpdate:data": _cache[5] || (_cache[5] = ($event) => $setup.data = $event)
          }, null, 8, ["schema", "data"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Hidden Fields" }, {
        default: withCtx(() => [
          _cache[9] || (_cache[9] = createBaseVNode(
            "p",
            { class: "info-text" },
            [
              createTextVNode(" The "),
              createBaseVNode("code", null, "id"),
              createTextVNode(" and "),
              createBaseVNode("code", null, "rowId"),
              createTextVNode(" fields have "),
              createBaseVNode("code", null, "hidden: true"),
              createTextVNode(" in the schema. AForm skips rendering them entirely — they never appear in the UI — but their values remain in the data model, as shown below. ")
            ],
            -1
            /* CACHED */
          )),
          createVNode(_component_AForm, {
            class: "aform-main",
            schema: $setup.hidden_field_schema,
            data: $setup.hidden_data,
            "onUpdate:data": _cache[6] || (_cache[6] = ($event) => $setup.hidden_data = $event)
          }, null, 8, ["schema", "data"]),
          createBaseVNode("div", _hoisted_1, [
            _cache[8] || (_cache[8] = createBaseVNode(
              "h4",
              null,
              "Form data (hidden fields are still present)",
              -1
              /* CACHED */
            )),
            createBaseVNode(
              "pre",
              null,
              toDisplayString(JSON.stringify($setup.hidden_data, null, 2)),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "TextBox" }, {
        default: withCtx(() => [
          createVNode(_component_AForm, {
            class: "aform-main",
            schema: $setup.textbox_schema,
            data: $setup.data,
            "onUpdate:data": _cache[7] || (_cache[7] = ($event) => $setup.data = $event)
          }, null, 8, ["schema", "data"])
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "aform/form.story.vue";
const form_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d153a5b7"], ["__file", "/home/dell/StoneCrop/stonecrop/examples/aform/form.story.vue"]]);
export {
  form_story as default
};
