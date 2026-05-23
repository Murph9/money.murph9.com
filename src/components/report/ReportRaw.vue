<script setup lang="ts">
import { computed } from 'vue';
import type JournalEntry from '@/service/journalEntry';
import RowsTable from '../RowsTable.vue';

const props = defineProps<{
  data: JournalEntry[];
}>();

const dataSorted = computed(() => {
  return [...props.data].sort((x, y) => x.calcPerDay() - y.calcPerDay());
});
</script>

<template>
  <RowsTable :data="dataSorted" :show-edit="false" :show-note="true" :one-line="true"></RowsTable>
</template>
