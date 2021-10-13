<template>
	<ATable
		:columns="coa.columns"
		:rows="coa.rows"
		:config="coa.config"
	/>
	<!-- <br>
	<hr>
	<br> -->
	<!-- <ATable
		:columns="http_logs.columns"
		:rows="http_logs.rows"
		:config="http_logs.config"
	/>	 -->
</template>

<script>
/* eslint-disable */

import coa_data from './assets/sample_data/coa.json'
import http_data from './assets/sample_data/http_logs.json'

export default {
	name: 'Dev',
	data() {
		return {
			coa: {
				columns: [
					{
						label: "Number",
						name: "account_number",
						type: "Data",
						align: 'Left',
						edit: false,
						width: '10ch',
					},
					{
						label: "Account",
						name: "account_title",
						type: "Data",
						align: 'Left',
						edit: true,
						width: '50ch',
					},
					{
						label: "Balance",
						name: "balance",
						type: "Data",
						align: 'Left',
						edit: false,
						width: '20ch',
						format: value => {return value.title}
					}
				],
				config: { numberedRows: false, treeView: true },
				rows: coa_data
			},
			http_logs: {
				columns: [
					{
						label: "Home Page",
						name: "home_page",
						type: "Data",
						align: 'Left',
						edit: false,
						width: '35ch',
						format: value => {return value.title}
					},
					{
						label: "HTTP Method",
						name: "http_method",
						type: "Data",
						align: 'Left',
						edit: true,
						width: '20ch',
					},
					{
						label: "IP Address",
						name: "ip_address",
						type: "Data",
						align: 'Left',
						edit: false,
						width: '20ch',
					},
					{
						label: "Status",
						name: "status",
						type: "Data",
						align: 'Left',
						edit: true,
						width: '35ch',
					},
					// {
					// 	label: "Report Date",
					// 	name: "report_date",
					// 	type: "component",
					// 	align: 'Center',
					// 	edit: true,
					// 	width: '25ch',
					// 	component: 'ADate',
					// 	format: value => { return (new Date(Number(value)).toLocaleDateString('en-US')) }
					// },
				],
				config: { numberedRows: true, treeView: false },
				rows: http_data
			}
		}
	},
	mounted(){
	}
}

// function renderSomething(event, rowIndex, colIndex, parent, tableid){
// 	// https://github.com/pearofducks/mount-vue-component/blob/master/index.js
// 	// vendor and make this into a utility function 
// 	const DatePicker = defineComponent({
// 		extends: ADate,
// 		parent: parent,
// 		// propsData: { event, rowIndex, colIndex, tableid }
// 	})

// 	console.log(DatePicker)
// 	let dateModal = h(DatePicker, { event, rowIndex, colIndex, tableid })
// 	event.target.appendChild(dateModal)


// }

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
@import './assets/atable.css';

</style>
