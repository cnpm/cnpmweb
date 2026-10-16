# 🪞 cnpmweb

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com) ![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/cnpm/cnpmweb)

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

```shell
# 使用你的首选的包管理工具进行依赖安装
$ cnpm i

# 启动本地开发环境
$ cnpm run dev

# 使用 tsrs 进行类型检查
$ cnpm run typecheck

# 生产构建（包含 tsrs 类型检查）
$ cnpm run build
```

## 部署到 Void

访问地址：[cnpmweb.void.app](https://cnpmweb.void.app)。

使用 Node.js 24.22.0（npm 11），再登录具有 `cnpmweb` 项目权限的 Void 账号。`npm run void` 使用固定版本的 Void CLI，独立于应用的 Vite 依赖：

```shell
$ npm install
$ npm run void -- connect https://api.void.cloud
$ npm run deploy
```

`void.config.ts` 指定执行 `npm run build` 并部署 `out/` 中的静态文件。路由规则将包详情、用户页面和搜索页面映射到 Next.js 导出的 HTML；短包名和 `~用户名` 路径使用兜底规则。动态页面的 JavaScript 文件另有规则，将 URL 中编码后的方括号映射到实际文件名。

根据 [Void 的 GitHub 部署文档](https://void.cloud/guide/deployment#deploy-from-github)，`.github/workflows/void-deploy.yml` 在推送到 `master` 时自动构建和部署，也支持在 `master` 上手动触发。工作流使用 GitHub OIDC 获取短期部署令牌，无需保存 `VOID_TOKEN` 密钥。

仓库变量 `VOID_API_URL` 设置为 `https://api.void.cloud`，Void 项目 `cnpmweb` 的 GitHub executor 设置为 `github_actions`，并授权上述工作流。项目管理员可以使用以下命令查看连接：

```shell
$ npm run void -- github status cnpmweb
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
