<script setup lang="ts">
import {computed, ref} from 'vue';
import {usePreferencesStore} from '@/stores/PreferencesStore.ts';
import ButtonActionDislike from '@/components/ButtonActionDislike.vue';
import ButtonActionLike from '@/components/ButtonActionLike.vue';
import type {IJoke} from '@/types/Joke.ts';

const RE_WORD_BOUNDARY = /\b/;

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

const jokePunchlineWords = ref<string[]>([]);
const jokeWasClicked = ref<boolean>(false);

// picks a color based on ID
const jokeColorIndex = computed<number>(() => (props.joke?.id ?? 1) % 4);

const jokeEnableCursor = computed<string>(() => preferencesStore.preferences.optClickToRevealPunchline && !jokeWasClicked.value ? 'cursor-pointer' : '');

const jokeIsDisliked = computed<boolean>(() => (
    preferencesStore.preferences.dislikedJokeIDs && preferencesStore.jokeIsDisliked(props.joke.id)
));

const jokeIsLiked = computed<boolean>(() => (
    preferencesStore.preferences.likedJokeIDs && preferencesStore.jokeIsLiked(props.joke.id)
));

/**
 * punchline can show if "click to reveal" is not enabled (always show) or the joke has been clicked
 */
const jokePunchlineCanShow = computed<boolean>(() => !preferencesStore.preferences.optClickToRevealPunchline || jokeWasClicked.value);

/**
 * punchline is animated if "click to reveal" is enabled and the joke has been clicked
 */
const jokePunchlineIsAnimated = computed<boolean>(() => preferencesStore.preferences.optClickToRevealPunchline && jokeWasClicked.value);

const onClickJoke = () => {
	jokeWasClicked.value = true;
	if (jokePunchlineIsAnimated.value) {
		// no need for timeouts if not animating
	  const words = props.joke.punchline.split(RE_WORD_BOUNDARY);
	  words.forEach((word, index) => {
		  setTimeout(() => jokePunchlineWords.value.push(word), 50 * index);
    });
  }
};
</script>

<template>
<q-card
  bordered
  class="joke-single"
  :class="[backgroundColorOptions[jokeColorIndex], jokeEnableCursor]"
  flat
  @click.stop="onClickJoke"
>
  <q-card-section class="joke-single-content">
    <div class="joke-setup">{{ joke.setup }}</div>

    <template v-if="jokePunchlineCanShow">
      <!-- animate appearance one word at a time -->
      <TransitionGroup v-if="jokePunchlineIsAnimated" name="word">
        <span
          v-for="(word, index) in jokePunchlineWords"
          :key="index"
          class="joke-punchline"
        >
          {{ word }}
        </span>
      </TransitionGroup>

      <div v-else class="joke-punchline">{{ joke.punchline }}</div>
    </template>
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
.joke-single {
    display: flex;
    flex-direction: column;

    border-radius: 15px;
    padding: 0.5em;
    margin: 1em;

    &.blue { background: var(--jester-color-bg-blue); }
    &.gold { background: var(--jester-color-bg-gold); }
    &.green { background: var(--jester-color-bg-green); }
    &.red { background: var(--jester-color-bg-red); }
}

.joke-single-content {
    flex: 1 0 0;
}

.joke-setup {
    font-weight: bold;
}

.word-enter-active,
.word-leave-active {
    transition: opacity 750ms ease;
}

.word-enter-from,
.word-leave-to {
    opacity: 0;
}

.word-enter-to,
.word-leave-from {
    opacity: 1;
}

.joke-type {
    font-style: italic;
    font-size: smaller;
}
</style>
