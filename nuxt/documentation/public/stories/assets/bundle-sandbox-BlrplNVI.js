import { L as parseQuery, n as ref, H as createApp, M as h, c as computed, k as watch, G as onMounted, N as applyState, J as createPinia } from "./vendor-BFYlYCwc.js";
import { m as mapFile, f as files, _ as _sfc_main, h as histoireConfig, i as isDark } from "./mapping-DL6SWDil.js";
import { S as SANDBOX_READY, _ as _sfc_main$1, a as STATE_SYNC, P as PREVIEW_SETTINGS_SYNC, b as applyPreviewSettings, t as toRawDeep } from "./state-AsnE8h2R.js";
const query = parseQuery(window.location.search);
const file = ref(mapFile(files.find((f) => f.id === query.storyId)));
const app = createApp({
  name: "SandboxApp",
  setup() {
    const story = computed(() => file.value.story);
    const variant = computed(() => story.value?.variants.find((v) => v.id === query.variantId));
    let synced = false;
    let mounted = false;
    window.addEventListener("message", (event) => {
      if (event.data?.type === STATE_SYNC) {
        if (!mounted) return;
        synced = true;
        applyState(variant.value.state, event.data.state);
      } else if (event.data?.type === PREVIEW_SETTINGS_SYNC) {
        applyPreviewSettings(event.data.settings);
      }
    });
    watch(() => variant.value.state, (value) => {
      if (synced && mounted) {
        synced = false;
        return;
      }
      window.parent?.postMessage({
        type: STATE_SYNC,
        state: toRawDeep(value, true)
      });
    }, {
      deep: true
    });
    onMounted(() => {
      mounted = true;
    });
    return {
      story,
      variant
    };
  },
  render() {
    return [
      h("div", { class: "htw-sandbox-hidden" }, [
        h(_sfc_main, {
          key: file.value.story.id,
          story: file.value.story
        })
      ]),
      this.story && this.variant ? h(_sfc_main$1, { story: this.story, variant: this.variant, onReady: () => {
        window.parent?.postMessage({
          type: SANDBOX_READY
        });
      } }) : null
    ];
  }
});
app.use(createPinia());
app.mount("#app");
watch(isDark, (value) => {
  if (value) {
    document.documentElement.classList.add(histoireConfig.sandboxDarkClass);
    document.documentElement.classList.add(histoireConfig.theme.darkClass);
  } else {
    document.documentElement.classList.remove(histoireConfig.sandboxDarkClass);
    document.documentElement.classList.remove(histoireConfig.theme.darkClass);
  }
}, {
  immediate: true
});
