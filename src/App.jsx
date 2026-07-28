import React, { useState, useEffect, useRef } from 'react';
import GrantCalculator from './components/GrantCalculator';
import { LogoMark, WorkflowDiagram, GrantStackGraphic } from './components/Graphics';

/* Import generated imagery */
import aiRestaurantImg from './assets/ai_restaurant.png';
import aiWorkshopImg from './assets/ai_workshop.png';
import aiLogisticsImg from './assets/ai_logistics.png';
import aiConcreteImg from './assets/ai_concrete_estimator.png';

/* ─────────────────────────────────────────────
   Hooks
───────────────────────────────────────────── */
const useReducedMotion = () =>
  useRef(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches).current;

/* Reveal-on-scroll hook */
function useReveal(ref, delay = 3000) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('in'); obs.disconnect(); } },
      { threshold: 0.18 }
    );
    obs.observe(el);
    const t = setTimeout(() => el.classList.add('in'), delay);
    return () => { obs.disconnect(); clearTimeout(t); };
  }, []);
}

/* Animated counter */
function useCountUp(to, go, duration = 1200) {
  const reduced = useReducedMotion();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!go) return;
    if (reduced) { setVal(to); return; }
    let raf, start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [go, to, duration]);
  return val;
}

/* In-view observer */
function useInView(ref, threshold = 0.35, fallbackMs = 3500) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    const t = setTimeout(() => setInView(true), fallbackMs);
    return () => { obs.disconnect(); clearTimeout(t); };
  }, []);
  return inView;
}

