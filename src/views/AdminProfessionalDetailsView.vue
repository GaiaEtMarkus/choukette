<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProfessionalsStore } from '@/stores/professionals'
import { useProfessionalsStatsStore } from '@/stores/professionalsStats'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const professionalsStore = useProfessionalsStore()
const statsStore = useProfessionalsStatsStore()

const professional = computed(() => {
  const id = String(route.params.id)
  return professionalsStore.professionals.find(p => p.id === id)
})

const professionalPhotos = import.meta.glob('@/assets/boulangers/*', { eager: true, import: 'default' }) as Record<string, string>

const professionalAvatar = computed(() => {
  if (!professional.value?.avatar) return ''
  const key = `/src/assets/boulangers/${professional.value.avatar}`
  return professionalPhotos[key] || ''
})

const showContactModal = ref(false)
const showSuspendModal = ref(false)
const suspendReason = ref('')
const suspendDuration = ref('7') // jours
const adminNotes = ref('')

onMounted(() => {
  if (!authStore.isAuthenticated || authStore.userType !== 'admin') {
    router.push('/login')
    return
  }
  
  if (!professional.value) {
    router.push('/admin')
    return
  }
  
  // Charger les données du professionnel
  statsStore.loadProfessionalData(professional.value.id)
  adminNotes.value = professional.value.notes || ''
})

const verificationStatusColors = {
  verified: 'text-green-600 bg-green-50 border-green-200',
  pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  suspended: 'text-red-600 bg-red-50 border-red-200',
  rejected: 'text-red-600 bg-red-50 border-red-200'
}

const documentTypeLabels = {
  identity: 'Pièce d\'identité',
  diploma: 'Diplôme',
  siret: 'SIRET',
  rib: 'RIB',
  other: 'Autre'
}

function handleSuspend() {
  if (!professional.value) return
  
  const suspendDate = new Date()
  suspendDate.setDate(suspendDate.getDate() + parseInt(suspendDuration.value))
  
  professional.value.verificationStatus = 'suspended'
  professional.value.suspendedUntil = suspendDate.toISOString()
  professional.value.notes = (professional.value.notes || '') + `\n[SUSPENSION ${new Date().toLocaleDateString('fr-FR')}] ${suspendReason.value}`
  
  showSuspendModal.value = false
  suspendReason.value = ''
}

function handleUnsuspend() {
  if (!professional.value) return
  
  professional.value.verificationStatus = 'verified'
  professional.value.suspendedUntil = undefined
  professional.value.notes = (professional.value.notes || '') + `\n[LEVÉE SUSPENSION ${new Date().toLocaleDateString('fr-FR')}]`
}

function handleVerify() {
  if (!professional.value) return
  professional.value.verificationStatus = 'verified'
  professional.value.notes = (professional.value.notes || '') + `\n[VÉRIFICATION ${new Date().toLocaleDateString('fr-FR')}] Compte vérifié par admin`
}

function saveNotes() {
  if (!professional.value) return
  professional.value.notes = adminNotes.value
}
</script>

