<script setup lang="ts">
import {useJokesStore} from '@/stores/JokesStore.ts';
import {computed, ref} from 'vue';
import JokeList from '@/components/JokeList.vue';
import type {IJoke} from '@/types/Joke.ts';

const jokesStore = useJokesStore();

// TODO: debounce or add delay to allow minimum spin time
const isLoading = computed<boolean>(() => !jokesStore.jokesLoaded);
const jokesPage = ref<IJoke[]>([]);

const getNextPage = () => {
	jokesPage.value = jokesStore.getNextPage();
};

const getPrevPage = () => {
	jokesPage.value = jokesStore.getPrevPage();
};

const init = async () => {
	await jokesStore.init();
	getNextPage();
};

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
    <h2>
      <button
        @click="getPrevPage"
        :disabled="jokesStore.pageCurrent === 1"
      >
        &lt; Prev
      </button>
      Page {{ jokesStore.pageCurrent }} of {{ jokesStore.pageTotal }}
      <button
        @click="getNextPage"
        :disabled="jokesStore.pageCurrent === jokesStore.pageTotal"
      >
        Next &gt;
      </button>
    </h2>

    <JokeList :jokes="jokesPage" />
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
