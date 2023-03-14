<template>
  <q-layout view="lHh Lpr lFf">
    <NavbarComponent />
    <div class="title">
      <div class="text-h4 flex align-center">
        <q-icon name="dashboard" />
        <span>Tableau de bord</span>
      </div>
      <span class="text-h7 text-grey"
        >Dernière date d'actualisation : {{ lastReload }}</span
      >
    </div>

    <div class="q-mt-md row justify-center">
      <div class="q-mt-md">
        <q-card
          class="flex justify-center q-mx-md"
          style="width: 530px; height: 450px"
        >
          <q-card-section>
            <div class="text-h6">Moyenne des températures</div>
          </q-card-section>
          <q-card-section style="width: 100%; height: 100%">
            <div class="q-mb-xl" id="chart"></div> </q-card-section
        ></q-card>
      </div>
      <div class="q-mt-md">
        <q-card
          class="flex justify-center q-mx-md"
          style="width: 530px; height: 450px"
        >
          <q-card-section>
            <div class="text-h6">Moyenne des températures</div>
          </q-card-section>
          <q-card-section style="width: 100%; height: 100%">
            <div class="q-mb-xl" id="chart2"></div> </q-card-section
        ></q-card>
      </div>
    </div>
  </q-layout>
</template>
<script>
import { api } from "src/boot/axios";
import NavbarComponent from "src/components/NavbarComponent.vue";
import ApexCharts from "apexcharts";
import dayjs from "dayjs";
import { ref } from "vue";

const days = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

function getCurrentWeekDay() {
  const oldWeek = dayjs().subtract(7, "days");
  const week = [];
  for (let i = 0; i < 7; i++) {
    week.push(days[oldWeek.add(i, "days").day()]);
  }
  return week;
}

async function renderChartOne() {
  const data = await api.get("/record/week/statistics");
  const currentWeek = getCurrentWeekDay();
  console.log(currentWeek);
  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    series: [
      {
        name: "Température moyenne",
        data: data.data.statsTempMoy,
      },
    ],
    xaxis: {
      categories: currentWeek,
    },
    plotOptions: {
      bar: {
        distributed: true,
      },
    },
  };

  const chart = new ApexCharts(document.querySelector("#chart"), chartOptions);
  chart.render();
  return chart;
}

async function renderChartTwo() {
  const week = getCurrentWeekDay().map((e) => e.slice(0, 3));
  const data = await api.get("/record/week/statistics");
  const options = {
    chart: {
      height: 350,
      type: "line",
      stacked: false,
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "10px",
      },
    },
    colors: ["#FF1654", "#247BA0"],
    series: [
      {
        name: "Series A",
        data: data.data.statsPressureMoy,
      },
      {
        name: "Series B",
        data: data.data.statsHumidityMoy,
      },
    ],
    stroke: {
      width: [4, 4],
    },
    plotOptions: {
      bar: {
        columnWidth: "20%",
      },
    },
    xaxis: {
      categories: week,
    },
    yaxis: [
      {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: "#FF1654",
        },
        labels: {
          style: {
            colors: "#FF1654",
          },
        },
        title: {
          text: "Pression",
          style: {
            color: "#FF1654",
          },
        },
      },
      {
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: "#247BA0",
        },
        labels: {
          style: {
            colors: "#247BA0",
          },
        },
        title: {
          text: "Humidité",
          style: {
            color: "#247BA0",
          },
        },
      },
    ],
    tooltip: {
      shared: false,
      intersect: true,
      x: {
        show: false,
      },
    },
    legend: {
      horizontalAlign: "left",
      offsetX: 40,
    },
  };
  const chart = new ApexCharts(document.querySelector("#chart2"), options);
  chart.render();
  return chart;
}

export default {
  components: { NavbarComponent },
  setup() {
    const lastReload = ref(null);
    return { lastReload };
  },
  async mounted() {
    const chart1 = await renderChartOne();
    const chart2 = await renderChartTwo();
    this.lastReload = `${dayjs().hour()}h${
      dayjs().minute() < 10 ? "0" + dayjs().minute() : dayjs().minute()
    }`;
    setInterval(async () => {
      const data = await api.get("/record/week/statistics");
      chart1.updateSeries([
        {
          data: data.data.statsTempMoy,
        },
      ]);
      chart2.updateSeries([
        {
          data: data.data.statsPressureMoy,
        },
        {
          data: data.data.statsHumidityMoy,
        },
      ]);
      this.lastReload = `${dayjs().hour()}h${
        dayjs().minute() < 10 ? "0" + dayjs().minute() : dayjs().minute()
      }`;
    }, 15000);
  },
};
</script>
<style>
.title {
  margin-top: 7%;
  margin-left: 3.5%;
}
</style>
