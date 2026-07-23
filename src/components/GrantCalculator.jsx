import React, { useState } from 'react';

const GOALS = [
  {
    id: 'adopt',
    title: 'Adopting AI Tools & Automations',
    subtitle: 'Installing chatbots, voice AI, automated invoicing & CRM workflows',
    coveragePct: '50%',
    maxFunding: '$65,000',
    programs: [
      { name: 'OCI DCC Tech Demonstration', cap: 'Up to $50,000', match: '50% matched', tag: 'Ontario' },
      { name: 'OCI DCC Digital Modernization', cap: 'Up to $15,000', match: '50% matched strategy', tag: 'Ontario' },
    ],
    strategy: 'Stack OCI Digital Modernization ($15K strategy) with Tech Demonstration ($50K rollout) to cover half of your implementation costs.',
    note: 'Requires 1–499 employees, incorporated in Ontario for 1+ years.'
  },
  {
    id: 'train',
    title: 'Training Staff on Practical AI',
    subtitle: 'Upskilling your team on ChatGPT, Claude, Copilot & operational prompts',
    coveragePct: '50% – 83%',
    maxFunding: '$15,000 / staff',
    programs: [
      { name: 'Ontario Job Grant (OJG / COJG)', cap: 'Up to $10,000 - $15,000 per employee', match: 'Up to 83% covered', tag: 'Ontario / Federal' },
    ],
    strategy: 'For small businesses (<100 staff), government covers 83% of training fees. For hiring & upskilling previously unemployed hires, funding reaches up to 100%.',
    note: 'Must use an eligible third-party trainer (like Flower City AI).'
  },
  {
    id: 'build',
    title: 'Building Proprietary AI Software',
    subtitle: 'Developing custom machine learning models, algorithms or IP',
    coveragePct: '75% – 80%',
    maxFunding: 'Tax Credits + Salaries',
    programs: [
      { name: 'NRC IRAP & AI Assist', cap: '50% – 80% developer salaries', match: 'Direct wage subsidy', tag: 'Federal' },
      { name: 'SR&ED + OITC Tax Credits', cap: 'Up to 43% – 69% cash back on R&D', match: 'Tax refund', tag: 'Federal & Ontario' },
    ],
    strategy: 'Stack NRC IRAP developer salary subsidies with SR&ED and Ontario Innovation Tax Credit (OITC) to recoup up to 80% of technical payroll.',
    note: 'Projects must solve technical uncertainty or develop proprietary technology.'
  },
  {
    id: 'logistics',
    title: 'Logistics & Industrial Automation',
    subtitle: 'Deploying AI dispatching, fleet routing, agri-food or supply chain automation',
    coveragePct: '50%',
    maxFunding: 'Up to $200,000',
    programs: [
      { name: 'Critical Industrial Technologies (CIT)', cap: 'Up to $200,000', match: '50% matched', tag: 'Ontario' },
      { name: 'Scale AI Supercluster', cap: 'Up to 50% project costs', match: 'Co-funded', tag: 'Federal' },
    ],
    strategy: 'Leverage CIT and Scale AI grants to transform manual dispatching, route optimization, and document processing in transportation & manufacturing hubs.',
    note: 'Ideal for Brampton & GTA logistics, warehousing, and industrial operations.'
  }
];

