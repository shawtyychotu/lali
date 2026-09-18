import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LollipopGraphic } from './LollipopGraphic';
import { SquareLoadingBar } from './SquareLoadingBar';
import { FlavorConfig } from '../types';

interface SplitRevealLoaderProps {
  progress: number; // 0 to 100
  isRevealing: boolean; // true when split panels are opening
  flavor: FlavorConfig;
  spinSpeed: number;
  onLollipopClick?: () => void;
}

export const SplitRevealLoader: React.FC<SplitRevealLoaderProps> = ({
  progress,
  isRevealing,
  flavor,
  spinSpeed,
  onLollipopClick,
}) => {
  // Smooth split reveal easing transition matching the video
  const splitTransition = {
    duration: 0.9,
    ease: [0.76, 0, 0.24, 1] as const,
  };

  return (
    <div
      id="split-loader-wrapper"
      className="fixed inset-0 z-40 overflow-hidden pointer-events-none"
      style={{ isolation: 'isolate' }}
    >
      {/* TOP SPLIT SHUTTER (White background, slides up to -100%) */}
      <motion.div
        id="split-shutter-top"
        initial={{ y: '0%' }}
        animate={{ y: isRevealing ? '-100%' : '0%' }}
        transition={splitTransition}
        className={`absolute top-0 left-0 right-0 h-[calc(50%+1px)] bg-white ${
          isRevealing ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
        style={{ willChange: 'transform' }}
      />

      {/* BOTTOM SPLIT SHUTTER (White background, slides down to 100%) */}
      <motion.div
        id="split-shutter-bottom"
        initial={{ y: '0%' }}
        animate={{ y: isRevealing ? '100%' : '0%' }}
        transition={splitTransition}
        className={`absolute bottom-0 left-0 right-0 h-1/2 bg-white ${
          isRevealing ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
        style={{ willChange: 'transform' }}
      >
        {/* BOTTOM RIGHT LOADING BAR: Increased size on the right side */}
        <div
          id="bottom-right-loader"
          className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-10"
        >
          <SquareLoadingBar progress={progress} color="black" />
        </div>
      </motion.div>

      {/* CENTER COLORFUL LOLLIPOP */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
        <AnimatePresence>
          {!isRevealing && (
            <motion.div
              id="center-lollipop-container"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{
                scale: 0.75,
                opacity: 0,
                transition: { duration: 0.35, ease: 'easeIn' },
              }}
              className="pointer-events-auto flex items-center justify-center select-none"
            >
              <LollipopGraphic
                style="spiral"
                flavor={flavor}
                spinSpeed={spinSpeed}
                size={220}
                isSpinning={true}
                stickRibbon={false}
                onClick={onLollipopClick}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
