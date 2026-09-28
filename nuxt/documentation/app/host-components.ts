import { defineAsyncComponent } from 'vue'

/**
 * Custom field components the playground registers globally, keyed by the name a doctype's
 * `component` names. The doctype-fixture test reads this map, so a fixture naming a component
 * missing here fails there.
 */
export const hostComponents = {
	CountryExplorer: defineAsyncComponent(() => import('./components/CountryExplorer.vue')),
}
