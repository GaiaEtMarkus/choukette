<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Snackbar from '@/components/Snackbar.vue'

const router = useRouter()
const authStore = useAuthStore()
const isMobileMenuOpen = ref(false)

// État du snackbar
const snackbarVisible = ref(false)
const snackbarMessage = ref('')

const bakeryPhotos = import.meta.glob('@/assets/boulangeries/*', { eager: true, import: 'default' }) as Record<string, string>
const professionalPhotos = import.meta.glob('@/assets/boulangers/*', { eager: true, import: 'default' }) as Record<string, string>

const userAvatar = computed(() => {
  if (!authStore.user) return ''
  if (authStore.user.type === 'bakery') {
    const key = '/src/assets/boulangeries/boulangerie1.jpeg'
    return bakeryPhotos[key] || ''
  }
  const key = '/src/assets/boulangers/boulanger1.jpeg'
  return professionalPhotos[key] || ''
})

const dashboardRoute = computed(() => {
  if (!authStore.isAuthenticated || !authStore.userType) return '/'
  return authStore.userType === 'bakery' ? '/dashboard/bakery' : '/dashboard/professional'
})

onMounted(() => {
  authStore.initializeAuth()
})

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Fonction de déconnexion avec redirection et snackbar
const handleLogout = () => {
  authStore.logout()
  closeMobileMenu()
  
  // Rediriger vers la page d'accueil
  router.push('/')
  
  // Afficher le snackbar
  snackbarMessage.value = 'Déconnexion réussie !'
  snackbarVisible.value = true
  
  // Fermer automatiquement après 3 secondes
  setTimeout(() => {
    snackbarVisible.value = false
  }, 3000)
}

const closeSnackbar = () => {
  snackbarVisible.value = false
}
</script>

