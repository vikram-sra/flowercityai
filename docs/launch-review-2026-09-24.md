# Flower City AI — business and website launch review

Prepared 24 September 2026. Historical review of the pre-implementation project. The multi-service website and local workspace have since been implemented; see README.md for current behavior and remaining account/business setup steps. Findings below describe the original version. Current program observations are distinguished from assumptions.

Your decisions: serve several types of local small businesses; start with a paid audit, then employee education, then basic automation. The company is already registered. Weekly capacity, legal entity type, delivery experience, and current customer pipeline are not yet confirmed.

## The decision

Launch a small, paid **AI Opportunity Audit** that answers three questions: where is work being repeated, what is worth improving, and what should the owner do first? Sell training and a single automation as separate follow-on decisions. Help customers find applicable funding, but make the offer worth buying at its full price.

Your mission is useful: make practical AI accessible to businesses without a technology department. Express it through patient teaching, affordable scope, client-owned accounts, clear handover, and honest recommendations—including recommending no new software when appropriate.

The website currently presents a more mature business than this: nationwide coverage, autonomous customer service, instant construction estimates, measured-looking outcomes, and extensive grant stacking. That gap is the main launch problem. More animation alone will not solve it.

## What I reviewed and verified

- Read the React application, styles, grant calculator, graphics, metadata, crawler files, business plan, `CashFlow&USP`, and all ten HTML files in `launch/`, including the five operational guides and five design variants.
- Inspected the running website in a browser at a 406 × 752 viewport and at a desktop viewport (approximately 1309 px CSS width). Exercised navigation and mobile menu behavior. No real lead was submitted.
- Ran `npm run build`: passed. Build output was about 179 KB JavaScript (58 KB gzip), 37 KB CSS (8.6 KB gzip), and 3.85 MB of PNG assets. Asset totals are build sizes, not measured initial network transfer.
- Checked current official funding pages, current linked eligibility requirements, local business support, and a small sample of competitors' own sites.
- This is a local-project review. Production hosting, actual inbox delivery, analytics, real customer outcomes, and account ownership have not been independently verified. No Lighthouse score or conversion rate was measured.

## What is already working

The Flower City name gives you a credible local identity. The rose mark, restrained dark base, and direct references to quotes, messages, and paperwork are worth retaining. The existing page adapts to mobile, has visible keyboard focus styling, and includes reduced-motion CSS. The industry selector is a useful way to serve several audiences without writing four complete pages. Your internal product ladder already recognizes the need to start with advisory work and education.

Keep those strengths. Reduce the number of things the visitor must interpret.

## The website: changes in priority order

