import React from "react";
import { Button } from "@proof-of-fit/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@proof-of-fit/ui";
import { Badge } from "@proof-of-fit/ui";
import { Check, Shield, Users, Zap, ArrowRight, Star, Globe, Lock, Target, TrendingUp, Briefcase, UserCheck } from "lucide-react";

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">ProofOfFit</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
            </nav>
            <div className="flex space-x-4">
              <Button variant="outline" size="sm" asChild>
                <a href="/auth/signin">Sign In</a>
              </Button>
              <Button size="sm" asChild>
                <a href="/auth/signup">Get Started</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            <Star className="h-3 w-3 mr-1" />
            Trusted by 500+ Companies
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Land interviews with proof.
            <br />
            <span className="text-blue-600">Grow with confidence.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Our evidence engine reviews each role, tailors your application, and explains exactly why you match—so you apply with confidence, not hope.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                 <Button size="lg" className="text-lg px-8 py-4" asChild>
                   <a href="/app/fit-simple">
                     Get my Fit Report
                     <ArrowRight className="ml-2 h-4 w-4" />
                   </a>
                 </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4" asChild>
              <a href="/demo">
                Try interactive demo
              </a>
            </Button>
          </div>
          <p className="text-sm text-gray-500 mb-8">
            No card • 2 minutes to first Fit Report
          </p>
          
          {/* Proof Signals */}
          <div className="mt-12 p-6 bg-white rounded-lg shadow-lg border max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 items-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">3.2×</div>
                <div className="text-sm text-gray-600">Average interview lift</div>
                <div className="text-xs text-gray-500">After 30 days on ProofOfFit</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">90s</div>
                <div className="text-sm text-gray-600">Time to tailored resume</div>
                <div className="text-xs text-gray-500">Expert-guided, human controlled</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
                <div className="text-sm text-gray-600">Audit-ready trails</div>
                <div className="text-xs text-gray-500">Cryptographically chained decisions</div>
              </div>
            </div>
          </div>

          {/* Live Fit Report Preview */}
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Fit Report</span>
                <Badge variant="secondary" className="text-xs">Live</Badge>
              </div>
              <div className="text-sm text-gray-500">Audit trail</div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">78</div>
                <div className="text-sm text-gray-600 mb-2">DevOps · SOC2 ready</div>
                <div className="text-xs text-gray-500">
                  * Signals verified via source-control activity + compliance logs<br/>
                  * Stretch surfaced: infrastructure-as-code (coachable)<br/>
                  * Bias guardrails: experience-first, no alma mater
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Proof signals</div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>Portfolio • Audit logs • Peer refs</div>
                  <div className="text-blue-600 hover:underline cursor-pointer">
                    https://proofoffit.co/audit/9C2X‑A7Q
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Crafted AI workflows
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AI that feels like a senior designer, not a noisy assistant.
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto mt-4">
              We pair approachability with governance—mirroring the calm clarity of the products you love, while proving every recommendation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-sm font-medium text-blue-600 mb-2">Signal</div>
                <CardTitle>Explainable Fit Reports</CardTitle>
                <CardDescription>
                  Our narrative engine translates criteria into evidence you can share with recruiters or compliance teams.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-sm font-medium text-green-600 mb-2">Signal</div>
                <CardTitle>Adaptive Autopilot</CardTitle>
                <CardDescription>
                  Guided automations prepare resumes, outreach, and interview briefs while keeping you one approval tap away.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-sm font-medium text-purple-600 mb-2">Signal</div>
                <CardTitle>Bias-aware Scoring</CardTitle>
                <CardDescription>
                  We surface blind spots and suggest alternate signals so your slate tells a fair, transparent story.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-sm font-medium text-orange-600 mb-2">Signal</div>
                <CardTitle>Design-grade outputs</CardTitle>
                <CardDescription>
                  From dashboards to Fit Reports, every screen is crafted to feel as considered as the decisions behind it.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Why ProofOfFit Section */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why ProofOfFit</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Because hiring deserves evidence—and delightful software.
            </p>
            <p className="text-base text-gray-500 max-w-4xl mx-auto">
              Evidence-first matching, bias-aware automation, and audit-ready transparency, wrapped in a product experience that teams love to live in.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Explainable Matching</h3>
              <p className="text-sm text-gray-600">See why you're a match, line by line. No mystery filters.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Bias‑Reducing Algorithms</h3>
              <p className="text-sm text-gray-600">Structured signals and transparent logic to support fairer calls.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Immutable Audit Trails</h3>
              <p className="text-sm text-gray-600">Every decision has a verifiable URL—great for stakeholders and compliance.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Smart Automation</h3>
              <p className="text-sm text-gray-600">Tailored resumes and cover letters that echo the evidence, not fluff.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Companies</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Candidates</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">60%</div>
              <div className="text-blue-100">Faster Hiring</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
              Proof for both sides of the table
            </div>
            <h2 className="mt-6 text-4xl font-bold text-gray-900">
              Built for employers and job seekers alike
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Whether you need explainable hiring decisions or a confident job search plan, ProofOfFit keeps every step transparent, auditable, and bias-aware.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="h-full border border-blue-100 shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Briefcase className="h-7 w-7" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">For Employers</CardTitle>
                    <CardDescription>
                      Evidence-backed shortlists with immutable audit trails and compliance guardrails.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3 text-left text-sm text-gray-600">
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-4 w-4 text-blue-500" />
                    Ranked slates that explain every match in plain language.
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-4 w-4 text-blue-500" />
                    Guardrails that respect privacy, consent, and EEOC requirements by default.
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-4 w-4 text-blue-500" />
                    Collaboration tools that help hiring managers, compliance, and recruiters stay aligned.
                  </li>
                </ul>
                <Button size="lg" className="w-full" asChild>
                  <a href="/contact">
                    I am hiring
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="h-full border border-purple-100 shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                    <UserCheck className="h-7 w-7" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">For Job Seekers</CardTitle>
                    <CardDescription>
                      Tailored Fit Reports, guided outreach, and receipts you can bring into every conversation.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3 text-left text-sm text-gray-600">
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-4 w-4 text-purple-500" />
                    Structured stories that map your experience to each requirement line by line.
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-4 w-4 text-purple-500" />
                    Resume, cover letter, and outreach drafts that stay consistent with the evidence.
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-4 w-4 text-purple-500" />
                    A shareable audit trail that sets you apart without bending any platform rules.
                  </li>
                </ul>
                <Button size="lg" variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-600 hover:text-white" asChild>
                  <a href="/app/fit-simple">
                    I am seeking a job
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Workflow
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A guided autopilot that keeps you in control.
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto mt-4">
              Every lane follows the same calming rhythm: gather proof, map to criteria, generate the Fit Report, and share with confidence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Build your proof</h3>
              <p className="text-gray-600">
                Import resume, add projects, link evidence.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Pick a role</h3>
              <p className="text-gray-600">
                We parse the JD and map it to your proof.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Get your Fit Report</h3>
              <p className="text-gray-600">
                A 1‑pager you can attach, plus tailored resume/cover.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold mb-4">Apply with confidence</h3>
              <p className="text-gray-600">
                Know your story before the recruiter call.
              </p>
            </div>
          </div>
          
               <div className="text-center mt-12">
                 <Button size="lg" className="text-lg px-8 py-4" asChild>
                   <a href="/app/fit-simple">
                     Get My Fit Report
                     <ArrowRight className="ml-2 h-4 w-4" />
                   </a>
                 </Button>
            <p className="text-sm text-gray-500 mt-4">
              SOC2-ready • Accessible • Bias-aware by design
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Testimonials
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Loved by candidates, trusted by hiring teams.
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto mt-4">
              ProofOfFit makes interviews calmer for candidates and gives stakeholders receipts they can stand behind.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="mb-4">
                  <div className="text-sm font-medium text-blue-600 mb-2">Proof in practice</div>
                  <blockquote className="text-lg text-gray-700 italic mb-4">
                    "I stopped guessing. Two weeks in, I had interviews that referenced my Fit Report directly."
                  </blockquote>
                  <div className="text-sm text-gray-600">
                    — Amara B., Data Analyst
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="mb-4">
                  <div className="text-sm font-medium text-green-600 mb-2">Proof in practice</div>
                  <blockquote className="text-lg text-gray-700 italic mb-4">
                    "The tailored bullets were spooky‑good. It became my pre‑screen script."
                  </blockquote>
                  <div className="text-sm text-gray-600">
                    — Luis R., Product Manager
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of companies using ProofOfFit to build better, fairer teams 
            with full compliance and transparency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4" asChild>
              <a href="/auth/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <a href="/contact">
                Schedule Demo
              </a>
            </Button>
          </div>
          <p className="text-blue-200 text-sm mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6" />
                <span className="text-xl font-bold">ProofOfFit</span>
              </div>
              <p className="text-gray-400 mb-4">
                Receipts, not black boxes. We blend calming polish, robust guardrails, professional warmth, and intuitive AI to keep hiring both beautiful and accountable.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Globe className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Users className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">AI workflows</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/audit-sample" className="hover:text-white transition-colors">Sample audit</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Trust & Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/fairness" className="hover:text-white transition-colors">Fairness & explainability</a></li>
                <li><a href="/security" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="/status" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ProofOfFit, Inc. Crafted with transparency in the Midwest, with fairness and accountability at heart.</p>
            <div className="flex justify-center space-x-6 mt-4 text-sm">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <a href="/security" className="hover:text-white transition-colors">Security</a>
              <a href="/status" className="hover:text-white transition-colors">Status</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Original page code temporarily disabled for deployment
// TODO: Re-enable after fixing displayName issues