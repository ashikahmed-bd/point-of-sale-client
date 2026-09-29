<script setup>
defineProps({
    text: {
        type: String,
        default: 'No Data Available'
    }
});
</script>
<template>
    <div class="flex flex-col items-center justify-center py-12 text-gray-400">
        <svg class="w-16 h-16 mb-4 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h5l2 2h5a2 2 0 012 2v10a2 2 0 01-2 2z" />
        </svg>
        <p class="text-lg font-medium">{{ text }}</p>
    </div>
</template>


<style scoped></style>
