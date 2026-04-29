import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ─────────────────────────────────────────────
   Intersection Observer hook — safe to use
   only at the top level of React components
───────────────────────────────────────────── */
function useVisible(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ─────────────────────────────────────────────
   Animated counter hook
───────────────────────────────────────────── */
function useCounter(end, duration = 1500, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [active, end, duration]);
  return count;
}

/* ─────────────────────────────────────────────
   Typewriter hook
───────────────────────────────────────────── */
function useTypewriter(phrases, typingSpeed = 40, deletingSpeed = 35, pauseDuration = 2000, emptyPauseDuration = 800) {
  const [text, setText] = useState('');
  const [phase, setPhase] = useState('Typing');
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];

    switch (phase) {
      case 'Typing': {
        if (text === currentPhrase) {
          setPhase('Pausing');
          return;
        }
        const timeout = setTimeout(() => {
          setText(currentPhrase.slice(0, text.length + 1));
        }, typingSpeed);
        return () => clearTimeout(timeout);
      }
      case 'Pausing': {
        const timeout = setTimeout(() => {
          setPhase('Deleting');
        }, pauseDuration);
        return () => clearTimeout(timeout);
      }
      case 'Deleting': {
        if (text === '') {
          setPhase('PausedBeforeNext');
          return;
        }
        const timeout = setTimeout(() => {
          setText(currentPhrase.slice(0, text.length - 1));
        }, deletingSpeed);
        return () => clearTimeout(timeout);
      }
      case 'PausedBeforeNext': {
        const timeout = setTimeout(() => {
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
          setPhase('Typing');
        }, emptyPauseDuration);
        return () => clearTimeout(timeout);
      }
    }
  }, [text, phase, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration, emptyPauseDuration]);

  return text;
}

/* ─────────────────────────────────────────────
   Mouse position hook for parallax
───────────────────────────────────────────── */
function useMouseParallax(intensity = 0.02) {
  const offset = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);
  const [, forceRender] = useState(0);

  useEffect(() => {
    let latestX = 0;
    let latestY = 0;
    let ticking = false;

    const handler = (e) => {
      latestX = (e.clientX - window.innerWidth / 2) * intensity;
      latestY = (e.clientY - window.innerHeight / 2) * intensity;

      if (!ticking) {
        ticking = true;
        rafId.current = requestAnimationFrame(() => {
          offset.current = { x: latestX, y: latestY };
          forceRender(n => n + 1);
          ticking = false;
        });
      }
    };

    window.addEventListener('mousemove', handler, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handler);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [intensity]);

  return offset.current;
}

