<template>
	<BeamHeading class="beam_filter-option-heading">{{ title }}</BeamHeading>
	<div @click="toggle" class="beam_filter-option">
		<div ref="select" class="beam_filter-option-select">
			<div class="beam_filter-arrow">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.36 70.71">
					<polygon points="0 70.71 0 0 35.36 35.36 0 70.71" />
				</svg>
			</div>
			<div class="beam_filter-label">
				<label>{{ choice }}</label>
			</div>
		</div>
		<ul v-if="open" ref="menu" class="beam_filter-select-menu" :style="{ top: menuTop }">
			<slot :change-value></slot>
			<li
				v-for="(choice, index) in choices"
				@click="updateValue(choice)"
				class="beam_filter-select-option"
				:data-value="{ value }"
				:key="{ index }">
				{{ choice.choice }}
			</li>
		</ul>
	</div>
</template>
<script setup>
import { ref, onMounted, useTemplateRef, defineProps } from 'vue'
const select = useTemplateRef('select')
const menu = useTemplateRef('menu')

const props = defineProps({
	title: {
		type: String,
		default: 'title',
	},
	choices: {
		type: [Array, { choice: String, value: String }],
	},
})

let menuTop = ref('0px')
let open = ref(false)
let value = ref(props.choices[0].value)
let choice = ref(props.choices[0].choice)

onMounted(() => {
	menuTop.value = getTotalHeight(select.value)
})

const getTotalHeight = el => {
	const height = el.getBoundingClientRect().height
	const marginTop = parseInt(getComputedStyle(el).marginTop)
	const marginBottom = parseInt(getComputedStyle(el).marginBottom)
	return height + marginTop + marginBottom + 'px'
}

const updateValue = choiceData => {
	choice = choiceData.choice
	value = choiceData.value
}

const toggle = () => {
	open.value = !open.value
}
</script>
<style scoped>
.beam_filter-option {
	cursor: pointer;
	position: relative;
	margin-bottom: 1rem;
}
.beam_filter-option-heading {
	font-size: 1rem;
	padding-bottom: 0.25rem;
}
.beam_filter-option-select {
	position: relative;
	appearance: none;
	border: 1px solid var(--row-border-color);
	font-weight: bold;
	color: var(--primary-text-color);
	font-size: 0.8rem;
	font-family: var(--font-family);
	display: flex;
	align-items: stretch;
}
label {
	cursor: pointer;
	padding: 0.5rem;
}
.beam_filter-arrow {
	background: var(--primary-color);
	color: var(--primary-text-color);
	cursor: pointer;
	display: flex;
	align-items: center;
	width: 5px;
	padding: 0.5rem 0.7rem;
}
.beam_filter-label {
	display: flex;
	align-items: center;
}
svg {
	fill: var(--primary-text-color);
	width: 5px;
	transform: rotate(90deg);
}
.beam_filter-select-menu {
	/* position: absolute; */
	z-index: 100;
	border-top: none;
	left: 0;
	border: 1px solid var(--row-border-color);
	padding: 0rem;
	list-style: none;
	width: 100%;
	box-sizing: border-box;
	max-height: 200px;
	overflow-y: scroll;
	margin: 0;
}
.beam_filter-select-option {
	font-size: 0.8rem;
	font-family: var(--font-family);
	font-weight: bold;
	color: var(--primary-text-color);
	border-bottom: 1px solid var(--row-border-color);
	padding: 0.5rem;
	&:hover {
		background: var(--primary-color);
	}
}
.selected {
	background: var(--row-border-color);
}
</style>
