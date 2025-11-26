# 🏥 Health Tracker 健康追蹤

A privacy-first health tracking web application for monitoring ailments and their triggers.

一個以私隱為先嘅健康追蹤網頁應用程式，用嚟記錄身體不適同埋可能嘅誘因。

**🚀 Status: Fully Functional | 狀態：已可使用**

---

## ✨ Features 功能特色

### Core Features 核心功能

| English | 繁體中文 |
|---------|----------|
| 📅 **Day View** - Quick daily health logging | 📅 **日誌檢視** - 快速記錄每日健康狀況 |
| 🤕 **Ailment Tracking** - Log headaches, stomach pain, fatigue, etc. | 🤕 **不適追蹤** - 記錄頭痛、肚痛、疲倦等症狀 |
| 🩸 **Period Tracking** - Log menstrual cycle with flow and symptoms | 🩸 **經期追蹤** - 記錄經期流量同症狀 |
| 🎯 **Trigger Identification** - Track potential causes | 🎯 **誘因識別** - 追蹤可能嘅成因 |
| 📊 **Statistics & Insights** - Visualize patterns with advanced analytics | 📊 **統計分析** - 視覺化健康模式同深入分析 |
| 📈 **Period Correlation** - Discover how symptoms relate to menstrual cycle | 📈 **經期關聯** - 發現症狀同經期嘅關係 |
| 🗓️ **Calendar Heatmap** - Visual overview with period indicators | 🗓️ **日曆熱圖** - 視覺化概覽連埋經期標示 |
| 🔍 **Smart Filtering** - Filter all stats by specific ailment | 🔍 **智能篩選** - 按特定症狀篩選所有統計 |
| ➕ **Custom Types** - Add, edit, and delete custom ailments/triggers | ➕ **自訂類型** - 新增、編輯、刪除自訂症狀同誘因 |
| 🔄 **Smart Sorting** - Most used items appear first | 🔄 **智能排序** - 常用項目排喺最前 |
| ⚙️ **Customization** - Full control over your tracking options | ⚙️ **自訂設定** - 完全掌控你嘅追蹤選項 |
| 🔒 **Privacy First** - All data stored locally | 🔒 **私隱優先** - 所有資料只儲存喺你部機 |
| 📱 **Mobile Optimized** - Works perfectly on all devices | 📱 **流動優化** - 所有裝置完美運行 |

### Default Ailment Types 預設不適類型

- 🤕 Headache/Migraine 頭痛/偏頭痛
- 🤢 Stomach Pain 肚痛
- 😴 Fatigue 疲倦
- 🤧 Allergies 敏感

### Default Triggers 預設誘因

- ☕ Caffeine 咖啡因
- 🍔 Food 食物
- 😴 Poor Sleep 瞓得唔好
- 😰 Stress 壓力
- 🌤️ Weather 天氣
- 💊 Medication 藥物
- 🍷 Alcohol 酒精
- 🥛 Dairy 奶製品
- 🌾 Gluten 麩質
- 🌶️ Spicy Food 辣嘢

---

## 🎨 Design Philosophy 設計理念

### Hong Kong Inspired 香港風格

This app draws inspiration from Hong Kong's unique visual culture:

呢個應用程式嘅設計靈感來自香港獨特嘅視覺文化：

- **Neon Sign Aesthetics** 霓虹燈美學 - Subtle glow effects inspired by iconic HK neon signs
- **Traditional Patterns** 傳統圖案 - Chinese lattice and geometric patterns
- **Bilingual Interface** 雙語介面 - Full English and Traditional Chinese (Cantonese) support
- **Calming Color Palette** 舒緩色調 - Soft jade green, muted coral, warm cream

### Color Palette 色彩配搭

| Color | Hex | Usage 用途 |
|-------|-----|------------|
| Jade Green 翡翠綠 | `#7BA888` | Primary actions, headers |
| Soft Coral 淡珊瑚 | `#E8A87C` | Secondary actions, accents |
| Warm Gold 暖金 | `#D4AF37` | Highlights, decorations |
| Cream 米白 | `#FDF8F3` | Backgrounds |
| Charcoal 炭灰 | `#2D3436` | Text |

---

## 🛠️ Tech Stack 技術架構

