import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface CompletedMission {
  id: string
  missionId: string
  title: string
  bakeryName: string
  completedDate: string
  hours: number
  hourlyRate: number
  totalEarnings: number
  rating?: number
  review?: string
}

export const useProfessionalsStatsStore = defineStore('professionalsStats', () => {
  const completedMissions = ref<CompletedMission[]>([])
  const currentProfessionalId = ref<string | null>(null)

  // Stats computed
  const totalEarnings = computed(() => 
    completedMissions.value.reduce((sum, m) => sum + m.totalEarnings, 0)
  )
  const totalHours = computed(() => 
    completedMissions.value.reduce((sum, m) => sum + m.hours, 0)
  )
  const averageRating = computed(() => {
    const rated = completedMissions.value.filter(m => m.rating)
    if (!rated.length) return 0
    return rated.reduce((sum, m) => sum + (m.rating || 0), 0) / rated.length
  })
  const missionsThisMonth = computed(() => {
    const now = new Date()
    return completedMissions.value.filter(m => {
      const date = new Date(m.completedDate)
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })
  })

  // Stats historiques 6 derniers mois (données fixes pour la démo)
  const monthlyStatsData = ref<Array<{
    month: string
    monthKey: string
    missionsCompleted: number
    totalHours: number
    totalEarnings: number
    avgRating: number
  }>>([])

  // Initialiser les stats une seule fois
  function initializeMonthlyStats() {
    if (monthlyStatsData.value.length > 0) return // Déjà initialisé
    
    const months = []
    const now = new Date()
    // Données fixes pour la démo (cohérentes et croissantes)
    const data = [
      { missions: 3, hours: 36, rate: 26, earnings: 936, rating: 4.4 },
      { missions: 4, hours: 48, rate: 27, earnings: 1296, rating: 4.5 },
      { missions: 5, hours: 60, rate: 28, earnings: 1680, rating: 4.6 },
      { missions: 6, hours: 72, rate: 29, earnings: 2088, rating: 4.7 },
      { missions: 7, hours: 84, rate: 30, earnings: 2520, rating: 4.8 },
      { missions: 8, hours: 96, rate: 31, earnings: 2976, rating: 4.9 }
    ]
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const dataIndex = 5 - i
      months.push({
        month: date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
        monthKey,
        missionsCompleted: data[dataIndex].missions,
        totalHours: data[dataIndex].hours,
        totalEarnings: data[dataIndex].earnings,
        avgRating: data[dataIndex].rating
      })
    }
    monthlyStatsData.value = months
  }

  const monthlyStats = computed(() => {
    if (monthlyStatsData.value.length === 0) {
      initializeMonthlyStats()
    }
    return monthlyStatsData.value
  })

  function loadProfessionalData(professionalId: string) {
    currentProfessionalId.value = professionalId
    // Initialiser les stats mensuelles si pas encore fait
    initializeMonthlyStats()
    // Mock: générer des missions complétées variées (plus nombreuses pour le planning)
    completedMissions.value = [
      {
        id: 'cm1',
        missionId: '1',
        title: 'Remplacement weekend - Boulangerie du Moulin',
        bakeryName: 'Boulangerie du Moulin',
        completedDate: '2024-01-28',
        hours: 16,
        hourlyRate: 28,
        totalEarnings: 448,
        rating: 5,
        review: 'Excellent travail, très professionnel.'
      },
      {
        id: 'cm2',
        missionId: '3',
        title: 'Vendeur/Vendeuse - CDI week-end',
        bakeryName: 'La Mie Dorée',
        completedDate: '2024-02-04',
        hours: 14,
        hourlyRate: 22,
        totalEarnings: 308,
        rating: 4
      },
      {
        id: 'cm3',
        missionId: '5',
        title: 'Boulanger levain - Remplacement matin',
        bakeryName: 'Le Levain Parisien',
        completedDate: '2024-02-12',
        hours: 24,
        hourlyRate: 29,
        totalEarnings: 696,
        rating: 5,
        review: 'Très satisfait du travail réalisé.'
      },
      {
        id: 'cm4',
        missionId: '7',
        title: 'Pâtissier - Mission événement',
        bakeryName: 'Pâtisserie Délices',
        completedDate: '2024-02-18',
        hours: 20,
        hourlyRate: 32,
        totalEarnings: 640,
        rating: 5,
        review: 'Excellent professionnel, très créatif.'
      },
      {
        id: 'cm5',
        missionId: '9',
        title: 'Tourneur - Production viennoiseries',
        bakeryName: 'La Feuilletée',
        completedDate: '2024-02-20',
        hours: 12,
        hourlyRate: 28,
        totalEarnings: 336,
        rating: 4
      },
      {
        id: 'cm6',
        missionId: '11',
        title: 'Boulanger - Remplacement urgent',
        bakeryName: 'Boulangerie du Canal',
        completedDate: '2024-02-22',
        hours: 18,
        hourlyRate: 30,
        totalEarnings: 540,
        rating: 5
      }
    ]
  }

  return {
    completedMissions,
    currentProfessionalId,
    totalEarnings,
    totalHours,
    averageRating,
    missionsThisMonth,
    monthlyStats,
    loadProfessionalData
  }
})

