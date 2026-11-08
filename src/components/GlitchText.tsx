import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import React, { useMemo } from "react";

interface WordData {
  word: string;
  start: number;
  end: number;
}

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

interface GlitchTextProps {
  words: WordData[];
  frame: number;
  fps: number;
  currentScene: SceneData | undefined;
  glitchIntensity: number;
}

// Glitch текстовые элементы - трендовые визуальные акценты поверх видео
export const GlitchText: React.FC<GlitchTextProps> = ({
  words,
  frame,
  fps,
  currentScene,
  glitchIntensity,
}) => {
  const currentWordIndex = useMemo(() => {
    return words.findIndex((w) => frame >= w.start && frame < w.end);
  }, [frame, words]);

  const currentWord = words[currentWordIndex];

  // Ключевые слова для глитч-эффектов (акцентные слова)
  const glitchWords = ["ТРЕНДОВЫЙ", "МОНТАЖ", "РЕЕЛС", "ШОРТС", "УДЕРЖАНИЕ", "ПРИЕМЫ", "ДИНАМИЧНЫЕ", "СТИЛЬНЫЕ", "ЗВУКОВЫЕ", "СТОКОВЫЕ", "БАЛАНС", "РЕЗУЛЬТАТ"];

  const isGlitchWord = currentWord && glitchWords.includes(currentWord.word.toUpperCase());

  // Глитч-слои для текущего слова
  const glitchLayers = isGlitchWord && currentWord ? (
    <>
      {/* RGB Split основное слово */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 120,
        }}
      >
        {["R", "G", "B"].map((channel, i) => {
          const shift = glitchIntensity * 8 * Math.sin(frame * 0.3 + i * 2);
          const opacity = 0.4 * glitchIntensity;

          return (
            <span
              key={channel}
              style={{
                position: "absolute",
                top: shift * (i === 1 ? 0 : 1),
                left: shift * (i === 0 ? 1 : -1),
                fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                fontSize: "72px",
                fontWeight: 800,
                lineHeight: 1.1,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color:
                  channel === "R"
                    ? "rgba(255, 0, 0, 0.6)"
                    : channel === "G"
                    ? "rgba(0, 255, 0, 0.6)"
                    : "rgba(0, 0, 255, 0.6)",
                mixBlendMode: "screen",
                opacity,
                filter: `blur(${glitchIntensity * 2}px)`,
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              {currentWord.word.toUpperCase()}
            </span>
          );
        })}

        {/* Основной текст поверх */}
        <span
          style={{
            position: "relative",
            display: "inline-block",
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            fontSize: "72px",
            fontWeight: 800,
            lineHeight: 1.1,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
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
            whiteSpace: "nowrap",
            filter: `drop-shadow(0 4px 8px rgba(0,245,255,0.6))`,
            animation: `glitchFlicker ${0.1 + glitchIntensity * 0.1}s ease-in-out infinite`,
          }}
        >
          {currentWord.word.toUpperCase()}
          <style jsx global>{`
            @keyframes glitchFlicker {
              0%, 90%, 100% { opacity: 1; }
              92% { opacity: 0.7; }
              94% { opacity: 1; }
              96% { opacity: 0.8; }
              98% { opacity: 1; }
            }
          `}</style>
        </span>
      </div>
    </>
  ) : null;

  // Фоновые глитч-слова (атмосфера)
  const ambientGlitchWords = useMemo(() => {
    if (glitchIntensity < 0.3) return [];

    const ambientWords = ["EDIT", "CUT", "SYNC", "BEAT", "FLOW", "VIBE", "VIRAL", "TREND"];
    return ambientWords.map((word, i) => {
      const baseX = (100 / (ambientWords.length + 1)) * (i + 1);
      const baseY = 20 + (i % 3) * 25;
      const speed = 0.3 + (i % 4) * 0.15;
      const delay = i * 0.2;

      return (
        <div
          key={word}
          style={{
            position: "absolute",
            top: `${baseY}%`,
            left: `${baseX}%`,
            transform: `translate(-50%, -50%) rotate(${(Math.sin(frame * 0.01 + delay) * 10 - 5)}deg)`,
            fontFamily: "'Space Grotesk', monospace",
            fontSize: "24px",
            fontWeight: 700,
            color: "#00F5FF",
            opacity: 0.15 * glitchIntensity,
            textShadow: "0 0 20px #00F5FF",
            pointerEvents: "none",
            zIndex: 30,
            whiteSpace: "nowrap",
            mixBlendMode: "screen",
            animation: `floatWord ${3 + i * 0.5}s ease-in-out infinite`,
          }}
        >
          {word}
        </div>
      );
    });
  }, [frame, glitchIntensity]);

  // Глитч-линии (scanlines) по экрану
  const scanlines = glitchIntensity > 0.2 ? (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 40,
        opacity: glitchIntensity * 0.3,
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 245, 255, 0.03) 2px,
          rgba(0, 245, 255, 0.03) 4px
        )`,
        animation: `scanlineMove ${2 / glitchIntensity}s linear infinite`,
      }}
    >
      <style jsx global>{`
        @keyframes scanlineMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
      `}</style>
    </div>
  ) : null;

  // Визуальный шум (film grain / digital noise)
  const noiseOverlay = glitchIntensity > 0.4 ? (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 35,
        opacity: glitchIntensity * 0.15,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        animation: `noiseShift 0.1s steps(10) infinite`,
      }}
    >
      <style jsx global>{`
        @keyframes noiseShift {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-5px, 3px); }
          20% { transform: translate(3px, -2px); }
          30% { transform: translate(-2px, -5px); }
          40% { transform: translate(5px, 2px); }
          50% { transform: translate(-3px, 5px); }
          60% { transform: translate(2px, -3px); }
          70% { transform: translate(-5px, -3px); }
          80% { transform: translate(3px, 2px); }
          90% { transform: translate(-2px, 5px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  ) : null;

  // Счетчик кадров/времени (debug style)
  const frameCounter = (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        fontFamily: "'Space Grotesk', monospace",
        fontSize: "16px",
        fontWeight: 500,
        color: "rgba(0, 245, 255, 0.4)",
        textShadow: "0 0 10px #00F5FF",
        pointerEvents: "none",
        zIndex: 200,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      FRAME: {frame.toString().padStart(4, "0")} | {currentScene?.name?.toUpperCase() || "INTRO"}
    </div>
  );

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      {noiseOverlay}
      {scanlines}
      {ambientGlitchWords}
      {glitchLayers}
      {frameCounter}
    </div>
  );
};

