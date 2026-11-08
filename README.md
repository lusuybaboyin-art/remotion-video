# Trendy Reels/Shorts Video Editor - Remotion Project

Проект для создания трендовых вертикальных видео (1080x1920) в стиле Reels/Shorts/TikTok с помощью Remotion.

## Особенности

- 🎬 **Субтитры по словам** - karaoke-стиль с подсветкой каждого слова синхронно с аудио
- 🎵 **SFX на битах** - визуальные звуковые эффекты (вспышки, кольца, частицы, тряска) синхронизированные с речью
- 📹 **Стоковые визуалы** - программно генерируемые абстрактные фоновые элементы (grid, motion blur, sound waves, particles)
- ⚡ **Глитч-эффекты** - RGB split, scanlines, digital noise, glitch text для акцентов
- 🔄 **Плавные переходы** - zoom slam, whip pan, match cut, glitch cut, speed ramp
- 🎨 **Динамичные фоны** - градиентные пульсации, частицы, неоновые следы, паралакс

## Структура проекта

```
remotion-edit/
├── public/
│   ├── audio/          # Аудиофайлы (voice.mp3)
│   ├── video/          # Стоковые видеофайлы (опционально)
│   ├── images/         # Изображения
│   └── fonts/          # Шрифты (Space Grotesk, Inter)
├── src/
│   ├── Root.tsx              # Корневая композиция
│   ├── MainVideo.tsx         # Основной компонент видео
│   ├── index.ts              # Экспорты
│   └── components/
│       ├── WordSubtitles.tsx     # Субтитры по словам (karaoke)
│       ├── StockFootage.tsx      # Программные стоковые визуалы
│       ├── TransitionEffects.tsx # Переходы между сценами
│       ├── SFXOverlay.tsx        # Визуальные SFX на битах
│       ├── GlitchText.tsx        # Глитч-текстовые эффекты
│       └── DynamicBackground.tsx # Динамичные фоны
├── package.json
└── tsconfig.json
```

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск студии для превью
npm run dev
# или
npx remotion studio

# Рендеринг финального видео
npm run render
# или
npx remotion render MainVideo out/video.mp4

# Быстрый тестовый рендер (половина разрешения)
npx remotion render --scale=0.5 MainVideo out/test.mp4
```

## Настройка под свой контент

### 1. Аудио
Положите свой аудиофайл в `public/audio/voice.mp3` или измените путь в `Root.tsx`.

### 2. Сценарий (тайминги слов)
Отредактируйте массив `scriptWords` в `MainVideo.tsx`:
```typescript
const scriptWords = [
  { word: "Ваше", start: 0, end: 15 },
  { word: "слово", start: 15, end: 30 },
  // ... тайминги в кадрах (30 fps)
];
```

### 3. Сцены и визуальные приемы
Настройте массив `scenes` в `MainVideo.tsx`:
```typescript
const scenes = [
  {
    id: 0,
    name: "intro",
    startFrame: 0,
    endFrame: 150,
    bgType: "gradient-pulse",     // gradient-pulse | particles | grid-lines | rgb-shift | neon-trails
    transition: "zoom-slam",       // zoom-slam | whip-pan | match-cut | glitch-cut | speed-ramp | zoom-out-fade
    stockKeyword: "tech abstract", // tech abstract | fast motion blur | editing timeline | typography animation | sound waves visualization | success celebration
    glitchIntensity: 0.3,          // 0-1
  },
  // ...
];
```

### 4. Стиль субтитров
Настройте в `WordSubtitles.tsx`:
- Размер шрифта (`fontSize`)
- Цветовую схему (`colors`)
- Анимации (`spring` конфигурация)
- Позицию (`baseY`)

### 5. SFX эффекты
Настройте в `SFXOverlay.tsx`:
- Типы эффектов на битах
- Частоту фоновой пульсации
- Цвета частиц

## Использование реальных стоковых видео

Вместо программных визуалов в `StockFootage.tsx`, можно использовать реальные видео:

```tsx
import { Video } from "remotion";

<Video
  src={staticFile("video/your-stock-footage.mp4")}
  style={{ width, height, objectFit: "cover" }}
  loop
  muted
/>
```

Положите файлы в `public/video/` и обновите `StockFootage.tsx`.

## Шрифты

Проект использует:
- **Space Grotesk** - для заголовков и субтитров (geometric, современный)
- **Inter** - фоллбек

Скачайте и положите в `public/fonts/`, затем подключите в `index.html` или через CSS.

## Цветовая схема (трендовая)

```css
:root {
  --cyan: #00F5FF;      /* Основной акцент */
  --magenta: #FF00F5;   /* Вторичный акцент */
  --gold: #FFD700;      /* Третичный акцент */
  --green: #00FF88;     /* Успех/плюс */
  --bg-dark: #0a0a0f;   /* Фон */
}
```

## Советы по монтажу (из анализа примеров)

1. **Быстрые переходы** - 0.5-1 сек между сценами
2. **Субтитры на каждом слове** - удерживают внимание, читаются легко
3. **SFX на акцентах** - вспышки/тряска на битах речи
4. **Глитч на ключевых словах** - выделение важных моментов
5. **Баланс динамики и смотрибельности** - не переборщить с эффектами, давать глазам отдых
6. **Вертикальный формат 9:16** - 1080x1920 для Reels/Shorts/TikTok
7. **30 fps** - стандарт для соцсетей
8. **Контрастные цвета** - cyan/magenta/gold на темном фоне

## Рендеринг для продакшена

```bash
# Полное качество H.264 (MP4)
npx remotion render --codec=h264 --crf=18 MainVideo out/final.mp4

# WebM с прозрачностью (если нужно)
npx remotion render --codec=vp9 MainVideo out/final.webm

# Только кадр для превью
npx remotion still MainVideo --frame=150 out/thumbnail.png
```

## Лицензия

MIT - используйте свободно для своих проектов.