import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import React, { useMemo } from "react";

interface StockFootageProps {
  keyword: string;
  progress: number;
  frame: number;
  fps: number;
  width: number;
  height: number;
}

// Программно генерируемые "стоковые" визуалы в стиле трендовых Reels
// В реальном проекте здесь использовались бы реальные видеофайлы из public/video/
const generateStockVisuals = (keyword: string, progress: number, frame: number, fps: number, width: number, height: number) => {
  const visuals = [];

  // Разные визуальные темы в зависимости от ключевого слова
  const themes: Record<string, React.ReactNode> = {
    "tech abstract": (
      <TechAbstractGrid progress={progress} frame={frame} fps={fps} width={width} height={height} />
    ),
    "fast motion blur": (
      <MotionBlurLines progress={progress} frame={frame} fps={fps} width={width} height={height} />
    ),
    "editing timeline": (
      <EditingTimeline progress={progress} frame={frame} fps={fps} width={width} height={height} />
    ),
    "typography animation": (
      <TypographyAnimation progress={progress} frame={frame} fps={fps} width={width} height={height} />
    ),
    "sound waves visualization": (
      <SoundWaves progress={progress} frame={frame} fps={fps} width={width} height={height} />
    ),
    "success celebration": (
      <SuccessParticles progress={progress} frame={frame} fps={fps} width={width} height={height} />
    ),
    "abstract": (
      <AbstractShapes progress={progress} frame={frame} fps={fps} width={width} height={height} />
    ),
  };

  return themes[keyword] || themes["abstract"];
};

// Технологичная абстрактная сетка
const TechAbstractGrid: React.FC<{ progress: number; frame: number; fps: number; width: number; height: number }> = ({
  progress,
  frame,
  fps,
  width,
  height,
}) => {
  const gridSize = 15;
  const cells = useMemo(() => {
    const arr = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const delay = (i + j) * 0.02;
        const cellProgress = interpolate(progress, [delay, delay + 0.5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        arr.push({ i, j, cellProgress, delay });
      }
    }
    return arr;
  }, [progress]);

  const rotation = interpolate(frame, [0, 900], [0, 180], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "center",
        opacity: interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]),
      }}
    >
      {cells.map(({ i, j, cellProgress }) => {
        const x = (width / gridSize) * j;
        const y = (height / gridSize) * i;
        const size = interpolate(cellProgress, [0, 1], [0, width / gridSize * 1.5]);

        return (
          <div
            key={`${i}-${j}`}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              transform: `translate(-50%, -50%) rotate(${cellProgress * 45}deg)`,
              transformOrigin: "center",
              background: `linear-gradient(135deg,
                rgba(0, 245, 255, ${cellProgress * 0.3}) 0%,
                rgba(255, 0, 245, ${cellProgress * 0.2}) 50%,
                rgba(255, 215, 0, ${cellProgress * 0.1}) 100%
              )`,
              border: `1px solid rgba(0, 245, 255, ${cellProgress * 0.5})`,
              borderRadius: "4px",
              boxShadow: `
                0 0 ${cellProgress * 20}px rgba(0, 245, 255, ${cellProgress * 0.5}),
                inset 0 0 ${cellProgress * 10}px rgba(255, 255, 255, ${cellProgress * 0.1})
              `,
              opacity: cellProgress,
            }}
          />
        );
      })}
    </div>
  );
};

// Линии размытия в движении (motion blur)
const MotionBlurLines: React.FC<{ progress: number; frame: number; fps: number; width: number; height: number }> = ({
  progress,
  frame,
  fps,
  width,
  height,
}) => {
  const lineCount = 12;
  const lines = useMemo(() => {
    const arr = [];
    for (let i = 0; i < lineCount; i++) {
      const phase = (i / lineCount) * Math.PI * 2;
      const speed = 0.5 + (i % 3) * 0.3;
      arr.push({ i, phase, speed });
    }
    return arr;
  }, []);

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width, height, overflow: "hidden" }}>
      {lines.map(({ i, phase, speed }) => {
        const y = interpolate(
          (frame / fps + phase * speed) % 2,
          [0, 1, 2],
          [-height * 0.5, height * 0.5, height * 1.5],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const opacity = Math.sin((frame / fps) * speed * 2 + phase) * 0.3 + 0.4;
        const lineHeight = interpolate(Math.sin((frame / fps) * 3 + phase), [-1, 1], [2, 80]);
        const blur = interpolate(Math.sin((frame / fps) * 2 + phase), [-1, 1], [10, 60]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: y,
              width,
              height: lineHeight,
              background: `linear-gradient(90deg,
                transparent 0%,
                rgba(0, 245, 255, ${opacity}) 20%,
                rgba(255, 0, 245, ${opacity}) 50%,
                rgba(255, 215, 0, ${opacity}) 80%,
                transparent 100%
              )`,
              filter: `blur(${blur}px)`,
              opacity: progress,
              mixBlendMode: "screen",
            }}
          />
        );
      })}
    </div>
  );
};

