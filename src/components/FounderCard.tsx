import { Check } from "lucide-react";

interface FounderCardProps {
  name?: string;
  address?: string;
  ethosScore?: number;
  riskLevel?: "Low" | "Medium" | "High";
  tools?: string[];
  verified?: boolean;
}

export function FounderCard({
  name = "vibefounder.eth",
  address = "0x1a2b...3c4d",
  ethosScore = 85,
  riskLevel = "Low",
  tools = ["IdeaRalph", "Cursor", "Claude"],
  verified = true,
}: FounderCardProps) {
  const riskColor = {
    Low: "text-accent",
    Medium: "text-amber-400",
    High: "text-red-400",
  }[riskLevel];

  const riskDotColor = {
    Low: "bg-accent",
    Medium: "bg-amber-400",
    High: "bg-red-400",
  }[riskLevel];

  return (
    <div className="code-block rounded-xl p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-xs sm:text-sm font-mono">
            0x
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm sm:text-base">{name}</span>
              {verified && (
                <span className="text-accent text-[10px] sm:text-xs font-mono flex items-center gap-1">
                  <Check size={12} />
                  VERIFIED
                </span>
              )}
            </div>
            <span className="text-[12px] sm:text-[13px] text-muted font-mono">
              {address}
            </span>
          </div>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white/[0.03] rounded-lg p-3 sm:p-4">
          <div className="text-[10px] sm:text-[11px] text-muted uppercase tracking-wider mb-1">
            Ethos Score
          </div>
          <div className="text-xl sm:text-2xl font-semibold">
            {ethosScore}
            <span className="text-muted text-xs sm:text-sm">/100</span>
          </div>
        </div>
        <div className="bg-white/[0.03] rounded-lg p-3 sm:p-4">
          <div className="text-[10px] sm:text-[11px] text-muted uppercase tracking-wider mb-1">
            Risk Level
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${riskDotColor}`}></span>
            <span className={`text-base sm:text-lg font-medium ${riskColor}`}>
              {riskLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Builder Tools */}
      <div className="text-[10px] sm:text-[11px] text-muted uppercase tracking-wider mb-2">
        Builder Tools
      </div>
      <div className="flex gap-2 flex-wrap">
        {tools.map((tool) => (
          <span
            key={tool}
            className="bg-white/5 border border-border px-2 sm:px-3 py-1 rounded text-[11px] sm:text-[12px] font-mono"
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}
