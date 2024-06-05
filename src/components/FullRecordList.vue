<script setup lang="ts">
import type JournalEntry from '@/service/journalEntry';
import SimpleModal from "./SimpleModal.vue";
import { computed, ref } from 'vue';
import { Context } from '@/service/appContext';
import { DayType } from '../service/dayType';
import DateLib from '@/service/dateHelpers';

const emit = defineEmits<{
  edit: [entry: JournalEntry]
}>();

const viewing = ref(false);
const filter = ref("");

const totalRecords = computed(() => {
  return Context.value.getRawData();
});

const recordsThisWeek = computed(() => totalRecords.value.filter(x => x.from > DateLib.addDays(new Date(), -7)));
const recordsToday = computed(() => totalRecords.value.filter(x => x.from > DateLib.addDays(new Date(), -1)));

const filteredData = computed(() => {
  const searchExp =  new RegExp(filter.value, "i");
  return totalRecords.value
    .filter(x => searchExp.test(x.category) || (x.note && searchExp.test(x.note)))
    .sort((x: JournalEntry, y: JournalEntry) => {
        return +y.from - +x.from;
    });
});

function editRow(row: JournalEntry) {
  viewing.value = false;
  emit('edit', row);
}

</script>

<template>
  <span class="float-end">
    <button class="btn btn-primary" :disabled="viewing" @click="viewing = true">View All</button>
  </span>

  <SimpleModal :open="viewing" heading-text="All Record Search" :show-footer="false">
    <button class="btn btn-primary float-end" @click="viewing = false">Close</button>
    <div class="row">
      <div class="col">
        <input type="text" v-model="filter" class="form-control" placeholder="Filter below" />
      </div>
      <div class="col">
        {{ filter }}
        Record count: {{ filteredData.length }} (total count: {{ totalRecords.length }})<br/>
        today: {{ recordsToday.length }}, week: {{ recordsThisWeek.length }}
      </div>
    </div>
    <table class="table table-sm table-hover table-bordered table-striped">
      <thead>
        <tr>
          <th>Category</th><th>Amount</th><th>Start Date</th><th>Length</th><th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in filteredData" :key="row.id">
          <td>{{ row.category }}</td>
          <td>${{ row.amount.toFixed(2) }}</td>
          <td>{{ row.from.toLocaleDateString() }}</td>
          <td>{{ row.repeats && !row.lastDay ? 'inf' : `${row.lengthCount} * ${DayType[row.lengthType]}` }}</td>
          <td><button class="btn btn-secondary" @click="editRow(row)">Edit</button></td>
        </tr>
      </tbody>
    </table>
  </SimpleModal>
</template>
