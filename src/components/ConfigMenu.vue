<script setup lang="ts">
import {usePreferencesStore} from '@/stores/PreferencesStore.ts';
import ConfigMenuItem from '@/components/ConfigMenuItem.vue';

const preferencesStore = usePreferencesStore();
</script>

<template>
<q-btn
  class="config-menu-control"
  icon="sym_r_settings"
  flat
>
  <q-menu auto-close>
    <q-list style="min-width: 100px">

      <ConfigMenuItem
        :checked-when="preferencesStore.preferences.optClickToRevealPunchline"
        item-text="Click to reveal punchline"
        @click="preferencesStore.toggleClickToRevealPunchline"
      />

      <ConfigMenuItem
        :checked-when="preferencesStore.preferences.optHideDisliked"
        item-text="Hide disliked jokes"
        @click="preferencesStore.toggleHideDisliked"
      />

    </q-list>
  </q-menu>
</q-btn>
</template>

<style scoped>
.config-menu-control {
    position: fixed;
    top: 10px;
    right: 10px;
}
</style>