<template>
  <div v-if="professional" class="container-section py-8">
    <button class="text-chocolate-600 hover:text-primary-600 text-sm mb-6" @click="router.push('/admin')">
      ← Retour à l'administration
    </button>

    <!-- Header avec actions -->
    <div class="card mb-6">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-4">
          <img
            v-if="professionalAvatar"
            :src="professionalAvatar"
            :alt="`${professional.firstName} ${professional.lastName}`"
            class="w-20 h-20 rounded-full object-cover border-2 border-primary-200"
          />
          <div>
            <h1 class="text-2xl font-display font-bold text-chocolate-800">
              {{ professional.firstName }} {{ professional.lastName }}
            </h1>
            <p class="text-chocolate-600 mt-1">{{ professional.email || 'N/A' }}</p>
            <div class="flex items-center gap-2 mt-2">
              <span :class="verificationStatusColors[professional.verificationStatus || 'pending']" class="badge">
                {{ professional.verificationStatus === 'verified' ? 'Vérifié' : professional.verificationStatus === 'pending' ? 'En attente' : professional.verificationStatus === 'suspended' ? 'Suspendu' : 'Rejeté' }}
              </span>
              <span v-if="professional.suspendedUntil" class="text-xs text-red-600">
                Suspendu jusqu'au {{ new Date(professional.suspendedUntil).toLocaleDateString('fr-FR') }}
              </span>
              <span class="badge bg-cream-100 text-chocolate-700">{{ professional.status || 'N/A' }}</span>
            </div>
          </div>
        </div>
        
        <!-- Actions rapides -->
        <div class="flex gap-2">
          <button @click="showContactModal = true" class="btn-outline text-sm">
            📧 Contacter
          </button>
          <button
            v-if="professional.verificationStatus !== 'suspended'"
            @click="showSuspendModal = true"
            class="btn-secondary text-sm bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
          >
            🚫 Suspendre
          </button>
          <button
            v-else
            @click="handleUnsuspend"
            class="btn-secondary text-sm bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          >
            ✅ Lever suspension
          </button>
          <button
            v-if="professional.verificationStatus !== 'verified'"
            @click="handleVerify"
            class="btn-primary text-sm"
          >
            ✓ Vérifier
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Colonne principale -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Informations personnelles -->
        <div class="card">
          <h2 class="text-xl font-semibold text-chocolate-800 mb-4">Informations personnelles</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-chocolate-600 mb-1">Email</p>
              <p class="text-chocolate-800">{{ professional.email || 'Non renseigné' }}</p>
            </div>
            <div>
              <p class="text-sm text-chocolate-600 mb-1">Téléphone</p>
              <p class="text-chocolate-800">{{ professional.phone || 'Non renseigné' }}</p>
            </div>
            <div>
              <p class="text-sm text-chocolate-600 mb-1">Statut</p>
              <p class="text-chocolate-800">{{ professional.status || 'Non renseigné' }}</p>
            </div>
            <div>
              <p class="text-sm text-chocolate-600 mb-1">Date d'inscription</p>
              <p class="text-chocolate-800">{{ new Date(professional.createdAt).toLocaleDateString('fr-FR') }}</p>
            </div>
          </div>
        </div>

        <!-- Coordonnées -->
        <div class="card">
          <h2 class="text-xl font-semibold text-chocolate-800 mb-4">Coordonnées</h2>
          <div class="space-y-3">
            <div>
              <p class="text-sm text-chocolate-600 mb-1">Adresse</p>
              <p class="text-chocolate-800">
                {{ professional.location.address || `${professional.location.city}, ${professional.location.postalCode}` }}
              </p>
            </div>
            <div>
              <p class="text-sm text-chocolate-600 mb-1">Ville</p>
              <p class="text-chocolate-800">{{ professional.location.city }} ({{ professional.location.postalCode }})</p>
            </div>
          </div>
        </div>

        <!-- Informations légales -->
        <div class="card">
          <h2 class="text-xl font-semibold text-chocolate-800 mb-4">Informations légales</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-chocolate-600 mb-1">SIRET</p>
              <p class="font-mono text-chocolate-800 font-semibold">{{ professional.siret || 'Non renseigné' }}</p>
            </div>
            <div>
              <p class="text-sm text-chocolate-600 mb-1">Statut professionnel</p>
              <p class="text-chocolate-800">{{ professional.status || 'Non renseigné' }}</p>
            </div>
          </div>
        </div>

        <!-- Diplômes et certifications -->
        <div class="card">
          <h2 class="text-xl font-semibold text-chocolate-800 mb-4">Diplômes et certifications</h2>
          <div class="space-y-3">
            <div v-for="cert in professional.certifications" :key="cert" class="flex items-center gap-2">
              <span class="text-lg">🎓</span>
              <span class="text-chocolate-800">{{ cert }}</span>
            </div>
            <p v-if="professional.certifications.length === 0" class="text-chocolate-500 text-sm">
              Aucune certification renseignée
            </p>
          </div>
        </div>

        <!-- Documents de vérification -->
        <div class="card">
          <h2 class="text-xl font-semibold text-chocolate-800 mb-4">Documents de vérification</h2>
          <div v-if="professional.verificationDocuments && professional.verificationDocuments.length > 0" class="space-y-3">
            <div
              v-for="(doc, idx) in professional.verificationDocuments"
              :key="idx"
              class="flex items-center justify-between p-3 border border-chocolate-200 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <span class="text-2xl">
                  {{ doc.type === 'diploma' ? '🎓' : doc.type === 'identity' ? '🆔' : doc.type === 'siret' ? '📋' : doc.type === 'rib' ? '💳' : '📄' }}
                </span>
                <div>
                  <p class="font-medium text-chocolate-800">
                    {{ documentTypeLabels[doc.type] }}
                    <span v-if="doc.diplomaType" class="text-sm text-chocolate-500">
                      - {{ doc.diplomaType }} ({{ doc.diplomaYear }})
                    </span>
                  </p>
                  <p class="text-xs text-chocolate-500">{{ new Date(doc.uploadedAt).toLocaleDateString('fr-FR') }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span :class="doc.verified ? 'badge-success' : 'badge-warning'" class="badge text-xs">
                  {{ doc.verified ? 'Vérifié' : 'En attente' }}
                </span>
                <a :href="doc.url" target="_blank" class="text-primary-600 hover:text-primary-700 text-sm">
                  Voir →
                </a>
              </div>
            </div>
          </div>
          <p v-else class="text-chocolate-500 text-center py-4">Aucun document uploadé</p>
        </div>

        <!-- Stats principales -->
        <div class="card">
          <h2 class="text-xl font-semibold text-chocolate-800 mb-4">Statistiques</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-cream-50 rounded-lg">
              <p class="text-2xl font-bold text-primary-600">{{ professional.missionsCompleted }}</p>
              <p class="text-sm text-chocolate-600 mt-1">Missions complétées</p>
            </div>
            <div class="text-center p-4 bg-cream-50 rounded-lg">
              <p class="text-2xl font-bold text-green-600">{{ professional.yearsExperience }}</p>
              <p class="text-sm text-chocolate-600 mt-1">Années d'expérience</p>
            </div>
            <div class="text-center p-4 bg-cream-50 rounded-lg">
              <p class="text-2xl font-bold text-blue-600">{{ professional.hourlyRate }}€</p>
              <p class="text-sm text-chocolate-600 mt-1">Tarif horaire</p>
            </div>
            <div class="text-center p-4 bg-cream-50 rounded-lg">
              <p class="text-2xl font-bold text-yellow-600">{{ professional.isPremium ? 'Oui' : 'Non' }}</p>
              <p class="text-sm text-chocolate-600 mt-1">Premium</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Colonne latérale -->
      <div class="space-y-6">
        <!-- Notes admin -->
        <div class="card">
          <h2 class="text-lg font-semibold text-chocolate-800 mb-3">Notes internes</h2>
          <textarea
            v-model="adminNotes"
            rows="8"
            class="input-field w-full"
            placeholder="Notes internes sur ce professionnel..."
          ></textarea>
          <button @click="saveNotes" class="btn-primary w-full mt-3 text-sm">
            Enregistrer les notes
          </button>
        </div>

        <!-- Actions rapides -->
        <div class="card">
          <h2 class="text-lg font-semibold text-chocolate-800 mb-3">Actions</h2>
          <div class="space-y-2">
            <button @click="showContactModal = true" class="btn-outline w-full text-sm">
              📧 Contacter par email
            </button>
            <button v-if="professional.phone" @click="showContactModal = true" class="btn-outline w-full text-sm">
              📞 Contacter par téléphone
            </button>
            <button
              v-if="professional.verificationStatus !== 'verified'"
              @click="handleVerify"
              class="btn-primary w-full text-sm"
            >
              ✓ Valider le compte
            </button>
            <button
              v-if="professional.verificationStatus === 'verified'"
              @click="professional.verificationStatus = 'pending'"
              class="btn-secondary w-full text-sm"
            >
              ⚠️ Remettre en attente
            </button>
            <button
              v-if="professional.verificationStatus !== 'suspended'"
              @click="showSuspendModal = true"
              class="btn-secondary w-full text-sm bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
            >
              🚫 Suspendre le compte
            </button>
            <RouterLink
              :to="`/professionnels/${professional.id}`"
              class="btn-outline w-full text-sm text-center block"
            >
              👁️ Voir le profil public
            </RouterLink>
          </div>
        </div>

        <!-- Statistiques rapides -->
        <div class="card">
          <h2 class="text-lg font-semibold text-chocolate-800 mb-3">Statistiques</h2>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-chocolate-600">Missions complétées</span>
              <span class="font-semibold text-chocolate-800">{{ professional.missionsCompleted }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-chocolate-600">Expérience</span>
              <span class="font-semibold text-chocolate-800">{{ professional.yearsExperience }} ans</span>
            </div>
            <div class="flex justify-between">
              <span class="text-chocolate-600">Tarif horaire</span>
              <span class="font-semibold text-chocolate-800">{{ professional.hourlyRate }}€/h</span>
            </div>
            <div class="flex justify-between">
              <span class="text-chocolate-600">Premium</span>
              <span :class="professional.isPremium ? 'badge-success' : 'badge-neutral'" class="badge text-xs">
                {{ professional.isPremium ? 'Oui' : 'Non' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Contact -->
    <div
      v-if="showContactModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showContactModal = false"
    >
      <div @click.stop class="card max-w-md w-full mx-4">
        <h3 class="text-xl font-semibold text-chocolate-800 mb-4">
          Contacter {{ professional.firstName }} {{ professional.lastName }}
        </h3>
        <div class="space-y-3">
          <div>
            <p class="text-sm text-chocolate-600 mb-1">Email</p>
            <a v-if="professional.email" :href="`mailto:${professional.email}`" class="text-primary-600 hover:underline">
              {{ professional.email }}
            </a>
            <p v-else class="text-chocolate-500">Non renseigné</p>
          </div>
          <div v-if="professional.phone">
            <p class="text-sm text-chocolate-600 mb-1">Téléphone</p>
            <a :href="`tel:${professional.phone}`" class="text-primary-600 hover:underline">
              {{ professional.phone }}
            </a>
          </div>
        </div>
        <button @click="showContactModal = false" class="btn-primary w-full mt-4">
          Fermer
        </button>
      </div>
    </div>

    <!-- Modal Suspension -->
    <div
      v-if="showSuspendModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showSuspendModal = false"
    >
      <div @click.stop class="card max-w-md w-full mx-4">
        <h3 class="text-xl font-semibold text-chocolate-800 mb-4">Suspendre le compte</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-chocolate-700 mb-2">Durée (jours)</label>
            <select v-model="suspendDuration" class="input-field w-full">
              <option value="1">1 jour</option>
              <option value="7">7 jours</option>
              <option value="30">30 jours</option>
              <option value="90">90 jours</option>
              <option value="365">Indéfiniment</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-chocolate-700 mb-2">Raison</label>
            <textarea
              v-model="suspendReason"
              rows="4"
              class="input-field w-full"
              placeholder="Raison de la suspension..."
            ></textarea>
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          <button @click="showSuspendModal = false" class="btn-outline flex-1">
            Annuler
          </button>
          <button @click="handleSuspend" class="btn-primary flex-1 bg-red-600 hover:bg-red-700">
            Confirmer suspension
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="container-section py-16 text-center text-chocolate-700">
    Professionnel introuvable.
  </div>
</template>

<style scoped>
</style>

