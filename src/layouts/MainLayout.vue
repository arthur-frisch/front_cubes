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
        <q-btn
          class="q-mx-sm"
          icon="person_add"
          dense
          round
          flat
          @click="modalAdduser = true"
          ><q-tooltip>Ajouter un utilisateur</q-tooltip>
        </q-btn>
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
    <q-dialog v-model="modalAdduser">
      <q-card>
        <q-card-section class="row items-center q-pb-sm bg-primary text-white">
          <div class="text-h6">Créer un utilisateur</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
          repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis
          perferendis totam, ea at omnis vel numquam exercitationem aut, natus
          minima, porro labore.
        </q-card-section>
      </q-card>
    </q-dialog>
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
    const modalAdduser = ref(false);
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
      modalAdduser,
    };
  },
});
</script>
