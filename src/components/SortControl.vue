<script setup lang="ts">
import {useBreakpoints} from '@vueuse/core';
import {SORT_DIRECTION, type TSortDirection} from '@/types/Sort.ts';

defineProps<{
	label: string;
}>();

const sortDirection = defineModel<TSortDirection>({ default: SORT_DIRECTION.NONE });

const breakpoints = useBreakpoints({
	tablet: 720, // this should match $breakpoint-small
});

const isSmallGlass = breakpoints.smaller(() => 'tablet')


const cycleDirection = () => {
  if (sortDirection.value === SORT_DIRECTION.NONE) {
		sortDirection.value = SORT_DIRECTION.ASC;
	} else if (sortDirection.value === SORT_DIRECTION.ASC) {
		sortDirection.value = SORT_DIRECTION.DESC;
	} else if (sortDirection.value === SORT_DIRECTION.DESC) {
		sortDirection.value = SORT_DIRECTION.NONE;
	}
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

<style scoped lang="scss">
.sort-control {
    min-width: 75px;
    margin: 0 10px;

    @media screen and (width < $breakpoint-small) {
      margin: 0;
    }

    &:not(.inactive) {
        font-weight: bold;
    }
}
</style>
