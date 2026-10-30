import { useEffect, useRef, useState } from 'react';
import { CONTACT_URL, CONTACT_EMAIL, FOUNDER_NAME, HAS_BOOKING } from './config';

const CHAPTERS = [
  { id: 'intro', letter: 'A', name: 'Intro' },
  { id: 'why', letter: 'B', name: 'Why' },
  { id: 'team', letter: 'C', name: 'Your team' },
  { id: 'demo', letter: 'D', name: 'See it' },
  { id: 'services', letter: 'E', name: 'Services' },
  { id: 'funding', letter: 'F', name: 'Funding' },
  { id: 'about', letter: 'G', name: 'About' },
  { id: 'contact', letter: 'H', name: 'Contact' },
];
const MOODS = {
  sceptical: { label: 'Sceptical', say: 'Good. Healthy scepticism is the right starting point. We’ll show you one real task, on your own work, and you decide if it’s worth going further.', step: 'AI Opportunity Audit' },
  curious: { label: 'Curious', say: 'Let’s find the one place AI would save your team the most time, then prove it with a worked example before anyone commits.', step: 'AI Opportunity Audit' },
  stretched: { label: 'Stretched thin', say: 'Understood. You don’t need ten new tools. You need one routine that stops eating your week. We’ll pick it together and keep it small.', step: 'Customer updates or one workflow' },
  ready: { label: 'Ready to roll out', say: 'Great. The fastest wins come from a team that knows how to check AI’s work. We’ll train your people on their own tasks, then build on what sticks.', step: 'Team AI training' },
};
const EXAMPLES = {
  distribution: { label: 'Distribution & 3PL', ask: 'Can you draft an update for Priya? Two pallets on PO 4471 were held at the carrier.', sample: 'Hi Priya, quick update on PO 4471: four pallets arrived Tuesday as planned. Two were held at the carrier and are now scheduled for Thursday. We’ll confirm once they’re on the truck.', detail: 'You confirm the PO, dates and quantities before it goes.' },
  trades: { label: 'Trades', ask: 'I still need to follow up on Sam’s driveway quote.', sample: 'Hi Sam, just checking whether you have any questions about your driveway quote. Let me know a good time to talk about next steps.', detail: 'You check the measurements, price and wording.' },
  services: { label: 'Offices', ask: 'Turn my notes from the Jordan meeting into a recap email.', sample: 'Hi Jordan, thanks for today. Here’s our recap: confirm the scope, choose a start date, and send over the approved documents. Let me know if I missed anything.', detail: 'You check the facts and confidentiality before sharing.' },
  retail: { label: 'Retail', ask: 'Someone’s asking about a table for six on Saturday.', sample: 'Hi Alex, thanks for reaching out about a table for six on Saturday. What time works best? We’ll check availability and confirm with you shortly.', detail: 'Your team checks availability and any exceptions.' },
};
const SERVICES = [
  { tag: 'Clarity', name: 'AI Opportunity Audit', detail: 'We review your repeated tasks, show one worked example, and hand you a ranked plan you own.', link: '/sample-audit.html', linkText: 'See a sample audit' },
  { tag: 'Confidence', name: 'Team AI training', detail: 'Hands-on practice with your real tasks, useful templates, and how to catch AI when it’s wrong.' },
  { tag: 'Steadier replies', name: 'Customer updates', detail: 'Approved answer guides and drafted updates that your team reviews before anything is sent.' },
  { tag: 'Time back', name: 'Workflows & admin', detail: 'Start with one repeatable job, like shift handovers or routing enquiries, with a human check built in.' },
];
const STEPS = [
  ['Understand', 'We look at the work that eats your team’s time and choose one useful first improvement.'],
  ['Practise', 'Hands-on training with your everyday tasks, including how to catch mistakes.'],
  ['Build', 'We set up one small workflow, with a clear review step, once the task is ready.'],
];
const FAQS = [
  ['Do we need to know anything about AI?', 'No. Bring a task that takes too much time. We work through it in plain English, using the tools you already have where possible.'],
  ['What if AI isn’t the right answer?', 'We’ll say so. We may recommend a better template, a feature your software already has, or leaving a process alone. You own any plan we make together and don’t have to buy anything else.'],
  ['Will we have to replace our team or software?', 'No. We start by helping your existing team, assess the tools you already use, and keep people in charge of important decisions. Any new subscriptions are agreed separately.'],
  ['Can a grant pay for this?', 'Some projects may qualify, depending on your business, the provider, costs and current intake. Our commercial audit is not automatically an approved grant deliverable. We check options before any work meant for funding begins.'],
];
const TAGS = [['Carrier delays', 't1'], ['Shift handovers', 't3']];

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Logo() {
  return <svg className="logo" viewBox="0 0 40 40" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1.6">{[0, 72, 144, 216, 288].map(r => <ellipse key={r} cx="20" cy="11" rx="6" ry="9" transform={`rotate(${r} 20 20)`}/>)}</g><circle cx="20" cy="20" r="2.5" fill="currentColor"/></svg>;
}
function Dots() {
  return <svg className="dots" viewBox="0 0 16 16" aria-hidden="true"><circle cx="4" cy="4" r="1.6"/><circle cx="12" cy="6" r="1.6"/><circle cx="6" cy="12" r="1.6"/><circle cx="12.5" cy="12.5" r="1"/></svg>;
}
function Words({ text }) {
  return text.split(' ').map((word, i) => <span className="w" style={{ '--i': i }} key={i}>{word}{' '}</span>);
}
function ContactLink({ className = '', children = 'Book a free fit call' }) {
  return <a className={`btn ${className}`} href={CONTACT_URL} target="_blank" rel="noopener noreferrer"><Dots/>{children}<span className="sr-only"> (opens {HAS_BOOKING ? 'booking page' : 'Google Forms'} in a new tab)</span></a>;
}
function Mark({ letter }) {
  return <span className="mark" aria-hidden="true">{letter}</span>;
}

