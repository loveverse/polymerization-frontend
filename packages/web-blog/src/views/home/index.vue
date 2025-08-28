<template>
  <section class="home">
    <div class="hero glass">
      <h1 class="title">Mindscape 博客</h1>
      <p class="subtitle">记录与分享 · 前端 · 全栈 · 随想</p>
    </div>

    <div class="container layout">
      <div class="main">
        <div class="grid">
          <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
        </div>
      </div>
      <aside class="sidebar">
        <div class="panel glass">
          <h3 class="panel-title">分类</h3>
          <ul class="cat-list">
            <li v-for="c in categories" :key="c.name" class="cat-item">
              <i class="fa" :class="c.icon"></i>
              <span>{{ c.name }}</span>
              <span class="count">{{ c.count }}</span>
            </li>
          </ul>
        </div>
        <div class="panel glass">
          <h3 class="panel-title">热门标签</h3>
          <div class="tags">
            <a v-for="t in tags" :key="t" class="tag">#{{ t }}</a>
          </div>
        </div>
      </aside>
      <aside class="sidebar">
        <div class="panel glass">
          <h3 class="panel-title">分类</h3>
          <ul class="cat-list">
            <li v-for="c in categories" :key="c.name" class="cat-item">
              <i class="fa" :class="c.icon"></i>
              <span>{{ c.name }}</span>
              <span class="count">{{ c.count }}</span>
            </li>
          </ul>
        </div>
        <div class="panel glass">
          <h3 class="panel-title">热门标签</h3>
          <div class="tags">
            <a v-for="t in tags" :key="t" class="tag">#{{ t }}</a>
          </div>
        </div>
      </aside>
      <aside class="sidebar">
        <div class="panel glass">
          <h3 class="panel-title">分类</h3>
          <ul class="cat-list">
            <li v-for="c in categories" :key="c.name" class="cat-item">
              <i class="fa" :class="c.icon"></i>
              <span>{{ c.name }}</span>
              <span class="count">{{ c.count }}</span>
            </li>
          </ul>
        </div>
        <div class="panel glass">
          <h3 class="panel-title">热门标签</h3>
          <div class="tags">
            <a v-for="t in tags" :key="t" class="tag">#{{ t }}</a>
          </div>
        </div>
      </aside>
      <aside class="sidebar">
        <div class="panel glass">
          <h3 class="panel-title">分类</h3>
          <ul class="cat-list">
            <li v-for="c in categories" :key="c.name" class="cat-item">
              <i class="fa" :class="c.icon"></i>
              <span>{{ c.name }}</span>
              <span class="count">{{ c.count }}</span>
            </li>
          </ul>
        </div>
        <div class="panel glass">
          <h3 class="panel-title">热门标签</h3>
          <div class="tags">
            <a v-for="t in tags" :key="t" class="tag">#{{ t }}</a>
          </div>
        </div>
      </aside>
      <aside class="sidebar">
        <div class="panel glass">
          <h3 class="panel-title">分类</h3>
          <ul class="cat-list">
            <li v-for="c in categories" :key="c.name" class="cat-item">
              <i class="fa" :class="c.icon"></i>
              <span>{{ c.name }}</span>
              <span class="count">{{ c.count }}</span>
            </li>
          </ul>
        </div>
        <div class="panel glass">
          <h3 class="panel-title">热门标签</h3>
          <div class="tags">
            <a v-for="t in tags" :key="t" class="tag">#{{ t }}</a>
          </div>
        </div>
      </aside>
      <aside class="sidebar">
        <div class="panel glass">
          <h3 class="panel-title">分类</h3>
          <ul class="cat-list">
            <li v-for="c in categories" :key="c.name" class="cat-item">
              <i class="fa" :class="c.icon"></i>
              <span>{{ c.name }}</span>
              <span class="count">{{ c.count }}</span>
            </li>
          </ul>
        </div>
        <div class="panel glass">
          <h3 class="panel-title">热门标签</h3>
          <div class="tags">
            <a v-for="t in tags" :key="t" class="tag">#{{ t }}</a>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue"
import type { Article, Category } from "@/types"

const articles = ref<Article[]>([
  {
    id: 1,
    title: "从 0 到 1：用 Vite 构建现代前端应用",
    excerpt: "Vite 通过原生 ES 模块与极速 HMR 提供飞一般的开发体验，本文带你从零搭建……",
    image: "/favicon.ico",
    category: "前端工程化",
    date: "2024-12-12",
    readTime: "8",
    comments: 12,
    author: { name: "Mindscape", avatar: "/favicon.ico" },
  },
  {
    id: 2,
    title: "Pinia 最佳实践：模块化与类型安全",
    excerpt: "围绕常见的状态管理场景，总结一套更清晰的组织方式与类型推导……",
    image: "/favicon.ico",
    category: "Vue",
    date: "2025-01-05",
    readTime: "6",
    comments: 5,
    author: { name: "Mindscape", avatar: "/favicon.ico" },
  },
  {
    id: 3,
    title: "组件动画与微交互：让界面更有温度",
    excerpt: "通过过渡、玻璃拟态和微交互细节，打磨让人愉悦的 UI……",
    image: "/favicon.ico",
    category: "设计与体验",
    date: "2025-02-18",
    readTime: "7",
    comments: 9,
    author: { name: "Mindscape", avatar: "/favicon.ico" },
  },
])

const categories = ref<Category[]>([
  { name: "前端工程化", count: 12, icon: "fa-cubes", color: "#6366f1" },
  { name: "Vue", count: 18, icon: "fa-vuejs", color: "#42b883" },
  { name: "TypeScript", count: 10, icon: "fa-code", color: "#3178c6" },
  { name: "设计与体验", count: 7, icon: "fa-magic", color: "#a855f7" },
])

const tags = ref<string[]>(["Vite", "Pinia", "ECharts", "组件封装", "性能优化"])
</script>

<style scoped lang="scss">
.home {
  padding: 2rem 0 3rem;
}

.hero {
  margin: 0 auto 1.5rem;
  padding: 2rem 1.25rem;
  border-radius: 16px;
  text-align: center;
}

.title {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #888;
}

.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel {
  border-radius: 16px;
  padding: 1rem;
}

.panel-title {
  margin-bottom: 0.5rem;
}

.cat-list {
  list-style: none;
  display: grid;
  gap: 0.5rem;
}

.cat-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-light);
}

.cat-item .count {
  color: var(--text);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  text-decoration: none;
  font-size: 0.85rem;
  color: var(--text);
  opacity: 0.85;
}

@media (min-width: 768px) {
  .layout {
    grid-template-columns: 1fr 300px;
    gap: 1.25rem;
  }
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .layout {
    grid-template-columns: 1fr 320px;
    gap: 1.5rem;
  }
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.5rem;
  }
}
</style>
