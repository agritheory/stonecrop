import mqtt, { type MqttClient, type IClientOptions } from 'mqtt'
import { onMounted, onUnmounted, ref } from 'vue'

export const useMqttStream = (topics: string[], options?: IClientOptions) => {
	const client = ref<MqttClient>(null)
	const messages = ref<Record<string, string[]>>({})

	onMounted(() => {
		client.value = mqtt.connect(options)

		for (const topic of topics) {
			client.value.subscribe(topic, err => {
				if (err) {
					throw err
				}
			})
		}

		client.value.on('message', (topic, message) => {
			if (!messages.value[topic]) {
				messages.value[topic] = []
			}

			messages.value[topic].push(message.toString())
		})
	})

	onUnmounted(() => {
		client.value.end()
	})

	return { messages }
}
