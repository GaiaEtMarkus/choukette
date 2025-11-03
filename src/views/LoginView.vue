<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBakeriesStore } from '@/stores/bakeries'
import { useProfessionalsStore } from '@/stores/professionals'
import { useMissionsStore } from '@/stores/missions'

const router = useRouter()
const authStore = useAuthStore()
const bakeriesStore = useBakeriesStore()
const professionalsStore = useProfessionalsStore()
const missionsStore = useMissionsStore()

const email = ref('')
const password = ref('')
const userType = ref<'bakery' | 'professional'>('bakery')
const error = ref('')

// Identifiants de démo
const demoCredentials = {
  bakery: [
    { email: 'boulangerie@moulin.fr', password: 'demo123', id: 'bakery1' },
    { email: 'contact@delices.fr', password: 'demo123', id: 'bakery2' }
  ],
  professional: [
    { email: 'camille.moreau@example.fr', password: 'demo123', id: 'pro1' },
    { email: 'sofiane.leroux@example.fr', password: 'demo123', id: 'pro2' }
  ]
}

async function handleLogin() {
  error.value = ''
  try {
    if (userType.value === 'bakery') {
      await bakeriesStore.login(email.value, password.value)
      const bakery = bakeriesStore.currentBakery
      if (bakery) {
        bakeriesStore.loadBakeryData(bakery.id, missionsStore.missions)
        await authStore.login(email.value, password.value, 'bakery')
        router.push('/dashboard/bakery')
      }
    } else {
      const pro = professionalsStore.professionals.find(p => 
        p.id === 'pro1' || p.id === 'pro2'
      )
      if (pro) {
        await authStore.login(email.value, password.value, 'professional')
        router.push('/dashboard/professional')
      }
    }
  } catch (err) {
    error.value = 'Identifiants incorrects'
  }
}
</script>

<template>
  <div class="container-section py-16">
    <div class="max-w-md mx-auto card">
      <h1 class="text-2xl font-display font-bold text-chocolate-800 mb-6">Connexion</h1>
      
      <div class="mb-4">
        <label class="block text-sm font-medium text-chocolate-700 mb-2">Type de compte</label>
        <select v-model="userType" class="input-field">
          <option value="bakery">Boulangerie</option>
          <option value="professional">Professionnel</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-chocolate-700 mb-2">Email</label>
        <input v-model="email" type="email" class="input-field" placeholder="votre@email.fr" />
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-chocolate-700 mb-2">Mot de passe</label>
        <input v-model="password" type="password" class="input-field" placeholder="••••••••" />
      </div>

      <div v-if="error" class="mb-4 text-red-600 text-sm">{{ error }}</div>

      <button @click="handleLogin" class="btn-primary w-full mb-4">Se connecter</button>

      <div class="border-t pt-4 text-sm text-chocolate-600">
        <p class="font-semibold mb-2">Identifiants de démo :</p>
        <div class="space-y-1">
          <p v-if="userType === 'bakery'">
            Boulangerie: <code class="bg-cream-100 px-2 py-1 rounded">boulangerie@moulin.fr / demo123</code>
          </p>
          <p v-else>
            Professionnel: <code class="bg-cream-100 px-2 py-1 rounded">camille.moreau@example.fr / demo123</code>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

