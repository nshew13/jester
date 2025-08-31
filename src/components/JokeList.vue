<script setup lang="ts">
import type {IJoke} from '@/types/Joke.ts';
import JokeSingle from '@/components/JokeSingle.vue';
import type {QTableProps} from 'quasar';
import {computed} from 'vue';
import {useJokesStore} from '@/stores/JokesStore.ts';

defineProps<{
	jokes: IJoke[]
}>();

const jokesStore = useJokesStore();
const jokeTypesCount = computed<number>(() => jokesStore.jokeTypesCount);

const paginationLabel = (firstRowIndex: number, endRowIndex: number, totalRowsNumber: number) => {
	return `Showing jokes ${firstRowIndex}-${endRowIndex} of ${totalRowsNumber} in ${jokeTypesCount.value} Categories`;
};

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
		// classes: 'setup',
		style: 'font-weight: bold;',
	},
	{
		name: 'punchline',
		label: 'Punchline',
		field: 'punchline',
		align: 'left',
	},
];
</script>

<template>
<q-table
  card-class="joke-card"
  class="joke-list"
  :columns="columnsDef"
  grid
  :pagination-label="paginationLabel"
  row-key="id"
  :rows-per-page-options="[10, 20, 50, 100]"
  :rows="jokes"
  wrap-cells
>
  <template v-slot:item="props">
    <JokeSingle :joke="props.row" />
  </template>
</q-table>
</template>

<style scoped>
:deep(.q-table__bottom) {
    position: sticky;
    bottom: 0;
    background-color: rgba(255 255 255 / 0.8);
}
</style>
