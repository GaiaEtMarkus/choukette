<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProfessionalsStore, type Professional } from '@/stores/professionals'

const route = useRoute()
const router = useRouter()
const store = useProfessionalsStore()

const localPhotos = import.meta.glob('@/assets/boulangers/*', { eager: true, import: 'default' }) as Record<string, string>

const professional = computed<Professional | undefined>(() => store.getProfessionalById(String(route.params.id)))

const avatarSrc = computed(() => {
  const p = professional.value
  if (!p?.avatar) return ''
  const key = `/src/assets/boulangers/${p.avatar}`
  return localPhotos[key] || p.avatar
})

const fullName = computed(() => professional.value ? `${professional.value.firstName} ${professional.value.lastName}` : '')

function goBack() {
  router.push('/professionnels')
}

const bioSentences = computed(() => {
  const p = professional.value
  if (!p?.bio) return [] as string[]
  const matches = p.bio.match(/[^.!?\n]+[.!?]+|[^.!?\n]+$/g)
  return matches ? matches.map(s => s.trim()) : [p.bio]
})
</script>

<template>
  <div class="container-section py-8" v-if="professional">
    <button class="text-chocolate-600 hover:text-primary-600 text-sm mb-6" @click="goBack">← Retour</button>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="card overflow-hidden p-0">
          <div v-if="avatarSrc" class="w-full bg-neutral-100 flex items-center justify-center">
            <img :src="avatarSrc" :alt="fullName" class="max-h-96 w-full object-contain" />
          </div>
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div>
                <h1 class="text-2xl font-display font-bold text-chocolate-800">{{ fullName }}</h1>
                <p class="text-chocolate-600 mt-1">{{ professional.location.city }} ({{ professional.location.postalCode }}) • {{ professional.yearsExperience }} ans d'expérience</p>
              </div>
              <div class="text-right space-y-1">
                <span class="badge bg-white text-chocolate-700 border border-neutral-300">{{ professional.missionsCompleted }} missions</span>
                <span v-if="professional.isPremium" class="badge bg-yellow-100 text-yellow-800 border-yellow-300 block">Premium</span>
              </div>
            </div>

            <div class="flex flex-wrap gap-2 mt-4">
              <span v-for="sp in professional.specialties" :key="sp" class="badge bg-cream-100 text-chocolate-700 border border-cream-300">{{ sp }}</span>
              <span v-for="d in professional.domains" :key="d" class="badge bg-neutral-100 text-neutral-800 border border-neutral-300">{{ d }}</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm">
              <div class="card">
                <p class="text-chocolate-700"><span class="font-medium">Tarif horaire:</span> {{ professional.hourlyRate }}€/h</p>
                <p class="text-chocolate-700 mt-2"><span class="font-medium">Certifications:</span> {{ professional.certifications.join(', ') }}</p>
              </div>
              <div class="card">
                <p class="text-chocolate-700"><span class="font-medium">Missions réalisées:</span> {{ professional.missionsCompleted }}</p>
                <p class="text-chocolate-700 mt-2"><span class="font-medium">Statut:</span> {{ professional.isPremium ? 'Premium' : 'Standard' }}</p>
              </div>
            </div>

            <div class="mt-6">
              <h2 class="text-lg font-semibold text-chocolate-800 mb-2">Présentation</h2>
              <div class="text-chocolate-700 leading-relaxed space-y-3">
                <p v-for="(s, i) in bioSentences" :key="i">{{ s }}</p>
              </div>
            </div>

            <div class="mt-6" v-if="professional.experiences?.length">
              <h2 class="text-lg font-semibold text-chocolate-800 mb-2">Expériences récentes</h2>
              <ul class="space-y-3">
                <li
                  v-for="(exp, idx) in professional.experiences"
                  :key="idx"
                  class="card"
                >
                  <div class="flex items-center justify-between">
                    <p class="font-medium text-chocolate-800">{{ exp.bakeryName }}</p>
                    <span class="text-sm text-chocolate-600">{{ exp.period }}</span>
                  </div>
                  <p class="text-sm text-chocolate-700 mt-1">{{ exp.role }} • {{ exp.city }}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="card">
          <p class="text-sm text-chocolate-600">Contact</p>
          <button class="btn-primary w-full mt-3">Proposer une mission</button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="container-section py-16 text-center text-chocolate-700">Professionnel introuvable.</div>
</template>

<style scoped>
</style>


