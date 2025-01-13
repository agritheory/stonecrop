<template>
	<ATable v-model="rows" :columns="columns" :config="{ view: 'list', fullWidth: true }" :key="componentKey">
		<template #body="{ data }">
			<ARow
				v-for="(row, rowIndex) in data.rows"
				:key="row.id"
				:row="row"
				:rowIndex="rowIndex"
				:store="data"
				:tabIndex="0"
				:addNavigation="rowNav"
				@click="showBuilder(row.name)">
				<template #default>
					<ACell
						v-for="(col, colIndex) in data.columns"
						:key="col.name"
						:store="data"
						:col="col"
						spellcheck="false"
						:tabIndex="0"
						:addNavigation="rowNav"
						:contenteditable="false"
						:rowIndex="rowIndex"
						:colIndex="colIndex"
						:style="getRowCellStyle(col)" />
				</template>
			</ARow>
		</template>
	</ATable>
</template>

<script lang="ts" setup>
import type { TableColumn, TableRow } from '@stonecrop/atable'
import { type CSSProperties, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const componentKey = ref(0)
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
	const data = await response.json()
	rows.value = data.doctypes as Record<string, any>[]
	componentKey.value++
})

const showBuilder = (doctype: string) => {
	router.push({ name: 'builder', params: { id: doctype } })
}

const getRowCellStyle = (column: TableColumn): CSSProperties => {
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
