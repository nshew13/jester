<script setup lang="ts">
import {computed} from 'vue';
import type {IJoke} from '@/types/Joke.ts';

const props = defineProps<{
	joke: IJoke
}>();

const backgroundColorOptions = [
	'blue',
	'gold',
	'green',
	'red',
];

// picks a color based on ID, meaning they should appear in a repeating sequence
const jokeColorIndex = computed<number>(() => (props.joke?.id ?? 1) % 4);
</script>

<template>
<q-card bordered flat class="joke" :class="backgroundColorOptions[jokeColorIndex]">
  <q-card-section class="joke-content">
    <div class="setup">{{ joke.setup }}</div>
    <div class="punchline">{{ joke.punchline }}</div>
  </q-card-section>

  <q-separator />
  <div class="joke-type">{{ joke.type }}</div>
</q-card>
</template>

<style scoped>
.joke {
    display: flex;
    flex-direction: column;

    border-radius: 10px;
    padding: 1em;
    margin: 1em;

    &.blue { background: var(--jester-color-bg-blue); }
    &.gold { background: var(--jester-color-bg-gold); }
    &.green { background: var(--jester-color-bg-green); }
    &.red { background: var(--jester-color-bg-red); }
}

.joke-content {
    flex: 1 0 0;
}

.setup {
    font-weight: bold;
}

.joke-type {
    text-align: right;
    font-style: italic;
    font-size: smaller;
}
</style>
