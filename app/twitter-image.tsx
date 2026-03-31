import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'ASAT — Agent Sats Reserve Protocol';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          background: '#050816',
          color: '#F4F6F8',
          padding: '54px',
          fontFamily: 'sans-serif',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
          }}
        >
          <div
            style={{
              height: 64,
              width: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.22)',
              background: '#081326',
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            A
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                fontSize: 34,
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}
            >
              ASAT
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 16,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#8FA3BC',
              }}
            >
              Reserve Protocol
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
          }}
        >
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.02,
              fontWeight: 700,
              letterSpacing: '-0.05em',
              maxWidth: 960,
            }}
          >
            Machine-native reserve layer for autonomous agents.
          </div>

          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: '#C8D2DF',
              maxWidth: 900,
            }}
          >
            Register wallets, secure tier visibility, and establish early position in the ASAT protocol.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 18,
            alignItems: 'center',
            fontSize: 18,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: '#8FA3BC',
          }}
        >
          <div>asatcoin.com</div>
          <div>•</div>
          <div>Solana</div>
          <div>•</div>
          <div>Registry Active</div>
        </div>
      </div>
    ),
    size
  );
}
