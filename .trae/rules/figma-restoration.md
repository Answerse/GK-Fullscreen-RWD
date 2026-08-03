# Figma MCP 设计稿还原规范（强制执行）

## 1. 布局还原
- Figma Auto Layout 必须 1:1 映射为 CSS Flexbox
- itemSpacing → gap
- padding 四边严格对应
- absoluteBoundingBox.width/height 必须原样使用
- minWidth / maxWidth / minHeight / maxHeight 必须显式声明
- 禁止擅自改为 auto / 100% / fit-content
- Figma 未显式设置 min/max 时，禁止自行推断

## 2. 图片资源
- 所有 imageRef 必须下载至 /assets/images/
- 仅允许使用相对路径
- 禁止引用 figma.com / localhost
- 图片加载失败必须停止并报错，禁止生成占位图

## 3. SVG（Figma 导出）
- SVG 为 Figma 导出文件，当图片处理
- 下载至 /assets/icons/ 或 /assets/images/
- 使用 <img src="" />
- 禁止在 SVG 内嵌 <style> 或 style 属性
- SVG 展示尺寸必须与 Figma 中一致

## 4. 响应式
- Desktop First，优先 100% 还原桌面端
- 小屏仅允许调整布局（flex-wrap / column / 间距缩小）
- 禁止修改字号 / 颜色 / 圆角 / 阴影
- 统一断点：
  - ≥1440px 桌面
  - ≤1024px 平板
  - ≤768px 大手机
  - ≤375px 小手机

## 5. 文件结构 & 样式分离（强制执行）
- HTML / CSS / JS 严格分离
- 动效样式独立为 *.animation.css
- SVG 样式独立管理
- **HTML 中绝对禁止出现：**
  - `style` 属性（行内样式）
  - `<style>` 标签（内联样式块）
  - `@keyframes` / `transition` 声明
  - 任何 `background-image: url(...)`、`background:` 等视觉属性
  - 任何 `width="xxx"`、`height="xxx"` 硬编码尺寸
  - **内联 SVG（`<svg>...</svg>` 直接写在 HTML 中）**
  - 所有视觉表现必须通过 CSS class 控制
- **JS 中禁止直接操作 .style.\* 设置样式值**
  - 正确做法：通过 `classList.add/remove/toggle` 切换 CSS class
  - 唯一例外：CSS 自定义属性 `element.style.setProperty('--var', value)` 用于运行时动态值（如轮播进度条时间、卡片宽度）
  - 动态动画数值（如数字滚动）也优先用 CSS 变量

## 10. SVG 资源管理（强制执行）
- **严禁内联 SVG**：HTML 中禁止直接写 `<svg>...</svg>`，所有 SVG 必须外部引用
- **外部引用方式**：
  - 优先使用 `<img src="path/to/icon.svg" alt="">`
  - 或使用 `<svg><use href="path/to/sprite.svg#icon-id"/></svg>`
- **图标复用原则**：
  - 新增图标前，必须先检索本地 `/public/images/icons/` 目录
  - 若本地已有相同或相似图标，必须复用现有资源，禁止重复添加
  - 相同图标的判定标准：视觉效果一致、语义相同
- **SVG 文件规范**：
  - 文件名使用 kebab-case 命名法（如 `icon-arrow-right.svg`）
  - SVG 内部 `id` 属性必须与文件名保持一致（如 `icon-arrow-right`）
  - 禁止在 SVG 内嵌 `<style>` 标签或 `style` 属性
  - 需要动态变色的 SVG，使用 `stroke="currentColor"` 或 `fill="currentColor"`，通过 CSS `color` 属性控制
- **资源检查流程**：
  1. 需要使用图标时，先在 `/public/images/icons/` 中搜索
  2. 未找到匹配图标时，再添加新的 SVG 文件
  3. 添加后立即更新所有引用，确保无重复资源

## 6. Figma Variables
- 颜色 / spacing / 字号 / 行高 / 字重 / 圆角 / 阴影必须来自 Figma Variables
- CSS 变量名与 Figma Variable 名称保持一致
- 禁止手写 hex / px 字面量

## 7. 字体（Typography Variable）
- font-family / font-size / line-height / letter-spacing / font-weight
  必须来自 Figma Typography Variable
- 禁止近似取值
- 禁止自行选择相似字体

## 8. 交互状态
- Hover → :hover
- Pressed → :active
- Disabled → :disabled / [disabled]
- 状态样式放入 *.animation.css
- Figma 中的多状态变体必须逐一还原

## 9. Clip Content
- Figma 中开启 Clip Content 的 Frame
- 必须对应 overflow: hidden