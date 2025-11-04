<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBakeriesStore } from '@/stores/bakeries'
import { useMissionsStore } from '@/stores/missions'
import { useAuthStore } from '@/stores/auth'
import MissionCard from '@/components/MissionCard.vue'

const router = useRouter()
const bakeryStore = useBakeriesStore()
const missionsStore = useMissionsStore()
const authStore = useAuthStore()

const localPhotos = import.meta.glob('@/assets/boulangers/*', { eager: true, import: 'default' }) as Record<string, string>

function getAvatarSrc(filename?: string) {
  if (!filename) return ''
  const key = `/src/assets/boulangers/${filename}`
  return localPhotos[key] || ''
}

onMounted(() => {
  if (!authStore.isAuthenticated || authStore.userType !== 'bakery') {
    router.push('/login')
    return
  }
  
  // Initialiser les données depuis localStorage si disponibles
  bakeryStore.initializeBakeryData()
  
  // Si pas de boulangerie chargée, essayer de charger depuis les données mock
  if (!bakeryStore.currentBakery) {
    // Pour la démo, on peut créer une boulangerie par défaut
    const bakery = bakeryStore.bakeries[0]
    if (bakery) {
      bakeryStore.currentBakery = bakery
      bakeryStore.loadBakeryData(bakery.id, missionsStore.missions)
    }
  } else {
    // Si on a déjà une boulangerie, recharger les données au cas où
    bakeryStore.loadBakeryData(bakeryStore.currentBakery.id, missionsStore.missions)
  }
  
  // Force l'initialisation des stats mensuelles
  if (bakeryStore.monthlyStats && bakeryStore.monthlyStats.length === 0) {
    const _ = bakeryStore.monthlyStats // Force l'évaluation
  }
})

const recentApplications = computed(() => 
  bakeryStore.bakeryApplications.slice(0, 5).sort((a, b) => 
    new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
  )
)

const maxMissionsPosted = computed(() => 
  bakeryStore.monthlyStats && bakeryStore.monthlyStats.length > 0
    ? Math.max(...bakeryStore.monthlyStats.map(s => s.missionsPosted), 1)
    : 12
)

const maxApplicationsReceived = computed(() => 
  bakeryStore.monthlyStats && bakeryStore.monthlyStats.length > 0
    ? Math.max(...bakeryStore.monthlyStats.map(s => s.applicationsReceived), 1)
    : 30
)
</script>

