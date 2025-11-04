<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBakeriesStore } from '@/stores/bakeries'
import { useMissionsStore } from '@/stores/missions'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const bakeryStore = useBakeriesStore()
const missionsStore = useMissionsStore()

const bakery = computed(() => {
  const id = String(route.params.id)
  return bakeryStore.bakeries.find(b => b.id === id)
})

const bakeryPhotos = import.meta.glob('@/assets/boulangeries/*', { eager: true, import: 'default' }) as Record<string, string>

const bakeryAvatar = computed(() => {
  if (!bakery.value?.avatar) return ''
  const key = `/src/assets/boulangeries/${bakery.value.avatar}`
  return bakeryPhotos[key] || ''
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
  
  if (!bakery.value) {
    router.push('/admin')
    return
  }
  
  // Charger les données de la boulangerie
  bakeryStore.loadBakeryData(bakery.value.id, missionsStore.missions)
  adminNotes.value = bakery.value.notes || ''
})

const verificationStatusColors = {
  verified: 'text-green-600 bg-green-50 border-green-200',
  pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  suspended: 'text-red-600 bg-red-50 border-red-200',
  rejected: 'text-red-600 bg-red-50 border-red-200'
}

const documentTypeLabels = {
  siret: 'SIRET/KBIS',
  kbis: 'Extrait K-BIS',
  identity: 'Pièce d\'identité',
  diploma: 'Diplôme',
  other: 'Autre'
}

function handleSuspend() {
  if (!bakery.value) return
  
  const suspendDate = new Date()
  suspendDate.setDate(suspendDate.getDate() + parseInt(suspendDuration.value))
  
  bakery.value.verificationStatus = 'suspended'
  bakery.value.suspendedUntil = suspendDate.toISOString()
  bakery.value.notes = (bakery.value.notes || '') + `\n[SUSPENSION ${new Date().toLocaleDateString('fr-FR')}] ${suspendReason.value}`
  
  showSuspendModal.value = false
  suspendReason.value = ''
}

function handleUnsuspend() {
  if (!bakery.value) return
  
  bakery.value.verificationStatus = 'verified'
  bakery.value.suspendedUntil = undefined
  bakery.value.notes = (bakery.value.notes || '') + `\n[LEVÉE SUSPENSION ${new Date().toLocaleDateString('fr-FR')}]`
}

function handleVerify() {
  if (!bakery.value) return
  bakery.value.verificationStatus = 'verified'
  bakery.value.notes = (bakery.value.notes || '') + `\n[VÉRIFICATION ${new Date().toLocaleDateString('fr-FR')}] Compte vérifié par admin`
}

function saveNotes() {
  if (!bakery.value) return
  bakery.value.notes = adminNotes.value
}
</script>

