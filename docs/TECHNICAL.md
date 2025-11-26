# 🛠️ Technical Architecture 技術架構

## Overview 概覽

This document details the technical architecture, data models, and implementation guidelines for the Health Tracker application.

呢份文件詳細描述「健康追蹤」應用程式嘅技術架構、資料模型同埋實作指引。

---

## 🏗️ Architecture Overview 架構概覽

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│                      展示層                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Svelte 5  │  │   Tailwind  │  │   shadcn-   │     │
│  │  Components │  │     CSS     │  │   svelte    │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
├─────────────────────────────────────────────────────────┤
│                     State Layer                          │
│                      狀態層                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │           Svelte 5 Runes ($state, $derived)     │   │
│  └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│                     Data Layer                           │
│                      資料層                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │                   Dexie.js                       │   │
│  │              (IndexedDB Wrapper)                 │   │
│  └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│                   Platform Layer                         │
│                     平台層                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │    Web      │  │  Android    │  │    iOS      │     │
│  │   Browser   │  │ (Capacitor) │  │ (Capacitor) │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Technology Stack 技術棧

### Frontend Framework 前端框架

| Technology | Version | Purpose |
|------------|---------|---------|
| **Svelte 5** | ^5.44.0 | UI framework with runes |
| **SvelteKit** | ^2.49.0 | App framework, routing |
| **TypeScript** | ^5.9.0 | Type safety |

### Styling 樣式

| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | ^4.1.0 | Utility-first CSS (v4) |
| **bits-ui** | ^2.14.0 | UI component primitives |
| **svelte-sonner** | ^1.0.6 | Toast notifications |
| **tailwind-merge** | ^3.4.0 | Class merging utility |
| **clsx** | ^2.1.0 | Conditional classes |

### Data & Storage 資料同儲存

| Technology | Version | Purpose |
|------------|---------|---------|
| **Dexie.js** | ^4.2.0 | IndexedDB wrapper |

### Icons 圖示

| Technology | Version | Purpose |
|------------|---------|---------|
| **lucide-svelte** | ^0.555.0 | Primary icon library |
| **@iconify/svelte** | ^5.1.0 | Extended icons (emoji) |

### Mobile 流動裝置

| Technology | Version | Purpose |
|------------|---------|---------|
| **@capacitor/core** | ^5.0.0 | Native runtime (to install) |
| **@capacitor/android** | ^5.0.0 | Android platform (to install) |
| **@capacitor/ios** | ^5.0.0 | iOS platform (future) |

---

## 💾 Data Models 資料模型

### Database Schema 資料庫結構

```typescript
// src/lib/types/index.ts

/**
 * Ailment types that can be tracked
 * 可追蹤嘅不適類型
 */
export interface AilmentType {
  id: string;           // UUID
  name: string;         // English name
  nameZh: string;       // Chinese name 中文名
  icon: string;         // Iconify icon name
  isDefault: boolean;   // System default or user-created
  isActive: boolean;    // Whether to show in quick select
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Trigger types that may cause ailments
 * 可能引發不適嘅誘因類型
 */
export interface TriggerType {
  id: string;           // UUID
  name: string;         // English name
  nameZh: string;       // Chinese name 中文名
  icon: string;         // Iconify icon name
  category: TriggerCategory;
  isDefault: boolean;   // System default or user-created
  isActive: boolean;    // Whether to show in trigger selection
  createdAt: Date;
  updatedAt: Date;
}

export type TriggerCategory =
  | 'food'       // 食物
  | 'lifestyle'  // 生活習慣
  | 'environment'// 環境
  | 'substance'  // 物質
  | 'other';     // 其他

/**
 * Severity levels for ailments
 * 不適嘅嚴重程度
 */
export type Severity = 1 | 2 | 3 | 4 | 5;
// 1 = Mild 輕微
// 2 = Mild-Moderate 輕微至中等
// 3 = Moderate 中等
// 4 = Moderate-Severe 中等至嚴重
// 5 = Severe 嚴重

/**
 * A logged health entry
 * 健康記錄條目
 */
export interface HealthEntry {
  id: string;           // UUID
  date: string;         // ISO date string (YYYY-MM-DD)
  time: string;         // ISO time string (HH:mm)
  ailmentTypeId: string;// Reference to AilmentType
  severity: Severity;
  triggerIds: string[]; // References to TriggerTypes
  notes: string;        // Optional notes 備註
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Daily mood/wellness check-in
 * 每日心情/健康狀況記錄
 */
export interface DailyCheckIn {
  id: string;           // UUID
  date: string;         // ISO date string (YYYY-MM-DD) - unique per day
  mood: MoodLevel;      // Overall mood
  notes: string;        // Optional notes
  createdAt: Date;
  updatedAt: Date;
}

export type MoodLevel = 'good' | 'okay' | 'bad';

/**
 * App settings
 * 應用程式設定
 */
export interface AppSettings {
  id: string;           // Always 'settings' (singleton)
  language: 'en' | 'zh-HK';
  theme: 'light' | 'dark' | 'system';
  defaultView: 'day' | 'week';
  reminderEnabled: boolean;
  reminderTime: string; // HH:mm format
}
```

