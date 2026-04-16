# MonoHouse Modular

一个脱离具体业务的前端 monorepo 参考架构，基于 Vue 3 + Vite + TypeScript + pnpm workspace + Turborepo。

目标：

- 保留当前项目里已经被验证有效的 monorepo 编排方式
- 抛弃业务域代码，仅保留通用工程层、运行时层和 UI 分层骨架
- 提供一个可直接复制或继续演进的模板目录

## 目录

```text
@monohouse/modular
├── apps/
│   └── web/                     # 示例应用壳
├── packages/
│   ├── core/                    # 无 UI 依赖的通用核心能力
│   ├── http/                    # HTTP 客户端和请求约定
│   ├── ui/                      # 可复用基础组件
│   ├── eslint-config/           # Flat ESLint 配置
│   ├── typescript-config/       # 共享 TS 配置
│   └── uno-config/              # 共享 UnoCSS 预设
├── ARCHITECTURE.md
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## 启动

```bash
cd @monohouse/modular
pnpm install
pnpm dev
```

## 适用场景

- 需要在 monorepo 中同时维护多个前端应用
- 需要统一构建、规范、HTTP、设计令牌和基础组件
- 需要让业务代码建立在明确分层上，而不是继续堆在 `components` / `utils` / `views`
