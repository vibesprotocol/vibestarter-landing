// Shared icon components used across multiple sections
import Image from "next/image";

// ETH icon
export function EthIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2L6 16L16 22L26 16L16 2Z" fill="currentColor" fillOpacity="0.6" />
      <path d="M16 22L6 16L16 30L26 16L16 22Z" fill="currentColor" />
    </svg>
  );
}

// Vibetoken icon (V in circle)
export function VibetokenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
      <path d="M10 10L16 22L22 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Person/user icon (used for backers, founders)
export function PersonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

// Lock/Escrow icon
export function EscrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// Aerodrome symbol logo — optimised via Next.js Image for small render sizes
export function AerodromeSymbol({ className }: { className?: string }) {
  return (
    <Image
      src="/aero-symbol.png"
      alt="Aerodrome"
      width={32}
      height={32}
      className={className}
      loading="lazy"
      unoptimized={false}
    />
  );
}

// Aerodrome logo with text
export function AerodromeLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className || ''}`}>
      <AerodromeSymbol className="w-4 h-5" />
      <span className="text-[10px] font-mono text-white/50">Aerodrome</span>
    </div>
  );
}
