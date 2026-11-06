import { mount } from '@vue/test-utils'
import type { ComponentMountingOptions } from '@vue/test-utils'

import AForm from '../src/components/AForm.vue'

// Mounts AForm bound as `v-model:data` binds it: each record the form reports comes back as its `data`. A form
// that nothing listens to is read-only, so a test of the editable form mounts it this way.
export const mountBound = (options: ComponentMountingOptions<typeof AForm>) => {
	const wrapper = mount(AForm, {
		...options,
		props: {
			...options.props,
			'onUpdate:data': (record: Record<string, any>) => void wrapper.setProps({ data: record }),
		},
	} as ComponentMountingOptions<typeof AForm>)
	return wrapper
}
