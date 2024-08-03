import { defineConfig } from 'vitepress'
import { set_sidebar } from "../utils/auto-gen-sidebar.mjs";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/stardust-doc/",
  head: [["link", { rel: "icon", href: "/stardust-doc/peka.svg" }]],
  title: "Oahgnoh的文档网站",
  description: "A Oahgnoh Site",
  themeConfig: {
    // 配置logo位置，public目录
    logo: "/peka.svg",

    // 顶部导航栏配置
    nav: [
      { text: '主页', link: '/' },
      {
        text: "后端",
        items: [
          {
            text: "SpringBoot集成各种技术",
            link: "/docs/back-end/integrate-tech",
          },
          { text: "RabbitMQ", link: "/docs/back-end/rabbitmq" },
          { text: "ElasticSearch", link: "/docs/back-end/elasticsearch" },
          { text: "Mybatis-Plus", link: "/docs/back-end/mybatis-plus" },
          { text: "SpringBoot项目模版", link: "/docs/back-end/springboot-template" },
        ],
      },
    ],

    // 自动生成左侧侧边栏
    sidebar: {
      "/docs/教程": set_sidebar("/docs/教程"),
      "/docs/开发规范": set_sidebar("/docs/开发规范"),
      "/docs/学习笔记7月": set_sidebar("/docs/学习笔记7月"),
      "/docs/学习笔记8月": set_sidebar("/docs/学习笔记8月"),
      "/docs/analysis": set_sidebar("/docs/analysis"),
      "/docs/back-end": set_sidebar("/docs/back-end"),
      "/docs/efficiency": set_sidebar("/docs/efficiency"),
      "/docs/pit": set_sidebar("/docs/pit"),
      "/docs/workflow": set_sidebar("/docs/workflow")
    },
    // 右侧导航栏配置
    outlineTitle: "文章目录",
    outline: [2, 6],

    // 翻页配置
    docFooter: {
      prev: "上一页",
      next: "下一页"
    },

    // 右上角链接
    socialLinks: [
      {
        icon: {
          svg: '<svg t="1722678554153" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4549" width="256" height="256"><path d="M512 1024C229.248 1024 0 794.752 0 512S229.248 0 512 0s512 229.248 512 512-229.248 512-512 512z m259.168-568.896h-290.752a25.28 25.28 0 0 0-25.28 25.28l-0.032 63.232c0 13.952 11.296 25.28 25.28 25.28h177.024a25.28 25.28 0 0 1 25.28 25.28v12.64a75.84 75.84 0 0 1-75.84 75.84h-240.224a25.28 25.28 0 0 1-25.28-25.28v-240.192a75.84 75.84 0 0 1 75.84-75.84h353.92a25.28 25.28 0 0 0 25.28-25.28l0.064-63.2a25.312 25.312 0 0 0-25.28-25.312H417.184a189.632 189.632 0 0 0-189.632 189.6v353.952c0 13.952 11.328 25.28 25.28 25.28h372.928a170.656 170.656 0 0 0 170.656-170.656v-145.376a25.28 25.28 0 0 0-25.28-25.28z" p-id="4550"></path></svg>',
          // 彩色图标
          // svg: '<svg t="1704626282666" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4227" width="200" height="200"><path d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512z m259.149-568.883h-290.74a25.293 25.293 0 0 0-25.292 25.293l-0.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l0.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.645V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a170.65 170.65 0 0 0 170.65-170.65V480.384a25.293 25.293 0 0 0-25.293-25.267z" fill="#C71D23" p-id="4228"></path></svg>',
        },
        link: 'https://gitee.com/xuhonghaochn'
      },
      { icon: 'github', link: 'https://github.com/Oahgnoh' }
    ],
    // 设置搜索框的样式
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },
    footer: {
      copyright: 'Copyright © 2024 Stardust Doc',
    }
  },
})
