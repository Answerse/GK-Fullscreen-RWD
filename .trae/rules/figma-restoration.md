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

## 5. 文件结构 & 样式分离
- HTML / CSS 严格分离
- 动效样式独立为 *.animation.css
- SVG 样式独立管理
- HTML 中禁止出现 style 属性 / 内联 <style> / @keyframes / transition

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