### Dexie Database Setup Dexie 資料庫設定

```typescript
// src/lib/db/database.ts

import Dexie, { type EntityTable } from 'dexie';
import type {
  AilmentType,
  TriggerType,
  HealthEntry,
  DailyCheckIn,
  PeriodEntry,
  CustomPeriodSymptom,
  AppSettings
} from '$lib/types';

export class HealthTrackerDB extends Dexie {
  ailmentTypes!: EntityTable<AilmentType, 'id'>;
  triggerTypes!: EntityTable<TriggerType, 'id'>;
  healthEntries!: EntityTable<HealthEntry, 'id'>;
  dailyCheckIns!: EntityTable<DailyCheckIn, 'id'>;
  periodEntries!: EntityTable<PeriodEntry, 'id'>;
  customSymptoms!: EntityTable<CustomPeriodSymptom, 'id'>;
  settings!: EntityTable<AppSettings, 'id'>;

  constructor() {
    super('HealthTrackerDB');

    // Version 3: Current schema with period tracking and custom symptoms
    this.version(3).stores({
      ailmentTypes: 'id, name, isDefault, isActive, createdAt',
      triggerTypes: 'id, name, category, isDefault, isActive, createdAt',
      healthEntries: 'id, date, time, ailmentTypeId, severity, createdAt',
      dailyCheckIns: 'id, &date, mood, createdAt',
      periodEntries: 'id, date, flow, createdAt',
      customSymptoms: 'id, name, isActive, createdAt',
      settings: 'id'
    });
  }
}

export const db = new HealthTrackerDB();
```

### Additional Data Models 額外資料模型

```typescript
/**
 * Period/menstrual tracking entry
 * 經期追蹤記錄
 */
export interface PeriodEntry {
  id: string;
  date: string;           // ISO date string (YYYY-MM-DD)
  flow: FlowLevel;        // spotting | light | medium | heavy
  symptoms: PeriodSymptom[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export type FlowLevel = 'spotting' | 'light' | 'medium' | 'heavy';
export type PeriodSymptom = BuiltInPeriodSymptom | string;

/**
 * Custom period symptom type
 * 自訂經期症狀類型
 */
export interface CustomPeriodSymptom {
  id: string;
  name: string;
  nameZh: string;
  icon: string;           // Emoji icon
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔄 State Management 狀態管理

Using Svelte 5 Runes for reactive state:

```typescript
// src/lib/stores/health.svelte.ts

import { db } from '$lib/db/database';
import type { HealthEntry, AilmentType, TriggerType } from '$lib/types';

class HealthStore {
  entries = $state<HealthEntry[]>([]);
  ailmentTypes = $state<AilmentType[]>([]);
  triggerTypes = $state<TriggerType[]>([]);
  selectedDate = $state<string>(new Date().toISOString().split('T')[0]);
  isLoading = $state<boolean>(false);

