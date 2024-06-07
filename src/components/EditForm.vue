<script setup lang="ts">
import JournalEntry from "@/service/journalEntry";
import SimpleModal from "./SimpleModal.vue";
import { computed, ref, watch } from "vue";
import DayTypeLib, { DayType } from "@/service/dayType";
import { Context } from "@/service/appContext";
import DateLib from "@/service/dateHelpers";
import { useToast } from 'vue-toastification';

const toast = useToast();

const props = defineProps<{
  entry: JournalEntry | undefined
}>();

const emits = defineEmits<{
  "closed": [void]
}>();

watch(() => props.entry, async (newQ) => {
  if (newQ) {
    editing.value = true;
    setTo(newQ);
  }
});

function setTo(entry?: JournalEntry) {
  amount.value = entry?.amount ?? 0;
  isIncome.value = entry?.isIncome ?? false;
  category.value = entry?.category ?? '';
  startDate.value = (entry?.from ?? DateLib.addOffsetToDate(new Date())).toISOString().substring(0, 10);
  periodCount.value = entry?.lengthCount ?? 1;
  periodType.value = entry?.lengthType ?? DayType.Day;
  repeats.value = entry?.repeats ?? false;
  lastDay.value = entry?.lastDay ? entry.lastDay.toISOString().substring(0, 10) : '';
  note.value = entry?.note || '';
  deleteConfirm.value = false;
  formAlert.value = '';
  toggleNewCategory.value = false;
  newCategory.value = '';
}

const editing = ref(false);
const formAlert = ref("");

const amount = ref(0);
const isIncome = ref(false);

const category = ref("");
const toggleNewCategory = ref(false);
const newCategory = ref("");

const startDate = ref(DateLib.addOffsetToDate(new Date()).toISOString().substring(0, 10));
const periodCount = ref(1);
const periodType = ref(DayType.Day);
const repeats = ref(false);
const lastDay = ref("");
const note = ref("");

const deleteConfirm = ref(false);

const perDay = computed(() => {
  if (amount.value && periodType.value && periodCount.value) {
    return amount.value/DayTypeLib.calcDayCount(periodType.value, periodCount.value);
  }
  return 0;
});

const categories = computed(() => Context.value.calc.categories);

function selectItemEventHandler(item: any) {
  category.value = item;
}
function onBlurEventHandler(event: any) {
  category.value = event.input.value;
}

function handleModalCancel() {
  setTo(undefined);
  emits('closed');
  editing.value = false;
  toast.info("Did not save '" + props.entry?.category + "'");
}

function handleModalConfirm() {
  if (!amount.value) { formAlert.value = "Please set a total amount"; return; }
  if (!startDate.value) { formAlert.value = "Please set a start date"; return; }
  if (!(periodCount.value) || !(periodType.value)) {
    formAlert.value = "Select both period length and period type";
    return;
  }
  const ourCategory = toggleNewCategory.value ? newCategory.value : category.value;
  if (!ourCategory) { formAlert.value = "Please set a category"; return; }

  const startDateDate = new Date(Date.parse(startDate.value));

  const entry = new JournalEntry(startDateDate, amount.value, periodCount.value, periodType.value, ourCategory.toLocaleLowerCase());
  entry.id = props.entry && props.entry instanceof JournalEntry ? props.entry.id : -1;
  entry.isIncome = isIncome.value;
  entry.repeats = repeats.value;
  if (lastDay.value)
    entry.lastDay = new Date(Date.parse(lastDay.value));
  
  const message = entry.validate();
  if (message) {
    formAlert.value = message;
    return;
  }

  console.log("Saving:", entry);
  Context.value.saveRow(entry, () => {
    // set everything back to the default
    setTo(undefined);
    emits('closed');
    editing.value = false;
    toast.info("Saved '" + entry.category + "'");
  }, (str) => {
    formAlert.value = str;
    toast.warning("Failed to save '" + entry.category + "'");
  });
}

