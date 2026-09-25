import { useEffect, useRef, useState } from 'react';
import { CONTACT_URL, CONTACT_EMAIL, FOUNDER_NAME, HAS_BOOKING } from './config';

const EXAMPLES = {
  trades: { label: 'Construction & trades', icon: '⌂', task: 'Another evening of quote follow-ups.', action: 'One good template. A draft ready to check.', detail: 'You approve the measurements, price and message.', sample: 'Hi Sam, just checking whether you have any questions about your driveway quote. Let me know a good time to discuss the next step.', lesson: 'Practise drafting a follow-up from your own approved quote.', automation: 'Prepare a draft when a quote needs a follow-up. You review it before sending.' },
  retail: { label: 'Shops & restaurants', icon: '▤', task: 'The same customer questions. All day.', action: 'An answer sheet your whole team can use.', detail: 'Your team checks availability, allergies and exceptions.', sample: 'Hi Alex, thanks for asking about a table for six. What date and time did you have in mind? Our team will check availability for you.', lesson: 'Practise answering common questions using your approved information.', automation: 'Sort incoming enquiries and prepare a reply for your team to check.' },
  services: { label: 'Local services', icon: '↗', task: 'Meeting notes waiting to become emails.', action: 'A clear recap. A short list of next steps.', detail: 'You check the facts and confidentiality before sharing.', sample: 'Hi Jordan, here’s our recap: confirm the scope, choose a start date, and send over the approved documents. Please let me know if I missed anything.', lesson: 'Turn a fictional set of notes into a clear recap, then check it.', automation: 'Prepare a recap and task list from approved notes. You choose what to share.' },
};
const STEPS = [
  { name: 'Understand', heading: 'See what is worth changing.', text: 'We look at the work that eats your time and choose a useful first improvement.', output: 'A prioritized plan + one worked example.' },
  { name: 'Train', heading: 'Help your team use it well.', text: 'Hands-on practice with your everyday tasks, including how to spot mistakes.', output: 'Useful templates + a simple safe-use guide.' },
  { name: 'Build', heading: 'Make one routine easier.', text: 'We can set up a small workflow with a clear review step when the task is ready.', output: 'One tested workflow + a handover.' },
];
const SERVICES = [
  { number: '01', name: 'AI Opportunity Audit', summary: 'Know where to start.', detail: 'Review repeated tasks, see one worked example, and leave with a ranked plan you own.', tag: 'Clarity', link: '/sample-audit.html', linkText: 'See a sample' },
  { number: '02', name: 'Team AI training', summary: 'Get your people comfortable.', detail: 'Practise real tasks together, build useful templates, and learn how to check the output.', tag: 'Confidence' },
  { number: '03', name: 'Customer replies', summary: 'Keep enquiries moving.', detail: 'Create approved answer guides and draft follow-ups for your team to review before sending.', tag: 'Better follow-up' },
  { number: '04', name: 'Paperwork & workflows', summary: 'Give routine admin a hand.', detail: 'Start with one repeatable task, such as preparing a recap or routing an enquiry, with a human check.', tag: 'Time back' },
];
const FAQS = [
  ['Do I need to know anything about AI?', 'No. Bring a task that takes too much time. We’ll work through it in plain English, using your existing tools where possible.'],
  ['What if AI isn’t the right answer?', 'We’ll say so. We may recommend a better template, an existing software feature, or leaving a process alone. You own any plan we make together and don’t have to buy anything else.'],
  ['Will I have to replace my team or software?', 'Our starting point is helping your existing team. We assess the tools you already use and keep people in control of important decisions. Any new subscriptions are agreed separately.'],
  ['Can a grant pay for this?', 'Some projects may qualify, depending on the business, provider, costs and current intake. Our commercial audit is not automatically an approved grant deliverable. We check options before any work intended for funding begins.'],
];

