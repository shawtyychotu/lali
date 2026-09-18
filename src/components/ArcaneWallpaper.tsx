import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Maximize2, Minimize2, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface ArcaneWallpaperProps {
  onReplayLoader: () => void;
  isRevealed: boolean;
}

interface StarParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  twinkleSpeed: number;
  color: string;
  flare: boolean;
}

interface EmberParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  alpha: number;
  glowColor: string;
  coreColor: string;
}

export const ArcaneWallpaper: React.FC<ArcaneWallpaperProps> = ({ onReplayLoader, isRevealed }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bgImageRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Parallax ref values to avoid unnecessary re-renders in 60fps loop
  const parallaxRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // 1. Particle Canvas Engine & Parallax
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    let stars: StarParticle[] = [];
    let embers: EmberParticle[] = [];

    const createEmber = (): EmberParticle => ({
      x: Math.random() * width,
      y: Math.random() * height + Math.random() * 80,
      size: Math.random() * 3.4 + 1.2,
      speedY: -(Math.random() * 1.3 + 0.5),
      speedX: (Math.random() - 0.5) * 0.7,
      wobbleSpeed: Math.random() * 0.035 + 0.015,
      wobbleAmp: Math.random() * 2.2 + 0.8,
      alpha: Math.random() * 0.85 + 0.2,
      glowColor: 'rgba(255, 157, 0, ',
      coreColor: '#fef08a',
    });

    const populate = () => {
      // Stars (upper 72%)
      stars = [];
      const starCount = Math.floor((width * height) / 11000);
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.72),
          size: Math.random() * 2.0 + 0.6,
          alpha: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.03 + 0.012,
          color: Math.random() > 0.35 ? '#bae6fd' : '#f8fafc',
          flare: Math.random() < 0.18,
        });
      }

      // Zaun glowing orange rising embers
      embers = [];
      const emberCount = Math.floor((width * height) / 22000);
      for (let i = 0; i < emberCount; i++) {
        embers.push(createEmber());
      }
    };

    populate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
      populate();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const factorX = (e.clientX / width - 0.5) * 2;
      const factorY = (e.clientY / height - 0.5) * 2;
      parallaxRef.current.targetX = factorX * 22;
      parallaxRef.current.targetY = factorY * 16;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      // Lerp parallax
      const p = parallaxRef.current;
      p.x += (p.targetX - p.x) * 0.05;
      p.y += (p.targetY - p.y) * 0.05;

      // Apply parallax to background image
      if (bgImageRef.current) {
        bgImageRef.current.style.transform = `translate3d(${-p.x}px, ${-p.y}px, 0) scale(1.04)`;
      }

      // Update & Draw Particles
      ctx.clearRect(0, 0, width, height);

      // Stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.alpha += Math.sin(Date.now() * s.twinkleSpeed) * 0.015;
        if (s.alpha < 0.15) s.alpha = 0.15;
        if (s.alpha > 0.95) s.alpha = 0.95;

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        const px = s.x + p.x * 0.2;
        const py = s.y + p.y * 0.2;
        ctx.arc(px, py, s.size, 0, Math.PI * 2);
        ctx.fill();

        if (s.flare) {
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(px - s.size * 3.2, py);
          ctx.lineTo(px + s.size * 3.2, py);
          ctx.moveTo(px, py - s.size * 3.2);
          ctx.lineTo(px, py + s.size * 3.2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Embers
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.y += e.speedY;
        e.x += e.speedX + Math.sin(e.y * e.wobbleSpeed) * (e.wobbleAmp * 0.4);

        if (e.y < -30) {
          embers[i] = createEmber();
          embers[i].y = height + 20;
        }

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const px = e.x + p.x * 0.4;
        const py = e.y + p.y * 0.4;

        const grad = ctx.createRadialGradient(px, py, 0, px, py, e.size * 3.5);
        grad.addColorStop(0, e.coreColor);
        grad.addColorStop(0.35, e.glowColor + e.alpha + ')');
        grad.addColorStop(1, e.glowColor + '0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, e.size * 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // 2. Audio Control
  const toggleAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Audio playback prevented:', err));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  // Preload audio on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.preload = 'auto';
      audio.load();
    }
  }, []);

  // Automatically start audio when loading screen finishes and reveals
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isRevealed) {
      // Pause if loader is currently replaying
      audio.pause();
      setIsPlaying(false);
      return;
    }

    // Attempt immediate playback when revealed
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log('Autoplay prevented by browser, waiting for user click:', err);
        });
    }

    // Fallback: If browser restricted autoplay without prior interaction, play on first user tap/click/key
    const handleFirstInteraction = () => {
      if (audio && audio.paused) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [isRevealed]);

  // 3. Fullscreen & Keyboard Shortcuts & Auto-hide Cursor
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        toggleAudio();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Auto-hide cursor on idle
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    const resetIdleTimer = () => {
      document.body.style.cursor = 'default';
      setShowControls(true);
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        document.body.style.cursor = 'none';
        setShowControls(false);
      }, 3500);
    };

    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('mousedown', resetIdleTimer);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('mousedown', resetIdleTimer);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, [toggleAudio, toggleFullscreen]);

  return (
    <div
      id="arcane-app-container"
      className="relative w-full h-screen overflow-hidden bg-[#05070d] text-white select-none"
    >
      {/* 1. Wallpaper Image with Mouse Parallax */}
      <div
        id="wallpaper-image"
        ref={bgImageRef}
        className="absolute -top-[3%] -left-[3%] w-[106%] h-[106%] bg-cover bg-no-repeat will-change-transform pointer-events-none"
        style={{
          backgroundImage: "url('./assets/wallpaper.jpg')",
          backgroundPosition: 'center 30%',
        }}
      />

      {/* 2. Interactive Canvas for Stars & Zaun Glowing Embers */}
      <canvas
        id="particle-canvas"
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
      />

      {/* 3. Cinematic Vignette Overlay */}
      <div
        id="vignette-overlay"
        className="absolute inset-0 w-full h-full pointer-events-none z-[3]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5, 7, 13, 0.68) 100%)',
        }}
      />

      {/* 4. Ambient Neon Bloom Overlay */}
      <div
        id="bloom-overlay"
        className="absolute inset-0 w-full h-full pointer-events-none z-[4] mix-blend-screen opacity-45"
        style={{
          background: `
            radial-gradient(circle at 48% 65%, rgba(192, 38, 211, 0.14) 0%, transparent 60%),
            radial-gradient(circle at 55% 40%, rgba(0, 240, 255, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(255, 157, 0, 0.1) 0%, transparent 45%)
          `,
        }}
      />

      {/* 5. Top Bar Quick Controls & Status */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="absolute top-6 right-6 z-30 flex items-center gap-3"
          >
            {/* Replay Split Loader Button */}
            <button
              id="replay-split-loader-btn"
              onClick={onReplayLoader}
              title="Replay Split Reveal Loader"
              className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 text-xs uppercase tracking-wider font-mono text-cyan-300 hover:text-white hover:border-cyan-400 hover:bg-cyan-500/15 transition-all duration-200 cursor-pointer shadow-lg active:scale-95 group"
            >
              <RotateCcw className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-90" />
              <span>Replay Loader</span>
            </button>

            {/* Mute Toggle */}
            <button
              id="audio-mute-toggle-btn"
              onClick={toggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="glass-panel p-2.5 rounded-full text-slate-300 hover:text-white hover:border-cyan-400 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              id="fullscreen-toggle-btn"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
              className="glass-panel p-2.5 rounded-full text-slate-300 hover:text-white hover:border-cyan-400 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Left-Side Glassmorphic Message Card */}
      <div className="absolute left-6 md:left-[5vw] top-1/2 -translate-y-1/2 z-20 max-w-[480px] w-[90vw] pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, x: -30, scale: 0.96 }}
          animate={isRevealed ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -30, scale: 0.96 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative glass-panel rounded-[24px] p-7 md:p-9 shadow-[0_24px_60px_rgba(0,0,0,0.65),0_0_25px_rgba(0,240,255,0.14)] hover:shadow-[0_28px_70px_rgba(0,0,0,0.75),0_0_35px_rgba(0,240,255,0.25)] hover:border-cyan-400/40 transition-all duration-400 backdrop-blur-xl group"
        >
          {/* Top glowing accent gradient bar */}
          <div className="absolute top-0 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-amber-500 rounded-full" />

          {/* First Paragraph */}
          <p className="text-white text-[1.02rem] md:text-[1.08rem] font-normal leading-[1.75] tracking-[0.015em] drop-shadow-md">
            I’m genuinely sorry for what I did that hurt you or made things uncomfortable between us. I know saying “sorry”
            doesn’t automatically fix everything, but I want you to know that I truly mean it.
          </p>

          {/* Divider */}
          <div className="w-12 h-[1.5px] bg-gradient-to-r from-cyan-400 to-transparent my-5 rounded-full opacity-80" />

          {/* Second Paragraph */}
          <p className="text-slate-200 text-[0.98rem] md:text-[1.04rem] font-light leading-[1.75] tracking-[0.015em] drop-shadow-md">
            I’m not here to make excuses or justify what happened. I just want to say that I’m sorry, and I hope you can
            give me another chance.
          </p>

          {/* Glassmorphic Audio Player Bar */}
          <div
            id="glass-audio-player"
            onClick={toggleAudio}
            className={`mt-7 flex items-center gap-3.5 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400/40 hover:bg-white/10 transition-all duration-300 cursor-pointer shadow-md ${
              isPlaying ? 'border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]' : ''
            }`}
          >
            {/* Play/Pause Button */}
            <button
              id="audio-toggle-btn"
              onClick={(e) => {
                e.stopPropagation();
                toggleAudio();
              }}
              title="Play / Pause 'Come Back Home'"
              className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-sky-600 flex items-center justify-center text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.5)] hover:scale-105 active:scale-95 transition-transform flex-shrink-0 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
            </button>

            {/* Song Details */}
            <div className="flex flex-col flex-grow min-w-0">
              <span className="text-xs md:text-sm font-medium text-white truncate">Come Back Home</span>
              <span className="text-[0.68rem] md:text-[0.72rem] text-amber-400 font-serif-cinzel tracking-wider">
                Sofia Carson
              </span>
            </div>

            {/* Animated Equalizer Waveform Bars */}
            <div className="flex items-end gap-[3px] h-4 pr-1">
              <span
                className={`w-[3px] bg-cyan-400 rounded-full transition-all duration-200 ${
                  isPlaying ? 'animate-equalize-1' : 'h-1'
                }`}
              />
              <span
                className={`w-[3px] bg-cyan-400 rounded-full transition-all duration-200 ${
                  isPlaying ? 'animate-equalize-2' : 'h-1.5'
                }`}
              />
              <span
                className={`w-[3px] bg-cyan-400 rounded-full transition-all duration-200 ${
                  isPlaying ? 'animate-equalize-3' : 'h-2'
                }`}
              />
              <span
                className={`w-[3px] bg-cyan-400 rounded-full transition-all duration-200 ${
                  isPlaying ? 'animate-equalize-4' : 'h-1'
                }`}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* 7. Bottom Subtle Key Hints */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-5 left-8 z-20 hidden md:flex items-center gap-4 text-[0.7rem] font-mono text-slate-400"
          >
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20 text-slate-300">Space</kbd>
              <span>Toggle Audio</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20 text-slate-300">F</kbd>
              <span>Fullscreen</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5 text-cyan-300/80">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Interactive Parallax</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 8. HTML5 Audio Element */}
      <audio ref={audioRef} id="bg-audio" loop preload="auto" src="./assets/audio.mp3" />
    </div>
  );
};
