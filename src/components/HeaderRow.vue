<script setup lang="ts">
import { computed } from "vue";
import { APP } from "../constants";
import { Context } from '../service/appContext';

const version = import.meta.env.PACKAGE_VERSION;

function logout() {
  Context.value.loggedOut = true;
  Context.value.setDb(undefined);
}

const lastSaved = computed(() => {
  return new Date(Context.value.getLastModified() ?? new Date(0));
});
</script>

<template>
  <div class="d-flex p-2">
    <h2>{{ APP.title }}</h2>
    <pre class="flex-fill">v{{ version }}</pre>
    <span v-if="Context.successful()">
      <p style="text-align: right; margin-bottom: 0;" :title="`${Context.getLastUserAgent()}`">
        <pre>{{ lastSaved.toLocaleDateString() }}&nbsp;{{ lastSaved.toLocaleTimeString() }}</pre>
        <pre>Total count: {{ Context.getCount() ?? 0 }}</pre>
      </p>
    </span>
    &nbsp;&nbsp;
    <span v-if="Context.successful()" class="float-last">
      <button @click="logout" type="button" class="btn btn-sm btn-outline-secondary">Log out</Button>
    </span>
  </div>
</template>