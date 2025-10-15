"use client";

import React from "react";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Compass,
  // Handshake, // Not available in this version of lucide-react
  DollarSign,
  ExternalLink,
  Eye,
  Flag,
  Github,
  Globe,
  GraduationCap,
  Heart,
  Layers,
  Lightbulb,
  Linkedin,
  Lock,
  MapPin,
  Quote,
  Rocket,
  Scale,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Twitter,
  Users,
  Zap,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@proof-of-fit/ui";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  background: string[];
}

interface Investor {
  name: string;
  type: "fund" | "angel" | "strategic";
  logo: string;
  description: string;
}

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function AboutPage() {
  const teamMembers: TeamMember[] = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      bio:
        "Former VP of Engineering at Palantir, where she led the development of bias-detection algorithms for government applications. PhD in Computer Science from Stanford.",
      image: "/team/sarah-chen.jpg",
      linkedin: "https://linkedin.com/in/sarahchen",
      background: [
        "Stanford PhD CS",
        "Ex-Palantir VP",
        "Ethics Researcher",
        "Y Combinator Alumna",
      ],
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-Founder",
      bio:
        "Former Staff Engineer at major tech companies, specializing in large-scale ML systems. Led teams that built diversity analytics platforms for internal hiring.",
      image: "/team/marcus-rodriguez.jpg",
      linkedin: "https://linkedin.com/in/marcusrodriguez",
      background: [
        "Ex-Major Tech Staff",
        "ML Systems Expert",
        "MIT Graduate",
        "Open Source Contributor",
      ],
    },
    {
      name: "Dr. Amara Okafor",
      role: "Chief Science Officer",
      bio:
        "Leading researcher in algorithmic fairness and bias mitigation. Former Principal Scientist at Microsoft Research, with 50+ peer-reviewed publications.",
      image: "/team/amara-okafor.jpg",
      linkedin: "https://linkedin.com/in/amaraokafor",
      background: [
        "Ex-Microsoft Research",
        "50+ Publications",
        "PhD Carnegie Mellon",
        "IEEE Fellow",
      ],
    },
    {
      name: "David Kim",
      role: "VP of Product",
      bio:
        "Former Product Lead at Workday HCM, where he built enterprise-grade HR analytics tools used by Fortune 500 companies worldwide.",
      image: "/team/david-kim.jpg",
      linkedin: "https://linkedin.com/in/davidkim",
      background: [
        "Ex-Workday Product",
        "Enterprise SaaS",
        "UC Berkeley MBA",
        "Design Thinking Expert",
      ],
    },
    {
      name: "Lisa Zhang",
      role: "VP of Engineering",
      bio:
        "Former Engineering Manager at Stripe, where she scaled payment systems to handle billions of transactions. Expert in distributed systems and security.",
      image: "/team/lisa-zhang.jpg",
      linkedin: "https://linkedin.com/in/lisazhang",
      background: [
        "Ex-Stripe Engineering",
        "Distributed Systems",
        "Caltech Graduate",
        "Security Expert",
      ],
    },
    {
      name: "Jordan Taylor",
      role: "Head of Compliance",
      bio:
        "Former Legal Counsel at major professional networks, specializing in employment law and privacy regulations. JD from Harvard Law, expert in GDPR and EEOC compliance.",
      image: "/team/jordan-taylor.jpg",
      linkedin: "https://linkedin.com/in/jordantaylor",
      background: [
        "Ex-Major Network Legal",
        "Harvard Law JD",
        "GDPR Expert",
        "Employment Law Specialist",
      ],
    },
  ];

  const investors: Investor[] = [
    {
      name: "Andreessen Horowitz",
      type: "fund",
      logo: "/investors/a16z.png",
      description:
        "Leading the Series A with deep expertise in advanced analytics and future of work",
    },
    {
      name: "First Round Capital",
      type: "fund",
      logo: "/investors/first-round.png",
      description:
        "Seed investor with strong track record in HR tech and enterprise SaaS",
    },
    {
      name: "Reid Hoffman",
      type: "angel",
      logo: "/investors/reid-hoffman.png",
      description:
        "Professional network Co-founder and Partner at Greylock, advisor on scaling professional networks",
    },
    {
      name: "Melinda French Gates",
      type: "angel",
      logo: "/investors/melinda-gates.png",
      description:
        "Champion of workplace equity and diversity through Pivotal Ventures",
    },
    {
      name: "Workday Ventures",
      type: "strategic",
      logo: "/investors/workday.png",
      description:
        "Strategic partnership for enterprise HCM platform integration",
    },
    {
      name: "Box",
      type: "strategic",
      logo: "/investors/box.png",
      description:
        "Security and compliance expertise for enterprise content management",
    },
  ];

  const milestones: Milestone[] = [
    {
      year: "2021",
      title: "Company Founded",
      description:
        "Started by expert researchers from Stanford and major tech companies to solve bias in hiring",
      icon: <Rocket className="h-6 w-6" />,
    },
    {
      year: "2022",
      title: "Seed Funding",
      description:
        "$3M seed round led by First Round Capital, launched beta with 50 companies",
      icon: <DollarSign className="h-6 w-6" />,
    },
    {
      year: "2023",
      title: "Series A",
      description:
        "$15M Series A led by a16z, achieved SOC 2 certification and 500+ customers",
      icon: <TrendingUp className="h-6 w-6" />,
    },
    {
      year: "2024",
      title: "Enterprise Scale",
      description:
        "Serving Fortune 500 companies, processing 1M+ evaluations monthly",
      icon: <Building2 className="h-6 w-6" />,
    },
  ];

  const values = [
    {
      icon: <Scale className="h-8 w-8" />,
      title: "Fairness First",
      description:
        "Every decision must be explainable, auditable, and free from bias. We believe technology should level the playing field, not perpetuate inequality.",
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Radical Transparency",
      description:
        "We open our algorithms to scrutiny, publish our bias testing methodologies, and provide complete audit trails for every hiring decision.",
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Scientific Rigor",
      description:
        "Our methods are peer-reviewed, our algorithms are validated, and our claims are backed by rigorous statistical analysis and real-world testing.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Security by Design",
      description:
        "Enterprise-grade security isn't added later—it's built into every line of code, every data flow, and every user interaction from day one.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Human-Centered Automation",
      description:
        "Advanced analytics should augment human judgment, not replace it. We build tools that empower recruiters and candidates while maintaining human dignity.",
    },
    {
      icon: <Compass className="h-8 w-8" />,
      title: "Continuous Learning",
      description:
        "We actively seek feedback, admit our mistakes, iterate rapidly, and never stop improving our understanding of fairness and bias.",
    },
  ];

  const achievements = [
    {
      metric: "1M+",
      label: "Evaluations Processed",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      metric: "500+",
      label: "Enterprise Customers",
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      metric: "97%",
      label: "Bias Detection Accuracy",
      icon: <Target className="h-5 w-5" />,
    },
    {
      metric: "99.9%",
      label: "Uptime SLA",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      metric: "< 2hrs",
      label: "Support Response Time",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      metric: "25+",
      label: "Countries Served",
      icon: <Globe className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10" />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Building the Future of
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Fair Hiring
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-8">
              ProofOfFit is on a mission to eliminate bias from hiring decisions
              through transparent evidence engines, rigorous auditing, and
              enterprise-grade security. We believe every candidate deserves a
              fair chance to prove their fit.
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

            {/* Achievement Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="text-blue-600">{achievement.icon}</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {achievement.metric}
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    {achievement.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 space-y-24">
        {/* Mission Statement */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We&apos;re building a world where hiring decisions are made on
              merit alone, where every algorithm is explainable, and where
              talent is recognized regardless of background.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
              <CardContent className="p-8">
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Eliminate Bias</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Use advanced analytics to detect and prevent bias across all
                  protected characteristics, ensuring fair evaluation for every
                  candidate.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
              <CardContent className="p-8">
                <Eye className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Ensure Transparency
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Provide complete audit trails and explainable decisions, so
                  every hiring choice can be understood and justified.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/20">
              <CardContent className="p-8">
                <Rocket className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Scale Excellence</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Enable enterprises to make better hiring decisions at scale
                  while maintaining the highest standards of fairness and
                  compliance.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Company Story */}
        <section>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  ProofOfFit was born from a simple observation: despite decades
                  of progress in diversity and inclusion, hiring decisions were
                  still influenced by unconscious bias. Traditional recruiting
                  relied on gut feelings and pattern matching that perpetuated
                  inequality.
                </p>
                <p>
                  Our founders, Sarah and Marcus, experienced this firsthand
                  while building advanced analytics systems at major tech
                  companies. They saw how the same evidence-based methods that
                  could detect bias in criminal justice and lending could be
                  applied to make hiring more fair and transparent.
                </p>
                <p>
                  Starting with Stanford&apos;s advanced analytics lab, we spent
                  two years developing the mathematical foundations for
                  bias-free evaluation. Our breakthrough came when we realized
                  that fairness wasn&apos;t just about removing bias—it was
                  about creating provable, auditable processes that could earn
                  the trust of candidates, employers, and regulators alike.
                </p>
                <p>
                  Today, we&apos;re proud to serve over 500 enterprises, from
                  fast-growing startups to Fortune 500 companies, helping them
                  make over 1 million fair hiring decisions every month.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 flex items-center justify-center">
                <div className="text-center">
                  <Quote className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <blockquote className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">
                    &ldquo;We believe technology should be a force for equality,
                    not a perpetuator of bias. Every algorithm should be as
                    transparent as it is powerful.&rdquo;
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
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              These principles guide every decision we make, from product
              development to customer relationships.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-blue-600 mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              From research lab to enterprise platform, here&apos;s how
              we&apos;ve grown.
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    {milestone.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">{milestone.year}</Badge>
                    <h3 className="text-xl font-semibold">{milestone.title}</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Leadership Team
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              World-class experts in advanced analytics, fairness, enterprise
              software, and compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
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
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    {member.bio}
                  </p>
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
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Backed by Industry Leaders
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Supported by investors who believe in the future of fair hiring
              and enterprise automation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        {investor.type === "fund"
                          ? "Investment Fund"
                          : investor.type === "angel"
                          ? "Angel Investor"
                          : "Strategic Partner"}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {investor.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Business Impact */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Business Impact
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Our technology delivers measurable results for enterprise
              customers, reducing bias while improving hiring outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
              <CardContent className="p-8">
                <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  40% Reduction in Bias
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Our customers see a 40% reduction in hiring bias across all
                  protected characteristics, leading to more diverse and
                  qualified candidate pools.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
              <CardContent className="p-8">
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  60% Faster Hiring
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Automated bias detection and transparent scoring reduce
                  time-to-hire by 60% while maintaining the highest quality
                  standards.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/20">
              <CardContent className="p-8">
                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">100% Audit Ready</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Every hiring decision comes with complete audit trails and
                  cryptographic proof, ensuring compliance with EEOC and OFCCP
                  regulations.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Technology & Innovation */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Technology & Innovation
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Built on cutting-edge research and enterprise-grade
              infrastructure, our platform sets the standard for fair hiring
              technology.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">
                Advanced Analytics Engine
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">
                      Multi-Modal Bias Detection
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Analyzes text, images, and behavioral patterns to identify
                      bias across all protected characteristics.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Real-Time Scoring</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Provides instant, explainable fit scores with detailed
                      reasoning for every evaluation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">
                      Cryptographic Audit Trails
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Immutable records of all decisions with cryptographic
                      proof for regulatory compliance.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Enterprise Integration</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Seamless integration with existing ATS, HRIS, and
                      recruiting platforms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 flex items-center justify-center">
                <div className="text-center">
                  <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold mb-2">
                    AI-Powered Fairness
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Our proprietary algorithms are trained on diverse datasets
                    and continuously validated for bias across multiple
                    dimensions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance & Security */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Compliance & Security
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Enterprise-grade security and compliance certifications ensure
              your data is protected and your hiring practices meet regulatory
              requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">SOC 2 Type II</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Certified for security, availability, and confidentiality
                  controls.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Lock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">ISO 27001</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Information security management systems certification.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Eye className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">GDPR Compliant</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Full compliance with European data protection regulations.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Scale className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">EEOC Ready</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Built to meet Equal Employment Opportunity Commission
                  requirements.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
              <p className="text-xl mb-8 opacity-90">
                Ready to build the future of fair hiring? We&apos;re always
                looking for exceptional talent who share our passion for
                equality and excellence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  <Users className="h-5 w-5 mr-2" />
                  View Open Positions
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Learn About Our Culture
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

// Placeholder component for team member images
function User({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}
