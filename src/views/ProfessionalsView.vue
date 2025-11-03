<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProfessionalsStore } from '@/stores/professionals'
import ProfessionalCard from '@/components/ProfessionalCard.vue'

const store = useProfessionalsStore()

const q = ref('')
const domain = ref('')
const specialty = ref('')
const minExp = ref<number | null>(null)
const premiumOnly = ref(false)
const sortBy = ref<'experience' | 'rate' | 'missions' | ''>('')
const sortOrder = ref<'asc' | 'desc'>('desc')

const domains = ['Pain et viennoiserie', 'Pâtisserie', 'Tournier/Tourier', 'Traiteur boulanger', 'Spécialisations techniques']
const specialties = computed(() => {
  const set = new Set<string>()
  store.professionals.forEach(p => p.specialties.forEach(s => set.add(s)))
  return Array.from(set)
})

onMounted(() => {
  if (!store.professionals.length) store.generateMockProfessionals()
})

const filtered = computed(() => {
  let list = store.professionals
  if (premiumOnly.value) list = list.filter(p => p.isPremium)
  if (domain.value) list = list.filter(p => p.domains.includes(domain.value))
  if (specialty.value) list = list.filter(p => p.specialties.includes(specialty.value))
  if (minExp.value) list = list.filter(p => p.yearsExperience >= (minExp.value as number))
  if (q.value.trim()) {
    const s = q.value.toLowerCase()
    list = list.filter(p =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(s) ||
      p.specialties.some(sp => sp.toLowerCase().includes(s))
    )
  }
  if (sortBy.value) {
    const factor = sortOrder.value === 'asc' ? 1 : -1
    list = [...list].sort((a, b) => {
      if (sortBy.value === 'experience') return factor * (a.yearsExperience - b.yearsExperience)
      if (sortBy.value === 'rate') return factor * (a.hourlyRate - b.hourlyRate)
      if (sortBy.value === 'missions') return factor * (a.missionsCompleted - b.missionsCompleted)
      return 0
    })
  }
  return list
})
</script>

<template>
  <div class="container-section py-10">
    <div class="mb-8">
      <h1 class="text-3xl font-display font-bold text-chocolate-800">Professionnels</h1>
      <p class="text-chocolate-600 mt-1">Découvrez des profils certifiés et expérimentés</p>
    </div>

    <div class="card mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input v-model="q" type="text" placeholder="Rechercher un nom ou une spécialité" class="input-field" />
        <select v-model="domain" class="input-field">
          <option value="">Tous domaines</option>
          <option v-for="d in domains" :key="d" :value="d">{{ d }}</option>
        </select>
        <select v-model="specialty" class="input-field">
          <option value="">Toutes spécialités</option>
          <option v-for="s in specialties" :key="s" :value="s">{{ s }}</option>
        </select>
        <input v-model.number="minExp" type="number" min="0" placeholder="Expérience min (années)" class="input-field" />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <select v-model="sortBy" class="input-field">
          <option value="">Tri par défaut</option>
          <option value="experience">Trier par expérience</option>
          <option value="rate">Trier par tarif</option>
          <option value="missions">Trier par missions réalisées</option>
        </select>
        <select v-model="sortOrder" class="input-field">
          <option value="desc">Ordre décroissant</option>
          <option value="asc">Ordre croissant</option>
        </select>
        <label class="flex items-center gap-2 text-chocolate-700">
          <input type="checkbox" v-model="premiumOnly" class="rounded border-neutral-300" /> Premium uniquement
        </label>
        <button class="btn-secondary" @click="q=''; domain=''; specialty=''; minExp=null; sortBy=''; sortOrder='desc'; premiumOnly=false">Réinitialiser</button>
      </div>
    </div>

    <p class="text-sm text-chocolate-600 mb-4">{{ filtered.length }} professionnel(s) trouvé(s)</p>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <ProfessionalCard v-for="p in filtered" :key="p.id" :professional="p" />
    </div>
  </div>
</template>

<style scoped>
</style>


