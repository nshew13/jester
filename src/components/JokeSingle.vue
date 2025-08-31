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
  <div class="type">{{ joke.type }}</div>
</div>
</template>

<style scoped>
.joke {
    border-radius: 10px;
    background: lightblue;
    padding: 1em;
    margin: 1em;

    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "setup type"
      "punchline type"
    ;

    /* grid positioning */
    .setup { grid-area: setup; }
    .punchline { grid-area: punchline; }
    .type { grid-area: type; }
}

.setup {
    font-weight: bold;
}

.type {
    display: flex;
    flex-direction: column;
    justify-content: center;

    font-style: italic;
    font-size: smaller;
    border: 1px solid black;
    padding: 0.5em;
}
</style>
