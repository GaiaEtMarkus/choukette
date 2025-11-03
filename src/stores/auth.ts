import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface User {
  id: string
  email: string
  name: string
  type: 'bakery' | 'professional'
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
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: type === 'bakery' ? 'Boulangerie Martin' : 'Jean Dupont',
      type,
      avatar: type === 'bakery' ? '@/assets/boulangeries/boulangerie1.jpeg' : '@/assets/boulangers/boulanger1.jpeg',
      profile: type === 'bakery' 
        ? {
            businessName: 'Boulangerie Martin',
            address: '15 Rue de la Paix, 75001 Paris',
            phone: '+33 1 42 33 44 55',
            description: 'Boulangerie artisanale familiale depuis 1950',
            establishmentType: ['Boulangerie', 'Pâtisserie'],
            createdAt: new Date().toISOString()
          } as BakeryProfile
        : {
            firstName: 'Jean',
            lastName: 'Dupont',
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
    
    user.value = mockUser
    localStorage.setItem('choukette_user', JSON.stringify(mockUser))
    return Promise.resolve(mockUser)
  }

  function logout() {
    user.value = null
    localStorage.removeItem('choukette_user')
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