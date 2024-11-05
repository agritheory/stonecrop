<template>
	<Story>
		<Variant title="stream">
			<pre>{{ messages }}</pre>
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import { useMqttStream } from '@stonecrop/beam'
import { reactive } from 'vue'

const mqtt = reactive({
	username: 'artemis',
	password: 'artemis',
	host: 'localhost',
	port: 1883,
	topics: ['smarthome/#', 'smarthome2/#'],
})

const { messages } = useMqttStream(mqtt.topics, {
	username: mqtt.username,
	password: mqtt.password,
	host: mqtt.host,
	port: mqtt.port,
})
</script>
