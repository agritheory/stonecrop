<template>
	<Teleport to="body">
		<Transition name="fade">
			<div v-if="isOpen" class="command-palette-overlay" @click="closeModal">
				<div class="command-palette" @click.stop>
					<CommandSearch
						:search="search"
						:placeholder="placeholder"
						:max-results="maxResults"
						:autofocus="isOpen"
						@select="onSelect"
						@close="closeModal">
						<template #title="{ result }">
							<slot name="title" :result="result" />
						</template>
						<template #content="{ result }">
							<slot name="content" :result="result" />
						</template>
						<template v-if="$slots.empty" #empty>
							<slot name="empty" />
						</template>
					</CommandSearch>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts" generic="T">
import CommandSearch from './CommandSearch.vue'

defineSlots<{
	title?: { result: T }
	content?: { result: T }
	empty?: null
}>()

const {
	search,
	isOpen = false,
	placeholder = 'Type a command or search...',
	maxResults = 10,
} = defineProps<{
	search: (query: string) => T[]
	isOpen?: boolean
	placeholder?: string
	maxResults?: number
}>()

const emit = defineEmits<{
	select: [T]
	close: []
}>()

const closeModal = () => {
	emit('close')
}

const onSelect = (result: T) => {
	emit('select', result)
	closeModal()
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.command-palette-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: flex-start;
	justify-content: center;
	z-index: 300;
	padding-top: 100px;
}

.command-palette {
	width: 600px;
	max-width: 90%;
	background-color: var(--sc-overlay-background);
	border-radius: var(--sc-border-radius);
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	overflow: hidden;
	max-height: 80vh;
	display: flex;
	flex-direction: column;
}
</style>
