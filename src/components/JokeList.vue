<script setup lang="ts">
import {computed, ref} from 'vue';
import JokeSingle from '@/components/JokeSingle.vue';
import type {IJoke} from '@/types/Joke.ts';
import type {QTableProps} from 'quasar';

const props = defineProps<{
	jokes: IJoke[]
}>();

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

const searchResults = computed<IJoke[]>(() => {
	const searchStringLC = searchString.value.toLocaleLowerCase();

	// TODO: to improve performance, we could store a LC'd `searchString` value on IJoke,
	//       which could include punchline (etc.)
	return props.jokes.filter(j => j.setup.toLocaleLowerCase().includes(searchStringLC));
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
  :rows="searchResults"
  wrap-cells
>
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

  <template v-slot:item="props">
    <JokeSingle :joke="props.row" />
  </template>
</q-table>
</template>

<style scoped>
.joke-list {
    overflow: auto;
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
