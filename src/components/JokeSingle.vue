<script setup lang="ts">
import {computed, ref} from 'vue';
import {usePreferencesStore} from '@/stores/PreferencesStore.ts';
import ButtonActionDislike from '@/components/ButtonActionDislike.vue';
import ButtonActionLike from '@/components/ButtonActionLike.vue';
import type {IJoke} from '@/types/Joke.ts';

const props = defineProps<{
	joke: IJoke
}>();

const preferencesStore = usePreferencesStore();

const backgroundColorOptions = [
	'blue',
	'gold',
	'green',
	'red',
];

const jokeClicked = ref<boolean>(false);

// picks a color based on ID
const jokeColorIndex = computed<number>(() => (props.joke?.id ?? 1) % 4);

const jokeEnableCursor = computed<string>(() => preferencesStore.preferences.clickToRevealPunchline && !jokeClicked.value ? 'cursor-pointer' : '');

const jokeIsDisliked = computed<boolean>(() => (
    preferencesStore.preferences.dislikedJokeIDs && preferencesStore.jokeIsDisliked(props.joke.id))
);

const jokeIsLiked = computed<boolean>(() => (
    preferencesStore.preferences.likedJokeIDs && preferencesStore.jokeIsLiked(props.joke.id))
);

const jokeShowPunchline = computed<boolean>(() => !preferencesStore.preferences.clickToRevealPunchline || jokeClicked.value);
</script>

<template>
<q-card
  bordered
  class="joke"
  :class="[backgroundColorOptions[jokeColorIndex], jokeEnableCursor]"
  flat
  @click.stop="jokeClicked = true"
>
  <q-card-section class="joke-content">
    <div class="setup">{{ joke.setup }}</div>
<!-- TODO: animate appearance -->
    <div class="punchline" v-if="jokeShowPunchline">{{ joke.punchline }}</div>
  </q-card-section>

  <q-separator />

  <q-card-actions>
    <div class="joke-type">{{ joke.type }}</div>
    <q-space />
    <ButtonActionLike
      :toggle-state="jokeIsLiked"
      @click.stop="preferencesStore.addLikedJoke(joke.id)"
    />
    <ButtonActionDislike
      :toggle-state="jokeIsDisliked"
      @click.stop="preferencesStore.addDislikedJoke(joke.id)"
    />
  </q-card-actions>
</q-card>
</template>

<style scoped>
.joke {
    display: flex;
    flex-direction: column;

    border-radius: 10px;
    padding: 0.5em;
    margin: 1em;

    &.blue { background: var(--jester-color-bg-blue); }
    &.gold { background: var(--jester-color-bg-gold); }
    &.green { background: var(--jester-color-bg-green); }
    &.red { background: var(--jester-color-bg-red); }
}

.joke-content {
    flex: 1 0 0;
}

.setup {
    font-weight: bold;
}

.joke-type {
    font-style: italic;
    font-size: smaller;
}
</style>
