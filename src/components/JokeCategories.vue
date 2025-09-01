<script setup lang="ts">
import {ref} from 'vue';
import {useJokesStore} from '@/stores/JokesStore.ts';
import type {IJoke, TJokeCategoryToggles} from '@/types/Joke.ts';

const emit = defineEmits<{
	'category-toggle': [state: TJokeCategoryToggles],
}>();

const jokesStore = useJokesStore();

const categoryToggles = ref<TJokeCategoryToggles>({});

const toggleCategory = (cat: IJoke['type']) => {
	categoryToggles.value[cat] = !categoryToggles.value?.[cat];
	emit('category-toggle', categoryToggles.value);
};

const init = () => {
	jokesStore.jokeTypes.forEach(t => {
		categoryToggles.value[t] = true;
  });

	// allow parent to (un)filter on first load
	emit('category-toggle', categoryToggles.value);
};

init();
</script>

<template>
<div class="joke-categories-container">
  Display jokes from the following categories:
</div>
<div class="joke-categories-container">
  <q-toggle
    v-for="(toggle, cat) in categoryToggles"
    :label="cat.toLocaleUpperCase()"
    :model-value="categoryToggles[cat]"
    :name="cat"
    @update:model-value="() => toggleCategory(cat)"
  />
</div>
</template>

<style scoped>
.joke-categories-container {
    display: flex;
    justify-content: center;
    gap: 5%;
}
</style>
