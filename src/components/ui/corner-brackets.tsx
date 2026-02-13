'use client';

interface CornerBracketsProps {
  children: React.ReactNode;
  className?: string;
  hoverAccent?: boolean;
  size?: number;
  strokeWidth?: number;
}

export function CornerBrackets({
  children,
  className = '',
  hoverAccent = true,
  size = 16,
  strokeWidth = 1.5,
}: CornerBracketsProps) {
  const bracketColor = hoverAccent ? 'text-[#1f1f1f] group-hover:text-accent' : 'text-[#1f1f1f]';
  const transition = hoverAccent ? 'transition-colors duration-100' : '';

  return (
    <div className={`relative group ${className}`}>
      {/* Top-Left */}
      <svg
        className={`absolute top-0 left-0 pointer-events-none ${bracketColor} ${transition}`}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        aria-hidden="true"
      >
        <path
          d={`M0 ${size}V0H${size}`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
      </svg>

      {/* Top-Right */}
      <svg
        className={`absolute top-0 right-0 pointer-events-none ${bracketColor} ${transition}`}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        aria-hidden="true"
      >
        <path
          d={`M${size} ${size}V0H0`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
      </svg>

      {/* Bottom-Left */}
      <svg
        className={`absolute bottom-0 left-0 pointer-events-none ${bracketColor} ${transition}`}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        aria-hidden="true"
      >
        <path
          d={`M0 0V${size}H${size}`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
      </svg>

      {/* Bottom-Right */}
      <svg
        className={`absolute bottom-0 right-0 pointer-events-none ${bracketColor} ${transition}`}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        aria-hidden="true"
      >
        <path
          d={`M${size} 0V${size}H0`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
      </svg>

      {children}
    </div>
  );
}
