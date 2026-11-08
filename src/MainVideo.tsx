import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Audio,
  Easing,
} from "remotion";
import React, { useMemo } from "react";
import { WordSubtitles } from "./components/WordSubtitles";
import { StockFootage } from "./components/StockFootage";
import { TransitionEffects } from "./components/TransitionEffects";
import { SFXOverlay } from "./components/SFXOverlay";
import { GlitchText } from "./components/GlitchText";
import { DynamicBackground } from "./components/DynamicBackground";

interface MainVideoProps {
  audioPath: string;
}

// Сценарий с таймингами для слов (в фреймах при 30fps)
const scriptWords = [
  { word: "Привет", start: 0, end: 15 },
  { word: "всем!", start: 15, end: 30 },
  { word: "Сегодня", start: 35, end: 50 },
  { word: "мы", start: 50, end: 60 },
  { word: "разберем", start: 60, end: 80 },
  { word: "трендовый", start: 80, end: 100 },
  { word: "стиль", start: 100, end: 115 },
  { word: "монтажа", start: 115, end: 135 },
  { word: "для", start: 135, end: 145 },
  { word: "Reels", start: 145, end: 165 },
  { word: "и", start: 165, end: 175 },
  { word: "Shorts", start: 175, end: 195 },
  { word: "Этот", start: 200, end: 215 },
  { word: "подход", start: 215, end: 235 },
  { word: "дает", start: 235, end: 250 },
  { word: "максимальную", start: 250, end: 275 },
  { word: "удержание", start: 275, end: 300 },
  { word: "Вот", start: 305, end: 320 },
  { word: "основные", start: 320, end: 340 },
  { word: "приемы", start: 340, end: 360 },
  { word: "Сначала", start: 365, end: 380 },
  { word: "динамичные", start: 380, end: 400 },
  { word: "переходы", start: 400, end: 420 },
  { word: "потом", start: 420, end: 435 },
  { word: "стильные", start: 435, end: 455 },
  { word: "субтитры", start: 455, end: 475 },
  { word: "к", start: 475, end: 485 },
  { word: "каждому", start: 485, end: 505 },
  { word: "слову", start: 505, end: 525 },
  { word: "Звуковые", start: 530, end: 555 },
  { word: "эффекты", start: 555, end: 575 },
  { word: "на", start: 575, end: 585 },
  { word: "битах", start: 585, end: 605 },
  { word: "Стоковые", start: 610, end: 635 },
  { word: "ролики", start: 635, end: 655 },
  { word: "в", start: 655, end: 665 },
  { word: "нужных", start: 665, end: 685 },
  { word: "моментах", start: 685, end: 710 },
  { word: "Баланс", start: 715, end: 735 },
  { word: "между", start: 735, end: 750 },
  { word: "динамикой", start: 750, end: 770 },
  { word: "и", start: 770, end: 780 },
  { word: "смотрибельностью", start: 780, end: 810 },
  { word: "Пробуй", start: 815, end: 835 },
  { word: "и", start: 835, end: 845 },
  { word: "смотри", start: 845, end: 865 },
  { word: "результат!", start: 865, end: 890 },
];

// Сцены с визуальными приемами
const scenes = [
  {
    id: 0,
    name: "intro",
    startFrame: 0,
    endFrame: 150,
    bgType: "gradient-pulse",
    transition: "zoom-slam",
    stockKeyword: "tech abstract",
    glitchIntensity: 0.3,
  },
  {
    id: 1,
    name: "hook",
    startFrame: 150,
    endFrame: 300,
    bgType: "particles",
    transition: "whip-pan",
    stockKeyword: "fast motion blur",
    glitchIntensity: 0.5,
  },
  {
    id: 2,
    name: "technique-1",
    startFrame: 300,
    endFrame: 450,
    bgType: "grid-lines",
    transition: "match-cut",
    stockKeyword: "editing timeline",
    glitchIntensity: 0.2,
  },
  {
    id: 3,
    name: "technique-2",
    startFrame: 450,
    endFrame: 600,
    bgType: "rgb-shift",
    transition: "glitch-cut",
    stockKeyword: "typography animation",
    glitchIntensity: 0.6,
  },
  {
    id: 4,
    name: "technique-3",
    startFrame: 600,
    endFrame: 750,
    bgType: "neon-trails",
    transition: "speed-ramp",
    stockKeyword: "sound waves visualization",
    glitchIntensity: 0.4,
  },
  {
    id: 5,
    name: "outro",
    startFrame: 750,
    endFrame: 900,
    bgType: "gradient-pulse",
    transition: "zoom-out-fade",
    stockKeyword: "success celebration",
    glitchIntensity: 0.1,
  },
];

export const MainVideo: React.FC<MainVideoProps> = ({ audioPath }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Определяем текущую сцену
  const currentScene = useMemo(() => {
    return scenes.find((s) => frame >= s.startFrame && frame < s.endFrame) || scenes[0];
  }, [frame]);

  const sceneProgress = useMemo(() => {
    if (!currentScene) return 0;
    return (frame - currentScene.startFrame) / (currentScene.endFrame - currentScene.startFrame);
  }, [frame, currentScene]);

  // Глобальные анимации
  const globalScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const globalRotation = interpolate(frame, [0, 900], [0, 360 * 0.5], {
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ width, height, overflow: "hidden", position: "relative" }}>
      {/* Динамичный фон */}
      <DynamicBackground
        type={currentScene?.bgType || "gradient-pulse"}
        progress={sceneProgress}
        frame={frame}
        fps={fps}
        glitchIntensity={currentScene?.glitchIntensity || 0}
      />

      {/* Стоковые ролики с переходами */}
      <TransitionEffects
        currentScene={currentScene}
        sceneProgress={sceneProgress}
        frame={frame}
        fps={fps}
        width={width}
        height={height}
      >
        <StockFootage
          keyword={currentScene?.stockKeyword || "abstract"}
          progress={sceneProgress}
          frame={frame}
          fps={fps}
          width={width}
          height={height}
        />
      </TransitionEffects>

      {/* Glitch текстовые элементы поверх всего */}
      <GlitchText
        words={scriptWords}
        frame={frame}
        fps={fps}
        currentScene={currentScene}
        glitchIntensity={currentScene?.glitchIntensity || 0}
      />

      {/* Субтитры по словам - главный фокус */}
      <WordSubtitles
        words={scriptWords}
        frame={frame}
        fps={fps}
        width={width}
        height={height}
      />

      {/* SFX визуальные индикаторы на битах */}
      <SFXOverlay
        frame={frame}
        fps={fps}
        words={scriptWords}
        width={width}
        height={height}
      />

      {/* Аудио */}
      <Audio src={audioPath} />
    </div>
  );
};