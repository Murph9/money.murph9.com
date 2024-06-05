<script setup lang="ts">
import { Context } from '@/service/appContext';
import DateLib from '@/service/dateHelpers';
import DayTypeLib, { DayType } from '@/service/dayType';
import { computed } from 'vue';

const formattedRecords = computed(() => {
    const today = DateLib.treatAsUTC(DayTypeLib.setToStart(new Date(), DayType.Day));
    return Context.value.calc.rowsForDay(today).filter(x => x.from.getTime() === today.getTime());
});
</script>

<template>
    <div v-if="formattedRecords.length > 0">
        <p>Records that start today:</p>
        <div v-for="record in formattedRecords" v-bind:key="record.id">
            - {{ record.category }} <code>${{ record.amount.toFixed(2) }}</code> for <code> {{ Math.abs(record.calcPerDay()).toFixed(2) }}</code>/d
        </div>
    </div>
</template>
