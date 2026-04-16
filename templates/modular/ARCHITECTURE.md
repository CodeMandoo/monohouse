# MonoHouse Modular Architecture

## 1. 设计原则

- 工作区只沉淀稳定能力：构建配置、HTTP、基础 UI、通用工具、跨应用契约
- 应用层只负责路由、页面组合、运行时装配和业务模块注册
- 业务模块按 `pages -> widgets -> features -> entities -> shared` 单向依赖
- `packages/*` 不直接依赖任何 app
- `packages/core` 不依赖浏览器框架，优先保持纯 TypeScript
- `packages/ui` 只放低耦合基础组件，不放具体业务组件

## 2. 推荐目录

```text
apps/web/src
├── app/                         # 应用启动、provider、样式、路由装配
├── pages/                       # 路由页，负责组装 widgets/features
├── widgets/                     # 页面级复合组件
├── features/                    # 用户动作与用例
├── entities/                    # 业务实体模型
└── shared/                      # 应用内共享资源
    ├── api/                     # 基础请求方法与 client 适配
    ├── config/                  # env、常量、运行时配置
    ├── lib/                     # 通用工具、hooks、底层封装
    ├── model/                   # 通用 store、会话态、跨页面状态
    ├── types/                   # 全局类型、DTO、接口约定
    └── ui/                      # app 内共享基础组件
```

### 2.1 应用完整体目录

推荐把 app 内代码组织成下面这套“完全体”，但不是要求每层都必须一次性建满。

```text
apps/web/src
├── app/                         # 应用启动层，只放装配和运行时入口
│   ├── providers/               # 全局 provider 装配，如 Pinia、i18n、Theme
│   ├── router/                  # 根路由、守卫、布局入口
│   ├── styles/                  # 全局样式、reset、设计令牌入口
│   ├── config/                  # app 级运行时配置
│   ├── store/                   # 全局 store 装配，不放具体业务实体
│   ├── entrypoints/             # 多入口应用时使用
│   ├── create-app.ts            # createApp、插件注册
│   └── App.vue                  # 根组件
├── pages/                       # 路由页面层，负责页面最终组装
│   └── <page-slice>/            # 单个页面切片，如 home、dashboard、profile
│       ├── ui/                  # 页面组件和页面布局
│       ├── model/               # 页面级状态、hooks、状态机
│       ├── lib/                 # 仅页面内部使用的工具函数
│       ├── api/                 # 页面专属请求适配
│       ├── config/              # 页面专属配置、静态映射
│       └── index.ts             # 对外导出，作为该页面切片统一出口
├── widgets/                     # 页面级复合区域，通常具备布局语义
│   └── <widget-slice>/          # 单个 widget 切片，如 header-panel、report-board
│       ├── ui/                  # widget 视觉结构和复合展示
│       ├── model/               # widget 内部状态与交互
│       ├── lib/                 # widget 私有工具
│       ├── config/              # widget 配置、默认项
│       └── index.ts             # 对外导出，隐藏内部实现
├── features/                    # 用户动作与用例层
│   └── <feature-slice>/         # 单个 feature 切片，如 login、upload-avatar
│       ├── ui/                  # feature 的按钮、表单、弹窗等交互组件
│       ├── model/               # feature 状态、表单状态、action hooks
│       ├── api/                 # feature 请求与 DTO 转换
│       ├── lib/                 # feature 私有工具
│       ├── config/              # feature 常量、开关配置
│       └── index.ts             # 对外导出，供 pages/widgets 组合
├── entities/                    # 业务实体层，表达对象本身及其最小复用能力
│   └── <entity-slice>/          # 单个实体切片，如 user、resume、job
│       ├── ui/                  # 实体展示组件，如卡片、标签、头像
│       ├── model/               # 实体级 store、selectors、hooks
│       ├── api/                 # 实体基础请求，不放完整业务流程
│       ├── lib/                 # 实体格式化器、映射器
│       ├── types/               # 实体类型定义
│       └── index.ts             # 对外导出，聚合实体能力
└── shared/                      # app 内最低层共享资源
    ├── api/                     # 基础请求方法、client 适配
    ├── config/                  # env、常量、运行时配置
    ├── lib/                     # 纯工具函数、通用 hooks、底层封装
    ├── model/                   # 通用 store、全局会话态
    ├── types/                   # 全局类型、公共接口约定
    ├── ui/                      # app 内共享基础组件
    ├── assets/                  # 图标、图片、字体、静态资源
    ├── routes/                  # route name/path 常量
    └── mocks/                   # mock 数据、handler、假接口
```

### 2.2 各层职责

#### `app/`

只放应用启动和运行时装配，不放业务用例。

- 适合放：路由创建、全局 provider、主题注入、i18n、埋点注册、鉴权守卫
- 不适合放：某个页面的请求、某个业务组件、某个实体 store

#### `pages/`

`pages` 是路由页面层，职责是把多个下层切片组装成最终页面。

