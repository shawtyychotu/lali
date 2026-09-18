import { useState, useEffect, useCallback } from 'react';
import { SplitRevealLoader } from './components/SplitRevealLoader';
import { ArcaneWallpaper } from './components/ArcaneWallpaper';
import { FriendsPromptModal } from './components/FriendsPromptModal';
import { COLORFUL_LOLLIPOP } from './data/themes';

export default function App() {
  const [progress, setProgress] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [spinBoost, setSpinBoost] = useState<number | null>(null);

  // Run the loading simulation
  const startLoading = useCallback(() => {
    setIsRevealing(false);
    setProgress(0);

    const totalDurationMs = 3800; // Snappy 3.8s loading sequence
    const intervalMs = 25;
    const step = (100 / totalDurationMs) * intervalMs;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsRevealing(true);
          }, 180);
          return 100;
        }
        return next;
      });
    }, intervalMs);

    return timer;
  }, []);

  // Initial load sequence on mount
  useEffect(() => {
    const timer = startLoading();
    return () => clearInterval(timer);
  }, [startLoading]);

  // Click lollipop to boost spin speed during loader
  const handleLollipopClick = () => {
    setSpinBoost(0.6);
    setTimeout(() => {
      setSpinBoost(null);
    }, 1200);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#05070d]">
      {/* 1. ARCANE LIVE WALLPAPER (APP IDEA) UNDERNEATH */}
      <ArcaneWallpaper onReplayLoader={startLoading} isRevealed={isRevealing} />

      {/* 2. FRIENDS PROMPT MODAL (Triggered 5 seconds after loading screen finishes) */}
      <FriendsPromptModal isRevealed={isRevealing} />

      {/* 3. WHITE SPLIT REVEAL LOADING SCREEN ON TOP */}
      {/* Featuring the 3-square loading bar on the right and vibrant colorful lollipop in the center */}
      <SplitRevealLoader
        progress={progress}
        isRevealing={isRevealing}
        flavor={COLORFUL_LOLLIPOP}
        spinSpeed={spinBoost || 2.6}
        onLollipopClick={handleLollipopClick}
      />
    </div>
  );
}
