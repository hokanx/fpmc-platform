type IconProps = { className?: string };

/**
 * Inline SVG only — no icon font, no sprite fetch, nothing external.
 * Every icon is decorative: each one sits next to a text label, so they are
 * aria-hidden and never carry meaning on their own.
 */
const base = (className = "h-6 w-6") => ({
  className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false as const,
});

export const CameraIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.7a1 1 0 0 0 .83-.45l.94-1.4A1 1 0 0 1 9.8 3.7h4.4a1 1 0 0 1 .83.45l.94 1.4A1 1 0 0 0 16.8 6h1.7A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);

export const FileIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
  </svg>
);

export const ClockIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const EuroIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M16.5 5.5a6.5 6.5 0 0 0-9.2 3M16.5 18.5a6.5 6.5 0 0 1-9.2-3" />
    <path d="M4 10.5h9M4 14h9" />
  </svg>
);

export const CheckIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const AlertIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M12 3.5 2.5 20h19z" />
    <path d="M12 9.5v4.5M12 17.2h.01" />
  </svg>
);

export const CloseIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const BackIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export const TranslateIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M3 6h10M8 4v2c0 4-2.2 7.3-5 9" />
    <path d="M6 12.5c1.8 2.4 4 4 6.5 4.8" />
    <path d="m13 21 4.2-10L21.5 21M14.8 17.5h4.9" />
  </svg>
);

export const MarkerIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <rect x="3" y="4" width="18" height="7" rx="1.5" fill="currentColor" stroke="none" />
    <path d="M3 15h11M3 19h7" />
  </svg>
);

export const PrintIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M7 9V4h10v5" />
    <path d="M5 9h14a2 2 0 0 1 2 2v5h-4v4H7v-4H3v-5a2 2 0 0 1 2-2z" />
    <path d="M7 16h10" />
  </svg>
);

export const CopyIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" />
  </svg>
);

export const ShareIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M12 3v13" />
    <path d="m8 7 4-4 4 4" />
    <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
  </svg>
);

export const UndoIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M4 8h10a5 5 0 0 1 0 10H9" />
    <path d="M4 8l4-4M4 8l4 4" />
  </svg>
);
