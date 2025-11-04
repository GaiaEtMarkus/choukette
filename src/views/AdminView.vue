<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBakeriesStore } from '@/stores/bakeries'
import { useProfessionalsStore } from '@/stores/professionals'
import { useMissionsStore } from '@/stores/missions'

const router = useRouter()
const authStore = useAuthStore()
const bakeriesStore = useBakeriesStore()
const professionalsStore = useProfessionalsStore()
const missionsStore = useMissionsStore()

const activeTab = ref<'bakeries' | 'professionals' | 'statistics'>('bakeries')

const bakeryPhotos = import.meta.glob('@/assets/boulangeries/*', { eager: true, import: 'default' }) as Record<string, string>
const professionalPhotos = import.meta.glob('@/assets/boulangers/*', { eager: true, import: 'default' }) as Record<string, string>

function getBakeryAvatar(filename?: string) {
  if (!filename) return ''
  const key = `/src/assets/boulangeries/${filename}`
  return bakeryPhotos[key] || ''
}

function getProfessionalAvatar(filename?: string) {
  if (!filename) return ''
  const key = `/src/assets/boulangers/${filename}`
  return professionalPhotos[key] || ''
}
const searchQuery = ref('')
const filterStatus = ref<'all' | 'verified' | 'pending' | 'suspended'>('all')

// S'assurer que les données sont générées
onMounted(() => {
  if (!authStore.isAuthenticated || authStore.userType !== 'admin') {
    router.push('/login')
    return
  }
  
  if (bakeriesStore.bakeries.length === 0) {
    bakeriesStore.generateMockBakeries()
  }
  if (professionalsStore.professionals.length === 0) {
    professionalsStore.generateMockProfessionals()
  }
  if (missionsStore.missions.length === 0) {
    missionsStore.generateMockMissions()
  }
})

const totalRevenue = computed(() => {
  // CA total = somme de tous les mois
  return monthlyRevenue.value.reduce((sum, month) => sum + month.revenue, 0)
})

const missionsStats = computed(() => {
  const missions = missionsStore.missions
  // Gonfler les chiffres pour avoir des stats impressionnantes
  return {
    total: missions.length + 120, // Ajouter 120 missions pour avoir plus de volume
    open: missions.filter(m => m.status === 'open').length + 25,
    filled: missions.filter(m => m.status === 'filled').length + 35,
    completed: missions.filter(m => m.status === 'completed').length + 55,
    cancelled: missions.filter(m => m.status === 'cancelled').length + 5
  }
})

const monthlyRevenue = computed(() => {
  const now = new Date()
  const months = []
  
  // Données mock fixes pour chaque mois (CA gonflé)
  const mockRevenueData = [
    45000, // Il y a 6 mois
    52000, // Il y a 5 mois
    48000, // Il y a 4 mois
    61000, // Il y a 3 mois
    58000, // Il y a 2 mois
    67000  // Ce mois
  ]
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthName = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
    
    // Utiliser les données mock pour garantir des chiffres sur tous les mois
    const dataIndex = 5 - i
    let revenue = mockRevenueData[dataIndex]
    
    // Ajouter aussi le CA réel des missions complétées ce mois-ci
    const completedMissions = missionsStore.missions.filter(m => 
      m.status === 'completed' && 
      m.createdAt.startsWith(monthKey.substring(0, 7))
    )
    completedMissions.forEach(mission => {
      revenue += mission.hourlyRate * 8 // 8h par mission en moyenne
    })
    
    months.push({
      month: monthName,
      monthKey,
      revenue: Math.round(revenue)
    })
  }
  return months
})

const maxRevenue = computed(() => Math.max(...monthlyRevenue.value.map(m => m.revenue), 1))

const filteredBakeries = computed(() => {
  let filtered = bakeriesStore.bakeries
  
  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(b => 
      b.name.toLowerCase().includes(query) ||
      b.email.toLowerCase().includes(query) ||
      b.city.toLowerCase().includes(query) ||
      b.siret?.includes(query)
    )
  }
  
  // Filtre par statut
  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(b => b.verificationStatus === filterStatus.value)
  }
  
  return filtered
})

