<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="visible"
      class="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-primary-200 px-6 py-4 flex items-center gap-3 min-w-[300px] max-w-md"
      role="alert"
    >
      <!-- Icone de succès -->
      <div class="flex-shrink-0">
        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <!-- Message -->
      <p class="flex-1 text-chocolate-800 font-medium">{{ message }}</p>
      
      <!-- Bouton fermer -->
      <button
        @click="$emit('close')"
        class="flex-shrink-0 text-chocolate-400 hover:text-chocolate-600 transition-colors"
        aria-label="Fermer"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  message: string
}>()

defineEmits<{
  close: []
}>()
</script>

<style scoped>
/* Animation personnalisée pour le snackbar */
</style>

