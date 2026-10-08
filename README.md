# 🪞 cnpmweb

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com)
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/cnpm/cnpmweb)

[🚀 在线示例](https://npmmirror.com)

> cnpmweb: A missing UI for custom registry.

![screenshot](https://github.com/cnpm/cnpmweb/blob/master/snap.png?raw=true)

- 🏗️ 支持一键部署
- 🛠️ 支持二次集成开发，支持任意 npm registry
- 🚀 基于 [Next.js](https://nextjs.org/docs/app/building-your-application/data-fetching) 纯静态部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/cnpm/cnpmweb)

## 项目简介

cnpmweb 是独立的前端应用，[npmmirror](https://npmmirror.com) 提供一个新的制品库界面，可在 `config.js` 中定义自定义 registry 地址。

## 开发指南

使用 Node.js 22 或 24，并安装 Utoo 1.1.10，与 CI 保持一致。

```shell
# 安装依赖
$ ut install

# 启动本地开发环境
$ ut run dev

# 执行 lint、生产构建和测试
$ ut run ci
```

## 功能计划

- [x] 产物预览
- [x] 依赖信息
- [x] 版本列表
- [x] 版本选择
- [x] 搜索结果

## License

[MIT](LICENSE)

## 贡献者

[![Contributors](https://contrib.rocks/image?repo=cnpm/cnpmweb)](https://github.com/cnpm/cnpmweb/graphs/contributors)

Made with [contributors-img](https://contrib.rocks).
