<!--<template>-->
<!--  <section class="about">-->
<!--    <div class="hero glass">-->
<!--      <h1 class="title">关于我</h1>-->
<!--      <p class="subtitle">前端 / 全栈 / 开源 / 记录学习与生活</p>-->
<!--    </div>-->

<!--    <div class="container">-->
<!--      <div class="about-content glass">-->
<!--        <p>-->
<!--          你好，我是 Mindscape，一名热爱构建优秀产品体验的开发者。这个博客用于沉淀实践、记录灵感，也欢迎你与我交流。-->
<!--        </p>-->
<!--        <ul class="info">-->
<!--          <li><strong>关注领域：</strong> 前端工程化、性能优化、服务端实践</li>-->
<!--          <li><strong>正在学习：</strong> 可视化、WebSocket、全栈一体化</li>-->
<!--          <li><strong>联系：</strong> 在聊天页留言或通过社交链接联系</li>-->
<!--        </ul>-->
<!--      </div>-->
<!--    </div>-->
<!--  </section>-->
<!--</template>-->

<script setup lang="ts"></script>

<style scoped lang="scss">
.about { padding: 2rem 0 3rem; }
.hero { margin: 0 auto 1.5rem; padding: 2rem 1.25rem; border-radius: 16px; text-align: center; }
.title { font-size: 1.75rem; margin-bottom: .5rem; }
.subtitle { color: #888; }
.about-content { padding: 1.25rem; border-radius: 16px; line-height: 1.8; }
.info { margin-top: .75rem; padding-left: 1rem; }
.info li { margin: .25rem 0; }
</style>

<template>
  <div class="wrapper">
    <h2>{{ $t("projectIntroduction") }}</h2>
    <h3>{{ $t("technologyStack") }}</h3>
    <ul class="inn">
      <li>
        <span>{{ $t("frontEnd") }}</span>
        <el-space wrap>
          <el-tag size="large" v-for="item in clientList" :key="item.name">
            <a :href="item.url" target="_blank">{{ item.name }}</a>
          </el-tag>
        </el-space>
      </li>
      <li>
        <span>{{ $t("backEnd") }}</span>
        <el-space wrap>
          <el-tag size="large" v-for="item in serverList" :key="item.name">
            <a :href="item.url" target="_blank">{{ item.name }}</a>
          </el-tag>
        </el-space>
      </li>
      <li>
        <span>{{ $t("deployment") }}</span>
        <el-tag size="large">nginx</el-tag>
      </li>
    </ul>
    <h3>{{ $t("technicalPoint") }}</h3>
    <ul class="point">
      <li>{{ $t("fileLib1") }}</li>
      <li>{{ $t("chatRoom1") }}</li>
      <li>{{ $t("studyIssue1") }}</li>
      <li>{{ $t("wallpaper1") }}</li>
    </ul>
    <h3>{{ $t("timeNode") }}</h3>
    <el-timeline class="time_line">
      <el-timeline-item
        v-for="(item, index) in timeList"
        :key="index"
        :timestamp="item.timestamp"
        placement="top">
        <el-space direction="vertical" alignment="normal">
          <el-card v-for="(subItem, subIndex) in item.list" :key="subIndex">
            <h4 class="title">{{ subItem.title }}</h4>
            <p class="time">{{ subItem.startTime }}</p>
          </el-card>
        </el-space>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script lang="ts" setup name="aboutR">
  import { t } from "@/lang"
  import { clientList, serverList } from "./list.ts"

  const timeList: any[] = [
    {
      timestamp: "2023/5",
      list: [
        {
          title: "增加到访记录",
          startTime: "2023/5/12 10:12",
        },
      ],
    },
    {
      timestamp: "2023/3",
      list: [
        {
          title: t("timeList.content1"),
          startTime: "2023/3/9 18:13",
        },
        {
          title: t("timeList.content2"),
          startTime: "2023/3/7 11:48",
        },
      ],
    },
    {
      timestamp: "2023/2",
      list: [
        {
          title: t("timeList.content3"),
          startTime: "2023/2/24 15:06",
        },
        {
          title: t("timeList.content4"),
          startTime: "2023/2/21 10:37",
        },
      ],
    },
  ]
</script>
<style lang="scss" scoped>
  // @keyframes shining {
  //   from {
  //     text-shadow: 0 0 2px rgba(182, 211, 207, 0.9),
  //       0 0 1px rgba(182, 211, 207, 0.3), 0 0 2px rgba(15, 115, 223, 0.3),
  //       0 0 1px rgba(15, 115, 223, 0.9), 0 0 2px rgba(15, 115, 223, 0.8),
  //       0 0 1px rgba(15, 115, 223, 0.9);
  //   }
  //   to {
  //     text-shadow: 0 0 2px rgba(182, 211, 207, 1),
  //       0 0 2px rgba(182, 211, 207, 0.4), 0 0 3px rgba(15, 115, 223, 0.4),
  //       0 0 2px rgba(15, 115, 223, 0.8), 0 0 3px rgba(15, 115, 223, 0.9),
  //       0 0 2px rgba(15, 115, 223, 1);
  //   }
  // }
  .wrapper {
    font-family: "Pacifico", cursive;

    h2 {
      font-size: 28px;
      font-weight: bold;
      line-height: 56px;
    }

    h3 {
      font-size: 22px;
      font-weight: bold;
      line-height: 44px;
      color: #333;
      margin-top: 5px;
    }

    .inn {
      padding-left: 20px;

      li {
        display: flex;
        align-items: center;

        .el-tag {
          font-size: 14px;
          // font-weight: bold;
          cursor: pointer;

          a {
            color: #409eff;
            text-decoration: none;

            &:hover {
              color: #ff404b;
              text-decoration: underline;
            }
          }
        }

        & > span:nth-child(1) {
          margin-right: 10px;
          font-weight: bold;
          white-space: nowrap;
        }

        & + li {
          margin-top: 15px;
        }
      }
    }

    .point {
      list-style: initial;
      padding-left: 40px;

      li {
        line-height: 28px;
        font-size: 16px;

        text-transform: uppercase;
        animation: shining 0.1s alternate infinite;
      }
    }

    .time_line {
      width: 100%;

      .el-space {
        width: 100%;

        .title {
          margin-bottom: 20px;
          font-size: 24px;
          font-weight: bold;
          background-image: linear-gradient(
            to right,
            #00c6ff,
            #124057
          ); /* 线性渐变背景，方向向右 */
          -webkit-background-clip: text; /* 背景被裁剪成文字的前景色 */
          -webkit-text-fill-color: transparent; /* 文字填充颜色变透明 */
        }

        .time {
          color: rgb(136, 124, 121);
        }
      }
    }
  }
</style>
