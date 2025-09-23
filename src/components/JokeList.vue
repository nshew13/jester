<script setup lang="ts">
import {computed, ref} from 'vue';
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

const isSmallGlass = breakpoints.smaller(() => 'tablet');


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

const searchString = ref<string>('');
const sortDirectionSetup = ref<TSortDirection>(SORT_DIRECTION.NONE);

const jokesToDisplay = computed<IJoke[]>(() => {
	let results = props.jokes.slice(); // assign as a copy

	if (searchString.value) {
		const searchTerm = searchString.value.toLocaleLowerCase();
		results = results.filter(j => j.searchString.includes(searchTerm));
	}

	if (sortDirectionSetup.value !== SORT_DIRECTION.NONE) {
		const sortLT = sortDirectionSetup.value === SORT_DIRECTION.ASC ? -1 : 1;
		const sortGT = sortDirectionSetup.value === SORT_DIRECTION.ASC ? 1 : -1;

		return results.sort((a: IJoke, b: IJoke) => {
			if (a?.searchString < b?.searchString) {
				return sortLT;
			}
			if (a?.searchString > b?.searchString) {
				return sortGT;
			}

			return 0;
		});
	}

	return results;
});

/*
 * There's an issue in the JokeList > [JokeSingle] setup, probably caused by
 * filtering records outside QTable. As a result, if we reveal, for example,
 * the punchline of the fourth joke, then change the filters so that a
 * different joke is now in the fourth position, the new fourth will still
 * show the revealed punchline of the original fourth. In other words, the
 * fourth JokeSingle component maintains its internal state despite changes
 * to its `joke` prop.
 *
 * To fix this, we can add a key to force the QTable to re-render. The length
 * of the jokes list, alone, is unlikely to be sufficiently unique (e.g., if
 * two categories have the same number of jokes). While still not bullet-proof,
 * a concatenation of the length with the first joke's setup should be sufficient
 * for this exercise.
 *
 * As a consequence, all JokeSingles will lose their state whenever this key
 * is updated. The same happens if each JokeSingle is, instead, configured to
 * watch its props for changes.
 */
const tableKey = computed<string>(() => `${jokesToDisplay.value.length}${jokesToDisplay.value?.[0]?.searchString ?? 'empty'}`);
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
  :key="tableKey"
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
      clearable
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
