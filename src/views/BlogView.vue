<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useBlogStore } from '@/stores/blog'

const route = useRoute()
const blogStore = useBlogStore()

const searchQuery = ref('')
const selectedCategory = ref<string | null>(route.query.category as string || null)

// Filtres
const filteredPosts = computed(() => {
  let filtered = blogStore.sortedPosts

  // Filtre par catégorie
  if (selectedCategory.value) {
    filtered = filtered.filter(post => post.category === selectedCategory.value)
  }

  // Filtre par recherche
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  return filtered
})

const activeCategoryLabel = computed(() => {
  if (!selectedCategory.value) return 'Tous les articles'
  const category = blogStore.categories.find(c => c.id === selectedCategory.value)
  return category ? category.label : 'Tous les articles'
})

function selectCategory(categoryId: string | null) {
  selectedCategory.value = categoryId
}

function clearFilters() {
  searchQuery.value = ''
  selectedCategory.value = null
}
</script>

<template>
  <div class="bg-cream-200 min-h-screen py-8">
    <div class="container-section">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-display font-bold text-chocolate-800 mb-4">
          Blog Choukette
        </h1>
        <p class="text-lg text-chocolate-600 max-w-2xl mx-auto">
          Conseils, techniques, recettes et actualités pour les professionnels de la boulangerie
        </p>
      </div>

      <!-- Filtres et recherche -->
      <div class="card mb-8">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Recherche -->
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher un article..."
              class="w-full input-field"
            />
          </div>

          <!-- Catégories -->
          <div class="flex flex-wrap gap-2">
            <button
              @click="selectCategory(null)"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                !selectedCategory 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-cream-100 text-chocolate-700 hover:bg-cream-200'
              ]"
            >
              Tous
            </button>
            <button
              v-for="category in blogStore.categories"
              :key="category.id"
              @click="selectCategory(category.id)"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-cream-100 text-chocolate-700 hover:bg-cream-200'
              ]"
            >
              {{ category.icon }} {{ category.label }}
            </button>
          </div>
        </div>

        <!-- Résultats -->
        <div v-if="searchQuery || selectedCategory" class="mt-4 pt-4 border-t border-chocolate-200">
          <p class="text-sm text-chocolate-600">
            {{ filteredPosts.length }} article{{ filteredPosts.length > 1 ? 's' : '' }} trouvé{{ filteredPosts.length > 1 ? 's' : '' }}
            <span v-if="selectedCategory"> dans la catégorie "{{ activeCategoryLabel }}"</span>
            <span v-if="searchQuery"> pour "{{ searchQuery }}"</span>
            <button
              @click="clearFilters"
              class="ml-2 text-primary-600 hover:text-primary-700 underline"
            >
              Réinitialiser
            </button>
          </p>
        </div>
      </div>

      <!-- Liste des articles -->
      <div v-if="filteredPosts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="post in filteredPosts"
          :key="post.id"
          class="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <RouterLink :to="`/blog/${post.id}`" class="block">
            <!-- Image -->
            <div class="relative h-48 mb-4 rounded-lg overflow-hidden">
              <img
                :src="post.imageUrl"
                :alt="post.title"
                class="w-full h-full object-cover"
              />
              <div class="absolute top-3 left-3">
                <span class="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-chocolate-800">
                  {{ blogStore.categories.find(c => c.id === post.category)?.icon }}
                  {{ blogStore.categories.find(c => c.id === post.category)?.label }}
                </span>
              </div>
              <div v-if="post.featured" class="absolute top-3 right-3">
                <span class="px-3 py-1 bg-primary-600 text-white rounded-full text-xs font-semibold">
                  ⭐ À la une
                </span>
              </div>
            </div>

            <!-- Contenu -->
            <div class="space-y-3">
              <h2 class="text-xl font-semibold text-chocolate-800 line-clamp-2">
                {{ post.title }}
              </h2>
              <p class="text-chocolate-600 text-sm line-clamp-3">
                {{ post.excerpt }}
              </p>

              <!-- Meta -->
              <div class="flex items-center justify-between text-xs text-chocolate-500 pt-3 border-t border-chocolate-200">
                <div class="flex items-center gap-3">
                  <div class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ post.readTime }} min
                  </div>
                  <div v-if="post.views" class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {{ post.views }}
                  </div>
                </div>
                <span>{{ new Date(post.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) }}</span>
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap gap-2 pt-2">
                <span
                  v-for="tag in post.tags.slice(0, 3)"
                  :key="tag"
                  class="px-2 py-1 bg-cream-100 text-chocolate-600 text-xs rounded-full"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
          </RouterLink>
        </article>
      </div>

      <!-- Aucun résultat -->
      <div v-else class="card text-center py-12">
        <p class="text-chocolate-600 text-lg mb-4">Aucun article trouvé</p>
        <button
          @click="clearFilters"
          class="btn-primary"
        >
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

