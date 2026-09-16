<script setup lang="ts">
import {ref} from 'vue';
import {useBreakpoints} from '@vueuse/core';
import {useJokesStore} from '@/stores/JokesStore.ts';
import type {IJoke, TJokeCategoryToggles} from '@/types/Joke.ts';

const emit = defineEmits<{
	'toggle-category': [state: TJokeCategoryToggles],
	'toggle-liked': [state: boolean],
}>();

const jokesStore = useJokesStore();

const categoryToggles = ref<TJokeCategoryToggles>({});
const likedOnlyToggle = ref<boolean>(false);

const breakpoints = useBreakpoints({
	tablet: 720, // this should match $breakpoint-small
});

const isSmallGlass = breakpoints.smaller(() => 'tablet')

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
<q-expansion-item
  label="Display jokes from the following categories:"
  :default-opened="!isSmallGlass"
>
  <div class="joke-categories-container">
    <q-toggle
      v-for="(_, cat) in categoryToggles"
      :dense="isSmallGlass"
      :key="cat"
      :label="cat.toLocaleUpperCase()"
      :model-value="categoryToggles[cat]"
      :name="cat"
      class="category-toggle"
      @update:model-value="() => toggleCategory(cat)"
    />

    <q-toggle
      color="green"
      :dense="isSmallGlass"
      label="LIKED ONLY"
      :model-value="likedOnlyToggle"
      name="likedOnlyToggle"
      class="category-toggle"
      @update:model-value="toggleLikedOnly"
    />
  </div>
</q-expansion-item>
</template>

<style scoped lang="scss">
.joke-categories-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 5px;
  padding-bottom: 10px;
}

@media screen and (width < $breakpoint-small) {
  .joke-categories-container {
	  gap: 7px;
  }

  .category-toggle {
	  font-size: 10pt;
  }
}
</style>