// Таймлайн монтажа (визуализация редактирования)
const EditingTimeline: React.FC<{ progress: number; frame: number; fps: number; width: number; height: number }> = ({
  progress,
  frame,
  fps,
  width,
  height,
}) => {
  const trackCount = 4;
  const clipCount = 8;

  return (
    <div
      style={{
        position: "absolute",
        bottom: height * 0.1,
        left: "50%",
        transform: "translateX(-50%)",
        width: width * 0.9,
        height: height * 0.3,
        opacity: interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
      }}
    >
      {[...Array(trackCount)].map((_, trackIndex) => (
        <div
          key={trackIndex}
          style={{
            position: "absolute",
            top: (height * 0.3 / trackCount) * trackIndex,
            left: 0,
            width: "100%",
            height: height * 0.3 / trackCount * 0.7,
            display: "flex",
            gap: "8px",
          }}
        >
          {[...Array(clipCount)].map((_, clipIndex) => {
            const clipWidth = (width * 0.9 / clipCount) * (0.6 + Math.random() * 0.4);
            const clipDelay = (trackIndex * clipCount + clipIndex) * 0.03;
            const clipProgress = interpolate(progress, [clipDelay, clipDelay + 0.4], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            const colors = [
              "linear-gradient(90deg, #00F5FF, #0099FF)",
              "linear-gradient(90deg, #FF00F5, #FF0099)",
              "linear-gradient(90deg, #FFD700, #FFA500)",
              "linear-gradient(90deg, #00FF88, #00CC66)",
            ];

            return (
              <div
                key={clipIndex}
                style={{
                  width: clipWidth,
                  height: "100%",
                  background: colors[trackIndex % colors.length],
                  borderRadius: "6px",
                  transform: `scaleX(${clipProgress})`,
                  transformOrigin: "left center",
                  boxShadow: `
                    0 0 20px ${colors[trackIndex % colors.length].match(/#[0-9A-F]{6}/)?.[0] || "#00F5FF"},
                    inset 0 1px 0 rgba(255,255,255,0.2)
                  `,
                  opacity: clipProgress,
                  animation: `timelinePulse ${1 + trackIndex * 0.2}s ease-in-out infinite`,
                }}
              />
            );
          })}
        </div>
      ))}
      <style jsx global>{`
        @keyframes timelinePulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }
      `}</style>
    </div>
  );
};

// Анимация типографики
const TypographyAnimation: React.FC<{ progress: number; frame: number; fps: number; width: number; height: number }> = ({
  progress,
  frame,
  fps,
  width,
  height,
}) => {
  const words = ["MONTAGE", "STYLE", "TREND", "VIRAL", "REELS", "SHORTS", "EDIT", "PRO"];
  const floatingWords = useMemo(() => {
    return words.map((word, i) => ({
      word,
      x: (width / (words.length + 1)) * (i + 1),
      y: height * (0.2 + (i % 3) * 0.25),
      delay: i * 0.08,
      speed: 0.5 + (i % 4) * 0.2,
      rotation: (i % 2 === 0 ? 1 : -1) * 15,
    }));
  }, [width, height]);

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width, height, opacity: progress }}>
      {floatingWords.map(({ word, x, y, delay, speed, rotation }) => {
        const wordProgress = interpolate(progress, [delay, delay + 0.6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const floatY = Math.sin((frame / fps) * speed + delay * 10) * 30;
        const floatX = Math.cos((frame / fps) * speed * 0.7 + delay * 10) * 20;
        const scale = interpolate(wordProgress, [0, 0.5, 1], [0, 1.2, 1]);
        const rot = interpolate(wordProgress, [0, 1], [-rotation, rotation]);

        return (
          <div
            key={word}
            style={{
              position: "absolute",
              left: x + floatX,
              top: y + floatY,
              transform: `translate(-50%, -50%) scale(${scale}) rotate(${rot}deg)`,
              transformOrigin: "center",
              fontFamily: "'Space Grotesk', 'Inter', sans-serif",
              fontSize: "48px",
              fontWeight: 800,
              color: "#fff",
              textShadow: `
                0 0 30px #00F5FF,
                0 0 60px #00F5FF,
                3px 3px 0px #000,
              `,
              background: "linear-gradient(135deg, #00F5FF, #FF00F5, #FFD700)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              opacity: wordProgress,
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {word}
          </div>
        );
      })}
    </div>
  );
};

// Визуализация звуковых волн
const SoundWaves: React.FC<{ progress: number; frame: number; fps: number; width: number; height: number }> = ({
  progress,
  frame,
  fps,
  width,
  height,
}) => {
  const barCount = 32;
  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        opacity: interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]),
      }}
    >
      {[...Array(barCount)].map((_, i) => {
        const angle = (i / barCount) * Math.PI * 2;
        const baseRadius = Math.min(width, height) * 0.15;
        const amplitude = Math.min(width, height) * 0.35;

        // Частота зависит от индекса для создания формы
        const frequency = 1 + (i % 4);
        const phase = (frame / fps) * 4 + i * 0.3;
        const waveHeight = Math.sin(phase * frequency) * 0.5 + 0.5;
        const radius = baseRadius + waveHeight * amplitude * progress;

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const barLength = waveHeight * 80 + 20;
        const barWidth = Math.max(2, (Math.PI * 2 * radius) / barCount * 0.8);

        const hue = (frame * 0.5 + i * 10) % 360;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: barWidth,
              height: barLength,
              transform: `translate(-50%, -100%) rotate(${angle}rad)`,
              transformOrigin: "bottom center",
              background: `linear-gradient(180deg, hsl(${hue}, 100%, 60%), hsl(${(hue + 60) % 360}, 100%, 50%))`,
              borderRadius: "4px 4px 0 0",
              boxShadow: `0 0 20px hsl(${hue}, 100%, 60%), 0 0 40px hsl(${hue}, 100%, 60%)`,
              opacity: progress * (0.5 + waveHeight * 0.5),
              mixBlendMode: "screen",
            }}
          />
        );
      })}
    </div>
  );
};

