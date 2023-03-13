<template>
  <q-layout view="lHh Lpr lFf">
    <NavbarComponent />
    <q-layout class="q-pt-xl">
      <q-btn
        class="q-mx-sm"
        icon="add"
        dense
        round
        flat
        @click="modalAddRecords = true"
        ><q-tooltip>Ajouter un enregistrement</q-tooltip>
      </q-btn>
      <div class="q-pa-xl">
        <q-table
          title="Enregistrements"
          :rows="apiData"
          :columns="columns"
          row-key="name"
        />
      </div>
    </q-layout>
    <q-dialog v-model="modalAddRecords">
      <q-card>
        <q-card-section class="row items-center q-pb-sm bg-primary text-white">
          <div class="text-h6">Créer un enregistrement</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-select
            v-model="selectedRaspberry"
            :options="raspberry"
            label="Raspberry"
            option-label="macAddress"
            option-value="id"
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="temperature" label="temperature"> </q-input>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="pressure" label="Pression"> </q-input>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="ipAddress" label="Adresse IP"> </q-input>
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

const columns = [
  {
    name: "Date",
    required: true,
    label: "Date",
    align: "center",
    field: (row) => row.createdAt,
    format: (val) => `${dayjs(val).format("DD-MM-YYYY")}`,
    sortable: true,
  },
  {
    name: "Identifiant raspberry",
    required: true,
    label: "Identifiant raspberry",
    align: "center",
    field: (row) => row.raspberryId,
    format: (val) => `${val}`,
    sortable: false,
  },
  {
    name: "Température",
    required: true,
    label: "Température",
    align: "center",
    field: (row) => row.temperature,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "Pression",
    required: false,
    label: "Pression",
    align: "center",
    field: (row) => row.pressure,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "Adresse IP",
    required: true,
    label: "Adresse IP",
    align: "center",
    field: (row) => row.ipAddress,
    format: (val) => `${val}`,
    sortable: true,
  },
];

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
    return {
      apiData,
      columns: columns,
      modalAddRecords,
      raspberry,
      temperature,
      pressure,
      ipAddress,
      selectedRaspberry,
      isValid,
      $q,
      async register() {
        const response = await api.post("/record/create", {
          raspberryId: selectedRaspberry.value.id,
          temperature: parseInt(temperature.value),
          pressure: parseFloat(pressure.value),
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
