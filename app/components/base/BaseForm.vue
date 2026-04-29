<template>
    <form @submit.prevent="onSubmit" class="space-y-4">
        <slot/>
        <button 
            type="submit"
            :disabled="isLoading"
            :class="className"
            >
            {{ isLoading ? "Loading..." : submitText }}
        </button>
        <p v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </p>
    </form>

</template>
<script setup>
const props = defineProps({
    submitText: {
        type: String,
        default: "submit"
    },
    isLoading: {
        type: Boolean,
        default: false
    },
    error: {
        type: String,
        default: ""

    },
    className: {
        type: String,
        default: "w-full bg-blue-500 text-white p-3 rounded-lg disabled:opacity-50"
    }
})

const emit = defineEmits(["submit"])

const onSubmit = () => {
    emit("submit")
}
</script>