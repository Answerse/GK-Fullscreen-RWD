# 广西糖业集团 - 国控站群企业网站设计规范

> 基于现有代码逆向提取的设计系统文档，确保后续开发一致性。

---

## 1. 设计令牌 (Design Tokens)

### 1.1 色彩系统

#### 全局色板

| 令牌 | 值 | 用途 |
|------|-----|------|
| `--color-text-primary` | `#101215` | 正文主色 |
| `--color-text-secondary` | `#6B7280` | 次要文字 |
| `--color-bg-white` | `#FFFFFF` | 页面背景 |
| `--color-bg-dark` | `#101215` | 深色背景 |
| `--color-border` | `rgba(16, 18, 21, 0.1)` | 分割线/边框 |

#### 三大板块主题色

| 板块 | CSS 类 | 主色 | 深色态 | 侧栏背景 | Active 态 |
|------|--------|------|--------|----------|-----------|
| **农业** | `theme-green` | `#166534` | `#004B1C` | `#166534` | `#004B1C` |
| **科技** | `theme-blue` | `#1E40AF` | `#0B2291` | `#1E40AF` | `#0B2291` |
| **金融** | `theme-gold` | `#C5A55A` / `#C5A171` | `#A8875C` | `#C5A171` | `#A8875C` |

#### 品牌辅助色

| 名称 | 值 | 用途 |
|------|-----|------|
| 品牌红 | `#B10001` | 底部品牌色条、首页hover |
| 品牌金 | `#C5A171` | 底部品牌色条 |
| 搜索按钮（通用） | `#A8875C` | 首页 `search-btn` |
| 联系方式强调色 | `var(--contact-accent-color)` | 各板块不同（绿/蓝/金） |

#### 功能区背景色

| 区块 | 值 |
|------|-----|
| 科技"走进企业" | `#F2F9FF` |
| 科技"主营业务" | `#F2F9FF` |
| 金融"新闻动态" | `linear-gradient(0deg, #FFFBF5 0%, #FFFFFF 68%)` |
| 金融"信息公开" | `#F2F9FF` |
| 产品展示 | `linear-gradient(180deg, #F2F9FF 0%, #E1E8F2 100%)` |
| 视频模块 | `radial-gradient(circle at 50% 100%, #F2F9FF 0%, #FFFFFF 100%)` |
| 科技媒体聚焦 | `linear-gradient(0deg, #E1E8F2 4%, #FFFFFF 50%)` |

---

### 1.2 字体系统

#### 中文字体栈

```css
font-family: 'Noto Sans SC', 'MiSans', -apple-system, BlinkMacSystemFont,
             'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
```

#### 英文字体栈

```css
--font-en: 'Altinn-DIN Condensed', sans-serif;
```

金融板块额外使用：

```css
font-family: 'Oswald', 'Arial Narrow', sans-serif;
```

#### 字重规范

| 令牌 | 值 |
|------|-----|
| Light / 正文 | 330 |
| Regular | 400 |
| Medium | 500 |
| Semibold / 标题 | 600 / 630 |
| Bold | 700 |

#### 字号层级

| 用途 | 尺寸 | 字重 |
|------|------|------|
| 首页主标题 | `clamp(60px, 5vw, 100px)` | 600 |
| 首页副标题 | `clamp(36px, 3vw, 60px)` | 300 |
| 科技主标题 | `clamp(60px, 5vw, 100px)` | 600 |
| 科技副标题 | `clamp(20px, 1.5vw, 32px)` | 330 |
| 金融主标题 | `clamp(72px, 6vw, 120px)` | 630 |
| 区块标题 `--section-title-font-size` | `40px` | 630 |
| 面包屑/导航标签 | `16px` | 330 / 630(active) |
| 文章卡片标题 | `20px` | 330 |
| 蓝色/金色列表标题 | `24px` | 630 |
| 卡片描述 | `14px` / `16px` | 330 |
| 了解更多链接 | `16px` | 330 |
| 底部版权 | `12px` | 330 |
| 日期-月 | `20px` | 400 |
| 日期-日 | `60px` | 700 |

#### 行高