- 一个 page slice 对应一个路由页面或一个稳定的页面变体
- `pages` 可以调度 `widgets`、`features`、`entities`
- `pages` 不应该沉淀跨页面复用逻辑

#### `widgets/`

`widgets` 是页面里的大块复合区域，通常有明显布局语义，但不一定是一个独立业务动作。

- 例子：顶部导航区、筛选面板、报表看板、资料侧栏
- 一个 widget 往往会组合多个 `features` 或 `entities`
- 如果组件只在一个页面里用一次，优先留在该 page slice 内，不一定非要升级成 widget

#### `features/`

`features` 表示用户可感知的动作或用例，而不是纯展示块。

- 例子：登录、上传头像、切换语言、提交表单、删除记录、筛选列表
- feature 可以有自己的 `ui`、`model`、`api`
- 如果一段逻辑对应的是“用户做了一件事”，通常应该先考虑放在 `features`

#### `entities/`

`entities` 表示业务对象及其最小可复用能力。

- 例子：`user`、`resume`、`job`、`order`
- 通常包含类型、实体级 store、格式化器、实体展示组件
- entity 不负责完整业务流程，只负责“这个对象是什么、怎么展示、怎么读取它的核心状态”

#### `shared/`

`shared` 是 app 内最低层通用资源。

- 适合放：日期格式化、环境变量、通用 hooks、基础弹窗、全局类型、路由常量
- 不适合放：带具体业务含义的 API、强语义的业务组件、页面私有逻辑

### 2.3 为什么 `pages/home/ui` 而不是直接 `pages/HomePage.vue`

因为 `pages/home` 代表的是一个页面切片，不只是一个 Vue 文件。

页面一开始可能只有一个组件：

```text
pages/
└── home/                        # home 页面切片
    └── ui/                      # home 页面表现层
        └── HomePage.vue         # 页面主组件
```

但页面复杂后，很容易继续长出：

```text
pages/
└── home/                        # home 页面切片
    ├── ui/                      # 页面组件和布局
    ├── model/                   # 页面状态和组合逻辑
    ├── api/                     # 页面专属请求
    ├── lib/                     # 页面私有工具
    └── index.ts                 # 页面统一出口
```

这样做的价值是：

- 页面代码天然聚合，不会散落到全局 `components`、`hooks`、`stores`
- 页面扩张时不需要再二次搬家
- 目录本身表达“边界”，看到 `pages/home/*` 就知道这都是 home 页面私有资源

`ui/` 的含义很简单，就是这个切片里的表现层。

同理：

- `model/` 是状态和交互逻辑
- `api/` 是这个切片专属的数据访问
- `lib/` 是仅服务于该切片的工具
- `config/` 是切片私有配置

### 2.4 什么时候需要建 `ui/model/lib/api/config`

不是所有切片都要建满。推荐按复杂度渐进拆分。

#### 最小形态

适合很简单的页面或功能。

```text
features/search/
└── ui/                          # 只有展示与交互组件时，最小只建 ui
    └── SearchButton.vue         # 搜索按钮组件
```

#### 标准形态

适合有状态、有请求、需要对外导出的常规切片。

```text
features/search/
├── ui/                          # 搜索相关组件
├── model/                       # 搜索状态、hooks、表单逻辑
├── api/                         # 搜索请求、参数适配
└── index.ts                     # 搜索 feature 的统一出口
```

#### 完整体

适合复杂、长期维护、多人协作的稳定模块。

```text
features/search/
├── ui/                          # 搜索组件和交互界面
├── model/                       # 搜索状态、行为逻辑
├── api/                         # 搜索接口和数据转换
├── lib/                         # 搜索私有工具
├── config/                      # 搜索默认项、静态配置
└── index.ts                     # 对外导出
```

判断规则：

- 只有组件，没有状态，没有独立逻辑时，只建 `ui/`
- 有 store、hooks、状态机、表单状态时，加 `model/`
- 有独立请求适配、DTO 转换、接口聚合时，加 `api/`
- 有只服务当前切片的格式化器、映射器、helper 时，加 `lib/`
- 有静态配置、枚举映射、开关项时，加 `config/`

### 2.5 推荐的 slice 内文件组织

一个成熟切片建议有统一出口，不鼓励外部直接深层引用内部文件。

```text
entities/user/
├── ui/                          # 用户实体展示组件
│   ├── UserAvatar.vue           # 用户头像
│   └── UserCard.vue             # 用户信息卡片
├── model/                       # 用户实体状态和 hooks
│   ├── user.store.ts            # 用户实体 store
│   └── use-user.ts              # 用户实体组合式逻辑
├── api/                         # 用户实体基础请求
│   └── user.api.ts              # 用户实体接口
├── lib/                         # 用户实体工具
│   └── format-user-name.ts      # 用户名格式化
├── types/                       # 用户实体类型
│   └── user.ts                  # User 类型定义
└── index.ts                     # 用户实体统一出口
```

