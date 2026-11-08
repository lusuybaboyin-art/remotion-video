import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import React, { useMemo } from "react";

interface WordData {
  word: string;
  start: number;
  end: number;
}

interface SFXOverlayProps {
  frame: number;
  fps: number;
  words: WordData[];
  width: number;
  height: number;
}

// Визуализация SFX (звуковых эффектов) - визуальные маркеры на битах
// В трендовых Reels/Shorts SFX синхронизированы с битами речи и музыки
export const SFXOverlay: React.FC<SFXOverlayProps> = ({
  frame,
  fps,
  words,
  width,
  height,
}) => {
  // Генерируем "биты" на основе слов и ритма
  const beats = useMemo(() => {
    const beats: number[] = [];

    // Биты на начале каждого слова (акцент)
    words.forEach((word) => {
      beats.push(word.start);
      // Дополнительные биты внутри длинных слов
      if (word.end - word.start > 20) {
        const mid = word.start + (word.end - word.start) / 2;
        beats.push(Math.round(mid));
      }
    });

    // Ритмические биты каждые 15 кадров (0.5 сек при 30fps) для фоновой музыки
    for (let f = 0; f < 900; f += 15) {
      beats.push(f);
    }

    // Сортируем и убираем дубликаты
    return [...new Set(beats)].sort((a, b) => a - b);
  }, [words]);

  // Визуальные эффекты на битах
  const beatEffects = beats.map((beatFrame, index) => {
    const framesSinceBeat = frame - beatFrame;
    const beatProgress = framesSinceBeat / 15; // 0.5 сек анимация

    if (beatProgress < 0 || beatProgress > 1) return null;

    // Разные типы визуальных SFX
    const effectType = index % 5;

    switch (effectType) {
      case 0: // Пульсирующее кольцо
        return (
          <div
            key={`ring-${index}`}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: interpolate(beatProgress, [0, 1], [0, width * 1.5]),
              height: interpolate(beatProgress, [0, 1], [0, width * 1.5]),
              transform: "translate(-50%, -50%)",
              border: `2px solid #00F5FF`,
              borderRadius: "50%",
              opacity: interpolate(beatProgress, [0, 0.3, 1], [0, 0.6, 0]),
              boxShadow: `0 0 ${interpolate(beatProgress, [0, 1], [30, 0])}px #00F5FF`,
              pointerEvents: "none",
              zIndex: 80,
            }}
          />
        );

      case 1: // Вспышка (flash)
        return (
          <div
            key={`flash-${index}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width,
              height,
              background: "white",
              opacity: interpolate(beatProgress, [0, 0.1, 0.3, 1], [0, 0.4, 0.1, 0]),
              pointerEvents: "none",
              zIndex: 85,
              mixBlendMode: "screen",
            }}
          />
        );

      case 2: // Горизонтальные линии (scanlines)
        return (
          <div
            key={`scan-${index}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width,
              height,
              pointerEvents: "none",
              zIndex: 75,
              opacity: interpolate(beatProgress, [0, 0.5, 1], [0, 0.4, 0]),
            }}
          >
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: (height / 8) * i,
                  left: interpolate(beatProgress, [0, 1], [-width, width * 2]),
                  width: width * 3,
                  height: height / 8,
                  background: `linear-gradient(90deg, transparent, #00F5FF, transparent)`,
                  opacity: 0.3,
                  transform: `skewX(-15deg)`,
                }}
              />
            ))}
          </div>
        );

      case 3: // Частицы-всплеск
        return (
          <div
            key={`particles-${index}`}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width,
              height,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              zIndex: 90,
            }}
          >
            {[...Array(12)].map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const distance = interpolate(beatProgress, [0, 1], [0, 200]);
              const particleSize = interpolate(beatProgress, [0, 0.5, 1], [0, 12, 0]);

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: particleSize,
                    height: particleSize,
                    transform: `translate(-50%, -50%) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`,
                    background: ["#00F5FF", "#FF00F5", "#FFD700", "#00FF88"][i % 4],
                    borderRadius: "50%",
                    boxShadow: `0 0 ${particleSize * 2}px ${["#00F5FF", "#FF00F5", "#FFD700", "#00FF88"][i % 4]}`,
                    opacity: interpolate(beatProgress, [0, 0.5, 1], [0, 1, 0]),
                    mixBlendMode: "screen",
                  }}
                />
              );
            })}
          </div>
        );

      case 4: // Тряска камеры (screen shake indicator)
        return (
          <div
            key={`shake-${index}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width,
              height,
              pointerEvents: "none",
              zIndex: 70,
              transform: `translate(${Math.sin(beatProgress * 50) * 10 * (1 - beatProgress)}px, ${Math.cos(beatProgress * 40) * 8 * (1 - beatProgress)}px)`,
              filter: `hue-rotate(${beatProgress * 180}deg) contrast(${1 + beatProgress * 0.5})`,
              opacity: interpolate(beatProgress, [0, 0.3, 1], [0, 0.3, 0]),
              mixBlendMode: "difference",
            }}
          />
        );

      default:
        return null;
    }
  });

  // Постоянный визуальный ритм (пульсация на каждом бите фоновой музыки)
  const globalPulse = useMemo(() => {
    const beatPhase = (frame / fps) * 2; // 2 бита в секунду
    const pulseIntensity = (Math.sin(beatPhase * Math.PI * 2) + 1) / 2; // 0-1

    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width,
          height,
          pointerEvents: "none",
          zIndex: 10,
          opacity: 0.05 * pulseIntensity,
          background: "radial-gradient(circle at center, #00F5FF 0%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
    );
  }, [frame, fps, width, height]);

  // Индикатор BPM в углу (для отладки/стиля)
  const bpmIndicator = (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        right: 20,
        fontFamily: "'Space Grotesk', monospace",
        fontSize: "14px",
        fontWeight: 600,
        color: "rgba(0, 245, 255, 0.5)",
        textShadow: "0 0 10px #00F5FF",
        pointerEvents: "none",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#00F5FF",
          boxShadow: "0 0 10px #00F5FF",
          animation: "bpmPulse 0.5s ease-in-out infinite",
        }}
      />
      <span>120 BPM</span>
      <style jsx global>{`
        @keyframes bpmPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
        }
      `}</style>
    </div>
  );

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width, height, pointerEvents: "none" }}>
      {globalPulse}
      {beatEffects}
      {bpmIndicator}
    </div>
  );
};

// Компонент для синхронизации с аудио (когда есть реальный аудиофайл)
export const AudioSyncSFX: React.FC<{
  frame: number;
  fps: number;
  audioRef: React.RefObject<HTMLAudioElement>;
  width: number;
  height: number;
}> = ({ frame, fps, audioRef, width, height }) => {
  // Здесь была бы логика анализа аудио в реальном времени
  // Для Remotion лучше предварительно извлечь биты через FFmpeg/aubio
  // и передать как данные

  return null; // Заглушка для будущей интеграции
};

// Визуализатор формы волны для SFX
export const WaveformVisualizer: React.FC<{
  frame: number;
  fps: number;
  width: number;
  height: number;
  data: number[]; // Амплитуды (0-1)
  color?: string;
}> = ({ frame, fps, width, height, data, color = "#00F5FF" }) => {
  const barCount = data.length;
  const barWidth = width / barCount;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width,
        height: height * 0.3,
        pointerEvents: "none",
        zIndex: 60,
      }}
    >
      {data.map((amplitude, i) => {
        const barHeight = amplitude * height * 0.3;
        const hue = (frame * 0.5 + i * 5) % 360;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: 0,
              left: i * barWidth,
              width: barWidth * 0.8,
              height: barHeight,
              background: `linear-gradient(180deg, ${color}, hsl(${hue}, 100%, 50%))`,
              borderRadius: "2px 2px 0 0",
              opacity: 0.7,
              mixBlendMode: "screen",
            }}
          />
        );
      })}
    </div>
  );
};