  // Derived state
  todayEntries = $derived(
    this.entries.filter(e => e.date === this.selectedDate)
  );

  activeAilmentTypes = $derived(
    this.ailmentTypes.filter(a => a.isActive)
  );

  activeTriggerTypes = $derived(
    this.triggerTypes.filter(t => t.isActive)
  );

  async loadData() {
    this.isLoading = true;
    try {
      this.ailmentTypes = await db.ailmentTypes.toArray();
      this.triggerTypes = await db.triggerTypes.toArray();
      await this.loadEntriesForDate(this.selectedDate);
    } finally {
      this.isLoading = false;
    }
  }

  async loadEntriesForDate(date: string) {
    this.entries = await db.healthEntries
      .where('date')
      .equals(date)
      .toArray();
  }

  async addEntry(entry: Omit<HealthEntry, 'id' | 'createdAt' | 'updatedAt'>) {
    const newEntry: HealthEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await db.healthEntries.add(newEntry);
    this.entries = [...this.entries, newEntry];
    return newEntry;
  }

  // ... more methods
}

export const healthStore = new HealthStore();
```

### ⚠️ Important: Svelte 5 Runes + IndexedDB 重要提示

**Problem:** Svelte 5's `$state` runes create reactive **proxies** that wrap your data. These proxies cannot be cloned by IndexedDB's structured clone algorithm, resulting in `DataCloneError`.

**Symptoms:**
```
DexieError: DataCloneError: Failed to execute 'add' on 'IDBObjectStore':
[object Object] could not be cloned.
```

**Solution:** When saving data to IndexedDB, explicitly create **plain objects** instead of spreading potentially reactive data:

```typescript
// ❌ BAD - spread may include reactive proxies
async addEntry(entry) {
  const newEntry = {
    ...entry,  // This might spread a proxy!
    id: crypto.randomUUID(),
  };
  await db.healthEntries.add(newEntry); // DataCloneError!
}

// ✅ GOOD - explicitly create plain object
async addEntry(entry) {
  const newEntry = {
    id: crypto.randomUUID(),
    date: entry.date,
    time: entry.time,
    ailmentTypeId: entry.ailmentTypeId,
    severity: entry.severity,
    triggerIds: [...entry.triggerIds], // Clone arrays!
    notes: entry.notes,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  await db.healthEntries.add(newEntry); // Works!
}
```

**Key Points:**
- Always destructure properties explicitly when saving to IndexedDB
- Clone arrays with `[...array]` to create plain arrays
- This applies to any interaction between Svelte 5 reactive state and IndexedDB

---

## 🌐 Internationalization (i18n) 國際化

### Translation Structure 翻譯結構

```typescript
// src/lib/i18n/en.ts
export const en = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    back: 'Back',
  },
  nav: {
    today: 'Today',
    stats: 'Stats',
    settings: 'Settings',
  },
  dayView: {
    title: 'Health Tracker',
    howAreYou: 'How are you feeling?',
    logAilment: 'Log an Ailment',
    todayEntries: "Today's Entries",
    noEntries: 'No entries yet today',
  },
  mood: {
    good: 'Good',
    okay: 'Okay',
    bad: 'Bad',
  },
  severity: {
    mild: 'Mild',
    moderate: 'Moderate',
    severe: 'Severe',
    verySevere: 'Very Severe',
  },
  triggers: {
    title: 'Potential Triggers',
    addCustom: 'Add Custom Trigger',
  },
  // ... more translations
};

// src/lib/i18n/zh-HK.ts
export const zhHK = {
  common: {
    save: '儲存',
    cancel: '取消',
    delete: '刪除',
    edit: '編輯',
    add: '新增',
    back: '返回',
  },
  nav: {
    today: '今日',
    stats: '統計',
    settings: '設定',
  },
  dayView: {
    title: '健康追蹤',
    howAreYou: '你今日感覺點呀？',
    logAilment: '記錄不適',
    todayEntries: '今日記錄',
    noEntries: '今日仲未有記錄',
  },
  mood: {
    good: '幾好',
    okay: '一般',
    bad: '唔舒服',
  },
  severity: {
    mild: '輕微',
    moderate: '中等',
    severe: '嚴重',
    verySevere: '非常嚴重',
  },
  triggers: {
    title: '可能嘅誘因',
    addCustom: '新增自訂誘因',
  },
  // ... more translations
};
```

### i18n Store i18n 狀態

```typescript
// src/lib/i18n/index.ts
import { en } from './en';
import { zhHK } from './zh-HK';

