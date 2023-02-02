<template>
	<div
		:class="{ 'open-set': isOpen, 'hovered-and-closed': closeClicked }"
		class="action-set collapse"
		@mouseover="onHover"
		@mouseleave="onHoverLeave">
		<div class="action-menu-icon">
			<div id="chevron" @click="closeClicked = !closeClicked">
				<svg
					class="leftBar"
					version="1.1"
					id="Layer_1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					x="0px"
					y="0px"
					viewBox="0 0 100 100"
					xml:space="preserve"
					width="50"
					height="50">
					<polygon points="54.2,33.4 29.2,58.8 25,54.6 50,29.2 " />
				</svg>

				<svg
					class="rightBar"
					version="1.1"
					id="Layer_1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					x="0px"
					y="0px"
					viewBox="0 0 100 100"
					xml:space="preserve"
					width="50"
					height="50">
					<polygon points="70.8,58.8 45.8,33.4 50,29.2 75,54.6 " />
				</svg>
			</div>
		</div>
		<div style="margin-right: 30px"></div>
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
			isOpen: false,
			timeout: null,
			hover: false,
			closeClicked: false,
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
		onHover() {
			let self = this
			this.hover = true
			this.timeout = setTimeout(() => {
				if (self.hover) {
					self.isOpen = true
				}
			}, 500)
		},
		onHoverLeave() {
			this.hover = false
			this.closeClicked = false
			clearTimeout(this.timeout)
			this.isOpen = false
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
#chevron {
	position: relative;
	transform: rotate(90deg);
}

.leftBar,
.rightBar {
	transition-duration: 0.225s;
	transition-property: transform;
}

.leftBar,
.action-set.collapse.hovered-and-closed:hover .leftBar {
	transform-origin: 33.4% 50%;
	transform: rotate(90deg);
}

.rightBar,
.action-set.collapse.hovered-and-closed:hover .rightBar {
	transform-origin: 67% 50%;
	transform: rotate(-90deg);
}

.rightBar {
	position: absolute;
	top: 0;
	left: 0;
}

.action-set.collapse:hover .leftBar {
	transform: rotate(0);
}

.action-set.collapse:hover .rightBar {
	transform: rotate(0);
}

.action-set {
	position: fixed;
	top: 10px;
	right: 10px;
	padding: 20px;
	box-shadow: 0px 1px 2px rgba(25, 39, 52, 0.05), 0px 0px 4px rgba(25, 39, 52, 0.1);
	border-radius: 10px;
	display: flex;
	flex-direction: row-reverse;
	background-color: white;
	overflow: hidden;
}

.action-menu-icon {
	position: absolute;
	top: 6px;
	right: 8px;
}

.action-menu-icon svg {
	fill: #333333;
}

.action-set.collapse,
.action-set.collapse.hovered-and-closed:hover {
	max-width: 25px;
	overflow: hidden;

	-webkit-transition: max-width 0.5s ease-in-out;
	-moz-transition: max-width 0.5s ease-in-out;
	-o-transition: max-width 0.5s ease-in-out;
	transition: max-width 0.5s ease-in-out;
}

.action-set.collapse .action-element,
.action-set.collapse.hovered-and-closed:hover .action-element {
	opacity: 0;
	-webkit-transition: opacity 0.25s ease-in-out;
	-moz-transition: opacity 0.25s ease-in-out;
	-o-transition: opacity 0.25s ease-in-out;
	transition: opacity 0.25s ease-in-out;
	transition-delay: 0s;
}

.action-set.collapse:hover {
	max-width: 500px;
}

.action-set.collapse.open-set:hover {
	overflow: visible !important;
}

.action-set.collapse.hovered-and-closed:hover .action-element {
	opacity: 0 !important;
	/* transition-delay: 0.5s; */
}

.action-set.collapse:hover .action-element {
	opacity: 100 !important;
	/* transition-delay: 0.5s; */
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
