import type { Ref } from 'vue'

import type Doctype from './doctype'
import { mergeComposeSettled } from './merge-settled-draft'
import type Registry from './registry'

/**
 * Fill a draft form ref from composed defaults; apply awaitable layers when they settle.
 * @public
 */
export function seedDraftRecord(
	registry: Registry,
	doctype: Doctype,
	target: Ref<Record<string, unknown> | Record<string, any>>,
	options?: { awaitLoader?: boolean }
): void {
	const run = async () => {
		const result = options?.awaitLoader
			? await registry.composeNewRecord(doctype)
			: registry.composeNewRecordSync(doctype)
		const syncSnapshot = result.record
		target.value = syncSnapshot
		const settled = await result.settled
		target.value = mergeComposeSettled(target.value, syncSnapshot, settled)
	}

	void run()
}