<template>
  <div v-if="bakery" class="container-section py-8">
    <button class="text-chocolate-600 hover:text-primary-600 text-sm mb-6" @click="router.push('/admin')">
      ← Retour à l'administration
    </button>

    <!-- Header avec actions -->
    <div class="card mb-6">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-4">
          <img
            v-if="bakeryAvatar"
            :src="bakeryAvatar"
            :alt="bakery.name"
            class="w-20 h-20 rounded-full object-cover border-2 border-primary-200"
          />
          <div>
            <h1 class="text-2xl font-display font-bold text-chocolate-800">{{ bakery.name }}</h1>
            <p class="text-chocolate-600 mt-1">{{ bakery.email }}</p>
            <div class="flex items-center gap-2 mt-2">
              <span :class="verificationStatusColors[bakery.verificationStatus || 'pending']" class="badge">
                {{ bakery.verificationStatus === 'verified' ? 'Vérifié' : bakery.verificationStatus === 'pending' ? 'En attente' : bakery.verificationStatus === 'suspended' ? 'Suspendu' : 'Rejeté' }}
              </span>
              <span v-if="bakery.suspendedUntil" class="text-xs text-red-600">
                Suspendu jusqu'au {{ new Date(bakery.suspendedUntil).toLocaleDateString('fr-FR') }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Actions rapides -->
        <div class="flex gap-2">
          <button @click="showContactModal = true" class="btn-outline text-sm">
            📧 Contacter
          </button>
          <button
            v-if="bakery.verificationStatus !== 'suspended'"
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
            v-if="bakery.verificationStatus !== 'verified'"
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
        <!-- Informations légales -->
        <div class="card">
          <h2 class="text-xl font-semibold text-chocolate-800 mb-4">Informations légales</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-chocolate-600 mb-1">SIRET</p>
              <p class="font-mono text-chocolate-800 font-semibold">{{ bakery.siret || 'Non renseigné' }}</p>
            </div>
            <div>
              <p class="text-sm text-chocolate-600 mb-1">SIREN</p>
              <p class="font-mono text-chocolate-800 font-semibold">{{ bakery.siren || 'Non renseigné' }}</p>
            </div>
            <div>
              <p class="text-sm text-chocolate-600 mb-1">Numéro TVA</p>
              <p class="font-mono text-chocolate-800 font-semibold">{{ bakery.tvaNumber || 'Non renseigné' }}</p>
            </div>
            <div>
              <p class="text-sm text-chocolate-600 mb-1">Date d'inscription</p>
              <p class="text-chocolate-800">{{ new Date(bakery.createdAt).toLocaleDateString('fr-FR') }}</p>
            </div>
          </div>
        </div>

        <!-- Coordonnées -->
        <div class="card">
          <h2 class="text-xl font-semibold text-chocolate-800 mb-4">Coordonnées</h2>
          <div class="space-y-3">
            <div>
              <p class="text-sm text-chocolate-600 mb-1">Adresse</p>
              <p class="text-chocolate-800">{{ bakery.address }}, {{ bakery.postalCode }} {{ bakery.city }}</p>
            </div>
            <div>
              <p class="text-sm text-chocolate-600 mb-1">Téléphone</p>
              <p class="text-chocolate-800">{{ bakery.phone || 'Non renseigné' }}</p>
            </div>
            <div>
              <p class="text-sm text-chocolate-600 mb-1">Email</p>
              <p class="text-chocolate-800">{{ bakery.email }}</p>
            </div>
            <div v-if="bakery.managerName">
              <p class="text-sm text-chocolate-600 mb-1">Responsable</p>
              <p class="text-chocolate-800">{{ bakery.managerName }}</p>
              <p class="text-sm text-chocolate-600">{{ bakery.managerEmail }}</p>
            </div>
          </div>
        </div>

        <!-- Documents de vérification -->
        <div class="card">
          <h2 class="text-xl font-semibold text-chocolate-800 mb-4">Documents de vérification</h2>
          <div v-if="bakery.verificationDocuments && bakery.verificationDocuments.length > 0" class="space-y-3">
            <div
              v-for="(doc, idx) in bakery.verificationDocuments"
              :key="idx"
              class="flex items-center justify-between p-3 border border-chocolate-200 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <span class="text-2xl">📄</span>
                <div>
                  <p class="font-medium text-chocolate-800">{{ documentTypeLabels[doc.type] }}</p>
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
              <p class="text-2xl font-bold text-primary-600">{{ bakeryStore.totalMissions }}</p>
              <p class="text-sm text-chocolate-600 mt-1">Missions totales</p>
            </div>
            <div class="text-center p-4 bg-cream-50 rounded-lg">
              <p class="text-2xl font-bold text-green-600">{{ bakeryStore.openMissions }}</p>
              <p class="text-sm text-chocolate-600 mt-1">Missions ouvertes</p>
            </div>
            <div class="text-center p-4 bg-cream-50 rounded-lg">
              <p class="text-2xl font-bold text-blue-600">{{ bakeryStore.filledMissions }}</p>
              <p class="text-sm text-chocolate-600 mt-1">Missions pourvues</p>
            </div>
            <div class="text-center p-4 bg-cream-50 rounded-lg">
              <p class="text-2xl font-bold text-yellow-600">{{ bakeryStore.totalApplications }}</p>
              <p class="text-sm text-chocolate-600 mt-1">Candidatures</p>
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
            placeholder="Notes internes sur cette boulangerie..."
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
            <button @click="showContactModal = true" class="btn-outline w-full text-sm">
              📞 Contacter par téléphone
            </button>
            <button
              v-if="bakery.verificationStatus !== 'verified'"
              @click="handleVerify"
              class="btn-primary w-full text-sm"
            >
              ✓ Valider le compte
            </button>
            <button
              v-if="bakery.verificationStatus === 'verified'"
              @click="bakery.verificationStatus = 'pending'"
              class="btn-secondary w-full text-sm"
            >
              ⚠️ Remettre en attente
            </button>
            <button
              v-if="bakery.verificationStatus !== 'suspended'"
              @click="showSuspendModal = true"
              class="btn-secondary w-full text-sm bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
            >
              🚫 Suspendre le compte
            </button>
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
        <h3 class="text-xl font-semibold text-chocolate-800 mb-4">Contacter {{ bakery.name }}</h3>
        <div class="space-y-3">
          <div>
            <p class="text-sm text-chocolate-600 mb-1">Email</p>
            <a :href="`mailto:${bakery.email}`" class="text-primary-600 hover:underline">
              {{ bakery.email }}
            </a>
          </div>
          <div v-if="bakery.phone">
            <p class="text-sm text-chocolate-600 mb-1">Téléphone</p>
            <a :href="`tel:${bakery.phone}`" class="text-primary-600 hover:underline">
              {{ bakery.phone }}
            </a>
          </div>
          <div v-if="bakery.managerEmail">
            <p class="text-sm text-chocolate-600 mb-1">Email responsable</p>
            <a :href="`mailto:${bakery.managerEmail}`" class="text-primary-600 hover:underline">
              {{ bakery.managerEmail }}
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
    Boulangerie introuvable.
  </div>
</template>

<style scoped>
</style>

