<script setup lang="ts">
import HeaderRow from './components/HeaderRow.vue';
import MainView from './views/MainView.vue';
import LoginView from './views/LoginView.vue';
import { Context } from './service/appContext';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { onBeforeMount } from 'vue';

onBeforeMount(() => {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);
  Context.value.autoLogin = document.cookie.indexOf("autoLogin") !== -1;
});

</script>

<template>
  <HeaderRow></HeaderRow>
  <div v-if="Context.successful()">
    <MainView></MainView>
  </div>
  <div v-if="!Context.successful()">
    <LoginView></LoginView>
  </div>
</template>
