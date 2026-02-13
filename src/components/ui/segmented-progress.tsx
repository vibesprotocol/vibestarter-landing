'use client';

interface SegmentedProgressProps {
  percent: number;
  segments?: number;
  className?: string;
  showLabel?: boolean;
  overflowPercent?: number;
  label?: string;
}

export function SegmentedProgress({
  percent,
  segments = 20,
  className = '',
  showLabel = true,
  overflowPercent,
  label,
}: SegmentedProgressProps) {
  const filledCount = Math.round((Math.min(percent, 100) / 100) * segments);
  const overflowCount = overflowPercent
    ? Math.round((Math.min(overflowPercent - 100, 100) / 100) * segments)
    : 0;

  return (
    <div className={`space-y-1 ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center text-xs">
          {label && (
            <span className="text-neutral-500 font-mono uppercase text-[10px] tracking-wider">{label}</span>
          )}
          <span className="text-white font-mono ml-auto">{Math.round(percent)}%</span>
        </div>
      )}
      <div className="progress-segmented">
        {Array.from({ length: segments }).map((_, i) => {
          const isFilled = i < filledCount;
          const isOverflow = overflowPercent && i >= filledCount && i < filledCount + overflowCount;
          return (
            <div
              key={i}
              className={`progress-segment${isFilled ? ' filled' : ''}${isOverflow ? ' overflow' : ''}`}
            />
          );
        })}
      </div>
    </div>
  );
}
