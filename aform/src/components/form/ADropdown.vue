<template>
	<div class="autocomplete" :class="{ isOpen: isOpen }">
		<div class="input-wrapper">
			<input
				ref="mopInput"
				type="text"
				@input="onChange"
				@focus="onChange"
				v-model="search"
				@keydown.down="onArrowDown"
				@keydown.up="onArrowUp"
				@keydown.enter="onEnter" />
			<ul id="autocomplete-results" v-show="isOpen" class="autocomplete-results">
				<li class="loading autocomplete-result" v-if="isLoading">Loading results...</li>
				<li
					v-else
					v-for="(result, i) in results"
					:key="i"
					@click="setResult(result)"
					class="autocomplete-result"
					:class="{ 'is-active': i === arrowCounter }">
					{{ result }}
				</li>
			</ul>
			<label v-if="label">{{ label }}</label>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
	name: 'ADropdown',
	props: {
		modelValue: {
			type: String,
			required: false,
			default: '',
		},
		label: {
			type: String,
			required: true,
		},
		value: String,
		items: {
			type: Array,
			required: false,
			default: () => [],
		},
		isAsync: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	emits: ['update:modelValue', 'filterChanged'],
	data() {
		return {
			results: [],
			search: this.modelValue,
			isLoading: false,
			arrowCounter: 0,
			isOpen: false,
		}
	},
	watch: {
		items: function (value, oldValue) {
			this.isLoading = false
			this.results = value
		},
	},
	mounted() {
		document.addEventListener('click', this.handleClickOutside)
		this.filterResults()
	},
	destroyed() {
		document.removeEventListener('click', this.handleClickOutside)
	},
	methods: {
		setResult(result) {
			this.search = result
			this.closeResults()
		},
		filterResults() {
			this.results = this.items.filter(item => {
				return item.toLowerCase().indexOf(this.search.toLowerCase()) > -1
			})
		},
		onChange() {
			this.isOpen = true
			if (this.isAsync) {
				this.isLoading = true
				this.$emit('filterChanged', this.search)
			} else {
				this.filterResults()
			}
		},
		handleClickOutside(event) {
			if (!this.$el.contains(event.target)) {
				this.closeResults()
				this.arrowCounter = 0
			}
		},
		closeResults() {
			this.isOpen = false

			if (!this.items.includes(this.search)) {
				this.search = ''
			}

			this.$emit('update:modelValue', this.search)
		},
		onArrowDown() {
			if (this.arrowCounter < this.results.length) {
				this.arrowCounter = this.arrowCounter + 1
			}
		},
		onArrowUp() {
			if (this.arrowCounter > 0) {
				this.arrowCounter = this.arrowCounter - 1
			}
		},
		onEnter() {
			this.search = this.results[this.arrowCounter]
			this.closeResults()
			this.arrowCounter = 0
		},
		openWithSearch() {
			this.search = ''
			this.onChange()
			this.$refs.mopInput.focus()
		},
	},
})
</script>

<style scoped>
/* variables taken from here: https://github.com/frappe/frappe/blob/version-13/frappe/public/scss/common/awesomeplete.scss */
.autocomplete {
	position: relative;
}

.input-wrapper {
	min-width: 40ch;
	border: 1px solid transparent;
	padding: 0rem;
	margin: 0rem;
	margin-right: 1ch;
}

input {
	width: calc(100% - 1ch);
	outline: 1px solid transparent;
	border: 1px solid var(--input-border-color);
	padding: 1ch 0.5ch 0.5ch 1ch;
	margin: calc(1.15rem / 2) 0 0 0;
	min-height: 1.15rem;
	border-radius: 0.25rem;
}

input:focus {
	border: 1px solid var(--input-active-border-color);
	border-radius: 0.25rem 0.25rem 0 0;
	border-bottom: none;
}

label {
	display: block;
	min-height: 1.15rem;
	padding: 0rem;
	margin: 0rem;
	border: 1px solid transparent;
	margin-bottom: 0.25rem;
	z-index: 2;
	font-size: 80%;
	position: absolute;
	background: white;
	margin: calc(-1.5rem - calc(2.15rem / 2)) 0 0 1ch;
	padding: 0 0.25ch 0 0.25ch;
}

.autocomplete-results {
	position: absolute;
	width: calc(100% - 1ch + 1.5px);
	z-index: 1;
	padding: 0;
	margin: 0;
	color: #000000;
	border: 1px solid var(--input-active-border-color);
	border-radius: 0 0 0.25rem 0.25rem;
	border-top: none;
}

.autocomplete-result {
	list-style: none;
	text-align: left;
	padding: 4px 6px;
	cursor: pointer;
}

.autocomplete-result.is-active,
.autocomplete-result:hover {
	background-color: var(--row-color-zebra-light);
	color: #000000;
}
</style>
