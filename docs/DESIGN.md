# 🎨 Design System 設計系統

## Overview 概覽

This document outlines the design system for Health Tracker, including visual guidelines, component specifications, and Hong Kong-inspired styling.

呢份文件概述咗「健康追蹤」嘅設計系統，包括視覺指引、元件規格同埋香港風格嘅設計。

---

## 🎯 Design Principles 設計原則

### 1. Calming & Approachable 舒緩親切
- Soft, muted colors that don't overwhelm 柔和唔刺眼嘅色彩
- Generous whitespace 充足嘅留白空間
- Rounded corners for a friendly feel 圓角設計令人感覺親切

### 2. Hong Kong Heritage 香港特色
- Neon sign-inspired subtle glow effects 霓虹燈風格嘅微光效果
- Traditional Chinese geometric patterns 傳統中式幾何圖案
- Bilingual typography hierarchy 雙語排版層次

### 3. Mobile-First 流動裝置優先
- Touch-friendly tap targets (min 44px) 適合觸控嘅按鈕大小
- Bottom navigation for thumb reach 底部導覽方便拇指操作
- Swipe gestures where appropriate 適當位置支援滑動手勢

### 4. Accessibility 無障礙設計
- High contrast text 高對比度文字
- Clear visual hierarchy 清晰嘅視覺層次
- Screen reader friendly 支援螢幕閱讀器

---

## 🎨 Color Palette 色彩配搭

### Primary Colors 主要色彩

```css
:root {
  /* Jade Green - Primary 翡翠綠 - 主色 */
  --jade-50: #f0f7f2;
  --jade-100: #d9ebe0;
  --jade-200: #b3d7c1;
  --jade-300: #8dc3a2;
  --jade-400: #7ba888;  /* Primary */
  --jade-500: #5a8a6a;
  --jade-600: #476e54;
  --jade-700: #385544;
  --jade-800: #2a3f33;
  --jade-900: #1c2a22;

  /* Coral - Secondary 珊瑚 - 副色 */
  --coral-50: #fdf5f0;
  --coral-100: #fae8dc;
  --coral-200: #f5d1b9;
  --coral-300: #e8a87c;  /* Secondary */
  --coral-400: #db8a5c;
  --coral-500: #c4714a;
  --coral-600: #a55a3b;
  --coral-700: #86472f;
  --coral-800: #673624;
  --coral-900: #48261a;

  /* Gold - Accent 金色 - 點綴 */
  --gold-50: #fdfaed;
  --gold-100: #f9f0c8;
  --gold-200: #f0dc8a;
  --gold-300: #e6c84d;
  --gold-400: #d4af37;  /* Accent */
  --gold-500: #b8952e;
  --gold-600: #967725;
  --gold-700: #745a1d;
  --gold-800: #524015;
  --gold-900: #30260d;
}
```

### Neutral Colors 中性色彩

```css
:root {
  /* Cream Background 米白背景 */
  --cream-50: #fffefb;
  --cream-100: #fdf8f3;  /* Main background */
  --cream-200: #f7efe5;
  --cream-300: #f0e4d7;

  /* Charcoal Text 炭灰文字 */
  --charcoal-50: #f5f5f5;
  --charcoal-100: #e0e0e0;
  --charcoal-200: #b0b0b0;
  --charcoal-300: #808080;
  --charcoal-400: #606060;
  --charcoal-500: #404040;
  --charcoal-600: #2d3436;  /* Main text */
  --charcoal-700: #1a1a1a;
}
```

### Semantic Colors 語義色彩

```css
:root {
  /* Severity Levels 嚴重程度 */
  --severity-mild: #7ba888;     /* Jade - Good/Mild */
  --severity-moderate: #e8a87c; /* Coral - Moderate */
  --severity-severe: #c44536;   /* Red - Severe */

  /* Status 狀態 */
  --status-success: #7ba888;
  --status-warning: #e8a87c;
  --status-error: #c44536;
  --status-info: #5a9bc9;
}
```

