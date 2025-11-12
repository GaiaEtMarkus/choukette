<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useBlogStore } from '@/stores/blog'

const route = useRoute()
const blogStore = useBlogStore()

const postId = computed(() => route.params.id as string)
const post = computed(() => blogStore.getPostById(postId.value))

const relatedPosts = computed(() => {
  if (!post.value) return []
  return blogStore.sortedPosts
    .filter(p => 
      p.id !== post.value!.id && 
      (p.category === post.value!.category || 
       p.tags.some(tag => post.value!.tags.includes(tag)))
    )
    .slice(0, 3)
})

onMounted(() => {
  if (post.value) {
    blogStore.incrementViews(post.value.id)
  }
})
</script>

<template>
  <div class="bg-cream-200 min-h-screen py-8">
    <div class="container-section max-w-4xl">
      <!-- Breadcrumb -->
      <nav class="mb-6">
        <ol class="flex items-center space-x-2 text-sm text-chocolate-600">
          <li><RouterLink to="/" class="hover:text-primary-600">Accueil</RouterLink></li>
          <li>/</li>
          <li><RouterLink to="/blog" class="hover:text-primary-600">Blog</RouterLink></li>
          <li v-if="post">/</li>
          <li v-if="post" class="text-chocolate-800 font-medium">{{ post?.title }}</li>
        </ol>
      </nav>

      <!-- Article non trouvé -->
      <div v-if="!post" class="card text-center py-12">
        <p class="text-chocolate-600 text-lg mb-4">Article non trouvé</p>
        <RouterLink to="/blog" class="btn-primary">
          Retour au blog
        </RouterLink>
      </div>

      <!-- Article -->
      <article v-else class="card">
        <!-- Header -->
        <div class="mb-6">
          <!-- Catégorie et featured -->
          <div class="flex items-center gap-3 mb-4">
            <span class="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
              {{ blogStore.categories.find(c => c.id === post?.category)?.icon }}
              {{ blogStore.categories.find(c => c.id === post?.category)?.label }}
            </span>
            <span v-if="post?.featured" class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
              ⭐ À la une
            </span>
          </div>

          <!-- Titre -->
          <h1 class="text-3xl md:text-4xl font-display font-bold text-chocolate-800 mb-4">
            {{ post.title }}
          </h1>

          <!-- Meta -->
          <div class="flex flex-wrap items-center gap-4 text-sm text-chocolate-600 mb-6">
            <div class="flex items-center gap-2">
              <img
                :src="post.authorAvatar || 'https://i.pravatar.cc/150?img=1'"
                :alt="post.author"
                class="w-8 h-8 rounded-full object-cover"
              />
              <span class="font-medium">{{ post.author }}</span>
            </div>
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ new Date(post.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) }}
            </div>
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ post.readTime }} min de lecture
            </div>
            <div v-if="post.views" class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {{ post.views }} vues
            </div>
          </div>

          <!-- Image principale -->
          <div class="relative h-64 md:h-96 rounded-lg overflow-hidden mb-6">
            <img
              :src="post.imageUrl"
              :alt="post.title"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

        <!-- Contenu -->
        <div class="prose prose-lg max-w-none">
          <div v-html="post.content" class="text-chocolate-700 leading-relaxed"></div>
        </div>

        <!-- Tags -->
        <div class="mt-8 pt-6 border-t border-chocolate-200">
          <h3 class="text-sm font-semibold text-chocolate-800 mb-3">Tags</h3>
          <div class="flex flex-wrap gap-2">
            <RouterLink
              v-for="tag in post.tags"
              :key="tag"
              :to="`/blog?search=${tag}`"
              class="px-3 py-1 bg-cream-100 text-chocolate-600 text-sm rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors"
            >
              #{{ tag }}
            </RouterLink>
          </div>
        </div>

        <!-- Partage -->
        <div class="mt-6 pt-6 border-t border-chocolate-200">
          <h3 class="text-sm font-semibold text-chocolate-800 mb-3">Partager cet article</h3>
          <div class="flex gap-3">
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Facebook
            </button>
            <button class="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm">
              Twitter
            </button>
            <button class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm">
              LinkedIn
            </button>
          </div>
        </div>
      </article>

      <!-- Articles similaires -->
      <div v-if="relatedPosts.length > 0" class="mt-12">
        <h2 class="text-2xl font-display font-bold text-chocolate-800 mb-6">
          Articles similaires
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article
            v-for="relatedPost in relatedPosts"
            :key="relatedPost.id"
            class="card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <RouterLink :to="`/blog/${relatedPost.id}`" class="block">
              <div class="relative h-40 mb-4 rounded-lg overflow-hidden">
                <img
                  :src="relatedPost.imageUrl"
                  :alt="relatedPost.title"
                  class="w-full h-full object-cover"
                />
              </div>
              <h3 class="text-lg font-semibold text-chocolate-800 mb-2 line-clamp-2">
                {{ relatedPost.title }}
              </h3>
              <p class="text-sm text-chocolate-600 line-clamp-2">
                {{ relatedPost.excerpt }}
              </p>
              <div class="mt-3 text-xs text-chocolate-500">
                {{ new Date(relatedPost.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) }}
              </div>
            </RouterLink>
          </article>
        </div>
      </div>

      <!-- CTA retour -->
      <div class="mt-8 text-center">
        <RouterLink to="/blog" class="btn-outline">
          ← Retour au blog
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose {
  color: #5c4033;
}

.prose h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #5c4033;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #5c4033;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.prose p {
  margin-bottom: 1rem;
  line-height: 1.75;
}

.prose ul,
.prose ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

.prose strong {
  font-weight: 600;
  color: #5c4033;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

