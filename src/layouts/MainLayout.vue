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
        <q-toolbar-title> Projet raspberry </q-toolbar-title>
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
        <div class="q-pt-sm">
          <img
            alt="Quasar logo"
            src="../assets/logo_projet.png"
            style="width: 30px; height: 30px"
          />
        </div>
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
    <q-dialog v-model="modalAdduser">
      <q-card>
        <q-card-section class="row items-center q-pb-sm bg-primary text-white">
          <div class="text-h6">Créer un utilisateur</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-input v-model="username" label="Nom d'utilisateur"> </q-input>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="password"
            :type="isPwd ? 'password' : 'text'"
            label="Mot de passe"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="confirmPassword"
            :type="isConfirmPwd ? 'password' : 'text'"
            label="Confirmer le mot de passe"
          >
            <template v-slot:append>
              <q-icon
                :name="isConfirmPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isConfirmPwd = !isConfirmPwd"
              />
            </template>
          </q-input>
        </q-card-section>
        
        <q-card-section>
          <q-checkbox v-model="isNotRobot" label="Je ne suis pas un robot" />
        </q-card-section>

        <q-separator inset />

        <q-card-section>
          <span class="text-negative">
            *Le mot de passe doit contenir au moins 1 chiffre et une majuscule
          </span>
        </q-card-section>

        <q-card-section>
          <q-btn
            label="Envoyer"
            type="submit"
            color="primary"
            @click="register()"
            :disable="!isValid || !isNotRobot"
          ></q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
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

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const modalAdduser = ref(false);
    const $router = useRouter();
    const isPwd = ref(true);
    const isConfirmPwd = ref(true);
    const username = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const isValid = computed({
      get() {
        return (
          username.value &&
          password.value &&
          confirmPassword.value &&
          password.value === confirmPassword.value
        );
      },
    });
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
      isPwd,
      isConfirmPwd,
      username,
      password,
      confirmPassword,
      isValid,
    };
  },
});
</script>
<style>
body {
  overflow: hidden;
}
</style>