---

## 📝 Typography 字體排版

### Font Stack 字體組合

```css
:root {
  /* Primary Font - Clean Sans Serif */
  --font-primary: 'Noto Sans HK', 'Noto Sans', system-ui, -apple-system, sans-serif;

  /* Display Font - For Headers (Optional) */
  --font-display: 'Noto Sans HK', var(--font-primary);
}
```

### Type Scale 字體大小

| Name | Size | Weight | Usage 用途 |
|------|------|--------|------------|
| `text-xs` | 12px | 400 | Labels, captions 標籤、說明 |
| `text-sm` | 14px | 400 | Secondary text 次要文字 |
| `text-base` | 16px | 400 | Body text 內文 |
| `text-lg` | 18px | 500 | Emphasized text 強調文字 |
| `text-xl` | 20px | 600 | Card titles 卡片標題 |
| `text-2xl` | 24px | 700 | Section headers 區段標題 |
| `text-3xl` | 30px | 700 | Page titles 頁面標題 |

### Bilingual Typography 雙語排版

For bilingual text, display English first, then Chinese below:

```html
<h1 class="text-2xl font-bold">Health Tracker</h1>
<p class="text-sm text-charcoal-400">健康追蹤</p>
```

---

## 🧱 Components 元件

### Cards 卡片

```
╭─────────────────────────────────╮
│  Card Header                    │
│  卡片標題                        │
├─────────────────────────────────┤
│                                 │
│  Card content goes here         │
│  卡片內容                        │
│                                 │
╰─────────────────────────────────╯
```

**Specifications:**
- Border radius: `rounded-xl` (12px)
- Background: `bg-cream-100` or `bg-white`
- Border: `border border-jade-200`
- Shadow: `shadow-sm`
- Padding: `p-4` (16px)

### Buttons 按鈕

#### Primary Button 主要按鈕
```
╭─────────────────╮
│   Save Entry    │
│     儲存記錄     │
╰─────────────────╯
```
- Background: `bg-jade-400`
- Hover: `hover:bg-jade-500`
- Text: `text-white`
- Border radius: `rounded-lg`

#### Secondary Button 次要按鈕
```
┌─────────────────┐
│     Cancel      │
│      取消       │
└─────────────────┘
```
- Background: `bg-transparent`
- Border: `border-2 border-coral-300`
- Text: `text-coral-400`

#### Icon Button 圖示按鈕
```
┌───┐
│ + │
└───┘
```
- Size: `w-10 h-10` (40px)
- Border radius: `rounded-full`

### Input Fields 輸入欄位

```
┌─────────────────────────────────┐
│  🕐  Select time...             │
└─────────────────────────────────┘
```
- Border: `border border-charcoal-200`
- Focus: `focus:border-jade-400 focus:ring-2 focus:ring-jade-200`
- Border radius: `rounded-lg`
- Padding: `px-4 py-3`

### Trigger Chips 誘因標籤

```
┌───────────┐   ┌───────────┐
│  ☕ [✓]   │   │  🍔 [ ]   │
│ Caffeine  │   │   Food    │
│  咖啡因   │   │   食物    │
└───────────┘   └───────────┘
```

**Unselected:**
- Background: `bg-cream-200`
- Border: `border border-charcoal-200`

**Selected:**
- Background: `bg-jade-100`
- Border: `border-2 border-jade-400`
- Checkmark: `text-jade-600`

### Severity Slider 嚴重程度滑桿

```
○───────●───────○───────○
Mild   Moderate Severe  Very
輕微    中等     嚴重    非常嚴重
```

- Track: `bg-charcoal-200`
- Fill: Gradient from `jade-400` to `coral-400` to `red-500`
- Thumb: `bg-white border-2 border-jade-400`

### Navigation Bar 導覽列

```
┌─────────────────────────────────┐
│     📅       📊       ⚙️        │
│    Today    Stats   Settings   │
│    今日     統計      設定      │
└─────────────────────────────────┘
```

