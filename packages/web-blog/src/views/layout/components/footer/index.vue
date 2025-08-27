<template>
  <footer class="footer glass-footer simple-footer">
    <div class="container">
      <div class="footer-bottom">
        <el-tooltip class="copyright" effect="dark" content="鄂ICP备2021020610号" placement="top">
          <span
          >&copy;2021<a href="https://beian.miit.gov.cn" target="_blank"
          >鄂ICP备2021020610号</a
          ></span
          >
        </el-tooltip>
        <div>
          <span class="time">网站已风雨兼程运行了：{{ runTimeDuration }}</span>
        </div>
        <ul class="terms-links">
          <li v-for="(item, index) in links" class="link-item">
            <a href="#" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>
            <span v-if="links.length - 1 !== index" class="line">|</span>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import dayjs from "dayjs"

const links = ref([
  {
    url: "",
    title: "隐私政策",
  },
  {
    url: "",
    title: "使用条款",
  },
])

const runTimeDuration = computed(() => {
  const date = dayjs(new Date("2021-12-02"))
  return dayjs().diff(date, "days") + "天"
})
</script>

<style scoped lang="scss">
.simple-footer {
  padding: 0.5rem 0;
  color: var(--text-light);
  font-size: 16px;
  margin-top: auto; // 在父容器为flex列布局时将footer推到底部

  .footer-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .terms-links {
      display: flex;
      align-items: baseline;

      .link-item {
        a {
          color: inherit;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }

        .line {
          margin: 0 10px;
        }
      }
    }
  }
}
.glass-footer {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
}

.dark .glass-footer {
  background: rgba(30, 30, 30, 0.5);
}
@media (max-width: 640px) {
  .footer-bottom {
    flex-direction: column;
  }
}
</style>