| 用途 | 值 |
|------|-----|
| 标题 | `1.1` ~ `1.3` |
| 正文 | `1.5` ~ `1.8` |
| 日期数字 | `1` |

---

### 1.3 间距系统

#### 布局间距

| 令牌/用途 | 值 |
|-----------|-----|
| 侧栏宽度（展开） `--sidebar-width` | `200px` |
| 侧栏宽度（收缩） `--sidebar-width-collapsed` | `80px` |
| 首页 section `padding-left` | `200px` |
| Section `padding` | `60px 2% 8% 2%` |
| `section-inner max-width` | `1440px` |
| 区块标题 `margin-bottom` | `2%` |

#### 间隙（gap）规范

| 组件 | 值 |
|------|-----|
| 首页新闻卡片网格 | `40px` |
| 首页主营业务卡片 | `24px` |
| 媒体卡片列表 | `32px` |
| 蓝色主题列表项 | `64px` |
| 金色主题列表项 | `64px` |
| 走进企业about-content | `64px` |
| 统计项 | `40px` |
| 产品展示轮播 | `40px` |
| 科技/成果展示 | `40px` |
| 分页器页码 | `30px` |
| Footer栏目 | `50px` |
| Footer链接项 | `40px` |

#### 内边距规范

| 组件 | 值 |
|------|-----|
| 新闻卡片 `news-body` | `32px`（变体: `24px 32px`）|
| 蓝色列表项 `padding` | `24px 0` + `8px 左右` |
| 金色列表项 `padding` | `24px 0` + `8px 左右` |
| 首页导航项 | `24px 20px` |
| 二级页导航项 | `16px 48px` |
| 产品卡片 `product-info` | `32px` |
| 金融业务卡片 | `64px 40px` |

---

### 1.4 圆角规范

| 令牌/用途 | 值 |
|-----------|-----|
| 通用圆角 | `4px` |
| 卡片（news-card） | `6px` |
| 技术业务卡片 | `8px` |
| 搜索按钮（首页） | `0` |
| 页面切换按钮 | `80px`（全圆角）|
| 按钮（btn） | `9999px`（全圆角）|
| 产品导航按钮 | `999px` |
| 图片轮播导航按钮 | `50%` |
| 指示器（圆点） | `16px` (实) / `99px` (条) |

---

### 1.5 阴影规范

| 用途 | 值 |
|------|-----|
| 卡片 hover | `0 12px 24px rgba(0, 0, 0, 0.1)` |
| 卡片 hover（强） | `0 20px 40px rgba(0, 0, 0, 0.1)` |
| 列表项 hover | `0 8px 16px rgba(主色, 0.08)` |
| 导航按钮 | `0 4px 20px rgba(0, 0, 0, 0.08)` |
| 导航按钮 hover | `0 6px 30px rgba(0, 0, 0, 0.12)` |
| 视频播放器 | `0 20px 60px 0 rgba(0, 0, 0, 0.2)` |
| 文章卡片 | `0 2px 8px rgba(0, 0, 0, 0.04)` |

---

## 2. 布局系统

### 2.1 页面架构

```
┌─────────────────────────────────────┐
│  Sidebar (fixed left, z-index:1000) │
│  width: 200px / collapsed: 80px    │
├─────────────────────────────────────┤
│  Search Button (fixed top-right)    │
├─────────────────────────────────────┤
│  Main Content (padding-left: 200px) │
│  scroll-snap-type: y mandatory      │
│  ├─ Section (100vh snap)           │
│  ├─ Section (100vh snap)           │
│  └─ Section (100vh snap)           │
├─────────────────────────────────────┤
│  Page Switch (fixed bottom-right)   │
│  Brand Bar (fixed bottom, 16px)     │
└─────────────────────────────────────┘
```

### 2.2 二级页面架构

