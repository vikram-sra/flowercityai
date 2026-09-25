# Flower City AI

Multi-service website and local launch workspace for an independent Brampton consultancy.

## Run locally

Use Node.js 22.12+ (or 20.19+).

```sh
npm ci
npm run dev
```

Public preview: http://127.0.0.1:5199/

Local planning tools: http://127.0.0.1:5199/launch/index.html

The launch pages are local planning material, not an authenticated customer system. Their checklist progress is saved in this browser only. Keep customer records in a suitable private system.

## Public contact details

Copy `.env.example` to `.env.local`, enter verified values, and restart/rebuild:

- `VITE_CONTACT_EMAIL`: public business email (optional).
- `VITE_FOUNDER_NAME`: public founder name (optional).
- `VITE_BOOKING_URL`: HTTPS calendar URL (optional).

Without a booking URL, enquiry buttons open the existing Google Form. There is no hidden cross-origin submission, local collection of personal details or simulated success state. The form's own confirmation governs submission. The existing hosted form has been opened successfully; inbox delivery has not been tested. Its owner should verify notifications, make unnecessary fields optional, and update its title if needed.

VITE values are public build-time configuration. Never store secrets in them. If changing the form or adding a booking service, update the privacy notice to match.

## Build and deploy

```sh
npm run build
npm run preview
```

Production preview: http://127.0.0.1:5200/

Deploy **only `dist/`**, never the project root. `launch/`, `docs/`, business planning files and environment configuration must not be published. No deployment is configured or performed by this project change.

The production build includes the homepage, sample audit, funding information, privacy notice, sitemap and crawler summaries. The current canonical domain is `https://flowercityai.ca`; confirm it matches the actual production domain before deployment.

`node_modules/` and `dist/` are generated and excluded from Git. Both were historically tracked; this change removes them from the Git index while preserving the local installation and build output.

## Content and upkeep

- `src/App.jsx`: public offer, examples and journey.
- `src/config.js`: public contact configuration and verified hosted form fallback.
- `public/sample-audit.html`: explicitly fictional worked example.
- `public/funding.html`: conditional funding approach with dated official sources.
- `launch/`: updated offers, funding register, fit-call checklist, replies and launch checklist.
- `businessplan.md`: capacity-based commercial plan.
- `docs/first-audit-delivery-kit.md`: reusable delivery material.
- `docs/launch-review-2026-09-24.md`: historical pre-implementation review.

Recheck grants before every funded engagement. Do not interpret programme descriptions as customer/provider approval. Confirm course eligibility and OCI role separation in writing. The audit pilot starts at $500; agree the scope and final price before work, and update the website if the offer changes.

## Verification

The release check in `scripts/check-release.mjs` verifies required production pages, local asset links, sitemap structure, and exclusion of planning material. Run it after building with `npm run check`.

Manual browser checks cover industry switches, service steps, FAQ, mobile menu dismissal/focus, responsive layout, contact destination, sample audit and local checklist persistence. External enquiry delivery, private business details, legal/accounting setup and funding approvals require the respective owning accounts or advisers.
