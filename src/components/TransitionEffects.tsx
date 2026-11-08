import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import React, { useMemo } from "react";

interface SceneData {
  id: number;
  name: string;
  startFrame: number;
  endFrame: number;
  bgType: string;
  transition: string;
  stockKeyword: string;
  glitchIntensity: number;
}

interface TransitionEffectsProps {
  currentScene: SceneData | undefined;
  sceneProgress: number;
  frame: number;
  fps: number;
  width: number;
  height: number;
  children: React.ReactNode;
}

export const TransitionEffects: React.FC<TransitionEffectsProps> = ({
  currentScene,
  sceneProgress,
  frame,
  fps,
  width,
  height,
  children,
}) => {
  // Определяем переход к следующей сцене
  const nextSceneStart = currentScene?.endFrame || 0;
  const framesToNextScene = nextSceneStart - frame;
  const isTransitioning = framesToNextScene >= 0 && framesToNextScene < 30; // 1 секунда до перехода

  const transitionProgress = isTransitioning
    ? interpolate(framesToNextScene, [30, 0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  const transitionType = currentScene?.transition || "cut";

  // Анимации для разных типов переходов
  const transitionStyles = useMemo(() => {
    if (!isTransitioning || transitionProgress === 0) return {};

    switch (transitionType) {
      case "zoom-slam":
        return {
          transform: `scale(${interpolate(transitionProgress, [0, 0.5, 1], [1, 1.5, 0])})`,
          filter: `blur(${interpolate(transitionProgress, [0, 0.5, 1], [0, 40, 0])}px)`,
          opacity: interpolate(transitionProgress, [0, 0.7, 1], [1, 0, 0]),
        };

      case "whip-pan":
        return {
          transform: `translateX(${interpolate(transitionProgress, [0, 1], [0, width * 2])}px) rotate(${interpolate(transitionProgress, [0, 1], [0, 90])}deg)`,
          filter: `blur(${interpolate(transitionProgress, [0.3, 1], [0, 60])}px)`,
          opacity: interpolate(transitionProgress, [0, 0.5, 1], [1, 1, 0]),
        };

      case "match-cut":
        return {
          transform: `scale(${interpolate(transitionProgress, [0, 1], [1, 0.8])})`,
          filter: `contrast(${interpolate(transitionProgress, [0, 1], [1, 2])}) brightness(${interpolate(transitionProgress, [0, 1], [1, 1.5])})`,
          opacity: 1,
        };

      case "glitch-cut":
        return {
          transform: `translateX(${Math.sin(transitionProgress * 50) * 20 * (1 - transitionProgress)}px) translateY(${Math.cos(transitionProgress * 40) * 15 * (1 - transitionProgress)}px) scale(${1 + Math.sin(transitionProgress * 30) * 0.1 * (1 - transitionProgress)})`,
          filter: `hue-rotate(${transitionProgress * 360}deg) contrast(${1 + transitionProgress})`,
          opacity: 1,
        };

      case "speed-ramp":
        return {
          filter: `blur(${interpolate(transitionProgress, [0, 0.5, 1], [0, 30, 0])}px)`,
          transform: `scale(${interpolate(transitionProgress, [0, 0.5, 1], [1, 1.2, 1])})`,
          opacity: 1,
        };

      case "zoom-out-fade":
        return {
          transform: `scale(${interpolate(transitionProgress, [0, 1], [1, 0.5])})`,
          opacity: interpolate(transitionProgress, [0, 1], [1, 0]),
          filter: `blur(${interpolate(transitionProgress, [0.5, 1], [0, 20])}px)`,
        };

      default:
        return { opacity: 1 };
    }
  }, [transitionType, transitionProgress, width, height]);

  // Глитч-эффект на границе сцен
  const glitchOverlay = isTransitioning && transitionType === "glitch-cut" ? (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        pointerEvents: "none",
        zIndex: 200,
        overflow: "hidden",
      }}
    >
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: (height / 10) * i,
            left: Math.sin(transitionProgress * 20 + i) * width * 0.1 * transitionProgress,
            width: "100%",
            height: height / 10,
            background: `rgba(255, 255, 255, ${transitionProgress * 0.1})`,
            mixBlendMode: "difference",
            filter: `hue-rotate(${transitionProgress * 720 + i * 36}deg)`,
          }}
        />
      ))}
    </div>
  ) : null;

  // Вспышка при переходе (flash)
  const flashOverlay = isTransitioning && transitionProgress > 0.4 && transitionProgress < 0.6 ? (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        background: "white",
        opacity: interpolate(transitionProgress, [0.4, 0.5, 0.6], [0, 0.8, 0]),
        pointerEvents: "none",
        zIndex: 150,
        mixBlendMode: "screen",
      }}
    />
  ) : null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        overflow: "hidden",
        ...transitionStyles,
      }}
    >
      {children}
      {glitchOverlay}
      {flashOverlay}

      {/* RGB Shift на переходах */}
      {isTransitioning && transitionProgress > 0.3 && (
        <RGBShiftOverlay
          intensity={transitionProgress}
          frame={frame}
          width={width}
          height={height}
        />
      )}
    </div>
  );
};