```
┌─────────────────────────────────────┐
│  Sidebar-sub (fixed left)           │
│  width: 200px / collapsed: 100px   │
├─────────────────────────────────────┤
│  Article Banner (fixed, h: 200px)   │
│  ├─ Banner bg image                │
│  └─ Banner content (breadcrumb +   │
│       nav-tabs)                    │
├─────────────────────────────────────┤
│  Article Section (padding-top: 220) │
│  ├─ News Recommend (optional)      │
│  ├─ Article List / News Cards      │
│  └─ Pagination                     │
├─────────────────────────────────────┤
│  Footer                            │
│  ├─ Footer Columns                 │
│  ├─ Friend Links                   │
│  └─ Copyright                      │
└─────────────────────────────────────┘
```

### 2.3 滚动行为

- 首页：`scroll-snap-type: y mandatory`，每 `section` 一屏
- 二级页：自由滚动，无 snap
- 滚动条：全局隐藏（`-webkit-scrollbar: none`）

### 2.4 响应式断点

| 断点 | 目标设备 | 关键变化 |
|------|----------|----------|
| `≥1440px` | 桌面 | 完整布局 |
| `≤1199px` | 平板 | 侧栏收缩为60px，调整容器 max-width，卡布局简化 |
| `≤767px` | 大手机 | 侧栏隐藏，移动菜单出现，单列布局 |
| `≤375px` | 小手机 | 字号微调，间距缩小 |

---

## 3. 组件规范

### 3.1 侧栏导航 (Sidebar)

#### 首页侧栏 `sidebar-home`

| 状态 | 宽度 | 导航样式 |
|------|------|----------|
| 展开 | `200px` | 文字导航 + hover红色/active金色 |
| 收缩 | `80px` | 圆点导航 + 迷你logo |

- 扩张/收缩动效：`0.4s cubic-bezier(0.4, 0, 0.2, 1)`
- 主题：`theme-light`（深色背景）和 `theme-dark`（白色背景）
- Logo：展开 120px 满版 / 收缩 80×140px 迷你版

#### 二级页侧栏 `sidebar-sub`

| 主题 | 背景色 | Active 态 |
|------|--------|-----------|
| green | `#166534` | `#004B1C` |
| blue | `#1E40AF` | `#0B2291` |
| gold | `#C5A171` | `#A8875C` |

- 二级页收缩态宽度仍保持文字可见（`100px` / `120px`(gold)）
- 导航项：`padding: 16px 48px`，字号 `16px`

### 3.2 搜索按钮 `search-btn`

- 固定位置：`top:0; right:0`
- 尺寸：`64×64px`
- 颜色跟随主题：`#166534` / `#1E40AF` / `#C5A171`
- hover 变深色

### 3.3 页面切换按钮 `page-switch-wrapper`

- 固定 `bottom:20px; right:20px`
- 初始状态：60px 圆形按钮
- 展开状态：`rgba(16,18,21,0.9)` 背景 + 三个板块切换链接
- 展开动效：`0.4s ease-in`

### 3.4 面包屑 (Breadcrumb)

```html
<div class="breadcrumb">
  <svg class="breadcrumb-home">...</svg>
  <nav class="breadcrumb-nav">
    <a class="breadcrumb-item">首页</a>
    <svg class="breadcrumb-arrow">...</svg>
    <span class="breadcrumb-item active">当前页面</span>
  </nav>
</div>
```

- 当前页使用 630 字重

### 3.5 导航标签 (Nav Tabs)

- 标签项 `padding: 16px 32px`
- Active 态：`border-bottom: 3px solid`（主题色）
- Hover 态：文字变主题色 + `background: rgba(主题色, 0.05)`
- 不活跃标签 `font-weight: 330`，活跃 `font-weight: 630`

### 3.6 日期展示 `date-display`

- 两行结构：上为月份（20px/400），下为日期数字（60px/700）
- 宽度 `96px`
- 字体：`Altinn-DIN Condensed`
- 主题色变体：`.theme-blue`（日=#1E40AF）/ `.theme-gold`（日=#C5A55A）

### 3.7 卡片 (Cards)

#### 农业新闻卡片 `news-card`

- 3列网格 `grid-template-columns: repeat(3, 1fr)`
- 圆角 `6px`，白色背景
- hover: `translateY(-4px)` + `box-shadow`
- 图片 + body（`padding: 32px`，gap: `32px`）
- 了解更多：`gap:16px`，hover 增加至 `20px`，箭头右移

