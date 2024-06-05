<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useToast } from "vue-toastification";
import { Context } from '../service/appContext';
import { DayType } from "@/service/dayType";
import MainBarGraphControl from "../components/MainBarGraphControl.vue";
import EditForm from "../components/EditForm.vue";
import FullRecordList from "../components/FullRecordList.vue";
import ReportView from "../components/ReportView.vue";
import RecordsToday from "../components/RecordsToday.vue";
import { TypeAndDate } from "@/service/calc";
import JournalEntry from '@/service/journalEntry';

const toast = useToast();

const amountToday = computed(() => {
  return Context.getCalc().totalFor(DayType.Day, new Date());
});

const editing = ref<JournalEntry | boolean>(false);
const viewList = ref(false);
const viewReport = ref<TypeAndDate | null>(null);

// modals https://vuejs.org/guide/built-ins/teleport.html#multiple-teleports-on-the-same-target

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

function handleEditClose(obj: JournalEntry) {
  editing.value = false;
  if (obj != null && !(obj instanceof JournalEntry)) {
    throw new Error("Returned object was not the right type " + obj);
  }
  toast.info(obj.category + " record saved");

  viewList.value = false; // remove full list on save
  props.editRow(obj);
}

function handleEditExit() {
  editing.value = false;
  toast.info("Record not saved");
}
function handleDelete(row: JournalEntry) {
  editing.value = false;
  props.deleteRow(row);
}
</script>

<template>
  <div>
    <h1 style="text-align: center" class="float">
      ${{ amountToday.toFixed(2) }}
      <span style="font-size: '.475em'">/day, today</span>
    </h1>

    <EditForm :entry="editing" />
  
    <span class="float-end" v-if="!viewList">
      <button class="btn btn-secondary" @click="viewList=true">View All</button>
    </span>
  </div>
  <MainBarGraphControl @view-report="viewReportFor"></MainBarGraphControl>
  
  <ReportView v-if="viewReport" :date="viewReport.date" :type="viewReport.type" @close-callback="viewReport = null"></ReportView>
  <FullRecordList v-if="viewList" :edit="handleEditEntry" :exit="viewList = false"></FullRecordList>
  
  <!--{props.saving && <BasicModal message="Saving..."/>}-->
  
  <RecordsToday />
</template>
