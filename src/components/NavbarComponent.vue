<template>
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
      <q-toolbar-title>
        Bienvenue sur notre projet {{ fetchUsername() }}, Nancy {{ getDate() }}
      </q-toolbar-title>
      <q-btn
        class="q-mx-sm"
        icon="cast_connected"
        dense
        flat
        round
        @click="openModalRaspberry()"
      >
        <q-tooltip> Voir les raspberry </q-tooltip>
      </q-btn>
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
        <vue-recaptcha
          ref="recaptcha"
          @verify="onVerify"
          sitekey="829e9458-d759-43ab-b902-d0c3f001bd3b"
        >
        </vue-recaptcha>
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
          :disable="!isValid"
        ></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="dialogRaspberry">
    <q-card style="width: 600px; height: 450px">
      <q-card-section class="row items-center q-pb-sm bg-primary text-white">
        <div class="text-h5">Liste des raspberry</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="closeRaspberryModal()" />
      </q-card-section>
      <q-card-section>
        <span class="text-h7 text-grey"
          >Dernière heure d'actualisation : {{ lastReload }}</span
        >
      </q-card-section>
      <q-card-section>
        <q-table :rows="raspberryData.data" :columns="columns">
          <template #body-cell-active="props">
            <q-td :props="props">
              <q-icon
                name="fiber_manual_record"
                :color="props.value ? 'positive' : 'negative'"
              >
                <q-tooltip>{{
                  props.value
                    ? `Connecté depuis ${getLastUpdate(props.row.updatedAt)}`
                    : `Déconnecté depuis
               ${getLastUpdate(props.row.updatedAt)}`
                }}</q-tooltip>
              </q-icon>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <q-space />
    </q-card>
  </q-dialog>
</template>
<script>
import EssentialLink from "./EssentialLink.vue";
import { VueRecaptcha } from "vue-recaptcha";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { ref, computed, defineComponent } from "vue";
import dayjs from "dayjs";

const linksList = [
  {
    title: "Accueil",
    caption: "Retour à l'accueil",
    icon: "house",
    to: "/",
  },
  {
    title: "Connexion",
    caption: "Se connecter",
    icon: "login",
    to: "/login",
  },
  {
    title: "Enregistrements",
    caption: "Voir les enregistrements",
    icon: "thermostat",
    to: "/records",
  },
  {
    title: "Tableau de bord",
    caption: "Voir les statistiques",
    icon: "dashboard",
    to: "/dashboard",
  },
];
export default defineComponent({
  name: "NavBarComponent",
  components: {
    EssentialLink,
    VueRecaptcha,
  },
  setup() {
    const month = ref([
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Aout",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ]);
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
          password.value === confirmPassword.value &&
          /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/.test(
            password.value
          ) &&
          !isRobot.value
        );
      },
    });
    const isRobot = ref(true);
    const $q = useQuasar();
    const dialogRaspberry = ref(false);
    const lastReload = ref("");
    const raspberryData = ref([]);
    const columns = ref([
      {
        name: "number",
        required: true,
        label: "Numéro",
        align: "center",
        field: (row) => row.id,
        format: (val) => val,
        sortable: false,
      },
      {
        name: "macAddress",
        required: true,
        label: "Adresse MAC",
        align: "center",
        field: (row) => row.macAddress,
        format: (val) => `${val}`,
        sortable: false,
      },
      {
        name: "createdAt",
        required: true,
        label: "Date de création",
        align: "center",
        field: (row) => dayjs(row.createdAt).format("DD-MM-YYYY"),
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "active",
        required: false,
        label: "Actif",
        align: "center",
        field: (row) => row.isActive,
        format: (val) => val,
        sortable: false,
      },
    ]);
    const interval = ref(0);
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
      isRobot,
      onVerify(response) {
        if (response) isRobot.value = false;
      },
      async register() {
        try {
          const response = await api.post("/user/create", {
            username: username.value,
            password: password.value,
          });
          if (response) {
            $q.notify({
              message: "Utilisateur crée avec succès !",
              color: "primary",
            });
          } else
            $q.notify({
              message: "Erreur lors de la création de l'utilisateur",
              color: "negative",
            });
          modalAdduser.value = false;
        } catch (error) {
          console.log(error);
        }
      },
      month,
      getDate() {
        const currentMonth = month.value[dayjs().month()];
        const day = dayjs().format("DD");
        const year = dayjs().year();
        return `le ${day} ${currentMonth} ${year}`;
      },
      fetchUsername() {
        return JSON.parse(localStorage.getItem("user")).username;
      },
      dialogRaspberry,
      lastReload,
      raspberryData,
      async openModalRaspberry() {
        dialogRaspberry.value = true;
        lastReload.value = `${dayjs().hour()}h${
          dayjs().minute() < 10 ? "0" + dayjs().minute() : dayjs().minute()
        }`;
        raspberryData.value = await api.get("raspberry/all");
        interval.value = setInterval(async () => {
          raspberryData.value = await api.get("raspberry/all");
          lastReload.value = `${dayjs().hour()}h${
            dayjs().minute() < 10 ? "0" + dayjs().minute() : dayjs().minute()
          }`;
        }, 15000);
      },
      dayjs,
      getLastUpdate(date) {
        const date1 = dayjs(date);
        const date2 = dayjs();

        let minutes = date2.diff(date1, "minute");
        const days = Math.floor(minutes / (24 * 60));
        minutes -= days * 24 * 60;
        const hours = Math.floor(minutes / 60);
        minutes -= hours * 60;
        let result = "";
        if (days > 0) {
          result += `${days} Jours `;
        }

        if (hours > 0) {
          result += `${hours} Heures `;
        }

        if (minutes > 0) {
          result += `${minutes} Minutes`;
        }

        // Si la dernière update s'est effectué il y à moins d'une minute
        if (minutes === 0 && hours === 0 && days === 0) {
          result += "0 Minutes";
        }

        return result.trim();
      },
      columns,
      closeRaspberryModal() {
        dialogRaspberry.value = false;
        clearInterval(interval.value);
      },
    };
  },
  mounted() {
    let recaptchaScript = document.createElement("script");
    recaptchaScript.setAttribute("src", "https://hcaptcha.com/1/api.js");
    document.head.appendChild(recaptchaScript);
  },
});
</script>
