<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProfessionalsStatsStore } from '@/stores/professionalsStats'
import { useAuthStore } from '@/stores/auth'
import { useProfessionalsStore } from '@/stores/professionals'
import { useMissionsStore } from '@/stores/missions'

const router = useRouter()
const statsStore = useProfessionalsStatsStore()
const authStore = useAuthStore()
const professionalsStore = useProfessionalsStore()
const missionsStore = useMissionsStore()

const currentPro = computed(() => {
  if (!authStore.user) return null
  // Pour la démo, on prend le premier pro
  return professionalsStore.professionals[0]
})

onMounted(() => {
  if (!authStore.isAuthenticated || authStore.userType !== 'professional') {
    router.push('/login')
    return
  }
  if (currentPro.value) {
    statsStore.loadProfessionalData(currentPro.value.id)
  }
  // Force l'initialisation des stats mensuelles
  if (statsStore.monthlyStats && statsStore.monthlyStats.length === 0) {
    // L'initialisation se fait automatiquement via le computed, mais on peut accéder pour forcer
    const _ = statsStore.monthlyStats // Force l'évaluation
  }
})

const earningsThisMonth = computed(() => 
  statsStore.missionsThisMonth.reduce((sum, m) => sum + m.totalEarnings, 0)
)

// Missions recommandées basées sur les spécialités
const recommendedMissions = computed(() => {
  if (!currentPro.value) return []
  const specialties = currentPro.value.specialties
  return missionsStore.openMissions
    .filter(m => 
      specialties.some(s => 
        m.requirements?.specialties?.some(ms => ms.toLowerCase().includes(s.toLowerCase())) ||
        m.position === currentPro.value?.specialties[0]?.toLowerCase()
      )
    )
    .slice(0, 3)
})

const maxEarnings = computed(() => {
  if (!statsStore.monthlyStats || statsStore.monthlyStats.length === 0) {
    // Force l'initialisation si nécessaire
    if (statsStore.monthlyStats && statsStore.monthlyStats.length === 0) {
      return 2976 // Valeur par défaut basée sur les données
    }
    return 0
  }
  const max = Math.max(...statsStore.monthlyStats.map(s => s.totalEarnings), 1)
  return max
})

const maxMissions = computed(() => {
  if (!statsStore.monthlyStats || statsStore.monthlyStats.length === 0) {
    // Force l'initialisation si nécessaire
    if (statsStore.monthlyStats && statsStore.monthlyStats.length === 0) {
      return 8 // Valeur par défaut basée sur les données
    }
    return 0
  }
  const max = Math.max(...statsStore.monthlyStats.map(s => s.missionsCompleted), 1)
  return max
})
</script>

