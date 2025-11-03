<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

// Animation numbers counter
const stats = ref([
  { number: 1000, label: 'Professionnels certifiés', suffix: '+' },
  { number: 500, label: 'Boulangeries partenaires', suffix: '+' },
  { number: 10000, label: 'Missions réalisées', suffix: '+' },
  { number: 4.8, label: 'Note moyenne', suffix: '/5' }
])

const features = ref([
  {
    title: 'Certification des compétences',
    description: 'Processus de validation rigoureux avec badges professionnels',
    icon: '🎖️'
  },
  {
    title: 'Matching intelligent',
    description: 'Suggestions automatiques basées sur les compétences et la proximité',
    icon: '🎯'
  },
  {
    title: 'Gestion simplifiée',
    description: 'Contrats automatisés, facturation intégrée, conformité légale',
    icon: '📋'
  },
  {
    title: 'Communauté active',
    description: 'Échanges, formations, événements networking pour tous',
    icon: '👥'
  }
])
</script>

<template>
  <div class="bg-cream-200 min-h-screen">
    <!-- Hero Section -->
    <section class="bg-hero py-20 lg:py-32">
      <div class="container-section">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Hero Content -->
          <div class="space-y-8">
            <div class="space-y-4">
              <h1 class="text-4xl lg:text-6xl font-display font-bold text-chocolate-800 leading-tight">
                Connectons les 
                <span class="text-gradient">talents</span> 
                de la boulangerie
              </h1>
              <p class="text-lg text-chocolate-600 max-w-xl">
                La première plateforme spécialisée qui met en relation boulangeries et professionnels indépendants. 
                Trouvez la mission parfaite ou le talent qu'il vous faut !
              </p>
            </div>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4">
              <RouterLink to="/register?type=professional" class="btn-primary text-lg px-8 py-4">
                Je suis professionnel 👨‍🍳
              </RouterLink>
              <RouterLink to="/register?type=bakery" class="btn-secondary text-lg px-8 py-4">
                Je suis boulangerie 🏪
              </RouterLink>
            </div>

            <!-- Social Proof -->
            <div class="flex items-center space-x-6 pt-6">
              <div class="flex -space-x-2">
                <img src="@/assets/boulangers/boulanger1.jpeg" 
                     class="w-10 h-10 rounded-full border-2 border-white ring-2 ring-primary-300 object-cover" alt="Professionnel boulanger 1">
                <img src="@/assets/boulangers/boulanger2.jpeg" 
                     class="w-10 h-10 rounded-full border-2 border-white ring-2 ring-primary-300 object-cover" alt="Professionnelle boulangère 2">
                <img src="@/assets/boulangers/boulanger3.jpeg" 
                     class="w-10 h-10 rounded-full border-2 border-white ring-2 ring-primary-300 object-cover" alt="Professionnel boulanger 3">
              </div>
              <p class="text-sm text-chocolate-600">
                <span class="font-semibold">1000+</span> professionnels nous font déjà confiance
              </p>
            </div>
          </div>

          <!-- Hero Image -->
          <div class="relative">
            <div class="bg-white rounded-2xl shadow-2xl p-8 rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop" 
                alt="Boulanger au travail"
                class="w-full h-80 object-cover rounded-xl"
              />
              <!-- Floating card -->
              <div class="absolute -bottom-4 -left-4 bg-primary-500 text-white p-4 rounded-xl shadow-lg">
                <div class="flex items-center space-x-2">
                  <span class="text-2xl">⚡</span>
                  <div>
                    <p class="font-semibold">Mission urgente</p>
                    <p class="text-xs opacity-90">35€/h • Pâtissier</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-white">
      <div class="container-section">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
              {{ stat.number }}{{ stat.suffix }}
            </div>
            <p class="text-chocolate-600 text-sm lg:text-base">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-cream-100">
      <div class="container-section">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-display font-bold text-chocolate-800 mb-4">
            Pourquoi choisir Choukette ?
          </h2>
          <p class="text-lg text-chocolate-600 max-w-2xl mx-auto">
            Une plateforme complète pensée pour les professionnels de la boulangerie-pâtisserie
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="feature in features" :key="feature.title" 
               class="card-hover text-center p-8 relative decoration-wheat decoration-bread">
            <div class="text-4xl mb-4">{{ feature.icon }}</div>
            <h3 class="text-xl font-semibold text-chocolate-800 mb-3">{{ feature.title }}</h3>
            <p class="text-chocolate-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-20 bg-white">
      <div class="container-section">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-display font-bold text-chocolate-800 mb-4">
            Comment ça marche ?
          </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <!-- Pour les professionnels -->
          <div class="space-y-8">
            <h3 class="text-2xl font-semibold text-primary-600 mb-8">
              👨‍🍳 Pour les professionnels
            </h3>
            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <div class="bg-primary-100 text-primary-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h4 class="font-semibold text-chocolate-800">Créez votre profil</h4>
                  <p class="text-chocolate-600 text-sm">CV, portfolio, certifications</p>
                </div>
              </div>
              <div class="flex items-start space-x-4">
                <div class="bg-primary-100 text-primary-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <h4 class="font-semibold text-chocolate-800">Recherchez des missions</h4>
                  <p class="text-chocolate-600 text-sm">Filtres avancés, alertes personnalisées</p>
                </div>
              </div>
              <div class="flex items-start space-x-4">
                <div class="bg-primary-100 text-primary-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <h4 class="font-semibold text-chocolate-800">Postulez et travaillez</h4>
                  <p class="text-chocolate-600 text-sm">Gestion administrative simplifiée</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Pour les boulangeries -->
          <div class="space-y-8">
            <h3 class="text-2xl font-semibold text-accent-600 mb-8">
              🏪 Pour les boulangeries
            </h3>
            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <div class="bg-accent-100 text-accent-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h4 class="font-semibold text-chocolate-800">Publiez vos besoins</h4>
                  <p class="text-chocolate-600 text-sm">Missions ponctuelles, récurrentes ou urgentes</p>
                </div>
              </div>
              <div class="flex items-start space-x-4">
                <div class="bg-accent-100 text-accent-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <h4 class="font-semibold text-chocolate-800">Recevez des candidatures</h4>
                  <p class="text-chocolate-600 text-sm">Matching intelligent selon vos critères</p>
                </div>
              </div>
              <div class="flex items-start space-x-4">
                <div class="bg-accent-100 text-accent-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <h4 class="font-semibold text-chocolate-800">Sélectionnez et collaborez</h4>
                  <p class="text-chocolate-600 text-sm">Contrats automatiques, suivi facilité</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-br from-primary-500 to-accent-500 text-white">
      <div class="container-section text-center">
        <h2 class="text-3xl lg:text-4xl font-display font-bold mb-6">
          Prêt à rejoindre la communauté Choukette ?
        </h2>
        <p class="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Plus de 1000 professionnels et 500 boulangeries nous font déjà confiance. 
          Rejoignez-les dès aujourd'hui !
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink to="/register" class="bg-white text-primary-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors">
            Commencer gratuitement
          </RouterLink>
          <RouterLink to="/missions" class="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-primary-600 transition-colors">
            Découvrir les missions
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Animations personnalisées */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