export default function GrantCalculator() {
  const [selectedGoal, setSelectedGoal] = useState('adopt');
  const [teamSize, setTeamSize] = useState('6-20');
  const [estCost, setEstCost] = useState(10000);

  const goal = GOALS.find(g => g.id === selectedGoal) || GOALS[0];

  let calculatedGrant = 0;
  let outOfPocket = 0;

  if (selectedGoal === 'adopt') {
    const matchedGrant = Math.min(estCost * 0.5, 65000);
    calculatedGrant = matchedGrant;
    outOfPocket = estCost - matchedGrant;
  } else if (selectedGoal === 'train') {
    const staffCount = teamSize === '1-5' ? 3 : teamSize === '6-20' ? 10 : 25;
    const rate = 0.83;
    const totalTrainCost = Math.min(estCost, staffCount * 2500);
    calculatedGrant = Math.round(totalTrainCost * rate);
    outOfPocket = totalTrainCost - calculatedGrant;
  } else if (selectedGoal === 'build') {
    calculatedGrant = Math.round(estCost * 0.75);
    outOfPocket = estCost - calculatedGrant;
  } else {
    calculatedGrant = Math.min(Math.round(estCost * 0.5), 200000);
    outOfPocket = estCost - calculatedGrant;
  }

  return (
    <div className="grant-calc-wrapper glass">
      <div className="calc-header">
        <div className="calc-badge">⚡ Interactive Grant Calculator</div>
        <h3>Check Your AI Funding &amp; Grant Coverage</h3>
        <p className="calc-sub">Select your business objective to estimate available Canadian &amp; Ontario government grants.</p>
      </div>

      <div className="calc-grid">
        {/* Left column: Inputs */}
        <div className="calc-inputs">
          <label className="calc-label">1. What is your primary AI goal?</label>
          <div className="goal-options">
            {GOALS.map(g => (
              <button
                key={g.id}
                type="button"
                className={`goal-btn ${selectedGoal === g.id ? 'active' : ''}`}
                onClick={() => setSelectedGoal(g.id)}
              >
                <div className="g-title">{g.title}</div>
                <div className="g-sub">{g.subtitle}</div>
              </button>
            ))}
          </div>

          <div className="calc-row">
            <div className="calc-field">
              <label className="calc-label">2. Company Team Size</label>
              <div className="pill-group">
                {['1-5', '6-20', '21-50+'].map(size => (
                  <button
                    key={size}
                    type="button"
                    className={`pill-btn ${teamSize === size ? 'active' : ''}`}
                    onClick={() => setTeamSize(size)}
                  >
                    {size} employees
                  </button>
                ))}
              </div>
            </div>

            <div className="calc-field">
              <label className="calc-label">
                3. Estimated Project Budget: <b>${estCost.toLocaleString()} CAD</b>
              </label>
              <input
                type="range"
                min="2000"
                max="100000"
                step="1000"
                value={estCost}
                onChange={(e) => setEstCost(Number(e.target.value))}
                className="calc-slider"
              />
              <div className="slider-labels">
                <span>$2,000</span>
                <span>$50,000</span>
                <span>$100,000+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Results display */}
        <div className="calc-results glass">
          <div className="res-card-top">
            <span className="res-title">Estimated Government Grant Support</span>
            <div className="res-amount">${calculatedGrant.toLocaleString()} <span className="res-currency">CAD</span></div>
            <div className="res-pills">
              <span className="badge-coverage">Coverage: {goal.coveragePct}</span>
              <span className="badge-cap">Cap: {goal.maxFunding}</span>
            </div>
          </div>

          <div className="res-breakdown">
            <div className="b-row">
              <span>Total Estimated Project:</span>
              <b>${estCost.toLocaleString()} CAD</b>
            </div>
            <div className="b-row highlight">
              <span>Govt Grant / Subsidy:</span>
              <b className="green-text">-${calculatedGrant.toLocaleString()} CAD</b>
            </div>
            <div className="b-row">
              <span>Your Estimated Net Investment:</span>
              <b>${outOfPocket.toLocaleString()} CAD</b>
            </div>
          </div>

          <div className="res-programs">
            <div className="prog-heading">Applicable Grant Programs:</div>
            {goal.programs.map((p, idx) => (
              <div key={idx} className="prog-item">
                <div className="p-header">
                  <span className="p-name">{p.name}</span>
                  <span className="p-tag">{p.tag}</span>
                </div>
                <div className="p-details">{p.cap} · <i>{p.match}</i></div>
              </div>
            ))}
          </div>

          <div className="res-strategy">
            <b>💡 Stacking Strategy:</b> {goal.strategy}
          </div>
          <div className="res-note">
            <small><b>Eligibility Note:</b> {goal.note}</small>
          </div>

          <a href="#contact" className="calc-cta-btn">
            Confirm Grant Eligibility On A Call →
          </a>
        </div>
      </div>
    </div>
  );
}