// Частицы успеха для аутро
const SuccessParticles: React.FC<{ progress: number; frame: number; fps: number; width: number; height: number }> = ({
  progress,
  frame,
  fps,
  width,
  height,
}) => {
  const particleCount = 50;
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < particleCount; i++) {
      arr.push({
        i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: 4 + Math.random() * 12,
        speed: 0.5 + Math.random() * 2,
        angle: Math.random() * Math.PI * 2,
        color: [`#00F5FF`, `#FF00F5`, `#FFD700`, `#00FF88`][Math.floor(Math.random() * 4)],
        delay: Math.random() * 0.5,
      });
    }
    return arr;
  }, [width, height]);

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width, height, opacity: progress }}>
      {particles.map(({ i, x, y, size, speed, angle, color, delay }) => {
        const particleProgress = interpolate(progress, [delay, delay + 0.8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const currentX = x + Math.cos(angle) * (frame / fps) * speed * 100 * particleProgress;
        const currentY = y - Math.sin(angle) * (frame / fps) * speed * 100 * particleProgress - (frame / fps) * 50 * particleProgress;
        const scale = spring({
          frame: particleProgress * 60,
          fps: 60,
          config: { damping: 10, stiffness: 150 },
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: currentX,
              top: currentY,
              width: size * scale,
              height: size * scale,
              background: color,
              borderRadius: "50%",
              transform: `translate(-50%, -50%) scale(${scale})`,
              boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}`,
              opacity: particleProgress * (1 - particleProgress * 0.5),
              mixBlendMode: "screen",
            }}
          />
        );
      })}
    </div>
  );
};

// Абстрактные фигуры (fallback)
const AbstractShapes: React.FC<{ progress: number; frame: number; fps: number; width: number; height: number }> = ({
  progress,
  frame,
  fps,
  width,
  height,
}) => {
  const shapes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 8; i++) {
      arr.push({
        i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: 50 + Math.random() * 200,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        type: Math.random() > 0.5 ? "circle" : "square",
        color: [`rgba(0, 245, 255, 0.3)`, `rgba(255, 0, 245, 0.3)`, `rgba(255, 215, 0, 0.3)`][Math.floor(Math.random() * 3)],
        borderColor: [`#00F5FF`, `#FF00F5`, `#FFD700`][Math.floor(Math.random() * 3)],
      });
    }
    return arr;
  }, [width, height]);

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width, height, opacity: progress }}>
      {shapes.map(({ i, x, y, size, rotation, rotationSpeed, type, color, borderColor }) => {
        const currentRotation = rotation + (frame / fps) * rotationSpeed * 30;
        const pulseScale = 0.8 + Math.sin((frame / fps) * 2 + i) * 0.2;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size * pulseScale,
              height: size * pulseScale,
              transform: `translate(-50%, -50%) rotate(${currentRotation}deg)`,
              background: color,
              border: `2px solid ${borderColor}`,
              borderRadius: type === "circle" ? "50%" : "12px",
              boxShadow: `0 0 40px ${borderColor}`,
              mixBlendMode: "screen",
            }}
          />
        );
      })}
    </div>
  );
};

export const StockFootage: React.FC<StockFootageProps> = ({
  keyword,
  progress,
  frame,
  fps,
  width,
  height,
}) => {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width, height, overflow: "hidden" }}>
      {generateStockVisuals(keyword, progress, frame, fps, width, height)}
    </div>
  );
};