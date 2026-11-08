import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import React, { useMemo } from "react";

interface DynamicBackgroundProps {
  type: string;
  progress: number;
  frame: number;
  fps: number;
  glitchIntensity: number;
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  type,
  progress,
  frame,
  fps,
  glitchIntensity,
}) => {
  const { width, height } = useVideoConfig();

  // Базовый градиентный фон (всегда присутствует)
  const baseGradient = (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        background: `
          radial-gradient(ellipse at 20% 20%, rgba(0, 245, 255, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, rgba(255, 0, 245, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 60%),
          linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0f0a1a 100%)
        `,
        zIndex: 0,
      }}
    />
  );

  // Анимированный пульсирующий градиент
  const gradientPulse = (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        zIndex: 5,
        opacity: progress,
      }}
    >
      {[1, 2, 3].map((layer) => (
        <div
          key={layer}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: interpolate(frame / fps, [0, 10, 20], [width * 0.5, width * 1.5, width * 0.8]),
            height: interpolate(frame / fps, [0, 10, 20], [width * 0.5, width * 1.5, width * 0.8]),
            borderRadius: "50%",
            background: `radial-gradient(circle, ${[
              "rgba(0, 245, 255, 0.08)",
              "rgba(255, 0, 245, 0.06)",
              "rgba(255, 215, 0, 0.05)",
            ][layer - 1]} 0%, transparent 70%)`,
            animation: `pulseRing ${8 + layer * 2}s ease-in-out infinite`,
            opacity: 0.5 + layer * 0.1,
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes pulseRing {
          0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
        }
      `}</style>
    </div>
  );

  // Частицы на фоне
  const particles = (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        zIndex: 10,
        opacity: progress,
        pointerEvents: "none",
      }}
    >
      {[...Array(30)].map((_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const radius = Math.min(width, height) * (0.3 + Math.random() * 0.4);
        const speed = 0.05 + Math.random() * 0.15;
        const size = 2 + Math.random() * 6;
        const color = ["#00F5FF", "#FF00F5", "#FFD700", "#00FF88"][Math.floor(Math.random() * 4)];

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: height / 2 + Math.sin(frame / fps * speed * 2 * Math.PI + angle) * radius,
              left: width / 2 + Math.cos(frame / fps * speed * 2 * Math.PI + angle) * radius,
              width: size,
              height: size,
              background: color,
              borderRadius: "50%",
              boxShadow: `0 0 ${size * 3}px ${color}`,
              opacity: 0.4 + Math.random() * 0.4,
              transform: "translate(-50%, -50%)",
              mixBlendMode: "screen",
            }}
          />
        );
      })}
    </div>
  );

  // Сетка линий (grid lines)
  const gridLines = (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        zIndex: 15,
        opacity: progress,
        pointerEvents: "none",
      }}
    >
      {/* Вертикальные линии */}
      {[...Array(10)].map((_, i) => (
        <div
          key={`v-${i}`}
          style={{
            position: "absolute",
            left: (width / 10) * i,
            top: 0,
            width: 1,
            height,
            background: `linear-gradient(180deg, transparent, rgba(0, 245, 255, 0.3), transparent)`,
            transform: `translateX(${Math.sin(frame / fps * 0.5 + i) * 20}px)`,
            opacity: 0.3,
          }}
        />
      ))}
      {/* Горизонтальные линии */}
      {[...Array(10)].map((_, i) => (
        <div
          key={`h-${i}`}
          style={{
            position: "absolute",
            top: (height / 10) * i,
            left: 0,
            width,
            height: 1,
            background: `linear-gradient(90deg, transparent, rgba(255, 0, 245, 0.3), transparent)`,
            transform: `translateY(${Math.cos(frame / fps * 0.5 + i) * 20}px)`,
            opacity: 0.3,
          }}
        />
      ))}
    </div>
  );

  // RGB Shift фон
  const rgbShift = (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        zIndex: 20,
        opacity: progress * glitchIntensity,
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: glitchIntensity * 5 * Math.sin(frame / fps * 2),
          left: glitchIntensity * 5 * Math.cos(frame / fps * 2),
          width,
          height,
          background: "rgba(255, 0, 0, 0.1)",
          mixBlendMode: "screen",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -glitchIntensity * 5 * Math.sin(frame / fps * 2),
          left: -glitchIntensity * 5 * Math.cos(frame / fps * 2),
          width,
          height,
          background: "rgba(0, 0, 255, 0.1)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );

  // Неоновые следы
  const neonTrails = (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        zIndex: 25,
        opacity: progress,
        pointerEvents: "none",
      }}
    >
      {[...Array(5)].map((_, i) => {
        const trailCount = 20;
        return (
          <div key={i} style={{ position: "absolute", top: 0, left: 0, width, height }}>
            {[...Array(trailCount)].map((_, j) => {
              const progressAlongTrail = (frame / fps * (0.3 + i * 0.1) + j / trailCount) % 1;
              const x = progressAlongTrail * width;
              const y = height * (0.2 + i * 0.15) + Math.sin(progressAlongTrail * Math.PI * 4 + i) * 50;
              const trailWidth = 100 + Math.sin(progressAlongTrail * Math.PI * 2) * 50;
              const hue = (frame * 0.5 + i * 60 + j * 10) % 360;

              return (
                <div
                  key={j}
                  style={{
                    position: "absolute",
                    top: y,
                    left: x - trailWidth / 2,
                    width: trailWidth,
                    height: 2,
                    background: `linear-gradient(90deg, transparent, hsl(${hue}, 100%, 60%), transparent)`,
                    borderRadius: "1px",
                    opacity: 0.5 * (1 - Math.abs(progressAlongTrail - 0.5) * 2),
                    filter: `blur(1px)`,
                    mixBlendMode: "screen",
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );

  // Выбираем фон в зависимости от типа
  const backgroundMap: Record<string, React.ReactNode> = {
    "gradient-pulse": <> {baseGradient} {gradientPulse} {particles} </>,
    particles: <> {baseGradient} {particles} {gridLines} </>,
    "grid-lines": <> {baseGradient} {gridLines} {particles} </>,
    "rgb-shift": <> {baseGradient} {rgbShift} {gradientPulse} </>,
    "neon-trails": <> {baseGradient} {neonTrails} {particles} </>,
  };

  const selectedBackground = backgroundMap[type] || backgroundMap["gradient-pulse"];

  // Виньетка по краям (всегда сверху)
  const vignette = (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        pointerEvents: "none",
        zIndex: 100,
        background: `
          radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%),
          linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.3) 100%)
        `,
        mixBlendMode: "multiply",
      }}
    />
  );

  // Фильмовое зерно (всегда сверху)
  const filmGrain = (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        pointerEvents: "none",
        zIndex: 101,
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        animation: "grainShift 0.15s steps(20) infinite",
      }}
    >
      <style jsx global>{`
        @keyframes grainShift {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-2px, 1px); }
          50% { transform: translate(1px, -2px); }
          75% { transform: translate(-1px, 2px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width, height, overflow: "hidden" }}>
      {selectedBackground}
      {vignette}
      {filmGrain}
    </div>
  );
};

