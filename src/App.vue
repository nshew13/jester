<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import {debounce} from 'quasar';
import {useJokesStore} from '@/stores/JokesStore.ts';
import {usePreferencesStore} from '@/stores/PreferencesStore.ts';
import BrandLogo from '@/components/BrandLogo.vue';
import ConfigMenu from '@/components/ConfigMenu.vue';
import JokeList from '@/components/JokeList.vue';
import JokeCategories from '@/components/JokeCategories.vue';
import type {IJoke, TJokeCategoryToggles} from '@/types/Joke.ts';

const jokesStore = useJokesStore();
const preferencesStore = usePreferencesStore();

/**
 * array of joke types to display or hide
 */
const filterCategories = ref<Array<IJoke['type']>>([]);
/**
 * toggle to show only liked jokes
 */
const filterLiked = ref<boolean>(false);
const isLoading = ref<boolean>(true);

const filteredList = computed<IJoke[]>(() => {
	// short-circuit if states not ready
	if (jokesStore.jokes.length === 0 || filterCategories.value.length === 0) {
		return [];
  }

	return jokesStore.jokes.filter(j => {
	  /*
     * If the category filter fails, we can stop there. Dis/likes
     * won't make a difference.
	   */
		if (!filterCategories.value.includes(j.type)) {
			return false;
    }

	  // If we want to display only liked jokes, check this joke's status.
		if (filterLiked.value) {
			return preferencesStore.preferences.likedJokeIDs.has(j.id);
		}

	  /*
     * A joke can't be both liked and disliked. If we made it this far,
     * see if the user opted to hide disliked jokes.
	   */
	  return !(
		  preferencesStore.preferences.optHideDisliked &&
		  preferencesStore.preferences.dislikedJokeIDs.has(j.id)
	  );
	});
});

const jokesLoaded = computed<boolean>(() => jokesStore.jokesLoaded);

const updateFilter = (toggleArray: TJokeCategoryToggles) => {
	filterCategories.value = Object.keys(toggleArray).filter(cat => toggleArray[cat]);
};

// debounce adds a minimum spin time, to avoid a flash
const debouncedLoading = debounce(() => isLoading.value = !jokesStore.jokesLoaded, 500);
watch(jokesLoaded, debouncedLoading);

const init = () => {
	jokesStore.init().then();
};

init();
</script>

<template>
<div class="app-container">
  <ConfigMenu />

  <header class="app-header" :class="{loading: isLoading}">
    <BrandLogo :animate="isLoading" />

    <template v-if="isLoading">
      Loading...
    </template>

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
    width: 100vw;
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
    }
}
</style>
