<script setup lang="ts">
import {computed, ref} from 'vue';
import {useJokesStore} from '@/stores/JokesStore.ts';
import {usePreferencesStore} from '@/stores/PreferencesStore.ts';
import ConfigMenu from '@/components/ConfigMenu.vue';
import JokeList from '@/components/JokeList.vue';
import JokeCategories from '@/components/JokeCategories.vue';
import type {IJoke, TJokeCategoryToggles} from '@/types/Joke.ts';

const jokesStore = useJokesStore();
const preferencesStore = usePreferencesStore();

const filterCategories = ref<Array<IJoke['type']>>([]);
const filterLiked = ref<boolean>(false);

const filteredList = computed<IJoke[]>(() => {
	// shortcut
	const hideDisliked = preferencesStore.preferences.optHideDisliked;

	return jokesStore.jokes.filter(j => {
		const filterCategory = filterCategories.value.includes(j.type);

		if (filterLiked.value) {
			const filterLikedOnly = filterLiked.value && preferencesStore.preferences.likedJokeIDs.has(j.id);
			return filterCategory && filterLikedOnly;
		}

		const filterHideDisliked = hideDisliked && preferencesStore.preferences.dislikedJokeIDs.has(j.id);

		return filterCategory && !filterHideDisliked;
	});
});

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
<div class="app-container">
  <ConfigMenu />

  <header class="app-header" :class="{loading: isLoading}">
    <div class="brand">
      <img alt="Jester logo" class="logo" src="/jester-logo-sq.png" />
      <span class="font-diner-swanky-regular">Jester</span>
    </div>

    <template v-if="isLoading">
      Loading...
    </template>
    <!-- TODO: error message -->
    <JokeCategories
      v-else
      @toggle-category="updateFilter"
      @toggle-liked="(state: boolean) => { filterLiked = state }"
    />
  </header>

  <JokeList v-if="!isLoading" :jokes="filteredList" />
</div>
</template>

<style scoped>
.app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.app-header {
    display: flex;
    flex-direction: column;

    padding-bottom: 1rem;
    box-shadow: rgba(0 0 0 / 0.2) 0 2px 8px 0;

    &.loading {
        flex: 1 0 0;
        align-items: center;
        justify-content: center;

        .logo {
            display: block;
            animation: rotate360 1s linear infinite;
        }
    }
}

.brand {
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 28pt;
}

.logo {
    display: block;
    margin: 0 1rem 0 0;
    width: 200px;
    height: auto;
}

@keyframes rotate360 {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
</style>
