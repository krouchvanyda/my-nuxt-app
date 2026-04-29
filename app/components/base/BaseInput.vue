<template>
    <input 
        :value="modelValue" 
        :type="tyep" 
        :placeholder="placeholder" 
        :class="className"
        @input="handleInput"
    />
</template>
<script setup>

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  tyep: {
    type: String,
    default: "text"
  },
  placeholder: {
    tyep: String,
    default: "",
  },
  className: {
    tyee: String,
    default: "w-full border border-gray-500 p-3 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500 text-black"
  }
})

const emit = defineEmits(["update:modelValue"])

const handleInput = (event) => {
  emit("update:modelValue", event.target.value)
}
</script>