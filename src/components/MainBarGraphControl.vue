<script setup lang="ts">
import { DayType } from '@/service/dayType';
import { ref } from 'vue';
import MainBarGraph from "./MainBarGraph.vue";

const emit = defineEmits<{
    viewReport: [type: DayType, date: Date]
}>();

const periodType = ref(DayType.Day);
const periodOffset = ref<number>(0);

function viewReport(type: DayType, date: Date) {
    emit("viewReport", type, date);
}


</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col-2"></div>
            <div class="input-group col">
                <button class="btn btn-primary" @click="periodOffset--">&lt;-</button>
                <select class="form-select" v-model="periodType">
                    <option :value="DayType.Day">Day</option>
                    <option :value="DayType.Week">Week</option>
                    <option :value="DayType.Month">Month</option>
                    <option :value="DayType.Year">Year</option>
                </select>
                <button class="btn btn-primary" @click="periodOffset++">-&gt;</button>
            </div>
            <div class="col-2"></div>
        </div>
    </div>
    <MainBarGraph :period-type="periodType" :period-offset="periodOffset" @view-report="viewReport"></MainBarGraph>
</template>
