import { cn } from '@/lib/utils';

export function Khanda({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('inline-block', className)}
      fill="currentColor"
      aria-hidden="true"
    >
      {/* Two crossed swords behind */}
      <g stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <line x1="16" y1="86" x2="44" y2="32" />
        <line x1="13" y1="89" x2="19" y2="83" strokeWidth="3.5" />
        <line x1="84" y1="86" x2="56" y2="32" />
        <line x1="87" y1="89" x2="81" y2="83" strokeWidth="3.5" />
      </g>

      {/* Left chakkar (ring) */}
      <circle cx="30" cy="50" r="11" fill="none" stroke="currentColor" strokeWidth="2.5" />
      {/* Right chakkar (ring) */}
      <circle cx="70" cy="50" r="11" fill="none" stroke="currentColor" strokeWidth="2.5" />

      {/* Central khanda (double-edged sword) */}
      <g>
        <path d="M48 8 L52 8 L52 52 L48 52 Z" rx="1" />
        <path d="M50 3 L54 11 L46 11 Z" />
        <rect x="34" y="50" width="32" height="3.5" rx="1.5" />
        <rect x="47" y="54" width="6" height="11" rx="1.5" />
        <circle cx="50" cy="70" r="3.5" />
      </g>
    </svg>
  );
}
