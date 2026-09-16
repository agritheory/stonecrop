import { defineComponent, h, mergeProps, type Component } from 'vue'

/**
 * Shared 24×24 stroke chrome for document-rail and shell icons.
 * Paths are Lucide (or a reduced Autoreader tray) so 16px tiles stay a distinct silhouette.
 */
function railIcon(name: string, children: () => ReturnType<typeof h>[]): Component {
	return defineComponent({
		name,
		inheritAttrs: false,
		setup(_, { attrs }) {
			return () =>
				h(
					'svg',
					mergeProps(
						{
							viewBox: '0 0 24 24',
							fill: 'none',
							stroke: 'currentColor',
							'stroke-width': '2',
							'stroke-linecap': 'round',
							'stroke-linejoin': 'round',
							'aria-hidden': 'true',
						},
						attrs
					),
					children()
				)
		},
	})
}

/** Two flowchart nodes and a connecting elbow — FSM / BPA “move”. @public */
export const RailIconActions = railIcon('RailIconActions', () => [
	h('rect', { width: '8', height: '8', x: '3', y: '3', rx: '2' }),
	h('path', { d: 'M7 11v4a2 2 0 0 0 2 2h4' }),
	h('rect', { width: '8', height: '8', x: '13', y: '13', rx: '2' }),
])

/** Magnifier. @public */
export const RailIconSearch = railIcon('RailIconSearch', () => [
	h('circle', { cx: '11', cy: '11', r: '8' }),
	h('path', { d: 'm21 21-4.3-4.3' }),
])

/** Speech bubble with a tail. @public */
export const RailIconChat = railIcon('RailIconChat', () => [h('path', { d: 'M7.9 20A9 9 0 1 0 4 16.1L2 22Z' })])

/** Autoreader stacked trays, reduced to 24 viewBox. @public */
export const RailIconEmail = railIcon('RailIconEmail', () => [
	h('rect', { x: '5', y: '3', width: '14', height: '8', rx: '1.5' }),
	h('path', { d: 'M8 7h8' }),
	h('path', { d: 'M3 12h18' }),
	h('rect', { x: '5', y: '13', width: '14', height: '8', rx: '1.5' }),
	h('path', { d: 'M8 17h8' }),
])

/** Paperclip — attachments, not another document. @public */
export const RailIconFiles = railIcon('RailIconFiles', () => [
	h('path', {
		d: 'm16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486',
	}),
])

/** Page with a check — the Approvals stamp, simplified. @public */
export const RailIconApprovals = railIcon('RailIconApprovals', () => [
	h('path', {
		d: 'M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.687.687l3.626 3.626A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z',
	}),
	h('path', { d: 'M14 2v5a1 1 0 0 0 1 1h5' }),
	h('path', { d: 'm9 15 2 2 4-4' }),
])

/** Three rising bars — reports / BI. @public */
export const RailIconReports = railIcon('RailIconReports', () => [
	h('path', { d: 'M5 21v-6' }),
	h('path', { d: 'M12 21V3' }),
	h('path', { d: 'M19 21V9' }),
])

/** Printer. @public */
export const RailIconPrint = railIcon('RailIconPrint', () => [
	h('path', { d: 'M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2' }),
	h('path', { d: 'M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6' }),
	h('rect', { x: '6', y: '14', width: '12', height: '8', rx: '1' }),
])

/** Gear. @public */
export const RailIconSettings = railIcon('RailIconSettings', () => [
	h('path', {
		d: 'M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915',
	}),
	h('circle', { cx: '12', cy: '12', r: '3' }),
])

/** Circled question mark. @public */
export const RailIconHelp = railIcon('RailIconHelp', () => [
	h('circle', { cx: '12', cy: '12', r: '10' }),
	h('path', { d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' }),
	h('path', { d: 'M12 17h.01' }),
])
