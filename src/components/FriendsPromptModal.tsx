import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, RefreshCw, PartyPopper, ArrowRight } from 'lucide-react';
import { candyAudio } from '../utils/audio';

interface FriendsPromptModalProps {
  isRevealed: boolean;
}

type ModalState = 'idle' | 'asking' | 'rejected' | 'accepted' | 'dismissed';

export const FriendsPromptModal: React.FC<FriendsPromptModalProps> = ({ isRevealed }) => {
  const [modalState, setModalState] = useState<ModalState>('idle');
  const [noCount, setNoCount] = useState<number>(0);

  // Reset state when loader replays or starts
  useEffect(() => {
    if (!isRevealed) {
      setModalState('idle');
      setNoCount(0);
    } else {
      setModalState('idle');
    }
  }, [isRevealed]);

  // Handle "Next" click -> Opens the "Friends???" section
  const handleNextClick = () => {
    candyAudio.playPop(1.1);
    setModalState('asking');
  };

  // Handle "No" click -> shows the "na pavom la😭" pop-up
  const handleNoClick = () => {
    candyAudio.playPop(0.8);
    setNoCount((prev) => prev + 1);
    setModalState('rejected');
  };

  // Handle "Rethink" click -> hides the rejection popup, returns to asking with an enlarged "Yes" button
  const handleRethinkClick = () => {
    candyAudio.playPop(1.1);
    setModalState('asking');
  };

  // Handle "Yes" click -> celebratory state
  const handleYesClick = () => {
    candyAudio.playSuccessChime();
    setModalState('accepted');
  };

  // Close celebration modal and return to clean live wallpaper
  const handleCloseCelebration = () => {
    candyAudio.playPop(1.0);
    setModalState('dismissed');
  };

  if (!isRevealed || modalState === 'dismissed') {
    return null;
  }

  // Calculate dynamic scale factor for the Yes button (grows bigger with every No)
  const yesScale = Math.min(2.8, 1 + noCount * 0.4);
  const noScale = Math.max(0.6, 1 - noCount * 0.08);

  return (
    <>
      {/* =========================================================================
          IDLE STATE: Centered "Next" Button (Visible while reading, doesn't block text)
         ========================================================================= */}
      <AnimatePresence>
        {modalState === 'idle' && (
          <div className="fixed bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
            <motion.button
              id="next-to-friends-btn"
              onClick={handleNextClick}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 rounded-full font-bold text-slate-950 bg-gradient-to-r from-cyan-300 via-teal-300 to-amber-300 shadow-[0_0_25px_rgba(0,240,255,0.6)] hover:shadow-[0_0_40px_rgba(0,240,255,0.9)] transition-all duration-300 cursor-pointer flex items-center gap-3 text-sm md:text-base uppercase tracking-wider font-mono group"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL OVERLAY (Only appears after clicking "Next")
         ========================================================================= */}
      {modalState !== 'idle' && (
        <div
          id="friends-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md select-none transition-all duration-300"
        >
          <AnimatePresence mode="wait">
            {/* =========================================================================
                STATE 1: "Friends???" Asking Dialog
               ========================================================================= */}
            {modalState === 'asking' && (
              <motion.div
                key="modal-asking"
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                className="relative w-full max-w-md p-8 md:p-10 rounded-3xl glass-panel text-center shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_35px_rgba(0,240,255,0.25)] border border-cyan-400/30 overflow-visible"
              >
                {/* Ambient Top Glow Line */}
                <div className="absolute top-0 left-[15%] right-[15%] h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-amber-400 rounded-full shadow-[0_0_12px_#00f0ff]" />

                {/* Sparkle Icon */}
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-amber-500/20 border border-cyan-400/40 flex items-center justify-center shadow-inner">
                  <Sparkles className="w-7 h-7 text-cyan-300 animate-pulse" />
                </div>

                {/* Bold Center Text: "Friends???" */}
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-wide text-white drop-shadow-[0_2px_15px_rgba(0,240,255,0.4)] mb-2">
                  Friends???
                </h2>

                <p className="text-slate-300 text-sm md:text-base font-light mb-8">
                  {noCount === 0 ? 'Start fresh' : `Are you really sure? (Attempt #${noCount + 1})`}
                </p>

                {/* Two Options: YES and NO */}
                <div className="flex items-center justify-center gap-6 min-h-[90px] flex-wrap">
                  {/* YES BUTTON (Grows bigger with every No) */}
                  <motion.button
                    id="friends-yes-btn"
                    onClick={handleYesClick}
                    whileHover={{ scale: yesScale * 1.06 }}
                    whileTap={{ scale: yesScale * 0.96 }}
                    style={{
                      transform: `scale(${yesScale})`,
                      transformOrigin: 'center center',
                    }}
                    className="px-7 py-3 rounded-full font-bold text-slate-950 bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-400 shadow-[0_0_25px_rgba(0,240,255,0.6)] hover:shadow-[0_0_35px_rgba(0,240,255,0.9)] transition-shadow duration-300 cursor-pointer flex items-center gap-2 z-10 text-base md:text-lg"
                  >
                    <Heart className="w-5 h-5 fill-slate-950" />
                    <span>Yes</span>
                  </motion.button>

                  {/* NO BUTTON */}
                  <motion.button
                    id="friends-no-btn"
                    onClick={handleNoClick}
                    whileHover={{ scale: noScale * 1.05 }}
                    whileTap={{ scale: noScale * 0.92 }}
                    style={{
                      transform: `scale(${noScale})`,
                      transformOrigin: 'center center',
                    }}
                    className="px-6 py-2.5 rounded-full font-medium text-slate-300 bg-white/5 border border-white/15 hover:bg-red-500/20 hover:border-red-400 hover:text-white transition-colors duration-200 cursor-pointer text-sm"
                  >
                    <span>No</span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* =========================================================================
                STATE 2: "na pavom la😭" Rejection Pop-up with "Rethink" Button
               ========================================================================= */}
            {modalState === 'rejected' && (
              <motion.div
                key="modal-rejected"
                initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 3 }}
                transition={{ type: 'spring', damping: 20, stiffness: 350 }}
                className="relative w-full max-w-sm p-7 md:p-8 rounded-3xl glass-panel text-center shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_40px_rgba(255,157,0,0.3)] border border-amber-400/40"
              >
                {/* Ambient Top Glow Line */}
                <div className="absolute top-0 left-[15%] right-[15%] h-[3px] bg-gradient-to-r from-transparent via-amber-400 to-rose-400 rounded-full shadow-[0_0_12px_#ff9d00]" />

                {/* Sad Emoji / Alert Icon */}
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/15 border border-amber-400/50 flex items-center justify-center shadow-lg animate-bounce">
                  <span className="text-3xl">😭</span>
                </div>

                {/* Exact Requested Message */}
                <h3 className="text-2xl md:text-3xl font-extrabold text-amber-300 tracking-wide mb-3 drop-shadow-[0_2px_12px_rgba(255,157,0,0.5)]">
                  na pavom la😭
                </h3>

                <p className="text-slate-300 text-sm font-light mb-6">
                  Give it another thought! 🥺
                </p>

                {/* "Rethink" Button */}
                <motion.button
                  id="rethink-btn"
                  onClick={handleRethinkClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 px-6 rounded-full font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 shadow-[0_0_20px_rgba(255,157,0,0.6)] hover:shadow-[0_0_30px_rgba(255,157,0,0.9)] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 text-base"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Rethink</span>
                </motion.button>
              </motion.div>
            )}

            {/* =========================================================================
                STATE 3: Celebration Accepted State
               ========================================================================= */}
            {modalState === 'accepted' && (
              <motion.div
                key="modal-accepted"
                initial={{ opacity: 0, scale: 0.85, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -15 }}
                transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                className="relative w-full max-w-md p-8 md:p-10 rounded-3xl glass-panel text-center shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(0,240,255,0.35)] border border-cyan-400/40"
              >
                {/* Ambient Top Glow Line */}
                <div className="absolute top-0 left-[15%] right-[15%] h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-emerald-400 rounded-full shadow-[0_0_12px_#00f0ff]" />

                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                  <PartyPopper className="w-8 h-8 text-cyan-300" />
                </div>

                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-wide">
                  Friends Forever! 💖🫂
                </h2>

                <p className="text-slate-300 text-sm md:text-base font-light mb-8">
                  Thank you for giving us another chance. Enjoy the wallpaper and music! ✨
                </p>

                <motion.button
                  id="close-celebration-btn"
                  onClick={handleCloseCelebration}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="px-8 py-3 rounded-full font-bold text-slate-950 bg-gradient-to-r from-cyan-300 to-emerald-400 shadow-[0_0_20px_rgba(0,240,255,0.5)] hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] transition-all cursor-pointer text-sm uppercase tracking-wider font-mono"
                >
                  Continue to Wallpaper
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};
