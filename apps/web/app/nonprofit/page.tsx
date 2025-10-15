'use client'

import Link from 'next/link'

const trustBadges = [
  'SOC 2',
  'DPA',
  'SSO/SCIM',
  'ADA/508',
  'HIPAA/FERPA/COPPA',
  'GDPR/CCPA',
]

const tiers = [
  {
    name: 'N1',
    discount: 'Up to 50% off',
    fit: '<50 FTE • community-led nonprofits',
  },
  {
    name: 'N2',
    discount: '35% off',
    fit: '51–250 FTE • regional programs',
  },
  {
    name: 'N3',
    discount: '25% off',
    fit: '251–1,000 FTE • national networks',
  },
  {
    name: 'N4',
    discount: 'Custom (≤30%)',
    fit: '1,000+ FTE • co-funded initiatives',
  },
]

export default function NonprofitPage() {
  return (
    <main className="container mx-auto max-w-5xl space-y-16 py-16">
      <header className="space-y-6 text-center">
        <h1 className="text-4xl font-semibold sm:text-5xl">
          ProofOfFit Impact Access — Verification priced for impact.
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Nonprofits get mission-aligned pricing and built-in safeguarding so you can place people
          faster, safer, and fairly.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {trustBadges.map((badge) => (
            <span key={badge} className="rounded-full border px-3 py-1">
              {badge}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#eligibility"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90"
          >
            Check eligibility
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold transition hover:bg-secondary"
          >
            Talk to us
          </Link>
        </div>
      </header>

      <section id="eligibility" className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Who qualifies</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Eligible organizations hold active 501(c)(3) or 501(c)(4) status (IRS/GuideStar verified)
            and either serve vulnerable or protected groups or publish a safeguarding policy. We
            revalidate automatically every 12 months with a 60-day cure period. For programs handling
            minors, PHI, or immigration documents we require Enhanced Data Handling Protocol (EDHP)
            enablement before ingest.
          </p>
          <div className="rounded-lg border p-6 shadow-sm">
            <h3 className="text-lg font-medium">EIN eligibility checker</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your organization name and EIN to confirm nonprofit tiering in real time. Eligible
              organizations receive a confirmation and revalidation date. Cases needing manual review
              (fiscal sponsorship, naming mismatches) resolve within two business days.
            </p>
            <div className="mt-4 rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              Eligibility widget coming soon. Contact us if you need access before launch.
            </div>
          </div>
        </div>
        <aside className="space-y-4">
          <h3 className="text-lg font-medium">Discount tiers</h3>
          <ul className="space-y-3">
            {tiers.map((tier) => (
              <li key={tier.name} className="rounded-lg border p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{tier.name}</span>
                  <span>{tier.discount}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{tier.fit}</p>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">
            Compliance add-ons remain cost-based; we never zero-price security or accessibility packs.
          </p>
        </aside>
      </section>

      <section className="grid gap-12 lg:grid-cols-2">
        <article className="space-y-4">
          <h2 className="text-2xl font-semibold">What you get</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              Up to 50% off core pricing indexed to seats, roles, and verification work—never generic
              “nonprofit” coupons.
            </li>
            <li>
              Enhanced Data Handling for sensitive data with encryption, audit trails, and restricted
              access.
            </li>
            <li>
              Optional HIPAA BAAs, FERPA/COPPA support, data residency packs, and security portal access.
            </li>
            <li>
              Annual prepay and multi-year price protection for organizations sharing anonymized impact
              outcomes through the Impact Commitment.
            </li>
          </ul>
        </article>
        <article className="space-y-4">
          <h2 className="text-2xl font-semibold">How pricing works</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Pricing is transparent: plan base + recruiter/admin seats + active job slots + usage units
            (qualified reach and verification credits). Nonprofit multipliers are applied once
            eligibility is confirmed. Compliance add-ons remain cost-based with a 0–10% bundle discount
            guardrail to preserve ongoing audit coverage.
          </p>
          <div className="rounded-lg border p-4 text-sm text-muted-foreground">
            Use the in-app calculator toggle to model nonprofit tiers and see how Scale Packs can
            protect unit economics as volume grows.
          </div>
        </article>
      </section>

      <section className="rounded-lg border p-8">
        <h2 className="text-2xl font-semibold">Impact Commitment (optional)</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Share anonymized placement outcomes (90/180-day retention, safeguarding adherence) to lock in
          multi-year pricing. Results flow into our annual Impact Transparency Report and power the
          donor-backed Verification Credit Fund so more nonprofits can scale proof-driven hiring.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="#eligibility"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Check eligibility
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-semibold transition hover:bg-secondary"
          >
            Talk to our team
          </Link>
        </div>
      </section>
    </main>
  )
}
