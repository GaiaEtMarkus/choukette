<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMissionsStore, type Mission } from '@/stores/missions'

const route = useRoute()
const router = useRouter()
const store = useMissionsStore()

const localImages = import.meta.glob('@/assets/boulangeries/*', { eager: true, import: 'default' }) as Record<string, string>

const mission = computed<Mission | undefined>(() => {
  const id = String(route.params.id)
  return store.getMissionById(id)
})

const maskedLocation = computed(() => {
  const m = mission.value
  if (!m) return ''
  const city = m.location.city
  const postal = m.location.postalCode
  return postal ? `${city} (${postal})` : city
})

const avatarSrc = computed(() => {
  const m = mission.value
  if (!m) return ''
  const avatar = m.bakeryAvatar
  const key = avatar ? `/src/assets/boulangeries/${avatar}` : ''
  if (key && localImages[key]) return localImages[key]
  return avatar || ''
})

const tags = computed(() => {
  const m = mission.value
  if (!m) return [] as string[]
  const base = [m.position]
  const specialties = m.requirements?.specialties ?? []
  return [...base, ...specialties]
})

// Découper automatiquement la description en phrases pour une meilleure lisibilité
const descriptionSentences = computed(() => {
  const m = mission.value
  if (!m || !m.description) return [] as string[]
  const matches = m.description.match(/[^.!?\n]+[.!?]+|[^.!?\n]+$/g)
  return matches ? matches.map(s => s.trim()) : [m.description]
})

function goBack() {
  router.push('/missions')
}
</script>

<template>
  <div class="container-section py-8" v-if="mission">
    <button class="text-chocolate-600 hover:text-primary-600 text-sm mb-6" @click="goBack">← Retour aux missions</button>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="card overflow-hidden p-0">
          <div v-if="avatarSrc" class="w-full bg-neutral-100 flex items-center justify-center">
            <img :src="avatarSrc" :alt="mission.bakeryName" class="max-h-96 w-full object-contain" />
          </div>
          <div class="p-6">
            <h1 class="text-2xl font-display font-bold text-chocolate-800">{{ mission.title }}</h1>
            <p class="text-chocolate-600 mt-1">{{ mission.bakeryName }} • {{ maskedLocation }}</p>

            <div class="flex flex-wrap gap-2 mt-4">
              <span v-for="tag in tags" :key="tag" class="badge bg-cream-100 text-chocolate-700 border border-cream-300">{{ tag }}</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm">
              <div class="card">
                <p class="text-chocolate-700"><span class="font-medium">Type:</span> {{ mission.type }}</p>
                <p class="text-chocolate-700 mt-2"><span class="font-medium">Durée:</span> {{ mission.duration }}</p>
                <p class="text-chocolate-700 mt-2"><span class="font-medium">Horaires:</span> {{ mission.schedule }}</p>
              </div>
              <div class="card">
                <p class="text-chocolate-700"><span class="font-medium">Tarif horaire:</span> {{ mission.hourlyRate }}€/h</p>
                <p v-if="mission.urgency" class="text-accent-600 mt-2"><span class="font-medium">Urgence:</span> {{ mission.urgency }}</p>
                <p class="text-chocolate-700 mt-2"><span class="font-medium">Candidatures:</span> {{ mission.applicants }}</p>
              </div>
            </div>

            <div class="mt-6">
              <h2 class="text-lg font-semibold text-chocolate-800 mb-2">Description</h2>
              <div class="text-chocolate-700 leading-relaxed space-y-3">
                <p v-for="(sentence, idx) in descriptionSentences" :key="idx">{{ sentence }}</p>
              </div>
            </div>

            <div class="mt-6">
              <h2 class="text-lg font-semibold text-chocolate-800 mb-2">Exigences</h2>
              <ul class="list-disc pl-5 text-chocolate-700">
                <li>Expérience: {{ mission.requirements.experience }} ans</li>
                <li v-if="mission.requirements.certifications.length">Certifications: {{ mission.requirements.certifications.join(', ') }}</li>
                <li v-if="mission.requirements.specialties.length">Spécialités: {{ mission.requirements.specialties.join(', ') }}</li>
              </ul>
            </div>

            <!-- Avis de la boulangerie (si mission complétée) -->
            <div v-if="mission.status === 'completed' && mission.bakeryReview" class="mt-6">
              <h2 class="text-lg font-semibold text-chocolate-800 mb-4">Avis de la boulangerie</h2>
              <div class="card bg-cream-50 border border-cream-200">
                <div class="flex items-center gap-2 mb-2">
                  <div class="flex items-center">
                    <span 
                      v-for="star in 5" 
                      :key="star"
                      class="text-2xl"
                      :class="star <= mission.bakeryReview.rating ? 'text-yellow-500' : 'text-gray-300'"
                    >
                      ★
                    </span>
                  </div>
                  <span class="text-sm text-chocolate-600 font-medium">
                    {{ mission.bakeryReview.rating }}/5
                  </span>
                  <span class="text-xs text-chocolate-500 ml-auto">
                    {{ new Date(mission.bakeryReview.reviewedAt).toLocaleDateString('fr-FR') }}
                  </span>
                </div>
                <p v-if="mission.bakeryReview.comment" class="text-chocolate-700 leading-relaxed mt-2">
                  {{ mission.bakeryReview.comment }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="card">
          <p class="text-sm text-chocolate-600">Localisation</p>
          <p class="font-medium text-chocolate-800">{{ maskedLocation }}</p>
          <button v-if="mission.status === 'open'" class="btn-primary w-full mt-4">Postuler à cette mission</button>
          <div v-else-if="mission.status === 'completed'" class="mt-4">
            <span class="badge-success badge">Mission complétée</span>
          </div>
          <div v-else-if="mission.status === 'filled'" class="mt-4">
            <span class="badge-warning badge">Mission pourvue</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="container-section py-16 text-center text-chocolate-700">
    Mission introuvable.
  </div>
</template>

<style scoped>
</style>


