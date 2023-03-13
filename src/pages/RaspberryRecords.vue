<template>
  <q-layout view="lHh Lpr lFf">
    <NavbarComponent />
    <q-card>
      <q-card-section>
        <div class="text-h6">Température</div>
        <q-linear-progress
          color="red"
          :min-value="0"
          :max-value="50"
          :value="temperature"
          rounded
          label="°C"
          height="20px"
          thick
        />
      </q-card-section>
      <q-card-section>
        <div class="text-h6">Humidité</div>
        <q-linear-progress
          color="blue"
          :min-value="0"
          :max-value="100"
          :value="humidite"
          rounded
          label="%"
          height="20px"
          thick
        />
      </q-card-section>
      <q-card-section>
        <div class="text-h6">Pression</div>
        <q-linear-progress
          color="orange"
          :min-value="800"
          :max-value="1200"
          :value="pression"
          rounded
          label="hPa"
          height="20px"
          thick
        />
      </q-card-section>
    </q-card>
  </q-layout>
</template>

<script>
import NavbarComponent from "src/components/NavbarComponent.vue";
import { ref } from "vue";
export default {
  name: "SondeRecords",
  setup() {
    const pression = ref(1000);
    return { pression };
  },
  components: { NavbarComponent },
};
</script>