const translations = { en, 'zh-HK': zhHK };

class I18nStore {
  locale = $state<'en' | 'zh-HK'>('en');

  t = $derived(translations[this.locale]);

  setLocale(locale: 'en' | 'zh-HK') {
    this.locale = locale;
    // Persist to settings
  }
}

export const i18n = new I18nStore();
```

---

## 📱 CapacitorJS Integration Capacitor 整合

### Configuration 配置

```typescript
// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.healthtracker.app',
  appName: 'Health Tracker 健康追蹤',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FDF8F3',
      showSpinner: false,
    },
  }
};

export default config;
```

### Platform Detection 平台偵測

```typescript
// src/lib/utils/platform.ts
import { Capacitor } from '@capacitor/core';

export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform(); // 'web' | 'android' | 'ios'
```

---

## 📁 File Structure 檔案結構

```
health-tracker/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ui/                    # shadcn-svelte components
│   │   │   │   ├── button/
│   │   │   │   ├── card/
│   │   │   │   ├── dialog/
│   │   │   │   ├── input/
│   │   │   │   ├── select/
│   │   │   │   └── slider/
│   │   │   ├── AilmentCard.svelte     # Ailment entry display
│   │   │   ├── AilmentSelector.svelte # Quick ailment selection + add new
│   │   │   ├── DayPicker.svelte       # Date navigation
│   │   │   ├── LogAilmentSheet.svelte # Bottom sheet for logging
│   │   │   ├── MoodSelector.svelte    # Daily mood check-in
│   │   │   ├── Navigation.svelte      # Bottom navigation
│   │   │   ├── PeriodLogger.svelte    # Period tracking + custom symptoms
│   │   │   ├── SeveritySlider.svelte  # Severity input
│   │   │   └── TriggerSelector.svelte # Trigger multi-select
│   │   ├── db/
│   │   │   ├── database.ts            # Dexie setup
│   │   │   └── seed.ts                # Default data seeding
│   │   ├── stores/
│   │   │   ├── health.svelte.ts       # Health data store
│   │   │   └── settings.svelte.ts     # App settings store
│   │   ├── i18n/
│   │   │   ├── index.ts               # i18n setup
│   │   │   ├── en.ts                  # English translations
│   │   │   └── zh-HK.ts               # Cantonese translations
│   │   ├── types/
│   │   │   └── index.ts               # TypeScript interfaces
│   │   └── utils/
│   │       ├── cn.ts                  # Class name utility
│   │       ├── date.ts                # Date formatting
│   │       └── platform.ts            # Platform detection
│   ├── routes/
│   │   ├── +layout.svelte             # Root layout
│   │   ├── +page.svelte               # Day view (main)
│   │   ├── log/
│   │   │   └── +page.svelte           # Log ailment (full page)
│   │   ├── stats/
│   │   │   └── +page.svelte           # Statistics
│   │   └── settings/
│   │       ├── +page.svelte           # Settings main
│   │       ├── ailments/
│   │       │   └── +page.svelte       # Manage ailment types
│   │       └── triggers/
│   │           └── +page.svelte       # Manage triggers
│   ├── app.css                        # Global styles + Tailwind
│   ├── app.html                       # HTML template
│   └── app.d.ts                       # Type declarations
├── static/
│   ├── favicon.png
│   └── icons/                         # PWA/App icons
├── android/                           # Capacitor Android project
├── docs/
│   ├── DESIGN.md                      # Design system
│   └── TECHNICAL.md                   # This file
├── .gitignore
├── capacitor.config.ts
├── package.json
├── postcss.config.js
├── svelte.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🔐 Privacy & Security 私隱同安全