`index.ts` 负责聚合对外暴露的 API：

- 暴露允许复用的组件、hooks、types、store
- 隐藏内部实现细节
- 降低后续重构时的影响面

### 2.6 不要过度设计

这个“完全体”是上限，不是最低要求。

落地时遵守三条就够了：

- 先按 slice 收拢代码，再决定要不要拆 `ui/model/api`
- 一个目录里的内容开始混杂两种职责时再拆
- 能留在页面私有目录里的，不要过早提到 `widgets` 或 `shared`

反例：

- 只有一个 `Button.vue`，却硬拆出 `ui/model/api/config`
- 只在一个页面用一次的块，强行提到 `widgets`
- 带明显业务语义的组件塞进 `shared/ui`

## 3. 包职责

### `packages/http`

- axios 实例工厂
- 统一请求配置
- 鉴权、错误处理、日志等通过 app 注入

### `packages/core`

- 平台无关工具函数
- 环境变量读取器
- 通用类型和 schema

### `packages/ui`

- Button、Card、EmptyState 之类的基础表现层组件
- 只接收 props / slots，不处理业务数据来源

### `packages/eslint-config` / `packages/typescript-config` / `packages/uno-config`

- 作为工作区级工程规范单一事实来源

## 4. 依赖规则

- `pages` 可以依赖 `widgets`、`features`、`entities`、`shared`
- `widgets` 可以依赖 `features`、`entities`、`shared`
- `features` 可以依赖 `entities`、`shared`
- `entities` 只能依赖 `shared`
- `shared` 不能依赖上层任何业务层

## 5. 扩展建议

- 如果后续出现多个 app 都要复用一组业务实体，再新增 `packages/domain-*`
- 如果 `packages/ui` 开始出现强业务语义，立刻拆回 app 内的 `widgets` 或 `features`
- 如果需要 SSR、权限、国际化、埋点，可新增 `packages/runtime-*`，不要污染 `core`

## 6. 适用场景

本架构面向通用前端应用场景设计，但其适用范围具有明确边界。

适用范围主要体现在以下方面：

- 适用于大多数中大型业务前端应用
- 适用于需要长期维护和持续演进的 monorepo 项目
- 适用于页面、功能与实体边界逐步清晰的业务系统

不建议作为默认方案直接应用于以下场景：

- 不适用于所有前端项目的一体化套用
- 不适用于页面数量较少、复杂度较低、交付周期较短的项目

### 6.1 适合的应用类型

- 中后台系统、工作台、运营平台、管理后台
- 多页面、多角色、多模块的业务系统
- 有明显业务实体和用户动作的应用
- 在单一仓库内维护多个前端应用的 monorepo 项目
- 需要共享工程规范、HTTP 能力、基础 UI、配置能力的项目
- 需要多人并行协作、希望目录边界稳定的团队项目

### 6.2 典型适用信号

当项目具备以下特征时，可优先考虑采用本架构：

- `components`、`hooks`、`stores`、`api` 已经开始变成大杂烩
- 页面数量和业务模块持续增长
- 跨页面复用越来越多
- 多名开发者需要并行维护不同业务模块
- 需要通过目录结构明确表达业务边界与依赖方向
- 已采用 monorepo，或计划将多个应用统一纳入同一仓库

### 6.3 不适合的场景

- 官网、活动页、宣传页、营销落地页
- 页面数量很少的小型 CRUD 项目
- 一次性交付、生命周期很短的项目
- 仅由单人维护，且业务复杂度预期长期保持较低的项目
- 业务边界仍处于强探索阶段、命名与模型频繁调整的项目
- 团队尚未形成基础目录约束，直接引入完整分层会显著增加理解和维护成本

### 6.4 采用建议

采用本架构时，不建议默认一次性引入“完全体”，应根据项目复杂度逐步演进：

#### 轻量模式

适用于中小型项目或新业务起步阶段。

- 优先建立 `app / pages / features / entities / shared`
- `widgets` 可根据实际复杂度暂缓引入
- slice 内可先保留 `ui/`，复杂度上升后再补充 `model/`、`api/`

#### 标准模式

适用于大多数中型业务应用。

- 使用 `pages / widgets / features / entities / shared` 完整分层
- 仅为复杂切片补充 `model / api / lib / config`
- 通过 `index.ts` 统一收敛切片对外出口

#### 完整体模式

适用于长期演进、多人协作、模块复杂的大型应用。

- app 与 slice 均采用完整目录结构
- 将共享能力持续沉淀到 `packages/*`
- 按需进一步拆分 `packages/domain-*`、`packages/runtime-*`
- 配合 lint 规则或 code review 机制约束依赖方向

### 6.5 一句话判断

如果项目已经出现“业务持续扩张、目录逐渐失控、复用成本升高、协作冲突增加”等问题，本架构通常具备较高适用性。

如果项目规模较小，目标仅为快速完成少量页面开发，则本架构通常偏重。
