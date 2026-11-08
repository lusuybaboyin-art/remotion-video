import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import React, { useMemo } from "react";

interface WordData {
  word: string;
  start: number;
  end: number;
}

interface WordSubtitlesProps {
  words: WordData[];
  frame: number;
  fps: number;
  width: number;
  height: number;
}

export const WordSubtitles: React.FC<WordSubtitlesProps> = ({
  words,
  frame,
  fps,
  width,
  height,
}) => {
  // Находим текущее слово
  const currentWordIndex = useMemo(() => {
    return words.findIndex((w) => frame >= w.start && frame < w.end);
  }, [frame, words]);

  const currentWord = words[currentWordIndex];

  // Рендерим все слова, но подсвечиваем текущее
  const wordElements = useMemo(() => {
    return words.map((wordData, index) => {
      const isActive = index === currentWordIndex;
      const isPast = index < currentWordIndex;
      const isFuture = index > currentWordIndex;

      // Анимация появления слова
      const wordProgress = interpolate(frame, [wordData.start, wordData.end], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

      // Spring анимация для активного слова
      const activeScale = spring({
        frame: frame - wordData.start,
        fps,
        config: { damping: 12, stiffness: 180 },
      });

      const activeRotation = spring({
        frame: frame - wordData.start,
        fps,
        config: { damping: 15, stiffness: 200 },
      });

      // Позиция слова (центрированное, с наложением)
      const baseY = height * 0.75;
      const wordWidth = wordData.word.length * 42; // приблизительная ширина

      // Эффект "typewriter" - слова накапливаются
      let xOffset = 0;
      if (isActive) {
        // Активное слово в центре с пульсацией
        xOffset = interpolate(activeScale, [0, 1, 1.2], [-50, 0, 20]);
      } else if (isPast) {
        // Прошедшие слова уходят вверх/вбок с затуханием
        const pastProgress = interpolate(frame, [wordData.end, wordData.end + 30], [0, 1], {
          extrapolateRight: "clamp",
        });
        xOffset = interpolate(pastProgress, [0, 1], [0, -width * 0.6]);
      }

      const opacity = isActive
        ? 1
        : isPast
        ? interpolate(frame, [wordData.end, wordData.end + 40], [1, 0], {
            extrapolateRight: "clamp",
          })
        : 0;

      const scale = isActive ? activeScale : isPast ? 0.9 : 0;
      const rotation = isActive ? interpolate(activeRotation, [0, 1], [-3, 3]) : 0;

      // Цветовая схема в стиле трендовых Reels
      const colors = {
        active: "#FFFFFF",
        activeStroke: "#00F5FF",
        past: "rgba(255, 255, 255, 0.6)",
        pastStroke: "rgba(0, 245, 255, 0.4)",
        future: "rgba(255, 255, 255, 0.15)",
      };

      return (
        <div
          key={index}
          style={{
            position: "absolute",
            left: "50%",
            top: baseY,
            transform: `translate(-50%, -50%) translateX(${xOffset}px) scale(${scale}) rotate(${rotation}deg)`,
            opacity,
            pointerEvents: "none",
            zIndex: isActive ? 100 : 50,
            transition: "none",
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', 'Inter', sans-serif",
              fontSize: "52px",
              fontWeight: 800,
              lineHeight: 1.1,
              color: colors.active,
              textShadow: isActive
                ? `
                  0 0 20px ${colors.activeStroke},
                  0 0 40px ${colors.activeStroke},
                  0 0 60px ${colors.activeStroke},
                  2px 2px 0px #000,
                  -2px -2px 0px #000,
                  2px -2px 0px #000,
                  -2px 2px 0px #000
                `
                : isPast
                ? `
                  0 0 10px ${colors.pastStroke},
                  1px 1px 0px #000
                `
                : "1px 1px 0px #000",
              whiteSpace: "nowrap",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              background: isActive
                ? "linear-gradient(135deg, #00F5FF 0%, #FF00F5 50%, #FFD700 100%)"
                : "transparent",
              backgroundClip: isActive ? "text" : "initial",
              WebkitBackgroundClip: isActive ? "text" : "initial",
              WebkitTextFillColor: isActive ? "transparent" : colors.active,
              filter: isActive ? "drop-shadow(0 4px 8px rgba(0,245,255,0.4))" : "none",
            }}
          >
            {wordData.word}
          </span>

          {/* Подсвечивающий бар под активным словом */}
          {isActive && (
            <div
              style={{
                position: "absolute",
                bottom: "-8px",
                left: "50%",
                transform: "translateX(-50%)",
                width: `${Math.min(wordWidth + 40, width * 0.8)}px`,
                height: "4px",
                background: "linear-gradient(90deg, #00F5FF, #FF00F5, #FFD700)",
                borderRadius: "2px",
                boxShadow: "0 0 20px #00F5FF, 0 0 40px #FF00F5",
                animation: "pulse 0.3s ease-in-out infinite alternate",
              }}
            />
          )}
        </div>
      );
    });
  }, [words, frame, fps, width, height, currentWordIndex]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 0.8; transform: translateX(-50%) scaleX(0.9); }
          100% { opacity: 1; transform: translateX(-50%) scaleX(1.05); }
        }
      `}</style>
      {wordElements}
    </div>
  );
};

// Дополнительный компонент для "караоке" стиля - по буквам
export const KaraokeSubtitles: React.FC<WordSubtitlesProps> = ({
  words,
  frame,
  fps,
  width,
  height,
}) => {
  const currentWordIndex = useMemo(() => {
    return words.findIndex((w) => frame >= w.start && frame < w.end);
  }, [frame, words]);

  const currentWord = words[currentWordIndex];

  if (!currentWord) return null;

  const wordProgress = interpolate(frame, [currentWord.start, currentWord.end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Анимация по буквам
  const letters = currentWord.word.split("");
  const letterDuration = 1 / letters.length;

  return (
    <div
      style={{
        position: "absolute",
        bottom: height * 0.2,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "4px",
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      {letters.map((letter, i) => {
        const letterStart = i * letterDuration;
        const letterEnd = (i + 1) * letterDuration;
        const letterProgress = interpolate(wordProgress, [letterStart, letterEnd], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const letterScale = spring({
          frame: letterProgress * 30,
          fps: 30,
          config: { damping: 10, stiffness: 200 },
        });

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "56px",
              fontWeight: 800,
              color: "#fff",
              textShadow: `
                0 0 30px #00F5FF,
                0 0 60px #00F5FF,
                2px 2px 0px #000,
              `,
              transform: `scale(${letterScale})`,
              transformOrigin: "bottom center",
              background: letterProgress > 0.5
                ? "linear-gradient(135deg, #00F5FF, #FF00F5)"
                : "transparent",
              backgroundClip: letterProgress > 0.5 ? "text" : "initial",
              WebkitBackgroundClip: letterProgress > 0.5 ? "text" : "initial",
              WebkitTextFillColor: letterProgress > 0.5 ? "transparent" : "#fff",
            }}
          >
            {letter}
          </span>
        );
      })}
    </div>
  );
};