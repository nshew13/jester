<script setup lang="ts">
defineProps<{
	toggleState: boolean;
	iconName: string;
}>();
</script>

<template>
<q-btn
  class="button-action-base"
  flat
  @click.stop="$emit('click', $event)"
>
  <q-icon
    class="button-action-base-icon"
    :class="{'enabled': toggleState}"
    :name="`sym_r_${iconName}`"
    :title="iconName"
  />
</q-btn>
</template>

<style scoped>
.button-action-base-icon {
    opacity: 0.2;

    &.enabled {
        opacity: 1;
    }
}
</style>
