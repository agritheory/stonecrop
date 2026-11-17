import type { InjectionKey } from 'vue'

/** The name Desktop registers its list link under, which a list's column names as its cell component. */
export const ROW_LINK_COMPONENT = 'DesktopRowLink'

/** Opens what a list row stands for: its record, or on the doctypes list, that doctype's records. */
export const openListRowKey: InjectionKey<(row: Record<string, unknown>) => Promise<void>> = Symbol('openListRow')
