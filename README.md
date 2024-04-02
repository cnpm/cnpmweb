# 🪞 cnpmweb

[🚀 在线示例](https://cnpmweb.vercel.app/)

> cnpmweb: A missing UI for custom registry.

![screenshot](https://github.com/cnpm/cnpmweb/blob/main/snap.png)

- 🏗️ 支持一键部署
- 🛠️ 支持二次集成开发，支持任意 npm registry
- 🚀 基于 [Next.js](https://nextjs.org/docs/app/building-your-application/data-fetching) 纯静态部署
- 🎉 使用 [CodeBlitz](https://github.com/opensumi/codeblitz) 进行代码浏览

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/cnpm/cnpmweb)

## 项目简介

cnpmweb 是独立的前端应用，[npmmirror](https://npmmirror.com) 提供一个新的制品库界面，可在 `config.js` 中定义自定义 registry 地址。

## 开发指南

```shell
# 使用你的首选的包管理工具进行依赖安装
$ cnpm i

# 启动本地开发环境
$ cnpm run dev

```

## 功能计划

- [x] 产物预览
- [x] 依赖信息
- [x] 版本列表
- [x] 版本选择
- [x] 搜索结果
