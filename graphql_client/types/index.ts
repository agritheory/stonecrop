export type Meta = {
	variables: {
		doctype: string
	}

	response: {
		getMeta: {
			id: string
			name: string
			workflow: {
				id: string
				name: string
				machineId?: string
			}
			schema: {
				id: string
				label: string
			}[]
			actions: {
				id: string
				eventName: string
			}[]
		}
	}
}

export type MetaParser = {
	data: Meta['response']
}
