import React from "react";

export function DecaneLogo({ size = 28 }: { size?: number }) {
  const w = size;
  const h = Math.round((size * 64) / 68);
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 68 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#dl_logo_f0)">
        <path
          d="M32.8031 10.2986C33.1971 9.68929 34.0886 9.68929 34.4826 10.2986L35.7297 12.2273C36.1599 12.8926 35.6823 13.7703 34.89 13.7703H32.3957C31.6034 13.7703 31.1257 12.8926 31.556 12.2273L32.8031 10.2986Z"
          fill="#FFD700"
        />
        <path
          d="M16.6095 20.8798C25.5139 8.28662 47.0755 12.2298 51.4641 20.5617C54.9502 24.0479 55.2167 30.8018 55.2167 30.8018C55.2167 30.8018 58.8421 37.862 57.4428 41.3601C55.7891 56.7522 13.9381 57.0066 11.3304 41.3601C9.93111 37.0351 13.4293 31.3744 13.4293 31.3744C13.4293 31.3744 12.9841 27.2404 16.6095 20.8798Z"
          fill="#FFD700"
        />
        <ellipse
          cx="48.9999"
          cy="39.2669"
          rx="2.38155"
          ry="1.89957"
          transform="rotate(-22.395 48.9999 39.2669)"
          fill="#FFE55F"
          fillOpacity="0.45"
        />
        <ellipse
          cx="18.9785"
          cy="39.2671"
          rx="2.38155"
          ry="1.89958"
          transform="rotate(15.8893 18.9785 39.2671)"
          fill="#FFE55F"
          fillOpacity="0.26"
        />
        <path
          d="M43.5977 30.7344C43.1619 30.7344 42.6943 30.9653 42.3027 31.4824C41.9107 32.0001 41.6388 32.7597 41.6387 33.6406C41.6387 34.5217 41.9107 35.2821 42.3027 35.7998C42.6943 36.3168 43.1619 36.5479 43.5977 36.5479C44.0332 36.5477 44.5002 36.3166 44.8916 35.7998C45.2837 35.2821 45.5557 34.5217 45.5557 33.6406C45.5556 32.7597 45.2836 32.0001 44.8916 31.4824C44.5002 30.9656 44.0333 30.7345 43.5977 30.7344Z"
          fill="#1A1A1A"
          stroke="#F4EBBC"
          strokeWidth="2"
        />
        <path
          d="M25.1514 30.7344C25.5871 30.7344 26.0547 30.9653 26.4463 31.4824C26.8383 32.0001 27.1103 32.7597 27.1104 33.6406C27.1104 34.5217 26.8384 35.2821 26.4463 35.7998C26.0547 36.3168 25.5871 36.5479 25.1514 36.5479C24.7158 36.5477 24.2489 36.3166 23.8574 35.7998C23.4654 35.2821 23.1934 34.5217 23.1934 33.6406C23.1934 32.7597 23.4654 32.0001 23.8574 31.4824C24.2489 30.9656 24.7157 30.7345 25.1514 30.7344Z"
          fill="#1A1A1A"
          stroke="#F4EBBC"
          strokeWidth="2"
        />
        <path
          d="M26.0107 41.6924C26.0107 41.6924 28.0937 46.399 34.759 46.399C41.008 46.399 43.3109 41.6924 43.3109 41.6924"
          stroke="#1A1A1A"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <filter
          id="dl_logo_f0"
          x="0.589964"
          y="0.334365"
          width="66.5809"
          height="62.9754"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-0.501447" dy="0.401157" />
          <feGaussianBlur stdDeviation="4.95429" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.996078 0 0 0 0 0.996078 0 0 0 0 0.996078 0 0 0 0.12 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_7484_4856"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_7484_4856"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
