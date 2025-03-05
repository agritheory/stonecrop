import mqtt, { type MqttClient } from 'mqtt'
import { onMounted, onUnmounted, ref } from 'vue'

import { IMqttStream } from '../types'

/**
 * Use MQTT stream
 * @param options - MQTT stream options
 * @returns MQTT stream messages
 * @beta
 */
export const useMqttStream = async (options: IMqttStream) => {
	if (options.host && options.port) {
		const portActive = await isPortActive(options.host, options.port)
		if (!portActive) {
			return
		}
	}

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

/**
 * Check if a local port has a service running
 * @param host the host to check
 * @param port the port to check
 * @returns true if the port has a service running, false otherwise
 *
 * @beta
 */
export const isPortActive = async (host: string, port: number) => {
	try {
		const controller = new AbortController()
		// Set a timeout of 2 seconds
		const timeoutId = setTimeout(() => controller.abort(), 2000)

		try {
			await fetch(`${host}:${port}`, {
				mode: 'no-cors', // This allows checking without CORS issues
				signal: controller.signal,
			})

			clearTimeout(timeoutId)
			// If we get any response, the port is in use
			return true
		} catch (error) {
			clearTimeout(timeoutId)
			if (error instanceof DOMException && error.name === 'AbortError') {
				// Timeout - port is probably not in use
				return false
			}

			// For connection refused errors, we need to check the error message
			// as different browsers handle this differently
			const errorString = String(error)
			if (
				errorString.includes('NetworkError') ||
				errorString.includes('Failed to fetch') ||
				errorString.includes('net::ERR_CONNECTION_REFUSED')
			) {
				return false
			}

			// If we get here, there might be something running on the port
			return true
		}
	} catch (error) {
		return false
	}
}