function Flower({ className = '' }) {
  return <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1.8"><path d="M20 20C7 16 7 2 16 5c3 1 4 7 4 15Z"/><path d="M20 20C24 7 38 7 35 16c-1 3-7 4-15 4Z"/><path d="M20 20c13 4 13 18 4 15-3-1-4-7-4-15Z"/><path d="M20 20C16 33 2 33 5 24c1-3 7-4 15-4Z"/><circle cx="20" cy="20" r="4"/></g></svg>;
}
function Spark({ className = '' }) {
  return <svg className={className} viewBox="0 0 44 44" fill="none" aria-hidden="true"><path d="M22 2c2.3 12 7.7 17.4 20 20-12.3 2.6-17.7 8-20 20C19.7 30 14.3 24.6 2 22 14.3 19.4 19.7 14 22 2Z" stroke="currentColor" strokeWidth="1.5"/><circle cx="22" cy="22" r="3" fill="currentColor"/></svg>;
}
function FlowSignal() {
  return <div className="flow-signal" aria-hidden="true"><div className="flow-point"><span className="flow-icon flow-input"><span/><span/><span/></span><span>Your task</span></div><span className="flow-track"/><div className="flow-point"><span className="flow-icon flow-ai"><Spark /></span><span>AI draft</span></div><span className="flow-track second"/><div className="flow-point"><span className="flow-icon flow-review">✓</span><span>You approve</span></div></div>;
}
function HeroBloom() {
  return <svg className="hero-bloom" viewBox="0 0 240 210" fill="none" aria-hidden="true"><circle className="bloom-ring" cx="120" cy="105" r="56" stroke="currentColor" strokeWidth="1" strokeDasharray="3 8"/><path className="bloom-links" d="M72 76 35 56M171 78l36-20M72 137l-39 22m139-18 38 18" stroke="currentColor" strokeWidth="1.3"/><g className="bloom-satellites" fill="currentColor"><circle cx="35" cy="56" r="5"/><circle cx="207" cy="58" r="5"/><circle cx="33" cy="159" r="5"/><circle cx="210" cy="159" r="5"/></g><g className="bloom-core" stroke="currentColor" strokeWidth="1.6"><path d="M120 105C84 94 84 51 111 60c9 3 12 21 9 45Z"/><path d="M120 105c11-36 54-36 45-9-3 9-21 12-45 9Z"/><path d="M120 105c36 11 36 54 9 45-9-3-12-21-9-45Z"/><path d="M120 105c-11 36-54 36-45 9 3-9 21-12 45-9Z"/><circle cx="120" cy="105" r="7" fill="#f7f8f2"/></g><path className="bloom-mini" d="m20 103 4 4-4 4-4-4 4-4Zm200-1 4 4-4 4-4-4 4-4Z" fill="currentColor"/></svg>;
}
function ServiceVisual({ number }) {
  const paths = {
    '01': <><circle cx="42" cy="42" r="23"/><path d="m59 59 20 20M32 42h20M42 32v20"/><circle className="glyph-accent" cx="42" cy="42" r="4" fill="currentColor" stroke="none"/></>,
    '02': <><circle cx="30" cy="38" r="10"/><circle cx="75" cy="26" r="10"/><circle cx="76" cy="69" r="10"/><path d="M39 35 65 28M38 44 66 64M75 36v23"/><circle className="glyph-accent" cx="75" cy="26" r="3" fill="currentColor" stroke="none"/></>,
    '03': <><path d="M19 22h56a9 9 0 0 1 9 9v24a9 9 0 0 1-9 9H45L28 77V64h-9a9 9 0 0 1-9-9V31a9 9 0 0 1 9-9Z"/><path d="M27 39h39M27 50h25"/><circle className="glyph-accent" cx="84" cy="22" r="6" fill="currentColor" stroke="none"/></>,
    '04': <><rect x="12" y="28" width="24" height="24" rx="5"/><rect x="67" y="15" width="24" height="24" rx="5"/><rect x="67" y="61" width="24" height="24" rx="5"/><path d="M36 40h15c7 0 9-13 16-13M36 40h15c7 0 9 33 16 33"/><circle className="glyph-accent" cx="24" cy="40" r="4" fill="currentColor" stroke="none"/></>,
  };
  return <div className={`service-visual visual-${number}`} aria-hidden="true"><svg viewBox="0 0 104 96" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{paths[number]}</svg><span className="visual-spark">✳</span></div>;
}
function Arrow() { return <span aria-hidden="true">↗</span>; }
function ContactLink({ className = '', children = 'Request a free fit call' }) {
  return <a className={`button ${className}`} href={CONTACT_URL} target="_blank" rel="noopener noreferrer">{children}<Arrow /><span className="sr-only"> (opens {HAS_BOOKING ? 'booking page' : 'Google Forms'} in a new tab)</span></a>;
}

