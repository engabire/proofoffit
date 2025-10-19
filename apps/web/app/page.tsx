/**
 * ProofOfFit Landing Page (Next.js App Router)
 * Enhanced version with Logo component and improved design
 * 
 * Location: apps/web/app/page.tsx
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { 
  Briefcase, 
  FileCheck, 
  TrendingUp, 
  Shield, 
  CheckCircle, 
  Users,
  Sparkles,
  Target,
  Lock
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: FileCheck,
      title: "Evidence-Based Hiring",
      description: "Move beyond resumes. Validate candidate skills with real, verifiable evidence.",
    },
    {
      icon: TrendingUp,
      title: "Data-Driven Decisions",
      description: "Make hiring decisions backed by concrete proof, not gut feelings.",
    },
    {
      icon: Shield,
      title: "Verified Credentials",
      description: "Build trust with verified portfolios, case studies, and work samples.",
    },
  ];

  const newFeatures = [
    {
      icon: Sparkles,
      title: "Auto-Apply with Consent",
      description: "Automate job applications with explicit digital consent and full transparency.",
    },
    {
      icon: Target,
      title: "Smart Job Matching",
      description: "Configure rules to match opportunities based on your criteria and preferences.",
    },
    {
      icon: Lock,
      title: "Compliance-First",
      description: "Immutable audit trails and digital signatures ensure legal defensibility.",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Active Jobs" },
    { value: "5,000+", label: "Candidates" },
    { value: "95%", label: "Match Accuracy" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-chart-2/5" />
        <div className="max-w-7xl mx-auto px-4 py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-block">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Evidence-First Platform</span>
                </div>
              </div>
              
              {/* Headline */}
              <h1 className="text-6xl font-bold tracking-tight">
                Hire by proof,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-chart-2">
                  not by vibes
                </span>
              </h1>
              
              {/* Subheadline */}
              <p className="text-xl text-muted-foreground max-w-xl">
                ProofOfFit transforms hiring with verifiable evidence. Connect candidates with opportunities based on real skills and proven achievements.
              </p>
              
              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link href="/jobs">
                  <Button size="lg" className="h-12 px-8" data-testid="button-find-jobs">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Find Jobs
                  </Button>
                </Link>
                <Link href="/evidence/new">
                  <Button size="lg" variant="outline" className="h-12 px-8" data-testid="button-add-evidence">
                    <FileCheck className="mr-2 h-5 w-5" />
                    Add Evidence
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-4">
                {stats.map((stat, idx) => (
                  <div key={idx}>
                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Column: Logo Visual */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
              <div className="relative p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-chart-2/10 border border-primary/20">
                <Logo size="xl" showText={false} className="scale-[3]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold tracking-tight mb-4">
              Why ProofOfFit?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Traditional hiring relies on subjective assessments. We bring objectivity to the process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="hover-elevate transition-all duration-100">
                  <CardContent className="pt-6">
                    <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* New Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-chart-2/10 border border-chart-2/20 mb-4">
              <span className="text-sm font-medium text-chart-2">New Features</span>
            </div>
            <h2 className="text-4xl font-semibold tracking-tight mb-4">
              Automated Applications, Full Control
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our Auto-Apply system lets you automate job applications while maintaining complete transparency and legal compliance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="hover-elevate transition-all duration-100 border-chart-2/20">
                  <CardContent className="pt-6">
                    <div className="p-3 rounded-lg bg-chart-2/10 w-fit mb-4">
                      <Icon className="h-6 w-6 text-chart-2" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Auto-Apply CTA */}
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-br from-chart-2/10 via-background to-primary/10 border-chart-2/20 inline-block">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">Ready to automate your job search?</h3>
                  <p className="text-muted-foreground max-w-md">
                    Set up your auto-apply rules in minutes and let the system work for you.
                  </p>
                  <Link href="/candidate/auto-apply">
                    <Button size="lg" variant="default" className="bg-chart-2 hover:bg-chart-2/90">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Explore Auto-Apply
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <Card className="bg-gradient-to-br from-primary/10 via-background to-chart-2/10 border-primary/20">
            <CardContent className="p-12">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <Users className="h-12 w-12 text-primary mx-auto" />
                <h2 className="text-3xl font-semibold tracking-tight">
                  Ready to transform your hiring process?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Join thousands of companies and candidates using evidence-based hiring.
                </p>
                <div className="flex justify-center gap-4 pt-4">
                  <Link href="/jobs">
                    <Button size="lg" data-testid="button-get-started">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button size="lg" variant="outline" data-testid="button-learn-more">
                      View Pricing
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="space-y-4">
              <Logo size="sm" showText={true} />
              <p className="text-sm text-muted-foreground">
                Evidence-based hiring for the modern workforce.
              </p>
            </div>
            
            {/* Candidates Column */}
            <div>
              <h3 className="font-semibold mb-4">For Candidates</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/jobs" className="hover:text-foreground transition-colors">Browse Jobs</Link></li>
                <li><Link href="/evidence/new" className="hover:text-foreground transition-colors">Add Evidence</Link></li>
                <li><Link href="/candidate/auto-apply" className="hover:text-foreground transition-colors">Auto-Apply</Link></li>
                <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            
            {/* Employers Column */}
            <div>
              <h3 className="font-semibold mb-4">For Employers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/employer/post-job" className="hover:text-foreground transition-colors">Post a Job</Link></li>
                <li><Link href="/employer/candidates" className="hover:text-foreground transition-colors">Find Candidates</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/employer" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            
            {/* Company Column */}
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2025 ProofOfFit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
