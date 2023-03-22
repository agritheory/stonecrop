<template>
	<router-view></router-view>
	<SheetNav />
</template>
<script setup lang="ts">
import { reactive, inject, onBeforeMount, ref } from 'vue'
import SheetNav from './components/SheetNav.vue'
</script>
