<script setup lang="ts">
import {useJokesStore} from '@/stores/JokesStore.ts';
import {computed, ref} from 'vue';
import JokeList from '@/components/JokeList.vue';
import JokeCategories from '@/components/JokeCategories.vue';
import type {IJoke, TJokeCategoryToggles} from '@/types/Joke.ts';

const jokesStore = useJokesStore();

const filterCategories = ref<Array<IJoke['type']>>([]);

const filteredList = computed<IJoke[]>(() =>
	jokesStore.jokes.filter(j => filterCategories.value.includes(j.type))
);

// TODO: debounce or add delay to allow minimum spin time
const isLoading = computed<boolean>(() => !jokesStore.jokesLoaded);

const updateFilter = (toggleArray: TJokeCategoryToggles) => {
	filterCategories.value = Object.keys(toggleArray).filter(cat => toggleArray[cat]);
};

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
    <!-- TODO: error message -->
    <JokeCategories
      v-else
      @category-toggle="updateFilter"
    />
  </header>

  <JokeList v-if="!isLoading" :jokes="filteredList" />
</div>
</template>

<style scoped>
.page-container {
    display: flex;
    flex-direction: column;
    /* TODO: Don't stretch single (or few) row to full height */
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

/* TODO: mask/clip when not :not(.loading) */
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
