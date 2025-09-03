<script setup lang="ts">
defineProps<{
	animate: boolean;
}>();
</script>

<template>
<div class="brand">
  <img alt="Jester logo" class="logo" :class="{animate}" src="/jester-logo-sq.png" />
  <span class="font-diner-swanky-regular">Jester</span>
</div>
</template>

<style scoped lang="scss">
.brand {
    display: flex;
    align-items: center;
    justify-content: center;

    margin: 15px 15px 20px;
    font-size: 28pt;
}

.logo {
    display: block;
    margin: 0;

    /*
     The image is positioned so that it spins from a point that
     appears more central to the hat. As a consequence, there's
     extra whitespace that we need to remove. clip-path can hide
     it, but doesn't remove its space. Instead, we'll adjust the
     size and it's position within its box. This approach can't
     remove the whitespace to the right, but that gives it a
     serendipitous leaning quality when centered over the name
     and a nice space from it when on the same line.
     */
    width: 200px;
    height: 150px;
    object-fit: cover;
    object-position: -15px -10px;

    &.animate {
        display: block;
        animation: rotate360 1s linear infinite;

        /* revert some settings for more central rotation */
        height: auto;
        clip-path: unset;
        object-fit: unset;
        object-position: unset;
    }
}

@keyframes rotate360 {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@media screen and (width < $breakpoint-small) {
    .brand {
        flex-direction: column;
	      font-size: 22pt;
    }

    .logo {
	      width: 100px;
        height: 75px;
	      object-position: -8px -7px;
        margin: unset;
    }
}
</style>