/* ─────────────────────────────────────────────
   Live meters row
───────────────────────────────────────────── */
function Meters() {
  const ref = useRef(null);
  const go = useInView(ref, 0.4, 3000);
  const pct = useCountUp(80, go);
  const reply = useCountUp(4, go);
  const hours = useCountUp(15, go);
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    tick();
    const iv = setInterval(tick, 15000);
    return () => clearInterval(iv);
  }, []);
  const C = 106.8;

  return (
    <div className="meters" ref={ref}>
      <div className="meter glass">
        <span className="ring">
          <svg width="42" height="42" viewBox="0 0 42 42">
            <circle className="track" cx="21" cy="21" r="17" fill="none" strokeWidth="4" />
            <circle className="arc" cx="21" cy="21" r="17" fill="none" stroke="#3ddc97" strokeWidth="4"
              strokeDasharray={C} strokeDashoffset={go ? C * 0.2 : C} />
          </svg>
          <b>{pct}%</b>
        </span>
        <span><span className="lbl">Busywork automatable</span><span className="val">of a typical week</span></span>
      </div>
      <div className="meter glass">
        <span><span className="lbl"><span className="dotlive" />Live local time</span><span className="val">{time}</span></span>
      </div>
      <div className="meter glass">
        <span><span className="lbl">Avg. AI reply time</span><span className="val">{reply} sec</span></span>
      </div>
      <div className="meter glass">
        <span><span className="lbl">Hours saved per team</span><span className="val">{hours}+ /wk</span></span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   USP Section — Translating Technical Friction
───────────────────────────────────────────── */
function USPSection() {
  const stageRef = useRef(null);
  useReveal(stageRef);

  return (
    <section className="ch" id="solutions">
      <span className="chip"><i style={{ '--cc': 'var(--gA1)' }} />The Core Problem We Solve</span>
      <h2>Translating the invisible layer of technical friction.</h2>
      <p className="lead">Your business doesn't need another software subscription you don't know how to use. You need a dedicated partner to translate AI into real revenue &amp; saved hours.</p>

      <div className="usp-grid reveal" ref={stageRef}>
        <div className="usp-card glass friction">
          <div className="card-badge red">❌ Without Flower City AI</div>
          <h3>Invisible Technical Friction</h3>
          <ul className="usp-list">
            <li>Owner spends late nights answering quotes, emails &amp; scheduling manually.</li>
            <li>Inquiries missed outside business hours convert straight to competitors.</li>
            <li>Staff are overwhelmed with data entry, paper invoices &amp; repetitive follow-ups.</li>
            <li>Confusion over complex AI tools leads to wasted budgets and abandoned software.</li>
            <li>Zero knowledge of eligible federal and provincial grants to cover costs.</li>
          </ul>
        </div>

        <div className="usp-card glass solution">
          <div className="card-badge green">✅ With Flower City AI</div>
          <h3>Smooth Operational Translation</h3>
          <ul className="usp-list">
            <li>AI answers, books jobs &amp; dispatches details 24/7 on WhatsApp, web &amp; phone.</li>
            <li>Hands-on workshops train your actual staff to master daily AI tools in 1 day.</li>
            <li>Automated workflow integrations chase invoices and update records automatically.</li>
            <li>Plain-English audits identify exact ROI before writing a single line of code.</li>
            <li>We handle grant applications to cover 50% to 83%+ of your funding costs.</li>
          </ul>
        </div>
      </div>

      {/* Vector Architecture Diagram */}
      <div style={{ marginTop: 28 }}>
        <WorkflowDiagram />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Interactive Dual Demo Stage (Chat & Auto-Invoicing)
───────────────────────────────────────────── */
const DEMO_CHAT = [
  { c: 'cust', who: 'Customer', t: 'hey, open tomorrow? need a brake check on my truck' },
  { c: 'ai', who: 'AI · Village Auto Care', t: 'We are! 9:30 AM or 2:00 PM free — which suits you?' },
  { c: 'cust', who: '', t: '9:30 please 🙏' },
  { c: 'ai', who: '', t: 'Booked ✓ 9:30 AM brake check. Confirmation sent — see you then!' },
];

const DEMO_INVOICE = [
  { c: 'system', who: 'System Event', t: '🚛 Driver completed Load #402 (Brampton -> Mississauga)' },
  { c: 'ai', who: 'AI Automation Engine', t: 'POD document scanned &amp; verified. Generating Invoice #8920 ($1,450.00 CAD)...' },
  { c: 'cust', who: 'Broker Accounts', t: 'Invoice received. Quick Payment link clicked.' },
  { c: 'ai', who: 'Payment System', t: '✓ Paid $1,450.00 CAD. QuickBooks &amp; CRM updated automatically!' },
];

function DemoStage() {
  const [activeDemo, setActiveDemo] = useState('chat');
  const reduced = useReducedMotion();
  const stageRef = useRef(null);
  useReveal(stageRef);

  const currentList = activeDemo === 'chat' ? DEMO_CHAT : DEMO_INVOICE;
  const [shown, setShown] = useState(reduced ? currentList.length : 0);

  useEffect(() => {
    if (reduced) return;
    setShown(0);
    let t;
    const advance = (n) => {
      if (n > currentList.length) { t = setTimeout(() => { setShown(0); advance(1); }, 5200); return; }
      setShown(n);
      t = setTimeout(() => advance(n + 1), 1200);
    };
    advance(1);
    return () => clearTimeout(t);
  }, [activeDemo, reduced]);

  return (
    <section className="ch" id="demo">
      <span className="chip"><i style={{ '--cc': 'var(--gA1)' }} />Live interactive demos</span>
      <h2>See AI automations in action.</h2>
      <p className="lead">Test real workflows running end-to-end without human intervention.</p>

      {/* Demo Switcher Tabs */}
      <div className="ind-tabs" style={{ marginBottom: 18 }}>
        <button
          type="button"
          className={`ind-tab ${activeDemo === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveDemo('chat')}
        >
          💬 Demo 1: 24/7 Midnight Customer Booking
        </button>
        <button
          type="button"
          className={`ind-tab ${activeDemo === 'invoice' ? 'active' : ''}`}
          onClick={() => setActiveDemo('invoice')}
        >
          ⚡ Demo 2: Instant Dispatch &amp; Invoice Chaser
        </button>
      </div>

      <div className="stage chat reveal" ref={stageRef}>
        <div className="hud" style={{ top: 18, left: 18 }}>
          <span className="k">Workflow</span><b>{activeDemo === 'chat' ? '24/7 Customer AI' : 'Dispatch &amp; Invoice AI'}</b>
        </div>
        <div className="hud" style={{ top: 18, right: 18 }}>
          <span className="k">Execution Time</span><b>3.2 sec</b>
        </div>
        <div className="hud" style={{ bottom: 18, right: 18 }}>
          <span className="k">Status</span><b>Active ⚡</b>
        </div>

        <div className="chatcol">
          {currentList.slice(0, shown).map((m, i) => (
            <div key={`${activeDemo}-${i}`} className={`gb ${m.c} ${reduced ? '' : 'show'}`}
              style={reduced ? { opacity: 1, transform: 'none' } : undefined}>
              {m.who && <span className="who">{m.who}</span>}
              {m.t}
            </div>
          ))}
        </div>
      </div>
      <p className="cap">Every step is completed automatically in the background while you focus on your business.</p>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Industry Use Cases Section
───────────────────────────────────────────── */
const INDUSTRIES = [
  {
    id: 'reno',
    name: '🏗️ Concrete & Home Reno (Brampton)',
    stat: '~2,800 Brampton & GTA Contractors',
    headline: 'AI Concrete Estimator & Live Texture Visualizer for Driveways & Renovations',
    image: aiConcreteImg,
    points: [
      'Live AI area measurement & driveway quote calculator (1,200 SQ FT = $16,800 CAD)',
      'Instant visual texture preview generator (Broom Finish, Stamped Slate, Exposed Aggregate)',
      'Automated customer quote PDF generator & instant deposit payment collection'
    ]
  },
  {
    id: 'retail',
    name: '🍽️ Retail & Digital Restaurant Menus',
    stat: '~4,000 GTA Firms',
    headline: 'Digital Interactive Menus, Table Bookings & Instant QR Ordering',
    image: aiRestaurantImg,
    points: [
      'Interactive digital restaurant menu boards with live AI ordering',
      '24/7 AI table reservation booking system with SMS customer confirmations',
      'Automated menu stockout alerts & instant order dispatching to kitchen POS'
    ]
  },
  {
    id: 'logistics',
    name: '🚛 Logistics & Transportation',
    stat: '~1,500 GTA Firms',
    headline: 'Eliminate Dispatch Bottlenecks & Manual BOL Paperwork',
    image: aiLogisticsImg,
    points: [
      'Automated load status & POD document processing',
      'AI-powered route optimization and driver dispatching',
      'Instant rate quotes and automated broker email parsing'
    ]
  },
  {
    id: 'services',
    name: '💼 Professional & Field Services',
    stat: '~3,000 GTA Firms',
    headline: 'Stop Chasing Paperwork, Invoices & Calendar Schedules',
    image: aiWorkshopImg,
    points: [
      'Auto-generate customer quotes & job confirmations',
      'Automated invoice follow-ups & payment reminders via SMS/email',
      'CRM sync and document summarization for fast client reviews'
    ]
  }
];

function IndustrySolutions() {
  const [activeTab, setActiveTab] = useState('reno');
  const stageRef = useRef(null);
  useReveal(stageRef);

  const ind = INDUSTRIES.find(i => i.id === activeTab) || INDUSTRIES[0];

  return (
    <section className="ch">
      <span className="chip"><i style={{ '--cc': 'var(--gB1)' }} />Tailored Solutions</span>
      <h2>Built for Brampton &amp; GTA Businesses.</h2>
      <p className="lead">Practical AI integrations designed for local contractors, restaurants, transport fleets, and professional services.</p>

      <div className="ind-tabs">
        {INDUSTRIES.map(i => (
          <button
            key={i.id}
            type="button"
            className={`ind-tab ${activeTab === i.id ? 'active' : ''}`}
            onClick={() => setActiveTab(i.id)}
          >
            {i.name}
          </button>
        ))}
      </div>

      <div className="ind-card glass reveal" ref={stageRef}>
        <div className="ind-header-grid">
          <div>
            <span className="ind-stat">{ind.stat}</span>
            <h3>{ind.headline}</h3>
            <div className="ind-grid" style={{ marginTop: 16 }}>
              {ind.points.map((pt, idx) => (
                <div key={idx} className="ind-item glass">
                  <span className="ind-num">0{idx + 1}</span>
                  <p>{pt}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="ind-img-col">
            <img src={ind.image} alt={ind.name} className="ind-feature-img" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Education stage with skill meters
───────────────────────────────────────────── */
const SKILLS = [
  { label: 'Everyday AI use', v: 86 },
  { label: 'Prompting real tasks', v: 78 },
  { label: 'Spotting AI mistakes', v: 72 },
  { label: 'Fear of the robot', v: 8, invert: true, color: '#ffb199' },
];

function SkillBar({ label, v, invert, color, go }) {
  const reduced = useReducedMotion();
  const [num, setNum] = useState(invert ? 100 : 0);
  useEffect(() => {
    if (!go) return;
    if (reduced) { setNum(v); return; }
    let raf, start = null;
    const from = invert ? 100 : 0;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1500, 1);
      setNum(Math.round(from + (v - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [go]);
  return (
    <div className="skill">
      <div className="row"><span>{label}</span><b>{num}%</b></div>
      <div className="bar"><i style={{ width: go ? `${v}%` : '0%', background: color }} /></div>
    </div>
  );
}

function Education() {
  const stageRef = useRef(null);
  useReveal(stageRef);
  const go = useInView(stageRef);
  return (
    <section className="ch" id="learn">
      <span className="chip"><i style={{ '--cc': 'var(--gB1)' }} />Education first</span>
      <h2>We teach before we build.</h2>
      <p className="lead">Tools you don't understand become tools you don't use. After your consultation, <b>education comes before any build</b> — so your team owns the AI, not the other way around.</p>
      
      <div className="stage edu reveal" ref={stageRef}>
        <div className="eduCopy">
          <h3>Your team, fluent in AI in one day.</h3>
          <p>Hands-on workshops on your real work — quoting, emails, scheduling, paperwork. No slides full of theory. No jargon. Ever.</p>
          <div className="tags">
            <span className="tag">✍️ Writing &amp; quotes</span>
            <span className="tag">📅 Scheduling</span>
            <span className="tag">📄 Paperwork</span>
            <span className="tag">💬 Customer replies</span>
          </div>

          <div className="workshop-img-box">
            <img src={aiWorkshopImg} alt="AI Team Workshop" className="workshop-img" />
          </div>
        </div>
        <div className="eduCard">
          <h3>Team skill meter</h3>
          <p className="small">A typical crew, before lunch vs. after.</p>
          {SKILLS.map(s => <SkillBar key={s.label} {...s} go={go} />)}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Services
───────────────────────────────────────────── */
function Services() {
  const refs = [useRef(null), useRef(null), useRef(null)];
  refs.forEach(r => useReveal(r));
  const cards = [
    { ref: refs[0], cc: 'var(--gA1)', pop: 'Start here', step: 'Consult · 01', title: 'The readiness consultation', desc: 'A free call, then a plain-English audit: where your hours leak and what fixing it is worth — the exact document grant applications require.', price: 'from $500' },
    { ref: refs[1], cc: 'var(--gB1)', step: 'Teach · 02', title: 'AI training for your team', desc: 'One hands-on day. Your staff leave using AI on their actual work. Ontario Job Grants (COJG) cover up to 83%+ of training costs per employee.', price: 'from $500' },
    { ref: refs[2], cc: 'var(--gC1)', step: 'Build · 03', title: 'Automations, built for you', desc: 'Replies, bookings, invoicing — live in weeks. OCI Tech Demo grants matched 50% up to $50,000 for qualifying businesses.', price: 'from $1,000' },
  ];
  return (
    <section className="ch" id="services">
      <span className="chip"><i style={{ '--cc': 'var(--gD1)' }} />Services</span>
      <h2>Three ways to start.</h2>
      <p className="lead">Consultation first. Training next. Automation when the plan says it pays.</p>
      <div className="cards">
        {cards.map(c => (
          <div key={c.step} className="card glass reveal" ref={c.ref} style={{ '--cc': c.cc }}>
            {c.pop && <span className="pop">{c.pop}</span>}
            <span className="step">{c.step}</span>
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
            <span className="price">{c.price}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Funding & Grant Facts Section
───────────────────────────────────────────── */
const GRANT_FACTS = [
  {
    title: 'OCI DCC — Tech Demonstration',
    level: 'Ontario Provincial',
    amount: 'Up to $50,000',
    cov: '50% Matched Grant',
    desc: 'Provides 50% matched funding for SMEs to install and deploy digital tools, voice AI, automated workflows, and software.',
    badge: 'Adoption & Rollout'
  },
  {
    title: 'OCI DCC — Digital Modernization',
    level: 'Ontario Provincial',
    amount: 'Up to $15,000',
    cov: '50% Matched Strategy',
    desc: 'Covers 50% of consulting costs for AI readiness audits, digital transformation strategies, and architecture design.',
    badge: 'Strategy & Audit'
  },
  {
    title: 'Ontario Job Grant (OJG / COJG)',
    level: 'Ontario / Federal',
    amount: 'Up to $10K–$15K',
    cov: '50% – 83%+ Covered',
    desc: 'Funding to upskill existing staff or new hires on AI productivity tools through eligible third-party trainers.',
    badge: 'Team Upskilling'
  },
  {
    title: 'NRC IRAP & AI Assist',
    level: 'Federal (Canada)',
    amount: 'Salary Subsidies',
    cov: '50% – 80% Tech Salaries',
    desc: 'Direct payroll support covering 50% to 80% of internal developer and technical contractor salaries for custom AI R&D.',
    badge: 'Custom AI Build'
  },
  {
    title: 'SR&ED + OITC Tax Credit',
    level: 'Federal & Ontario',
    amount: 'Tax Cash-Back',
    cov: 'Up to 75%–80% Stacking',
    desc: 'Combines 35%-69% Federal SR&ED tax credits with 8% Ontario Innovation Tax Credit on proprietary R&D labor.',
    badge: 'R&D Tax Recovery'
  },
  {
    title: 'Critical Industrial Technologies (CIT)',
    level: 'Ontario Regional',
    amount: 'Up to $200,000',
    cov: '50% Matched',
    desc: 'Supports SMEs deploying AI, robotics, and workflow automation in logistics, manufacturing, agri-food, and mining.',
    badge: 'Logistics & Supply Chain'
  }
];

function Funding() {
  const stageRef = useRef(null);
  useReveal(stageRef);

  return (
    <section className="ch" id="funding">
      <span className="chip"><i style={{ '--cc': 'var(--gC1)' }} />Government Grants &amp; Subsidies</span>
      <h2>The government helps pay.</h2>
      <p className="lead">Canada and Ontario actively co-fund small business AI adoption, staff upskilling, and technical builds. We check your eligibility and handle the paperwork.</p>

      {/* Vector Stacking Graphic */}
      <GrantStackGraphic />

      {/* Grant Matrix Cards */}
      <div className="grant-matrix" style={{ marginTop: 24 }}>
        {GRANT_FACTS.map((g, idx) => (
          <div key={idx} className="g-card glass">
            <div className="g-card-top">
              <span className="g-level">{g.level}</span>
              <span className="g-badge">{g.badge}</span>
            </div>
            <h4>{g.title}</h4>
            <div className="g-stat-row">
              <span className="g-amt">{g.amount}</span>
              <span className="g-cov">{g.cov}</span>
            </div>
            <p>{g.desc}</p>
          </div>
        ))}
      </div>

      {/* Interactive Grant Calculator */}
      <div style={{ marginTop: 40 }}>
        <GrantCalculator />
      </div>

      <div className="stage money reveal" ref={stageRef} style={{ marginTop: 36 }}>
        <span className="fsub">Building Custom Tech Stacking Strategy</span>
        <div className="fundNum">Up to 80%</div>
        <span className="fsub">of technical developer salaries offset by combining IRAP + SR&amp;ED + OITC</span>
        <p className="fine2">Adopting off-the-shelf AI? <b>OCI DCC Tech Demonstration &amp; Ontario Job Grants</b> offset 50% to 83% of adoption and training costs.</p>
        <p className="fine">Funding is limited and allocated on intake cycles. We confirm active eligibility before promising any figures.</p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FAQ
───────────────────────────────────────────── */
const FAQS = [
  { q: 'Will AI replace my staff?', a: 'No — it takes repetitive busywork off their plate so they can focus on high-value work. That\'s why we teach your team first before automating.' },
  { q: 'I\'m not technical. Is that a problem?', a: 'That is exactly who we serve. We translate the invisible layer of technical friction into plain English. If you can send a text message, you are fully qualified.' },
  { q: 'What does it cost?', a: 'Readiness audits & training start at $500. Automations start from $1,000. Ongoing maintenance from $300/month. First consultation call is 100% free — and grants cover 50% to 83%+ of costs.' },
  { q: 'Are these government grants actually real?', a: 'Yes. Ontario\'s OCI DCC programs provide up to $65,000 matched funding ($15K strategy + $50K Tech Demo), Ontario Job Grants cover up to $10,000–$15,000 per employee for training, and NRC IRAP + SR&ED cover developer labor for custom R&D. We confirm what is live for your business before submitting.' },
  { q: 'How fast do I see results?', a: 'Training pays off the same day. Workflows and chatbots go live within 2–4 weeks of your audit.' },
];

function FAQ() {
  const [open, setOpen] = useState(-1);
  return (
    <section className="ch" id="faq">
      <span className="chip"><i style={{ '--cc': 'var(--gD2)' }} />FAQ</span>
      <h2>Straight answers.</h2>
      <p className="lead">The five things every owner asks first.</p>
      <div className="faq">
        {FAQS.map((f, i) => (
          <div key={f.q} className={`qa glass ${open === i ? 'open' : ''}`}>
            <button type="button" onClick={() => setOpen(open === i ? -1 : i)}>
              {f.q}<span className="pm">+</span>
            </button>
            <div className="a"><p>{f.a}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Contact — wired to Google Forms
───────────────────────────────────────────── */
function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const googleFormData = new FormData();
    googleFormData.append('entry.1395438875', formData.get('name'));
    googleFormData.append('entry.899738670', formData.get('business'));
    googleFormData.append('entry.873934759', formData.get('email'));
    googleFormData.append('entry.343597103', formData.get('phone') || '');
    googleFormData.append('entry.349162794', formData.get('industry'));
    googleFormData.append('entry.913858987', formData.get('pain_point'));
    fetch('https://docs.google.com/forms/d/e/1FAIpQLSdFKWq1ojAeCN217B0BKPIlvlt4LUUxuhxf0WmGqXTq5eNVaQ/formResponse', {
      method: 'POST', mode: 'no-cors', body: googleFormData,
    }).then(() => setSubmitted(true)).catch(() => setSubmitted(true));
  };

  return (
    <section className="ch" id="contact">
      <span className="chip"><i style={{ '--cc': 'var(--gD1)' }} />Book a call</span>
      <h2>Thirty minutes. Zero jargon.</h2>
      <p className="lead">Walk away knowing exactly what AI could do for your business — and which government grants you qualify for.</p>
      <div className="contact">
        {submitted ? (
          <div className="form glass">
            <div className="ok">
              <b>Got it — we'll be in touch! 🎉</b>
              <p>We reply within 24 hours, GTA time.</p>
            </div>
          </div>
        ) : (
          <form className="form glass" onSubmit={handleSubmit}>
            <div className="frow">
              <input required type="text" name="name" placeholder="Your name" aria-label="Your name" />
              <input required type="text" name="business" placeholder="Business name" aria-label="Business name" />
            </div>
            <div className="frow">
              <input required type="email" name="email" placeholder="Email" aria-label="Email" />
              <input type="tel" name="phone" placeholder="Phone (optional)" aria-label="Phone" />
            </div>
            <select required name="industry" defaultValue="" aria-label="Industry">
              <option value="" disabled>Your industry…</option>
              <option>Concrete &amp; Construction (Brampton &amp; GTA)</option>
              <option>Logistics &amp; Transportation</option>
              <option>Retail &amp; Restaurants</option>
              <option>Real Estate</option>
              <option>Other Professional Services</option>
              <option>Other</option>
            </select>
            <textarea required name="pain_point" placeholder="What eats the most of your time each week?" aria-label="Biggest time waster" />
            <button className="send" type="submit">Book my free call &amp; grant check →</button>
          </form>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SEO Regional Coverage & Service Hubs
───────────────────────────────────────────── */
function ServiceLocations() {
  return (
    <section className="ch" id="locations" style={{ marginTop: 60, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <span className="chip"><i style={{ '--cc': 'var(--gA1)' }} />Canada-Wide AI Advisory</span>
      <h2 style={{ fontSize: '1.8rem' }}>#1 AI Consulting &amp; Automation Firm in Toronto, GTA &amp; Canada</h2>
      <p className="lead" style={{ fontSize: '1rem', maxWidth: 780, margin: '0 auto 24px' }}>
        Based in Brampton and the Greater Toronto Area, <b>Flower City AI (flowercityai.ca)</b> helps Canadian business leaders implement high-ROI AI agents, automated operations, and hands-on staff training—part-funded by government grants.
      </p>

      <div className="cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginTop: 24 }}>
        <div className="card glass" style={{ padding: '24px', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#3ddc97', marginBottom: 8 }}>Greater Toronto Area (GTA) Hub</h3>
          <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
            On-site &amp; remote AI consulting for businesses across Toronto, Brampton, Mississauga, Vaughan, Markham, Richmond Hill, Oakville, Burlington &amp; Durham Region.
          </p>
        </div>

        <div className="card glass" style={{ padding: '24px', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#45c4ff', marginBottom: 8 }}>Ontario &amp; Tech Corridor</h3>
          <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
            Custom AI integrations &amp; COJG grant training for companies in Hamilton, Kitchener-Waterloo, Cambridge, Guelph, London, Barrie, Niagara &amp; Ottawa.
          </p>
        </div>

        <div className="card glass" style={{ padding: '24px', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#ffb199', marginBottom: 8 }}>National AI Advisory (Canada)</h3>
          <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
            Serving clients across Alberta (Calgary, Edmonton), BC (Vancouver, Victoria), Quebec (Montreal), Manitoba, Nova Scotia &amp; coast-to-coast remote operations.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   App Layout — Perfectly Formatted Navigation Bar
───────────────────────────────────────────── */
export default function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="canvas">
      <div className="glow" style={{ top: -120, left: '8%', width: 420, height: 420, background: 'var(--gA3)' }} />
      <div className="glow" style={{ top: 820, right: '4%', width: 380, height: 380, background: 'var(--gB1)' }} />
      <div className="glow" style={{ top: 1900, left: '2%', width: 400, height: 400, background: 'var(--gC1)' }} />
      <div className="glow" style={{ bottom: 400, right: '8%', width: 380, height: 380, background: 'var(--gD2)' }} />

      {/* Balanced 3-Column Navigation Header */}
      <nav className="nav">
        <a href="#" className="brand-wrap">
          <LogoMark size={32} />
          <div className="brand-text">
            <span className="brand-title">Flower City AI</span>
            <span className="brand-sub">Toronto &amp; GTA · Canada</span>
          </div>
        </a>

        <div className="links">
          <a href="#solutions">Solutions</a>
          <a href="#funding">Grants &amp; Funding</a>
          <a href="#services">Services</a>
          <a href="#locations">Coverage</a>
        </div>

        <div className="nav-right">
          <a className="cta-s" href="#contact">Book a free call</a>
          <button
            className="mobile-nav-toggle"
            aria-label="Toggle menu"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            {mobileNavOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {mobileNavOpen && (
        <div className="mobile-drawer glass">
          <a href="#solutions" onClick={() => setMobileNavOpen(false)}>Solutions</a>
          <a href="#funding" onClick={() => setMobileNavOpen(false)}>Grants &amp; Funding</a>
          <a href="#services" onClick={() => setMobileNavOpen(false)}>Services</a>
          <a href="#locations" onClick={() => setMobileNavOpen(false)}>Coverage</a>
          <a className="cta-s" href="#contact" onClick={() => setMobileNavOpen(false)}>Book a free call</a>
        </div>
      )}

      {/* Hero Section */}
      <header className="hero">
        <div style={{ display: 'inline-block', marginBottom: 14 }}>
          <LogoMark size={56} />
        </div>

        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(61, 220, 151, 0.08)',
            border: '1px solid rgba(61, 220, 151, 0.25)',
            borderRadius: 20,
            padding: '6px 14px',
            fontSize: '0.85rem',
            color: '#3ddc97',
            fontWeight: 600,
            marginBottom: 16
          }}>
            <span>🇨🇦</span> #1 AI Consulting &amp; Automation Agency in Toronto, GTA &amp; Canada
          </div>
        </div>

        <h1>Your business, <span className="grad">running on autopilot.</span></h1>
        <p className="sub">Practical AI that replies to customers, books jobs, and chases invoices — and a team that <b>teaches yours to run it.</b> Part-funded by Canadian government grants.</p>
        <a className="cta" href="#contact">Book a free 30-min call &amp; grant check <span className="ico">→</span></a>
        <span className="cta-sub">flowercityai.ca · No jargon · No pressure · Honest eligibility fit check</span>
      </header>

      <Meters />
      <USPSection />
      <DemoStage />
      <IndustrySolutions />
      <Education />
      <Services />
      <Funding />
      <FAQ />
      <Contact />
      <ServiceLocations />

      <footer>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 10 }}>
          <LogoMark size={28} />
          <b style={{ fontSize: 16, color: '#fff' }}>Flower City AI | flowercityai.ca</b>
        </div>
        Toronto &amp; GTA-born · #1 AI Consulting &amp; Automation Agency serving all of Canada · © {new Date().getFullYear()}
        <div className="flinks">
          <a href="#solutions">Solutions</a>
          <a href="#funding">Grants &amp; Funding</a>
          <a href="#services">Services</a>
          <a href="#locations">Coverage</a>
          <a href="#contact">Contact</a>
        </div>
      </footer>
    </div>
  );
}