#### 蓝色列表 `news-item-blue`

- 横向布局，`gap: 64px`
- 左侧文字 + 右侧图片（`320×213px`）
- 日期：`date-display theme-blue`
- hover: `translateY(-2px)` + 主题色阴影

#### 金色列表 `news-item-gold`

- 横向布局，`gap: 64px`
- 左侧内容 + 右侧日期
- hover: `translateY(-2px)` + 金色阴影
- 图片/无图两种模式

#### 文章卡片 `article-card`

- 横向：图片 `460×308px` + 文字 body
- hover: `translateY(-8px)` + 强阴影

### 3.8 轮播/滑块

#### 首屏轮播 (Hero)

- 渐隐切换：`opacity 0.8s ease`
- 自动播放 + 手动导航
- 导航点 `dot`：`84×4px`，白色进度条
- 导航按钮：48px 圆形，`border: 2px solid rgba(255,255,255,0.5)`

#### 媒体聚焦轮播

- 导航按钮 `85×85px`，`background: rgba(16,18,21,0.2)`
- hover 变 `rgba(16,18,21,0.4)`
- 指示器圆点：`16×16px`
- 底部标题覆盖：`linear-gradient(to top, rgba(16,18,21,0.65), transparent)`

#### 卡片网格轮播组件（弹性宽度 · 多屏切换）

> ⚠️ **强制契约**：此类轮播的卡片宽度由 JS 按父级容器宽度弹性计算，CSS **必须**通过 CSS 变量消费，**禁止**写死 `width` / `flex-basis` 字面量。违反此契约会导致卡片不等宽、轮播失效、多屏切换错位。

**适用模块清单**

| 模块 | 页面 | 卡片数 | 一屏卡数 | 屏数 | 间隔 | 自动切换 |
|------|------|--------|----------|------|------|----------|
| 金融主营业务 `finance-business-carousel` | finance.html | 8 | 4（桌面）/2（平板）/1（手机） | 2 | 5s | 是 |
| 产品展示 `products-carousel` | agriculture.html | 8 | 4/2/1 | 2 | 4s | 是 |
| 信息公开 `finance-info-carousel` | finance.html | 3 | 3/2/1 | 1（单屏隐藏导航） | - | 单屏否 |

**HTML 结构契约**（四层嵌套，类名严格对应）

```
.{module}-carousel
  ├── button.{module}-nav.{module}-nav-prev
  ├── .{module}-slider            (overflow: hidden 裁剪视窗)
  │     └── .{module}-track       (flex 容器，承载卡片，transform 切换)
  │           └── .{module}-card × N
  └── button.{module}-nav.{module}-nav-next
.{module}-indicators              (与 carousel 同级或内部，JS 动态生成指示点)
```

**JS ↔ CSS 变量契约**（核心，禁止断裂）

