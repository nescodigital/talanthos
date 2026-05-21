// Gold line-art SVGs for each Biblical Money Type
// Stroke: #b88a4a, stroke-width: 1.4, fill: none

export const SYMBOLS: Record<string, string> = {
  visionary: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width:140px;height:140px;">
    <!-- Crown / open diadem -->
    <path d="M20 85 L30 45 L60 25 L90 45 L100 85" stroke="#b88a4a" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20 85 Q60 75 100 85" stroke="#b88a4a" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <circle cx="30" cy="45" r="2.5" stroke="#b88a4a" stroke-width="1.4" fill="none"/>
    <circle cx="60" cy="25" r="2.5" stroke="#b88a4a" stroke-width="1.4" fill="none"/>
    <circle cx="90" cy="45" r="2.5" stroke="#b88a4a" stroke-width="1.4" fill="none"/>
    <path d="M35 50 Q60 40 85 50" stroke="#b88a4a" stroke-width="0.8" fill="none" stroke-linecap="round"/>
  </svg>`,

  guardian: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width:140px;height:140px;">
    <!-- Grain sheaf / storehouse -->
    <path d="M60 20 Q75 35 80 55" stroke="#b88a4a" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M60 20 Q45 35 40 55" stroke="#b88a4a" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M60 20 L60 55" stroke="#b88a4a" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M60 20 Q70 28 75 40" stroke="#b88a4a" stroke-width="1.0" fill="none" stroke-linecap="round"/>
    <path d="M60 20 Q50 28 45 40" stroke="#b88a4a" stroke-width="1.0" fill="none" stroke-linecap="round"/>
    <path d="M42 55 Q60 48 78 55" stroke="#b88a4a" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M42 55 L40 95 Q60 90 80 95 L78 55" stroke="#b88a4a" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M48 65 Q60 62 72 65" stroke="#b88a4a" stroke-width="0.8" fill="none" stroke-linecap="round"/>
    <path d="M48 75 Q60 72 72 75" stroke="#b88a4a" stroke-width="0.8" fill="none" stroke-linecap="round"/>
  </svg>`,

  giver: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width:140px;height:140px;">
    <!-- Open cupped hands releasing upward -->
    <path d="M30 75 Q25 55 35 45 Q45 38 55 48" stroke="#b88a4a" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M90 75 Q95 55 85 45 Q75 38 65 48" stroke="#b88a4a" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M55 48 L60 55 L65 48" stroke="#b88a4a" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M35 75 Q45 72 55 75" stroke="#b88a4a" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M65 75 Q75 72 85 75" stroke="#b88a4a" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <!-- rays -->
    <path d="M60 25 L60 15" stroke="#b88a4a" stroke-width="0.8" fill="none" stroke-linecap="round"/>
    <path d="M48 30 L42 22" stroke="#b88a4a" stroke-width="0.8" fill="none" stroke-linecap="round"/>
    <path d="M72 30 L78 22" stroke="#b88a4a" stroke-width="0.8" fill="none" stroke-linecap="round"/>
  </svg>`,

  builder: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width:140px;height:140px;">
    <!-- Wall section with plumb line -->
    <rect x="25" y="40" width="70" height="55" stroke="#b88a4a" stroke-width="1.4" fill="none" rx="1"/>
    <line x1="25" y1="55" x2="95" y2="55" stroke="#b88a4a" stroke-width="0.8"/>
    <line x1="25" y1="70" x2="95" y2="70" stroke="#b88a4a" stroke-width="0.8"/>
    <line x1="25" y1="85" x2="95" y2="85" stroke="#b88a4a" stroke-width="0.8"/>
    <line x1="48" y1="40" x2="48" y2="95" stroke="#b88a4a" stroke-width="0.8"/>
    <line x1="72" y1="40" x2="72" y2="95" stroke="#b88a4a" stroke-width="0.8"/>
    <!-- Plumb line -->
    <circle cx="60" cy="18" r="3" stroke="#b88a4a" stroke-width="1.4" fill="none"/>
    <line x1="60" y1="21" x2="60" y2="95" stroke="#b88a4a" stroke-width="0.6" stroke-dasharray="3 2"/>
    <polygon points="60,95 57,102 63,102" stroke="#b88a4a" stroke-width="1.0" fill="none"/>
  </svg>`,
};
