<script setup lang="ts">
import type {IJoke} from '@/types/Joke.ts';

defineProps<{
	joke: IJoke
}>();
</script>

<template>
<div class="joke">
  <div class="setup">{{ joke.setup }}</div>
  <div class="punchline">{{ joke.punchline }}</div>
</div>
</template>

<style scoped>

</style>
