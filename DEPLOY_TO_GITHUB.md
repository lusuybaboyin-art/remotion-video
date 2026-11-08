# 🚀 Деплой на GitHub Actions (бесплатный рендер в облаке)

Получишь готовое `final.mp4` **без установки ничего у себя** — всё рендерится на серверах GitHub (4 ядра, 7 Гб RAM).

---

## 📋 Пошаговая инструкция (3 минуты)

### 1. Создай репозиторий на GitHub
- Зайди на https://github.com/new
- Название: `remotion-video` (любое)
- **Public** (бесплатно) или Private
- **Не добавляй** README, .gitignore, license — пустой репо
- Нажми **Create repository**

### 2. Запушь проект (в PowerShell / cmd)

```bash
# 1. Зайди в папку проекта
cd "C:\Users\User\AppData\Local\Claude-3p\local-agent-mode-sessions\37e9173e\00000000\245fd5a1\outputs\remotion-edit"

# 2. Инициализируй git (если ещё не сделано)
git init
git add .
git commit -m "Initial commit: Remotion video project"

# 3. Подключи свой репо (замени USER на свой ник, REPO на название)
git remote add origin https://github.com/USER/REPO.git
git branch -M main
git push -u origin main
```

> 💡 Если просит логин/пароль — используй **Personal Access Token** (Settings → Developer settings → Personal access tokens → Generate new token (classic) → scopes: `repo`, `workflow`)

### 3. Положи аудиофайл в репо (важно!)

**Вариант А — через веб-интерфейс (проще):**
1. Зайди в свой репо на GitHub
2. Нажми **Add file** → **Upload files**
3. Перетащи `ElevenLabs_2026-11-08T21_20_17_Denophine - Energetic and Engaging_pvc_s50_sim75_v4.mp3`
4. Переименуй его в `voice.mp3` прямо при загрузке
5. Положи в папку `public/audio/` (создай её при загрузке)
6. Commit changes

**Вариант Б — локально перед пушем:**
```bash
# Скопируй свой mp3 в проект
copy "C:\Users\User\OneDrive\Рабочий стол\Монтаж\ElevenLabs_2026-11-08T21_20_17_Denophine - Energetic and Engaging_pvc_s50_sim75_v4.mp3" public\audio\voice.mp3

# Запушь
git add public/audio/voice.mp3
git commit -m "Add audio"
git push
```

### 4. Запусти рендер

1. Зайди в репо на GitHub
2. Вкладка **Actions** (сверху)
3. Слева выбери **Render Remotion Video**
4. Нажми **Run workflow** (зелёная кнопка справа)
5. Жми зелёную **Run workflow** в модалке

### 5. Скачай готовое видео ⬇️

- Жди 3-5 минут (зелёный чекмарк напротив workflow)
- Зайди в завершённый запуск
- Внизу **Artifacts** → скачай:
  - `final-video-1080x1920.zip` → внутри `final.mp4` (качественное)
  - `preview-video-540x960.zip` → внутри `preview.mp4` (быстрый превью)

---

## 🔧 Если нужно перерендерить с другими настройками

Просто пушь любые изменения в `src/` или `public/` — workflow запустится автоматически (см. `on.push` в `.github/workflows/render.yml`).

Или жми **Run workflow** вручную сколько угодно раз.

---

## ⚠️ Возможные проблемы

| Проблема | Решение |
|----------|---------|
| `voice.mp3` не найден | Workflow сам создаст тишину, но лучше положи свой аудио (см. шаг 3) |
| Ошибка памяти | В workflow стоит `--max-old-space-size=4096`, хватает для 30 сек |
| Рендер падает | Проверь логи в Actions — часто проблема в синтаксисе TSX (у нас чисто) |
| Видео без звука | Убедись что `voice.mp3` валидный, не повреждён |

---

## 💰 Бесплатные лимиты GitHub Actions

- **Public репо**: безлимитные минуты
- **Private репо**: 2000 мин/месяц (наш рендер ~3-5 мин → ~400-600 видео в месяц)

---

## 🎯 Готово!

После первого пуша у тебя будет **автоматическая фабрика видео**:
- Меняешь текст в `MainVideo.tsx` → пушишь → через 3 мин качаешь новое видео
- Никакого Node.js, FFmpeg, памяти у себя не нужно

**Поехали!** Создай репо и пушь — через 5 минут будет готовое видео. 🎬