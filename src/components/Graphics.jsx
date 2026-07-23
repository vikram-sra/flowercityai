import React from 'react';
import roseLogoImg from '../assets/rose_logo.png';

/* ─────────────────────────────────────────────
   Rose Flower Logo Mark Component
   With Circular Clipping (Zero Square Box) & Glowing Pulse Ring
───────────────────────────────────────────── */
export function LogoMark({ size = 36, className = "" }) {
  return (
    <div
      className={`logo-circle-ring ${className}`}
      style={{
        width: size + 8,
        height: size + 8,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(61, 220, 151, 0.06)',
        border: '1.5px solid rgba(61, 220, 151, 0.4)',
        boxShadow: '0 0 12px rgba(61, 220, 151, 0.3)',
        flexShrink: 0
      }}
    >
      <img
        src={roseLogoImg}
        alt="Flower City AI Rose Logo"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '50%',
          clipPath: 'circle(47% at 50% 50%)',
          mixBlendMode: 'screen',
          filter: 'brightness(1.15) contrast(1.05)'
        }}
        className="ultra-minimal-rose"
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Clean Architectural Workflow Diagram (Vector)
───────────────────────────────────────────── */
export function WorkflowDiagram() {
  return (
    <div className="wf-diagram-container glass">
      <div className="wf-title-bar">
        <span className="wf-dot green"></span>
        <span className="wf-dot yellow"></span>
        <span className="wf-dot red"></span>
        <span className="wf-label">Flower City AI Architecture — End-to-End Operational Pipeline</span>
      </div>

      <div className="wf-stage-grid">
        {/* Step 1: Customer Friction */}
        <div className="wf-node glass">
          <div className="wf-icon-wrap blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div className="wf-node-info">
            <span className="wf-step-num">STEP 01 · INPUT</span>
            <h4>Incoming Request</h4>
            <p>11:42 PM Customer Text, WhatsApp, or Website Quote</p>
          </div>
        </div>

        {/* Animated Connector Arrow 1 */}
        <div className="wf-arrow">
          <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
            <path d="M0 12 H32 M26 6 L34 12 L26 18" stroke="#45c4ff" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="3" fill="#3ddc97" className="anim-pulse-dot" />
          </svg>
        </div>

        {/* Step 2: Flower City Translation Layer */}
        <div className="wf-node glass highlight-node">
          <div className="wf-icon-wrap green">
            <LogoMark size={28} />
          </div>
          <div className="wf-node-info">
            <span className="wf-step-num">STEP 02 · TRANSLATION</span>
            <h4>Flower City Engine</h4>
            <p>Translates complex intent, checks schedule &amp; pricing live</p>
          </div>
        </div>

        {/* Animated Connector Arrow 2 */}
        <div className="wf-arrow">
          <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
            <path d="M0 12 H32 M26 6 L34 12 L26 18" stroke="#3ddc97" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="3" fill="#45c4ff" className="anim-pulse-dot" />
          </svg>
        </div>

        {/* Step 3: Automated Action */}
        <div className="wf-node glass">
          <div className="wf-icon-wrap purple">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div className="wf-node-info">
            <span className="wf-step-num">STEP 03 · ACTION</span>
            <h4>Job Booked &amp; Invoiced</h4>
            <p>Calendar updated, deposit collected &amp; team notified instantly</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Grant Stacking Pipeline Graphic (Vector)
───────────────────────────────────────────── */
export function GrantStackGraphic() {
  return (
    <div className="grant-graphic-box glass">
      <svg width="100%" height="160" viewBox="0 0 600 160" fill="none" preserveAspectRatio="xMidYMid meet">
        <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
        <line x1="0" y1="80" x2="600" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
        <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

        <rect x="40" y="30" width="520" height="28" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" />
        <text x="50" y="49" fill="#98A2B3" fontSize="12" fontWeight="600">Original Technical Investment (100%)</text>

        <rect x="40" y="75" width="280" height="28" rx="8" fill="rgba(61, 220, 151, 0.2)" stroke="#3ddc97" strokeWidth="1.5" />
        <text x="50" y="94" fill="#3ddc97" fontSize="11" fontWeight="700">✓ OCI DCC / IRAP Subsidy (Covering 50% - 66%)</text>

        <rect x="325" y="75" width="165" height="28" rx="8" fill="rgba(69, 196, 255, 0.2)" stroke="#45c4ff" strokeWidth="1.5" />
        <text x="335" y="94" fill="#45c4ff" fontSize="11" fontWeight="700">+ Job Grant / SR&amp;ED (+25%)</text>

        <rect x="495" y="75" width="65" height="28" rx="8" fill="rgba(255, 184, 64, 0.25)" stroke="#ffb340" strokeWidth="1.5" />
        <text x="502" y="94" fill="#ffb340" fontSize="11" fontWeight="800">15-25% Net</text>

        <path d="M300 110 L300 135" stroke="#3ddc97" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="300" y="152" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">
          ⚡ Result: Your Business Only Pays 15% – 25% Out-Of-Pocket
        </text>
      </svg>
    </div>
  );
}