const headingTextBetter = computed(() => props.entry ? "Edit Record" : "Add Record" + ": $"+ Math.round(perDay.value * 100)/100 + "/day");

function deleteEntry() {
  if (!props.entry) {
    toast.error("Deleting an entry that doesn't exist");
    setTo(undefined);
    emits('closed');
    editing.value = false;
    return;
  }

  Context.value.deleteRow(props.entry, () => {
    // set everything back to the default
    setTo(undefined);
    emits('closed');
    editing.value = false;
    toast.info("Deleted '" + props.entry?.category + "'");
  }, (str) => {
    formAlert.value = str;
    toast.warning("Failed to delete '" + props.entry?.category + "'");
  });
}
</script>

<template>
  
  <span class="float-start">
    <button class="btn btn-primary" :disabled="editing" @click="editing = true">Add</button>
  </span>

  <SimpleModal :open="editing" :heading-text="headingTextBetter" cancel-text="Cancel" confirm-text="Save Changes" @cancelled="handleModalCancel" @confirm="handleModalConfirm">
    <p v-if="formAlert" class="error">{{ formAlert }}</p>
    <form class="form-inline">
      <div class="row mb-2">
        <div class="col-7">
          <label for="amount" class="form-label">Amount</label>
          <div class="input-group">
            <span class="input-group-text">$</span>
            <input type="number" id="amount" class="form-control" v-model="amount" :autofocus="!props.entry" />
          </div>
        </div>
        <div class="col-5 form-check">
          <input type="checkbox" class="form-check-input" :checked="isIncome" id="isIncome" />
          <label for="isIncome" class="form-check-label">Is Income</label>
        </div>
      </div>
      <div class="row mb-2">
        <label for="category" class="col-3 col-form-label">Category</label>
        <button class="btn btn-info col-1" type="button" @click="toggleNewCategory = !toggleNewCategory">New</button>
        <div class="col-8">
          <input type="text" v-if="toggleNewCategory" class="form-control" v-model="newCategory" />
          <vue3-simple-typeahead
            v-if="!toggleNewCategory"
            id="category"
            class="form-select"
            :items="categories"
            :minInputLength="0"
            :defaultItem="category"
            @selectItem="selectItemEventHandler"
            @onBlur="onBlurEventHandler"
            >
            <template #list-item-text="slot"><span v-html="slot.boldMatchText(slot.itemProjection(slot.item))"></span></template>
          </vue3-simple-typeahead>
        </div>
      </div>
      <div class="row mb-2">
        <label for="startDate" class="col-form-label col-4">Start Date</label>
        <div class="col-8">
          <input type="date" class="form-control" id="startDate" v-model="startDate" />
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-4">
          <input type="number" class="form-control" v-model="periodCount" />
        </div>
        <div class="col-8">
          <select class="form-select" v-model="periodType">
            <option :value="DayType.Day">Day</option>
            <option :value="DayType.Week">Week</option>
            <option :value="DayType.Month">Month</option>
            <option :value="DayType.Quarter">Quarter</option>
            <option :value="DayType.Year">Year</option>
          </select>
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-4 form-check">
          <input type="checkbox" class="form-check-input" id="repeats" :checked="repeats" />
          <label for="repeats" class="form-check-label">Repeats</label>
        </div>
        <div class="col-8">
          <input type="date" class="form-control" v-model="lastDay" />
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-4">
          <label class="form-label col-xs-4">Free Text</label>
        </div>
        <div class="col-8">
          <textarea class="form-control" v-model="note" rows="3"></textarea>
        </div>
      </div>
    </form>
    <div class="row">
      <button v-if="props.entry" class="btn btn-danger col-3" @click="deleteConfirm = true" :disabled="deleteConfirm">Delete</button>
      <div class="col-3"></div>
      <button v-if="props.entry && deleteConfirm" class="btn btn-danger col-3" @click="deleteEntry" :disabled="!deleteConfirm">REALLY Delete</button>
    </div>
  </SimpleModal>
</template>

<style scoped>
.error {
  color: red;
}
</style>
