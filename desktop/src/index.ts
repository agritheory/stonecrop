import CommandPalette from './components/CommandPalette.vue'
import Desktop from './components/Desktop.vue'
import SheetNav from './components/SheetNav.vue'
import StonecropDesktop from './plugins'
export { useActionSet } from './composables/useActionSet'
export {
	ActionSetIconActions,
	ActionSetIconApprovals,
	ActionSetIconChat,
	ActionSetIconEmail,
	ActionSetIconFiles,
	ActionSetIconHelp,
	ActionSetIconPrint,
	ActionSetIconReports,
	ActionSetIconSearch,
	ActionSetIconSettings,
} from './icons'
export { SHEET_NAV_TOOLBAR_SELECTOR } from './sheet-nav-toolbar'
export type * from './types'
export type {
	RouteAdapter,
	NavigationTarget,
	ActionEventPayload,
	RecordOpenEventPayload,
	ActionSetContext,
	ActionSetSlot,
	ActionSetSlotId,
	ActionSetPreview,
} from './types'

// ActionSet is not exported: it needs the controller Desktop creates for it, so Desktop is the only
// place it can render.
export { CommandPalette, Desktop, SheetNav, StonecropDesktop }
