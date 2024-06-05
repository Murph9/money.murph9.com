<script setup lang="ts">

const props = withDefaults(defineProps<{
  open: boolean
  showFooter: boolean
  cancelText: string
  confirmText: string
  headingText: string
}>(), {
  showFooter: true,
  headingText: "Heading",
  cancelText: "Cancel",
  confirmText: "Confirm"
});
const emits = defineEmits<{
  cancelled: [void],
  confirm: [void]
}>();
</script>

<template>
  <div v-if="props.open" class="modal" :style="{display: props.open ? 'block' : 'none'}">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5>{{ props.headingText }}</h5>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer" v-if="props.showFooter">
          <button class="btn btn-secondary" @click="emits('cancelled')">{{ props.cancelText }}</button>
          <button class="btn btn-primary" @click="emits('confirm')">{{ props.confirmText }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
