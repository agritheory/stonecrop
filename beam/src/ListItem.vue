<template>
	<li tabindex="0" class="beam__listitem">
		<div class="beam__listtext">
			<label>{{ item.label }}</label>
			<p>{{ item.description }}</p>
		</div>

		<ItemCount
			v-if="item.count"
			v-model="item.count.count"
			:denominator="item.count.of"
			:uom="item.count.uom"
			:editable="true" />
		<ItemCheck v-if="item.hasOwnProperty('checked')" v-model="item.checked" />
	</li>
</template>
<script>
import ItemCount from './ItemCount.vue'
import ItemCheck from './ItemCheck.vue'

export default {
	name: 'ListItem',
	components: {
		ItemCount,
		ItemCheck,
	},
	props: {
		item: {
			type: Object,
			required: true,
		},
	},
}
</script>
