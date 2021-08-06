<template>
	<ul class="beam__listview">
  	<li v-for="(item, index) in items" :key="index">
			<template v-if="item.linkComponent">
				<component :is="item.linkComponent" :to="item.route" tabindex="-1">
      		<ListItem :item="item"></ListItem>
				</component>
			</template>
			<template v-else>
				<ListItem :item="item"></ListItem>
			</template>
  	</li>
	</ul>
</template>
<script>
import ListAnchor from './ListAnchor.vue'
import ListItem from './ListItem.vue'

export default {
	name: 'ListView',
  components: {
    ListItem, ListAnchor
	},
	props: {
    items: {
      type: Array,
      required: true
    },
	},
	created() {
    window.addEventListener("scroll", this.handleScroll)
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll)
  },
  methods: {
    handleScroll () {
			const scrollHeightDifference = document.documentElement.scrollHeight - window.innerHeight
			const scrollposition = document.documentElement.scrollTop
			if (scrollHeightDifference - scrollposition <= 2){
				this.$emit('scrollbottom')
			}
    }
  },
}
</script>