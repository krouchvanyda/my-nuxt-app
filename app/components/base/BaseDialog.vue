<template>
  <Dialog 
    v-model:visible="model" modal 
    :header="props.header" 
    :style="{ width: '25rem'}" 
    :closable="props.closable" 
    @hide="onCloseButton"
    :pt="{
      root: { style: 'border-radius: 10px; overflow: hidden;' },
      header: { class: 'bg-white text-green-500' },
      content: { class: 'bg-white' }
    }"
    >
    <slot></slot>
  </Dialog>
</template>
<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  header: {
    type: String,
    default: "Create New Item"
  },
  saveText: {
    type: String,
    default: "Save"
  },
  closable: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(["update:visible", "save", "close"])
const model = computed({
  get: () => props.visible,
  set: (val) => emit("update:visible", val)
})

const onCloseButton = () => {
  emit("update:visible", false)
  emit("close")
}
</script>