<template>
  <div class="container-section py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-display font-bold text-chocolate-800">
        Dashboard - {{ bakeryStore.currentBakery?.name }}
      </h1>
      <p class="text-chocolate-600 mt-1">Gérez vos missions et candidatures</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <p class="text-sm text-chocolate-600 mb-1">Total missions</p>
        <p class="text-3xl font-bold text-primary-600">{{ bakeryStore.totalMissions }}</p>
        <p class="text-xs text-chocolate-500 mt-1">+{{ bakeryStore.monthlyStats[5]?.missionsPosted || 0 }} ce mois</p>
        <p class="text-xs text-green-600 mt-1 font-semibold">↑ +12% vs mois dernier</p>
      </div>
      <div class="card">
        <p class="text-sm text-chocolate-600 mb-1">Missions ouvertes</p>
        <p class="text-3xl font-bold text-accent-600">{{ bakeryStore.openMissions }}</p>
        <p class="text-xs text-chocolate-500 mt-1">Actives</p>
        <p class="text-xs text-chocolate-500 mt-1">Délai moyen: 2.3 jours</p>
      </div>
      <div class="card">
        <p class="text-sm text-chocolate-600 mb-1">Missions pourvues</p>
        <p class="text-3xl font-bold text-green-600">{{ bakeryStore.filledMissions }}</p>
        <p class="text-xs text-chocolate-500 mt-1">Taux: {{ bakeryStore.totalMissions > 0 ? Math.round((bakeryStore.filledMissions / bakeryStore.totalMissions) * 100) : 0 }}%</p>
        <p class="text-xs text-green-600 mt-1">Note moyenne: 4.7/5</p>
      </div>
      <div class="card">
        <p class="text-sm text-chocolate-600 mb-1">Candidatures en attente</p>
        <p class="text-3xl font-bold text-yellow-600">{{ bakeryStore.pendingApplications }}</p>
        <p class="text-xs text-chocolate-500 mt-1">À traiter</p>
        <p class="text-xs text-chocolate-500 mt-1">Temps moyen réponse: 4h</p>
      </div>
    </div>

    <!-- Stats supplémentaires -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card">
        <p class="text-sm text-chocolate-600 mb-1">Taux de conversion</p>
        <p class="text-2xl font-bold text-primary-600">
          {{ bakeryStore.totalApplications > 0 ? Math.round((bakeryStore.filledMissions / bakeryStore.totalApplications) * 100) : 0 }}%
        </p>
        <p class="text-xs text-chocolate-500 mt-1">Candidatures → Missions pourvues</p>
      </div>
      <div class="card">
        <p class="text-sm text-chocolate-600 mb-1">Candidatures totales</p>
        <p class="text-2xl font-bold text-accent-600">{{ bakeryStore.totalApplications }}</p>
        <p class="text-xs text-chocolate-500 mt-1">Moyenne: {{ bakeryStore.totalMissions > 0 ? Math.round(bakeryStore.totalApplications / bakeryStore.totalMissions) : 0 }} par mission</p>
      </div>
      <div class="card">
        <p class="text-sm text-chocolate-600 mb-1">Note moyenne</p>
        <p class="text-2xl font-bold text-green-600">4.7</p>
        <p class="text-xs text-chocolate-500 mt-1">Basée sur {{ bakeryStore.monthlyStats.reduce((sum, s) => sum + s.missionsFilled, 0) }} missions</p>
      </div>
    </div>

    <!-- Graphique 6 derniers mois -->
    <div class="card mb-8">
      <h2 class="text-xl font-semibold text-chocolate-800 mb-6">Évolution sur 6 mois</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Colonne 1 -->
        <div class="flex flex-col">
          <div>
            <h3 class="text-sm font-medium text-chocolate-700 mb-2">Missions postées</h3>
            <span class="text-xs text-chocolate-500 block mb-8">max: {{ maxMissionsPosted }}</span>
          </div>
          <div class="relative flex-1">
            <!-- Zone graphique -->
            <div class="flex items-end gap-2 pb-6 border-b border-chocolate-200" style="height: 180px; padding-left: 2rem;">
              <template v-if="bakeryStore.monthlyStats && bakeryStore.monthlyStats.length > 0">
                <div 
                  v-for="(stat, idx) in bakeryStore.monthlyStats" 
                  :key="idx"
                  class="flex-1 flex flex-col items-center gap-1 group relative"
                >
                  <div 
                    class="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t transition-all hover:from-primary-700 hover:to-primary-500 cursor-pointer shadow-sm hover:shadow-md"
                    :style="{ 
                      height: maxMissionsPosted > 0 
                        ? `${Math.max((stat.missionsPosted / maxMissionsPosted) * 160, 20)}px` 
                        : '20px',
                      minHeight: '20px'
                    }"
                    :title="`${stat.month}: ${stat.missionsPosted} missions`"
                  ></div>
                  <span class="text-xs font-semibold text-chocolate-800 mt-1">{{ stat.missionsPosted }}</span>
                  <span class="text-xs text-chocolate-600 text-center font-medium">{{ stat.month.split(' ')[0] }}</span>
                  <span class="text-xs text-chocolate-500 text-center">{{ stat.month.split(' ')[1] }}</span>
                </div>
              </template>
              <p v-else class="text-sm text-chocolate-500 text-center w-full py-4">Chargement des données...</p>
            </div>
            <!-- Axe Y simplifié -->
            <div v-if="bakeryStore.monthlyStats && bakeryStore.monthlyStats.length > 0" class="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-chocolate-400 pr-2">
              <span>{{ maxMissionsPosted }}</span>
              <span>{{ Math.round(maxMissionsPosted / 2) }}</span>
              <span>0</span>
            </div>
          </div>
        </div>
        <!-- Colonne 2 -->
        <div class="flex flex-col">
          <div>
            <h3 class="text-sm font-medium text-chocolate-700 mb-2">Candidatures reçues</h3>
            <span class="text-xs text-chocolate-500 block mb-8">max: {{ maxApplicationsReceived }}</span>
          </div>
          <div class="relative flex-1">
            <!-- Zone graphique -->
            <div class="flex items-end gap-2 pb-6 border-b border-chocolate-200" style="height: 180px; padding-left: 2rem;">
              <template v-if="bakeryStore.monthlyStats && bakeryStore.monthlyStats.length > 0">
                <div 
                  v-for="(stat, idx) in bakeryStore.monthlyStats" 
                  :key="idx"
                  class="flex-1 flex flex-col items-center gap-1 group relative"
                >
                  <div 
                    class="w-full bg-gradient-to-t from-accent-600 to-accent-400 rounded-t transition-all hover:from-accent-700 hover:to-accent-500 cursor-pointer shadow-sm hover:shadow-md"
                    :style="{ 
                      height: maxApplicationsReceived > 0 
                        ? `${Math.max((stat.applicationsReceived / maxApplicationsReceived) * 160, 20)}px` 
                        : '20px',
                      minHeight: '20px'
                    }"
                    :title="`${stat.month}: ${stat.applicationsReceived} candidatures`"
                  ></div>
                  <span class="text-xs font-semibold text-chocolate-800 mt-1">{{ stat.applicationsReceived }}</span>
                  <span class="text-xs text-chocolate-600 text-center font-medium">{{ stat.month.split(' ')[0] }}</span>
                  <span class="text-xs text-chocolate-500 text-center">{{ stat.month.split(' ')[1] }}</span>
                </div>
              </template>
              <p v-else class="text-sm text-chocolate-500 text-center w-full py-4">Chargement des données...</p>
            </div>
            <!-- Axe Y simplifié -->
            <div v-if="bakeryStore.monthlyStats && bakeryStore.monthlyStats.length > 0" class="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-chocolate-400 pr-2">
              <span>{{ maxApplicationsReceived }}</span>
              <span>{{ Math.round(maxApplicationsReceived / 2) }}</span>
              <span>0</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <!-- Missions récentes -->
      <div class="lg:col-span-2">
        <h2 class="text-xl font-semibold text-chocolate-800 mb-4">Missions récentes</h2>
        <div class="space-y-4">
          <MissionCard 
            v-for="mission in bakeryStore.bakeryMissions.slice(0, 3)" 
            :key="mission.id" 
            :mission="mission" 
          />
        </div>
      </div>

      <!-- Planning & Notifications -->
      <div class="space-y-6">
        <!-- Planning prochaines missions -->
        <div>
          <h2 class="text-xl font-semibold text-chocolate-800 mb-4">Planning</h2>
          <div class="card">
            <div class="space-y-3">
              <div 
                v-for="mission in bakeryStore.bakeryMissions.filter(m => m.status === 'filled' || m.status === 'open').slice(0, 5)"
                :key="mission.id"
                class="border-l-4 border-primary-500 pl-3"
              >
                <p class="font-medium text-chocolate-800 text-sm">{{ mission.title }}</p>
                <p class="text-xs text-chocolate-600 mt-1">{{ new Date(mission.startDate).toLocaleDateString('fr-FR') }}</p>
                <p class="text-xs text-chocolate-500">{{ mission.schedule }}</p>
                <span :class="mission.status === 'filled' ? 'badge-success' : 'badge-warning'" class="badge text-xs mt-1">
                  {{ mission.status === 'filled' ? 'Pourvue' : 'Ouverte' }}
                </span>
              </div>
              <p v-if="bakeryStore.bakeryMissions.filter(m => m.status === 'filled' || m.status === 'open').length === 0" class="text-sm text-chocolate-500 text-center py-4">
                Aucune mission planifiée
              </p>
            </div>
          </div>
        </div>

        <!-- Candidatures récentes -->
        <div>
          <h2 class="text-xl font-semibold text-chocolate-800 mb-4">Candidatures récentes</h2>
          <div class="space-y-3">
            <div 
              v-for="app in recentApplications" 
              :key="app.id"
              class="card"
            >
              <div class="flex items-start gap-3">
                <img 
                  :src="getAvatarSrc(app.professionalAvatar)"
                  :alt="app.professionalName"
                  class="w-12 h-12 rounded-full object-cover"
                />
                <div class="flex-1">
                  <p class="font-semibold text-chocolate-800">{{ app.professionalName }}</p>
                  <p class="text-sm text-chocolate-600 mt-1 line-clamp-2">{{ app.message }}</p>
                  <div class="flex gap-2 mt-2">
                    <span :class="app.status === 'pending' ? 'badge-warning' : 'badge-success'" class="badge">
                      {{ app.status === 'pending' ? 'En attente' : 'Acceptée' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