### Data Storage 資料儲存

- **All data stored locally** using IndexedDB via Dexie.js
- **No remote servers** - zero network requests for user data
- **No analytics** - no tracking scripts or telemetry
- **No accounts** - no authentication required

### Data Export/Import 資料匯出/匯入

```typescript
// Export all data as JSON
export async function exportData(): Promise<string> {
  const data = {
    ailmentTypes: await db.ailmentTypes.toArray(),
    triggerTypes: await db.triggerTypes.toArray(),
    healthEntries: await db.healthEntries.toArray(),
    dailyCheckIns: await db.dailyCheckIns.toArray(),
    settings: await db.settings.toArray(),
    exportedAt: new Date().toISOString(),
    version: '1.0.0'
  };
  return JSON.stringify(data, null, 2);
}

// Import data from JSON
export async function importData(jsonString: string): Promise<void> {
  const data = JSON.parse(jsonString);
  // Validate and import...
}
```

### Data Deletion 資料刪除

```typescript
// Clear all user data
export async function clearAllData(): Promise<void> {
  await db.healthEntries.clear();
  await db.dailyCheckIns.clear();
  // Keep ailmentTypes and triggerTypes, reset to defaults
  await seedDefaultData();
}
```

---

## 🧪 Testing Strategy 測試策略

### Unit Tests 單元測試

```typescript
// Using Vitest
// tests/stores/health.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { healthStore } from '$lib/stores/health.svelte';

describe('Health Store', () => {
  beforeEach(async () => {
    // Reset database
  });

  it('should add a new entry', async () => {
    // Test implementation
  });
});
```

### Component Tests 元件測試

```typescript
// Using Testing Library
// tests/components/AilmentCard.test.ts

import { render, screen } from '@testing-library/svelte';
import AilmentCard from '$lib/components/AilmentCard.svelte';

describe('AilmentCard', () => {
  it('displays ailment information', () => {
    // Test implementation
  });
});
```

---

## 🚀 Build & Deployment 建置同部署

### Development 開發

```bash
npm run dev
```

### Production Build 生產建置

```bash
npm run build
npm run preview
```

### Android Build Android 建置

```bash
# Initial setup
npm run build
npx cap add android

# Subsequent builds
npm run build
npx cap sync android
npx cap open android  # Opens Android Studio
```

### PWA Support PWA 支援

The app is configured as a Progressive Web App:
- Offline support via Service Worker
- Installable on mobile devices
- App-like experience

---

## 📋 Default Data 預設資料

### Default Ailment Types 預設不適類型

| ID | Name | Chinese | Icon |
|----|------|---------|------|
| `headache` | Headache/Migraine | 頭痛/偏頭痛 | `noto:face-with-head-bandage` |
| `stomach` | Stomach Pain | 肚痛 | `noto:nauseated-face` |
| `fatigue` | Fatigue | 疲倦 | `noto:sleeping-face` |
| `allergy` | Allergies | 敏感 | `noto:sneezing-face` |

### Default Trigger Types 預設誘因類型

| ID | Name | Chinese | Icon | Category |
|----|------|---------|------|----------|
| `caffeine` | Caffeine | 咖啡因 | `noto:hot-beverage` | substance |
| `food` | Food | 食物 | `noto:hamburger` | food |
| `sleep` | Poor Sleep | 瞓得唔好 | `noto:sleeping-face` | lifestyle |
| `stress` | Stress | 壓力 | `noto:anxious-face-with-sweat` | lifestyle |
| `weather` | Weather | 天氣 | `noto:sun-behind-cloud` | environment |
| `medication` | Medication | 藥物 | `noto:pill` | substance |
| `alcohol` | Alcohol | 酒精 | `noto:wine-glass` | substance |
| `dairy` | Dairy | 奶製品 | `noto:glass-of-milk` | food |
| `gluten` | Gluten | 麩質 | `noto:bread` | food |

