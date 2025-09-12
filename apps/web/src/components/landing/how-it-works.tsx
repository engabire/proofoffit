import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { 
  ArrowRight, 
  CheckCircle, 
  FileText, 
  Search, 
  Send, 
  Target 
} from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "1. Job Discovery",
      description: "Our system continuously scans job boards and career sites, respecting ToS and privacy policies.",
      details: "Connects to USAJOBS, ReliefWeb, ATS platforms, and employer career pages with explicit permission."
    },
    {
      icon: Target,
      title: "2. Smart Matching",
      description: "AI analyzes your profile against job requirements using our comprehensive criteria graph.",
      details: "Every match includes detailed explanations showing why you're a fit, with evidence and scoring."
    },
    {
      icon: FileText,
      title: "3. Tailored Applications",
      description: "Generate customized resumes and cover letters that highlight your most relevant experience.",
      details: "AI-powered content generation with human oversight, ensuring quality and authenticity."
    },
    {
      icon: CheckCircle,
      title: "4. Policy Compliance",
      description: "Automatic ToS checking and CAPTCHA detection ensures ethical application practices.",
      details: "For restricted sites, creates prep-and-confirm workflows that respect platform policies."
    },
    {
      icon: Send,
      title: "5. Application Management",
      description: "Track applications, manage follow-ups, and coordinate with recruiters seamlessly.",
      details: "Integrated communication hub with email templates and calendar scheduling."
    }
  ]

  return (
    <section id="how-it-works" className="py-20 bg-muted/50">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How ProofOfFit Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A transparent, ethical approach to modern hiring that puts you in control.
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                <div className="rounded-full bg-primary p-4">
                  <step.icon className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              
              <div className="flex-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                    <CardDescription className="text-base">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {step.details}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center mt-8">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
