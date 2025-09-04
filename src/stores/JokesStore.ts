import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import type {IJoke} from '@/types/Joke.ts';

const TYPE_GENERAL = 'general';
const RE_NOT_ALPHANUM_SPACE = /[^A-Za-z0-9 \-]+/g;

export const useJokesStore = defineStore('jokes', () => {
	const jokeTypes = ref<Array<IJoke['type']>>([]);
	const jokes = ref<IJoke[]>([]);
	const jokesLoaded = ref<boolean>(false);
	const pageLastOffset = ref<number>(0);
	const pageSize = ref<number>(10);

	const jokesCount = computed<number>(() => jokes.value.length);

	const jokeTypesCount = computed<number>(() => jokeTypes.value.length);

	const pageCurrent = computed<number>(() => {
		return pageLastOffset.value / pageSize.value;
	});

	const pageTotal = computed<number>(() => {
		return Math.ceil(jokes.value.length / pageSize.value);
	});

	// /**
	//  * @private
	//  * @param offset
	//  */
	// const getPage = (offset = 0): IJoke[] => {
	// 	pageLastOffset.value = offset + pageSize.value;
	// 	return jokes.value.slice(offset, pageLastOffset.value);
	// };
	//
	// const getNextPage = () => {
	// 	if (pageLastOffset.value < jokes.value.length - 1) {
	// 		return getPage(pageLastOffset.value);
	// 	}
	// 	return [];
	// };
	//
	// const getPrevPage = () => {
	// 	// initial values are safe: 0 !>= 10
	// 	if (pageLastOffset.value >= pageSize.value) {
	// 		/*
	// 		 * getPage always moves "forward" by (offset + pageSize). Since
	// 		 * pageLastOffset always points to the end of the current/beginning
	// 		 * of the next page, when going in reverse, we need to start the slice
	// 		 * back two page lengths to get the previous page. In other words,
	// 		 * subtracting only one page will give us the current slice again.
	// 		 */
	// 		const prevPageOffset = pageLastOffset.value - pageSize.value * 2;
	// 		return  getPage(prevPageOffset);
	// 	}
	// 	return [];
	// };
	//
	// const setPageSize = (size: number) => {
	// 	pageSize.value = size;
	// };

	const loadJokes = async (): Promise<void> => {
		const response = await fetch('https://raw.githubusercontent.com/15Dkatz/official_joke_api/refs/heads/master/jokes/index.json');
		if (!response.ok) {
			throw new Error(`fetchJokes status: ${response.status}`);
		}

		const dataJokes: IJoke[] = await response.json();

		// add the ID to the model and create `searchString`
		dataJokes.map((joke: IJoke, index: number) => {
			joke.id = index;

			const setupPlain = joke.setup.replace(RE_NOT_ALPHANUM_SPACE, '');
			joke.searchString = setupPlain.toLocaleLowerCase();
		});

		/*
		 * sort jokes by type
		 *
		 * Use the index of the sorted types to sort the jokes, themselves.
		 * There's no need to sort if we have only one type.
		 *
		 * It should be OK to sort in place here (rather than use toSorted),
		 * since dataJokes was just created above.
		 */
		if (jokeTypes.value.length > 1) {
			dataJokes.sort((a: IJoke, b: IJoke) => {
				const sortValueA = jokeTypes.value.indexOf(a.type);
				const sortValueB = jokeTypes.value.indexOf(b.type);

				if (sortValueA < sortValueB) {
					return -1;
				}
				if (sortValueA > sortValueB) {
					return 1;
				}

				// this should maintain original array order (ID order) within a type
				return 0;
			});
		}

		jokes.value = dataJokes;
	}

	const loadTypes = async (): Promise<void> => {
		const response = await fetch('https://official-joke-api.appspot.com/types');
		if (!response.ok) {
			throw new Error(`loadTypes status: ${response.status}`);
		}

		const dataTypes = await response.json();

		// sort joke types
		const types = dataTypes.toSorted();

		// let's treat TYPE_GENERAL as the earliest type
		const indexGeneral = types.indexOf(TYPE_GENERAL);
		if (indexGeneral > 0) {
			const el = types.splice(indexGeneral, 1);
			types.unshift(...el);
		}

		jokeTypes.value = types;
	}

	const init = async () => {
		try {
			jokesLoaded.value = false;

			await loadTypes();
			await loadJokes();

			jokesLoaded.value = true;
		} catch (error) {
			console.error((error as Error)?.message ?? 'Unknown error');
		}
	};

	return {
		// state
		jokeTypes,
		jokes,
		jokesLoaded,
		pageLastOffset,
		pageSize,

		// computed
		jokeTypesCount,
		jokesCount,
		pageCurrent,
		pageTotal,

		// actions
		init,
	};
});
