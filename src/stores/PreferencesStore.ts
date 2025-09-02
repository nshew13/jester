import {defineStore} from 'pinia';
import {ref} from 'vue';
import {useStorage, type RemovableRef} from '@vueuse/core';
import type {IJoke} from '@/types/Joke.ts';
import type {IPreference} from '@/types/Preference.ts';

const STORE_NAME = 'jester_preferences';

export const usePreferencesStore = defineStore(STORE_NAME, () => {
	const preferences = ref<RemovableRef<IPreference>>(
		useStorage(
			STORE_NAME,
			{
				dislikedJokeIDs: new Set<IJoke['id']>(),
				likedJokeIDs: new Set<IJoke['id']>(),
				optClickToRevealPunchline: false,
				optHideDisliked: false,
			},
			localStorage,
			{
				// we need a custom serializer to use Sets
				// TODO: Are we losing any advantages of Sets (including simplicity) by constantly converting to/from Arrays?
				serializer: {
					read: (state: string) => {
						const obj = JSON.parse(state)

						let dislikedJokeIDs: Set<IJoke['id']>;
						if (typeof obj.dislikedJokeIDs[Symbol.iterator] === 'function') {
							dislikedJokeIDs = new Set<IJoke['id']>(obj.dislikedJokeIDs);
						} else {
							dislikedJokeIDs = new Set<IJoke['id']>();
						}

						let likedJokeIDs: Set<IJoke['id']>;
						if (typeof obj.likedJokeIDs[Symbol.iterator] === 'function') {
							likedJokeIDs = new Set<IJoke['id']>(obj.likedJokeIDs);
						} else {
							likedJokeIDs = new Set<IJoke['id']>();
						}

						return {
							...obj,
							dislikedJokeIDs,
							likedJokeIDs,
						}
					},
					write: (state: IPreference) => JSON.stringify({
						...state,
						dislikedJokeIDs: [...state.dislikedJokeIDs],
						likedJokeIDs: [...state.likedJokeIDs],
					}),
				}
			}
		),
	);

	const addDislikedJoke = (jokeID: IJoke['id']) => {
		// first, remove from liked, if present
		preferences.value.likedJokeIDs.delete(jokeID);
		preferences.value.dislikedJokeIDs.add(jokeID);
	};

	const addLikedJoke = (jokeID: IJoke['id']) => {
		// first, remove from disliked, if present
		preferences.value.dislikedJokeIDs.delete(jokeID);
		preferences.value.likedJokeIDs.add(jokeID);
	};

	const jokeIsDisliked = (jokeID: IJoke['id']) => preferences.value.dislikedJokeIDs?.has(jokeID);

	const jokeIsLiked = (jokeID: IJoke['id']) => preferences.value.likedJokeIDs?.has(jokeID);

	const toggleClickToRevealPunchline = () => {
		preferences.value.optClickToRevealPunchline = !preferences.value.optClickToRevealPunchline;
	};

	const toggleHideDisliked = () => {
		preferences.value.optHideDisliked = !preferences.value.optHideDisliked;
	};

	return {
		// state
		preferences,

		// computed

		// actions
		addDislikedJoke,
		addLikedJoke,
		jokeIsDisliked,
		jokeIsLiked,
		toggleClickToRevealPunchline,
		toggleHideDisliked,
	};
});
