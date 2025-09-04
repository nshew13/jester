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
