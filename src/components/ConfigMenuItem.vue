<script setup lang="ts">
defineProps<{
	checkedWhen: boolean;
	itemText: string;
}>();

</script>

<template>
<q-item
  clickable
  @click.self="($event) => { console.log('click!'); $emit('click', $event); }"
>
  <q-item-section>
    <div>
      <!-- We don't want to use v-if because Quasar won't reserve the space for the checkmark -->
      <q-icon
        :class="{'invisible': !checkedWhen}"
        name="sym_r_done"
      />
      {{ itemText }}
    </div>
  </q-item-section>
</q-item>
</template>

<style scoped>
:deep(.q-item__section) {
    white-space: nowrap;
}
</style>
