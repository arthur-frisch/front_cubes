<template>
  <q-layout view="lHh Lpr lFf">
    <NavbarComponent />
    <q-page-container style="width: 100%; height: 100%">
      <q-page class="flex flex-center">
        <img
          alt="Quasar logo"
          src="~assets/accueil_1_neige.png"
          style="width: 100%; height: 100%"
        />
      </q-page>
    </q-page-container>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import NavbarComponent from "src/components/NavbarComponent.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    NavbarComponent,
  },
});
</script>
<style>
body {
  overflow: hidden;
}
</style>
