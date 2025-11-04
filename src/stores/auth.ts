import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useBakeriesStore } from './bakeries'
import { useProfessionalsStore } from './professionals'
import { useProfessionalsStatsStore } from './professionalsStats'

export interface User {
  id: string
  email: string
  name: string
  type: 'bakery' | 'professional' | 'admin'
  avatar?: string
  profile: BakeryProfile | ProfessionalProfile
}

export interface BakeryProfile {
  businessName: string
  address: string
  phone: string
  description?: string
  establishmentType: string[]
  createdAt: string
}

export interface ProfessionalProfile {
  firstName: string
  lastName: string
  phone: string
  specialties: string[]
  experience: number
  location: string
  hourlyRate: number
  availability: string[]
  certifications: string[]
  portfolio: string[]
  status: 'auto-entrepreneur' | 'interim'
  createdAt: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const userType = computed(() => user.value?.type)

  // Connexion simulée pour le prototype
  function login(email: string, password: string, type: 'bakery' | 'professional') {
    // Mock login - dans un vrai projet, on ferait un appel API
    let userName = ''
    let userProfile: BakeryProfile | ProfessionalProfile
    
    if (type === 'bakery') {
      // Récupérer la boulangerie depuis le store
      const bakeryStore = useBakeriesStore()
      const bakery = bakeryStore.currentBakery
      
      if (bakery) {
        userName = bakery.name
        userProfile = {
          businessName: bakery.name,
          address: bakery.address,
          phone: '+33 1 42 33 44 55',
          description: bakery.description || 'Boulangerie artisanale',
          establishmentType: ['Boulangerie', 'Pâtisserie'],
          createdAt: bakery.createdAt
        } as BakeryProfile
      } else {
        userName = 'Boulangerie'
        userProfile = {
          businessName: 'Boulangerie',
          address: '15 Rue de la Paix, 75001 Paris',
          phone: '+33 1 42 33 44 55',
          description: 'Boulangerie artisanale familiale depuis 1950',
          establishmentType: ['Boulangerie', 'Pâtisserie'],
          createdAt: new Date().toISOString()
        } as BakeryProfile
      }
    } else {
      // Récupérer le professionnel depuis le store
      const professionalsStore = useProfessionalsStore()
      
      // S'assurer que les données sont générées
      if (professionalsStore.professionals.length === 0) {
        professionalsStore.generateMockProfessionals()
      }
      
      // Trouver le professionnel par email (camille.moreau@example.fr -> pro1, sofiane.leroux@example.fr -> pro2)
      let pro = null
      if (email.includes('camille.moreau')) {
        pro = professionalsStore.professionals.find(p => p.id === 'pro1')
      } else if (email.includes('sofiane.leroux')) {
        pro = professionalsStore.professionals.find(p => p.id === 'pro2')
      } else {
        // Par défaut, prendre le premier professionnel
        pro = professionalsStore.professionals[0]
      }
      
      if (pro) {
        userName = `${pro.firstName} ${pro.lastName}`
        userProfile = {
          firstName: pro.firstName,
          lastName: pro.lastName,
          phone: '+33 6 12 34 56 78',
          specialties: pro.specialties,
          experience: pro.yearsExperience,
          location: `${pro.location.city} ${pro.location.postalCode}`,
          hourlyRate: pro.hourlyRate,
          availability: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
          certifications: pro.certifications,
          portfolio: pro.portfolio || [],
          status: 'auto-entrepreneur',
          createdAt: pro.createdAt
        } as ProfessionalProfile
      } else {
        userName = 'Professionnel'
        userProfile = {
          firstName: 'Camille',
          lastName: 'Moreau',
          phone: '+33 6 12 34 56 78',
          specialties: ['Boulangerie artisanale', 'Viennoiserie'],
          experience: 8,
          location: 'Paris 11ème',
          hourlyRate: 25,
          availability: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
          certifications: ['CAP Boulanger', 'Brevet Professionnel Boulanger'],
          portfolio: [
            'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1555507036-ab794f67df5e?w=300&h=200&fit=crop'
          ],
          status: 'auto-entrepreneur',
          createdAt: new Date().toISOString()
        } as ProfessionalProfile
      }
    }
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: userName,
      type,
      avatar: type === 'bakery' ? '@/assets/boulangeries/boulangerie1.jpeg' : '@/assets/boulangers/boulanger1.jpeg',
      profile: userProfile
    }
    
    user.value = mockUser
    localStorage.setItem('choukette_user', JSON.stringify(mockUser))
    return Promise.resolve(mockUser)
  }

  function logout() {
    user.value = null
    // Nettoyer toutes les données du localStorage
    localStorage.removeItem('choukette_user')
    
    // Nettoyer les données des stores
    const bakeryStore = useBakeriesStore()
    const professionalStatsStore = useProfessionalsStatsStore()
    
    bakeryStore.clearBakeryDataFromStorage()
    professionalStatsStore.clearProfessionalDataFromStorage()
    
    // Réinitialiser les stores
    bakeryStore.currentBakery = null
    bakeryStore.bakeryMissions = []
    bakeryStore.bakeryApplications = []
    
    professionalStatsStore.completedMissions = []
    professionalStatsStore.currentProfessionalId = null
  }

  function initializeAuth() {
    const savedUser = localStorage.getItem('choukette_user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (error) {
        console.error('Erreur lors du chargement du utilisateur:', error)
        localStorage.removeItem('choukette_user')
      }
    }
  }

  return {
    user,
    isAuthenticated,
    userType,
    login,
    logout,
    initializeAuth
  }
}) 