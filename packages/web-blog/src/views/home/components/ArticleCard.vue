<template>
  <article class="article-card glass" :class="{ 'hovered': isHovered }">
    <div class="article-image">
      <img :src="article.image" :alt="article.title" class="image">
      <div class="article-category glass">
        {{ article.category }}
      </div>
    </div>

    <div class="article-content">
      <div class="article-meta">
        <span class="meta-item">
          <i class="fa fa-calendar-o"></i> {{ article.date }}
        </span>
        <span class="meta-item">
          <i class="fa fa-clock-o"></i> {{ article.readTime }} 分钟
        </span>
      </div>

      <h3 class="article-title">
        <a :href="'#'">{{ article.title }}</a>
      </h3>

      <p class="article-excerpt">
        {{ article.excerpt }}
      </p>

      <div class="article-footer">
        <div class="author-info">
          <img :src="article.author.avatar" :alt="article.author.name" class="author-avatar">
          <span class="author-name">{{ article.author.name }}</span>
        </div>

        <a href="#" class="read-more">
          阅读全文 <i class="fa fa-arrow-right"></i>
        </a>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Article } from '@/types'

defineProps<{
  article: Article
}>()

const isHovered = ref(false)
</script>

<style lang="scss" scoped>
.article-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform .25s ease, box-shadow .25s ease;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,.08);
}

.article-image { position: relative; }
.image { width: 100%; height: 160px; object-fit: cover; display: block; }

.article-category {
  position: absolute;
  left: .75rem;
  bottom: .75rem;
  padding: .25rem .5rem;
  border-radius: 8px;
  font-size: .75rem;
}

.article-content { padding: .9rem; }
.article-meta { display: flex; gap: .75rem; color: var(--text-light); font-size: .85rem; }
.meta-item { display: inline-flex; align-items: center; gap: .35rem; }
.article-title { margin: .4rem 0 .35rem; font-size: 1.05rem; }
.article-title a { color: inherit; text-decoration: none; }
.article-excerpt { color: var(--text-light); }
.article-footer { margin-top: .75rem; display: flex; align-items: center; justify-content: space-between; }
.author-info { display: inline-flex; align-items: center; gap: .5rem; }
.author-avatar { width: 24px; height: 24px; border-radius: 50%; }
.read-more { text-decoration: none; }
</style>
