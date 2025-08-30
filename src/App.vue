<script setup lang="ts">
import {useJokesStore} from '@/stores/JokesStore.ts';
import {computed} from 'vue';
import JokeList from '@/components/JokeList.vue';

const jokesStore = useJokesStore();

const init = async () => {
	await jokesStore.init();
};

// TODO: debounce or add delay to allow minimum spin
const isLoading = computed<boolean>(() => !jokesStore.jokesLoaded);

init();
</script>

<template>
<header>
  <img alt="Jester logo" class="logo" :class="{loading: isLoading}" src="/jester-logo-sq.png" />
</header>

<main>
  <template v-if="isLoading">
    Loading...
  </template>

  <template v-else>
    <h1>{{ jokesStore.jokesCount }} Jokes in {{ jokesStore.jokeTypesCount }} Categories</h1>
    <JokeList :jokes="jokesStore.jokes" />
  </template>
</main>
</template>

<style scoped>
.logo {
    display: block;
    margin: 0 auto 2rem;
    width: 200px;
    height: auto;

    &.loading {
        animation: rotate360 1s linear infinite;
    }
}

@keyframes rotate360 {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

@media (min-width: 1024px) {
}
</style>
