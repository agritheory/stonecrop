import { createLocalVue, mount } from '@vue/test-utils'
import { ATable } from '../src'
const http_data = require('../dev/assets/sample_data/http_logs.json')

test('table renders', async () => {
	await wrapper.vm.$nextTick()
	const localVue = createLocalVue()

	const wrapper = mount(ATable, {
		localVue,
		propsData: {
			rows: http_data,
			columns: [
				{
					label: 'Home Page',
					name: 'home_page',
					type: 'Data',
					align: 'Left',
					edit: false,
					width: '35ch',
					format: value => {
						return value.title
					},
				},
				{
					label: 'HTTP Method',
					name: 'http_method',
					type: 'Data',
					align: 'Left',
					edit: true,
					width: '20ch',
				},
				{
					label: 'IP Address',
					name: 'ip_address',
					type: 'Data',
					align: 'Left',
					edit: false,
					width: '20ch',
				},
				{
					label: 'Status',
					name: 'status',
					type: 'Data',
					align: 'Left',
					edit: true,
					width: '35ch',
				},
			],
			config: { numberedRows: true },
		},
	})

	console.log(wrapper)
	expect(wrapper.text()).toContain(' Hello World ')
})