| Priority | Evidence in the project | Why it matters | Recommended change |
|---|---|---|---|
| Before launch | `src/App.jsx`, Contact handler, lines 658–677: both success and failure set `done`; `no-cors` prevents reading Google's response | A failed lead can see “Got it” and disappear | Use a submission endpoint with a verifiable success response, error/retry state, and owner notification. Test receipt in the actual inbox/storage. Provide a real contact fallback. |
| Before launch | Hero and funding sections promise grants cover most costs; Graphics shows a 15–25% customer share | Customers may budget on unavailable or inapplicable funding | Replace with one conditional funding sentence; remove universal subsidy percentages and the stacking graphic. |
| Before launch | Calculator assumes eligibility, combines planning/build caps, and invents participant counts | A confident number looks personalized even though essential eligibility facts are absent | Remove from public launch page. Keep a dated internal screening checklist with human verification. |
| Before launch | Calculator lines 72–76 cap training cost but display the original project total | The displayed breakdown does not reconcile | Example: $10,000 budget, “1–5” employees → $6,225 funding + $1,275 customer share = $7,500. The other $2,500 disappears. Even after fixing arithmetic, the estimator is not an eligibility engine. |
| Before launch | App hard-codes 80% busywork, 4-second replies, 15+ hours/week, and skill scores | These are presented as outcomes, without supporting measurements in the repository | Remove them or clearly label illustrative examples. Never call invented workshop scores measured results. |
| Before launch | DemoStage animates predefined messages and calls them a live demo / real workflows | The animation does not establish a working integration | Label “Illustrative example,” or demonstrate a real test workflow with dummy data and an explicit human approval step. |
| Before launch | `index.html` and `public/llms*.txt` repeat “#1,” “top-rated,” 100% adoption, grant claims and inconsistent eligibility | Hidden metadata can contradict a corrected homepage | Rewrite visible copy, structured data, social previews and crawler summaries together. Use factual location/service descriptions. |
| Next | Mobile page measured roughly 10,406 px high, with about 1,225 rendered words at the inspected state | A busy owner must scan about fourteen viewport heights | Aim for roughly 450–650 words, five core sections, one primary action, and optional FAQ details. This is a design target, not a conversion guarantee. |
| Next | Six-field form, five required fields, “Book” copy but no appointment selection | High effort before value is clear; submitting an inquiry is not booking a call | Use name, one contact method, and optional pain-point selection. Call it “Request a free fit call” unless it actually reserves a time. |
| Next | AI photos, no founder introduction, no sample audit, no verified case study | The business lacks evidence that a real person can deliver | Add a real founder photo/bio, sample deliverable, defined scope and turnaround. Add customer evidence only after delivery and consent. |
| Next | Multiple gradients, HUD labels, ticker, parallax, meters, pulsing logo and repeated glass cards | Motion competes with the explanation | Give one example the visual emphasis. Use short state transitions and replay controls; remove decorative clocks and metrics. |
| Next | Faint copy uses `#5F6A7D`; many labels are 9.5–12 px; form labels disappear when typed | Difficult to read outdoors/on a phone | Increase essential text to 16–18 px, improve contrast, use persistent labels, and check contrast against actual composited backgrounds. |
| Next | Escape did not close the mobile menu in browser testing | Keyboard interaction is incomplete | Add Escape behavior, predictable focus handling and return, and an associated menu region. |
| Later | Logo PNG is ~311 KB; four illustrative PNGs total ~3.54 MB | Large illustrative files provide limited proof | Use a small logo asset and compressed responsive images. Prefer actual sample output over decorative AI artwork. |
| Later | Sitemap uses `www.sitemapindex.org` rather than `www.sitemaps.org` namespace; schema coordinates point to Toronto while locality says Brampton | Search metadata is inconsistent | Correct the namespace; use accurate business information and omit unverified coordinates. Align FAQ schema with visible answers. |

The 3D farm components are not imported by the active App. Do not blame Three.js for the current production payload: the build excludes that unused scene. Remove unused experiments/dependencies later for maintainability, not as the first performance fix.

### A much simpler customer journey

**Hero → interactive example → audit deliverable and price → audit / learn / automate → founder, short FAQ, contact.** Funding gets one short note and an optional details page.

Suggested hero:

> **Find where AI can save your business time.**
>
> A practical audit, hands-on team training, and simple automations for local small businesses. Start with a clear plan.
>
> **See a sample audit** · **Request a free 15-minute fit call**

Supporting line: “Brampton & Peel · Plain English · Start small.”

Keep one industry picker with three or four choices. The same component should change the example, not the whole service menu:

| Business | Familiar task | Audit recommendation example | Human control |
|---|---|---|---|
| Construction/trades | Repeatedly typing quote follow-ups | Identify missing job details and draft a follow-up | Owner checks measurements, price and message before sending |
| Shops/restaurants | Repeated opening-hour/menu questions | Build an approved answer sheet and train staff to draft replies | Staff verify availability, allergies and exceptions |
| Local professional services | Turning meeting notes into next steps | Draft a recap and task list from approved notes | Staff check facts and confidentiality |
| Logistics, later | Moving delivery information into billing | Examine one document-to-draft-invoice workflow | Staff validate amounts and documents |

Use a short transition from the original task to the proposed output after a tap. Keep the final output readable; do not automatically erase it every few seconds. Support reduced motion, touch and keyboard use. Do not promise unattended estimating, payment collection or dispatch as entry-level services.

The best direction among the existing concepts is the simplicity of `clean-concept.html` with a little of the current visual identity. The garden metaphor can appear in branding; calling the audit a “Soil Test” makes the customer decode the product. The calculator-led hero centers funding you cannot control. None of the existing variants is launch-ready without correcting the offer and claims.

## The first product to sell

