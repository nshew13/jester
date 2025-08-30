<script setup lang="ts">
import {useJokesStore} from '@/stores/JokesStore.ts';
import JokeSingle from '@/components/JokeSingle.vue';
import {toRaw} from 'vue';

const jokesStore = useJokesStore();
jokesStore.fetchJokes();

console.log('jokesStore.jokes', toRaw(jokesStore.jokes));
console.log('jokesStore.jokesCount', toRaw(jokesStore.jokesCount));
</script>

<template>
<header>
  <img alt="Jester logo" class="logo" src="/jester-logo.png" />
</header>

<main>
  <h1>Jokes</h1>
  <template v-for="joke in jokesStore.jokes">
    <JokeSingle :joke="joke" />
  </template>
</main>
</template>

<style scoped>
.logo {
    display: block;
    margin: 0 auto 2rem;
    width: 200px;
    height: auto;
}

@media (min-width: 1024px) {
}
</style>