const filteredProfessionals = computed(() => {
  let filtered = professionalsStore.professionals
  
  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(query) ||
      p.email?.toLowerCase().includes(query) ||
      p.location.city.toLowerCase().includes(query) ||
      p.siret?.includes(query)
    )
  }
  
  // Filtre par statut
  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(p => p.verificationStatus === filterStatus.value)
  }
  
  return filtered
})

const statusBadgeClass = (status?: string) => {
  switch (status) {
    case 'verified': return 'badge-success'
    case 'pending': return 'badge-warning'
    case 'suspended': return 'badge-error'
    case 'rejected': return 'badge-error'
    default: return 'badge-neutral'
  }
}

const statusLabel = (status?: string) => {
  switch (status) {
    case 'verified': return 'Vérifié'
    case 'pending': return 'En attente'
    case 'suspended': return 'Suspendu'
    case 'rejected': return 'Rejeté'
    default: return 'Non vérifié'
  }
}
</script>

<template>
  <div class="container-section py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-display font-bold text-chocolate-800">Administration</h1>
      <p class="text-chocolate-600 mt-1">Gestion des boulangeries et professionnels</p>
    </div>

    <!-- Tabs -->
    <div class="mb-6 border-b border-chocolate-200">
      <div class="flex gap-4">
        <button
          @click="activeTab = 'bakeries'"
          :class="[
            'pb-3 px-4 font-medium transition-colors',
            activeTab === 'bakeries'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-chocolate-600 hover:text-primary-600'
          ]"
        >
          Boulangeries ({{ bakeriesStore.bakeries.length }})
        </button>
        <button
          @click="activeTab = 'professionals'"
          :class="[
            'pb-3 px-4 font-medium transition-colors',
            activeTab === 'professionals'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-chocolate-600 hover:text-primary-600'
          ]"
        >
          Professionnels ({{ professionalsStore.professionals.length }})
        </button>
        <button
          @click="activeTab = 'statistics'"
          :class="[
            'pb-3 px-4 font-medium transition-colors',
            activeTab === 'statistics'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-chocolate-600 hover:text-primary-600'
          ]"
        >
          📊 Statistiques
        </button>
      </div>
    </div>

    <!-- Filtres -->
    <div v-if="activeTab !== 'statistics'" class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-chocolate-700 mb-2">Recherche</label>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="activeTab === 'bakeries' ? 'Nom, email, ville, SIRET...' : 'Nom, email, ville, SIRET...'"
            class="input-field w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-chocolate-700 mb-2">Statut de vérification</label>
          <select v-model="filterStatus" class="input-field w-full">
            <option value="all">Tous</option>
            <option value="verified">Vérifiés</option>
            <option value="pending">En attente</option>
            <option value="suspended">Suspendus</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tableau Boulangeries -->
    <div v-if="activeTab === 'bakeries'" class="card overflow-hidden p-0">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-cream-100 border-b border-chocolate-200">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold text-chocolate-800">Boulangerie</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-chocolate-800">Contact</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-chocolate-800">Localisation</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-chocolate-800">SIRET</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-chocolate-800">Statut</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-chocolate-800">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-chocolate-200">
            <tr
              v-for="bakery in filteredBakeries"
              :key="bakery.id"
              class="hover:bg-cream-50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img
                    v-if="bakery.avatar"
                    :src="getBakeryAvatar(bakery.avatar)"
                    :alt="bakery.name"
                    class="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p class="font-semibold text-chocolate-800">{{ bakery.name }}</p>
                    <p class="text-xs text-chocolate-500">{{ bakery.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-chocolate-700">{{ bakery.managerName || 'N/A' }}</p>
                <p class="text-xs text-chocolate-500">{{ bakery.phone || 'N/A' }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-chocolate-700">{{ bakery.city }}</p>
                <p class="text-xs text-chocolate-500">{{ bakery.postalCode }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-chocolate-700 font-mono">{{ bakery.siret || 'N/A' }}</p>
              </td>
              <td class="px-6 py-4">
                <span :class="statusBadgeClass(bakery.verificationStatus)" class="badge">
                  {{ statusLabel(bakery.verificationStatus) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <RouterLink
                  :to="`/admin/bakery/${bakery.id}`"
                  class="btn-primary text-xs px-3 py-1.5"
                >
                  Voir détails
                </RouterLink>
              </td>
            </tr>
            <tr v-if="filteredBakeries.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-chocolate-500">
                Aucune boulangerie trouvée
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tableau Professionnels -->
    <div v-if="activeTab === 'professionals'" class="card overflow-hidden p-0">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-cream-100 border-b border-chocolate-200">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold text-chocolate-800">Professionnel</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-chocolate-800">Contact</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-chocolate-800">Localisation</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-chocolate-800">SIRET</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-chocolate-800">Statut</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-chocolate-800">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-chocolate-200">
            <tr
              v-for="professional in filteredProfessionals"
              :key="professional.id"
              class="hover:bg-cream-50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img
                    v-if="professional.avatar"
                    :src="getProfessionalAvatar(professional.avatar)"
                    :alt="`${professional.firstName} ${professional.lastName}`"
                    class="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p class="font-semibold text-chocolate-800">{{ professional.firstName }} {{ professional.lastName }}</p>
                    <p class="text-xs text-chocolate-500">{{ professional.email || 'N/A' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-chocolate-700">{{ professional.phone || 'N/A' }}</p>
                <p class="text-xs text-chocolate-500">{{ professional.status || 'N/A' }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-chocolate-700">{{ professional.location.city }}</p>
                <p class="text-xs text-chocolate-500">{{ professional.location.postalCode }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-chocolate-700 font-mono">{{ professional.siret || 'N/A' }}</p>
              </td>
              <td class="px-6 py-4">
                <span :class="statusBadgeClass(professional.verificationStatus)" class="badge">
                  {{ statusLabel(professional.verificationStatus) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <RouterLink
                  :to="`/admin/professional/${professional.id}`"
                  class="btn-primary text-xs px-3 py-1.5"
                >
                  Voir détails
                </RouterLink>
              </td>
            </tr>
            <tr v-if="filteredProfessionals.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-chocolate-500">
                Aucun professionnel trouvé
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Onglet Statistiques -->
    <div v-if="activeTab === 'statistics'" class="space-y-6">
      <!-- Métriques principales -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="card text-center">
          <p class="text-3xl font-bold text-primary-600 mb-2">{{ totalRevenue.toLocaleString('fr-FR') }}€</p>
          <p class="text-sm text-chocolate-600">Chiffre d'affaires total</p>
        </div>
        <div class="card text-center">
          <p class="text-3xl font-bold text-green-600 mb-2">{{ missionsStats.total }}</p>
          <p class="text-sm text-chocolate-600">Missions totales</p>
        </div>
        <div class="card text-center">
          <p class="text-3xl font-bold text-blue-600 mb-2">{{ bakeriesStore.bakeries.length }}</p>
          <p class="text-sm text-chocolate-600">Boulangeries</p>
        </div>
        <div class="card text-center">
          <p class="text-3xl font-bold text-yellow-600 mb-2">{{ professionalsStore.professionals.length }}</p>
          <p class="text-sm text-chocolate-600">Professionnels</p>
        </div>
      </div>

      <!-- Statistiques missions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Graphique missions par statut -->
        <div class="card">
          <h2 class="text-xl font-semibold text-chocolate-800 mb-4">Missions par statut</h2>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-sm text-chocolate-600">Ouvertes</span>
                <span class="font-semibold text-chocolate-800">{{ missionsStats.open }}</span>
              </div>
              <div class="w-full bg-cream-100 rounded-full h-4">
                <div 
                  class="bg-yellow-500 h-4 rounded-full transition-all"
                  :style="{ width: `${(missionsStats.open / missionsStats.total) * 100}%` }"
                ></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-sm text-chocolate-600">En cours (pourvues)</span>
                <span class="font-semibold text-chocolate-800">{{ missionsStats.filled }}</span>
              </div>
              <div class="w-full bg-cream-100 rounded-full h-4">
                <div 
                  class="bg-blue-500 h-4 rounded-full transition-all"
                  :style="{ width: `${(missionsStats.filled / missionsStats.total) * 100}%` }"
                ></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-sm text-chocolate-600">Complétées</span>
                <span class="font-semibold text-chocolate-800">{{ missionsStats.completed }}</span>
              </div>
              <div class="w-full bg-cream-100 rounded-full h-4">
                <div 
                  class="bg-green-500 h-4 rounded-full transition-all"
                  :style="{ width: `${(missionsStats.completed / missionsStats.total) * 100}%` }"
                ></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-sm text-chocolate-600">Annulées</span>
                <span class="font-semibold text-chocolate-800">{{ missionsStats.cancelled }}</span>
              </div>
              <div class="w-full bg-cream-100 rounded-full h-4">
                <div 
                  class="bg-red-500 h-4 rounded-full transition-all"
                  :style="{ width: `${(missionsStats.cancelled / missionsStats.total) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Graphique CA mensuel -->
        <div class="card">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-chocolate-800">Chiffre d'affaires mensuel</h2>
            <span class="text-sm text-chocolate-500">Max: {{ maxRevenue.toLocaleString('fr-FR') }}€</span>
          </div>
          <div class="flex items-end justify-between gap-2 h-[200px]">
            <div
              v-for="(month, idx) in monthlyRevenue"
              :key="idx"
              class="flex-1 flex flex-col items-center"
            >
              <div class="relative w-full flex items-end justify-center" style="height: 180px;">
                <div
                  class="w-full bg-gradient-to-t from-primary-500 to-primary-300 rounded-t transition-all hover:from-primary-600 hover:to-primary-400 cursor-pointer group"
                  :style="{ height: `${Math.max((month.revenue / maxRevenue) * 180, 20)}px` }"
                  :title="`${month.month}: ${month.revenue.toLocaleString('fr-FR')}€`"
                >
                  <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs font-semibold text-chocolate-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {{ month.revenue.toLocaleString('fr-FR') }}€
                  </div>
                </div>
              </div>
              <p class="text-xs text-chocolate-600 mt-2 text-center">{{ month.month.split(' ')[0] }}</p>
              <p class="text-[10px] text-chocolate-400 hidden md:block">{{ month.month.split(' ')[1] }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistiques détaillées -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card">
          <h3 class="font-semibold text-chocolate-800 mb-3">Boulangeries</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-chocolate-600">Total</span>
              <span class="font-semibold">{{ bakeriesStore.bakeries.length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-chocolate-600">Vérifiées</span>
              <span class="font-semibold text-green-600">
                {{ bakeriesStore.bakeries.filter(b => b.verificationStatus === 'verified').length }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-chocolate-600">En attente</span>
              <span class="font-semibold text-yellow-600">
                {{ bakeriesStore.bakeries.filter(b => b.verificationStatus === 'pending').length }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-chocolate-600">Suspendues</span>
              <span class="font-semibold text-red-600">
                {{ bakeriesStore.bakeries.filter(b => b.verificationStatus === 'suspended').length }}
              </span>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="font-semibold text-chocolate-800 mb-3">Professionnels</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-chocolate-600">Total</span>
              <span class="font-semibold">{{ professionalsStore.professionals.length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-chocolate-600">Vérifiés</span>
              <span class="font-semibold text-green-600">
                {{ professionalsStore.professionals.filter(p => p.verificationStatus === 'verified').length }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-chocolate-600">Premium</span>
              <span class="font-semibold text-yellow-600">
                {{ professionalsStore.professionals.filter(p => p.isPremium).length }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-chocolate-600">En attente</span>
              <span class="font-semibold text-yellow-600">
                {{ professionalsStore.professionals.filter(p => p.verificationStatus === 'pending').length }}
              </span>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="font-semibold text-chocolate-800 mb-3">Performances</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-chocolate-600">Taux de complétion</span>
              <span class="font-semibold">
                {{ missionsStats.total > 0 ? Math.round((missionsStats.completed / missionsStats.total) * 100) : 0 }}%
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-chocolate-600">Moyenne CA/mission</span>
              <span class="font-semibold">
                {{ missionsStats.completed > 0 ? Math.round(totalRevenue / missionsStats.completed) : 0 }}€
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-chocolate-600">Missions actives</span>
              <span class="font-semibold text-blue-600">
                {{ missionsStats.open + missionsStats.filled }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-chocolate-600">Taux de remplissage</span>
              <span class="font-semibold">
                {{ missionsStats.total > 0 ? Math.round(((missionsStats.filled + missionsStats.completed) / missionsStats.total) * 100) : 0 }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

