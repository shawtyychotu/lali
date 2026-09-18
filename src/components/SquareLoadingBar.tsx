import React from 'react';

interface SquareLoadingBarProps {
  progress: number; // 0 to 100
  color?: 'black' | 'white';
}

export const SquareLoadingBar: React.FC<SquareLoadingBarProps> = ({
  progress,
  color = 'black',
}) => {
  // Determine how many squares are filled based on progress (1, 2, or 3)
  const filledCount = progress < 33 ? 1 : progress < 66 ? 2 : 3;

  const blockBg = color === 'black' ? 'bg-black' : 'bg-white';
  const textColor = color === 'black' ? 'text-black' : 'text-white';

  return (
    <div
      id="video-square-loading-bar"
      className="flex flex-col items-center gap-3.5 select-none"
    >
      {/* 3 square blocks, enlarged for strong visual impact */}
      <div className="flex items-center gap-3 md:gap-4">
        {[1, 2, 3].map((num) => {
          const isFilled = num <= filledCount;
          return (
            <div
              key={num}
              className={`w-5 h-5 md:w-6 md:h-6 transition-all duration-150 ${
                isFilled ? `${blockBg} opacity-100 scale-100` : 'opacity-0 scale-75'
              }`}
            />
          );
        })}
      </div>

      {/* Enlarged, wide-tracked LOADING text */}
      <span
        className={`text-xs md:text-sm font-mono font-black tracking-[0.42em] ${textColor} pl-[0.42em]`}
      >
        LOADING
      </span>
    </div>
  );
};
