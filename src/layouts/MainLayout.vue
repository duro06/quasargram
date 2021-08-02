<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-grey-10">
      <q-toolbar>
        <q-btn
          :to="{ name: 'camera' }"
          class="large-screen-only"
          icon="eva-camera-outline"
          size="18px"
          flat
          round
          dense
        />
        <q-toolbar-title class="text-grand-hotel text-bold">
          Quasargram
        </q-toolbar-title>
        <q-btn
          :to="{ name: 'home' }"
          class="large-screen-only"
          icon="eva-home-outline"
          size="18px"
          flat
          round
          dense
        />

        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>
    </q-header>

    <q-footer class="bg-white small-screen-only" bordered>
      <q-tabs
        class="text-grey-10"
        active-color="primary"
        indicator-color="transparent"
      >
        <q-route-tab :to="{ name: 'home' }" icon="eva-home-outline" />
        <q-route-tab :to="{ name: 'camera' }" icon="eva-camera-outline" />
      </q-tabs>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",

  setup() {
    return {};
  },
});
</script>
<style lang="sass">
.q-toolbar__title
  text-align: center
  font-size: 30px
.q-footer
  .q-tab__icon
    font-size: 30px
</style>
