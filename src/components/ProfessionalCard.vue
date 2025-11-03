<script setup lang="ts">
import { computed } from 'vue'
import type { Professional } from '@/stores/professionals'

const props = defineProps<{ professional: Professional }>()
const localPhotos = import.meta.glob('@/assets/boulangers/*', { eager: true, import: 'default' }) as Record<string, string>

const avatarSrc = computed(() => {
  const file = props.professional.avatar
  if (!file) return ''
  const key = `/src/assets/boulangers/${file}`
  return localPhotos[key] || file
})

const fullName = computed(() => `${props.professional.firstName} ${props.professional.lastName}`)
</script>

<template>
  <div class="card relative overflow-hidden p-0">
    <!-- Banner photo -->
    <div class="relative w-full h-40 md:h-48">
      <img v-if="avatarSrc" :src="avatarSrc" :alt="fullName" class="w-full h-full object-cover" />
      <span class="badge bg-white/90 text-chocolate-700 border border-neutral-200 absolute top-3 right-3">
        {{ professional.missionsCompleted }} missions
      </span>
      <span v-if="professional.isPremium" class="badge bg-yellow-100 text-yellow-800 border-yellow-300 absolute top-3 left-3">Premium</span>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <h3 class="text-lg font-semibold text-chocolate-800 truncate">{{ fullName }}</h3>
          <p class="text-sm text-chocolate-600 truncate">{{ professional.location.city }} ({{ professional.location.postalCode }}) • {{ professional.yearsExperience }} ans exp.</p>
        </div>
        <span class="badge bg-cream-100 text-chocolate-700 border border-cream-300">{{ professional.hourlyRate }}€/h</span>
      </div>

      <!-- Tags specialties/domains -->
      <div class="flex flex-wrap gap-2 mt-3">
        <span v-for="tag in professional.specialties" :key="tag" class="badge bg-cream-100 text-chocolate-700 border border-cream-300">{{ tag }}</span>
        <span v-for="dom in professional.domains" :key="dom" class="badge bg-neutral-100 text-neutral-800 border border-neutral-300">{{ dom }}</span>
      </div>

      <div class="mt-4">
        <RouterLink :to="`/professionnels/${professional.id}`" class="btn-primary inline-block">Voir plus</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