// RGB Shift эффект для переходов
const RGBShiftOverlay: React.FC<{ intensity: number; frame: number; width: number; height: number }> = ({
  intensity,
  frame,
  width,
  height,
}) => {
  const shiftAmount = intensity * 20;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        pointerEvents: "none",
        zIndex: 180,
        overflow: "hidden",
      }}
    >
      {/* Красный канал */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: shiftAmount * Math.sin(frame * 0.5),
          width,
          height,
          background: "rgba(255, 0, 0, 0.3)",
          mixBlendMode: "screen",
          opacity: intensity,
        }}
      />
      {/* Синий канал */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: -shiftAmount * Math.cos(frame * 0.5),
          width,
          height,
          background: "rgba(0, 0, 255, 0.3)",
          mixBlendMode: "screen",
          opacity: intensity,
        }}
      />
      {/* Зеленый канал - основной */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width,
          height,
          background: "rgba(0, 255, 0, 0.1)",
          mixBlendMode: "screen",
          opacity: intensity * 0.5,
        }}
      />
    </div>
  );
};

// Компонент для плавного входа/выхода сцены (внутри сцены)
export const SceneEntrance: React.FC<{
  progress: number;
  children: React.ReactNode;
  type?: "fade" | "slide-up" | "slide-down" | "zoom" | "flip" | "reveal";
  direction?: "up" | "down" | "left" | "right";
}> = ({ progress, children, type = "fade", direction = "up" }) => {
  const styles = {
    fade: {
      opacity: progress,
    },
    "slide-up": {
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0, 1], [50, 0])}px)`,
    },
    "slide-down": {
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0, 1], [-50, 0])}px)`,
    },
    zoom: {
      opacity: progress,
      transform: `scale(${interpolate(progress, [0, 1], [0.5, 1])})`,
    },
    flip: {
      opacity: progress,
      transform: `rotateX(${interpolate(progress, [0, 1], [90, 0])}deg)`,
      transformOrigin: "center",
    },
    reveal: {
      opacity: 1,
      clipPath: `inset(${interpolate(progress, [0, 1], [100, 0])}% 0 0 0)`,
    },
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        ...styles[type],
        willChange: "transform, opacity, clip-path",
      }}
    >
      {children}
    </div>
  );
};

// Маска для ревеал-эффектов
export const RevealMask: React.FC<{
  progress: number;
  direction?: "left" | "right" | "top" | "bottom" | "center";
  children: React.ReactNode;
}> = ({ progress, direction = "left", children }) => {
  const clipPaths = {
    left: `inset(0 ${interpolate(progress, [0, 1], [100, 0])}% 0 0)`,
    right: `inset(0 0 0 ${interpolate(progress, [0, 1], [100, 0])}%)`,
    top: `inset(${interpolate(progress, [0, 1], [100, 0])}% 0 0 0)`,
    bottom: `inset(0 0 ${interpolate(progress, [0, 1], [100, 0])}% 0)`,
    center: `inset(${interpolate(progress, [0, 1], [50, 0])}% ${interpolate(progress, [0, 1], [50, 0])}% ${interpolate(progress, [0, 1], [50, 0])}% ${interpolate(progress, [0, 1], [50, 0])}%)`,
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        clipPath: clipPaths[direction],
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};