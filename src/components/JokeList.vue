<script setup lang="ts">
import {ref, watch} from 'vue';
import {useBreakpoints} from '@vueuse/core';
import JokeSingle from '@/components/JokeSingle.vue';
import SortControl from '@/components/SortControl.vue';
import {SORT_DIRECTION, type TSortDirection} from '@/types/Sort.ts';
import type {IJoke} from '@/types/Joke.ts';
import type {QTableProps} from 'quasar';

const props = defineProps<{
	jokes: IJoke[]
}>();

const breakpoints = useBreakpoints({
	tablet: 720, // this should match $breakpoint-small
});

const isSmallGlass = breakpoints.smaller(() => 'tablet')


const columnsDef: QTableProps['columns'] = [
	{
		name: 'type',
		label: 'Category',
		field: 'type',
		align: 'left',
		sortable: true,
	},
	{
		name: 'setup',
		label: 'Setup',
		field: 'setup',
		align: 'left',
		style: 'font-weight: bold;',
	},
	{
		name: 'punchline',
		label: 'Punchline',
		field: 'punchline',
		align: 'left',
	},
];

/*
 * Initializing this to the prop should be fine. We can
 * assume the search input is empty and that the default
 * sort of NONE won't have made a difference.
 */
const jokesToDisplay = ref<IJoke[]>(props.jokes);
const searchString = ref<string>('');
const sortDirectionSetup = ref<TSortDirection>(SORT_DIRECTION.NONE);


const searchByString = (jokesToSort: IJoke[]): IJoke[] => {
  const searchStringLC = searchString.value.toLocaleLowerCase();
  return jokesToSort.filter(j => j?.searchString.includes(searchStringLC) ?? false);
};

const sortByJokeSetup = (jokesToSort: IJoke[]): IJoke[] => {
	const sortLT = sortDirectionSetup.value === SORT_DIRECTION.ASC ? -1 : 1;
	const sortGT = sortDirectionSetup.value === SORT_DIRECTION.ASC ? 1 : -1;

	if (sortDirectionSetup.value === SORT_DIRECTION.NONE) {
	  return jokesToSort;
	}

	return jokesToSort.toSorted((a: IJoke, b: IJoke) => {
		if (a?.searchString < b?.searchString) {
			return sortLT;
		}
		if (a?.searchString > b?.searchString) {
			return sortGT;
		}

		return 0;
	});
};


watch([() => props.jokes, searchString, sortDirectionSetup], () => {
	const searchResults = searchByString(props.jokes);
	jokesToDisplay.value = sortByJokeSetup(searchResults);
}, {immediate: true});
</script>

<template>
<q-table
  card-class="joke-card"
  class="joke-list"
  :columns="columnsDef"
  grid
  row-key="id"
  :rows-per-page-options="[10, 20, 50, 100]"
  :rows="jokesToDisplay"
  wrap-cells
>
  <!-- sort controls -->
  <template v-slot:top-left>
    <div>
      Sort by:<br v-if="isSmallGlass" />
      <SortControl label="Setup" @sort="(sortDirection: TSortDirection) => sortDirectionSetup = sortDirection" />
    </div>
  </template>

  <!-- search field -->
  <template v-slot:top-right>
    <q-input
      outlined
      rounded
      dense
      debounce="300"
      v-model="searchString"
      placeholder="Search"
      name="search"
    >
      <template v-slot:append>
        <q-icon name="sym_r_search" />
      </template>
    </q-input>
  </template>

  <!-- no data -->
  <template v-slot:no-data>
    <div class="no-data">
      No jokes found. Try adjusting your filters or search.
      <img class="no-data-image" alt="bomb" src="/bomb-960_720.png" />
    </div>
  </template>

  <!-- data -->
  <template v-slot:item="props">
    <JokeSingle :joke="props.row" />
  </template>
</q-table>
</template>

<style scoped>
.joke-list {
    overflow: auto;
}

.no-data {
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 16px;
}

.no-data-image {
    width: 200px;
    height: auto;
}

:deep(.q-table__bottom) {
    position: sticky;
    bottom: 0;
    background-color: rgba(255 255 255 / 0.8);
}

:deep(.q-table__grid-content) {
    /* by default, these will stretch */
    align-items: flex-start;
}
</style>
