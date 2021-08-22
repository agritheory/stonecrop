<template>
<div
	:event="event"
	:colIndex="colIndex"
	:rowIndex="rowIndex"
	:tableid="tableid"
	class="adate"
	tabindex="0"
	ref="adatepicker"
>
    <table
        @keydown.page-down="handlePageDown"
        @keydown.page-up="handlePageUp"
    >
    <tr>
    <td
        @click="previousMonth"
				tabindex="-1"
    > &lt; </td>
    <th colspan="5"> {{ monthAndYear }} </th>
    <td 
        @click="nextMonth"
				tabindex="-1"
    > &gt; </td>
    </tr>
    <tr v-for="i in 6" :key="i">
			<td v-for="j in 7"
				:key="(((i - 1) * 7) + j)"
				:class="{
					'todaysdate': today(current[((i - 1) * 7) +j]), 
					'selecteddate': isSelectedDate(current[((i - 1) * 7) +j])
				}"
				@click="selectDate($event, ((i - 1) * 7) +j)"
			>
			{{ new Date(current[(((i - 1) * 7)) + j]).getDate() }}
			</td>
    </tr>
    </table>
</div>
</template>
<script>
import {ref, reactive, defineComponent, inject, computed, onMounted, watchEffect } from 'vue'

export default defineComponent({
	name: "ADate",
	// components: { ATableModal },
	props: ['event', "colIndex", "rowIndex", "indent", "tableid"],
	setup(props, context) {
		const TableData = inject(props.tableid)
		console.log(TableData)
		const todaysDate = new Date()
		let currentMonth = reactive(todaysDate.getMonth())
		let currentYear = reactive(todaysDate.getFullYear())

		let currentDate = ref('')
		let selectedDate = ref(TableData.cellData(props.rowIndex, props.colIndex))
		let current = reactive([])
		let width = ref('')

		const renderMonth = function(){
			const firstOfMonth = new Date(currentYear + "-" + (currentMonth + 1) + "-01")
			const monthStartWeekday = firstOfMonth.getDay()
			const calendarStartDay = firstOfMonth.setDate(firstOfMonth.getDate() - monthStartWeekday)
			for(let i of Array(43).keys()){
				// FIX ME
				current.push(reactive(calendarStartDay + (i * 84000000)))
				// this.$set(this.current, i, calendarStartDay + (i * 84000000))
			}
		}

		const handlePageDown = function(){
			if(event.shiftKey === true){
				previousYear()
			} else { previousMonth() }
		}

		const handlePageUp = function(){
			if(event.shiftKey === true){
				nextYear()
			} else { nextMonth() }
		}

		const previousYear = function(){ currentYear -= 1 }
		const nextYear = function(){ currentYear += 1 }
		const previousMonth = function(){
			if(currentMonth == 0){
				currentMonth = 11
				currentYear -= 1
			} else {
				currentMonth -= 1
			}
		}

		const nextMonth = function(){
			if(currentMonth == 11){
				currentMonth = 0
				currentYear += 1
			} else {
				currentMonth += 1
			}
		}

		const today = function(day){
			let todaysDate = new Date().setUTCHours(0, 0, 0, 0)
			if (currentMonth !== new Date(todaysDate).getMonth()){
				return
			}
			return new Date(todaysDate).toDateString() === new Date(day).toDateString() ? true: null
		}

		const isSelectedDate = function(day){
			return new Date(day).toDateString() === new Date(selectedDate).toDateString() ? true: null
		}

		const selectDate = function(event, currentIndex){
			selectedDate = current[currentIndex]
			updateData(event)
			event.preventDefault()
			event.stopPropagation()
			context.refs.adatepicker.destroy()
		}
		const updateData = function(){
			let value = (new Date(Number(selectedDate)).toLocaleDateString('en-US'))
			TableData.setCellData(props.rowIndex, props.colIndex, selectedDate)
		}
		onMounted(() => { renderMonth() })

		const dayWidth = computed(() => { return ((width.value.replace('px', '') / 7) - 1) + 'px' })
		const monthAndYear = computed(() => {
			return new Date(currentYear, currentMonth, 1).toLocaleDateString(undefined, {year: 'numeric', month: 'long'})
		})

		watchEffect((currentMonth) => { renderMonth()})
		watchEffect((currentYear) => { renderMonth()})

		return { TableData, currentDate, selectedDate, currentMonth, currentYear, current, width, today, monthAndYear, previousMonth, nextMonth, dayWidth, isSelectedDate, selectDate, updateData }
	}

})
</script>
<style scoped>
.adate {
	border: 2px solid var(--focus-cell-outline);
	position: absolute;
	z-index: 100;
	font-size: var(--table-font-size);
	display: inline-table;
	background-color: var(--row-color-zebra-light);
	color: var(--cell-text-color);
	outline: none;
	width: calc(100% - 4px);
}
.adate tr {
	height: 1.15rem;
	text-align: center;
	vertical-align: middle;
}
.adate td {
	border: 2px solid transparent;
	min-width: 2.25ch; /* this doesn't zoom correctly */
}
.adate td:hover {
	border: 2px solid var(--focus-cell-outline);
}
button {
  background-color: var(--row-color-zebra-light);
  border: none;
  padding: 0px;
  margin: 0px;
  color: var(--cell-text-color);
  outline: none;
  font-size: var(--table-font-size);
}
.dateheader {
	font-weight: 700;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.adate .todaysdate {
	border-bottom-color: var(--focus-cell-outline);
}

.adate .selecteddate {
	border: 2px solid var(--focus-cell-outline);
}

</style>