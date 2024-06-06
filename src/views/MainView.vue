<script setup lang="ts">
import { computed, ref } from 'vue';
import MainBarGraphControl from "../components/MainBarGraphControl.vue";
import EditForm from "../components/EditForm.vue";
import FullRecordList from "../components/FullRecordList.vue";
import ReportView from "../components/ReportView.vue";
import RecordsToday from "../components/RecordsToday.vue";
import { Context } from '../service/appContext';
import { DayType } from "@/service/dayType";
import { TypeAndDate } from "@/service/calc";
import JournalEntry from '@/service/journalEntry';

const amountToday = computed(() => {
  return Context.value.calc.totalFor(DayType.Day, new Date());
});

const editing = ref<JournalEntry | undefined>(undefined);
const viewReport = ref<TypeAndDate | null>(null);

function viewReportFor(type: DayType, date: Date) {
  viewReport.value = new TypeAndDate(type, date);
}

function handleEditEntry(row: JournalEntry) {
  if (!row) {
    alert('journal entry not set during edit');
    return;
  }

  editing.value = row;
}

function editClosed() {
  editing.value = undefined;
}
</script>

<template>
  <div>
    <h1 style="text-align: center" class="float">
      ${{ amountToday.toFixed(2) }}
      <span style="font-size: '.475em'">/day, today</span>
    </h1>

    <EditForm :entry="editing" @closed="editClosed" />
    <FullRecordList @edit="handleEditEntry"></FullRecordList>

  </div>
  <MainBarGraphControl @view-report="viewReportFor"></MainBarGraphControl>
  <ReportView v-if="viewReport" :date="viewReport.date" :type="viewReport.type" @close-callback="viewReport = null"></ReportView>
  <RecordsToday />
</template>
