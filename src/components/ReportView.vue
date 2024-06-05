<script setup lang="ts">
import DayTypeLib, { DayType } from '@/service/dayType';
import { computed, ref } from 'vue';
import ReportGraph from './report/ReportGraph.vue';
import ReportTable from './report/ReportTable.vue';
import ReportRaw from './report/ReportRaw.vue';
import { Context } from '@/service/appContext';
import { generateReportRows } from './report/ReportRow';

const props = defineProps<{
  date: Date
  type: DayType
}>();

const emit = defineEmits<{
  closeCallback: [void]
}>();

const showDiff = ref(false);
const showAll = ref(false);
const showIncome = ref(false);

const TAB_GRAPH = "tab_graph";
const TAB_TABLE = "tab_table";
const TAB_RAW = "tab_raw";
const activeTab = ref(TAB_GRAPH);

const rawList = computed(() => {
  return Context.value.calc.rowsFor(props.type, props.date);
});

const entryList = computed(() => {
  var cur = Context.value.calc.reportForRows(rawList.value);
  const prev = Context.value.calc.reportFor(props.type, DayTypeLib.offsetDateBy(props.date, props.type, -1));
  return generateReportRows(cur, prev, showDiff.value);
});

const incomeList = computed(() => {
  const list = entryList.value.filter(x => x.income);
  list.forEach(x => {x.added *= -1; x.existing *= -1; x.removed *= -1});
  list.sort((x, y) => y.sum() - x.sum());
  return list;
});
const expenseList = computed(() => { 
  const list = entryList.value.filter(x => !x.income);
  list.sort((x, y) => y.sum() - x.sum());
  return list;
});
const maxCount = computed(() => showAll.value ? expenseList.value.length : 10);

</script>

<template>
  <h4 class="float-start">Report: {{ DayType[props.type] }} of {{ props.date.toLocaleDateString() }}</h4>
  
  <button class='btn btn-secondary float-end btn-sm' @click="emit('closeCallback')">Close</button>
  <div class="float-end">
    <div class="input-group">
      <button :class="showIncome ? 'btn-primary' : 'btn-outline-primary'" class='btn btn-sm' @click="showIncome = !showIncome">Income</button>
      <button :class="showAll ? 'btn-primary' : 'btn-outline-primary'" class='btn btn-sm' @click="showAll = !showAll">All</button>
      <button :class="showDiff ? 'btn-primary' : 'btn-outline-primary'" class='btn btn-sm' @click="showDiff = !showDiff">Diff</button>
    </div>
  </div>

  <div class="input-group">
    <button :class="activeTab == TAB_GRAPH ? 'btn-secondary' : 'btn-outline-secondary'" class='btn' @click="activeTab = TAB_GRAPH">GraphView</button>
    <button :class="activeTab == TAB_TABLE ? 'btn-secondary' : 'btn-outline-secondary'"  class='btn' @click="activeTab = TAB_TABLE">TableView</button>
    <button :class="activeTab == TAB_RAW ? 'btn-secondary' : 'btn-outline-secondary'"  class='btn'  @click="activeTab = TAB_RAW">Raw</button>
  </div>

  <ReportGraph v-if="activeTab == TAB_GRAPH && showIncome" :data="incomeList" :max-count="incomeList.length" :show-diff="showDiff" style="max-height: 100px;"></ReportGraph>
  <ReportGraph v-if="activeTab == TAB_GRAPH" :data="expenseList" :max-count="maxCount" :show-diff="showDiff"></ReportGraph>
  <ReportTable v-if="activeTab == TAB_TABLE && showIncome" :data="incomeList" :max-count="incomeList.length" :show-diff="showDiff"></ReportTable>
  <ReportTable v-if="activeTab == TAB_TABLE" :data="expenseList" :max-count="maxCount" :show-diff="showDiff"></ReportTable>
  <ReportRaw v-if="activeTab == TAB_RAW && showIncome" :data="rawList"></ReportRaw>
  <ReportRaw v-if="activeTab == TAB_RAW" :data="rawList"></ReportRaw>
</template>
