<script setup lang="ts">
import {ref} from 'vue';
import {useJokesStore} from '@/stores/JokesStore.ts';
import type {IJoke, TJokeCategoryToggles} from '@/types/Joke.ts';

const emit = defineEmits<{
	'toggle-category': [state: TJokeCategoryToggles],
	'toggle-liked': [state: boolean],
}>();

const jokesStore = useJokesStore();

const categoryToggles = ref<TJokeCategoryToggles>({});
const likedOnlyToggle = ref<boolean>(false);

const toggleCategory = (cat: IJoke['type']) => {
	categoryToggles.value[cat] = !categoryToggles.value?.[cat];
	emit('toggle-category', categoryToggles.value);
};

const toggleLikedOnly = () => {
	likedOnlyToggle.value = !likedOnlyToggle.value;
	emit('toggle-liked', likedOnlyToggle.value);
};

const init = () => {
	jokesStore.jokeTypes.forEach(t => {
		categoryToggles.value[t] = true;
  });

	// allow parent to (un)filter on first load
	emit('toggle-category', categoryToggles.value);
	emit('toggle-liked', likedOnlyToggle.value);
};

init();
</script>

<template>
<div class="joke-categories-container">
  Display jokes from the following categories:
</div>
<div class="joke-categories-container">
  <q-toggle
    v-for="(_, cat) in categoryToggles"
    :key="cat"
    :label="cat.toLocaleUpperCase()"
    :model-value="categoryToggles[cat]"
    :name="cat"
    class="category-toggle"
    @update:model-value="() => toggleCategory(cat)"
  />

  <q-toggle
    color="green"
    label="LIKED ONLY"
    :model-value="likedOnlyToggle"
    name="likedOnlyToggle"
    class="category-toggle"
    @update:model-value="toggleLikedOnly"
  />
</div>
</template>

<style scoped lang="scss">
.joke-categories-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

@media screen and (width < $breakpoint-small) {
  .joke-categories-container {
	  gap: 5px;
  }

  .category-toggle {
	  font-size: 10pt;
  }
}
</style>
