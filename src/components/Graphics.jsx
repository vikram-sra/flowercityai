import React from 'react';
import roseLogoImg from '../assets/rose_logo.png';

/* Shared cursor-spotlight handler */
const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
};

/* ─────────────────────────────────────────────
   Rose logo mark — circular clip + pulse ring
───────────────────────────────────────────── */
export function LogoMark({ size = 36, className = '' }) {
  return (
    <div
      className={`logo-circle-ring ${className}`.trim()}
      style={{
        width: size + 8,
        height: size + 8,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(61, 220, 151, 0.06)',
        flexShrink: 0,
      }}
    >
      <img
        src={roseLogoImg}
        alt="Flower City AI"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '50%',
          clipPath: 'circle(47% at 50% 50%)',
          mixBlendMode: 'screen',
          filter: 'brightness(1.15) contrast(1.05)',
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   End-to-end pipeline diagram
───────────────────────────────────────────── */
const STEPS = [
  {
    tone: 'blue', num: 'In · 01', title: 'Request arrives', body: '11:42 PM text, WhatsApp or web quote',
    icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  },
  {
    tone: 'green', num: 'Engine · 02', title: 'Flower City engine', body: 'Reads intent, checks calendar and pricing',
    logo: true,
  },
  {
    tone: 'purple', num: 'Out · 03', title: 'Booked & invoiced', body: 'Calendar set, deposit taken, team pinged',
    icon: <polyline points="20 6 9 17 4 12" />,
  },
];

function Arrow({ stroke, dot }) {
  return (
    <div className="wf-arrow" aria-hidden="true">
      <svg width="38" height="24" viewBox="0 0 40 24" fill="none">
        <path d="M0 12 H32 M26 6 L34 12 L26 18" stroke={stroke} strokeWidth="2" strokeLinecap="round" opacity=".7" />
        <circle cx="12" cy="12" r="3" fill={dot} className="anim-pulse-dot" />
      </svg>
    </div>
  );
}

export function WorkflowDiagram() {
  return (
    <div className="wf-diagram-container glass">
      <div className="wf-title-bar">
        <span className="wf-dot green" />
        <span className="wf-dot yellow" />
        <span className="wf-dot red" />
        <span className="wf-label">End-to-end pipeline</span>
      </div>

      <div className="wf-stage-grid">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.num}>
            <div
              className={`wf-node glass spot ${s.tone === 'green' ? 'highlight-node' : ''}`}
              onMouseMove={spot}
            >
              <div className={`wf-icon-wrap ${s.tone}`}>
                {s.logo ? (
                  <LogoMark size={24} />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    {s.icon}
                  </svg>
                )}
              </div>
              <div className="wf-node-info">
                <span className="wf-step-num">{s.num}</span>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <Arrow stroke={i === 0 ? '#45c4ff' : '#3ddc97'} dot={i === 0 ? '#3ddc97' : '#45c4ff'} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Grant stacking graphic — bars grow when revealed
───────────────────────────────────────────── */
export function GrantStackGraphic() {
  return (
    <div className="grant-graphic-box glass">
      <svg width="100%" height="150" viewBox="0 0 600 150" fill="none" preserveAspectRatio="xMidYMid meet" role="img"
        aria-label="Grant stacking: subsidies cover 75 to 85 percent, leaving 15 to 25 percent out of pocket">
        <text x="40" y="20" fill="#5F6A7D" fontSize="10" fontWeight="800" letterSpacing="1.4">YOUR PROJECT COST</text>

        <rect x="40" y="28" width="520" height="26" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.10)" />
        <text x="52" y="45" fill="#9AA4B6" fontSize="11.5" fontWeight="600">100% before funding</text>

        <text x="40" y="80" fill="#5F6A7D" fontSize="10" fontWeight="800" letterSpacing="1.4">AFTER STACKING</text>

        <g className="growbar" style={{ '--gd': '0ms' }}>
          <rect x="40" y="88" width="280" height="26" rx="8" fill="rgba(61,220,151,0.18)" stroke="#3ddc97" strokeWidth="1.5" />
          <text x="52" y="105" fill="#3ddc97" fontSize="11" fontWeight="700">OCI DCC / IRAP · 50–66%</text>
        </g>

        <g className="growbar" style={{ '--gd': '220ms' }}>
          <rect x="325" y="88" width="165" height="26" rx="8" fill="rgba(69,196,255,0.18)" stroke="#45c4ff" strokeWidth="1.5" />
          <text x="336" y="105" fill="#45c4ff" fontSize="11" fontWeight="700">Job Grant · +25%</text>
        </g>

        <g className="growbar" style={{ '--gd': '420ms' }}>
          <rect x="495" y="88" width="65" height="26" rx="8" fill="rgba(255,179,64,0.22)" stroke="#ffb340" strokeWidth="1.5" />
          <text x="503" y="105" fill="#ffb340" fontSize="10.5" fontWeight="800">15–25%</text>
        </g>

        <text x="40" y="138" fill="#ffffff" fontSize="12" fontWeight="700">
          You pay 15–25% out of pocket.
        </text>
      </svg>
    </div>
  );
}
