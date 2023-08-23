import type { SchemaTypes } from 'types'
import type { Component } from 'vue'
import { useElementBounding } from '@vueuse/core'

export function useAModal(target: any, component: string | Component) {
	console.log(target, component)
	if (target) {
		const bounding = useElementBounding(target.$el as HTMLElement)
		target.position = {
			top: bounding.bottom.value,
			left: bounding.left.value,
			width: bounding.width.value,
			height: '1.15rem',
		}
	}
	return { target, component }
}

// https://techreads.pipoprods.org/writing-a-singleton-for-vue-js-composition-api/
// export default (function (target, component){
// 	let modal: SchemaTypes.AModalType = { target, component }

// 	return (target, component) => {
// 		return modal
// 	}
// })()
