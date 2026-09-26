// Small icon set for the marketing pages. Brand marks (Google, X) follow the
// official geometry; the rest are 1.8px line icons on a 24-unit grid so they
// sit at the same weight as the Geist text beside them.

type P = { size?: number };

export function GoogleMark({ size = 18 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6 1.5 7.4 2.8l5.4-5.3C33.5 3.9 29.2 2 24 2 15.4 2 8 7 4.7 14.2l6.3 4.9C12.6 13.4 17.8 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46 24.5c0-1.6-.1-2.8-.4-4H24v7.5h12.6c-.3 2.2-1.7 5.5-4.9 7.7l6.1 4.7C41.5 37 46 31.4 46 24.5z" />
      <path fill="#FBBC05" d="M11 29.1a13.9 13.9 0 0 1 0-10l-6.3-4.9A22 22 0 0 0 2 24c0 3.5.8 6.9 2.4 9.8L11 29.1z" />
      <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.4l-6.1-4.7c-1.7 1.2-4 2-8.4 2-6.2 0-11.4-4-13.1-9.6l-6.3 4.9C7.9 40.9 15.3 46 24 46z" />
    </svg>
  );
}

export function XLogo({ size = 16 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function MailIcon({ size = 18 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...line} aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

export function PhoneIcon({ size = 18 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...line} aria-hidden>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18h2" />
    </svg>
  );
}

export function ChatIcon({ size = 18 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...line} aria-hidden>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.2a.6.6 0 0 1-1-.5V16A2.5 2.5 0 0 1 4 13.5z" />
      <path d="M8.5 9h7M8.5 12.5h4.5" />
    </svg>
  );
}

export function KeyIcon({ size = 18 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...line} aria-hidden>
      <circle cx="8" cy="12" r="4" />
      <path d="M12 12h9M18 12v3M15 12v2.5" />
    </svg>
  );
}

export function CopyIcon({ size = 15 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...line} aria-hidden>
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15" />
    </svg>
  );
}

export function CheckIcon({ size = 15 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...line} strokeWidth={2.2} aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
