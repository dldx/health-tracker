# 🌟 Features Guide 功能指南

A comprehensive guide to all features in the Health Tracker app.

本指南詳細介紹健康追蹤應用程式的所有功能。

---

## 📅 Day View 日誌檢視

The main screen for daily health logging.

主畫面用嚟記錄每日健康狀況。

### Components

1. **Date Picker 日期選擇**
   - Navigate between days
   - View past entries
   - Quick jump to today

2. **Mood Selector 心情選擇**
   - 😊 Good 幾好
   - 😐 Okay 一般
   - 😔 Bad 唔舒服

3. **Period Tracker 經期追蹤**
   - Log menstrual flow (Light/Medium/Heavy/Spotting)
   - Track common symptoms (cramps, bloating, etc.)
   - Add custom symptoms
   - 記錄經期流量（輕/中/重/點滴）
   - 追蹤常見症狀（經痛、腹脹等）
   - 新增自訂症狀

4. **Ailment Selector 症狀選擇**
   - Quick-select from favorite ailments
   - Add new custom ailments
   - Smart sorting by usage frequency
   - 快速選擇常用症狀
   - 新增自訂症狀
   - 按使用頻率智能排序

5. **Today's Entries 今日記錄**
   - View all entries for selected date
   - Edit or delete entries
   - Staggered animations for visual appeal
   - 查看選定日期的所有記錄
   - 編輯或刪除記錄
   - 錯開動畫效果

---

## 📊 Statistics Page 統計分析

Advanced analytics and insights into your health patterns.

深入分析你的健康模式。

### Filtering 篩選

**Ailment Filter 症狀篩選**
- Filter all stats by specific ailment
- View "All Ailments" for overall patterns
- Filters apply to all visualizations
- 按特定症狀篩選所有統計
- 查看「所有症狀」了解整體模式
- 篩選應用於所有視覺化

### Visualizations 視覺化

#### 1. Summary Cards 總覽卡片

Quick overview of key metrics:
- Total entries this month
- Average severity
- Average entries per week
- Most common time of day

快速概覽關鍵指標：
- 本月總記錄數
- 平均嚴重程度
- 每週平均記錄數
- 最常發生時段

#### 2. Severity Trend Chart 嚴重程度趨勢圖

Line chart showing daily average severity over the month.
- Gradient fill for visual appeal
- Grid lines for easy reading
- Date range labels

折線圖顯示本月每日平均嚴重程度。
- 漸變填充視覺效果
- 網格線方便閱讀
- 日期範圍標籤

#### 3. Time of Day Pattern 時段分佈

Circular icons showing when symptoms most commonly occur:
- 🌅 Morning (5am-12pm)
- ☀️ Afternoon (12pm-5pm)
- 🌥️ Evening (5pm-9pm)
- 🌙 Night (9pm-5am)

圓形圖示顯示症狀最常發生的時段：
- 🌅 朝早 (5am-12pm)
- ☀️ 下晝 (12pm-5pm)
- 🌥️ 傍晚 (5pm-9pm)
- 🌙 夜晚 (9pm-5am)

#### 4. Weekly Pattern 星期分佈

Bar chart showing which days of the week symptoms occur most.

柱狀圖顯示星期幾最常出現症狀。

#### 5. Trigger Correlation 誘因關聯分析

**NEW: Period included as a trigger!**

Shows what percentage of your ailments are associated with each trigger:
- Percentage shows co-occurrence frequency
- Color-coded by correlation strength
- Includes period correlation if tracked

顯示每個誘因與症狀的關聯百分比：
- 百分比顯示共現頻率
- 按關聯強度色彩編碼
- 如有追蹤經期會包含經期關聯

**Understanding the percentages 理解百分比：**
- 60% caffeine = "In 60% of cases, caffeine was logged"
- Percentages DON'T add to 100% (entries can have multiple triggers)
- 60% 咖啡因 = 「60% 個案記錄了咖啡因」
- 百分比不會加起來等於 100%（記錄可以有多個誘因）

#### 6. Calendar Heatmap 日曆熱圖

Visual monthly overview with color-coded severity:
- 🟢 Green = Mild (severity 1-2)
- 🟡 Yellow = Moderate (severity 3)
- 🔴 Red = Severe (severity 4-5)
- 🩸 **Pink bar at bottom = Period day**

視覺化月度概覽，按嚴重程度色彩編碼：
- 🟢 綠色 = 輕微（嚴重程度 1-2）
- 🟡 黃色 = 中等（嚴重程度 3）
- 🔴 紅色 = 嚴重（嚴重程度 4-5）
- 🩸 **底部粉紅色條 = 經期日**

#### 7. Period Correlation Analysis 經期關聯分析

**Powerful insights into menstrual cycle patterns!**

Compares symptom frequency and severity during vs. outside period:

**Overall Metrics:**
- Entry count comparison (during vs. outside)
- Percentage change in frequency
- Average severity comparison

**Smart Messages:**
- "Only occurs during period" - symptom never happens outside cycle
- "Only occurs outside period" - symptom never happens during cycle
- "+X% more common during period" - standard comparison

**Per-Ailment Breakdown (when viewing all ailments):**
- Stacked bar chart showing period vs. non-period frequency
- Color-coded percentage change
- Individual correlation for each tracked ailment

**強大的經期模式洞察！**

比較經期期間與經期以外的症狀頻率和嚴重程度：

