import {defineStore} from 'pinia';
import {ref} from 'vue';
import {useStorage, type RemovableRef} from '@vueuse/core';
import type {IPreference} from '@/types/Preference.ts';

const STORE_NAME = 'preferences';

export const usePreferencesStore = defineStore(STORE_NAME, () => {
	const preferences = ref<RemovableRef<IPreference>>(
		useStorage(STORE_NAME, {
			clickToRevealPunchline: false,
		}),
	);

	const toggleClickToRevealPunchline = () => {
		preferences.value.clickToRevealPunchline = !preferences.value.clickToRevealPunchline;
	};

	return {
		// state
		preferences,

		// getters

		// actions
		toggleClickToRevealPunchline,
	};
});