<template>
  <div class="min-h-screen bg-cream-200">
    <!-- Navigation Header -->
    <header class="bg-white shadow-sm border-b border-primary-200">
      <div class="container-section">
        <div class="flex items-center justify-between">
          <!-- Logo Choukette -->
          <RouterLink to="/" class="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img 
              src="@/assets/logoChoukette.png" 
              alt="Choukette - Plateforme boulangerie" 
              class="w-12 h-12 md:w-[90px] md:h-[90px] rounded-full shadow-sm"
            />
            <div>
              <h1 class="text-xl md:text-2xl font-display font-bold text-chocolate-700">Choukette</h1>
              <p class="text-xs text-chocolate-500 -mt-1 hidden sm:block">Connectons les talents</p>
            </div>
          </RouterLink>

          <!-- Desktop Navigation -->
          <nav class="hidden lg:flex items-center space-x-6">
            <RouterLink 
              to="/" 
              class="text-chocolate-600 hover:text-primary-600 font-medium transition-colors"
              active-class="text-primary-600"
            >
              Accueil
            </RouterLink>
            <RouterLink 
              to="/pourquoi-choukette" 
              class="text-chocolate-600 hover:text-primary-600 font-medium transition-colors"
              active-class="text-primary-600"
            >
              Pourquoi Choukette ?
            </RouterLink>
            <RouterLink 
              to="/blog" 
              class="text-chocolate-600 hover:text-primary-600 font-medium transition-colors"
              active-class="text-primary-600"
            >
              Blog
            </RouterLink>
            <RouterLink 
              to="/missions" 
              class="text-chocolate-600 hover:text-primary-600 font-medium transition-colors"
              active-class="text-primary-600"
            >
              Missions
            </RouterLink>
            <RouterLink 
              to="/professionnels" 
              class="text-chocolate-600 hover:text-primary-600 font-medium transition-colors"
              active-class="text-primary-600"
            >
              Artisans
            </RouterLink>
            <RouterLink 
              v-if="authStore.isAuthenticated && authStore.userType !== 'admin'"
              :to="dashboardRoute" 
              class="text-chocolate-600 hover:text-primary-600 font-medium transition-colors"
              active-class="text-primary-600"
            >
              Dashboard
            </RouterLink>
            <RouterLink 
              v-if="authStore.isAuthenticated && authStore.userType === 'admin'"
              to="/admin" 
              class="text-chocolate-600 hover:text-primary-600 font-medium transition-colors"
              active-class="text-primary-600"
            >
              Administration
            </RouterLink>
          </nav>

          <!-- Desktop Actions -->
          <div class="hidden md:flex items-center space-x-3">
            <template v-if="!authStore.isAuthenticated">
              <RouterLink to="/login" class="btn-outline text-sm">
                Connexion
              </RouterLink>
              <RouterLink to="/register" class="btn-primary text-sm">
                S'inscrire
              </RouterLink>
            </template>
            <template v-else>
              <div class="flex items-center space-x-3">
                <img 
                  :src="userAvatar || authStore.user?.avatar" 
                  :alt="authStore.user?.name"
                  class="w-8 h-8 rounded-full object-cover"
                />
                <span class="text-chocolate-700 font-medium hidden lg:inline">{{ authStore.user?.name }}</span>
                <button 
                  @click="handleLogout"
                  class="text-chocolate-500 hover:text-chocolate-700 text-sm"
                >
                  Déconnexion
                </button>
              </div>
            </template>
          </div>

          <!-- Mobile Menu Button -->
          <button 
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg text-chocolate-600 hover:bg-primary-50 transition-colors"
            aria-label="Menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                :class="{ 'hidden': isMobileMenuOpen, 'inline-flex': !isMobileMenuOpen }"
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path 
                :class="{ 'hidden': !isMobileMenuOpen, 'inline-flex': isMobileMenuOpen }"
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div 
          :class="{ 'block': isMobileMenuOpen, 'hidden': !isMobileMenuOpen }"
          class="md:hidden mt-4 pt-4 border-t border-primary-200"
        >
          <!-- Mobile Navigation -->
          <nav class="space-y-3 mb-4">
            <RouterLink 
              to="/" 
              @click="closeMobileMenu"
              class="block text-chocolate-600 hover:text-primary-600 font-medium transition-colors py-2"
              active-class="text-primary-600"
            >
              🏠 Accueil
            </RouterLink>
            <RouterLink 
              to="/missions" 
              @click="closeMobileMenu"
              class="block text-chocolate-600 hover:text-primary-600 font-medium transition-colors py-2"
              active-class="text-primary-600"
            >
              💼 Missions
            </RouterLink>
            <RouterLink 
              to="/pourquoi-choukette" 
              @click="closeMobileMenu"
              class="block text-chocolate-600 hover:text-primary-600 font-medium transition-colors py-2"
              active-class="text-primary-600"
            >
              ❓ Pourquoi Choukette ?
            </RouterLink>
            <RouterLink 
              to="/blog" 
              @click="closeMobileMenu"
              class="block text-chocolate-600 hover:text-primary-600 font-medium transition-colors py-2"
              active-class="text-primary-600"
            >
              📝 Blog
            </RouterLink>
            <RouterLink 
              to="/professionnels" 
              @click="closeMobileMenu"
              class="block text-chocolate-600 hover:text-primary-600 font-medium transition-colors py-2"
              active-class="text-primary-600"
            >
              👨‍🍳 Artisans
            </RouterLink>
            <RouterLink 
              v-if="authStore.isAuthenticated && authStore.userType !== 'admin'"
              :to="dashboardRoute" 
              @click="closeMobileMenu"
              class="block text-chocolate-600 hover:text-primary-600 font-medium transition-colors py-2"
              active-class="text-primary-600"
            >
              📊 Dashboard
            </RouterLink>
            <RouterLink 
              v-if="authStore.isAuthenticated && authStore.userType === 'admin'"
              to="/admin" 
              @click="closeMobileMenu"
              class="block text-chocolate-600 hover:text-primary-600 font-medium transition-colors py-2"
              active-class="text-primary-600"
            >
              ⚙️ Administration
            </RouterLink>
          </nav>

          <!-- Mobile Actions -->
          <div class="space-y-3">
            <template v-if="!authStore.isAuthenticated">
              <RouterLink 
                to="/login" 
                @click="closeMobileMenu"
                class="block w-full text-center btn-outline text-sm py-3"
              >
                Connexion
              </RouterLink>
              <RouterLink 
                to="/register" 
                @click="closeMobileMenu"
                class="block w-full text-center btn-primary text-sm py-3"
              >
                S'inscrire
              </RouterLink>
            </template>
            <template v-else>
              <div class="flex items-center space-x-3 py-2">
                <img 
                  :src="userAvatar || authStore.user?.avatar" 
                  :alt="authStore.user?.name"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div class="flex-1">
                  <p class="text-chocolate-700 font-medium">{{ authStore.user?.name }}</p>
                  <p class="text-xs text-chocolate-500">{{ authStore.user?.type === 'bakery' ? 'Boulangerie' : 'Professionnel' }}</p>
                </div>
              </div>
              <button 
                @click="handleLogout"
                class="block w-full text-center text-chocolate-500 hover:text-chocolate-700 text-sm py-2 border border-chocolate-300 rounded-lg"
              >
                Déconnexion
              </button>
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Snackbar pour les notifications -->
    <Snackbar 
      :visible="snackbarVisible" 
      :message="snackbarMessage"
      @close="closeSnackbar"
    />

    <!-- Footer -->
    <footer class="bg-chocolate-800 text-cream-100 py-12 mt-16">
      <div class="container-section">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Logo & Description -->
          <div class="md:col-span-2">
            <div class="flex items-center space-x-3 mb-4">
              <img 
                src="@/assets/logoChoukette.png" 
                alt="Choukette" 
                class="w-10 h-10 rounded-full"
              />
              <h3 class="text-xl font-display font-bold">Choukette</h3>
            </div>
            <p class="text-cream-200 text-sm max-w-md">
              La première plateforme de mise en relation entre boulangeries et professionnels indépendants. 
              Connectons les talents de la boulangerie française ! 🥖
            </p>
          </div>

          <!-- Liens rapides -->
          <div>
            <h4 class="font-semibold mb-3">Plateforme</h4>
            <ul class="space-y-2 text-sm">
              <li><RouterLink to="/missions" class="text-cream-200 hover:text-primary-300 transition-colors">Missions</RouterLink></li>
              <li><RouterLink to="/professionnels" class="text-cream-200 hover:text-primary-300 transition-colors">Professionnels</RouterLink></li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h4 class="font-semibold mb-3">Support</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="text-cream-200 hover:text-primary-300 transition-colors">Centre d'aide</a></li>
              <li><a href="#" class="text-cream-200 hover:text-primary-300 transition-colors">Contact</a></li>
              <li><a href="#" class="text-cream-200 hover:text-primary-300 transition-colors">Conditions</a></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-chocolate-700 mt-8 pt-6 text-center text-sm text-cream-300">
          <p>&copy; 2024 Choukette. Tous droits réservés. Fait avec ❤️ pour la boulangerie française.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Animations pour les liens actifs */
.router-link-active {
  @apply text-primary-600;
}

.router-link-exact-active {
  @apply text-primary-600;
}

/* Animation douce pour les éléments */
header {
  backdrop-filter: blur(10px);
}
</style>
