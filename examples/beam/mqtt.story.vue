<template>
	<Story :layout="{ type: 'grid', width: 400 }">
		<Variant title="subscribe to all">
			<pre>{{ allMessages }}</pre>
		</Variant>

		<Variant title="subscribe to select topics">
			<pre>{{ topicMessages }}</pre>
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

const { messages: allMessages } = useMqttStream({
	username: mqtt.username,
	password: mqtt.password,
	host: mqtt.host,
	port: mqtt.port,
})

const { messages: topicMessages } = useMqttStream({
	username: mqtt.username,
	password: mqtt.password,
	host: mqtt.host,
	port: mqtt.port,
	topics: mqtt.topics,
})
</script>

<style>
pre {
	color: var(--histoire-contrast-color);
}
</style>
