import { ref, computed, onMounted } from 'vue'
import { defineStore } from 'pinia'
import type { Mission, Application } from './missions'

export interface Bakery {
  id: string
  name: string
  email: string
  password: string // pour la démo
  address: string
  city: string
  postalCode: string
  avatar?: string
  description?: string
  createdAt: string
}

export const useBakeriesStore = defineStore('bakeries', () => {
  const bakeries = ref<Bakery[]>([])
  const currentBakery = ref<Bakery | null>(null)
  const bakeryMissions = ref<Mission[]>([])
  const bakeryApplications = ref<Application[]>([])

  // Stats computed
  const totalMissions = computed(() => bakeryMissions.value.length)
  const openMissions = computed(() => bakeryMissions.value.filter(m => m.status === 'open').length)
  const filledMissions = computed(() => bakeryMissions.value.filter(m => m.status === 'filled').length)
  const totalApplications = computed(() => bakeryApplications.value.length)
  const pendingApplications = computed(() => bakeryApplications.value.filter(a => a.status === 'pending').length)

  // Stats historiques 6 derniers mois (données fixes pour la démo)
  const monthlyStatsData = ref<Array<{
    month: string
    monthKey: string
    missionsPosted: number
    missionsFilled: number
    applicationsReceived: number
    avgRating: number
  }>>([])

  // Initialiser les stats une seule fois
  function initializeMonthlyStats() {
    if (monthlyStatsData.value.length > 0) return // Déjà initialisé
    
    const months = []
    const now = new Date()
    // Données fixes pour la démo (cohérentes)
    const data = [
      { missionsPosted: 5, missionsFilled: 3, applicationsReceived: 12, avgRating: 4.3 },
      { missionsPosted: 7, missionsFilled: 5, applicationsReceived: 18, avgRating: 4.5 },
      { missionsPosted: 6, missionsFilled: 4, applicationsReceived: 15, avgRating: 4.4 },
      { missionsPosted: 8, missionsFilled: 6, applicationsReceived: 20, avgRating: 4.6 },
      { missionsPosted: 9, missionsFilled: 7, applicationsReceived: 22, avgRating: 4.7 },
      { missionsPosted: 10, missionsFilled: 8, applicationsReceived: 25, avgRating: 4.8 }
    ]
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const dataIndex = 5 - i
      months.push({
        month: date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
        monthKey,
        missionsPosted: data[dataIndex].missionsPosted,
        missionsFilled: data[dataIndex].missionsFilled,
        applicationsReceived: data[dataIndex].applicationsReceived,
        avgRating: data[dataIndex].avgRating
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

  // Fonction pour sélectionner un avatar aléatoire
  function getRandomBakeryAvatar(): string {
    const avatars = Array.from({ length: 22 }, (_, i) => `boulangerie${i + 1}.jpeg`)
    return avatars[Math.floor(Math.random() * avatars.length)]
  }

  function generateMockBakeries() {
    const bks: Bakery[] = [
      {
        id: 'bakery1',
        name: 'Boulangerie du Moulin',
        email: 'boulangerie@moulin.fr',
        password: 'demo123',
        address: '23 Rue de Rivoli',
        city: 'Paris',
        postalCode: '75001',
        avatar: getRandomBakeryAvatar(),
        description: 'Boulangerie artisanale familiale depuis 1950',
        createdAt: '2020-01-15'
      },
      {
        id: 'bakery2',
        name: 'Pâtisserie Délices',
        email: 'contact@delices.fr',
        password: 'demo123',
        address: '45 Avenue des Champs-Élysées',
        city: 'Paris',
        postalCode: '75008',
        avatar: getRandomBakeryAvatar(),
        description: 'Pâtisserie fine haut de gamme',
        createdAt: '2018-03-20'
      }
    ]
    bakeries.value = bks
  }

  function login(email: string, password: string) {
    const bakery = bakeries.value.find(b => b.email === email && b.password === password)
    if (bakery) {
      currentBakery.value = bakery
      // Charger les missions et candidatures de cette boulangerie
      loadBakeryData(bakery.id)
      // Sauvegarder après connexion
      saveBakeryDataToStorage()
      return Promise.resolve(bakery)
    }
    return Promise.reject(new Error('Identifiants incorrects'))
  }

  // Initialiser les données depuis localStorage au démarrage
  function initializeBakeryData() {
    loadBakeryDataFromStorage()
    if (monthlyStatsData.value.length === 0) {
      initializeMonthlyStats()
      saveBakeryDataToStorage()
    }
  }

  // Fonctions de sauvegarde/chargement localStorage
  function saveBakeryDataToStorage() {
    if (currentBakery.value) {
      const data = {
        currentBakery: currentBakery.value,
        bakeryMissions: bakeryMissions.value,
        bakeryApplications: bakeryApplications.value,
        monthlyStatsData: monthlyStatsData.value
      }
      localStorage.setItem('choukette_bakery_data', JSON.stringify(data))
    }
  }

  function loadBakeryDataFromStorage() {
    const saved = localStorage.getItem('choukette_bakery_data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        currentBakery.value = data.currentBakery
        bakeryMissions.value = data.bakeryMissions || []
        bakeryApplications.value = data.bakeryApplications || []
        if (data.monthlyStatsData && data.monthlyStatsData.length > 0) {
          monthlyStatsData.value = data.monthlyStatsData
        }
        return true
      } catch (error) {
        console.error('Erreur lors du chargement des données boulangerie:', error)
        localStorage.removeItem('choukette_bakery_data')
      }
    }
    return false
  }

  function clearBakeryDataFromStorage() {
    localStorage.removeItem('choukette_bakery_data')
  }

  function loadBakeryData(bakeryId: string, missionsList: Mission[] = []) {
    // Essayer de charger depuis localStorage
    const loaded = loadBakeryDataFromStorage()
    if (loaded && currentBakery.value?.id === bakeryId) {
      // Données déjà chargées depuis localStorage
      return
    }

    // Sinon, charger/générer les données
    currentBakery.value = bakeries.value.find(b => b.id === bakeryId) || null
    
    // Mock: charger les missions de cette boulangerie
    let filtered = missionsList.filter((m: Mission) => m.bakeryId === bakeryId)
    
    // Si pas assez de missions, créer des missions mock supplémentaires pour la démo
    if (filtered.length < 5) {
      const mockMissions: Mission[] = [
        {
          id: 'bakery-mock-1',
          title: 'Boulanger expérimenté - Remplacement matin',
          description: 'Mission de remplacement matin pour production de pains traditionnels',
          bakeryId: bakeryId,
          bakeryName: currentBakery.value?.name || 'Boulangerie',
          bakeryAddress: currentBakery.value?.address || '',
          bakeryAvatar: currentBakery.value?.avatar,
          type: 'ponctuel',
          position: 'boulanger',
          duration: '1 jour',
          startDate: '2024-02-25',
          schedule: '04h00 - 12h00',
          hourlyRate: 28,
          requirements: { experience: 3, certifications: ['CAP'], specialties: ['Pains traditionnels'] },
          equipment: ['Four', 'Pétrin'],
          status: 'filled',
          applicants: 2,
          location: { address: '', city: 'Paris', postalCode: '75001' },
          createdAt: '2024-02-20'
        },
        {
          id: 'bakery-mock-2',
          title: 'Pâtissier weekend - Événement',
          description: 'Recherche pâtissier pour événement spécial',
          bakeryId: bakeryId,
          bakeryName: currentBakery.value?.name || 'Boulangerie',
          bakeryAddress: currentBakery.value?.address || '',
          bakeryAvatar: currentBakery.value?.avatar,
          type: 'evenement',
          position: 'patissier',
          duration: '2 jours',
          startDate: '2024-03-02',
          schedule: '08h00 - 18h00',
          hourlyRate: 32,
          requirements: { experience: 5, certifications: ['CAP'], specialties: ['Pâtisserie fine'] },
          equipment: ['Four', 'Refroidisseur'],
          status: 'filled',
          applicants: 1,
          location: { address: '', city: 'Paris', postalCode: '75001' },
          createdAt: '2024-02-22'
        },
        {
          id: 'bakery-mock-3',
          title: 'Vendeur/Vendeuse - CDI week-end',
          description: 'Recherche vendeur pour weekend',
          bakeryId: bakeryId,
          bakeryName: currentBakery.value?.name || 'Boulangerie',
          bakeryAddress: currentBakery.value?.address || '',
          bakeryAvatar: currentBakery.value?.avatar,
          type: 'recurrent',
          position: 'vendeur',
          duration: 'Permanent',
          startDate: '2024-03-09',
          schedule: '07h00 - 14h00',
          hourlyRate: 22,
          requirements: { experience: 1, certifications: [], specialties: ['Vente'] },
          equipment: [],
          status: 'open',
          applicants: 3,
          location: { address: '', city: 'Paris', postalCode: '75001' },
          createdAt: '2024-02-18'
        }
      ]
      filtered = [...filtered, ...mockMissions]
    }
    
    bakeryMissions.value = filtered
    
    // Mock: générer des candidatures pour ces missions
    bakeryApplications.value = [
      {
        id: 'app1',
        missionId: '1',
        professionalId: 'pro1',
        professionalName: 'Camille Moreau',
        professionalAvatar: 'boulanger1.jpeg',
        message: 'Intéressé par cette mission, j\'ai 10 ans d\'expérience en levain.',
        status: 'pending',
        appliedAt: '2024-01-20T10:30:00Z'
      },
      {
        id: 'app2',
        missionId: '1',
        professionalId: 'pro3',
        professionalName: 'Omar Bensaïd',
        professionalAvatar: 'boulanger3.jpeg',
        message: 'Disponible ce weekend, très motivé.',
        status: 'pending',
        appliedAt: '2024-01-20T14:15:00Z'
      }
    ]

    // Sauvegarder dans localStorage
    saveBakeryDataToStorage()
  }

  // Init
  if (!bakeries.value.length) generateMockBakeries()
  
  // Initialiser les données depuis localStorage ou créer des stats par défaut
  initializeBakeryData()

  return {
    bakeries,
    currentBakery,
    bakeryMissions,
    bakeryApplications,
    totalMissions,
    openMissions,
    filledMissions,
    totalApplications,
    pendingApplications,
    monthlyStats,
    login,
    loadBakeryData,
    saveBakeryDataToStorage,
    clearBakeryDataFromStorage,
    initializeBakeryData
  }
})