<template>
  <div class="container-section py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-display font-bold text-chocolate-800">
        Dashboard - {{ currentPro?.firstName }} {{ currentPro?.lastName }}
      </h1>
      <p class="text-chocolate-600 mt-1">Suivez vos missions et votre activité</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <p class="text-sm text-chocolate-600 mb-1">Chiffre d'affaires total</p>
        <p class="text-3xl font-bold text-primary-600">{{ Math.round(statsStore.totalEarnings) }}€</p>
        <p class="text-xs text-chocolate-500 mt-1">{{ statsStore.completedMissions.length }} missions</p>
        <p class="text-xs text-green-600 mt-1 font-semibold">↑ +18% vs 6 mois</p>
      </div>
      <div class="card">
        <p class="text-sm text-chocolate-600 mb-1">Heures travaillées</p>
        <p class="text-3xl font-bold text-accent-600">{{ statsStore.totalHours }}h</p>
        <p class="text-xs text-chocolate-500 mt-1">Moyenne: {{ statsStore.totalHours > 0 ? Math.round(statsStore.totalEarnings / statsStore.totalHours) : 0 }}€/h</p>
        <p class="text-xs text-chocolate-500 mt-1">Moyenne/mois: {{ Math.round(statsStore.totalHours / 6) }}h</p>
      </div>
      <div class="card">
        <p class="text-sm text-chocolate-600 mb-1">Note moyenne</p>
        <p class="text-3xl font-bold text-green-600">
          {{ statsStore.averageRating > 0 ? statsStore.averageRating.toFixed(1) : 'N/A' }}
        </p>
        <p class="text-xs text-chocolate-500 mt-1">{{ statsStore.completedMissions.filter(m => m.rating).length }} évaluations</p>
        <p class="text-xs text-green-600 mt-1">Top 10% de la plateforme</p>
      </div>
      <div class="card">
        <p class="text-sm text-chocolate-600 mb-1">Missions ce mois</p>
        <p class="text-3xl font-bold text-yellow-600">{{ statsStore.missionsThisMonth.length }}</p>
        <p class="text-xs text-chocolate-500 mt-1">{{ Math.round(earningsThisMonth) }}€ gagnés</p>
        <p class="text-xs text-chocolate-500 mt-1">Objectif: 8 missions</p>
      </div>
    </div>

    <!-- Stats supplémentaires -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card">
        <p class="text-sm text-chocolate-600 mb-1">Taux d'acceptation</p>
        <p class="text-2xl font-bold text-primary-600">87%</p>
        <p class="text-xs text-chocolate-500 mt-1">Candidatures acceptées</p>
      </div>
      <div class="card">
        <p class="text-sm text-chocolate-600 mb-1">Taux de complétion</p>
        <p class="text-2xl font-bold text-green-600">100%</p>
        <p class="text-xs text-chocolate-500 mt-1">Toutes missions terminées</p>
      </div>
      <div class="card">
        <p class="text-sm text-chocolate-600 mb-1">Boulangeries partenaires</p>
        <p class="text-2xl font-bold text-accent-600">{{ new Set(statsStore.completedMissions.map(m => m.bakeryName)).size }}</p>
        <p class="text-xs text-chocolate-500 mt-1">Relations durables</p>
      </div>
    </div>

    <!-- Graphique 6 derniers mois -->
    <div class="card mb-8">
      <h2 class="text-xl font-semibold text-chocolate-800 mb-6">Évolution sur 6 mois</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-sm font-medium text-chocolate-700">Chiffre d'affaires mensuel</h3>
            <span class="text-xs text-chocolate-500">max: {{ maxEarnings }}€</span>
          </div>
          <div class="relative">
            <!-- Zone graphique -->
            <div class="flex items-end gap-2 pb-6 border-b border-chocolate-200" style="height: 180px; padding-left: 2rem;">
              <template v-if="statsStore.monthlyStats && statsStore.monthlyStats.length > 0">
                <div 
                  v-for="(stat, idx) in statsStore.monthlyStats" 
                  :key="idx"
                  class="flex-1 flex flex-col items-center gap-1 group relative"
                >
                  <div 
                    class="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t transition-all hover:from-primary-700 hover:to-primary-500 cursor-pointer shadow-sm hover:shadow-md"
                    :style="{ 
                      height: maxEarnings > 0 
                        ? `${Math.max((stat.totalEarnings / maxEarnings) * 160, 20)}px` 
                        : '20px',
                      minHeight: '20px'
                    }"
                    :title="`${stat.month}: ${stat.totalEarnings}€`"
                  ></div>
                  <span class="text-xs font-semibold text-chocolate-800 mt-1">{{ stat.totalEarnings }}€</span>
                  <span class="text-xs text-chocolate-600 text-center font-medium">{{ stat.month.split(' ')[0] }}</span>
                  <span class="text-xs text-chocolate-500 text-center">{{ stat.month.split(' ')[1] }}</span>
                </div>
              </template>
              <p v-else class="text-sm text-chocolate-500 text-center w-full py-4">Chargement des données...</p>
            </div>
            <!-- Axe Y simplifié -->
            <div class="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-chocolate-400 pr-2">
              <span>{{ maxEarnings }}€</span>
              <span>{{ Math.round(maxEarnings / 2) }}€</span>
              <span>0€</span>
            </div>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-sm font-medium text-chocolate-700">Missions complétées</h3>
            <span class="text-xs text-chocolate-500">max: {{ maxMissions }}</span>
          </div>
          <div class="relative">
            <!-- Zone graphique -->
            <div class="flex items-end gap-2 pb-6 border-b border-chocolate-200" style="height: 180px; padding-left: 2rem;">
              <template v-if="statsStore.monthlyStats && statsStore.monthlyStats.length > 0">
                <div 
                  v-for="(stat, idx) in statsStore.monthlyStats" 
                  :key="idx"
                  class="flex-1 flex flex-col items-center gap-1 group relative"
                >
                  <div 
                    class="w-full bg-gradient-to-t from-accent-600 to-accent-400 rounded-t transition-all hover:from-accent-700 hover:to-accent-500 cursor-pointer shadow-sm hover:shadow-md"
                    :style="{ 
                      height: maxMissions > 0 
                        ? `${Math.max((stat.missionsCompleted / maxMissions) * 160, 20)}px` 
                        : '20px',
                      minHeight: '20px'
                    }"
                    :title="`${stat.month}: ${stat.missionsCompleted} missions`"
                  ></div>
                  <span class="text-xs font-semibold text-chocolate-800 mt-1">{{ stat.missionsCompleted }}</span>
                  <span class="text-xs text-chocolate-600 text-center font-medium">{{ stat.month.split(' ')[0] }}</span>
                  <span class="text-xs text-chocolate-500 text-center">{{ stat.month.split(' ')[1] }}</span>
                </div>
              </template>
              <p v-else class="text-sm text-chocolate-500 text-center w-full py-4">Chargement des données...</p>
            </div>
            <!-- Axe Y simplifié -->
            <div class="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-chocolate-400 pr-2">
              <span>{{ maxMissions }}</span>
              <span>{{ Math.round(maxMissions / 2) }}</span>
              <span>0</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <!-- Missions complétées -->
      <div class="lg:col-span-2">
        <h2 class="text-xl font-semibold text-chocolate-800 mb-4">Missions complétées</h2>
        <div class="space-y-4">
          <div 
            v-for="mission in statsStore.completedMissions" 
            :key="mission.id"
            class="card"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="font-semibold text-chocolate-800">{{ mission.title }}</h3>
                <p class="text-sm text-chocolate-600 mt-1">{{ mission.bakeryName }}</p>
                <div class="flex gap-4 mt-3 text-sm text-chocolate-700">
                  <span>{{ mission.hours }}h</span>
                  <span>{{ mission.hourlyRate }}€/h</span>
                  <span class="font-semibold">{{ mission.totalEarnings }}€</span>
                  <span class="text-chocolate-500">{{ new Date(mission.completedDate).toLocaleDateString('fr-FR') }}</span>
                </div>
                <div v-if="mission.rating" class="mt-2">
                  <span class="text-yellow-600">★</span>
                  <span class="text-chocolate-700">{{ mission.rating }}/5</span>
                  <p v-if="mission.review" class="text-sm text-chocolate-600 mt-1">{{ mission.review }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Opportunités & Planning -->
      <div class="space-y-6">
        <!-- Missions recommandées -->
        <div>
          <h2 class="text-xl font-semibold text-chocolate-800 mb-4">Opportunités</h2>
          <div class="card">
            <div class="space-y-3">
              <div 
                v-for="mission in recommendedMissions"
                :key="mission.id"
                class="border-l-4 border-accent-500 pl-3"
              >
                <p class="font-medium text-chocolate-800 text-sm">{{ mission.title }}</p>
                <p class="text-xs text-chocolate-600 mt-1">{{ mission.bakeryName }}</p>
                <p class="text-xs text-primary-600 font-semibold mt-1">{{ mission.hourlyRate }}€/h</p>
                <RouterLink :to="`/missions/${mission.id}`" class="text-xs text-primary-600 hover:underline mt-1 inline-block">
                  Voir détails →
                </RouterLink>
              </div>
              <p v-if="recommendedMissions.length === 0" class="text-sm text-chocolate-500">Aucune mission recommandée pour le moment</p>
            </div>
          </div>
        </div>

        <!-- Planning prochaines missions -->
        <div>
          <h2 class="text-xl font-semibold text-chocolate-800 mb-4">Planning</h2>
          <div class="card">
            <div class="space-y-3">
              <div 
                v-for="mission in statsStore.completedMissions.slice(0, 5)"
                :key="mission.id"
                class="border-l-4 border-green-500 pl-3"
              >
                <p class="font-medium text-chocolate-800 text-sm">{{ mission.title }}</p>
                <p class="text-xs text-chocolate-600 mt-1">{{ new Date(mission.completedDate).toLocaleDateString('fr-FR') }}</p>
                <p class="text-xs text-green-600 font-semibold mt-1">✓ Complétée • {{ mission.totalEarnings }}€</p>
              </div>
              <p v-if="statsStore.completedMissions.length === 0" class="text-sm text-chocolate-500 text-center py-4">
                Aucune mission complétée
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

