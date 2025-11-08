import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Generative UI';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f7f7f4',
          padding: '40px',
        }}
      >
        {/* Cursor Logo - Using SVG data */}
        <div
          style={{
            display: 'flex',
            width: '300px',
            height: '300px',
            marginBottom: '40px',
          }}
        >
          <svg
            width="300"
            height="300"
            viewBox="0 0 1024 1024"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M512 0L51.2 291.2V732.8L512 1024L972.8 732.8V291.2L512 0Z"
              fill="#1E1E1E"
            />
            <path
              d="M512 153.6L153.6 358.4V665.6L512 870.4L870.4 665.6V358.4L512 153.6Z"
              fill="#f7f7f4"
            />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: '72px',
            fontWeight: 700,
            color: '#1E1E1E',
            marginBottom: '20px',
            letterSpacing: '-0.02em',
          }}
        >
          Generative UI
        </div>

        {/* Description */}
        <div
          style={{
            display: 'flex',
            fontSize: '32px',
            color: '#6B6B6B',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          Ask questions & generate UI to display the answers
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