function WeekDemo() {
  const [industry, setIndustry] = useState('distribution');
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState('');
  const [seen, setSeen] = useState(false);
  const box = useRef(null);
  const example = EXAMPLES[industry];

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setSeen(true); observer.disconnect(); } }, { threshold: 0.35 });
    if (box.current) observer.observe(box.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!seen) return;
    const text = EXAMPLES[industry].sample;
    if (prefersReduced()) { setTyped(text); setPhase(3); return; }
    const timers = [];
    let interval;
    setPhase(0); setTyped('');
    timers.push(setTimeout(() => setPhase(1), 600));
    timers.push(setTimeout(() => {
      setPhase(2);
      let i = 0;
      interval = setInterval(() => {
        i += 2; setTyped(text.slice(0, i));
        if (i >= text.length) { clearInterval(interval); timers.push(setTimeout(() => setPhase(3), 400)); }
      }, 22);
    }, 1700));
    return () => { timers.forEach(clearTimeout); clearInterval(interval); };
  }, [industry, seen]);

  const status = phase === 1 ? 'Thinking' : phase === 2 ? 'Drafting' : phase === 3 ? 'Waiting for your OK' : 'Listening';
  return <div className="demo" ref={box}>
    <div className="chips" role="group" aria-label="Choose your kind of business">
      {Object.entries(EXAMPLES).map(([key, item]) => <button key={key} type="button" aria-pressed={industry === key} onClick={() => setIndustry(key)}>{item.label}</button>)}
    </div>
    <div className="panel chat">
      <div className="chat-head"><span className={`pulse ${phase === 1 || phase === 2 ? 'busy' : ''}`}/><span className="caps">Assistant · {status}</span></div>
      <div className="chat-body">
        <div className="msg you">{example.ask}</div>
        {phase === 1 && <div className="typing" aria-hidden="true"><span/><span/><span/></div>}
        {phase >= 2 && <div className="msg ai"><span className="caps label">Draft for your review</span><span aria-hidden="true">{typed}</span><span className="sr-only">{example.sample}</span>{phase === 2 && <i className="caret" aria-hidden="true"/>}</div>}
        {phase === 3 && <div className="approve"><span aria-hidden="true">✓</span><div><b>You check it. You send it.</b><small>{example.detail}</small></div></div>}
      </div>
    </div>
    <p className="fine">Illustrative example. Real work is tailored to your business.</p>
  </div>;
}

