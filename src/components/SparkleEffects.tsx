import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SparkleParticle } from '../types';

interface SparkleEffectsProps {
  burstTrigger?: number; // increments when lollipop is clicked
  color: string;
  active?: boolean;
}

export const SparkleEffects: React.FC<SparkleEffectsProps> = ({
  burstTrigger = 0,
  color,
  active = true,
}) => {
  const [ambientSparkles, setAmbientSparkles] = useState<SparkleParticle[]>([]);
  const [burstSparkles, setBurstSparkles] = useState<SparkleParticle[]>([]);

  // Ambient gentle floating sparkles
  useEffect(() => {
    if (!active) {
      setAmbientSparkles([]);
      return;
    }

    const interval = setInterval(() => {
      setAmbientSparkles((prev) => {
        const next = [...prev.slice(-8)]; // Keep max 8
        const angle = Math.random() * Math.PI * 2;
        const distance = 110 + Math.random() * 80;
        next.push({
          id: Date.now() + Math.random(),
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 40, // offset towards lollipop head
          size: 8 + Math.random() * 12,
          color,
          rotation: Math.random() * 360,
        });
        return next;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [active, color]);

  // Handle sudden click burst
  useEffect(() => {
    if (burstTrigger === 0) return;

    const newBurst: SparkleParticle[] = [];
    const count = 14;
    for (let i = 0; i < count; i++) {
      const angle = (i * (Math.PI * 2)) / count + (Math.random() - 0.5) * 0.4;
      const distance = 90 + Math.random() * 120;
      newBurst.push({
        id: Date.now() + i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 40,
        size: 10 + Math.random() * 14,
        color,
        rotation: Math.random() * 360,
      });
    }

    setBurstSparkles(newBurst);
    const timeout = setTimeout(() => {
      setBurstSparkles([]);
    }, 900);

    return () => clearTimeout(timeout);
  }, [burstTrigger, color]);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-20">
      {/* Ambient twinkle sparkles */}
      <AnimatePresence>
        {ambientSparkles.map((sp) => (
          <motion.div
            key={sp.id}
            initial={{ opacity: 0, scale: 0, rotate: sp.rotation }}
            animate={{
              opacity: [0, 1, 0.9, 0],
              scale: [0, 1.2, 0.9, 0],
              y: sp.y - 20,
              rotate: sp.rotation + 90,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: `calc(50% + ${sp.x}px)`,
              top: `calc(50% + ${sp.y}px)`,
              width: sp.size,
              height: sp.size,
            }}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow">
              <path
                d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                fill={sp.color}
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Burst sparkles from click */}
      <AnimatePresence>
        {burstSparkles.map((sp) => (
          <motion.div
            key={sp.id}
            initial={{ opacity: 1, scale: 0.2, x: 0, y: -40 }}
            animate={{
              opacity: [1, 1, 0],
              scale: [0.2, 1.4, 0],
              x: sp.x,
              y: sp.y,
              rotate: sp.rotation + 180,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: sp.size,
              height: sp.size,
            }}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md">
              <path
                d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                fill={sp.color}
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