/* ─────────────────────────────────────────────
   Hero Particles Generator
───────────────────────────────────────────── */
function HeroParticles() {
  const particles = useRef(
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 6 + 4,
      delay: Math.random() * 4,
      color: ['#FCD34D', '#F97316', '#60A5FA', '#34D399', '#fff'][Math.floor(Math.random() * 5)],
      opacity: Math.random() * 0.4 + 0.1,
    }))
  ).current;

  return (
    <div className="hero-particles">
      {particles.map(p => (
        <div
          key={p.id}
          className="hero-particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: p.opacity,
            '--duration': `${p.duration}s`,
            '--delay': `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Scroll Progress Bar
───────────────────────────────────────────── */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handler = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1" style={{ background: 'rgba(15,23,42,0.1)' }}>
      <div
        className="h-full transition-all duration-150"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #FCD34D, #F97316, #1D4ED8)',
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

function PainCard({ emoji, title, desc, stat, statLabel, bgColor, textLight, index }) {
  const [ref, visible] = useVisible();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: bgColor,
        transitionDelay: `${index * 100}ms`,
      }}
      className={`pain-card-hover rounded-3xl p-8 md:p-10 relative overflow-hidden cursor-default
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        transition-all duration-600`}
    >
      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 rounded-3xl transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${textLight ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)'} 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      <div className="relative z-10">
        <div className="text-6xl mb-5" style={{ filter: hovered ? 'scale(1.1)' : 'none', transition: 'transform 0.3s' }}>{emoji}</div>
        <h3 className={`font-display text-4xl mb-3 leading-none ${textLight ? 'text-white' : 'text-brand-navy'}`}>{title}</h3>
        <p className={`font-body text-sm leading-relaxed mb-5 ${textLight ? 'text-white/70' : 'text-brand-navy/60'}`}>{desc}</p>

        {stat && (
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${textLight ? 'bg-white/15 text-white' : 'bg-black/5 text-brand-navy'}`}>
            <span className="text-lg">📊</span>
            <span>{stat}</span>
            {statLabel && <span className={`text-xs font-normal ${textLight ? 'text-white/50' : 'text-brand-navy/40'}`}>— {statLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function IndustryCard({ emoji, name, desc, color, delay }) {
  const [ref, visible] = useVisible();
  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl p-7 border-2 border-gray-100 hover:border-gray-300 hover:-translate-y-2 transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms`, boxShadow: `0 4px 20px ${color}08` }}
    >
      <div className="text-5xl mb-4">{emoji}</div>
      <h3 className="font-display text-2xl mb-2 leading-tight" style={{ color }}>{name}</h3>
      <p className="font-body text-sm leading-relaxed text-gray-500">{desc}</p>
    </div>
  );
}

function StatBlock({ emoji, value, label, delay, color }) {
  const [ref, visible] = useVisible();
  return (
    <div
      ref={ref}
      className={`text-center transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-3xl mb-2">{emoji}</div>
      <div className="font-display text-5xl md:text-6xl counter-value" style={{ color: color || '#1D4ED8' }}>{value}</div>
      <div className="font-body text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}

function ServiceCard({ num, icon, tag, sub, title, desc, outcome, bgColor, index }) {
  const [ref, visible] = useVisible(0.08);
  const [open, setOpen] = useState(false);
  return (
    <div
      ref={ref}
      style={{
        backgroundColor: bgColor,
        transitionDelay: `${index * 80}ms`,
      }}
      className={`rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      onClick={() => setOpen(o => !o)}
    >
      <div className="p-8 md:p-10">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-4xl">{icon}</span>
              <span className="text-xs font-bold uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-full shrink-0">{tag}</span>
            </div>
            <p className="text-white/60 font-body text-xs font-bold uppercase tracking-widest mb-1">{sub}</p>
            <h3 className="font-display text-4xl md:text-5xl text-white leading-none">{title}</h3>
          </div>
          <div className={`mt-2 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl shrink-0 transition-transform duration-300 leading-none select-none ${open ? 'rotate-45' : ''}`}>
            +
          </div>
        </div>

        {/* Expanded content */}
        {open && (
          <div className="mt-6 pt-6 border-t border-white/20 grid md:grid-cols-3 gap-4" style={{ animation: 'popIn 0.35s cubic-bezier(.34,1.56,.64,1) both' }}>
            <p className="text-white/90 md:col-span-2 font-body text-base leading-relaxed">{desc}</p>
            <div className="bg-white/15 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
              <p className="text-white/60 text-xs uppercase tracking-widest mb-1 font-bold">Outcome</p>
              <p className="text-white font-bold text-sm leading-snug">{outcome}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Ticker tape
───────────────────────────────────────────── */
const TICKER = ['🌸 AI for Local Business', '⚡ Save 20 Hours a Week', '🚛 Trucking Automation', '💬 24/7 Chatbots', '📦 Inventory Forecasting', '🌸 Flower City AI Experts', '🎓 AI Team Training', '🔍 Free AI Audit', '💰 See Your ROI', '🔥 Brampton\'s Own AI Team'];

/* ─────────────────────────────────────────────
   "See What You Need" — persona picker
───────────────────────────────────────────── */
const PERSONAS = [
  {
    id: 'trucking',
    emoji: '🚛',
    label: 'Trucking Owner',
    headline: 'AI built for the road.',
    summary: 'Your dispatch is eating hours. Your paperwork never ends. Your routes cost more than they should. Every late invoice is cash sitting in someone else\'s pocket.',
    bullets: [
      '📍 Automated route optimization — fewer KMs, lower fuel costs',
      '📄 AI document processing — bills of lading & PODs in seconds',
      '📞 24/7 dispatch assistant — handles driver inquiries overnight',
      '🔁 Auto-invoicing — get paid faster, no manual entry',
    ],
    accent: '#1D4ED8',
  },
  {
    id: 'retail',
    emoji: '🛍️',
    label: 'Retail / Restaurant',
    headline: 'Serve more. Stress less.',
    summary: 'Staff calling in sick, inventory running out, customers left on read. You\'re running a business, not a fire department. AI handles the chaos so you can focus on what you love.',
    bullets: [
      '💬 AI chatbot on WhatsApp & Instagram — answers 24/7',
      '📦 Inventory forecasting — never run out of your top sellers',
      '📣 AI-generated local ad copy — more foot traffic, less effort',
      '⭐ Auto-review response — protect & grow your reputation',
    ],
    accent: '#F97316',
  },
  {
    id: 'professional',
    emoji: '🏢',
    label: 'Professional Services',
    headline: 'Less admin. More clients.',
    summary: 'You\'re the expert — but you\'re buried in emails, follow-ups, and documents instead of doing the work that actually pays. Every hour on admin is an hour you\'re not billing.',
    bullets: [
      '📋 AI document summarization — contracts & reports in seconds',
      '🔔 Automated follow-up sequences — no lead goes cold',
      '📅 AI appointment booking — 24/7, no back-and-forth emails',
      '🤖 CRM automation — your pipeline updates itself',
    ],
    accent: '#16A34A',
  },
  {
    id: 'solopreneur',
    emoji: '🧑‍💻',
    label: 'Solopreneur / Startup',
    headline: 'One person. AI-powered team.',
    summary: 'You wear every hat. AI lets you wear them faster — without burning out or hiring a team you can\'t afford. Build like a company of 10 with a team of one.',
    bullets: [
      '⚡ Workflow automation — your apps talk to each other',
      '✍️ AI content creation — social posts, emails, proposals',
      '📊 AI reporting — know your numbers without a bookkeeper',
      '🎓 AI skills training — learn to leverage tools in days, not months',
    ],
    accent: '#8B5CF6',
  },
];

function SeeWhatYouNeed() {
  const [active, setActive] = useState(null);
  const [sectionRef, sectionVisible] = useVisible(0.05);
  const persona = PERSONAS.find(p => p.id === active);

  return (
    <section className="py-24 px-5 relative" style={{ backgroundColor: '#f1f5f9' }}>
      <div ref={sectionRef} className="max-w-5xl mx-auto">

        {/* Heading */}
        <div className={`text-center mb-12 transition-all duration-700 ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5"
            style={{ backgroundColor: '#0F172A', color: '#FCD34D' }}>
            Find Your Fit
          </span>
          <h2 className="font-display text-5xl md:text-7xl text-brand-navy leading-none mb-3">
            SEE WHAT<br />
            <span style={{ color: '#1D4ED8' }}>YOU NEED.</span>
          </h2>
          <p className="font-body text-gray-500 text-lg max-w-lg mx-auto">
            Pick your business type. We'll show you exactly how AI helps <em>you</em>.
          </p>
        </div>

        {/* Persona pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {PERSONAS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActive(active === p.id ? null : p.id)}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 hover:scale-105
                ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{
                backgroundColor: active === p.id ? p.accent : '#fff',
                color: active === p.id ? '#fff' : '#0F172A',
                border: `2px solid ${active === p.id ? p.accent : '#e5e7eb'}`,
                boxShadow: active === p.id ? `0 8px 30px ${p.accent}40` : '0 2px 10px rgba(0,0,0,0.04)',
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <span className="text-xl">{p.emoji}</span>
              {p.label}
            </button>
          ))}
        </div>

        {/* Result panel */}
        {persona && (
          <div
            key={persona.id}
            className="rounded-3xl overflow-hidden"
            style={{ border: `3px solid ${persona.accent}`, animation: 'popIn 0.35s cubic-bezier(.34,1.56,.64,1) both', boxShadow: `0 20px 60px ${persona.accent}15` }}
          >
            {/* Coloured header */}
            <div className="px-8 py-8 flex items-center gap-5 relative overflow-hidden" style={{ backgroundColor: persona.accent }}>
              {/* Subtle glow */}
              <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full opacity-20 pointer-events-none" style={{ backgroundColor: '#fff' }} />
              <span className="text-7xl relative z-10">{persona.emoji}</span>
              <div className="relative z-10">
                <p className="text-white/70 font-bold text-xs uppercase tracking-widest mb-1">{persona.label}</p>
                <h3 className="font-display text-4xl md:text-5xl text-white leading-none">{persona.headline}</h3>
              </div>
            </div>

            {/* Body */}
            <div className="bg-white px-8 py-8 grid md:grid-cols-2 gap-8 items-start">
              <div>
                <p className="font-body text-gray-600 text-base leading-relaxed mb-6">{persona.summary}</p>
                <a href="#contact"
                  className="inline-block font-black text-sm uppercase tracking-wide px-7 py-3.5 rounded-xl transition-all hover:scale-105 hover:shadow-lg btn-ripple"
                  style={{ backgroundColor: persona.accent, color: '#fff' }}>
                  Get My Custom Plan →
                </a>
              </div>
              <ul className="space-y-3">
                {persona.bullets.map((b, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 font-body text-sm text-gray-700 leading-snug bg-gray-50 rounded-xl px-4 py-3 transition-all duration-300 hover:bg-gray-100"
                    style={{ animation: `fadeUp 0.4s ease ${i * 80}ms both` }}
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Nudge if nothing selected */}
        {!persona && (
          <p className="text-center font-body text-gray-400 text-sm mt-2 animate-pulse">
            ↑ Tap a business type above to see your tailored AI playbook.
          </p>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   HOW IT WORKS — 3-step process
───────────────────────────────────────────── */
const STEPS = [
  {
    num: '01',
    icon: '📞',
    title: 'Free Discovery Call',
    desc: 'A no-commitment 30-minute conversation. We learn your pain points, your tools, and where you\'re losing time. You walk away with clarity — even if you never hire us.',
    timeline: '30 minutes',
    color: '#1D4ED8',
  },
  {
    num: '02',
    icon: '🔍',
    title: 'AI Readiness Audit',
    desc: 'We dig into your workflows, software, and daily operations. You get a plain-English "AI Roadmap" showing exactly what to automate, what tools to use, and the expected ROI.',
    timeline: '1–2 weeks',
    color: '#F97316',
  },
  {
    num: '03',
    icon: '🚀',
    title: 'Implementation & Results',
    desc: 'We build, deploy, and train your team. Chatbots go live. Workflows connect. Your staff learns to use AI daily. Then we stick around to make sure everything keeps running.',
    timeline: '2–6 weeks',
    color: '#16A34A',
  },
];

function HowItWorks() {
  const [ref, visible] = useVisible(0.08);
  return (
    <section id="process" className="py-28 px-5 relative" style={{ backgroundColor: '#fff' }}>
      <div ref={ref} className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-white font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5"
            style={{ backgroundColor: '#1D4ED8' }}>
            How It Works
          </span>
          <h2 className="font-display text-6xl md:text-7xl text-brand-navy leading-none">
            THREE STEPS.<br />
            <span style={{ color: '#1D4ED8' }}>ZERO JARGON.</span>
          </h2>
          <p className="font-body text-gray-500 text-lg mt-4 max-w-lg mx-auto">
            From first call to real results — here's exactly what working with us looks like.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-1 -translate-y-1/2 rounded-full" style={{ background: 'linear-gradient(90deg, #1D4ED8, #F97316, #16A34A)' }} />

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className={`bg-white rounded-3xl p-8 text-center transition-all duration-600 hover:-translate-y-3 hover:shadow-2xl ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{
                  border: `3px solid ${step.color}25`,
                  boxShadow: `0 4px 24px ${step.color}10`,
                  transitionDelay: `${i * 150}ms`,
                }}
              >
                {/* Number badge */}
                <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center font-display text-3xl text-white"
                  style={{ backgroundColor: step.color, boxShadow: `0 4px 15px ${step.color}40` }}>
                  {step.num}
                </div>

                {/* Icon */}
                <div className="text-5xl mb-4">{step.icon}</div>

                {/* Title */}
                <h3 className="font-display text-3xl mb-3 leading-tight" style={{ color: step.color }}>{step.title}</h3>

                {/* Description */}
                <p className="font-body text-sm text-gray-500 leading-relaxed mb-5">{step.desc}</p>

                {/* Timeline chip */}
                <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full"
                  style={{ backgroundColor: `${step.color}10`, color: step.color }}>
                  ⏱️ {step.timeline}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <a href="#contact"
            className="inline-block font-black text-lg uppercase tracking-wide px-9 py-4 rounded-2xl transition-all hover:scale-105 hover:shadow-xl btn-ripple"
            style={{ backgroundColor: '#1D4ED8', color: '#fff', boxShadow: '0 4px 20px rgba(29,78,216,0.3)' }}>
            Start With Step 1 — It's Free →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   ROI Calculator
───────────────────────────────────────────── */
function ROICalculator() {
  const [ref, visible] = useVisible(0.08);
  const [hours, setHours] = useState(15);
  const [rate, setRate] = useState(30);
  const [showResult, setShowResult] = useState(false);

  const weeklySavings = hours * rate;
  const monthlySavings = weeklySavings * 4.33;
  const yearlySavings = Math.round(monthlySavings * 12);
  const monthlyDisplay = useCounter(Math.round(monthlySavings), 1200, showResult);
  const yearlyDisplay = useCounter(yearlySavings, 1500, showResult);

  return (
    <section id="roi" className="py-28 px-5" style={{ backgroundColor: '#f8fafc' }}>
      <div ref={ref} className={`max-w-4xl mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-block font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5"
            style={{ backgroundColor: '#0F172A', color: '#FCD34D' }}>
            💰 ROI Calculator
          </span>
          <h2 className="font-display text-5xl md:text-7xl text-brand-navy leading-none mb-3">
            HOW MUCH IS<br />
            <span style={{ color: '#16A34A' }}>BUSYWORK</span> COSTING YOU?
          </h2>
          <p className="font-body text-gray-500 text-lg max-w-lg mx-auto">
            Slide the numbers. See what AI could save your business this year.
          </p>
        </div>

        {/* Calculator card */}
        <div className="bg-white rounded-3xl overflow-hidden" style={{ border: '4px solid #0F172A', boxShadow: '6px 6px 0 #0F172A' }}>
          <div className="p-8 md:p-12">
            {/* Sliders */}
            <div className="grid md:grid-cols-2 gap-10 mb-10">
              {/* Hours slider */}
              <div>
                <label className="block font-bold text-xs uppercase tracking-widest text-gray-500 mb-3">
                  Hours spent on repetitive tasks per week
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range" min="5" max="40" value={hours}
                    onChange={e => { setHours(Number(e.target.value)); setShowResult(false); }}
                    className="flex-1 h-3 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: '#1D4ED8', background: `linear-gradient(to right, #1D4ED8 ${((hours - 5) / 35) * 100}%, #e5e7eb ${((hours - 5) / 35) * 100}%)` }}
                  />
                  <span className="font-display text-4xl w-20 text-right" style={{ color: '#1D4ED8' }}>{hours}h</span>
                </div>
              </div>

              {/* Rate slider */}
              <div>
                <label className="block font-bold text-xs uppercase tracking-widest text-gray-500 mb-3">
                  Average hourly cost (staff / your time)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range" min="15" max="100" step="5" value={rate}
                    onChange={e => { setRate(Number(e.target.value)); setShowResult(false); }}
                    className="flex-1 h-3 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: '#F97316', background: `linear-gradient(to right, #F97316 ${((rate - 15) / 85) * 100}%, #e5e7eb ${((rate - 15) / 85) * 100}%)` }}
                  />
                  <span className="font-display text-4xl w-20 text-right" style={{ color: '#F97316' }}>${rate}</span>
                </div>
              </div>
            </div>

            {/* Calculate button */}
            {!showResult && (
              <div className="text-center mb-8">
                <button
                  onClick={() => setShowResult(true)}
                  className="font-black text-lg uppercase tracking-wide px-10 py-4 rounded-2xl transition-all hover:scale-105 hover:shadow-xl text-white btn-ripple"
                  style={{ backgroundColor: '#16A34A', boxShadow: '0 4px 20px rgba(22,163,74,0.3)' }}>
                  Calculate My Savings →
                </button>
              </div>
            )}

            {/* Results */}
            {showResult && (
              <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#16A34A', animation: 'popIn 0.4s cubic-bezier(.34,1.56,.64,1) both' }}>
                <p className="text-white/70 font-bold text-xs uppercase tracking-widest mb-2">Your potential savings with AI</p>
                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="font-display text-6xl md:text-7xl text-white counter-value">${monthlyDisplay.toLocaleString()}</div>
                    <div className="text-white/70 font-bold text-xs uppercase tracking-widest mt-1">Per Month</div>
                  </div>
                  <div>
                    <div className="font-display text-6xl md:text-7xl counter-value" style={{ color: '#FCD34D' }}>${yearlyDisplay.toLocaleString()}</div>
                    <div className="text-white/70 font-bold text-xs uppercase tracking-widest mt-1">Per Year</div>
                  </div>
                </div>
                <p className="text-white/80 font-body text-sm mb-6">
                  That's <strong>{hours} hours</strong> back every single week — to grow your business, serve your customers, or just breathe.
                </p>
                <a href="#contact"
                  className="inline-block font-black text-sm uppercase tracking-wide px-8 py-3 rounded-xl transition-all hover:scale-105 btn-ripple"
                  style={{ backgroundColor: '#fff', color: '#16A34A' }}>
                  Let's Capture Those Savings →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Testimonials / Case Studies
───────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    name: 'Harpreet S.',
    role: 'Owner, Singh Logistics',
    industry: 'Trucking',
    emoji: '🚛',
    quote: 'We were spending 3 hours a day on dispatch paperwork alone. Flower City AI automated our bills of lading and route planning — we saved over 15 hours in the first week.',
    metric: '15hrs / week saved',
    color: '#1D4ED8',
  },
  {
    name: 'Maria R.',
    role: 'Manager, Bella Cucina',
    industry: 'Restaurant',
    emoji: '🍽️',
    quote: 'Our Instagram DMs were piling up unanswered. The AI chatbot they built handles 80% of inquiries automatically. We\'ve seen a real bump in reservations.',
    metric: '80% auto-reply rate',
    color: '#F97316',
  },
  {
    name: 'David K.',
    role: 'Broker, Peel Realty',
    industry: 'Real Estate',
    emoji: '🏢',
    quote: 'Follow-ups used to fall through the cracks constantly. Now my CRM auto-sends personalized sequences. I closed two extra deals last quarter, directly traceable to the AI.',
    metric: '2 extra deals / quarter',
    color: '#16A34A',
  },
];

function TestimonialCard({ t, delay }) {
  const [ref, visible] = useVisible();
  return (
    <div
      ref={ref}
      className={`bg-white rounded-3xl p-8 flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-xl
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ border: `3px solid ${t.color}15`, transitionDelay: `${delay}ms`, boxShadow: `0 4px 20px ${t.color}08` }}
    >
      {/* Quote */}
      <div className="flex-1">
        <div className="text-4xl mb-4" style={{ color: t.color }}>❝</div>
        <p className="font-body text-gray-600 text-sm leading-relaxed mb-6">{t.quote}</p>
      </div>

      {/* Metric chip */}
      <div className="rounded-xl px-4 py-3 mb-5 text-center"
        style={{ backgroundColor: `${t.color}10` }}>
        <span className="font-display text-2xl" style={{ color: t.color }}>{t.metric}</span>
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
          style={{ backgroundColor: `${t.color}15` }}>
          {t.emoji}
        </div>
        <div>
          <p className="font-bold text-sm text-brand-navy">{t.name}</p>
          <p className="font-body text-xs text-gray-400">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  const [headRef, headVisible] = useVisible();
  return (
    <section className="py-28 px-5" style={{ backgroundColor: '#FFFBF0' }}>
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div ref={headRef} className={`text-center mb-14 transition-all duration-700 ${headVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-white font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5"
            style={{ backgroundColor: '#F97316' }}>
            ⭐ Results That Speak
          </span>
          <h2 className="font-display text-5xl md:text-7xl text-brand-navy leading-none mb-3">
            TRUSTED BY<br />
            <span style={{ color: '#F97316' }}>FLOWER CITY</span> BUSINESSES.
          </h2>
          <p className="font-body text-gray-500 text-lg max-w-xl mx-auto">
            Real businesses. Real results. Hear from our Brampton pilot program clients.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name} t={t} delay={i * 120} />
          ))}
        </div>

        {/* Pilot CTA */}
        <div className="rounded-3xl p-8 md:p-10 text-center relative overflow-hidden" style={{ backgroundColor: '#F97316' }}>
          <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full opacity-20 pointer-events-none" style={{ backgroundColor: '#fff' }} />
          <p className="font-display text-4xl md:text-5xl text-white mb-3 relative z-10">WANT TO BE OUR NEXT SUCCESS STORY?</p>
          <p className="font-body text-white/80 text-base mb-6 max-w-lg mx-auto relative z-10">
            We're onboarding a limited number of pilot clients at a discounted rate. You get results. We get a case study. Everyone wins.
          </p>
          <a href="#contact"
            className="inline-block font-black px-9 py-4 rounded-2xl text-lg uppercase tracking-wide hover:scale-105 transition-all hover:shadow-xl btn-ripple relative z-10"
            style={{ backgroundColor: '#fff', color: '#F97316' }}>
            Become a Pilot Client →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FAQ Accordion
───────────────────────────────────────────── */
const FAQS = [
  {
    q: 'How much does this cost?',
    a: 'Our AI Readiness Audit starts as low as $500. Implementation projects range from $1,000–$5,000 depending on complexity. Monthly retainers for ongoing support run $300–$800/month. Every engagement starts with a free 30-minute discovery call — no commitment.',
  },
  {
    q: 'Will AI replace my employees?',
    a: 'No — and that\'s the whole point. AI handles the repetitive, soul-crushing busywork (data entry, answering the same 20 questions, copying data between apps) so your team can focus on the skilled, human work that actually grows your business and keeps your best people.',
  },
  {
    q: 'How long until I see results?',
    a: 'Most clients see measurable time savings within 2–4 weeks of implementation. Chatbots go live in days. Workflow automations start running immediately. Our 60-day goal is to have you saving 10–20 hours per week.',
  },
  {
    q: 'Is my business data safe?',
    a: 'Absolutely. We comply with PIPEDA (Canada\'s federal privacy law) and never sell or share your data. All AI tools we deploy are enterprise-grade with encryption. We\'ll walk you through exactly how your data is handled before anything goes live.',
  },
  {
    q: 'I\'m not technical at all. Can I still use AI?',
    a: 'That\'s exactly who we built this for. You don\'t need to write code, understand algorithms, or hire a tech team. We handle all the technical work and train your staff in plain English. If you can use a smartphone, you can use the AI tools we set up.',
  },
  {
    q: 'What makes you different from a regular IT company?',
    a: 'Most IT firms handle hardware, networks, and security. We are AI-only, AI-first. We don\'t fix printers — we build chatbots, automate workflows, and train teams to use AI in their daily work. And we\'re local to Brampton, so we actually understand the businesses here.',
  },
  {
    q: 'Do I need to buy expensive software?',
    a: 'No. Most of the tools we use have free or low-cost tiers (under $50/month). We optimize for maximum ROI — we\'ll never recommend a tool unless the time savings clearly outweigh the cost. Many clients start at under $100/month in total tools.',
  },
];

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  const [ref, visible] = useVisible();

  return (
    <div
      ref={ref}
      className={`border-b border-gray-200 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 py-6 text-left group"
      >
        <span className="font-display text-2xl md:text-3xl text-brand-navy group-hover:text-brand-blue transition-colors leading-tight">
          {faq.q}
        </span>
        <span className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all duration-300 ${open ? 'rotate-45' : ''}`}
          style={{ backgroundColor: open ? '#1D4ED8' : '#cbd5e1' }}>
          +
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-400 ${open ? 'max-h-96 pb-6' : 'max-h-0'}`}>
        <p className="font-body text-gray-500 text-base leading-relaxed max-w-3xl">{faq.a}</p>
      </div>
    </div>
  );
}

function FAQ() {
  const [headRef, headVisible] = useVisible();
  return (
    <section id="faq" className="py-28 px-5" style={{ backgroundColor: '#fff' }}>
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <div ref={headRef} className={`text-center mb-14 transition-all duration-700 ${headVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-white font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5"
            style={{ backgroundColor: '#8B5CF6' }}>
            ❓ Common Questions
          </span>
          <h2 className="font-display text-5xl md:text-7xl text-brand-navy leading-none">
            STRAIGHT<br />
            <span style={{ color: '#8B5CF6' }}>ANSWERS.</span>
          </h2>
        </div>

        {/* Accordion */}
        <div>
          {FAQS.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>

        {/* Bottom nudge */}
        <div className="text-center mt-10">
          <p className="font-body text-gray-400 text-sm mb-4">Still have questions? We love talking shop.</p>
          <a href="#contact"
            className="inline-block font-black text-sm uppercase tracking-wide px-7 py-3 rounded-xl transition-all hover:scale-105 btn-ripple"
            style={{ backgroundColor: '#8B5CF6', color: '#fff' }}>
            Ask Us Anything →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   MONEY ON THE TABLE — dramatic section
───────────────────────────────────────────── */
function MoneyOnTable() {
  const [sectionRef, sectionVisible] = useVisible(0.05);
  const [counterRef, counterVisible] = useVisible(0.3);

  const lostLeadsCount = useCounter(47, 1800, counterVisible);
  const wastedHoursCount = useCounter(1040, 2200, counterVisible);
  const lostRevenueCount = useCounter(62, 1500, counterVisible);

  // Floating dollar signs
  const moneyEmojis = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: ['💵', '💸', '💰', '🪙'][i % 4],
      left: Math.random() * 100,
      duration: Math.random() * 8 + 5,
      delay: Math.random() * 10,
      size: Math.random() * 1 + 1.2,
    }))
  ).current;

  return (
    <section id="why" className="py-28 px-5 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1a2744 100%)' }}>
      {/* Falling money background */}
      {moneyEmojis.map(m => (
        <span
          key={m.id}
          className="money-emoji"
          style={{
            left: `${m.left}%`,
            '--fall-duration': `${m.duration}s`,
            '--fall-delay': `${m.delay}s`,
            fontSize: `${m.size}rem`,
          }}
        >
          {m.emoji}
        </span>
      ))}

      {/* Decorative glow orbs */}
      <div className="absolute top-20 left-[10%] w-80 h-80 rounded-full pointer-events-none animate-glow"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)' }} />
      <div className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full pointer-events-none animate-glow"
        style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.1) 0%, transparent 70%)', animationDelay: '1.5s' }} />

      <div ref={sectionRef} className="max-w-6xl mx-auto relative z-10">

        {/* Dramatic headline */}
        <div className={`text-center mb-10 transition-all duration-1000 ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <span className="inline-block font-black text-xs uppercase tracking-widest px-5 py-2.5 rounded-full mb-6"
            style={{ backgroundColor: '#DC2626', color: '#fff', boxShadow: '0 0 30px rgba(220,38,38,0.4)' }}>
            ⚠️ Warning: This Might Sting
          </span>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-none mb-6">
            YOUR BUSINESS IS<br />
            <span className="gradient-text">BLEEDING MONEY</span><br />
            RIGHT NOW.
          </h2>
          <p className="font-body text-white/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Every day without AI, you're paying the <strong className="text-white/80">invisible tax</strong> — lost leads, wasted hours, and opportunities walking straight to your competitor.
          </p>
        </div>

        {/* Live counter strip */}
        <div ref={counterRef} className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-14 transition-all duration-700 ${counterVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="font-display text-6xl md:text-7xl text-red-400 counter-value mb-2">{lostLeadsCount}%</div>
            <div className="font-body text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Customer inquiries</div>
            <div className="font-body text-white/70 text-sm">go unanswered after hours — your competitor with a chatbot gets them instead.</div>
          </div>
          <div className="glass-card rounded-2xl p-8 text-center" style={{ animationDelay: '200ms' }}>
            <div className="font-display text-6xl md:text-7xl counter-value mb-2" style={{ color: '#FCD34D' }}>{wastedHoursCount}</div>
            <div className="font-body text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Hours per year</div>
            <div className="font-body text-white/70 text-sm">wasted on tasks a $50/month AI tool could handle in seconds.</div>
          </div>
          <div className="glass-card rounded-2xl p-8 text-center" style={{ animationDelay: '400ms' }}>
            <div className="font-display text-6xl md:text-7xl counter-value mb-2" style={{ color: '#F97316' }}>${lostRevenueCount}K+</div>
            <div className="font-body text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Revenue left behind</div>
            <div className="font-body text-white/70 text-sm">annually by the average small business that hasn't adopted AI yet.</div>
          </div>
        </div>

        {/* Pain cards — vivid, emotional */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <PainCard
            emoji="😤" title="Missed Inquiries = Lost Revenue"
            desc="A customer messages you at 9 PM. You see it at 8 AM. By then, they've already booked with someone else. Every single unanswered message is a sale you'll never know you lost."
            stat="$1,200+" statLabel="avg. lost per missed lead"
            bgColor="#DC2626" textLight index={0} />
          <PainCard
            emoji="📋" title="Manual Data Entry Is Bleeding You Dry"
            desc="Copy. Paste. Copy. Paste. Your team spends 3 hours a day moving data between apps that should be talking to each other. That's 780 hours a year of pure waste."
            stat="780 hrs/yr" statLabel="wasted on copy-paste"
            bgColor="#F97316" textLight index={1} />
          <PainCard
            emoji="🗺️" title="Bad Routes Are Burning Cash"
            desc="Every unoptimized route costs you fuel, time, and driver frustration. Flower City trucking firms are losing $2,000–$5,000 per month on routes that AI can fix in a single afternoon."
            stat="$3,500/mo" statLabel="avg. route waste"
            bgColor="#0F172A" textLight index={2} />
          <PainCard
            emoji="🤝" title="Your Best People Are Burning Out"
            desc="Your top employees didn't sign up to answer the same 20 questions every day. They're doing admin, not the skilled work you hired them for. AI handles the busywork — they handle the brilliance."
            stat="73%" statLabel="of employees cite burnout from repetitive tasks"
            bgColor="#1D4ED8" textLight index={3} />
        </div>

        {/* Urgency callout */}
        <div className={`rounded-3xl px-8 md:px-12 py-8 md:py-10 relative overflow-hidden transition-all duration-700 ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ background: 'linear-gradient(135deg, #FCD34D 0%, #F97316 100%)' }}>
          <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full opacity-20 pointer-events-none" style={{ backgroundColor: '#fff' }} />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div>
              <p className="font-display text-4xl md:text-5xl text-brand-navy leading-tight mb-2">
                THE LONGER YOU WAIT,<br className="hidden md:block" /> THE MORE YOU LOSE.
              </p>
              <p className="font-body text-brand-navy/70 text-base">
                AI isn't just for big corporations anymore. It's for the bakery on Queen Street, the trucking company on Steeles, and the accountant on Main.
              </p>
            </div>
            <a href="#contact"
              className="shrink-0 font-black px-9 py-4 rounded-xl uppercase tracking-wide transition-all hover:scale-105 whitespace-nowrap text-lg btn-ripple"
              style={{ backgroundColor: '#0F172A', color: '#FCD34D', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              Stop The Bleeding →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   MONEY LEAKING AUDIT — Interactive
───────────────────────────────────────────── */
function MoneyLeakingAudit() {
  const [leaks, setLeaks] = useState({
    'No 24/7 Chatbot': true,
    'Manual Invoicing': false,
    'Poor Route Optimization': false,
    'Paper Paperwork': true,
    'Manual Email Follow-ups': false,
    'Spreadsheet Inventory': true,
  });

  const leakCosts = {
    'No 24/7 Chatbot': 1200,
    'Manual Invoicing': 850,
    'Poor Route Optimization': 2500,
    'Paper Paperwork': 400,
    'Manual Email Follow-ups': 600,
    'Spreadsheet Inventory': 950,
  };

  const toggleLeak = (leak) => {
    setLeaks(prev => ({ ...prev, [leak]: !prev[leak] }));
  };

  const totalLeak = Object.keys(leaks)
    .filter(k => leaks[k])
    .reduce((acc, k) => acc + leakCosts[k], 0);

  const [ref, visible] = useVisible(0.1);

  return (
    <div ref={ref} className={`max-w-4xl mx-auto mb-20 transition-all duration-1000 ${visible ? 'opacity-100' : 'opacity-0 scale-95'}`}>
      <div className="bg-brand-navy rounded-[3rem] p-8 md:p-12 border-4 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-display text-5xl text-white mb-6">CHECK YOUR <br /><span className="text-red-500">PROFIT LEAKS</span></h3>
            <p className="font-body text-white/60 mb-8">Select the current bottlenecks in your business to see how much they're costing you every single month.</p>

            <div className="space-y-3">
              {Object.keys(leaks).map(leak => (
                <button
                  key={leak}
                  onClick={() => toggleLeak(leak)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${leaks[leak] ? 'bg-red-600/20 border-2 border-red-600' : 'bg-white/5 border-2 border-white/10 hover:bg-white/10'}`}
                >
                  <span className={`font-bold text-sm ${leaks[leak] ? 'text-red-400' : 'text-white/40'}`}>{leak}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${leaks[leak] ? 'border-red-500 bg-red-500' : 'border-white/20'}`}>
                    {leaks[leak] && <span className="text-white text-xs">✓</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center bg-white/5 rounded-[2rem] p-10 relative overflow-hidden">
            {/* Pulsing Alert Circle */}
            <div className="absolute inset-0 bg-red-600/5 animate-pulse" />

            <p className="font-body text-white/40 text-xs uppercase tracking-[0.2em] mb-4 relative z-10">Estimated Monthly Leak</p>
            <div className="font-display text-6xl sm:text-7xl md:text-8xl text-red-500 leading-none mb-4 relative z-10 transition-all duration-500 transform hover:scale-110">
              ${totalLeak.toLocaleString()}
            </div>
            <p className="font-body text-white/80 text-lg mb-8 relative z-10">That's <span className="text-red-500 font-bold">${(totalLeak * 12).toLocaleString()}</span> disappearing per year.</p>

            <a href="#contact" className="block w-full py-5 bg-white text-brand-navy font-black text-xl rounded-2xl transition-all hover:scale-105 hover:shadow-2xl relative z-10">
              PLUG THE LEAKS NOW →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main App
───────────────────────────────────────────── */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const mouseOffset = useMouseParallax(0.015);

  const handleFormSubmit = (e) => {
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
      method: 'POST',
      mode: 'no-cors',
      body: googleFormData
    }).then(() => {
      setSubmitted(true);
    }).catch(() => {
      setSubmitted(true); 
    });
  };

  const typedText = useTypewriter([
    'save upto 20 hours a week.',
    'automate its busywork.',
    'supercharge its growth.',
    'outsmart its competition.',
    'reclaim its time.',
  ], 40, 35, 2200);

  // Track scroll for nav background
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Hero load animation
  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="font-body bg-brand-cream min-h-screen text-brand-navy overflow-x-hidden">

      {/* Scroll progress */}
      <ScrollProgress />

      {/* ══════ NAV ══════ */}
      <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'nav-glass shadow-2xl' : ''}`}
        style={{ backgroundColor: scrolled ? undefined : '#0F172A', borderBottom: scrolled ? '2px solid rgba(252,211,77,0.3)' : '4px solid #FCD34D' }}>
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">

          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display text-xl group-hover:rotate-6 transition-transform duration-300"
              style={{ backgroundColor: '#FCD34D', color: '#0F172A', boxShadow: '0 2px 10px rgba(252,211,77,0.3)' }}>
              AI
            </div>
            <div>
              <div className="font-display text-xl text-white leading-none tracking-wide">FLOWER CITY AI</div>
              <div className="font-body text-xs font-bold tracking-widest uppercase leading-none" style={{ color: '#FCD34D' }}>Brampton, ON</div>
            </div>
          </a>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-6">
            {['#why|Why AI', '#process|How It Works', '#services|Services', '#faq|FAQ'].map(item => {
              const [href, label] = item.split('|');
              return (
                <a key={href} href={href} className="font-bold text-sm text-white/70 hover:text-white transition-colors duration-200 relative group">
                  {label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-yellow group-hover:w-full transition-all duration-300" />
                </a>
              );
            })}
            <a href="#contact"
              className="font-black text-sm uppercase tracking-wide px-5 py-2.5 rounded-xl transition-all hover:scale-105 hover:shadow-lg btn-ripple"
              style={{ backgroundColor: '#FCD34D', color: '#0F172A' }}>
              Free Call →
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(o => !o)} className="md:hidden p-2" aria-label="Menu">
            <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile dropdown */}
        <div className={`md:hidden overflow-hidden transition-all duration-400 ${menuOpen ? 'max-h-96' : 'max-h-0'}`}
          style={{ backgroundColor: '#0F172A' }}>
          <div className="px-5 pb-5 flex flex-col gap-3">
            {['#why|Why AI', '#process|How It Works', '#services|Services', '#faq|FAQ'].map(item => {
              const [href, label] = item.split('|');
              return <a key={href} href={href} onClick={() => setMenuOpen(false)} className="font-bold text-white/80 py-2">{label}</a>;
            })}
            <a href="#contact" onClick={() => setMenuOpen(false)}
              className="font-black uppercase tracking-wide px-5 py-3 rounded-xl text-center"
              style={{ backgroundColor: '#FCD34D', color: '#0F172A' }}>
              Book Free Call →
            </a>
          </div>
        </div>
      </header>

      {/* ══════ HERO — Super Interactive ══════ */}
      <section id="home" className="relative overflow-hidden min-h-[calc(100svh-80px)] py-16 md:py-24 flex flex-col justify-center"
        style={{ background: 'linear-gradient(145deg, #0c1a3d 0%, #1D4ED8 40%, #1a3a8a 70%, #0F172A 100%)' }}>

        {/* Animated particles */}
        <HeroParticles />

        {/* Large decorative glow orbs with parallax */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none animate-glow"
          style={{
            background: 'radial-gradient(circle, rgba(252,211,77,0.2) 0%, transparent 70%)',
            transform: `translate(${mouseOffset.x * 2}px, ${mouseOffset.y * 2}px)`,
            transition: 'transform 0.3s ease-out',
          }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none animate-glow"
          style={{
            background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)',
            transform: `translate(${mouseOffset.x * -1.5}px, ${mouseOffset.y * -1.5}px)`,
            transition: 'transform 0.3s ease-out',
            animationDelay: '1.5s',
          }} />

        <div className="relative max-w-6xl mx-auto px-5 py-12 md:py-0 grid md:grid-cols-2 gap-8 md:gap-12 items-center w-full z-10">
          {/* Left: Copy — staggered entrance */}
          <div>
            {/* Location badge */}
            <div className={`inline-flex items-center gap-2 font-black text-[10px] md:text-xs uppercase tracking-widest px-3 md:px-4 py-2 md:py-2.5 rounded-full mb-5 md:mb-8 transition-all duration-700 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ backgroundColor: '#FCD34D', color: '#0F172A', transitionDelay: '200ms', boxShadow: '0 4px 20px rgba(252,211,77,0.3)' }}>
              <span className="animate-pulse">📍</span> Brampton, Ontario · Flower City AI
            </div>

            {/* Main headline */}
            <h1 className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[0.9] mb-4 md:mb-6 transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: '400ms' }}>
              WE HELP<br />
              YOUR BIZ<br />
              <span className="relative block w-full">
                {/* Lock height to the longest phrase */}
                <span className="invisible pointer-events-none select-none block" aria-hidden="true">
                  outsmart its competition.
                </span>
                <span className="gradient-text absolute top-0 left-0 w-full h-full">
                  {typedText}
                  <span style={{ animation: 'typewriter-cursor 0.8s step-end infinite', color: '#FCD34D' }}>|</span>
                </span>
              </span>
            </h1>

            {/* Subline */}
            <p className={`font-body text-white/70 text-base md:text-lg lg:text-xl leading-relaxed mb-6 md:mb-8 max-w-lg transition-all duration-700 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '700ms' }}>
              Practical AI for Brampton's trucking companies, restaurants, and retail shops.
              <strong className="text-white"> No tech team needed. No jargon. Just results.</strong>
            </p>

            {/* Social proof strip */}
            <div className={`flex items-center gap-3 md:gap-4 mb-6 md:mb-8 transition-all duration-700 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '900ms' }}>
              <div className="flex -space-x-2">
                {['🚛', '🍽️', '🏢', '🧑‍💻'].map((e, i) => (
                  <div key={i} className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-white/20 flex items-center justify-center text-sm md:text-lg"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>{e}</div>
                ))}
              </div>
              <p className="text-white/50 text-xs md:text-sm font-body">
                Trusted by <strong className="text-white/80">local Brampton businesses</strong>
              </p>
            </div>

            {/* CTAs */}
            <div className={`flex flex-col sm:flex-row gap-3 mb-6 md:mb-8 transition-all duration-700 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '1100ms' }}>
              <a href="#contact"
                className="font-black text-lg uppercase tracking-wide px-8 py-4 rounded-2xl transition-all hover:scale-105 hover:shadow-2xl text-center btn-ripple group"
                style={{ backgroundColor: '#FCD34D', color: '#0F172A', boxShadow: '0 4px 30px rgba(252,211,77,0.4)' }}>
                <span className="group-hover:mr-1 transition-all">Book Free 30-Min Call</span> →
              </a>
              <a href="#why"
                className="border-2 border-white/30 hover:border-white/70 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all hover:bg-white/5 text-center group">
                <span className="group-hover:mr-1 transition-all">See What You're Missing</span> ↓
              </a>
            </div>

            {/* Trust badge */}
            <p className={`text-white/30 text-xs font-body transition-all duration-700 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: '1400ms' }}>
              ✓ No commitment &nbsp; ✓ 100% free consultation &nbsp; ✓ Results in 60 days
            </p>
          </div>

          {/* Right: Interactive feature cards with mouse parallax */}
          <div className="hidden md:grid grid-cols-2 gap-4" style={{
            transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)`,
            transition: 'transform 0.5s ease-out',
          }}>
            {[
              { emoji: '🚛', label: 'Route Optimization', stat: 'Save $3.5K/mo', bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.12)' },
              { emoji: '💬', label: '24/7 AI Chatbots', stat: 'Never miss a lead', bg: '#FCD34D', border: '#FCD34D', textDark: true },
              { emoji: '📦', label: 'Inventory AI', stat: '95% accuracy', bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.12)' },
              { emoji: '⚡', label: 'Workflow Automation', stat: '20 hrs/week saved', bg: '#F97316', border: '#F97316' },
            ].map((card, i) => (
              <div key={i}
                className={`glass-card rounded-2xl p-6 flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-500 cursor-default group
                  ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{
                  backgroundColor: card.bg,
                  borderColor: card.border,
                  animation: `float 5s ease-in-out ${i * 0.7}s infinite`,
                  transitionDelay: `${600 + i * 150}ms`,
                }}>
                <span className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">{card.emoji}</span>
                <span className={`font-bold text-sm mb-1 ${card.textDark ? 'text-brand-navy' : 'text-white'}`}>{card.label}</span>
                <span className={`text-xs font-bold uppercase tracking-wider ${card.textDark ? 'text-brand-navy/60' : 'text-white/50'}`}>{card.stat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator transition-all duration-700 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '2000ms' }}>
          <div className="w-7 h-11 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 rounded-full bg-white/60 animate-bounce-subtle" />
          </div>
        </div>

        {/* Bottom wave */}
        <div className="section-wave">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" fill="#FCD34D">
            <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,25 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ══════ YOUR BUSINESS IS BLEEDING MONEY ══════ */}
      <MoneyOnTable />

      {/* ══════ ROI CALCULATOR ══════ */}
      <ROICalculator />

      {/* ══════ HOW IT WORKS ══════ */}
      <HowItWorks />

      {/* ══════ SERVICES ══════ */}
      <section id="services" className="py-24 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-white font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5"
              style={{ backgroundColor: '#16A34A' }}>
              What We Do
            </span>
            <h2 className="font-display text-6xl md:text-7xl text-brand-navy leading-none">
              OUR FOUR<br />
              <span style={{ color: '#16A34A' }}>SERVICES.</span>
            </h2>
            <p className="font-body text-gray-500 mt-4 text-lg">Click any card to expand.</p>
          </div>

          <div className="flex flex-col gap-5 mb-14">
            <ServiceCard index={0} num="01" icon="🔍" tag="Start Here" sub="The Digital Soil Test" title="AI Readiness Audit" bgColor="#1D4ED8"
              desc="We review your software, workflows, and pain points. You get a plain-English 'AI Roadmap' showing exactly what to fix and what to automate."
              outcome="Custom AI Roadmap Report" />
            <ServiceCard index={1} num="02" icon="⚡" tag="Most Popular" sub="Precision Sowing" title="Workflow Automation" bgColor="#F97316"
              desc="Connect your apps (invoicing, dispatch, CRM) so data flows automatically. Built with Zapier & Make — no code, no IT team, no pain."
              outcome="Save 10–20 hrs / week" />
            <ServiceCard index={2} num="03" icon="💬" tag="Quick Win" sub="Always-On Tendril" title="Customer Service AI" bgColor="#16A34A"
              desc="AI chatbots on your website, WhatsApp, and social media. Answer FAQs and book appointments 24/7 — even while you sleep."
              outcome="More leads, faster replies" />
            <ServiceCard index={3} num="04" icon="🎓" tag="Team Boost" sub="Grow Your Cultivators" title="AI Team Training" bgColor="#0F172A"
              desc="On-site or virtual workshops. Your staff learn ChatGPT, Gemini, and Copilot for daily tasks — not theory, just real results."
              outcome="Faster output, less busywork" />
          </div>

          {/* Urgency CTA strip — merged from Custom Solutions */}
          <div className="rounded-3xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
            style={{ backgroundColor: '#FCD34D' }}>
            <div className="absolute -right-16 -bottom-16 w-52 h-52 rounded-full opacity-20 pointer-events-none" style={{ backgroundColor: '#F97316' }} />
            <div className="relative z-10">
              <p className="font-display text-4xl md:text-5xl text-brand-navy leading-tight mb-2">
                EVERY SOLUTION IS<br className="hidden md:block" /> BUILT AROUND YOU.
              </p>
              <p className="font-body text-brand-navy/70 text-base">
                No cookie-cutter templates. No vendor lock-in. Your AI, your rules.
              </p>
            </div>
            <a href="#contact"
              className="shrink-0 font-black text-lg uppercase tracking-wide px-9 py-5 rounded-2xl transition-all hover:scale-105 hover:shadow-2xl whitespace-nowrap btn-ripple relative z-10"
              style={{ backgroundColor: '#0F172A', color: '#FCD34D' }}>
              Start Today →
            </a>
          </div>
        </div>
      </section>

      {/* ══════ SEE WHAT YOU NEED ══════ */}
      <SeeWhatYouNeed />

      {/* ══════ FAQ ══════ */}
      <FAQ />

      {/* ══════ CONTACT ══════ */}
      <section id="contact" className="py-24 px-5" style={{ backgroundColor: '#FFFBF0' }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block text-white font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5"
              style={{ backgroundColor: '#0F172A' }}>
              Let's Talk
            </span>
            <h2 className="font-display text-6xl md:text-7xl text-brand-navy leading-none">
              BOOK YOUR<br />
              <span style={{ color: '#1D4ED8' }}>FREE CALL.</span>
            </h2>
            <p className="font-body text-gray-500 text-base mt-4">
              No commitment. No jargon. Just a straight talk about where AI saves your business time and money.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-3xl p-12 text-center" style={{ backgroundColor: '#16A34A', animation: 'popIn 0.5s cubic-bezier(.34,1.56,.64,1) both' }}>
              <div className="text-7xl mb-4">🎉</div>
              <h3 className="font-display text-4xl text-white mb-3">GOT IT! WE'LL BE IN TOUCH.</h3>
              <p className="font-body text-white/80">We respond within 24 hours. Based right here in Brampton — the Flower City.</p>
            </div>
          ) : (
            <form
              onSubmit={handleFormSubmit}
              className="bg-white rounded-3xl p-8 md:p-10"
              style={{ border: '4px solid #0F172A', boxShadow: '6px 6px 0 #0F172A' }}
            >
              <div className="grid md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block font-bold text-xs uppercase tracking-widest text-gray-500 mb-2">Your Name *</label>
                  <input required type="text" name="name" placeholder="Jane Smith"
                    className="w-full rounded-xl px-4 py-3 font-body outline-none transition-all duration-300 text-brand-navy"
                    style={{ border: '2px solid #e5e7eb' }}
                    onFocus={e => { e.target.style.borderColor = '#1D4ED8'; e.target.style.boxShadow = '0 0 0 3px rgba(29,78,216,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div>
                  <label className="block font-bold text-xs uppercase tracking-widest text-gray-500 mb-2">Business Name *</label>
                  <input required type="text" name="business" placeholder="Smith Logistics Inc."
                    className="w-full rounded-xl px-4 py-3 font-body outline-none transition-all duration-300 text-brand-navy"
                    style={{ border: '2px solid #e5e7eb' }}
                    onFocus={e => { e.target.style.borderColor = '#1D4ED8'; e.target.style.boxShadow = '0 0 0 3px rgba(29,78,216,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block font-bold text-xs uppercase tracking-widest text-gray-500 mb-2">Email *</label>
                  <input required type="email" name="email" placeholder="jane@smithlogistics.ca"
                    className="w-full rounded-xl px-4 py-3 font-body outline-none transition-all duration-300 text-brand-navy"
                    style={{ border: '2px solid #e5e7eb' }}
                    onFocus={e => { e.target.style.borderColor = '#1D4ED8'; e.target.style.boxShadow = '0 0 0 3px rgba(29,78,216,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div>
                  <label className="block font-bold text-xs uppercase tracking-widest text-gray-500 mb-2">Phone</label>
                  <input type="tel" name="phone" placeholder="(905) 555-0123"
                    className="w-full rounded-xl px-4 py-3 font-body outline-none transition-all duration-300 text-brand-navy"
                    style={{ border: '2px solid #e5e7eb' }}
                    onFocus={e => { e.target.style.borderColor = '#1D4ED8'; e.target.style.boxShadow = '0 0 0 3px rgba(29,78,216,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
                </div>
              </div>

              <div className="mb-5">
                <label className="block font-bold text-xs uppercase tracking-widest text-gray-500 mb-2">Industry *</label>
                <select required name="industry"
                  className="w-full rounded-xl px-4 py-3 font-body outline-none transition-all duration-300 text-brand-navy bg-white"
                  style={{ border: '2px solid #e5e7eb' }}
                  onFocus={e => { e.target.style.borderColor = '#1D4ED8'; e.target.style.boxShadow = '0 0 0 3px rgba(29,78,216,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}>
                  <option value="">Select your industry…</option>
                  <option>Logistics & Transportation</option>
                  <option>Retail</option>
                  <option>Restaurant / Food Service</option>
                  <option>Real Estate</option>
                  <option>Other Professional Services</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block font-bold text-xs uppercase tracking-widest text-gray-500 mb-2">Biggest Time-Waster in Your Business *</label>
                <textarea required name="pain_point" placeholder="e.g. We spend 15 hours a week manually entering dispatch data into our system…"
                  className="w-full rounded-xl px-4 py-3 font-body outline-none transition-all duration-300 resize-none h-28 text-brand-navy"
                  style={{ border: '2px solid #e5e7eb' }}
                  onFocus={e => { e.target.style.borderColor = '#1D4ED8'; e.target.style.boxShadow = '0 0 0 3px rgba(29,78,216,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
              </div>

              <button type="submit"
                className="w-full text-white font-black py-4 rounded-2xl text-lg uppercase tracking-wide transition-all hover:opacity-90 hover:scale-[1.02] hover:shadow-xl btn-ripple"
                style={{ backgroundColor: '#1D4ED8', boxShadow: '0 4px 20px rgba(29,78,216,0.3)' }}>
                Claim My Free 30-Min Call →
              </button>
              <p className="text-center text-gray-400 font-body text-xs mt-4">🌸 Flower City AI · Responding within 24 hours</p>
            </form>
          )}
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="py-12 px-5" style={{ backgroundColor: '#0F172A', borderTop: '4px solid #FCD34D' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display text-xl"
              style={{ backgroundColor: '#FCD34D', color: '#0F172A' }}>AI</div>
            <div>
              <div className="font-display text-xl text-white">FLOWER CITY AI</div>
              <div className="font-body text-xs font-bold" style={{ color: '#FCD34D' }}>Precision Business Cultivation · Brampton, ON</div>
            </div>
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            {[['#why', 'Why AI'], ['#process', 'How It Works'], ['#services', 'Services'], ['#faq', 'FAQ'], ['#contact', 'Contact']].map(([href, label]) => (
              <a key={href} href={href} className="font-bold text-sm text-white/60 hover:text-white transition-colors">{label}</a>
            ))}
          </nav>
          <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>© {new Date().getFullYear()} Flower City AI</p>
        </div>
      </footer>

    </div>
  );
}