export default function App() {
  const [entered, setEntered] = useState(() => { try { return sessionStorage.getItem('fca-entered') === '1'; } catch { return false; } });
  const [active, setActive] = useState('A');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mood, setMood] = useState('sceptical');
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const loadRef = useRef(null);
  const knobRef = useRef(null);
  const fieldRef = useRef(null);

  // The Waveism sensitivity scene loads after first paint so the content is never blocked by WebGL.
  useEffect(() => {
    let cancelled = false, lastLoad = -1;
    import('./chaosField.js').then(({ createChaosField }) => {
      if (cancelled || !canvasRef.current) return;
      try {
        fieldRef.current = createChaosField(canvasRef.current, {
          grabZone: heroRef.current,
          reduced: prefersReduced(),
          startChaos: entered ? 0.6 : 0.4,
          // Only touch the DOM when the value visibly changes, to keep style work off most frames.
          onFrame: (load) => {
            const value = Math.round(load * 400) / 400;
            if (value === lastLoad) return;
            lastLoad = value;
            heroRef.current?.style.setProperty('--chaos', value);
            if (knobRef.current) knobRef.current.style.setProperty('--load', value);
            const percent = `${Math.round(load * 100)}%`;
            if (loadRef.current && loadRef.current.textContent !== percent) loadRef.current.textContent = percent;
          },
        });
        document.documentElement.classList.add('has-field');
      } catch { /* No WebGL: the CSS glow stays as a fallback. */ }
    });
    return () => { cancelled = true; fieldRef.current?.destroy(); };
  }, []);

  useEffect(() => {
    if (entered) return;
    document.documentElement.classList.add('is-gated');
    return () => document.documentElement.classList.remove('is-gated');
  }, [entered]);

  const enter = () => {
    try { sessionStorage.setItem('fca-entered', '1'); } catch { /* private mode */ }
    setEntered(true);
    fieldRef.current?.disturb(0.6);
  };

  // Fade the scene back once the visitor scrolls past the hero.
  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;
    const fade = () => {
      frame = 0;
      const y = window.scrollY;
      // Remember which way the visitor is travelling so transitions can follow it.
      if (Math.abs(y - lastY) > 2) document.documentElement.dataset.dir = y > lastY ? 'down' : 'up';
      lastY = y;
      if (canvasRef.current) canvasRef.current.style.opacity = Math.max(0.6, 1 - y / window.innerHeight * 0.4).toFixed(3);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(fade); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track the active chapter letter, and blur-in text marked data-reveal.
  useEffect(() => {
    const chapters = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      setActive(entry.target.dataset.chapter);
      fieldRef.current?.setShape(entry.target.dataset.chapter, document.documentElement.dataset.dir === 'up' ? -1 : 1);
    }), { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('[data-chapter]').forEach(el => chapters.observe(el));
    // Each chapter is a stop: its content settles in when you arrive and resets once it is fully off screen.
    const stops = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.intersectionRatio >= 0.45) entry.target.classList.add('is-live');
      else if (!entry.isIntersecting) entry.target.classList.remove('is-live');
    }), { threshold: [0, 0.45] });
    document.querySelectorAll('[data-chapter]').forEach(el => stops.observe(el));
    return () => { chapters.disconnect(); stops.disconnect(); };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const key = (event) => { if (event.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [menuOpen]);

  const current = MOODS[mood];
  const activeName = CHAPTERS.find(c => c.letter === active)?.name;

  return <>
    <a className="skip-link caps" href="#main">Skip to content</a>
    <canvas className="field" ref={canvasRef} aria-hidden="true"/>

    {!entered && <div className="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title">
      <div className="gate-inner">
        <span className="gate-logo"><Logo/><b>Flower City AI</b></span>
        <h2 id="gate-title" className="title-small accent">Welcome. Glad you’re here.</h2>
        <p>Friendly, practical AI help for businesses across the GTA. Give the shape a gentle push, then watch it settle.</p>
        <button className="btn ghost" type="button" onClick={enter} autoFocus><Dots/>Come on in</button>
        <button className="link-caps" type="button" onClick={enter}>Skip</button>
      </div>
    </div>}

    <header className="topbar">
      <a href="#intro" className="brand" aria-label="Flower City AI home"><Logo/><span>Flower City AI</span></a>
      <nav className="chapters" aria-label="Chapters">
        <ol>{CHAPTERS.map(c => <li key={c.letter}><a href={`#${c.id}`} className={active === c.letter ? 'is-active' : ''} aria-current={active === c.letter ? 'location' : undefined}><span aria-hidden="true">{c.letter}</span><span className="sr-only">{c.name}</span></a>{active === c.letter && <em className="caps" aria-hidden="true">{c.name}</em>}</li>)}</ol>
        <a className="caps top-link" href="#about">About</a><a className="caps top-link" href={CONTACT_URL} target="_blank" rel="noopener noreferrer">Contact<span className="sr-only"> (opens in a new tab)</span></a>
      </nav>
      <button className="menu-btn caps" type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>Menu <span className="mark-sm" aria-hidden="true">{active}</span><span className="sr-only">, current chapter {activeName}</span></button>
    </header>
    {menuOpen && <nav id="mobile-menu" className="mobile-menu" aria-label="Chapters">
      <p className="title-big accent">Chapters</p>
      <ol>{CHAPTERS.map(c => <li key={c.letter}><a href={`#${c.id}`} onClick={() => setMenuOpen(false)}><span className="mark-sm">{c.letter}</span>{c.name}</a></li>)}</ol>
      <ContactLink className="mint"/>
    </nav>}

    <main id="main">
      <section className="hero" id="intro" data-chapter="A" ref={heroRef} aria-labelledby="hero-title">
        {TAGS.map(([tag, cls]) => <span key={tag} className={`tag ${cls}`} aria-hidden="true">{tag}</span>)}
        <h1 id="hero-title" className="hero-title"><span className="row"><span>The</span><span>new</span><span>age</span></span><span className="row"><span>of</span><span>work</span></span></h1>
        <div className="hero-foot">
          <p className="text-medium">AI takes the busywork. Your people take back their time.</p>
          <div className="hero-actions"><ContactLink className="mint"/><a className="btn ghost" href="#why"><Dots/>Find out why</a></div>
          <p className="hint caps" aria-hidden="true"><span className="fine-pointer">Move over the shape · hold to stir it</span><span className="coarse-pointer">Press and swipe the shape</span></p>
        </div>
      </section>

      <section className="chapter" id="why" data-chapter="B" aria-labelledby="why-title">
        <Mark letter="B"/>
        <h2 id="why-title" className="title-big accent" data-reveal><Words text="Where does the week go?"/></h2>
        <p className="text-medium" data-reveal>Small tasks compound. A missed follow-up becomes a lost order; a late handover, a rough shift. We take the repeat work off your team’s plate, one routine at a time.</p>
        <a className="btn ghost" href="#team" data-reveal><Dots/>Where do we start?</a>
      </section>

      <section className="chapter" id="team" data-chapter="C" aria-labelledby="team-title">
        <Mark letter="C"/>
        <h2 id="team-title" className="title-big accent" data-reveal><Words text="Where is your team with AI, honestly?"/></h2>
        <div className="chips" role="group" aria-label="Where your team is with AI" data-reveal>
          {Object.entries(MOODS).map(([key, item]) => <button key={key} type="button" aria-pressed={mood === key} onClick={() => setMood(key)}>{item.label}</button>)}
        </div>
        <div className="panel reply" aria-live="polite" key={mood}>
          <p className="text-medium">{current.say}</p>
          <p className="caps reply-step">Where we’d start · <a href="#services">{current.step}</a></p>
        </div>
      </section>

      <section className="chapter wide" id="demo" data-chapter="D" aria-labelledby="demo-title">
        <Mark letter="D"/>
        <h2 id="demo-title" className="title-big accent" data-reveal><Words text="Watch one task settle"/></h2>
        <p className="text-medium" data-reveal>Choose your industry. AI drafts. Your team decides. Nothing is sent without approval.</p>
        <WeekDemo/>
      </section>

      <section className="chapter wide" id="services" data-chapter="E" aria-labelledby="services-title">
        <Mark letter="E"/>
        <h2 id="services-title" className="title-big accent" data-reveal><Words text="Four calm ways to start"/></h2>
        <div className="cards">{SERVICES.map((service, i) => <article className="panel card" key={service.name} data-reveal style={{ '--d': `${i * 90}ms` }}>
          <span className="tag static">{service.tag}</span>
          <h3 className="title-small">{service.name}</h3>
          <p>{service.detail}</p>
          {service.link && <a className="link-caps" href={service.link}>{service.linkText} →</a>}
        </article>)}</div>
        <p className="fine">Audits start at CAD $500 + applicable tax during our pilot. Training, update and workflow projects are quoted to scope. Software subscriptions and ongoing support are extra when needed.</p>
      </section>

      <section className="chapter" id="funding" data-chapter="F" aria-labelledby="funding-title">
        <Mark letter="F"/>
        <h2 id="funding-title" className="title-big accent" data-reveal><Words text="Could a grant help pay?"/></h2>
        <p className="text-medium" data-reveal>Possibly. Some Ontario programs support eligible planning, training or technology projects. We help you find a route worth checking and prepare a sensible scope.</p>
        <ul className="checks" data-reveal>
          <li><span className="caps accent">Check the fit</span>Program rules depend on your size, activity, project and current intake.</li>
          <li><span className="caps accent">Check our role</span>A commercial Flower City AI service is not automatically grant eligible.</li>
          <li><span className="caps accent">Get approval</span>We only treat funding as available after the program confirms eligibility and timing.</li>
        </ul>
        <a className="btn ghost" href="/funding.html"><Dots/>See funding routes &amp; sources</a>
        <p className="fine">Programs we watch include OCI planning and retail support, and the Ontario Job Grant. Rules change, and funding is never guaranteed.</p>
      </section>

      <section className="chapter" id="about" data-chapter="G" aria-labelledby="about-title">
        <Mark letter="G"/>
        <h2 id="about-title" className="title-big accent" data-reveal><Words text="Local help, here for your team"/></h2>
        <p className="text-medium" data-reveal>{FOUNDER_NAME ? `I’m ${FOUNDER_NAME}, the founder of Flower City AI. ` : 'Flower City AI is an independent consultancy based in Brampton. '}We help teams make sense of AI through patient teaching and small, useful improvements. You own your plan, and we’re always straight about what the tools can and can’t do.</p>
        <div className="faq">
          <p className="caps dim faq-label">Questions</p>
          {FAQS.map(([question, answer]) => <details key={question}><summary><span>{question}</span><span className="plus" aria-hidden="true"/></summary><p>{answer}</p></details>)}
        </div>
      </section>

      <section className="chapter contact" id="contact" data-chapter="H" aria-labelledby="contact-title">
        <Mark letter="H"/>
        <h2 id="contact-title" className="title-big accent" data-reveal><Words text="What’s eating your team’s week?"/></h2>
        <p className="text-medium" data-reveal>Tell us about one task. We’ll suggest a useful first step and check any funding route that might fit.</p>
        <ContactLink className="mint"/>
        <p className="fine">{HAS_BOOKING ? 'Pick a time on our booking page.' : 'Opens our Google enquiry form. We’ll follow up to arrange a time.'} Sending an enquiry doesn’t book an appointment.</p>
        {CONTACT_EMAIL && <a className="link-caps" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>}
        <footer className="site-footer caps"><span>© {new Date().getFullYear()} Flower City AI · Brampton, Ontario</span><span><a href="/privacy.html">Privacy</a> · <a href="/funding.html">Funding</a></span></footer>
      </section>
    </main>

    <div className="bottombar caps" aria-hidden="true">
      <span className="dim">GTA-born · Canada-wide</span>
      <span className="meter">Load · <b ref={loadRef}>0%</b><span className="track" ref={knobRef}><i/></span></span>
    </div>
  </>;
}
