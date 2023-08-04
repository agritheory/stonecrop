import type { SchemaTypes } from 'types'
import { computed, ref } from 'vue'
import { useElementBounding } from '@vueuse/core'

export function useAModal(open, target, component) {
	let bounding = useElementBounding(target.$el)
	target.position = {
		top: bounding.bottom.value,
		left: bounding.left.value,
		width: bounding.width.value,
		height: '1.15rem',
	}
	return { open, target, component }
}

// https://techreads.pipoprods.org/writing-a-singleton-for-vue-js-composition-api/
// export default (function (target, component){
// 	let modal: SchemaTypes.AModalType = { target, component }

// 	return (target, component) => {
// 		return modal
// 	}
// })()
