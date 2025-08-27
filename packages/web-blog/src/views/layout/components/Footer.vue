<template>
  <footer class="footer glass-footer simple-footer">
    <div class="container">
      <div class="footer-bottom">
        <div class="copyright">
          &copy; {{ currentYear }} {{ blogTitle }}. 保留所有权利。
        </div>
        <div class="terms-links">
          <a href="#" target="_blank" rel="noopener noreferrer">隐私政策</a>
          <span>|</span>
          <a href="#" target="_blank" rel="noopener noreferrer">使用条款</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())
const blogTitle = ref('Mindscape')
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.simple-footer {
  margin-top: 2rem;
  padding: 1rem 0;
  color: var(--text-light);
  font-size: .9rem;
  margin-top: auto; // 在父容器为flex列布局时将footer推到底部
  width: 100%;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .75rem;
  padding: .75rem 0;
}

.terms-links a {
  color: inherit;
  text-decoration: none;
}
.terms-links a:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .footer-bottom {
    flex-direction: column;
  }
}
</style>
