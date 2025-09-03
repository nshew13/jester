<script setup lang="ts">
import {ref} from 'vue';
import {useBreakpoints} from '@vueuse/core';
import {SORT_DIRECTION, type TSortDirection} from '@/types/Sort.ts';

defineProps<{
	label: string;
}>();


const breakpoints = useBreakpoints({
	tablet: 720, // this should match $breakpoint-small
});

const isSmallGlass = breakpoints.smaller(() => 'tablet')


const emit = defineEmits<{
	'sort': [direction: TSortDirection],
}>();

const sortDirection = ref<TSortDirection>(SORT_DIRECTION.NONE);

const cycleDirection = () => {
	if (sortDirection.value === SORT_DIRECTION.NONE) {
		sortDirection.value = SORT_DIRECTION.ASC;
	} else if (sortDirection.value === SORT_DIRECTION.ASC) {
		sortDirection.value = SORT_DIRECTION.DESC;
	} else if (sortDirection.value === SORT_DIRECTION.DESC) {
		sortDirection.value = SORT_DIRECTION.NONE;
	}

	emit('sort', sortDirection.value);
};
</script>

<template>
<q-btn
  class="sort-control cursor-pointer"
  :class="{'inactive': sortDirection === SORT_DIRECTION.NONE}"
  no-caps
  :dense="isSmallGlass"
  @click.stop="cycleDirection"
>
  {{ label }}
  <q-icon
    v-if="sortDirection !== SORT_DIRECTION.NONE"
    name="sym_r_sort"
    :class="{'flip-vertical': sortDirection === SORT_DIRECTION.ASC}"
  />
</q-btn>
</template>

<style scoped>
.sort-control {
    min-width: 75px;
    margin: 0 10px;

    &:not(.inactive) {
        font-weight: bold;
    }
}
</style>
