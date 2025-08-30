<script setup lang="ts">
import type {IJoke} from '@/types/Joke.ts';
import JokeSingle from '@/components/JokeSingle.vue';

defineProps<{
	jokes: IJoke[]
}>();
</script>

<template>
<section class="jokes">
  <JokeSingle v-for="joke in jokes" :joke="joke" />
</section>
</template>

<style scoped>
.jokes {
    border-radius: 10px;
    background: lightgoldenrodyellow;
    padding: 1em;
    margin: 1em;
}
</style>
