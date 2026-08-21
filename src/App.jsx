import React, { useState, useEffect, useRef, useCallback } from 'react';
import GrantCalculator from './components/GrantCalculator';
import { LogoMark, WorkflowDiagram, GrantStackGraphic } from './components/Graphics';

/* Import generated imagery */
import aiRestaurantImg from './assets/ai_restaurant.png';
import aiWorkshopImg from './assets/ai_workshop.png';
import aiLogisticsImg from './assets/ai_logistics.png';
import aiConcreteImg from './assets/ai_concrete_estimator.png';

/* ─────────────────────────────────────────────
   Motion primitives
───────────────────────────────────────────── */
const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const useReducedMotion = () => useRef(prefersReduced()).current;

/* Reveal wrapper: <Rv d={80} v="scale">…</Rv>
   Reveal state lives in React so re-renders never drop the class. */
function Rv({ as: Tag = 'div', v = 'up', d = 0, className = '', style, children, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) { setShown(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); obs.disconnect(); } },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`rv ${shown ? 'in' : ''} ${className}`.replace(/\s+/g, ' ').trim()}
      data-rv={v}
      style={{ '--rv-d': `${d}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* Cursor spotlight — spread onto any .spot surface */
const spotProps = {
  onMouseMove: (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  },
};

/* Animated counter */
function useCountUp(to, go, duration = 1400) {
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
function useInView(ref, threshold = 0.3) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) { setInView(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return inView;
}

/* Word-by-word headline entrance */
function Words({ text, start = 0, className = '' }) {
  const words = text.split(' ');
  return (
    <span className={`w ${className}`.trim()}>
      {words.map((word, i) => (
        <i key={i} style={{ '--i': start + i }}>
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </i>
      ))}
    </span>
  );
}

/* Section header — one consistent scan anchor for every chapter */
function Head({ cc, chip, title, lead }) {
  return (
    <>
      <Rv as="span" v="fade" className="chip" style={{ '--cc': cc }}><i style={{ '--cc': cc }} />{chip}</Rv>
      <Rv as="h2" d={70}>{title}</Rv>
      {lead && <Rv as="p" className="lead" d={130}>{lead}</Rv>}
    </>
  );
}

/* ─────────────────────────────────────────────
   Live meters
───────────────────────────────────────────── */
function Meters() {
  const ref = useRef(null);
  const go = useInView(ref, 0.35);
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
      <div className="meter glass spot" style={{ '--i': 0 }} {...spotProps}>
        <span className="ring">
          <svg width="40" height="40" viewBox="0 0 42 42" aria-hidden="true">
            <circle className="track" cx="21" cy="21" r="17" fill="none" strokeWidth="4" />
            <circle className="arc" cx="21" cy="21" r="17" fill="none" stroke="#3ddc97" strokeWidth="4"
              strokeDasharray={C} strokeDashoffset={go ? C * 0.2 : C} />
          </svg>
          <b>{pct}%</b>
        </span>
        <span><span className="lbl">Busywork automatable</span><span className="val">of a typical week</span></span>
      </div>
      <div className="meter glass spot" style={{ '--i': 1 }} {...spotProps}>
        <span><span className="lbl"><span className="dotlive" />Local time</span><span className="val">{time}</span></span>
      </div>
      <div className="meter glass spot" style={{ '--i': 2 }} {...spotProps}>
        <span><span className="lbl">Avg. AI reply</span><span className="val">{reply} sec</span></span>
      </div>
      <div className="meter glass spot" style={{ '--i': 3 }} {...spotProps}>
        <span><span className="lbl">Hours saved</span><span className="val">{hours}+ /wk</span></span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Marquee
───────────────────────────────────────────── */
const SERVED = [
  'Concrete & Reno', 'Logistics', 'Restaurants', 'Real Estate', 'Field Services',
  'Trades', 'Wholesale', 'Clinics', 'Auto Shops', 'Property Management',
];

function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="track">
        {[...SERVED, ...SERVED].map((s, i) => <span key={i}>{s}</span>)}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Problem / solution
───────────────────────────────────────────── */
const WITHOUT = [
  'Quotes answered at 11pm — by you',
  'After-hours leads go to competitors',
  'Staff buried in data entry',
  'Software bought, never used',
  'Grants left on the table',
];

const WITH = [
  'AI replies and books jobs, 24/7',
  'Your team trained in one day',
  'Invoices chased automatically',
  'Plain-English audit before any build',
  'We file the grant paperwork',
];

function USPSection() {
  return (
    <section className="ch" id="solutions">
      <Head
        cc="var(--gA1)"
        chip="The problem"
        title="Where your week actually goes."
        lead="Same business, two operating systems."
      />

      <div className="usp-grid">
        <Rv v="left" className="usp-card glass spot friction" d={0} {...spotProps}>
          <div className="card-badge red">Without us</div>
          <h3>Invisible friction</h3>
          <ul className="usp-list">
            {WITHOUT.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </Rv>

        <Rv v="right" className="usp-card glass spot solution" d={90} {...spotProps}>
          <div className="card-badge green">With us</div>
          <h3>Work that runs itself</h3>
          <ul className="usp-list">
            {WITH.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </Rv>
      </div>

      <Rv v="scale" d={60} style={{ marginTop: 14 }}>
        <WorkflowDiagram />
      </Rv>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Demo stage
───────────────────────────────────────────── */
const DEMO_CHAT = [
  { c: 'cust', who: 'Customer', t: 'hey, open tomorrow? need a brake check on my truck' },
  { c: 'ai', who: 'AI · Village Auto Care', t: "We are — 9:30 AM or 2:00 PM. Which suits you?" },
  { c: 'cust', who: '', t: '9:30 please 🙏' },
  { c: 'ai', who: '', t: 'Booked ✓ 9:30 AM brake check. Confirmation sent.' },
];

const DEMO_INVOICE = [
  { c: 'system', who: 'Event', t: '🚛 Load #402 delivered — Brampton → Mississauga' },
  { c: 'ai', who: 'Automation engine', t: 'POD verified. Invoice #8920 generated — $1,450.00 CAD' },
  { c: 'cust', who: 'Broker accounts', t: 'Invoice received. Payment link clicked.' },
  { c: 'ai', who: 'Payment system', t: '✓ Paid $1,450.00. QuickBooks + CRM updated.' },
];

const DEMOS = {
  chat: { list: DEMO_CHAT, label: '24/7 customer AI', tab: 'Midnight booking' },
  invoice: { list: DEMO_INVOICE, label: 'Dispatch → invoice', tab: 'Dispatch → invoice' },
};

function DemoStage() {
  const [active, setActive] = useState('chat');
  const reduced = useReducedMotion();
  const list = DEMOS[active].list;
  const [shown, setShown] = useState(reduced ? list.length : 0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (reduced) { setShown(list.length); return; }
    setShown(0);
    setTyping(false);
    let timers = [];
    const clear = () => { timers.forEach(clearTimeout); timers = []; };

    const advance = (n) => {
      if (n > list.length) {
        timers.push(setTimeout(() => { setShown(0); advance(1); }, 4800));
        return;
      }
      setShown(n);
      setTyping(n < list.length);
      timers.push(setTimeout(() => advance(n + 1), 1400));
    };
    advance(1);
    return clear;
  }, [active, reduced]);

  return (
    <section className="ch" id="demo">
      <Head
        cc="var(--gA1)"
        chip="Live demo"
        title="Watch it run."
        lead="Two real workflows, start to finish, with nobody at the keyboard."
      />

      <Rv v="fade" className="ind-tabs">
        {Object.entries(DEMOS).map(([key, d]) => (
          <button
            key={key}
            type="button"
            className={`ind-tab ${active === key ? 'active' : ''}`}
            onClick={() => setActive(key)}
          >
            {d.tab}
          </button>
        ))}
      </Rv>

      <Rv v="scale" className="stage chat" d={60}>
        <div className="hud" style={{ top: 16, left: 16, '--i': 0 }}>
          <span className="k">Workflow</span><b>{DEMOS[active].label}</b>
        </div>
        <div className="hud" style={{ top: 16, right: 16, '--i': 1 }}>
          <span className="k">Runtime</span><b>3.2s</b>
        </div>
        <div className="hud" style={{ bottom: 16, right: 16, '--i': 2 }}>
          <span className="k">Status</span><b>Active ⚡</b>
        </div>

        <div className="chatcol">
          {list.slice(0, shown).map((m, i) => (
            <div
              key={`${active}-${i}`}
              className={`gb ${m.c} ${reduced ? 'show' : 'show'}`}
            >
              {m.who && <span className="who">{m.who}</span>}
              {m.t}
            </div>
          ))}
          {!reduced && typing && shown > 0 && (
            <div className={`gb show ${list[shown]?.c === 'ai' ? 'ai' : 'cust'}`} style={{ padding: '10px 15px' }}>
              <span className="typing"><i /><i /><i /></span>
            </div>
          )}
        </div>
      </Rv>
      <p className="cap">Runs in the background while you get on with the job.</p>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Industries
───────────────────────────────────────────── */
const INDUSTRIES = [
  {
    id: 'reno',
    name: '🏗️ Concrete & Reno',
    stat: '~2,800 Brampton & GTA contractors',
    headline: 'Quote a driveway before you drive out to it.',
    image: aiConcreteImg,
    points: [
      'AI measures the area and prices it instantly',
      'Texture preview: broom, stamped, aggregate',
      'PDF quote sent, deposit collected',
    ],
  },
  {
    id: 'retail',
    name: '🍽️ Retail & Restaurants',
    stat: '~4,000 GTA firms',
    headline: 'Menus, bookings and QR ordering that run themselves.',
    image: aiRestaurantImg,
    points: [
      'Interactive menus with live AI ordering',
      '24/7 table booking with SMS confirmations',
      'Stockout alerts pushed straight to the POS',
    ],
  },
  {
    id: 'logistics',
    name: '🚛 Logistics',
    stat: '~1,500 GTA firms',
    headline: 'No more dispatch bottlenecks or BOL paperwork.',
    image: aiLogisticsImg,
    points: [
      'PODs scanned, load status auto-updated',
      'Route optimization and driver dispatch',
      'Broker emails parsed into instant quotes',
    ],
  },
  {
    id: 'services',
    name: '💼 Field & Professional',
    stat: '~3,000 GTA firms',
    headline: 'Stop chasing paperwork, invoices and calendars.',
    image: aiWorkshopImg,
    points: [
      'Quotes and job confirmations auto-generated',
      'Invoice reminders by SMS and email',
      'CRM sync plus document summaries',
    ],
  },
];

function IndustrySolutions() {
  const [activeTab, setActiveTab] = useState('reno');
  const ind = INDUSTRIES.find((i) => i.id === activeTab) || INDUSTRIES[0];

  return (
    <section className="ch" id="industries">
      <Head
        cc="var(--gB1)"
        chip="Built for your trade"
        title="Pick your industry."
        lead="Same engine, tuned to how your work actually happens."
      />

      <Rv v="fade" className="ind-tabs">
        {INDUSTRIES.map((i) => (
          <button
            key={i.id}
            type="button"
            className={`ind-tab ${activeTab === i.id ? 'active' : ''}`}
            onClick={() => setActiveTab(i.id)}
          >
            {i.name}
          </button>
        ))}
      </Rv>

      <Rv v="scale" className="ind-card glass spot" d={60} {...spotProps}>
        <div className="ind-header-grid">
          <div>
            <span className="ind-stat">{ind.stat}</span>
            <h3>{ind.headline}</h3>
            <div className="ind-grid" style={{ marginTop: 14 }}>
              {ind.points.map((pt, idx) => (
                <div key={`${ind.id}-${idx}`} className="ind-item glass" style={{ '--i': idx }}>
                  <span className="ind-num">0{idx + 1}</span>
                  <p>{pt}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="ind-img-col">
            <img key={ind.id} src={ind.image} alt={ind.name} className="ind-feature-img" loading="lazy" />
          </div>
        </div>
      </Rv>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Education
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

const EDU_TAGS = ['✍️ Writing & quotes', '📅 Scheduling', '📄 Paperwork', '💬 Customer replies'];

function Education() {
  const stageRef = useRef(null);
  const go = useInView(stageRef, 0.3);

  return (
    <section className="ch" id="learn">
      <Head
        cc="var(--gB1)"
        chip="Education first"
        title="We teach before we build."
        lead="Tools nobody understands become tools nobody uses."
      />

      <Rv v="scale" className="stage edu" d={60}>
        <div className="eduCopy" ref={stageRef}>
          <h3>Fluent in AI by end of day.</h3>
          <p>Hands-on, on your real work — quoting, email, scheduling, paperwork. No theory, no jargon.</p>
          <div className="tags">
            {EDU_TAGS.map((t, i) => <span className="tag" key={t} style={{ '--i': i }}>{t}</span>)}
          </div>
          <div className="workshop-img-box">
            <img src={aiWorkshopImg} alt="AI team workshop in session" className="workshop-img" loading="lazy" />
          </div>
        </div>
        <div className="eduCard">
          <h3>Team skill meter</h3>
          <p className="small">A typical crew, before lunch vs. after.</p>
          {SKILLS.map((s) => <SkillBar key={s.label} {...s} go={go} />)}
          <p className="eduFoot">Measured before and after every workshop.</p>
        </div>
      </Rv>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Services
───────────────────────────────────────────── */
const SERVICES = [
  {
    cc: 'var(--gA1)', pop: 'Start here', step: 'Consult · 01',
    title: 'Readiness audit',
    desc: 'Free call, then a plain-English audit: where your hours leak and what fixing it is worth. Grant applications need this exact document.',
    price: '$500', unit: 'from',
  },
  {
    cc: 'var(--gB1)', step: 'Teach · 02',
    title: 'Team AI training',
    desc: 'One hands-on day. Staff leave using AI on their real work. COJG covers up to 83% per employee when intakes are open.',
    price: '$500', unit: 'from',
  },
  {
    cc: 'var(--gC1)', step: 'Build · 03',
    title: 'Automations built',
    desc: 'Replies, bookings, invoicing — live in weeks. OCI Tech Demo matches 50% up to $50,000 for qualifying businesses.',
    price: '$1,000', unit: 'from',
  },
];

function Services() {
  return (
    <section className="ch" id="services">
      <Head
        cc="var(--gD1)"
        chip="Services"
        title="Three ways to start."
        lead="Consultation first. Training next. Automation when the numbers say it pays."
      />
      <div className="cards">
        {SERVICES.map((c, i) => (
          <Rv key={c.step} className="card glass spot" d={i * 90} style={{ '--cc': c.cc }} {...spotProps}>
            {c.pop && <span className="pop">{c.pop}</span>}
            <span className="step">{c.step}</span>
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
            <span className="price"><small>{c.unit} </small>{c.price}</span>
          </Rv>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Funding
───────────────────────────────────────────── */
const GRANT_FACTS = [
  { title: 'OCI DCC — Tech Demonstration', level: 'Ontario', badge: 'Rollout', amount: 'Up to $50K', cov: '50% matched', desc: 'Deploy voice AI, workflows and software.' },
  { title: 'OCI DCC — Digital Modernization', level: 'Ontario', badge: 'Strategy', amount: 'Up to $15K', cov: '50% matched', desc: 'Readiness audits and transformation strategy.' },
  { title: 'Ontario Job Grant (COJG)', level: 'Ontario / Federal', badge: 'Upskilling', amount: '$10K–$15K', cov: '50–83% covered', desc: 'Staff training via an eligible third-party trainer.' },
  { title: 'NRC IRAP & AI Assist', level: 'Federal', badge: 'Custom build', amount: 'Salary subsidy', cov: '50–80% of wages', desc: 'Payroll support for custom AI R&D.' },
  { title: 'SR&ED + OITC', level: 'Federal & Ontario', badge: 'Tax recovery', amount: 'Cash back', cov: 'Up to 75–80%', desc: 'Refunds on proprietary R&D labour.' },
  { title: 'Critical Industrial Technologies', level: 'Ontario', badge: 'Supply chain', amount: 'Up to $200K', cov: '50% matched', desc: 'AI and robotics in logistics and manufacturing.' },
];

function Funding() {
  return (
    <section className="ch" id="funding">
      <Head
        cc="var(--gC1)"
        chip="Government grants"
        title="The government helps pay."
        lead="We check what you qualify for and handle the paperwork."
      />

      <Rv v="fade">
        <GrantStackGraphic />
      </Rv>

      <div className="grant-matrix">
        {GRANT_FACTS.map((g, idx) => (
          <Rv key={g.title} className="g-card glass spot" d={(idx % 3) * 70} {...spotProps}>
            <div className="g-card-top">
              <span className="g-level">{g.level}</span>
              <span className="g-badge">{g.badge}</span>
            </div>
            <h4>{g.title}</h4>
            <p style={{ fontSize: 13, color: 'var(--sub)', margin: '0 0 12px', lineHeight: 1.4 }}>{g.desc}</p>
            <div className="g-stat-row">
              <span className="g-amt">{g.amount}</span>
              <span className="g-cov">{g.cov}</span>
            </div>
          </Rv>
        ))}
      </div>

      <Rv v="scale" style={{ marginTop: 32 }}>
        <GrantCalculator />
      </Rv>

      <Rv v="scale" className="stage money" style={{ marginTop: 28 }}>
        <span className="fsub">Stacked federal + provincial</span>
        <div className="fundNum">Up to 80%</div>
        <span className="fsub">of technical salaries offset — IRAP + SR&amp;ED + OITC</span>
        <p className="fine2">Adopting off-the-shelf AI instead? OCI DCC and the Ontario Job Grant offset 50–83% of adoption and training.</p>
        <p className="fine">Intakes open and close. We confirm live eligibility before quoting a number.</p>
      </Rv>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FAQ
───────────────────────────────────────────── */
const FAQS = [
  { q: 'Will AI replace my staff?', a: 'No. It takes the repetitive busywork off their plate so they do the work that actually pays. That is why we train your team before we automate anything.' },
  { q: "I'm not technical. Problem?", a: 'That is exactly who we serve. If you can send a text message, you are qualified.' },
  { q: 'What does it cost?', a: 'Audits and training from $500. Automations from $1,000. Maintenance from $300/month. The first call is free — and grants routinely cover 50–83%.' },
  { q: 'Are the grants real?', a: 'Yes. OCI DCC offers up to $65K matched ($15K strategy + $50K rollout), the Ontario Job Grant up to $15K per employee, and IRAP + SR&ED cover developer labour. We confirm what is open before submitting anything.' },
  { q: 'How fast do I see results?', a: 'Training pays off the same day. Workflows and chatbots go live 2–4 weeks after the audit.' },
];

function FAQ() {
  const [open, setOpen] = useState(-1);
  return (
    <section className="ch" id="faq">
      <Head cc="var(--gD2)" chip="FAQ" title="Straight answers." lead="The five things every owner asks first." />
      <div className="faq">
        {FAQS.map((f, i) => (
          <Rv key={f.q} className={`qa glass ${open === i ? 'open' : ''}`} d={i * 55}>
            <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
              {f.q}<span className="pm" aria-hidden="true">+</span>
            </button>
            <div className="a"><p>{f.a}</p></div>
          </Rv>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Contact — wired to Google Forms
───────────────────────────────────────────── */
function Contact() {
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
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
    })
      .then(() => setStatus('done'))
      .catch(() => setStatus('done'));
  };

  return (
    <section className="ch" id="contact">
      <Head
        cc="var(--gD1)"
        chip="Book a call"
        title="Thirty minutes. Zero jargon."
        lead="Find out what AI does for your business — and which grants you qualify for."
      />
      <div className="contact">
        {status === 'done' ? (
          <div className="form glass">
            <div className="ok">
              <b>Got it — talk soon 🎉</b>
              <p>We reply within 24 hours, GTA time.</p>
            </div>
          </div>
        ) : (
          <Rv as="form" v="scale" className="form glass spot" onSubmit={handleSubmit} {...spotProps}>
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
              <option>Concrete &amp; Construction</option>
              <option>Logistics &amp; Transportation</option>
              <option>Retail &amp; Restaurants</option>
              <option>Real Estate</option>
              <option>Professional Services</option>
              <option>Other</option>
            </select>
            <textarea required name="pain_point" placeholder="What eats the most of your week?" aria-label="Biggest time waster" />
            <button className="send sheen" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Book my free call & grant check →'}
            </button>
          </Rv>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Coverage
───────────────────────────────────────────── */
const GEO = [
  { c: '#3ddc97', h: 'Greater Toronto Area', p: 'Toronto, Brampton, Mississauga, Vaughan, Markham, Richmond Hill, Oakville, Burlington, Durham.' },
  { c: '#45c4ff', h: 'Ontario tech corridor', p: 'Hamilton, Kitchener-Waterloo, Cambridge, Guelph, London, Barrie, Niagara, Ottawa.' },
  { c: '#ffb199', h: 'Canada-wide, remote', p: 'Calgary, Edmonton, Vancouver, Victoria, Montreal, Winnipeg, Halifax — coast to coast.' },
];

function ServiceLocations() {
  return (
    <section className="ch" id="locations">
      <Head
        cc="var(--gA1)"
        chip="Coverage"
        title="AI consulting across Toronto, the GTA & Canada."
        lead="Brampton-based. On-site across the GTA, remote everywhere else."
      />
      <div className="geo-grid">
        {GEO.map((g, i) => (
          <Rv key={g.h} className="geo-card glass spot" d={i * 80} {...spotProps}>
            <h3 style={{ color: g.c }}>{g.h}</h3>
            <p>{g.p}</p>
          </Rv>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Nav links (single source of truth)
───────────────────────────────────────────── */
const NAV = [
  { id: 'solutions', label: 'Problem' },
  { id: 'industries', label: 'Industries' },
  { id: 'funding', label: 'Grants' },
  { id: 'services', label: 'Services' },
  { id: 'locations', label: 'Coverage' },
];

/* ─────────────────────────────────────────────
   App
───────────────────────────────────────────── */
export default function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState('');
  const barRef = useRef(null);
  const glowRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const reduced = useReducedMotion();

  /* Scroll progress · nav condense · glow parallax — one rAF loop */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (barRef.current) barRef.current.style.setProperty('--p', max > 0 ? y / max : 0);
        setScrolled(y > 24);
        if (!reduced) {
          glowRefs.forEach((r, i) => {
            if (r.current) r.current.style.setProperty('--py', `${y * (0.06 + i * 0.035) * (i % 2 ? -1 : 1)}px`);
          });
        }
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced]);

  /* Active nav link */
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* Lock scroll behind the mobile drawer */
  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileNavOpen]);

  const closeNav = useCallback(() => setMobileNavOpen(false), []);

  return (
    <>
      <div className="progress" ref={barRef} aria-hidden="true" />
      <div className="bgfield" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <div className="canvas">
        <div className="glow" ref={glowRefs[0]} style={{ top: -140, left: '6%', width: 440, height: 440, background: 'var(--gA3)' }} />
        <div className="glow" ref={glowRefs[1]} style={{ top: 1100, right: '2%', width: 400, height: 400, background: 'var(--gB1)' }} />
        <div className="glow" ref={glowRefs[2]} style={{ top: 2600, left: '0%', width: 420, height: 420, background: 'var(--gC1)' }} />
        <div className="glow" ref={glowRefs[3]} style={{ top: 4200, right: '6%', width: 400, height: 400, background: 'var(--gD2)' }} />

        <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
          <a href="#" className="brand-wrap" aria-label="Flower City AI home">
            <LogoMark size={30} />
            <div className="brand-text">
              <span className="brand-title">Flower City AI</span>
              <span className="brand-sub">Toronto &amp; GTA · Canada</span>
            </div>
          </a>

          <div className="links">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className={activeId === n.id ? 'on' : ''}>{n.label}</a>
            ))}
          </div>

          <div className="nav-right">
            <a className="cta-s sheen" href="#contact">Book a free call</a>
            <button
              className="mobile-nav-toggle"
              aria-label="Toggle menu"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((o) => !o)}
            >
              {mobileNavOpen ? '✕' : '☰'}
            </button>
          </div>
        </nav>

        {mobileNavOpen && (
          <div className="mobile-drawer">
            {NAV.map((n, i) => (
              <a key={n.id} href={`#${n.id}`} style={{ '--i': i }} onClick={closeNav}>{n.label}</a>
            ))}
            <a className="cta-s" href="#contact" style={{ '--i': NAV.length }} onClick={closeNav}>Book a free call</a>
          </div>
        )}

        <header className="hero">
          <div className="hero-logo hero-fade" style={{ display: 'inline-block', marginBottom: 14, '--d': '0ms' }}>
            <LogoMark size={54} />
          </div>

          <div>
            <span className="hero-badge hero-fade" style={{ '--d': '80ms' }}>
              <span className="pulse" />AI consulting · Toronto · GTA · Canada 🇨🇦
            </span>
          </div>

          <h1>
            <Words text="Your business," start={0} />{' '}
            <span className="w"><i className="grad" style={{ '--i': 2 }}>running on autopilot.</i></span>
          </h1>

          <p className="sub hero-fade" style={{ '--d': '520ms' }}>
            AI that answers customers, books jobs and chases invoices. We train your team to run it —
            and <b>grants cover most of the cost.</b>
          </p>

          <a className="cta sheen hero-fade" href="#contact" style={{ '--d': '620ms' }}>
            Book a free call &amp; grant check <span className="ico">→</span>
          </a>
          <span className="cta-sub hero-fade" style={{ '--d': '700ms' }}>
            30 minutes · No jargon · Honest eligibility check
          </span>

          <a className="scroll-cue" href="#solutions" aria-label="Scroll to content"><i /></a>
        </header>

        <Meters />
        <Marquee />
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
          <div className="fbrand">
            <LogoMark size={26} />
            <b>Flower City AI</b>
          </div>
          AI consulting, automation &amp; training · Brampton &amp; the GTA, serving all of Canada · © {new Date().getFullYear()}
          <div className="flinks">
            {NAV.map((n) => <a key={n.id} href={`#${n.id}`}>{n.label}</a>)}
            <a href="#contact">Contact</a>
          </div>
        </footer>
      </div>
    </>
  );
}
