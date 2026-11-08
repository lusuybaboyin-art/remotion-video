@echo off
echo ========================================
echo Remotion Video Render Script
echo ========================================
echo.

echo [1/3] Installing dependencies...
npm install

echo.
echo [2/3] Building project...
npm run build

echo.
echo [3/3] Rendering video (this may take a while)...
echo Rendering at half scale for faster preview...
npx remotion render --scale=0.5 MainVideo out/preview.mp4

echo.
echo ========================================
echo Preview rendered to: out/preview.mp4
echo ========================================
echo.
echo For full quality render, run:
echo npx remotion render --codec=h264 --crf=18 MainVideo out/final.mp4
echo.
pause