export default function App() {
  const [industry, setIndustry] = useState('trades');
  const [stage, setStage] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef(null);
  const navRef = useRef(null);
  const example = EXAMPLES[industry];
  const step = STEPS[stage];

  useEffect(() => {
    if (!menuOpen) return;
    const dismiss = (event) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); }
    };
    const outside = (event) => { if (!navRef.current?.contains(event.target)) setMenuOpen(false); };
    const desktop = window.matchMedia('(min-width: 901px)');
    const resize = () => { if (desktop.matches) setMenuOpen(false); };
    document.addEventListener('keydown', dismiss);
    document.addEventListener('pointerdown', outside);
    desktop.addEventListener('change', resize);
    return () => { document.removeEventListener('keydown', dismiss); document.removeEventListener('pointerdown', outside); desktop.removeEventListener('change', resize); };
  }, [menuOpen]);

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header" ref={navRef}>
      <div className="nav-shell wrap">
        <a href="#" className="brand" aria-label="Flower City AI home"><Flower /><span>Flower City <b>AI</b></span></a>
        <button className="menu-toggle" ref={menuButton} type="button" aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close' : 'Menu'}<span aria-hidden="true">{menuOpen ? '×' : '+'}</span></button>
        <nav id="main-navigation" aria-label="Main navigation" className={menuOpen ? 'navigation is-open' : 'navigation'}>
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#funding" onClick={() => setMenuOpen(false)}>Funding</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <ContactLink className="small">Let’s talk</ContactLink>
        </nav>
      </div>
    </header>
    <main id="main">
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-copy">
          <HeroBloom />
          <p className="eyebrow"><span className="status-dot"/>Practical AI for local businesses</p>
          <h1 id="hero-title">Less busywork.<br/>More <em>breathing room.</em></h1>
          <p className="hero-description">Practical audits, team training, customer follow-ups and simple automation. We help you choose a first step and check possible funding.</p>
          <div className="hero-actions"><a className="button primary" href="#services">Explore services<Arrow /></a><a className="text-link" href="#example">See an example <span aria-hidden="true">↓</span></a></div>
          <p className="hero-note">Brampton &amp; Peel <span>·</span> No tech background needed</p>
        </div>
        <div className="example-panel" id="example">
          <div className="panel-top"><span className="panel-kicker">What this could look like</span><Flower /></div>
          <FlowSignal />
          <div className="industry-picker" role="group" aria-label="Choose your business example">
            {Object.entries(EXAMPLES).map(([key, item]) => <button key={key} type="button" aria-pressed={industry === key} onClick={() => setIndustry(key)}>{item.label}</button>)}
          </div>
          <div className="example-content" key={industry} aria-live="polite" aria-atomic="true">
            <span className="micro-label">Sound familiar?</span><h2>{example.task}</h2>
            <div className="example-connector" aria-hidden="true"><span/>↓</div>
            <div className="first-step"><span className="micro-label">An improvement to explore</span><h3>{example.action}</h3><p><span aria-hidden="true">✓</span> {example.detail}</p></div>
          </div>
          <div className="panel-bottom"><span className="small-flower" aria-hidden="true">✳</span> Illustrative example. We tailor the work to your business.</div>
        </div>
      </section>
      <div className="principle-strip"><div className="wrap"><span>Start small.</span><span>Bring your team.</span><span>Stay in control.</span><span>Build on what works.</span></div></div>
      <section id="services" className="section wrap services-section" aria-labelledby="services-title">
        <div className="services-heading"><div><p className="eyebrow">How we can help</p><h2 id="services-title">Choose the help<br/><em>you need now.</em></h2></div><p>Start with a plan, help your team learn, or fix one routine. Every engagement has a clear scope and a human review point.</p></div>
        <div className="service-grid">{SERVICES.map(service => <article className="service-card" key={service.number}><div className="service-card-top"><span>{service.number}</span><span className="service-tag">{service.tag}</span></div><ServiceVisual number={service.number}/><h3>{service.name}</h3><p className="service-summary">{service.summary}</p><p className="service-detail">{service.detail}</p>{service.link && <a className="text-link" href={service.link}>{service.linkText} <Arrow /></a>}</article>)}</div>
        <div className="service-footer"><p>Audits start at CAD $500 + applicable tax during the pilot. Training, reply and workflow projects are quoted to scope.</p><ContactLink className="primary">Talk through your task</ContactLink></div>
      </section>
      <section className="process-section" id="how" aria-labelledby="process-title"><div className="wrap">
        <div className="process-heading"><div><p className="eyebrow">How it works</p><h2 id="process-title">Start where you are.</h2></div><p>These are ways to work together, not a required sequence. We agree the smallest useful scope first.</p></div>
        <div className="step-picker" role="group" aria-label="Explore our three steps">{STEPS.map((item,index)=><button key={item.name} type="button" aria-pressed={stage === index} onClick={()=>setStage(index)}><span>0{index+1}</span>{item.name}<span aria-hidden="true">↗</span></button>)}</div>
        <div className="step-content" key={`${stage}-${industry}`} aria-live="polite" aria-atomic="true"><div><h3>{step.heading}</h3><p>{step.text}</p><p className="step-output">{step.output}</p></div><div className="step-example"><span className="micro-label">{example.label} · example</span><p>{stage === 0 ? example.action : stage === 1 ? example.lesson : example.automation}</p><span className="step-price">{stage === 0 ? 'Opportunity audit' : stage === 1 ? 'Team training' : 'One workflow'} <small>We confirm scope and price before work begins.</small></span></div></div>
        <p className="process-note">Training and automation are separately scoped. Software subscriptions and ongoing support are additional when needed.</p>
      </div></section>
      <section className="section wrap funding-section" id="funding" aria-labelledby="funding-title"><div className="funding-header"><div><p className="eyebrow">Funding, explained clearly</p><h2 id="funding-title">Could a program<br/><em>help pay?</em></h2></div><p>Possibly. Some Ontario programs support eligible planning, training or technology projects. We can help you identify a route to check and prepare a sensible scope.</p></div><div className="funding-grid"><div className="funding-card"><span>01 / Check the fit</span><h3>Your business &amp; project</h3><p>Program rules depend on your size, activity, project and current intake.</p></div><div className="funding-card"><span>02 / Check our role</span><h3>Provider &amp; costs</h3><p>A commercial Flower City AI service is not automatically grant eligible.</p></div><div className="funding-card"><span>03 / Get approval</span><h3>Before funded work</h3><p>We only treat funding as available after the program confirms eligibility and timing.</p></div></div><div className="funding-bottom"><p>Programs we monitor include OCI planning support and the Ontario Job Grant. Availability and rules can change; funding is never guaranteed.</p><a className="button" href="/funding.html">See funding routes &amp; sources<Arrow /></a></div></section>
      <section id="about" className="section wrap about-section" aria-labelledby="about-title"><div className="about-mark" aria-hidden="true"><Flower /><span>Rooted in<br/>Flower City.</span></div><div><p className="eyebrow">Local help. Human approach.</p><h2 id="about-title">Small businesses<br/>belong in this future.</h2><p>{FOUNDER_NAME ? `I’m ${FOUNDER_NAME}, the founder of Flower City AI. ` : 'Flower City AI is an independent consultancy based in Brampton. '}We help local owners and employees make sense of AI through practical advice, patient teaching and small, useful improvements.</p><p>You own your plan. Your team keeps control. We explain what the tools can—and can’t—do.</p></div></section>
      <section className="wrap questions-section" aria-labelledby="questions-title"><div><p className="eyebrow">Good questions</p><h2 id="questions-title">Let’s make it simple.</h2></div><div className="questions">{FAQS.map(([question,answer])=><details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>
      <section className="contact-section" id="contact" aria-labelledby="contact-title"><div className="wrap contact-inner"><Flower /><p className="eyebrow">Your first step can be small.</p><h2 id="contact-title">What’s eating<br/>your week?</h2><p>Tell us about one task. We’ll suggest a useful service and check any relevant funding route.</p><ContactLink className="cream"/><p className="contact-note">{HAS_BOOKING ? 'Choose a time on our booking page.' : 'Opens our Google enquiry form. We’ll follow up to arrange a time.'}<br/>Submitting an enquiry does not book an appointment.</p>{CONTACT_EMAIL && <a className="email-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>}</div></section>
    </main>
    <footer className="site-footer wrap"><a className="brand" href="#"><Flower /><span>Flower City <b>AI</b></span></a><p>Brampton, Ontario · © {new Date().getFullYear()}</p><div><a href="/privacy.html">Privacy</a><a href="/funding.html">Funding</a></div></footer>
  </>;
}
