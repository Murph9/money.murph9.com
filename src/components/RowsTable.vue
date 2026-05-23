<script setup lang="ts">
import type JournalEntry from '@/service/journalEntry';
import { DayType } from '../service/dayType';

const props = defineProps<{
  data: JournalEntry[];
  showNote: boolean;
  showEdit: boolean;
}>();

const emit = defineEmits<{
  editRow: [row: JournalEntry];
}>();

function editRow(row: JournalEntry) {
  emit('editRow', row);
}
</script>

<template>
  {{ props.data.length }}
  <table class="table table-striped table-bordered table-hover table-sm">
    <thead>
      <tr>
        <th>Category</th>
        <th>$/day</th>
        <th>From</th>
        <th>Math</th>
        <th v-if="props.showNote">Note</th>
        <th v-if="props.showEdit"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="x in props.data" :key="x.id">
        <td>{{ x.category }}</td>
        <td style="text-align: end">
          ${{ x.amount.toFixed(2) }}<br />
          <code v-if="!x.isForOneDay()">{{ x.calcPerDay().toFixed(2) }}/day</code>
        </td>
        <td>{{ x.from.toLocaleDateString() }}</td>
        <td>
          ${{ x.amount }} @ {{ x.lengthCount + ' * ' + DayType[x.lengthType] }}
          <code v-if="x.repeats">
            <p v-if="x.lastDay == null">forever</p>
            <p v-if="x.lastDay != null">till {{ x.lastDay.toLocaleDateString() }}</p>
          </code>
        </td>
        <td v-if="props.showNote">{{ x.note }}</td>
        <td v-if="props.showEdit">
          <button class="btn btn-secondary" @click="editRow(x)">Edit</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
