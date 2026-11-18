export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="rkm-tile" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0" stopColor="#fb923c" />
          <stop offset="0.55" stopColor="#f97316" />
          <stop offset="1" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11" fill="url(#rkm-tile)" />
      <rect
        x="1.6"
        y="1.6"
        width="36.8"
        height="36.8"
        rx="10.2"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.6"
      />
      <path
        d="M20 6.8c3.5 2.5 5.3 6.2 5.3 9.8 0 2.2-.6 4.2-1.9 6L20 27l-3.4-4.4c-1.3-1.8-1.9-3.8-1.9-6 0-3.6 1.8-7.3 5.3-9.8z"
        fill="#ffffff"
      />
      <circle cx="20" cy="15.3" r="2.2" fill="#dc2626" />
      <path d="M15.7 20.6 12.5 24.3l3.6-1.3z" fill="#ffffff" opacity="0.82" />
      <path d="M24.3 20.6 27.5 24.3l-3.6-1.3z" fill="#ffffff" opacity="0.82" />
      <path d="M20 32.6l1.8-3.2h-3.6z" fill="#ffffff" />
    </svg>
  );
}

export function Wordmark({ dark = false, size = "text-lg" }: { dark?: boolean; size?: string }) {
  return (
    <span
      className={`font-display font-bold tracking-tight ${size} ${dark ? "text-white" : "text-heading"}`}
    >
      Rocket
      <span className="text-gradient-ember">MC</span>
    </span>
  );
}