**整體指標：**
- 記錄數比較（期間與以外）
- 頻率變化百分比
- 平均嚴重程度比較

**智能訊息：**
- 「只喺經期期間發生」- 症狀從不在經期以外發生
- 「只喺經期以外發生」- 症狀從不在經期期間發生
- 「經期期間 +X% 更常見」- 標準比較

**每種症狀細分（查看所有症狀時）：**
- 堆疊柱狀圖顯示經期與非經期頻率
- 百分比變化色彩編碼
- 每種追蹤症狀的個別關聯

#### 8. Cycle Statistics 經期統計

Monthly cycle tracking insights:
- Average cycle length
- Average period duration
- Last period start date
- Predicted next period (based on average)
- Total cycles tracked

每月週期追蹤洞察：
- 平均週期長度
- 平均經期持續時間
- 上次經期開始日期
- 預測下次經期（基於平均值）
- 已追蹤的週期總數

---

## ⚙️ Settings Page 設定頁面

Full customization and data management.

完全自訂和數據管理。

### Language 語言

Switch between:
- 🇬🇧 English
- 🇭🇰 繁體中文（廣東話）

### Ailment Types 症狀類型

**Manage your tracked ailments:**
- Toggle active/inactive
- Edit custom ailments (name, icon)
- Delete custom ailments
- ⚠️ Default ailments can only be toggled

**管理你的追蹤症狀：**
- 切換啟用/停用
- 編輯自訂症狀（名稱、圖示）
- 刪除自訂症狀
- ⚠️ 預設症狀只能切換

### Trigger Types 誘因類型

**Manage potential triggers:**
- Toggle active/inactive
- Edit custom triggers (name, icon, category)
- Delete custom triggers
- Categories: Food, Lifestyle, Environment, Substance, Other

**管理潛在誘因：**
- 切換啟用/停用
- 編輯自訂誘因（名稱、圖示、類別）
- 刪除自訂誘因
- 類別：食物、生活習慣、環境、物質、其他

### Period Symptoms 經期症狀

**Manage custom period symptoms:**
- Toggle active/inactive
- Edit symptoms (name, icon)
- Delete symptoms

**管理自訂經期症狀：**
- 切換啟用/停用
- 編輯症狀（名稱、圖示）
- 刪除症狀

### Data Management 數據管理

**Export Data 匯出數據**
- Downloads JSON file with all your data
- Includes: entries, ailments, triggers, settings
- Filename: `health-tracker-export-YYYY-MM-DD.json`

**Import Data 匯入數據**
- Upload previously exported JSON file
- Merges with existing data (no duplicates)
- Overwrites check-ins for same dates

**Clear All Data 清除所有數據**
- ⚠️ Permanently deletes ALL data
- Requires confirmation
- Cannot be undone

---

## 🔧 Technical Features 技術功能

### Mobile Compatibility 流動裝置兼容性

**UUID Generation Fallback:**
- Uses `crypto.randomUUID()` when available (HTTPS)
- Falls back to `crypto.getRandomValues()` (HTTP)
- Final fallback to `Math.random()` if needed
- Works on all mobile browsers

**UUID 生成後備機制：**
- 可用時使用 `crypto.randomUUID()`（HTTPS）
- 後備至 `crypto.getRandomValues()`（HTTP）
- 如需要最終後備至 `Math.random()`
- 適用於所有流動瀏覽器

### Component Architecture 組件架構

**18 reusable components organized by page:**
- **Stats** (10): All visualizations modular
- **Today** (2): Period button, entries section
- **Settings** (6): Language, lists, modals

**18 個可重用組件按頁面組織：**
- **統計** (10)：所有視覺化模組化
- **今日** (2)：經期按鈕、記錄區段
- **設定** (6)：語言、列表、模態框

### Reactive Filtering 響應式篩選

All stats automatically update when:
- Changing month
- Selecting ailment filter
- Toggling ailment types
- Adding/editing data

所有統計會自動更新當：
- 更改月份
- 選擇症狀篩選
- 切換症狀類型
- 新增/編輯數據

---

## 🎯 Tips for Best Results 使用建議

### For Accurate Period Correlation 準確的經期關聯

1. **Log consistently** - Track both during and outside period
2. **Track all ailments** - Don't just log during period
3. **Use for 2-3 cycles** - Patterns emerge over time

1. **持續記錄** - 經期期間和以外都要追蹤
2. **追蹤所有症狀** - 唔好只喺經期記錄
3. **使用 2-3 個週期** - 模式會隨時間浮現

### For Meaningful Trigger Analysis 有意義的誘因分析

1. **Be specific** - Log multiple triggers when applicable
2. **Add custom triggers** - Personalize to your lifestyle
3. **Review monthly** - Look for patterns over time

1. **具體記錄** - 適用時記錄多個誘因
2. **新增自訂誘因** - 個人化你的生活方式
3. **每月檢視** - 尋找隨時間出現的模式

### For Better Statistics 更好的統計

1. **Log severity consistently** - Use same scale each time
2. **Note time accurately** - Helps identify time patterns
3. **Review calendar monthly** - Spot visual patterns

1. **一致地記錄嚴重程度** - 每次使用相同標準
2. **準確記錄時間** - 有助識別時間模式
3. **每月檢視日曆** - 發現視覺模式

---

*Last updated: November 26, 2025*

*最後更新：2025年11月26日*

