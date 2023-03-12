<template>
  <div class="fullscreen q-pa-md flex flex-center">
    <q-card bordered class="my-card" window-width="50">
      <q-card-section>
        <div class="text-h6">Connexion</div>
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

      <q-separator inset />

      <q-card-section>
        <q-btn
          label="Envoyer"
          type="submit"
          color="primary"
          @click="login()"
          :disable="isValid"
        ></q-btn>
      </q-card-section>
    </q-card>
    <RouterView />
  </div>
</template>

<script setup>
import { api } from "src/boot/axios";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
const $router = useRouter();
const $q = useQuasar();
const username = ref("");
const password = ref("");
async function login() {
  try {
    const isUserLogin = api("/user/login", {
      params: { username: username.value, password: password.value },
    }).then((res) => {
      // Si user pas trouvé
      if (res?.status === 204)
        $q.notify({
          message: "Nom d'utilisateur / mot de passe incorrect",
          color: "negative",
        });
      else {
        localStorage.setItem("user", JSON.stringify(res?.data[0]));
        $router.push("/");
      }
    });
  } catch (error) {
    console.log("error --->", error);
  }
}

const isValid = computed({
  get() {
    return !(username.value && password.value);
  },
});

const isPwd = ref(true);
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>
