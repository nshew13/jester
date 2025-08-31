<script setup lang="ts">
import {useJokesStore} from '@/stores/JokesStore.ts';
import {computed} from 'vue';
import JokeList from '@/components/JokeList.vue';

const jokesStore = useJokesStore();

// TODO: debounce or add delay to allow minimum spin time
const isLoading = computed<boolean>(() => !jokesStore.jokesLoaded);

const init = async () => {
	await jokesStore.init();
	jokesStore.getNextPage();
};

init();
</script>

<template>
<div class="page-container">
  <header :class="{loading: isLoading}">
    <img alt="Jester logo" class="logo" src="/jester-logo-sq.png" />
    <template v-if="isLoading">
      Loading...
    </template>
  </header>

  <JokeList v-if="!isLoading" :jokes="jokesStore.jokes" />
</div>
</template>

<style scoped>
.page-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

header {
    display: flex;
    flex-direction: column;

    &.loading {
        flex: 1 0 0;
        align-items: center;
        justify-content: center;

        .logo {
            animation: rotate360 1s linear infinite;
        }
    }
}

.logo {
    display: block;
    margin: 0 auto 2rem;
    width: 200px;
    height: auto;
}

@keyframes rotate360 {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.joke-list {
    overflow: auto;
    flex: 1 0 0;
}
</style>
