<template>
	<ATable id="list" :key="rows" :columns="columns" :rows="rows" :config="{ view: 'list', fullWidth: true }">
		<template #body="{ data }: { data: TableDataStore }">
			<ARow
				v-for="(row, rowIndex) in data.rows"
				:key="row.id || v4()"
				:row="row"
				:rowIndex="rowIndex"
				:tableid="data.id"
				:tabIndex="0"
				:addNavigation="rowNav"
				@click="showBuilder(row.name)">
				<template #default>
					<ACell
						v-for="(col, colIndex) in data.columns"
						:key="colIndex"
						:tableid="data.id"
						:col="col"
						spellcheck="false"
						:tabIndex="0"
						:addNavigation="rowNav"
						:contenteditable="false"
						:rowIndex="rowIndex"
						:colIndex="colIndex + (data.zeroColumn ? 0 : -1)"
						:style="getRowCellStyle(col)" />
				</template>
			</ARow>
		</template>
	</ATable>
</template>

<script lang="ts" setup>
import { v4 } from 'uuid'
import { CSSProperties, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { TableDataStore } from '@stonecrop/atable'
import { TableColumn, TableRow } from '@stonecrop/atable/types'

const router = useRouter()

const rows = ref<TableRow[]>([])
const columns = [
	{
		label: 'Doctype Name',
		name: 'name',
		type: 'Data',
		align: 'left',
		edit: false,
		width: '35ch',
	},
] as TableColumn[]

onMounted(async () => {
	const response = await fetch('/api/doctypes')
	const data: Record<string, Record<string, any>[]> = await response.json()
	rows.value = data.doctypes
})

function showBuilder(doctype: string) {
	router.push({ name: 'builder', params: { id: doctype } })
}

function getRowCellStyle(column: TableColumn): CSSProperties {
	return {
		minWidth: column?.width || '40ch',
		textAlign: column?.align || 'center',
	}
}

const rowNav = {
	'keydown.up': (event: KeyboardEvent) => {
		event.preventDefault()
		event.stopPropagation()

		const target =
			event.target instanceof HTMLTableCellElement ? event.target.parentElement : (event.target as HTMLTableRowElement)

		const $row = target.previousElementSibling
			? (target.previousElementSibling as HTMLTableRowElement)
			: (target as HTMLTableRowElement)

		$row.focus()
		return true
	},
	'keydown.down': (event: KeyboardEvent) => {
		event.preventDefault()
		event.stopPropagation()

		const target =
			event.target instanceof HTMLTableCellElement ? event.target.parentElement : (event.target as HTMLTableRowElement)

		const $row = target.nextElementSibling
			? (target.nextElementSibling as HTMLTableRowElement)
			: (target as HTMLTableRowElement)

		$row.focus()
		return true
	},
}

rowNav['keydown.alt.up'] = rowNav['keydown.up']
rowNav['keydown.alt.down'] = rowNav['keydown.down']
rowNav['keydown.shift.enter'] = rowNav['keydown.up']
rowNav['keydown.enter'] = rowNav['keydown.down']
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
@import url('@stonecrop/themes/default/default.css');
/* @import '../style.css'; */
</style>
