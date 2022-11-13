<template>
	<div class="action-set collapse">
		<div class="action-menu-icon">
			<svg viewBox="0 0 100 80" width="20" height="40">
				<rect width="100" height="20" rx="8"></rect>
				<rect y="30" width="100" height="20" rx="8"></rect>
				<rect y="60" width="100" height="20" rx="8"></rect>
			</svg>
		</div>
		<div class="action-element" v-for="(el, index) in _elements">
			<button v-if="el.elementType == 'button'" :onclick="el.action" class="button-default">{{ el.label }}</button>
			<div v-if="el.elementType == 'dropdown'">
				<button class="button-default" @click="toggleDropdown(index)">{{ el.label }}</button>
				<div class="dropdown-container" v-show="el.show">
					<div class="dropdown">
						<div v-for="item in el.actions">
							<button v-if="item.action != null" :onclick="item.action" class="dropdown-item">{{ item.label }}</button>
							<a v-else-if="item.link != null" :href="item.link"
								><button class="dropdown-item">{{ item.label }}</button></a
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'ActionSet',
	props: ['elements'],
	data() {
		return {
			_elements: Object,
		}
	},
	methods: {
		closeDropdowns() {
			for (let j = 0; j < this._elements.length; j++) {
				if (this._elements[j].elementType == 'dropdown') {
					this._elements[j].show = false
				}
			}
		},
		toggleDropdown(index) {
			const showDropdown = !this._elements[index].show
			this.closeDropdowns()
			this._elements[index].show = showDropdown
		},
	},
	mounted() {
		this._elements = this.elements
		this.closeDropdowns
	},
})
</script>
<style scoped>
.action-set {
	position: fixed;
	top: 10px;
	right: 10px;
	padding: 20px;
	/* -webkit-box-shadow: 0px 4px 9px 0px rgba(0,0,0,0.38); */
	box-shadow: 0px 1px 2px rgba(25, 39, 52, 0.05), 0px 0px 4px rgba(25, 39, 52, 0.1);
	border-radius: 10px;
	display: flex;
	flex-direction: row-reverse;
}

.action-menu-icon {
	position: absolute;
	top: 13px;
	right: 22px;
	color: red;
	opacity: 1;
	-webkit-transition: opacity 0.25s ease-in-out;
	-moz-transition: opacity 0.25s ease-in-out;
	-o-transition: opacity 0.25s ease-in-out;
	transition: opacity 0.25s ease-in-out;
	transition-delay: 0.5s;
}

.action-menu-icon svg {
	fill: #333333;
}

.action-set.collapse {
	max-width: 25px;
	overflow-x: hidden;

	-webkit-transition: max-width 0.5s ease-in-out;
	-moz-transition: max-width 0.5s ease-in-out;
	-o-transition: max-width 0.5s ease-in-out;
	transition: max-width 0.5s ease-in-out;
}

.action-set.collapse .action-element {
	opacity: 0;
	-webkit-transition: opacity 0.25s ease-in-out;
	-moz-transition: opacity 0.25s ease-in-out;
	-o-transition: opacity 0.25s ease-in-out;
	transition: opacity 0.25s ease-in-out;
	transition-delay: 0s;
}

.action-set.collapse:hover {
	max-width: 500px;
	overflow: visible !important;
}

.action-set.collapse:hover .action-menu-icon {
	opacity: 0 !important;
	transition-delay: 0s;
}

.action-set.collapse:hover .action-element {
	opacity: 100 !important;
	transition-delay: 0.5s;
}

.action-element {
	margin-left: 5px;
	margin-right: 5px;
}
button.button-default {
	background-color: #ffffff;
	padding: 5px 12px;
	border-radius: 3px;
	box-shadow: rgba(0, 0, 0, 0.05) 0px 0.5px 0px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px,
		rgba(0, 0, 0, 0.05) 0px 2px 4px 0px;
	border: none;
	cursor: pointer;
	white-space: nowrap;
}

button.button-default:hover {
	background-color: #f2f2f2;
}

.dropdown-container {
	position: relative;
}

.dropdown {
	position: absolute;
	top: 5px;
	right: 0;
	min-width: 200px;
	box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 18%);
	border-radius: 10px;
	background-color: #ffffff;
	padding: 10px;
}

button.dropdown-item {
	width: 100%;
	padding: 8px 5px;
	text-align: left;
	border: none;
	background-color: #ffffff;
	cursor: pointer;
	border-radius: 5px;
}

button.dropdown-item:hover {
	background-color: #f2f2f2;
}
</style>
