<script setup lang="ts">
import { computed } from 'vue';
import type ReportRow from './ReportRow';

const props = defineProps<{
  data: ReportRow[]
  showDiff: boolean
  widthPercent?: number
  maxCount?: number
}>();

const showingAll = computed(() => !props.maxCount || props.maxCount >= props.data.length);
const total = computed(() => props.data.reduce((total, a) => total + a.sum(), 0));
const totalLast = computed(() => props.data.reduce((total, a) => total + a.existing + a.removed, 0));
const totalDiff = computed(() => props.data.reduce((total, x) => total + x.added - x.removed, 0));
const nameWidth = (props.widthPercent ?? 60)+'%';

function formatValue(value: number): string {
  return value ? "$"+value.toFixed(2): "";
}

function formatDiff(value: number): string {
  if (value > 0) return "↑";
  if (value < 0) return "↓";
  return "";
}
</script>

<template>
  <table class="table table-striped table-bordered table-hover table-sm">
    <thead>
      <tr><th :style="{ width: nameWidth }">Category</th><th>Previous</th><th>Current</th><th v-if="props.showDiff">Diff</th></tr>
    </thead>
    <tbody>
      <tr v-for="row in props.data.slice(0, props.maxCount ?? 150)" :key="row.name">
        <td>{{ row.name }}</td>
        <td>{{ formatValue(row.existing + row.removed) }}</td>
        <td>{{ formatValue(row.sum()) }}</td>
        <td v-if="props.showDiff">{{ formatValue(row.added - row.removed)}} {{ formatDiff(row.added - row.removed) }}</td>
      </tr>
      <tr v-if="!showingAll">
        <td>&nbsp;... and {{ props.data.length - (props.maxCount ?? 0) }} more</td>
        <td></td>
        <td></td>
        <td v-if="props.showDiff"></td>
      </tr>
      <tr>
        <td><strong>Total</strong></td>
        <td><strong>{{ formatValue(totalLast) }}</strong></td>
        <td><strong>{{ formatValue(total) }}</strong></td>
        <td v-if="props.showDiff"><strong>{{ formatValue(totalDiff) }} {{ formatDiff(totalDiff) }}</strong></td>
      </tr>
    </tbody>
  </table>
</template>
