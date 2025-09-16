import Link from 'next/link'
import { Button } from '@proof-of-fit/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Check, Zap } from 'lucide-react'

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with your job search",
      features: [
        "Up to 10 applications per month",
        "Basic job matching",
        "Simple resume tailoring",
        "Email support",
        "Basic analytics"
      ],
      cta: "Get Started Free",
      href: "/auth/signup?plan=free",
      popular: false
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "For serious job seekers who want to maximize their opportunities",
      features: [
        "Unlimited applications",
        "Advanced AI matching",
        "Premium resume tailoring",
        "Priority support",
        "Advanced analytics",
        "Interview scheduling",
        "Follow-up automation"
      ],
      cta: "Start Pro Trial",
      href: "/auth/signup?plan=pro",
      popular: true
    },
    {
      name: "Pro+",
      price: "$49",
      period: "per month",
      description: "For professionals who need the most comprehensive tools",
      features: [
        "Everything in Pro",
        "Custom criteria mapping",
        "Advanced bias monitoring",
        "API access",
        "White-label options",
        "Dedicated account manager",
        "Custom integrations"
      ],
      cta: "Start Pro+ Trial",
      href: "/auth/signup?plan=pro_plus",
      popular: false
    }
  ]

  const employerPlans = [
    {
      name: "Team",
      price: "$99",
      period: "per month",
      description: "For growing companies that need better candidate screening",
      features: [
        "Up to 5 team members",
        "Candidate slate generation",
        "Audit trails and compliance",
        "Custom intake forms",
        "Integration with ATS",
        "Priority support"
      ],
      cta: "Start Team Trial",
      href: "/auth/signup?plan=team",
      popular: false
    },
    {
      name: "Per-Slate",
      price: "$15",
      period: "per slate",
      description: "Pay only for what you use - perfect for occasional hiring",
      features: [
        "On-demand slate generation",
        "Detailed candidate explanations",
        "Audit URLs for compliance",
        "Email notifications",
        "Basic analytics"
      ],
      cta: "Try Per-Slate",
      href: "/auth/signup?plan=per_slate",
      popular: false
    }
  ]

  return (
    <section id="pricing" className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that fits your needs. All plans include our core compliance and explainability features.
          </p>
        </div>

        {/* Candidate Plans */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">For Candidates</h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link 
                      href={plan.href}
                      aria-label={`${plan.cta} - ${plan.name} plan starting at ${plan.price} per ${plan.period}`}
                      rel="noopener"
                    >
                      {plan.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Employer Plans */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-8">For Employers</h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {employerPlans.map((plan, index) => (
              <Card key={index} className="relative">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button className="w-full" variant="outline" asChild>
                    <Link 
                      href={plan.href}
                      aria-label={`${plan.cta} - ${plan.name} plan at ${plan.price} per ${plan.period}`}
                      rel="noopener"
                    >
                      {plan.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
