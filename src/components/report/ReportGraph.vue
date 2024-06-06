<script setup lang="ts">
import { computed, ref } from 'vue';
import type ReportRow from './ReportRow';
import { Bar } from 'vue-chartjs';

const props = defineProps<{
  data: ReportRow[]
  showDiff: boolean
  maxCount?: number
}>();

const count = computed(() => props.maxCount ? props.maxCount : 50);
const dataSlice = computed(() => props.data.slice(0, count.value));

const chartData: any = computed(() => { //'any', im stupid and because number and number[] don't work together in the component
  return {
    labels: dataSlice.value.map((x) => x.name),
    datasets: [
      {
        data: dataSlice.value.map((x) => x.existing),
        backgroundColor: "#8884d8",
        order: 3
      },
      {
        data: dataSlice.value.map((x) => x.added == 0 ? [0,0] : (x.existing, x.existing + x.added)),
        backgroundColor: "#84d888",
        order: 2
      },
      {
        data: dataSlice.value.map((x) => x.removed == 0 ? [0,0] : (x.existing + x.removed, x.existing)),
        backgroundColor: "#844444",
        order: 1
      }
    ],
  };
});

const chartOptions = ref({
  indexAxis: 'y' as const,
  responsive: true,
  scales: {
    y: {
      stacked: true,
      ticks: {
        autoSkip: false
      },
    }
  },
  plugins: {
    legend: {
      display: false
    },
    datalabels: {
      color: "#0000"
    }
  }
});
</script>

<template>
  <Bar id="bar-graph" ref="chart" :data="chartData" :options="chartOptions" />
</template>
