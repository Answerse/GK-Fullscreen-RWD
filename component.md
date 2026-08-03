# 组件规范 (Component Specification)

> 本文档约束可复用组件的 HTML 骨架、CSS 类名契约、JS 行为接口和可扩展点。
> 与 [design.md](file:///Users/answerose/Documents/Projects/GK-Sub/design.md)（设计层：设计令牌与值）和 [figma-restoration.md](file:///Users/answerose/Documents/Projects/GK-Sub/.trae/rules/figma-restoration.md)（还原层）互补。

---

## 0. 使用原则：三层分离

组件样式分三层，**契约层不可改，视觉层通过变量调，主题层通过修饰类覆盖**。

| 层 | 内容 | 可改？ | 机制 |
|----|------|--------|------|
| **结构契约层** | HTML 骨架、类名、flex/grid 布局模式、JS 接口 | ❌ 禁止覆盖 | 本文档明确规定 |
| **视觉变量层** | 颜色、间距、字号、圆角、阴影 | ✅ 通过 CSS 变量调 | 组件内部全用 `var(--xxx)` |
| **主题修饰层** | 板块主题色、排列变体、紧凑模式 | ✅ 通过修饰类覆盖变量 | `data-theme` / `.component--variant` |

### 核心规则

**禁止行为**（会破坏基础组件样式）：

- ❌ 在使用处直接覆盖组件的布局属性：`.green-page .about-section { flex-direction: column }`
- ❌ 重复定义组件的布局规则：单独写 `.tech-about-section .about-content { display: flex; gap: 64px }`
- ❌ 用 `!important` 强制覆盖组件样式
- ❌ 在 HTML 行内写 `style` 属性覆盖组件视觉

**允许行为**（不影响基础样式）：

- ✅ 覆盖 CSS 变量值：`[data-theme="blue"] { --about-bg: var(--color-bg-light-blue); }`
- ✅ 添加修饰类扩展变体：`.about-section--reverse { --about-image-order: 1; }`
- ✅ 通过 `element.style.setProperty('--var', value)` 设置运行时动态值

### 变量命名约定

```
--{组件名}-{用途}
--about-bg            组件背景
--about-text-order    文字排列顺序
--card-radius         卡片圆角
--carousel-gap        轮播间距
```

所有变量必须在 design.md 的设计令牌中有对应定义，禁止硬编码字面量。

---

## 1. 通用容器组件

### 1.1 Section 区块骨架

首页每个全屏区块的统一骨架，所有业务 section（about/news/business/media 等）都基于此。

#### HTML 骨架（契约，禁止改动）

```html
<section id="{section-id}" class="section {module}-section" data-theme="{green|blue|gold}">
    <div class="section-inner">
        <div class="section-header">
            <div class="section-title-wrap">
                <img src="..." alt="" class="brand-icon">
                <h2 class="section-title">{标题}</h2>
            </div>
            <a href="{more-link}" class="more-link">
                <span>查看更多</span>
                <span class="arrow-circle">
                    <svg class="arrow-inline-svg"><use href="..."/></svg>
                </span>
            </a>
        </div>
        <div class="section-content-wrap">
            <!-- 业务内容 -->
        </div>
    </div>
</section>
```

#### 结构契约

| 元素 | 作用 | 布局规则（不可覆盖） |
|------|------|---------------------|
| `.section` | 全屏区块容器 | `width:100%; height:100vh; display:flex; padding-left:200px; scroll-snap-align:start` |
| `.section-inner` | 内容居中容器 | `max-width:1440px; margin:0 auto; flex:1; display:flex; flex-direction:column` |
| `.section-header` | 标题+更多 | `display:flex; justify-content:space-between; align-items:center` |
| `.section-content-wrap` | 业务内容区 | `flex:1; display:flex` |

#### CSS 变量（开放点）

```
--section-padding-left     左侧留白（默认 200px，侧栏折叠时 100px，顶栏模式 0）
--section-bg               区块背景色
```

#### 修饰类

- `.section.hero-section` — 首屏区块（不限制 height:100vh 的内容居中）
- `.section.banner-section` — Banner 区块
- `body.layout-topnav .section` — 顶栏模式（`--section-padding-left: 0`）

---

### 1.2 二级页 Banner 骨架

二级页面（article-*.html）的统一顶部结构。

#### HTML 骨架（契约）

```html
<aside class="sidebar-sub">...</aside>
<main class="article-main">
    <div class="article-banner">
        <div class="banner-bg">...</div>
        <div class="breadcrumb">
            <a href="index.html" class="breadcrumb-home">首页</a>
            <span class="breadcrumb-arrow">/</span>
            <span class="breadcrumb-item active">{当前页}</span>
        </div>
    </div>
    <section class="article-section">
        <!-- 文章/列表内容 -->
    </section>
</main>
```

#### 结构契约

| 元素 | 布局规则（不可覆盖） |
|------|---------------------|
| `.article-main` | `margin-left:200px; min-height:100vh; transition:margin-left 0.4s` |
| `.article-banner` | `position:fixed; top:0; width:100%; height:200px; z-index:900; padding-left:200px` |
| `.article-section` | `padding-top:200px`（为固定 banner 留位） |

#### 修饰类

- `.article-banner.sidebar-collapsed` — 侧栏折叠（`padding-left:100px`）
- `body.layout-topnav .article-banner` — 顶栏模式（`top:86px; padding-left:0`）
- `.page-article-list .article-main` — 列表页变体

#### 已复用状态

✅ 15 个二级页面已共用此结构，仅 `data-theme` 区分板块主题色。

---

## 2. 卡片组件

### 2.1 通用图文卡片 (`.news-card`)

项目最通用的卡片样式，已用于农业新闻、列表页文章，可作为其他图文卡片的基础。

#### HTML 骨架（契约）

```html
<a href="{link}" class="news-card">
    <div class="news-image">
        <img loading="lazy" src="{img}" alt="{alt}">
    </div>
    <div class="news-card-content">
        <div class="news-card-info">
            <span class="news-card-date">{date}</span>
            <h3 class="news-card-title">{标题}</h3>
            <p class="news-card-desc">{描述}</p>
        </div>
        <span class="news-card-more">了解更多</span>
    </div>
</a>
```

#### 结构契约

| 属性 | 值（不可覆盖） |
|------|---------------|
| `display` | `flex; flex-direction:column` |
| `background` | `var(--color-text-inverse)` |
| `border-radius` | `var(--card-radius, 6px)` |
| `overflow` | `hidden` |
| `transition` | `transform 0.3s, box-shadow 0.3s` |

#### CSS 变量（开放点）

```
--card-radius       圆角（默认 6px）
--card-hover-y      hover 上浮距离（默认 -4px）
--card-hover-shadow hover 阴影（默认 0 12px 24px rgba(0,0,0,0.1)）
```

#### 交互与动效

- **Hover**：`translateY(var(--card-hover-y))` + 阴影加深
- **入场**：`.section.in-view .news-card:nth-child(n)` 逐张 `translateY(60px)→0 + opacity:0→1`，延迟 0.4s/0.55s/0.7s

#### 可合并的同类卡片

以下卡片结构相似，建议未来统一为 `.news-card` + 修饰类：

| 现类名 | 差异 | 统一方案 |
|--------|------|----------|
| `.media-card` | 多日期组件 | `.news-card.media-card` + `.media-card-date` |
| `.finance-info-card` | 多"了解更多"箭头 | `.news-card.finance-info-card` |
| `.tech-achievement-card` | 多标签 | `.news-card.tech-card` |

---

### 2.2 业务卡片（三类，不抽象但规范各自契约）

三类业务卡片交互模式完全不同，**不强行抽象**，但各自契约需明确。

| 卡片 | 模块 | 交互模式 | 契约位置 |
|------|------|----------|----------|
| `.business-card` | 农业 business-section | 手风琴（active 切换展开） | style.css L3333+ |
| `.tech-business-card` | 科技 tech-business-section | 堆叠切换（active 置顶） | style.css L3622+ |
| `.finance-business-card` | 金融 finance-business-section | 弹性轮播（见 §3.1） | style.css L3957+ |

> 三者交互逻辑差异大，保留独立。新增业务卡片时参照其中一种模式，不要混用。

---

## 3. 轮播组件

### 3.1 卡片网格轮播（弹性宽度 · 多屏切换）

> ⚠️ 完整契约见 [design.md 3.8 节](file:///Users/answerose/Documents/Projects/GK-Sub/design.md)。此处仅列要点。

#### 适用模块

| 模块 | 页面 | 一屏卡数 | 屏数 |
|------|------|----------|------|
| `.finance-business-carousel` | finance.html | 4 | 2 |
| `.products-carousel` | agriculture.html | 4 | 2 |
| `.finance-info-carousel` | finance.html | 3 | 1（单屏隐藏导航） |

#### JS ↔ CSS 变量契约（核心，禁止断裂）

- JS 设置：`--card-width`（卡片宽度）、`--track-offset`（track 偏移）
- CSS 必须消费：`flex: 0 0 var(--card-width)` + `transform: translateX(var(--track-offset))`
- **禁止**：写死 `width` 字面量、`width: max-content`、`flex:1 + min-width:auto`

#### 单屏处理

`totalPages <= 1` 时加 `.single-page` class，CSS 隐藏导航按钮与指示器。

---

### 3.2 单图轮播

| 模块 | 用途 | 切换方式 |
|------|------|----------|
| `.hero-slider` | 首页首屏 | 渐隐 `opacity 0.8s` + 自动播放 |
| `.media-slider` | 媒体聚焦 | 滑动 `transform` + 导航按钮 |

> 此类轮播与卡片网格轮播结构不同（单图而非卡片网格），不共用契约。

---

## 4. 走进企业组件 (`.about-section`)

三板块（农业/科技/金融）布局相同，仅背景色、图文排列顺序不同。**当前写了三套 CSS，应统一为变量驱动。**

### 现状问题

```
.about-section         { background: white }                    // 农业
.tech-about-section    { background: light-blue; order 调整 }    // 科技
.finance-about-section { background: white; 背景图 }             // 金融
```

三套规则重复定义布局，且 `.tech-about-section .about-content` 重复了 `.about-content` 的布局规则。

### 规范方案：变量驱动

#### HTML 骨架（契约）

```html
<section class="section about-section" data-theme="{green|blue|gold}">
    <div class="section-inner">
        <div class="section-content-wrap">
            <div class="about-content">
                <div class="about-image">...</div>
                <div class="about-text">...</div>
            </div>
        </div>
    </div>
</section>
```

#### 基础布局（契约，不可覆盖）

```css
.about-content {
    display: flex;
    gap: var(--about-gap, 64px);
    align-items: stretch;
    flex: 1;
}
.about-image { order: var(--about-image-order, 1); }
.about-text  { order: var(--about-text-order, 2); }
```

#### CSS 变量（开放点）

```
--about-bg            背景色（默认 var(--color-bg-white)）
--about-gap           图文间距（默认 64px）
--about-image-order   图片排列顺序（默认 1）
--about-text-order    文字排列顺序（默认 2）
```

#### 主题修饰（仅覆盖变量，不覆盖布局）

```css
/* 科技版：浅蓝背景 + 图右文左 */
.about-section[data-theme="blue"] {
    --about-bg: var(--color-bg-light-blue);
    --about-image-order: 1;
    --about-text-order: 2;
}
/* 金融版：白背景 + 背景图 */
.about-section[data-theme="gold"] {
    --about-bg: var(--color-text-inverse);
}
```

#### 禁止行为

- ❌ `.tech-about-section .about-content { display:flex; gap:64px }` 重复布局
- ❌ `.finance-about-section { flex-direction: column }` 破坏布局
- ✅ `[data-theme="blue"] { --about-bg: var(--color-bg-light-blue) }` 仅改变量

---

## 5. 页脚组件

### 现状问题

两套类名结构相同：
- 首页：`.contact-copyright` > `.contact-copyright-text` + `.contact-icp-text`
- 二级页：`.footer-copyright` > `.footer-copyright-text` × 2

### 规范方案：统一类名

#### HTML 骨架（契约）

```html
<div class="footer-copyright">
    <span class="footer-copyright-text">Copyright © {year} {公司名} 版权所有</span>
    <span class="footer-icp-text">{工信部备案号} {公网安备号}</span>
</div>
```

#### 结构契约

| 属性 | 值 |
|------|-----|
| `.footer-copyright` | `display:flex; justify-content:space-between; align-items:center` |
| `.footer-copyright-text` / `.footer-icp-text` | 字号、颜色继承设计令牌 |

#### 主题修饰

```css
[data-theme="green"] .footer-copyright { --footer-color: var(--color-text-secondary); }
[data-theme="blue"]  .footer-copyright { --footer-color: var(--color-text-secondary); }
[data-theme="gold"]  .footer-copyright { --footer-color: var(--color-text-secondary); }
```

#### 迁移计划

- 首页 `.contact-copyright` → `.footer-copyright`
- `.contact-icp-text` → `.footer-icp-text`
- 统一后全项目一套页脚 CSS

---

## 6. 组件清单与优先级

| 优先级 | 组件 | 当前状态 | 规范动作 |
|--------|------|----------|----------|
| P0 | 卡片网格轮播 | ✅ 已规范 | design.md 3.8 + 本文档 §3.1 |
| P0 | Section 骨架 | ✅ 已复用 | 本文档 §1.1 |
| P0 | 二级页 Banner | ✅ 已复用 | 本文档 §1.2 |
| P0 | 通用图文卡片 | ✅ 已复用 | 本文档 §2.1 |
| P1 | 走进企业 | 🟡 三套CSS | 统一为变量驱动（§4） |
| P1 | 页脚 | 🟡 两套类名 | 统一类名（§5） |
| P2 | 媒体卡片 | 🟡 独立样式 | 合并到 `.news-card` 修饰类 |
| P2 | 信息公开/成果卡片 | 🟡 独立样式 | 合并到 `.news-card` 修饰类 |
| P3 | 业务卡片（三类） | 🔴 不抽象 | 各自契约已明确（§2.2） |

---

## 7. 新增组件流程

新增可复用组件时，按以下步骤：

1. **确认复用场景**：至少 2 个页面/板块使用相同结构
2. **定义 HTML 骨架**：明确哪些元素和类名是契约
3. **抽取 CSS 变量**：把视觉属性全部改为 `var(--{组件名}-{用途})`
4. **定义修饰类**：板块变体用 `data-theme` 或 `.component--variant`
5. **写入本文档**：在对应章节补充规范
6. **更新 design.md**：如涉及新的设计令牌，同步到 design.md

### 检查清单

- [ ] HTML 骨架是否唯一确定（无歧义）
- [ ] 视觉属性是否全部变量化（无硬编码）
- [ ] 是否列出禁止行为（防止破坏契约）
- [ ] 是否定义了主题修饰方式
- [ ] JS 行为契约是否明确（如有交互）
