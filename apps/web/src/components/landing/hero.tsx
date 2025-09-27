import { Cta } from '@proof-of-fit/ui'
import { ArrowRight, Shield, Users, Zap } from 'lucide-react'

export function Hero() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center rounded-full border bg-muted px-4 py-2 text-sm">
              <Shield className="mr-2 h-4 w-4 text-primary" />
              Compliance-First Hiring OS
            </div>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
            The Future of{' '}
            <span className="text-primary">Explainable</span>{' '}
            Hiring
          </h1>
          
          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            Candidates run a safe autopilot; employers get ranked, explainable slates. 
            Every decision is traceable, consented, auditable, and as low-carbon as practical.
          </p>
          
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Cta
              label="Start Your Autopilot"
              href="/auth/signup"
              size="lg"
              variant="primary"
              iconRight={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
              ariaLabel="Start your autopilot - Sign up for ProofOfFit to begin your job search"
              data-evt="seeker_primary"
              data-lane="seeker"
            />
            <Cta
              label="See How It Works"
              href="#how-it-works"
              size="lg"
              variant="secondary"
              ariaLabel="See how it works - Learn about our process and features"
              data-evt="seeker_secondary"
              data-lane="seeker"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">For Candidates</h3>
              <p className="text-sm text-muted-foreground text-center">
                Safe autopilot that respects ToS and your dignity
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">For Employers</h3>
              <p className="text-sm text-muted-foreground text-center">
                Ranked, explainable slates with audit trails
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">For the Planet</h3>
              <p className="text-sm text-muted-foreground text-center">
                Carbon-aware processing and sustainability metrics
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
