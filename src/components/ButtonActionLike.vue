<script setup lang="ts">
import ButtonActionBase from '@/components/ButtonActionBase.vue';

defineProps<{
	toggleState: boolean;
}>();
</script>

<template>
<ButtonActionBase
  icon-name="thumb_up"
  :toggle-state="toggleState"
  @click.stop="$emit('click', $event)"
/>
</template>

<style scoped>
</style>