**AI Opportunity Audit — suggested pilot price CAD $500; standard test price CAD $750, plus applicable tax.** These are pricing hypotheses for a tightly scoped service, not market-validated rates. Offer the pilot rate to the first three suitable clients and track the actual time.

Deliver within five business days after receiving the agreed inputs:

1. A 60-minute owner/employee interview and a walkthrough of up to three recurring tasks.
2. A one-page scorecard ranking up to three opportunities by value, effort and risk.
3. One worked example using dummy or approved redacted information.
4. A simple value estimate with stated assumptions, software costs and required human review.
5. A 30-day action plan: do now, consider next, leave alone.
6. A 30-minute readout and one clarification round.

The customer owns the plan and can implement it themselves or hire someone else. The audit must be useful without buying your next service. Promise an honest assessment and concrete next steps; do not promise to find three good automations if the evidence supports only one or none.

Exclude deployment, production credentials, formal security/compliance certification, grant applications, approved-DMAP status, and guaranteed savings. A brief funding screen can identify possible next enquiries without turning a $500 audit into days of grant administration.

Recommended next offers:

| Offer | Suggested starting scope | Price hypothesis | Completion evidence |
|---|---|---|---|
| Employee AI practice session | 90–120 minutes, up to five people, three role-specific tasks, safe-use handout and one follow-up | $750–$1,250 | Each attendee can complete and check one real task |
| One workflow pilot | One trigger, one workflow, up to two existing systems, review gate, error alert, handover and 14-day defect support | $1,500–$2,500 after scope review | Agreed normal, error and duplicate cases work; client can pause it |
| Optional maintenance | Monitoring, defined response window and a small fixed change allowance | $150–$300/month for genuinely simple systems | Monitoring log and agreed service delivered |

Client-owned software subscriptions are additional and visible before purchase. Do not automatically attach a retainer to a training-only client. Avoid voice agents, complex custom applications, autonomous construction quotes, or regulated decisions until you can demonstrate reliable delivery or have a qualified delivery partner.

Your cross-industry focus is workable if the workflows repeat. A restaurant and a contractor can both need customer-reply training; they do not need the same specialist operational software. Keep the offer consistent and adapt the examples.

## Grants: the important corrections

Your normal position is **paid service provider to an eligible business**. You do not automatically become a government funding distributor. The customer applies under the relevant program, receives approval, contracts for eligible work, pays according to the agreement and submits evidence. Timing and reimbursement terms differ. Charge for useful delivery; client funding is not additional revenue on top of your invoice.

### Current launch-relevant observations

