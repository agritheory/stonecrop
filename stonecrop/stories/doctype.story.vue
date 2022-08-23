<template>
	<Story title="Doctype">
		<div>
			<pre> {{doctype.slug }} <br>
				{{ doctype }}
			</pre>
		</div>
	</Story>
</template>
<script lang="ts" setup>
import { Map, OrderedSet } from 'immutable'
import { Doctype } from '@/doctype.js'

let doctype = new Doctype(
	"To Do",
	Map({date: 'date', amount: 'amount'}),
	Map({}),
	OrderedSet([1, 2, 3]),
)

</script>
<style>
</style>
<!-- enter documentation here -->
<docs lang="md">
</docs>
