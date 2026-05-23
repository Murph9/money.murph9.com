<script setup lang="ts">
import type JournalEntry from '@/service/journalEntry';
import SimpleModal from './SimpleModal.vue';
import { computed, ref } from 'vue';
import { Context } from '@/service/appContext';
import DateLib from '@/service/dateHelpers';
import RowsTable from './RowsTable.vue';

const PAGE_SIZE = 15; // not quite right

const emit = defineEmits<{ edit: [entry: JournalEntry] }>();

const viewing = ref(false);
const filter = ref('');
const pageIndex = ref(0);

const totalRecords = computed(() => {
  return Context.value.getRecords();
});

const recordsThisWeek = computed(() =>
  totalRecords.value.filter((x) => x.from > DateLib.addDays(new Date(), -7))
);
const recordsToday = computed(() =>
  totalRecords.value.filter((x) => x.from > DateLib.addDays(new Date(), -1))
);

const filteredData = computed(() => {
  const searchExp = new RegExp(filter.value, 'i');
  return [...totalRecords.value]
    .sort((x: JournalEntry, y: JournalEntry) => {
      return +y.from - +x.from;
    })
    .filter((x) => searchExp.test(x.category) || (x.note && searchExp.test(x.note)));
});

const pageIndexesToShow = computed(() => {
  const list = [pageIndex.value];
  const max = Math.ceil(filteredData.value.length / PAGE_SIZE);

  for (let i = pageIndex.value - 1; i >= pageIndex.value - 3; i--) {
    if (i >= 0) list.unshift(i);
  }
  for (let i = pageIndex.value + 1; i <= pageIndex.value + 3; i++) {
    if (i <= max) list.push(i);
  }
  return list;
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

  <SimpleModal
    :open="viewing"
    heading-text="All Record Search"
    :show-footer="false"
    :cancel-text="''"
    :confirm-text="''"
  >
    <button class="btn btn-primary float-end" @click="viewing = false">Close</button>
    <div class="row">
      <div class="col">
        <input type="text" v-model="filter" class="form-control" placeholder="Filter below" />
      </div>
      <div class="col">
        {{ filter }}
        Record count: {{ filteredData.length }} (total count: {{ totalRecords.length }})<br />
        today: {{ recordsToday.length }}, week: {{ recordsThisWeek.length }}
      </div>
    </div>
    <RowsTable
      :show-edit="true"
      :show-note="false"
      :data="filteredData.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE - 1)"
      @edit-row="editRow"
    ></RowsTable>
    <div class="input-group">
      <button
        v-for="i in pageIndexesToShow"
        :key="i"
        class="btn"
        :class="i == pageIndex ? 'btn-primary' : 'btn-outline-primary'"
        @click="pageIndex = i"
      >
        {{ i }}
      </button>
    </div>
  </SimpleModal>
</template>