// Дополнительные фоновые эффекты для специфических нужд

// Параллакс-слои для глубины
export const ParallaxLayers: React.FC<{
  frame: number;
  fps: number;
  width: number;
  height: number;
  layers: Array<{ color: string; speed: number; opacity: number; blur?: number }>;
}> = ({ frame, fps, width, height, layers }) => {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width, height, overflow: "hidden" }}>
      {layers.map((layer, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: (frame / fps) * layer.speed * 50 % width - width,
            width: width * 2,
            height,
            background: layer.color,
            opacity: layer.opacity,
            filter: `blur(${layer.blur || 0}px)`,
            transform: `translateX(${Math.sin(frame / fps * 0.5 + i) * 30}px)`,
            mixBlendMode: "screen",
          }}
        />
      ))}
    </div>
  );
};

// Градиентный орб (трендовый фоновый элемент)
export const GradientOrb: React.FC<{
  frame: number;
  fps: number;
  width: number;
  height: number;
  x: number; // 0-1
  y: number; // 0-1
  size: number; // 0-1 relative to min(width,height)
  colors: string[];
  intensity: number;
}> = ({ frame, fps, width, height, x, y, size, colors, intensity }) => {
  const orbSize = Math.min(width, height) * size;
  const posX = width * x + Math.sin(frame / fps * 0.3) * 50;
  const posY = height * y + Math.cos(frame / fps * 0.3) * 50;

  return (
    <div
      style={{
        position: "absolute",
        top: posY - orbSize / 2,
        left: posX - orbSize / 2,
        width: orbSize,
        height: orbSize,
        borderRadius: "50%",
        background: `radial-gradient(circle at 30% 30%, ${colors[0]} 0%, ${colors[1]} 50%, transparent 70%)`,
        opacity: intensity * 0.3,
        filter: "blur(60px)",
        mixBlendMode: "screen",
        pointerEvents: "none",
        animation: `orbFloat ${8 + Math.random() * 4}s ease-in-out infinite`,
      }}
    >
      <style jsx global>{`
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -15px) scale(1.05); }
          50% { transform: translate(-10px, 20px) scale(0.95); }
          75% { transform: translate(15px, 10px) scale(1.02); }
        }
      `}</style>
    </div>
  );
};