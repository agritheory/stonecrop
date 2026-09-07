---
title: Form Loading
description: A loading-state placeholder shown while a form's data is being fetched or resolved.
---

# Form Loading

`AFormLoading` is a presentational placeholder — an animated bar with an optional label — meant to stand in for a form or fieldset while its data is still being fetched or resolved. It takes no props; toggle its visibility (e.g. with `v-show`/`v-if`) alongside the form or fieldset it's covering for.

## Import

```ts
import { AFormLoading } from '@stonecrop/aform'
```

## Basic

Mount `AFormLoading` directly, with the loading message as its default slot content. Its bar-sweep and ellipsis animate continuously via CSS — no props or timers are required for the animation itself (the timer below is only there to swap the demo back to a "loaded" state so you can replay it).

::demo-panel
:::client-only
:form-loading-demo
:::

#code
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { AFormLoading } from '@stonecrop/aform'

const isLoading = ref(true)
let timer: ReturnType<typeof setTimeout>

function play() {
	isLoading.value = true
	clearTimeout(timer)
	timer = setTimeout(() => {
		isLoading.value = false
	}, 2500)
}

onMounted(play)
</script>

<template>
	<div class="stonecrop-demo">
		<AFormLoading v-if="isLoading">Loading</AFormLoading>
		<div v-else class="stonecrop-demo__state">
			<p>Data loaded.</p>
			<button type="button" @click="play">Replay</button>
		</div>
	</div>
</template>

<style scoped>
.stonecrop-demo__state {
	margin: 0;
	font-size: 0.85em;
}

.stonecrop-demo__state button {
	margin-top: 0.5rem;
}
</style>
```
::

## API Reference

### Props

::api-data-table
---
headers: ['Name', 'Type', 'Default', 'Description']
rows:
  - ['—', '—', '—', '`AFormLoading` accepts no props.']
---
::

### Slots

::api-data-table
---
headers: ['Name', 'Description']
rows:
  - ['`default`', 'Loading message text. When non-empty, an animated `...` suffix is appended automatically.']
---
::

## Accessibility

`AFormLoading` renders plain `<div>`s with no `role`, `aria-live`, or `aria-busy` attribute, so its appearance and disappearance are not announced to assistive technology on their own — a consumer that toggles it in place of a form should also manage focus or an `aria-live` region if that announcement matters.

Source: [`aform/src/components/AFormLoading.vue`](https://github.com/agritheory/stonecrop/blob/development/aform/src/components/AFormLoading.vue)
