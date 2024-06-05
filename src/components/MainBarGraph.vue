<script setup lang="ts">
import { Bar, type ChartComponentRef } from 'vue-chartjs';
import { Context } from '../service/appContext';
import DayTypeLib, { DayType } from '../service/dayType';
import { computed, ref } from 'vue';

class ReportEntry {
  name: string;
  amount: number;
  date: Date;
  current: boolean = false;
  future: boolean = false;

  constructor(name: string, amount: number, date: Date) {
    this.name = name;
    this.amount = amount;
    this.date = date;
  }
}

const props = defineProps<{
  periodType: DayType
  periodOffset: number
}>();

const emit = defineEmits<{
  viewReport: [type: DayType, date: Date]
}>();

const futureCount = 2;
const barCount = 7;
const graphOffset = -barCount + 1 + futureCount;

const barIndex = computed(() => {
  return [...Array(barCount).keys()].map((i) => i + graphOffset + props.periodOffset);
});

const barData = computed(() => {
  const now = DayTypeLib.setToStart(new Date(), props.periodType);
  return barIndex.value.map((i) => {
    const periodStart = DayTypeLib.offsetDateBy(now, props.periodType, i);
    const value = Context.value.calc.totalFor(props.periodType, periodStart);
    const obj = new ReportEntry(periodStart.toLocaleDateString(), value, periodStart);
    if (now.getTime() == periodStart.getTime()) {
      obj.current = true;
    } else if (now.getTime() < periodStart.getTime()) {
      obj.future = true;
    }
    return obj;
  });
});

function getColour(amount: number, future: boolean) {
  return amount >= 0 ? future ? 'lightgreen' : 'green': 'red';
}

function labelRound(x: number) {
  return "$" + x.toFixed(2);
}

const chart = ref<ChartComponentRef | null>(null);

const chartData = computed(() => {
  return {
    labels: barData.value.map((x) => x.name),
    datasets: [
      {
        data: barData.value.map((x) => x.amount),
        backgroundColor: barData.value.map((x) => getColour(x.amount, x.future)),
        borderColor: barData.value.map((x) => x.current ? 'grey' : 'transparent'),
        borderWidth: 5,
        datalabels: {
          align: 'start' as const, // stops typescript errors
          anchor: 'end' as const
        }
      }
    ],
  };
});

const chartOptions = ref({
  responsive: true,
  animation: false as const,
  events: ['click' as const, 'touchstart' as const],
  onClick: (e: any) => {
    if (!chart.value || !chart.value.chart) return;

    const list = chart.value.chart.getElementsAtEventForMode(e, 'point', { intersect: true }, true);
    if (list.length < 1) return;
    
    const barDetails = barData.value[list[0].index];
    emit("viewReport", props.periodType, barDetails.date);
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: false
    },
    datalabels: {
      color: 'black',
      font: {
        size: 18,
        family: "Verdana, sans-serif"
      },
      formatter: labelRound
    }
  }
});

</script>

<template>
  <Bar id="bar-graph" ref="chart" :data="chartData" :options="chartOptions" style="max-height: 300px"/>
</template>
