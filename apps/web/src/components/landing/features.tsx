import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { 
  Brain, 
  FileText, 
  Lock, 
  Search, 
  Target, 
  TrendingUp,
  Users,
  Zap
} from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: Brain,
      title: "Criteria-Driven Matching",
      description: "Our intelligent system maps your skills to job requirements using a comprehensive criteria graph, ensuring perfect fit."
    },
    {
      icon: FileText,
      title: "Explainable Decisions",
      description: "Every ranking comes with clear evidence and reasoning. See exactly why you're a match for each opportunity."
    },
    {
      icon: Lock,
      title: "Compliance-First",
      description: "Respects ToS, handles CAPTCHAs gracefully, and maintains strict privacy controls with consent management."
    },
    {
      icon: Search,
      title: "Smart Job Discovery",
      description: "Automatically finds relevant opportunities from multiple sources while respecting platform policies."
    },
    {
      icon: Target,
      title: "Tailored Applications",
      description: "AI-powered resume and cover letter generation that highlights your most relevant experience for each role."
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Track your application success rate, interview conversion, and optimize your profile based on real data."
    },
    {
      icon: Users,
      title: "Employer Slates",
      description: "For recruiters: get ranked candidate slates with detailed explanations and audit trails for every decision."
    },
    {
      icon: Zap,
      title: "Carbon-Aware Processing",
      description: "Sustainable AI that minimizes environmental impact through smart scheduling and efficient model usage."
    }
  ]

  return (
    <section id="features" className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built on Da Vincian Principles
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Truth, Care, Craft, and Planet - every feature designed with these core values in mind.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="relative">
              <CardHeader>
                <div className="mb-4 rounded-lg bg-primary/10 p-3 w-fit">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