JS `updatePosition()` 计算（[main.js](file:///Users/answerose/Documents/Projects/GK-Sub/js/main.js)）：

```js
const cardWidth = (sliderWidth - gap * (cardsPerPage - 1)) / cardsPerPage;
const offset = -currentPage * (cardWidth + gap) * cardsPerPage;
track.style.setProperty('--card-width', cardWidth + 'px');     // 卡片宽度
track.style.setProperty('--track-offset', offset + 'px');      // track 偏移
```

CSS 必须消费这两个变量（缺一不可）：

```css
.{module}-track {
    display: flex;
    gap: 40px;
    transition: transform 0.6s ease;
    transform: translateX(var(--track-offset, 0px));   /* 消费偏移 */
}
.{module}-card {
    flex: 0 0 var(--card-width, auto);                 /* 消费宽度 */
    width: var(--card-width, auto);
    min-width: 0;                                      /* 防 flex 项被内容撑开 */
}
```

**禁止行为**（曾导致样式反复"丢失"）

- ❌ `.xxx-card` 写死 `width: 330px` / `flex: 0 0 360px` —— 覆盖了 JS 弹性计算
- ❌ `.xxx-track` 写死 `width: max-content` —— 破坏 transform 偏移计算
- ❌ `.xxx-card` 用 `flex: 1` + `min-width: auto` —— 被内容（图片 aspect-ratio）撑开，宽度不等
- ❌ JS 设置了 `--card-width` 但 CSS 不消费 —— 变量无效，退化成固定宽度

**单屏处理**（信息公开模式）

当 `totalPages <= 1` 时，JS 给 carousel 加 `.single-page` class，CSS 隐藏导航按钮与指示器：

```css
.{module}-carousel.single-page .{module}-nav,
.{module}-carousel.single-page ~ .{module}-indicators { display: none; }
```

未来补卡后 `totalPages > 1`，导航与指示器自动显示，无需改代码。

**响应式 cardsPerPage**

```js
getCardsPerPage() {
    if (w <= 767) return 1;      // 手机
    if (w <= 1199) return 2;     // 平板
    return 4;                    // 桌面（信息公开为 3）
}
```

#### 金融主营业务轮播

- 导航按钮与产品展示相同样式
- 卡片 `padding: 64px 40px`，`gap: 48px`
- 背景半透明 `rgba(16,18,21,0.4)`，金色/红色变体
- hover: `translateY(-12px)` + 强阴影 + 图标缩放

#### 产品展示轮播

- 导航按钮 `80×80px`，白色背景
- 卡片 hover 图片缩放 `1.05`

#### 信息公开轮播

- 复用弹性轮播契约，`cardsPerPage=3`，单屏不切换
- 当前 3 张卡，`.single-page` 隐藏导航按钮与指示器
- 为将来补卡预留多屏轮播能力（补卡后自动激活切换）

### 3.9 按钮 (Buttons)

| 类型 | 类名 | 样式 |
|------|------|------|
| 通用按钮 | `.btn` | `padding: 14px 40px`，圆角 `9999px` |
| 描边 | `.btn-outline` | 透明背景 + 1px 边框 |
| 实心 | `.btn-primary` | 主题色填充 |
| 了解更多 | `.more-link` | 箭头图标 + 文字，hover 箭头右移 |

走进企业区域按钮：`padding: 16px 64px`，字号 `20px`

### 3.10 分页器 (Pagination)

- 居中布局，`gap: 30px`
- 页码按钮：`padding: 24px`，`border: 1px solid rgba(16,18,21,0.1)`
- Active 页码：主题色背景 + 白色文字
- 翻页按钮：`40×40px`，hover 背景变灰

### 3.11 视频播放器

- 播放器容器：`padding: 16px` 黑色边框，圆角 `16px`
- 播放区域：`960×524px`，圆角 `8px`
- 控制条：半透明背景 `rgba(16,18,21,0.2)`
- 播放按钮：`100×100px`，圆角 `8px`

### 3.12 页脚 (Footer)

- 背景色 `#f2f4f5`
- 三栏布局：左侧联系方式 + 右侧三个链接栏
- Logo：`217×50px`
- 链接栏：垂直排列，`gap: 16px`
- 分隔线：1px `rgba(16,18,21,0.1)`
- 友情链接 + 版权信息

---

## 4. 动效规范

### 4.1 入场动效 (Scroll-triggered)

统一通过 `.section.in-view` 控制：

| 区块 | 隐藏态 | 动效时间 | 缓动 |
|------|--------|----------|------|
| 容器 `.section-inner` | `translateY(50px) + opacity:0` | `1s` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` |
| 区块标题 | `translateY(30px) + opacity:0` | `0.8s` | 同上 |
| 新闻卡片 | `translateX(80px) + opacity:0` | `0.6s` | 同上 |
| 主营业务卡片 | `translateY(50px) scale(0.88) + opacity:0` | `0.5s` | 同上 |
| 媒体卡片 | `translateY(-60px) + opacity:0` | `0.6s` | 同上 |
| 联系我们 | `scale(0.6) + opacity:0` | `0.6s` | `cubic-bezier(0.42, 0, 1, 1)` |
| 媒体轮播 | `translateX(-60px) + opacity:0` | `0.6s` | 同上 |

### 4.2 入场延迟

多元素逐张入场延迟规则（以新闻卡片为例）：

```css
/* 农业新闻3列 */
:nth-child(1) { transition-delay: 0.4s; }
:nth-child(2) { transition-delay: 0.55s; }
:nth-child(3) { transition-delay: 0.7s; }

/* 金融信息公开3列 */
:nth-child(1) { transition-delay: 0s; }
:nth-child(2) { transition-delay: 0.15s; }
:nth-child(3) { transition-delay: 0.3s; }

/* 科技成果展示4列 */
:nth-child(1) { transition-delay: 0s; }
:nth-child(2) { transition-delay: 0.15s; }
:nth-child(3) { transition-delay: 0.3s; }
:nth-child(4) { transition-delay: 0.45s; }
```

### 4.3 交互动效

| 元素 | 触发 | 动效 |
|------|------|------|
| 卡片 | hover | `translateY(-4px~-12px)` + `box-shadow` 增强，`0.3s ease` |
| 了解更多箭头 | hover | `gap: 16px→20px` + 箭头 `translateX(6px) scale(1.1)` |
| 产品图片 | hover | `transform: scale(1.05)`，`0.5s ease` |
| 主营业务卡片(手风琴) | hover/active | 弹性宽度变化 `0.5s cubic-bezier(0.4, 0, 0.2, 1)` |
| 首页导航 | hover | 背景色变红 |
| 搜索按钮 | hover | 背景色变深 |
| 侧栏 | 收缩/展开 | 宽度变化 `0.4s cubic-bezier(0.4, 0, 0.2, 1)` |
| section | 切换 | `padding-left` 同步侧栏宽度变化 |

---

## 5. CSS 文件职责

| 文件 | 职责 |
|------|------|
| `style.css` | 所有视觉样式（颜色/字体/间距/布局/组件） |
| `animations.css` | 仅管理入场/出场动效（初始隐藏态 + `transition`） |
| `responsive.css` | 所有响应式适配（覆盖式） |
| `svg-icons.css` | SVG 图标尺寸/颜色 |

### 编写规则

1. **视觉值归 style.css**：`animations.css` 不设置任何 `color`/`background`/`font-size` 等视觉属性
2. **动效只开不关**：`.in-view` 只设置 `transition`，不设置目标值（目标值在 style.css）
3. **组件隔离**：每个组件有独立的 CSS 注释块和命名空间
4. **主题覆盖**：主题色差异通过 `.theme-green/blue/gold` 或 `[data-page-theme]` 属性选择器控制

---

## 6. 文件结构和命名规范

### HTML 文件清单

| 类型 | 命名模式 | 示例 |
|------|----------|------|
| 首页 | `{板块}.html` | `agriculture.html` |
| 企业简介 | `about-enterprise{-主题}.html` | `about-enterprise-blue.html` |
| 新闻列表 | `article-list{-主题}.html` | `article-list-gold.html` |
| 文章详情 | `article-{主题}-{类型}.html` | `article-tech-business.html` |
| 功能页 | `{功能}.html` | `search.html` |

### CSS 命名规范

- 使用语义化 class 名
- 区块层级：`{section-name}-section` → `section-inner` → `section-header` / `section-content-wrap`
- 主题变体：`.theme-green` / `.theme-blue` / `.theme-gold`
- 状态类：`.active` / `.in-view` / `.collapsed` / `.expanded` / `.expanded`
- 子元素级联：`section-name` 下的子元素用 `{section-name}-{element}`（如 `news-card`、`news-title`）

---

## 7. 开发注意事项

1. **Figma 还原约束**：布局尺寸、间距、颜色必须与 Figma 设计稿 1:1 还原，禁止近似取值
2. **图片资源**：所有图片放在 `/public/images/`，使用相对路径，禁止占位图
3. **SVG 规则**：SVG 作为 `<img>` 引用，禁止内嵌 `<style>` 或 style 属性
4. **主题一致性**：新增页面必须同步所有三个主题变体
5. **侧栏联动**：侧栏收缩态会影响所有 section 的 `padding-left`，需保持一致
6. **Z-index 层级**：sidebar=1000, search-btn=1001, page-switch=1001, banner=900
