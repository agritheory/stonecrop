import mqtt, { type MqttClient } from 'mqtt'
import { onMounted, onUnmounted, ref } from 'vue'

import { IMqttStream } from '../types'

/**
 * Use MQTT stream
 * @param options - MQTT stream options
 * @returns MQTT stream messages
 * @beta
 */
export const useMqttStream = (options: IMqttStream) => {
	const client = ref<MqttClient>()
	const messages = ref<Record<string, string[]>>({})

	onMounted(() => {
		client.value = mqtt.connect(options)

		if (!options.topics) {
			options.topics = ['#']
		}

		for (const topic of options.topics) {
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
		client.value?.end()
	})

	return { messages }
}