// Компонент для больших заголовков с глитч-эффектом (для титулов/хуков)
export const GlitchTitle: React.FC<{
  text: string;
  frame: number;
  fps: number;
  progress: number; // 0-1 появление
  intensity?: number;
  size?: number;
  position?: { x: number; y: number };
}> = ({ text, frame, fps, progress, intensity = 0.5, size = 80, position = { x: 50, y: 50 } }) => {
  const chars = text.split("");

  return (
    <div
      style={{
        position: "absolute",
        top: `${position.y}%`,
        left: `${position.x}%`,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 150,
        opacity: progress,
      }}
    >
      {/* RGB Split слои */}
      {["R", "G", "B"].map((channel, i) => (
        <div
          key={channel}
          style={{
            position: "absolute",
            top: intensity * 4 * Math.sin(frame * 0.2 + i) * (1 - progress * 0.5),
            left: intensity * 4 * Math.cos(frame * 0.2 + i) * (1 - progress * 0.5),
            display: "flex",
            gap: "2px",
          }}
        >
          {chars.map((char, j) => (
            <span
              key={j}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: `${size}px`,
                fontWeight: 800,
                color:
                  channel === "R"
                    ? "rgba(255, 0, 0, 0.7)"
                    : channel === "G"
                    ? "rgba(0, 255, 0, 0.7)"
                    : "rgba(0, 0, 255, 0.7)",
                mixBlendMode: "screen",
                textShadow: `0 0 ${intensity * 20}px ${channel === "R" ? "#FF0000" : channel === "G" ? "#00FF00" : "#0000FF"}`,
                animation: `charGlitch ${0.2 + j * 0.02}s ease-in-out infinite`,
              }}
            >
              {char}
            </span>
          ))}
        </div>
      ))}

      {/* Основной текст */}
      <div
        style={{
          position: "relative",
          display: "flex",
          gap: "2px",
        }}
      >
        {chars.map((char, j) => (
          <span
            key={j}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: `${size}px`,
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
              animation: `charReveal ${0.5 + j * 0.05}s cubic-bezier(0.34, 1.56, 0.64, 1) both`,
            }}
          >
            {char}
          </span>
        ))}
      </div>

      <style jsx global>{`
        @keyframes charGlitch {
          0%, 95%, 100% { transform: translateX(0); opacity: 1; }
          96% { transform: translateX(-2px); opacity: 0.8; }
          97% { transform: translateX(2px); opacity: 1; }
          98% { transform: translateX(-1px); opacity: 0.9; }
          99% { transform: translateX(0); opacity: 1; }
        }
        @keyframes charReveal {
          0% { opacity: 0; transform: translateY(50px) rotateX(90deg); }
          100% { opacity: 1; transform: translateY(0) rotateX(0); }
        }
      `}</style>
    </div>
  );
};