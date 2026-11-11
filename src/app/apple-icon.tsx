import { ImageResponse } from "next/og";
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// The home-screen icon: the Decane mark on a dark rounded tile.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';
export const dynamic = 'force-static';

export default function AppleIcon() {
  const svg = readFileSync(join(process.cwd(), 'src/app/icon.svg'));
  const src = `data:image/svg+xml;base64,${svg.toString('base64')}`;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#14120d' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={128} height={128} alt="" />
      </div>
    ),
    size,
  );
}
