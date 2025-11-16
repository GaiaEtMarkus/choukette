<script setup lang="ts">
import { ref } from 'vue'

// On garde tout en local avec des `ref` parce qu'il s'agit d'un formulaire purement "front"
// sans vraie création de compte : pas besoin d'impliquer Pinia ici.

const accountType = ref<'bakery' | 'professional'>('bakery')
const businessName = ref('')
const contactName = ref('')
const email = ref('')
const phone = ref('')
const city = ref('')
const specialty = ref('')
const experience = ref('')

const isSubmitting = ref(false)
const successMessage = ref('')

const handleSubmit = () => {
  successMessage.value = ''

  // On ne fait pas de vraie validation back ici, juste un minimum UX
  if (!email.value || !contactName.value) {
    successMessage.value = ''
    return
  }

  isSubmitting.value = true

  setTimeout(() => {
    isSubmitting.value = false
    successMessage.value =
      "Profil créé avec succès ! (Données de démo : utilisez les identifiants fournis sur la page de connexion pour vous connecter.)"

    // On ne crée pas vraiment le compte : on laisse l'utilisateur utiliser les credentials mock.
  }, 800)
}
</script>

<template>
  <div class="container-section py-16">
    <div class="max-w-2xl mx-auto">
      <div class="card">
        <h1 class="text-2xl font-display font-bold text-chocolate-800 mb-2">
          Créer un compte
        </h1>
        <p class="text-sm text-chocolate-600 mb-6">
          Ce formulaire permet de simuler l’inscription sur Choukette.
          Les comptes réels de la démo restent basés sur des identifiants de démonstration
          fournis sur la page de connexion.
        </p>

        <!-- Type de compte -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-chocolate-700 mb-2">
            Type de compte
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              class="px-3 py-2 rounded-lg border text-sm font-medium transition-all"
              :class="
                accountType === 'bakery'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-chocolate-200 bg-white text-chocolate-600 hover:border-primary-200'
              "
              @click="accountType = 'bakery'"
            >
              Boulangerie
            </button>
            <button
              type="button"
              class="px-3 py-2 rounded-lg border text-sm font-medium transition-all"
              :class="
                accountType === 'professional'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-chocolate-200 bg-white text-chocolate-600 hover:border-primary-200'
              "
              @click="accountType = 'professional'"
            >
              Professionnel
            </button>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Nom / raison sociale -->
          <div v-if="accountType === 'bakery'">
            <label class="block text-sm font-medium text-chocolate-700 mb-2">
              Nom de la boulangerie
            </label>
            <input
              v-model="businessName"
              type="text"
              class="input-field"
              placeholder="Boulangerie des Délices"
            />
          </div>
          <div v-else>
            <label class="block text-sm font-medium text-chocolate-700 mb-2">
              Nom complet
            </label>
            <input
              v-model="contactName"
              type="text"
              class="input-field"
              placeholder="Camille Moreau"
            />
          </div>

          <!-- Contact principal -->
          <div v-if="accountType === 'bakery'">
            <label class="block text-sm font-medium text-chocolate-700 mb-2">
              Nom du contact principal
            </label>
            <input
              v-model="contactName"
              type="text"
              class="input-field"
              placeholder="Prénom Nom"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-chocolate-700 mb-2">Email</label>
            <input
              v-model="email"
              type="email"
              class="input-field"
              placeholder="contact@votreboulangerie.fr"
            />
          </div>

          <!-- Téléphone & Ville -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-chocolate-700 mb-2">
                Téléphone
              </label>
              <input
                v-model="phone"
                type="tel"
                class="input-field"
                placeholder="06 12 34 56 78"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-chocolate-700 mb-2">Ville</label>
              <input
                v-model="city"
                type="text"
                class="input-field"
                placeholder="Paris, Lyon, Bordeaux..."
              />
            </div>
          </div>

          <!-- Spécialité / expérience pour les pros -->
          <div v-if="accountType === 'professional'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-chocolate-700 mb-2">
                Spécialité
              </label>
              <input
                v-model="specialty"
                type="text"
                class="input-field"
                placeholder="Boulanger, pâtissier, tourier..."
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-chocolate-700 mb-2">
                Années d’expérience
              </label>
              <input
                v-model="experience"
                type="number"
                min="0"
                class="input-field"
                placeholder="5"
              />
            </div>
          </div>

          <div class="pt-4">
            <button
              type="submit"
              class="btn-primary w-full"
              :disabled="isSubmitting"
            >
              <span v-if="!isSubmitting">Créer mon profil</span>
              <span v-else>Création du profil...</span>
            </button>
          </div>
        </form>

        <p
          v-if="successMessage"
          class="mt-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2"
        >
          {{ successMessage }}
        </p>

        <p class="mt-4 text-xs text-chocolate-500">
          Pour la démonstration, les connexions se font avec des profils déjà configurés
          (boulangeries et professionnels). Ce formulaire sert à montrer l’expérience
          d’inscription côté interface.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


