<template>
  <q-layout view="lHh Lpr lFf">
    <NavbarComponent />
    <q-layout class="q-pt-xl">
      <div class="q-pa-lg">
        <q-btn
          dense
          label="Ajouter un enregistrement"
          @click="modalAddRecords = true"
          ><q-tooltip>Ajouter un enregistrement</q-tooltip>
        </q-btn>
        <q-table
          class="q-my-lg"
          title="Enregistrements"
          :rows="apiData"
          :columns="columns"
          row-key="name"
          no-results-label="Inconnu"
        />
      </div>
    </q-layout>
    <q-dialog v-model="modalAddRecords">
      <q-card style="width: 500px">
        <q-card-section class="row items-center q-pb-sm bg-primary text-white">
          <div class="text-h6">Créer un enregistrement</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-select
            v-model="selectedRaspberry"
            :options="raspberry"
            label="*Raspberry"
            option-label="macAddress"
            option-value="id"
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="temperature" label="*Température"> </q-input>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="pressure" label="Pression"> </q-input>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="humidity" label="Humidité"> </q-input>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="ipAddress" label="Adresse IP"> </q-input>
        </q-card-section>

        <q-card-section>
          <span class="text-negative"> *Champs obligatoires </span>
        </q-card-section>

        <q-card-section>
          <q-btn
            label="Envoyer"
            type="submit"
            color="primary"
            @click="register()"
            :disable="isValid"
          ></q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { api } from "src/boot/axios";
import NavbarComponent from "src/components/NavbarComponent.vue";
import { ref, computed } from "vue";
import dayjs from "dayjs";
import { useQuasar } from "quasar";

export default {
  components: { NavbarComponent },

  setup() {
    const apiData = ref([]);
    const raspberry = ref([]);
    const modalAddRecords = ref(false);
    const temperature = ref(null);
    const pressure = ref(null);
    const ipAddress = ref(null);
    const selectedRaspberry = ref(null);
    const isValid = computed({
      get() {
        return !(selectedRaspberry.value && temperature.value);
      },
    });
    const $q = useQuasar();
    7;
    function searchMacAddress(id) {
      const macAddress = raspberry.value.filter((r) => r.id === id)[0]
        ?.macAddress;
      return macAddress ?? "Indéfinie";
    }
    const columns = ref([
      {
        name: "Date",
        required: true,
        label: "Date",
        align: "center",
        field: (row) => row.createdAt,
        format: (val) =>
          `${
            dayjs(val).format("DD-MM-YYYY") +
            " à " +
            dayjs(val).hour() +
            "h" +
            (dayjs(val).minute() < 10
              ? `0${dayjs(val).minute()}`
              : dayjs(val).minute())
          }`,
        sortable: true,
      },
      {
        name: "Adresse MAC",
        required: true,
        label: "Adresse MAC",
        align: "center",
        field: (row) => row.raspberryId,
        format: (val) => `${searchMacAddress(val)}`,
        sortable: false,
      },
      {
        name: "Température",
        required: true,
        label: "Température",
        align: "center",
        field: (row) => row.temperature,
        format: (val) => `${val}°C`,
        sortable: true,
      },
      {
        name: "Pression",
        required: false,
        label: "Pression",
        align: "center",
        field: (row) => row.pressure,
        format: (val) => `${val ? val + " hPa" : "Inconnue"}`,
        sortable: true,
      },
      {
        name: "Humidité",
        required: false,
        label: "Humidité",
        align: "center",
        field: (row) => row.humidity,
        format: (val) => `${val ? val + "%" : "Inconnue"}`,
        sortable: true,
      },
      {
        name: "Adresse IP",
        required: true,
        label: "Adresse IP",
        align: "center",
        field: (row) => row.ipAddress,
        format: (val) => `${val ? val : "Inconnue"}`,
        sortable: false,
      },
    ]);
    const humidity = ref(null);
    return {
      apiData,
      modalAddRecords,
      raspberry,
      temperature,
      pressure,
      ipAddress,
      selectedRaspberry,
      humidity,
      isValid,
      $q,
      async register() {
        const response = await api.post("/record/create", {
          raspberryId: selectedRaspberry.value.id,
          temperature: parseInt(temperature.value),
          pressure: parseFloat(pressure.value),
          humidity: parseFloat(humidity.value),
          ipAddress: ipAddress.value,
        });
        $q.notify({
          message: "Enregistrement effectué avec succès !",
          color: "primary",
        });
        const records = await api.get("/record/all");
        apiData.value = records.data;
        modalAddRecords.value = false;
      },
      columns,
    };
  },
  async mounted() {
    const records = await api.get("/record/all");
    const raspberry = await api.get("/raspberry/all");
    this.raspberry = raspberry.data;
    this.apiData = records.data;
  },
};
</script>
