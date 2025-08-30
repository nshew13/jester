import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import type {IJoke} from '@/types/Joke.ts';

export const useJokesStore = defineStore('jokes', () => {
	const jokes = ref<IJoke[]>([]);
	const jokesLoaded = ref<boolean>(false);

	const jokesCount = computed<number>(() => jokes.value.length);

	const jokeTypes = computed<Set<IJoke['type']>>(() => {
		const types = new Set();

		jokes.value.forEach(j => {
			types.add(j.type);
		});

		return types;
	});

	const jokeTypesCount = computed<number>(() => jokeTypes.value.size);

	const init = async () => {
		try {
			jokesLoaded.value = false;
			const response = await fetch('https://raw.githubusercontent.com/15Dkatz/official_joke_api/refs/heads/master/jokes/index.json');
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}

			jokes.value = await response.json();
			jokesLoaded.value = true;
		} catch (error) {
			console.error((error as Error)?.message ?? 'Unknown error');
		}
	};

	// const fetchRandomJoke = async (): PromiseLike<IJoke> => {
	// 	try {
	// 		const response = await fetch('https://official-joke-api.appspot.com/jokes/random');
	// 		if (!response.ok) {
	// 			throw new Error(`Response status: ${response.status}`);
	// 		}
	//
	// 		return await response.json();
	// 	} catch (error) {
	// 		console.error((error as Error)?.message ?? 'Unknown error');
	// 	}
	// };

	return {
		init,
		jokeTypes,
		jokeTypesCount,
		jokes,
		jokesCount,
		jokesLoaded,
	};
});