| Technology | Purpose 用途 |
|------------|--------------|
| **Svelte 5** | Frontend framework with runes |
| **SvelteKit** | App framework and routing |
| **Tailwind CSS v4** | Utility-first styling |
| **bits-ui** | UI component primitives |
| **svelte-sonner** | Toast notifications |
| **Dexie.js** | IndexedDB wrapper for local storage |
| **Lucide Icons** | Icon library |
| **Iconify** | Extended icon support (emoji) |
| **TypeScript** | Type safety |
| **bun** | Package manager & runtime |
| **CapacitorJS** | Mobile app deployment (ready) |

---

## 🚀 Getting Started 開始使用

### Prerequisites 先決條件

- Node.js 20+ or bun
- Modern web browser

### Installation 安裝

```bash
# Clone the repository 複製儲存庫
git clone <repository-url>
cd health-tracker

# Install dependencies 安裝依賴
bun install

# Start development server 啟動開發伺服器
bun run dev
```

The app will be available at `http://localhost:5173`

### Building for Production 建置生產版本

```bash
bun run build
bun run preview
```

### Deploying to GitHub Pages 部署到 GitHub Pages

The app can be deployed to GitHub Pages with automatic CI/CD:

```bash
# Push to main branch will trigger automatic deployment
git push origin main
```

See [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions.

查閱 [部署指南](docs/DEPLOYMENT.md) 了解詳細步驟。

### Building for Android 建置 Android 版本

```bash
# Install Capacitor 安裝 Capacitor
bun add -d @capacitor/cli @capacitor/core @capacitor/android

# Initialize and add Android 初始化並新增 Android
bun run cap:init
bun run cap:android

# Build and sync 建置並同步
bun run mobile:build

# Open in Android Studio 喺 Android Studio 開啟
bun run cap:open
```

---

## 📁 Project Structure 專案結構

```
src/
├── lib/
│   ├── components/
│   │   ├── stats/        # Stats page components (10)
│   │   ├── today/        # Today page components (2)
│   │   ├── settings/     # Settings page components (6)
│   │   └── ...           # Shared components
│   ├── db/               # Dexie database
│   ├── i18n/             # Translations (EN, 繁體)
│   ├── stores/           # Svelte stores
│   ├── types/            # TypeScript types
│   └── utils/
│       ├── cn.ts         # Class name utility
│       ├── date.ts       # Date formatting
│       └── uuid.ts       # UUID generation (mobile-safe)
├── routes/
│   ├── +page.svelte      # Day view (main)
│   ├── stats/            # Statistics & analytics
│   └── settings/         # Settings & customization
└── app.css               # Global styles
```

---

## 🔒 Privacy 私隱聲明

**Your health data stays on your device.**

**你嘅健康資料只會儲存喺你自己部機。**

- ✅ All data stored locally using IndexedDB
- ✅ No server-side storage
- ✅ No analytics or tracking
- ✅ No account required
- ✅ Export your data anytime (JSON)
- ✅ Delete all data with one tap

---

## 🌐 Language Support 語言支援

The app supports:
- 🇬🇧 English
- 🇭🇰 繁體中文（廣東話）

The Chinese interface uses Traditional Chinese characters with Cantonese expressions commonly used in Hong Kong, rather than Mandarin/Simplified Chinese.

介面使用繁體中文同埋香港人慣用嘅廣東話表達方式，而唔係普通話或者簡體字。

---

## 📚 Documentation 文件

- [Features Guide](docs/FEATURES.md) - Complete feature documentation **NEW**
- [Deployment Guide](docs/DEPLOYMENT.md) - GitHub Pages deployment **NEW**
- [PWA Guide](docs/PWA_GUIDE.md) - Progressive Web App features
- [Design System](docs/DESIGN.md) - Colors, typography, components
- [Technical Architecture](docs/TECHNICAL.md) - Data models, database schema
- [Cantonese Guide](docs/CANTONESE.md) - Language guidelines
- [Project Status](docs/PROJECT_STATUS.md) - Progress tracking

---

## 📄 License 授權

MIT License

---

## 🙏 Acknowledgments 鳴謝

- Design inspired by Hong Kong's vibrant visual culture
- Built with love for the Cantonese-speaking community
- 設計靈感來自香港充滿活力嘅視覺文化
- 為廣東話社群用心製作
