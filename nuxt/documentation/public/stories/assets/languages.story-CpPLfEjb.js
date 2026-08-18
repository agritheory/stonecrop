import { ap as resolveComponent, aq as openBlock, ar as createBlock, as as withCtx, at as createVNode, av as defineComponent, ay as ref } from "./vendor-BFYlYCwc.js";
import { E as Ee } from "./code-editor-s9mGxGEt.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "languages.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const sql = ref(`WITH monthly_revenue AS (
  SELECT
    DATE_TRUNC('month', o.order_date) AS month,
    p.category,
    SUM(oi.quantity * oi.unit_price) AS revenue,
    COUNT(DISTINCT o.customer_id) AS unique_customers
  FROM orders o
  JOIN order_items oi ON o.id = oi.order_id
  JOIN products p ON oi.product_id = p.id
  WHERE o.status IN ('completed', 'shipped')
    AND o.order_date >= '2024-01-01'
  GROUP BY 1, 2
),
ranked AS (
  SELECT
    *,
    ROW_NUMBER() OVER (
      PARTITION BY month ORDER BY revenue DESC
    ) AS rank,
    LAG(revenue) OVER (
      PARTITION BY category ORDER BY month
    ) AS prev_month_revenue
  FROM monthly_revenue
)
SELECT
  month,
  category,
  revenue,
  unique_customers,
  ROUND(
    (revenue - prev_month_revenue) / NULLIF(prev_month_revenue, 0) * 100,
    2
  ) AS growth_pct
FROM ranked
WHERE rank <= 5
ORDER BY month DESC, revenue DESC`);
    const javascript = ref(`import { reactive, computed } from 'vue'

class EventBus {
  #listeners = new Map()

  on(event, callback) {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, new Set())
    }
    this.#listeners.get(event).add(callback)
    return () => this.off(event, callback)
  }

  off(event, callback) {
    this.#listeners.get(event)?.delete(callback)
  }

  emit(event, ...args) {
    this.#listeners.get(event)?.forEach(cb => cb(...args))
  }
}

export function useApi(baseUrl) {
  const state = reactive({
    data: null,
    loading: false,
    error: null,
  })

  const isReady = computed(() => !state.loading && !state.error)

  async function request(endpoint, options = {}) {
    state.loading = true
    state.error = null

    try {
      const response = await fetch(\`\${baseUrl}\${endpoint}\`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
      })

      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`)
      }

      state.data = await response.json()
      return state.data
    } catch (err) {
      state.error = err.message
      throw err
    } finally {
      state.loading = false
    }
  }

  return { state, isReady, request }
}`);
    const typescript = ref(`type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface RequestConfig<TBody = unknown> {
  method?: HttpMethod
  headers?: Record<string, string>
  body?: TBody
  signal?: AbortSignal
}

interface ApiResponse<T> {
  data: T
  status: number
  headers: Headers
}

interface ApiError {
  status: number
  message: string
  details?: Record<string, string[]>
}

type Result<T, E = ApiError> =
  | { ok: true; value: T }
  | { ok: false; error: E }

class ApiClient {
  #baseUrl: string
  #defaultHeaders: Record<string, string>

  constructor(baseUrl: string, headers: Record<string, string> = {}) {
    this.#baseUrl = baseUrl
    this.#defaultHeaders = headers
  }

  async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<Result<T>> {
    const { method = 'GET', headers, body, signal } = config

    try {
      const response = await fetch(\`\${this.#baseUrl}\${endpoint}\`, {
        method,
        headers: { ...this.#defaultHeaders, ...headers },
        body: body ? JSON.stringify(body) : undefined,
        signal,
      })

      if (!response.ok) {
        const error: ApiError = {
          status: response.status,
          message: response.statusText,
        }
        return { ok: false, error }
      }

      const data = await response.json() as T
      return { ok: true, value: data }
    } catch (err) {
      return {
        ok: false,
        error: { status: 0, message: (err as Error).message },
      }
    }
  }

  get<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }

  post<T>(endpoint: string, body: unknown, config?: Omit<RequestConfig, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...config, method: 'POST', body })
  }
}`);
    const python = ref(`from __future__ import annotations
from dataclasses import dataclass, field
from contextlib import contextmanager
from typing import Generic, TypeVar, Callable, Iterator
from functools import wraps
import time
import logging

T = TypeVar("T")

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class DocType:
    name: str
    label: str
    fields: list[Field] = field(default_factory=list)
    permissions: dict[str, bool] = field(default_factory=dict)

    @property
    def required_fields(self) -> list[Field]:
        return [f for f in self.fields if f.required]


@dataclass
class Field:
    fieldname: str
    fieldtype: str
    required: bool = False
    options: str | None = None


@dataclass
class Repository(Generic[T]):
    model: type[T]
    cache: dict[str, T] = field(default_factory=dict)

    def get(self, name: str) -> T | None:
        if name in self.cache:
            logger.debug("Cache hit: %s", name)
            return self.cache[name]
        return self._fetch(name)

    def _fetch(self, name: str) -> T | None:
        raise NotImplementedError


def retry(max_attempts: int = 3, delay: float = 1.0) -> Callable:
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as exc:
                    if attempt == max_attempts:
                        raise
                    logger.warning(
                        "Attempt %d/%d failed: %s",
                        attempt, max_attempts, exc
                    )
                    time.sleep(delay * attempt)
        return wrapper
    return decorator


@contextmanager
def transaction(connection) -> Iterator[None]:
    try:
        connection.begin()
        yield
        connection.commit()
    except Exception:
        connection.rollback()
        raise`);
    const __returned__ = { sql, javascript, typescript, python, get ACodeEditor() {
      return Ee;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { title: "languages" }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "sql" }, {
        default: withCtx(() => [
          createVNode($setup["ACodeEditor"], {
            modelValue: $setup.sql,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.sql = $event),
            language: "sql",
            options: { minimap: { enabled: false } }
          }, null, 8, ["modelValue"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "javascript" }, {
        default: withCtx(() => [
          createVNode($setup["ACodeEditor"], {
            modelValue: $setup.javascript,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.javascript = $event),
            language: "javascript",
            options: { minimap: { enabled: false } }
          }, null, 8, ["modelValue"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "typescript" }, {
        default: withCtx(() => [
          createVNode($setup["ACodeEditor"], {
            modelValue: $setup.typescript,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.typescript = $event),
            language: "typescript",
            options: { minimap: { enabled: false } }
          }, null, 8, ["modelValue"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "python" }, {
        default: withCtx(() => [
          createVNode($setup["ACodeEditor"], {
            modelValue: $setup.python,
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.python = $event),
            language: "python",
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
_sfc_main.__file = "code_editor/languages.story.vue";
const languages_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/dell/StoneCrop/stonecrop/examples/code_editor/languages.story.vue"]]);
export {
  languages_story as default
};
