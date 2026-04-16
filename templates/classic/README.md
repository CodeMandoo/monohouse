# MonoHouse Classic

`classic` 表示基于 Monorepo 的传统前端分层架构。

目录：

```text
@monohouse/classic
├── apps/
│   └── web/                     # 示例应用壳
├── packages/
│   ├── core/                    # 通用核心能力
│   ├── http/                    # HTTP 客户端封装
│   ├── ui/                      # 基础 UI 组件
│   ├── eslint-config/           # ESLint 共享配置
│   ├── typescript-config/       # TypeScript 共享配置
│   └── uno-config/              # UnoCSS 共享配置
├── ARCHITECTURE.md
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

适用于：

- `apps/* + packages/*` 的 monorepo 组织方式
- 应用内部采用 `api / components / hooks / router / stores / styles / utils / views` 这类传统按技术职责分层
- 希望先保持低理解成本和稳定开发习惯，再逐步演进的项目

启动：

```bash
cd @monohouse/classic
pnpm install
pnpm dev
```

详见 [ARCHITECTURE.md](./ARCHITECTURE.md)。
