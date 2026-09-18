import React from 'react';
import { motion } from 'motion/react';
import { LollipopStyle, FlavorConfig } from '../types';

interface LollipopGraphicProps {
  style: LollipopStyle;
  flavor: FlavorConfig;
  spinSpeed: number; // Seconds per rotation (e.g., 3)
  size?: number; // Pixel width/height of head, default 200
  isSpinning?: boolean;
  stickRibbon?: boolean;
  onClick?: () => void;
  scale?: number;
}

export const LollipopGraphic: React.FC<LollipopGraphicProps> = ({
  style,
  flavor,
  spinSpeed = 3,
  size = 220,
  isSpinning = true,
  stickRibbon = true,
  onClick,
  scale = 1,
}) => {
  const radius = 100;
  const stickHeight = 170;
  const stickWidth = 14;

  // Render the spinning candy head pattern based on chosen style
  const renderCandyPattern = () => {
    switch (style) {
      case 'pinwheel': {
        // 12 alternating wedges
        const segments = 12;
        const paths = [];
        for (let i = 0; i < segments; i++) {
          const startAngle = (i * 360) / segments;
          const endAngle = ((i + 1) * 360) / segments;
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          const x1 = radius + radius * Math.cos(startRad);
          const y1 = radius + radius * Math.sin(startRad);
          const x2 = radius + radius * Math.cos(endRad);
          const y2 = radius + radius * Math.sin(endRad);

          const color = flavor.colors[i % flavor.colors.length];
          const d = `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
          paths.push(<path key={i} d={d} fill={color} />);
        }
        return <g>{paths}</g>;
      }

      case 'ball': {
        // Spherical rounded ball pop with curved horizontal candy bands
        return (
          <g>
            <circle cx={radius} cy={radius} r={radius} fill={flavor.colors[0]} />
            {/* Wavy curved stripes */}
            <path
              d={`M 15 70 Q ${radius} 115 ${200 - 15} 70 L ${200 - 10} 95 Q ${radius} 140 10 95 Z`}
              fill={flavor.colors[1 % flavor.colors.length]}
              opacity="0.95"
            />
            <path
              d={`M 30 40 Q ${radius} 75 ${200 - 30} 40 L ${200 - 20} 60 Q ${radius} 95 20 60 Z`}
              fill={flavor.colors[2 % flavor.colors.length] || '#FFFFFF'}
              opacity="0.9"
            />
            <path
              d={`M 25 130 Q ${radius} 170 ${200 - 25} 130 L ${200 - 40} 150 Q ${radius} 185 40 150 Z`}
              fill={flavor.colors[3 % flavor.colors.length] || flavor.colors[1 % flavor.colors.length]}
              opacity="0.92"
            />
            {/* Inner secondary swirl core */}
            <circle cx={radius} cy={radius} r={35} fill={flavor.colors[1 % flavor.colors.length]} opacity="0.3" />
          </g>
        );
      }

      case 'heart': {
        // Heart lollipop with spiral rings
        return (
          <g>
            <circle cx={radius} cy={radius} r={radius} fill={flavor.colors[0]} />
            {/* Heart shaped inner swirls */}
            {[80, 60, 40, 20].map((r, idx) => {
              const color = flavor.colors[(idx + 1) % flavor.colors.length];
              return (
                <circle
                  key={idx}
                  cx={radius + (idx % 2 === 0 ? 6 : -6)}
                  cy={radius + (idx % 2 === 0 ? -4 : 4)}
                  r={r}
                  fill="none"
                  stroke={color}
                  strokeWidth="14"
                  strokeDasharray="28 14"
                />
              );
            })}
          </g>
        );
      }

      case 'spiral':
      default: {
        // True classic Archimedean spiral candy swirl
        // Generate 6 curved spiral arms radiating out from center to create the real hypnotic candy lollipop
        const armsCount = 8;
        const spiralArms = [];

        for (let arm = 0; arm < armsCount; arm++) {
          const color = flavor.colors[arm % flavor.colors.length];
          // Sample points along an Archimedean spiral r = a * theta
          const points: string[] = [];
          const startTheta = (arm * (2 * Math.PI)) / armsCount;
          const steps = 40;
          const maxTheta = 3.8 * Math.PI; // roughly 2 full turns outward

          for (let step = 0; step <= steps; step++) {
            const t = step / steps;
            const theta = startTheta + t * maxTheta;
            const currentR = t * radius * 1.12;
            const x = radius + currentR * Math.cos(theta);
            const y = radius + currentR * Math.sin(theta);
            points.push(`${step === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
          }

          spiralArms.push(
            <path
              key={arm}
              d={points.join(' ')}
              fill="none"
              stroke={color}
              strokeWidth="22"
              strokeLinecap="round"
            />
          );
        }

        return (
          <g>
            {/* Base candy disk */}
            <circle cx={radius} cy={radius} r={radius} fill={flavor.colors[0]} />
            {/* Radiating spiral tracks */}
            {spiralArms}
            {/* Center glossy button dot */}
            <circle
              cx={radius}
              cy={radius}
              r={12}
              fill={flavor.colors[1 % flavor.colors.length]}
              stroke="#FFFFFF"
              strokeWidth="2.5"
            />
          </g>
        );
      }
    }
  };

  return (
    <div
      id="lollipop-wrapper"
      className="relative flex flex-col items-center select-none cursor-pointer group"
      style={{
        width: size,
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      title="Click lollipop for extra sparkles & spin!"
    >
      {/* Ambient flavored glow underneath */}
      <div
        className="absolute top-0 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-60 group-hover:opacity-85"
        style={{
          width: size,
          height: size,
          backgroundColor: flavor.glowColor,
          transform: 'scale(1.18)',
        }}
      />

      {/* Floating & Gentle Wobble Container */}
      <motion.div
        className="relative flex flex-col items-center"
        animate={{
          y: [-6, 6, -6],
          rotate: [-1.5, 1.5, -1.5],
        }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Lollipop Head (Circular Mask + Rotating Pattern + Static Gloss Overlay) */}
        <div
          className="relative rounded-full shadow-2xl transition-transform duration-300 group-hover:scale-105 active:scale-95"
          style={{
            width: size,
            height: size,
            boxShadow: `0 16px 40px -10px ${flavor.glowColor}, 0 8px 18px rgba(0,0,0,0.12)`,
          }}
        >
          {/* Circular Clip for Candy Disk */}
          <div className="w-full h-full rounded-full overflow-hidden relative">
            {/* ROTATING SVG CANDY WHEEL */}
            <motion.div
              className="w-full h-full"
              animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
              transition={{
                repeat: Infinity,
                ease: 'linear',
                duration: spinSpeed,
              }}
              style={{ willChange: 'transform' }}
            >
              <svg
                viewBox={`0 0 ${radius * 2} ${radius * 2}`}
                className="w-full h-full block"
                style={{ shapeRendering: 'geometricPrecision' }}
              >
                <defs>
                  {/* Subtle rim shadow for depth */}
                  <radialGradient id="rimShade" cx="50%" cy="50%" r="50%">
                    <stop offset="70%" stopColor="#000000" stopOpacity="0" />
                    <stop offset="95%" stopColor="#000000" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.32" />
                  </radialGradient>
                </defs>

                {renderCandyPattern()}

                {/* Rim shade overlay */}
                <circle cx={radius} cy={radius} r={radius} fill="url(#rimShade)" />
              </svg>
            </motion.div>

            {/* STATIC SPECULAR GLASS HIGHLIGHT (Always stays on top-left to simulate real hard-candy glass shine) */}
            <svg
              viewBox={`0 0 ${radius * 2} ${radius * 2}`}
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              <defs>
                <linearGradient id="glossGrad" x1="0%" y1="0%" x2="70%" y2="70%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                  <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.4" />
                  <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="subtleRim" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.45" />
                </linearGradient>
              </defs>

              {/* Main curved glossy crescent reflection */}
              <path
                d={`M ${radius * 0.35} ${radius * 0.2} 
                    A ${radius * 0.78} ${radius * 0.78} 0 0 1 ${radius * 1.55} ${radius * 0.45} 
                    A ${radius * 0.65} ${radius * 0.65} 0 0 0 ${radius * 0.55} ${radius * 0.45} Z`}
                fill="url(#glossGrad)"
                opacity="0.88"
              />

              {/* Small secondary glossy dot */}
              <circle cx={radius * 0.48} cy={radius * 0.46} r={radius * 0.09} fill="#FFFFFF" opacity="0.65" />
              <circle cx={radius * 0.62} cy={radius * 0.38} r={radius * 0.045} fill="#FFFFFF" opacity="0.75" />

              {/* Outer glass boundary stroke */}
              <circle
                cx={radius}
                cy={radius}
                r={radius - 1.5}
                fill="none"
                stroke="url(#subtleRim)"
                strokeWidth="2.5"
              />
            </svg>
          </div>
        </div>

        {/* LOLLIPOP STICK */}
        <div
          className="relative z-0 -mt-2.5 flex flex-col items-center"
          style={{ width: stickWidth }}
        >
          {/* The physical plastic/paper stick */}
          <div
            className="w-full rounded-b-full shadow-md relative overflow-hidden"
            style={{
              height: stickHeight,
              background: 'linear-gradient(90deg, #E2E8F0 0%, #FFFFFF 35%, #F8FAFC 75%, #CBD5E1 100%)',
              boxShadow: '0 8px 20px -3px rgba(0,0,0,0.18), inset 1px 0 2px rgba(255,255,255,0.8)',
            }}
          >
            {/* Shading core line down the stick */}
            <div className="absolute top-0 bottom-0 left-[2px] w-[2px] bg-white opacity-90" />
            <div className="absolute top-0 bottom-0 right-[2px] w-[2px] bg-slate-300 opacity-60" />
          </div>

          {/* CUTE RIBBON / BOW AT THE NECK */}
          {stickRibbon && (
            <div
              className="absolute -top-1 pointer-events-none z-10 flex items-center justify-center"
              style={{ width: 42, height: 26 }}
            >
              <svg viewBox="0 0 44 24" className="w-full h-full drop-shadow">
                {/* Left bow loop */}
                <ellipse
                  cx="12"
                  cy="10"
                  rx="9"
                  ry="7"
                  fill={flavor.colors[0]}
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  transform="rotate(-15 12 10)"
                />
                {/* Right bow loop */}
                <ellipse
                  cx="32"
                  cy="10"
                  rx="9"
                  ry="7"
                  fill={flavor.colors[0]}
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  transform="rotate(15 32 10)"
                />
                {/* Dangling tails */}
                <path
                  d="M 19 14 Q 13 22 10 23 L 15 20 Q 21 16 21 14 Z"
                  fill={flavor.colors[1 % flavor.colors.length]}
                />
                <path
                  d="M 25 14 Q 31 22 34 23 L 29 20 Q 23 16 23 14 Z"
                  fill={flavor.colors[1 % flavor.colors.length]}
                />
                {/* Center knot */}
                <circle cx="22" cy="11" r="5" fill="#FFFFFF" stroke={flavor.colors[0]} strokeWidth="2" />
              </svg>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
