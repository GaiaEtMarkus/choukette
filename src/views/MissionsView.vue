<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import MissionCard from '@/components/MissionCard.vue'
import { useMissionsStore, type Mission } from '@/stores/missions'

type Position = Mission['position']
type TypeMission = Mission['type']

const store = useMissionsStore()

// Filtres basiques pour la démo
const searchText = ref('')
const position = ref<Position | ''>('')
const type = ref<TypeMission | ''>('')
const urgentOnly = ref(false)
const minRate = ref<number | null>(null)
const maxRate = ref<number | null>(null)

const positions: Position[] = ['boulanger','patissier','vendeur','tourneur']
const types: TypeMission[] = ['ponctuel','recurrent','urgence','evenement']

onMounted(() => {
  // S'assurer que les mocks sont présents
  if (!store.missions.length) store.generateMockMissions()
})

const filteredMissions = computed(() => {
  let list = store.searchMissions({
    position: position.value || undefined,
    type: type.value || undefined,
    minRate: minRate.value ?? undefined,
    maxRate: maxRate.value ?? undefined,
    urgentOnly: urgentOnly.value || undefined,
  })

  if (searchText.value.trim()) {
    const q = searchText.value.toLowerCase()
    list = list.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.bakeryName.toLowerCase().includes(q) ||
      (m.requirements?.specialties || []).some(s => s.toLowerCase().includes(q))
    )
  }

  // Paris et alentours (simple filtre postal pour la démo)
  list = list.filter(m => /^75|^92|^93|^94/.test(m.location.postalCode))
  
  return list
})

function resetFilters() {
  searchText.value = ''
  position.value = ''
  type.value = ''
  urgentOnly.value = false
  minRate.value = null
  maxRate.value = null
}
</script>

<template>
  <div class="container-section py-10">
    <div class="mb-8">
      <h1 class="text-3xl font-display font-bold text-chocolate-800">Missions disponibles</h1>
      <p class="text-chocolate-600 mt-1">Trouvez la mission idéale à Paris et alentours</p>
    </div>

    <!-- Filtres -->
    <div class="card mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input v-model="searchText" type="text" placeholder="Rechercher (titre, spécialité, établissement)" class="input-field" />

        <select v-model="position" class="input-field">
          <option value="">Tous postes</option>
          <option v-for="p in positions" :key="p" :value="p">{{ p }}</option>
        </select>

        <select v-model="type" class="input-field">
          <option value="">Tous types</option>
          <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
        </select>

        <label class="flex items-center gap-2 text-chocolate-700">
          <input type="checkbox" v-model="urgentOnly" class="rounded border-neutral-300" />
          Urgent uniquement
        </label>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <input v-model.number="minRate" type="number" min="0" placeholder="Tarif min (€/h)" class="input-field" />
        <input v-model.number="maxRate" type="number" min="0" placeholder="Tarif max (€/h)" class="input-field" />
        <button @click="resetFilters" class="btn-secondary w-full">Réinitialiser</button>
      </div>
    </div>

    <!-- Résultats -->
    <div class="flex items-center justify-between mb-4">
      <p class="text-sm text-chocolate-600">{{ filteredMissions.length }} mission(s) trouvée(s)</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <MissionCard v-for="m in filteredMissions" :key="m.id" :mission="m" />
    </div>

    <div v-if="!filteredMissions.length" class="text-center text-chocolate-600 py-16">
      Aucune mission ne correspond à vos filtres.
    </div>
  </div>
</template>

<style scoped>
</style>


