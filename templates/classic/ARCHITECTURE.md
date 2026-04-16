# MonoHouse Classic Architecture

## 1. 架构定义

`classic` 指 `Monorepo + 传统前端分层` 架构。

仓库层采用 monorepo 组织：

- `apps/*` 放具体应用
- `packages/*` 放共享能力与工程配置

应用层采用传统前端分层：

- `api/`
- `components/`
- `hooks/`
- `router/`
- `stores/`
- `styles/`
- `types/`
- `utils/`
- `views/` 或 `pages/`

## 2. 推荐目录

```text
classic/
├── apps/
│   ├── web/                     # Web 应用
│   └── mobile/                  # Mobile/H5 应用
├── packages/
│   ├── http/                    # HTTP 封装
│   ├── shared/                  # 共享 types、utils、hooks、constants
│   ├── ui/                      # 基础 UI 组件
│   ├── eslint-config/           # ESLint 共享配置
│   ├── typescript-config/       # TypeScript 共享配置
│   └── uno-config/              # UnoCSS 共享配置
└── apps/web/src/
    ├── api/                     # 接口请求与接口定义
    ├── assets/                  # 图片、图标、字体等静态资源
    ├── components/              # 通用组件与业务组件
    ├── hooks/                   # 组合式函数
    ├── layouts/                 # 页面布局
    ├── router/                  # 路由配置
    ├── stores/                  # 状态管理
    ├── styles/                  # 全局样式与主题样式
    ├── types/                   # 应用内类型定义
    ├── utils/                   # 工具函数
    └── views/                   # 页面视图
```

### 2.1 应用完整体目录

传统前端分层的“完整体”通常以技术职责为主组织目录，而不是按业务切片组织。

```text
apps/web/src
├── api/                         # 接口请求、接口定义、请求封装
│   ├── modules/                 # 按业务模块拆分接口文件
│   ├── clients/                 # axios/fetch 实例与 client 封装
│   ├── interceptors/            # 请求与响应拦截器
│   ├── adapters/                # DTO 转换、响应适配
│   └── index.ts                 # API 统一出口
├── assets/                      # 静态资源
│   ├── images/                  # 图片资源
│   ├── icons/                   # 图标资源
│   ├── fonts/                   # 字体资源
│   └── svg/                     # SVG 资源
├── components/                  # 组件层
│   ├── common/                  # 通用基础组件
│   ├── business/                # 业务复合组件
│   ├── forms/                   # 表单组件
│   ├── tables/                  # 表格组件
│   └── charts/                  # 图表组件
├── hooks/                       # 通用 hooks 与组合式逻辑
│   ├── common/                  # 通用 hooks
│   ├── business/                # 业务 hooks
│   └── index.ts                 # hooks 统一出口
├── layouts/                     # 页面布局
│   ├── default/                 # 默认布局
│   ├── blank/                   # 空白布局
│   └── components/              # 布局内部组件
├── router/                      # 路由层
│   ├── modules/                 # 分模块路由
│   ├── guards/                  # 路由守卫
│   ├── constants/               # 路由常量
│   └── index.ts                 # 路由入口
├── stores/                      # 状态管理
│   ├── modules/                 # 按模块拆分 store
│   ├── plugins/                 # store 插件
│   └── index.ts                 # store 入口
├── styles/                      # 样式层
│   ├── base/                    # reset、基础样式
│   ├── themes/                  # 主题样式
│   ├── variables/               # CSS 变量、设计令牌
│   └── index.scss               # 样式总入口
├── types/                       # 应用内类型定义
│   ├── api/                     # 接口相关类型
│   ├── business/                # 业务类型
│   └── global.d.ts              # 全局声明
├── utils/                       # 工具函数
│   ├── common/                  # 通用工具
│   ├── browser/                 # 浏览器相关工具
│   ├── format/                  # 格式化工具
│   └── validate/                # 校验工具
├── views/                       # 页面视图
│   ├── home/                    # 首页
│   ├── dashboard/               # 工作台/看板页
│   ├── system/                  # 系统管理页面
│   └── profile/                 # 个人中心页面
├── constants/                   # 全局常量
├── config/                      # 应用配置
├── directives/                  # 自定义指令
├── plugins/                     # 第三方插件注册
├── mocks/                       # mock 数据与 mock handler
├── App.vue                      # 根组件
└── main.ts                      # 应用入口
```

### 2.2 目录说明

- `api` 负责所有数据请求相关代码，通常按业务模块拆分文件
- `components` 负责沉淀通用组件和业务组件，是传统分层中最容易膨胀的目录
- `hooks` 负责复用组合逻辑，通常按通用能力和业务能力区分
- `layouts` 负责页面外层骨架，如顶部导航、侧边栏、空白页布局
- `router` 负责路由注册、守卫、路由元信息与常量
- `stores` 负责状态管理，通常按业务模块划分 store
- `styles` 负责全局样式、主题、变量和样式入口
- `types` 负责应用内类型定义，避免类型散落到业务文件内部
- `utils` 负责工具方法和底层辅助函数
- `views` 负责页面级视图，是传统架构中的页面主目录

### 2.3 目录组织建议

- `components / hooks / stores / api` 建议优先按模块或职责拆分，避免持续堆积
- `views` 可按一级路由或业务域拆目录
- `api` 与 `types` 最好建立对应关系，减少接口类型分散
- `utils` 只放真正可复用的工具，不要混入页面私有逻辑
- 当 `components` 或 `stores` 出现明显跨团队维护冲突时，应考虑向更明确的业务切片架构演进
## 3. 适用场景

- 适用于大多数中小型到中型业务前端项目
- 适用于已有传统目录习惯、希望保持较低迁移成本的团队
- 适用于 monorepo 已建立，但应用内部暂不需要细粒度业务切片分层的项目
- 适用于以交付效率和团队熟悉度为优先的阶段性方案

## 4. 特点

- 上手成本低，团队普遍易于理解
- 目录结构直观，适合快速启动项目
- 共享能力可以通过 `packages/*` 持续沉淀
- 随着业务增长，`components / hooks / stores / api` 容易逐渐膨胀

## 5. 适合与不适合

适合：

- 项目复杂度中等
- 页面数量有限或增长可控
- 团队当前更重视稳定推进，而不是强业务边界约束

不适合：

- 模块边界复杂、多人高并发协作的大型业务系统
- 需要通过目录严格表达领域边界和依赖方向的项目
- 已出现明显的目录混杂和模块失控问题的应用