- Position: Fixed bottom
- Background: `bg-white`
- Border top: `border-t border-charcoal-100`
- Active item: `text-jade-400`
- Inactive item: `text-charcoal-400`

---

## ✨ Hong Kong Styling Elements 香港風格元素

### Neon Glow Effect 霓虹光效

For headers and important elements:

```css
.neon-glow {
  text-shadow:
    0 0 5px rgba(123, 168, 136, 0.5),
    0 0 10px rgba(123, 168, 136, 0.3),
    0 0 20px rgba(123, 168, 136, 0.2);
}

.neon-border {
  box-shadow:
    0 0 5px rgba(123, 168, 136, 0.3),
    inset 0 0 5px rgba(123, 168, 136, 0.1);
}
```

### Chinese Lattice Pattern 中式格仔圖案

Subtle background pattern for cards or sections:

```css
.lattice-pattern {
  background-image:
    linear-gradient(135deg, rgba(123, 168, 136, 0.05) 25%, transparent 25%),
    linear-gradient(225deg, rgba(123, 168, 136, 0.05) 25%, transparent 25%),
    linear-gradient(45deg, rgba(123, 168, 136, 0.05) 25%, transparent 25%),
    linear-gradient(315deg, rgba(123, 168, 136, 0.05) 25%, transparent 25%);
  background-size: 20px 20px;
}
```

### Decorative Dividers 裝飾分隔線

```
══════════ ◈ ══════════
```

```css
.divider-ornament::before,
.divider-ornament::after {
  content: '';
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold-400), transparent);
}
```

---

## 📐 Spacing 間距

Based on 4px grid:

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight spacing |
| `space-2` | 8px | Default gap |
| `space-3` | 12px | Card padding (mobile) |
| `space-4` | 16px | Card padding |
| `space-5` | 20px | Section spacing |
| `space-6` | 24px | Large gaps |
| `space-8` | 32px | Section margins |

---

## 📱 Responsive Breakpoints 響應式斷點

| Name | Width | Target |
|------|-------|--------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop |

**Mobile-first approach:** Design for 375px width first, then expand.

---

## 🌓 Dark Mode (Future) 深色模式（未來）

Reserved for future implementation:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --cream-100: #1a1a1a;
    --charcoal-600: #f0f0f0;
    /* ... */
  }
}
```

---

## 📦 Icon Usage 圖示使用

### Primary: Lucide Icons

```svelte
<script>
  import { Heart, Calendar, Settings } from 'lucide-svelte';
</script>

<Heart class="w-6 h-6 text-coral-400" />
```

### Extended: Iconify

```svelte
<script>
  import Icon from '@iconify/svelte';
</script>

<Icon icon="noto:face-with-head-bandage" class="w-8 h-8" />
```

### Recommended Icons 建議圖示

| Purpose | Lucide | Iconify (Emoji) |
|---------|--------|-----------------|
| Headache | `Frown` | `noto:face-with-head-bandage` 🤕 |
| Stomach | `Frown` | `noto:nauseated-face` 🤢 |
| Fatigue | `Moon` | `noto:sleeping-face` 😴 |
| Caffeine | `Coffee` | `noto:hot-beverage` ☕ |
| Food | `Utensils` | `noto:hamburger` 🍔 |
| Stress | `AlertTriangle` | `noto:anxious-face-with-sweat` 😰 |
| Weather | `Cloud` | `noto:sun-behind-cloud` 🌤️ |
| Settings | `Settings` | - |
| Calendar | `Calendar` | - |
| Stats | `BarChart3` | - |

---

## 🖼️ Screen Mockups Reference 頁面模擬參考

See ASCII mockups in the main README for visual reference of:
1. Day View 日誌檢視
2. Log Ailment Modal 記錄不適彈出視窗
3. Statistics View 統計分析頁面
4. Settings 設定頁面

