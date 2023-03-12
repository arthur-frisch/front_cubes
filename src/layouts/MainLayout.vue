<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Application raspberry </q-toolbar-title>

        <q-btn class="q-mx-sm" icon="logout" dense round flat @click="logOut()"
          ><q-tooltip>Déconnexion</q-tooltip>
        </q-btn>
        <div>v1.0.0</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Navigation </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { useRouter } from "vue-router";

const linksList = [
  {
    title: "Login",
    caption: "Se connecter",
    icon: "login",
    to: "/login",
  },
  {
    title: "Register",
    caption: "Créer un utilisateur",
    icon: "add_circle",
    to: "/register",
  },
];

function logOut() {
  localStorage.removeItem("user");
  $router.push("/login");
}

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const $router = useRouter();
    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      $router,
      logOut() {
        localStorage.removeItem("user");
        $router.push("/login");
      },
    };
  },
});
</script>
