"use client"

import React from "react"
import {
  Building2,
  Shield,
  Award,
  Users,
  Globe,
  TrendingUp,
  CheckCircle,
  Star,
  Target,
  Eye,
  Lock,
  BarChart3,
  Clock,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ArrowRight,
  Heart,
  Zap,
  Compass,
  Layers,
  Brain,
  Rocket,
  DollarSign,
  Trophy,
  Flag,
  Calendar,
  BookOpen,
  Lightbulb,
  Scale,
  Sparkles,
  ChevronRight,
  Quote,
  Briefcase,
  GraduationCap,
  User,
  Linkedin,
  Twitter,
  Github
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button
} from "@proof-of-fit/ui"

export default function CompanyPage() {
  const companyStats = [
    { metric: "500+", label: "Enterprise Customers", icon: <Building2 className="h-5 w-5" /> },
    { metric: "1M+", label: "Monthly Evaluations", icon: <BarChart3 className="h-5 w-5" /> },
    { metric: "97%", label: "Bias Detection Accuracy", icon: <Target className="h-5 w-5" /> },
    { metric: "99.9%", label: "Uptime SLA", icon: <Shield className="h-5 w-5" /> },
    { metric: "25+", label: "Countries Served", icon: <Globe className="h-5 w-5" /> },
    { metric: "< 2hrs", label: "Support Response", icon: <Clock className="h-5 w-5" /> }
  ]

  const certifications = [
    {
      name: "SOC 2 Type II",
      description: "Security, availability, and confidentiality controls",
      icon: <Shield className="h-6 w-6" />,
      status: "Certified"
    },
    {
      name: "ISO 27001",
      description: "Information security management systems",
      icon: <Lock className="h-6 w-6" />,
      status: "Certified"
    },
    {
      name: "GDPR Compliant",
      description: "European data protection regulation compliance",
      icon: <Eye className="h-6 w-6" />,
      status: "Compliant"
    },
    {
      name: "CCPA Compliant",
      description: "California consumer privacy act compliance",
      icon: <Scale className="h-6 w-6" />,
      status: "Compliant"
    }
  ]

  const leadership = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      bio: "Former VP of Engineering at Palantir, PhD in Computer Science from Stanford. Led development of bias-detection algorithms for government applications.",
      image: "/team/sarah-chen.jpg",
      linkedin: "https://linkedin.com/in/sarahchen",
      background: ["Stanford PhD CS", "Ex-Palantir VP", "Ethics Researcher", "Y Combinator Alumna"]
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-Founder", 
      bio: "Former Staff Engineer at major tech companies, specializing in large-scale ML systems. Led teams building diversity analytics platforms.",
      image: "/team/marcus-rodriguez.jpg",
      linkedin: "https://linkedin.com/in/marcusrodriguez",
      background: ["Ex-Major Tech Staff", "ML Systems Expert", "MIT Graduate", "Open Source Contributor"]
    },
    {
      name: "Dr. Amara Okafor",
      role: "Chief Science Officer",
      bio: "Leading researcher in algorithmic fairness and bias mitigation. Former Principal Scientist at Microsoft Research, 50+ peer-reviewed publications.",
      image: "/team/amara-okafor.jpg",
      linkedin: "https://linkedin.com/in/amaraokafor",
      background: ["Ex-Microsoft Research", "50+ Publications", "PhD Carnegie Mellon", "IEEE Fellow"]
    }
  ]

  const investors = [
    {
      name: "Andreessen Horowitz",
      type: "Series A Lead",
      description: "Leading the Series A with deep expertise in advanced analytics and future of work"
    },
    {
      name: "First Round Capital", 
      type: "Seed Lead",
      description: "Seed investor with strong track record in HR tech and enterprise SaaS"
    },
    {
      name: "Reid Hoffman",
      type: "Angel Investor",
      description: "Professional network Co-founder and Partner at Greylock, advisor on scaling professional networks"
    },
    {
      name: "Workday Ventures",
      type: "Strategic Partner",
      description: "Strategic partnership for enterprise HCM platform integration"
    }
  ]

  const values = [
    {
      icon: <Scale className="h-8 w-8" />,
      title: "Fairness First",
      description: "Every decision must be explainable, auditable, and free from bias. We believe technology should level the playing field, not perpetuate inequality."
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Radical Transparency",
      description: "We open our algorithms to scrutiny, publish our bias testing methodologies, and provide complete audit trails for every hiring decision."
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Scientific Rigor",
      description: "Our methods are peer-reviewed, our algorithms are validated, and our claims are backed by rigorous statistical analysis and real-world testing."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Security by Design",
      description: "Enterprise-grade security isn't added later—it's built into every line of code, every data flow, and every user interaction from day one."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10" />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
              ProofOfFit
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Company</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-8">
              We&apos;re building the future of fair hiring through transparent evidence engines, 
              rigorous auditing, and enterprise-grade security. Trusted by 500+ companies worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
                <CheckCircle className="h-4 w-4 mr-2" />
                SOC 2 Type II Certified
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-4 py-2">
                <Award className="h-4 w-4 mr-2" />
                Y Combinator Backed
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                Forbes 30 Under 30
              </Badge>
            </div>
            
            {/* Company Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
              {companyStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="text-blue-600">{stat.icon}</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stat.metric}
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 space-y-24">
        {/* Mission & Vision */}
        <section>
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
              <CardContent className="p-8">
                <Target className="h-12 w-12 text-blue-600 mb-4" />
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-slate-600 dark:text-slate-300">
                  To eliminate bias from hiring decisions through transparent evidence engines, 
                  rigorous auditing, and enterprise-grade security. We believe every candidate 
                  deserves a fair chance to prove their fit.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/20">
              <CardContent className="p-8">
                <Compass className="h-12 w-12 text-purple-600 mb-4" />
                <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                <p className="text-slate-600 dark:text-slate-300">
                  A world where hiring decisions are made on merit alone, where every algorithm 
                  is explainable, and where talent is recognized regardless of background. 
                  Building the infrastructure for fair hiring at scale.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Company Story */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Our Story</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              From research lab to enterprise platform, here&apos;s how we&apos;re transforming hiring.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  ProofOfFit was founded in 2021 by Sarah Chen and Marcus Rodriguez, 
                  former engineers from Palantir and major tech companies who experienced 
                  firsthand how unconscious bias affected hiring decisions.
                </p>
                <p>
                  Starting with Stanford&apos;s advanced analytics lab, we spent two years 
                  developing the mathematical foundations for bias-free evaluation. 
                  Our breakthrough came when we realized that fairness wasn&apos;t just about 
                  removing bias—it was about creating provable, auditable processes.
                </p>
                <p>
                  Today, we&apos;re proud to serve over 500 enterprises, from fast-growing 
                  startups to Fortune 500 companies, helping them make over 1 million 
                  fair hiring decisions every month.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 flex items-center justify-center">
                <div className="text-center">
                  <Quote className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <blockquote className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">
                    &ldquo;We believe technology should be a force for equality, not a perpetuator of bias. 
                    Every algorithm should be as transparent as it is powerful.&rdquo;
                  </blockquote>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    — Sarah Chen, CEO & Co-Founder
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Our Values</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              These principles guide every decision we make, from product development to customer relationships.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-blue-600 mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Leadership */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Leadership Team</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              World-class experts in advanced analytics, fairness, enterprise software, and compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {leadership.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{member.name}</h3>
                      <p className="text-sm text-blue-600">{member.role}</p>
                    </div>
                    {member.linkedin && (
                      <Button size="sm" variant="ghost">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{member.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {member.background.map((item, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Investors */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Backed by Industry Leaders</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Supported by investors who believe in the future of fair hiring and enterprise automation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {investors.map((investor, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{investor.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {investor.type}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{investor.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Certifications & Compliance */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Certifications & Compliance</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Enterprise-grade security and compliance certifications that protect your data and ensure regulatory compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="text-blue-600 mb-4 flex justify-center">{cert.icon}</div>
                  <h3 className="font-semibold mb-2">{cert.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{cert.description}</p>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {cert.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Get in Touch</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Ready to transform your hiring process? Contact our team to learn more.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">General Inquiries</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Questions about our platform or services
                </p>
                <a href="mailto:hello@proofoffit.com" className="text-blue-600 hover:text-blue-700">
                  hello@proofoffit.com
                </a>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Building2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Enterprise Sales</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Ready to transform your hiring process?
                </p>
                <a href="mailto:enterprise@proofoffit.com" className="text-green-600 hover:text-green-700">
                  enterprise@proofoffit.com
                </a>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Media & Press</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Press inquiries and media resources
                </p>
                <a href="mailto:press@proofoffit.com" className="text-purple-600 hover:text-purple-700">
                  press@proofoffit.com
                </a>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join 500+ companies already using ProofOfFit to make fairer, more transparent hiring decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  <Users className="h-5 w-5 mr-2" />
                  Schedule a Demo
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Heart className="h-5 w-5 mr-2" />
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
