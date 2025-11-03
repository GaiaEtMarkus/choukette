<script setup lang="ts">
import { computed } from 'vue'
import type { Mission } from '@/stores/missions'
import logoChoukette from '@/assets/logoChoukette.png'
// Map des images locales des boulangeries (nom de fichier -> URL)
const localImages = import.meta.glob('@/assets/boulangeries/*', { eager: true, import: 'default' }) as Record<string, string>

const props = defineProps<{ mission: Mission }>()

const typeColor = computed(() => {
  switch (props.mission.type) {
    case 'urgence':
      return 'bg-accent-100 text-accent-700 border-accent-200'
    case 'recurrent':
      return 'bg-primary-50 text-primary-700 border-primary-200'
    case 'evenement':
      return 'bg-cream-100 text-chocolate-700 border-cream-300'
    default:
      return 'bg-neutral-100 text-neutral-700 border-neutral-200'
  }
})

const maskedLocation = computed(() => {
  const city = props.mission.location.city
  const postal = props.mission.location.postalCode
  // Masquage: afficher uniquement arrondissement / code postal
  return postal ? `${city} (${postal})` : city
})

const tags = computed(() => {
  const base = [props.mission.position]
  const specialties = props.mission.requirements?.specialties ?? []
  return [...base, ...specialties]
})

const avatarSrc = computed(() => {
  const avatar = props.mission.bakeryAvatar
  if (!avatar) return logoChoukette
  // Si avatar correspond à un fichier local, le résoudre
  const localKey = `/src/assets/boulangeries/${avatar}`
  if (localImages[localKey]) return localImages[localKey]
  // Sinon considérer que c'est une URL distante
  return avatar
})
</script>

<template>
  <div class="card relative overflow-hidden p-0">
    <div class="relative w-full h-40 md:h-48">
      <img :src="avatarSrc" :alt="mission.bakeryName" class="w-full h-full object-cover" />
      <span class="badge border rounded-full px-3 py-1 text-xs font-medium absolute top-3 right-3" :class="typeColor">{{ mission.type }}</span>
    </div>
    <div class="p-6">
      <div class="min-w-0">
        <h3 class="text-lg font-semibold text-chocolate-800 truncate">{{ mission.title }}</h3>
        <p class="text-sm text-chocolate-600 truncate">{{ mission.bakeryName }} • {{ maskedLocation }}</p>
      </div>
      <div class="flex flex-wrap gap-2 mt-3">
        <span
          v-for="tag in tags"
          :key="tag"
          class="badge bg-cream-100 text-chocolate-700 border border-cream-300"
        >
          {{ tag }}
        </span>
      </div>
      <div class="mt-4 grid grid-cols-2 sm:flex sm:flex-wrap gap-3 text-sm">
        <div class="flex items-center gap-2 text-chocolate-700">
          <span class="font-medium">Durée:</span>
          <span>{{ mission.duration }}</span>
        </div>
        <div class="flex items-center gap-2 text-chocolate-700">
          <span class="font-medium">Horaires:</span>
          <span>{{ mission.schedule }}</span>
        </div>
        <div class="flex items-center gap-2 text-chocolate-700">
          <span class="font-medium">Tarif:</span>
          <span>{{ mission.hourlyRate }}€/h</span>
        </div>
        <div class="flex items-center gap-2 text-chocolate-700" v-if="mission.urgency">
          <span class="font-medium">Urgence:</span>
          <span class="text-accent-600">{{ mission.urgency }}</span>
        </div>
      </div>
      <div class="mt-4">
        <RouterLink :to="`/missions/${mission.id}`" class="btn-primary inline-block">Voir plus</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