| Program | Verified observation on 24 September 2026 | What it means for Flower City AI |
|---|---|---|
| OCI DMAP | Current DCC page lists up to $15,000 for planning, 1–499 employees, while funds last | A potential planning route; an ordinary audit does not automatically qualify. [OCI DCC](https://www.oc-innovation.ca/programs/digital-competence-centre/) |
| OCI Technology Demonstration | Current page says closed for applications; lists $50,000, completed DMAP and $750,000 annual revenue in one of the last three tax years | Exclude anticipated TDP revenue from the launch forecast. Older expansion announcements quote different caps. [Current program page](https://www.oc-innovation.ca/programs/digital-competence-centre/) |
| OCI Retail Modernization | Current page lists up to $5,000 for qualifying physical consumer-facing businesses, with revenue/history requirements; applicants cannot apply for both RMPG and DMAP | Screen retail clients separately; do not add every program cap together. [OCI DCC](https://www.oc-innovation.ca/programs/digital-competence-centre/) |
| Ontario Job Grant | Relaunched under OJG in May 2026; the internal “paused in 2026” statement is stale. Generally up to $10,000 per trainee; small employers contribute at least one-sixth. The $15,000/100% route has additional unemployed-new-hire conditions | Do not promise your workshop is eligible. Rules require prior approval and exclude business consulting, training at conferences/workshops, and product-vendor training on their own product/service. Owners are ineligible trainees. Obtain a written decision on your course and provider status. [Ministry Q&A](https://eopg.labour.gov.on.ca/en/programs/ontario-job-grant/questions-and-answers/program-overview/) |
| NRC IRAP / AI Assist | Supports innovative SMEs developing/adapting AI in core products and services | A specialist future route, not a general discount on routine automation. [NRC](https://nrc.canada.ca/en/support-technology-innovation/nrc-irap-support-smes-innovating-artificial-intelligence) |
| SR&ED / OITC | SR&ED requires qualifying scientific/technological advancement and systematic work addressing uncertainty; assistance affects eligible expenditure calculations | Proprietary code alone is insufficient. Do not relabel integration work as R&D or add percentage headlines together. [CRA eligibility](https://www.canada.ca/en/revenue-agency/services/scientific-research-experimental-development-tax-incentive-program/sred-eligibility.html), [assistance policy](https://www.canada.ca/en/revenue-agency/services/scientific-research-experimental-development-tax-incentive-program/assistance-contract-payments-policy.html) |

CIT, Scale AI, AI compute and university commercialization schemes are separate specialist routes. Their current intakes and individual fit were not established in this review. They should not sit in a generic calculator for a $500 local audit. Retire the current CDAP sales references: the historical federal record confirms BYBT intake closed; a current award route has not been established here. [Federal parliamentary record](https://publications.gc.ca/collections/collection_2024/sen/Y3-441-185-eng.pdf)

### A constraint that changes your proposed grant funnel

OCI's currently linked DAC eligibility document says the consultant who develops a DMAP **cannot also be the vendor on an OCI-supported technology demonstration project for that same client**. It also requires vendor-neutral advice. Although the linked document is dated August 2023, it remains linked from OCI's current registration page; obtain written clarification before structuring any funded engagement. The existing “we sell the funded audit, then the funded build” plan cannot be assumed valid. [Linked DAC requirements](https://www.oc-innovation.ca/wp-content/uploads/2023/08/DAC-and-DMAP-requirements-updated-August-2023.pdf)

General DAC roster and vendor-database applications are currently marked temporarily closed. OCI describes a client-led route to seek approval instructions for an identified off-roster consultant. That is a question to explore, not approved status. [OCI registration page](https://www.oc-innovation.ca/programs/digital-competence-centre/events-dac-vendor-registration/)

The May 2025 DMAP guidelines describe reimbursement, approved consultant requirements, and a maximum 50% contribution. Use those as background; request the latest application agreement and cost rules. A $750 eligible planning project at a 50% rate would mean at most $375 support, not a $15,000 payout. [Published guidelines](https://www.oc-innovation.ca/wp-content/uploads/2023/03/DCC-DMAP-Full-Guidelines-May-2025-Final-Muskan-Kaur.pdf)

Practical operating model: sell your independent commercial audit now. For a possible funded engagement, first establish eligibility and your permissible role. Partner with an independent approved adviser or trainer where appropriate, disclose relationships, and avoid arrangements intended to bypass conflict rules. Do not begin costs you expect to claim until the program's approval/start-date rules are satisfied.

### How you make money without mishandling the funding

Illustration only, excluding tax: a customer buys a $2,000 approved eligible service. If its agreement reimburses 50%, the customer may pay $2,000 first and later receive $1,000. You receive $2,000 once. If delivery labour and direct costs total $1,150, your contribution is $850 before overhead/tax. The customer must be able to fund the initial payment; the reimbursement is neither guaranteed nor your working capital.

Keep separate records of project price, eligible costs, tax, approved assistance, actual payments, discounts and reimbursement. Do not quote only the after-grant price or reimburse the client's required match through an undisclosed rebate. Keep grant administration separately scoped and check whether it is itself an eligible expense.

Public wording: **“Funding may be available for eligible projects. We help you check the options before work begins.”**

## Pricing and a realistic business model

The business plan's $120,000 headline does not match its quarterly total of $76,000–$114,000. Its break-even discussion excludes owner compensation, sales time, insurance, bookkeeping, travel, support and rework. The market counts are unsourced. The 5%-adoption calculation is a scenario, not evidence of a local addressable market. NPS should not be expressed as a simple 8+/9+ satisfaction score; measure recommendation responses properly or call it satisfaction out of ten.

Use a capacity model first. Illustrative economics with owner time valued at $75/hour:

| Work | Fee | Delivery hours | Direct cash costs | Contribution after valuing delivery time |
|---|---:|---:|---:|---:|
| Standard audit | $750 | 6 | $50 | $250 / 33% |
| Training | $1,250 | 8 | $75 | $575 / 46% |
| Small automation | $2,000 | 14 | $100 | $850 / 43% |

These are assumptions, not margins proven by customers. A $500 audit that takes eight hours plus $50 costs loses $150 on this basis. Time-box it, simplify the deliverable, or increase the price. Count sales, admin, travel and support separately before deciding take-home pay.

A modest illustrative month—four $750 audits, two $1,250 training sessions and one $2,000 automation—produces $7,500 revenue and requires 54 delivery hours before sales/support/admin. That is not a launch forecast, and suitability depends on your still-unconfirmed weekly capacity. A sensible first milestone is three paid audits and evidence that one useful follow-on service sells.

Do not use “no local competitors” as your moat. [Techsphere](https://techspheresolutions.ca/) markets practical AI, automation and training from Brampton; [BHive's current BNext AI program](https://thebhive.ca/) helps established Peel businesses adopt AI. This is a small competitor/partner sample, not a comprehensive market study. Your proposed differentiation is a visible, fixed-scope audit, approachable teaching, honest suitability decisions and usable handover. Prove it through delivery.

## The internal pages need a single source of truth

| Existing material | Keep | Correct or retire |
|---|---|---|
| `businessplan.md` | Mission, local relationships, paid services | Registration is complete; confirm entity type instead of assuming sole proprietor. Rebuild financials from capacity; remove unsupported market/moat statements. |
| `launch/product-ladder.html` | Audit → education → automation | Remove “every audit is a DMAP,” automatic grant links and assumptions that training has near-zero delivery risk. Reflect your ability to deliver basic automation. |
| `launch/grant-kit.html` | Explain who pays whom; honest approval language | Remove $115K headline, universal under-50 qualification, stale OJG pause, and same-provider funded audit/build assumptions. |
| `launch/launch-playbook.html` | Checklist format and staged launch | Mark registration complete; move paid pilot delivery ahead of extensive grant-content marketing. |
| `launch/phone-call-checklist.html` | Listen, quantify a task, agree one next step | Start with the customer's workflow; put funding screening after project fit. One or two facts cannot determine grant eligibility. |
| `launch/first-contact-replies.html` | Personal first line and clear next step | Replace grant-led promises; distinguish enquiry response from later marketing follow-up. |
| Design concepts | Reusable visual ideas | Archive as experiments; prevent old offers being mistaken for current ones. |
| `CashFlow&USP` | The idea of bridging business/customer understanding | Remove advice to frame routine work as technical uncertainty. Record genuine work accurately. |

Maintain five practical internal records: offer/scope sheet; dated grant register; simple pipeline; audit delivery template; weekly time/cash review. The grant register needs program, official source, checked date, status, customer eligibility, provider eligibility, cost eligibility, payment timing, conflict rules, contact and unresolved questions.

Do not treat an unlinked page as private. The current Vite build does not include `launch/` HTML, but the development server can serve it, and future deployment configurations could expose it. Keep sensitive records out of public assets and static exports. If a real private dashboard is added later, use authentication. Current checklist browser storage is convenient but is not a durable customer record or backup.

## Your first 30 days

| When | Work | Evidence of completion |
|---|---|---|
| Days 1–3 | Finalize audit scope/price; fill the sample audit; check business banking, invoice identity and email; fix lead capture and public claims | A deliverable and proposal you can show, plus a verified way to receive enquiries |
| Days 4–7 | Ask five existing contacts for relevant introductions; hold three workflow conversations; obtain OCI/OJG clarifications and a BEC consultation | Notes on actual pains, one or two scoped audit proposals, funding questions recorded |
| Week 2 | Sell and deliver one or two paid pilot audits; track every hour | Paid invoices, client-owned action plans, feedback on usefulness |
| Week 3 | Deliver training where the audit supports it; record before/after task completion, not invented skill percentages | Participant demonstration and one approved anonymized example |
| Week 4 | Complete a third audit; deliver at most one tightly scoped automation if ready; review price, effort and acquisition | Decision on which workflow to repeat, one truthful case study if consented, revised capacity/pricing |

Targets are experiments, not promises. If conversations do not convert, ask whether the task is costly, whether the owner trusts you, whether the sample is useful and whether the scope/price is clear. Do not respond by adding more services to the homepage.

Suggested verbal pitch:

> “I help local businesses figure out where AI is actually useful. We start with a small audit of the work that eats your time. You get a clear plan and a worked example. Then, if it makes sense, I train your team or set up one simple automation.”

For a suitable existing enquiry:

> “Thanks for explaining the trouble with [task]. My starting service is a small audit: we review the workflow, identify the useful changes and put them into a clear action plan. The pilot price is $500 plus applicable tax. A free 15-minute fit call will tell us whether that is worth doing.”

Record an appropriate consent basis and use required identification/unsubscribe mechanisms for marketing email/SMS; business contact details are not blanket marketing permission. Exact exemptions depend on context. [CRTC guidance](https://crtc.gc.ca/eng/com500/faq500.htm)

## Business setup: what comes after registration

You do not need to register again. Verify the actual legal entity/name and use it consistently on proposals, invoices and contracts. Keep business banking and bookkeeping organized. Review HST registration with an accountant: the usual $30,000 small-supplier test considers a single quarter and consecutive-quarter rules, with timing depending on how the threshold is exceeded; it is not simply annual profit. [CRA registration guidance](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/when-register-charge.html)

Before taking client work, prepare a short service agreement with scope, deliverables, payment timing, revisions, client responsibilities, confidentiality, use of subcontractors, intellectual property, cancellation, support and liability terms. Get suitable legal advice on that agreement and quotes for professional liability/cyber coverage appropriate to your work. Do not assume registration alone resolves these items.

For the audit, request only necessary information. Prefer screen-sharing or redacted samples. For implementations, use client-owned accounts, least privilege, MFA, separate credentials and a defined offboarding process. Identify what data goes to which vendors, retention, consent/authority and escalation responsibilities. Avoid putting sensitive customer/employee material into AI services without an appropriate arrangement. [Canadian privacy regulators' AI principles](https://www.priv.gc.ca/en/privacy-topics/technology/artificial-intelligence/gd_principles_ai?wbdisable=true)

Add a truthful privacy notice near intake. A marketing opt-in, if needed, should be separate from requesting service. Keep a human approval point for quotes, invoices and external messages until accuracy and exceptions have been validated.

## Local help and the funding questions to ask

Book a [Brampton Entrepreneur Centre consultation](https://www.brampton.ca/EN/Business/BEC/Resources/Pages/Business-Consultation.aspx): its published service is free, with up to two 30-minute consultations per calendar year. Bring the audit offer and ask about basic business setup and relevant local introductions.

The [2026/27 Starter Company Plus page](https://www.brampton.ca/EN/Business/BEC/Pages/Starter-Company-Plus.aspx) lists a September 13 application deadline, which has passed as of this review. It includes full-time commitment and other eligibility conditions. Ask about the next intake or waitlist; do not budget its potential $5,000 as available launch cash.

Use the contacts on the [current OCI registration page](https://www.oc-innovation.ca/programs/digital-competence-centre/events-dac-vendor-registration/) to ask whether a new consultant can qualify through the client-led route, what experience evidence is required, and how independent audit and implementation roles must be separated. Request the current documents and written answers. Ask [Ontario Job Grant](https://eopg.labour.gov.on.ca/en/programs/ontario-job-grant/questions-and-answers/program-overview/) to review your actual provider profile, course outline, delivery format and vendor relationships before advertising funded training.

Do not rebrand a workshop as a course to avoid a rule; establish substantive eligibility. No programme contact, customer outreach, application or external submission has been made in this review.

## Launch gate

You are ready for a small commercial launch when a visitor can tell what the audit includes, what it costs, who delivers it and how to reach you; an enquiry reliably reaches you; the sample deliverable is useful; you have a suitable agreement and invoice process; and you can deliver the promised scope within your available time. A grant approval is an additional route for a particular eligible project, not a prerequisite to selling a useful commercial audit.

The first concrete milestone is **three paid audits delivered well**, with one repeatable follow-on offer supported by what you learned.
