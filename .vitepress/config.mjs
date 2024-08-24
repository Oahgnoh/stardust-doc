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
        text: "后端学习",
        items: [
          { text: "学习笔记7月", link: "/docs/back-end/学习笔记7月/0322", },
          { text: "学习笔记8月", link: "/docs/back-end/学习笔记8月/Elasticsearch" },
        ],
      },
      {
        text: "代码片段",
        items: [
          { text: "常用正则", link: "/docs/code-snippets/regexp", },
        ],
      },
      {
        text: "提效工具",
        items: [
          { text: "在线工具", link: "/docs/efficiency/online-tools", },
        ],
      },
    ],

    // 自动生成 左侧侧边栏
    sidebar: {
      "/docs/course": set_sidebar("/docs/course"),
      "/docs/back-end": set_sidebar("/docs/back-end"),
      "/docs/code-snippets": set_sidebar("/docs/code-snippets"),
      "/docs/efficiency": set_sidebar("/docs/efficiency")
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
