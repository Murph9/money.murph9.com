<script setup lang="ts">
import { computed } from 'vue';
import type JournalEntry from '@/service/journalEntry';
import { DayType } from '../../service/dayType';

const props = defineProps<{
  data: JournalEntry[]
}>();

const dataSorted = computed(() => {
  return [...props.data].sort((x, y) => x.calcPerDay() - y.calcPerDay());
});
</script>

<template>
  <table class="table table-striped table-bordered table-hover table-sm">
    <thead>
      <tr>
        <th>Category</th>
        <th>$/day</th>
        <th>From</th>
        <th>Math</th>
        <th>Note</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="x in dataSorted" :key="x.category">
        <td>{{ x.category }}</td>
        <td style="text-align: end;">{{ x.calcPerDay().toFixed(2) }}</td>
        <td>{{ x.from.toLocaleDateString() }}</td>
        <td>${{ x.amount }} @ {{ x.lengthCount + " * " + DayType[x.lengthType] }} <code v-if="x.repeats">forever</code></td>
        <td>{{ x.note }}</td>
      </tr>
    </tbody>
  </table>
</template>
