import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import type {IJoke} from '@/types/Joke.ts';

export const useJokesStore = defineStore('jokes', () => {
	const jokes = ref<IJoke[]>([]);
	const jokesCount = computed<number>(() => jokes.value.length);

	const fetchJokes = async () => {
		try {
			// TODO: fetch is browser-only
			const response = await fetch('https://official-joke-api.appspot.com/jokes/ten');
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}

			jokes.value = await response.json();
		} catch (error) {
			console.error((error as Error)?.message ?? 'Unknown error');
		}
	};

	return {
		fetchJokes,
		jokes,
		jokesCount,
	};
});
