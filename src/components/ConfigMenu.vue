<script setup lang="ts">
import {usePreferencesStore} from '@/stores/PreferencesStore.ts';

const preferencesStore = usePreferencesStore();
</script>

<template>
<q-btn
  class="config-menu-control"
  icon="settings"
  flat
>
  <q-menu auto-close>
    <q-list style="min-width: 100px">
      <q-item
        clickable
        @click="preferencesStore.toggleClickToRevealPunchline"
      >
        <q-item-section>
          <div>
            <!-- We don't want to use v-if because Quasar won't reserve the space for the checkmark -->
            <q-icon
              :class="{'invisible': !preferencesStore.preferences.clickToRevealPunchline}"
              name="done"
            />
            Click to reveal punchline
          </div>
        </q-item-section>
      </q-item>
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

:deep(.q-item__section) {
    white-space: nowrap;
}
</style>
