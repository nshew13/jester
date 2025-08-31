import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import type {IJoke} from '@/types/Joke.ts';

export const useJokesStore = defineStore('jokes', () => {
	const jokes = ref<IJoke[]>([]);
	const jokesLoaded = ref<boolean>(false);
	const pageLastOffset = ref<number>(0);
	const pageSize = ref<number>(10);

	const jokeTypes = computed<Array<IJoke['type']>>(() => {
		const types: Set<IJoke['type']> = new Set();

		jokes.value.forEach((j, index) => {
			types.add(j.type);
			// while we're looping, go ahead and set/store ID
			j.id = index;
		});

		return Array.from(types);
	});

	const jokesCount = computed<number>(() => jokes.value.length);

	const jokeTypesCount = computed<number>(() => jokeTypes.value.length);

	const pageCurrent = computed<number>(() => {
		return pageLastOffset.value / pageSize.value;
	});

	const pageTotal = computed<number>(() => {
		return Math.ceil(jokes.value.length / pageSize.value);
	});

	/**
	 * @private
	 * @param offset
	 */
	const getPage = (offset = 0): IJoke[] => {
		pageLastOffset.value = offset + pageSize.value;
		return jokes.value.slice(offset, pageLastOffset.value);
	};

	const getNextPage = () => {
		if (pageLastOffset.value < jokes.value.length - 1) {
			return getPage(pageLastOffset.value);
		}
		return [];
	};

	const getPrevPage = () => {
		// initial values are safe: 0 !>= 10
		if (pageLastOffset.value >= pageSize.value) {
			/*
			 * getPage always moves "forward" by (offset + pageSize). Since
			 * pageLastOffset always points to the end of the current/beginning
			 * of the next page, when going in reverse, we need to start the slice
			 * back two page lengths to get the previous page. In other words,
			 * subtracting only one page will give us the current slice again.
			 */
			const prevPageOffset = pageLastOffset.value - pageSize.value * 2;
			return  getPage(prevPageOffset);
		}
		return [];
	};

	// const setPageSize = (size: number) => {
	// 	pageSize.value = size;
	// };

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

	return {
		// state
		jokes,
		jokesLoaded,
		pageLastOffset,
		pageSize,

		// getters
		jokeTypes,
		jokeTypesCount,
		jokesCount,
		pageCurrent,
		pageTotal,

		// actions
		getNextPage,
		getPrevPage,
		init,
	};
});
