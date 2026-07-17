<!--
	The routeStrategy catch-all target. Lives outside pages/ so Nuxt's file-based routing
	doesn't auto-register it as its own route — it is only reachable via the module-generated
	catch-all route, which is exactly what the test asserts.
-->
<template>
	<div>catchall-rendered</div>
</template>
