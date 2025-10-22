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
      title: "Fairness First, Always",
      description:
        "We've mathematically proven that bias is not inevitable—it's a choice. Every algorithm we build is designed to eliminate bias, not just detect it. We believe that when technology is built with fairness as the foundation, it becomes a force for equality that transforms entire industries.",
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Radical Transparency",
      description:
        "We don't hide behind black boxes or proprietary secrets. Our algorithms are open to scrutiny, our methodologies are peer-reviewed, and every hiring decision comes with a complete audit trail. We believe that trust is built through transparency, not through secrecy.",
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Scientific Rigor, Human Wisdom",
      description:
        "We combine the precision of advanced analytics with the wisdom of human judgment. Our methods are peer-reviewed, our algorithms are validated, and our claims are backed by rigorous statistical analysis. But we never forget that behind every data point is a human being with dreams, aspirations, and potential.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Security by Design, Privacy by Default",
      description:
        "We don't just protect data—we protect people. Enterprise-grade security isn't added later—it's built into every line of code, every data flow, and every user interaction from day one. Privacy isn't an afterthought; it's the foundation of everything we build.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Human-Centered Automation",
      description:
        "We don't believe in replacing humans with machines—we believe in empowering humans with better tools. Our platform augments human judgment, amplifies human potential, and preserves human dignity. Technology should make us more human, not less.",
    },
    {
      icon: <Compass className="h-8 w-8" />,
      title: "Continuous Learning, Perpetual Growth",
      description:
        "We're not perfect, and we don't pretend to be. We actively seek feedback, admit our mistakes, iterate rapidly, and never stop learning. Every day, we get better at understanding fairness, eliminating bias, and building technology that truly serves humanity.",
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
              Revolutionizing Hiring Through
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Evidence & Ethics
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-8">
              We're not just another HR tech company. We're the architects of a new era where hiring decisions are made with mathematical precision, 
              ethical rigor, and human dignity. Every algorithm we build, every decision we enable, and every candidate we serve is guided by one 
              unwavering principle: <strong>merit should be the only measure that matters.</strong>
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
              Our Philosophy: The ProofOfFit Way
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We believe that hiring is not just a business process—it's a moral imperative. Every hiring decision shapes lives, 
              builds communities, and determines the future of work. That's why we've built the world's first <strong>evidence-based hiring platform</strong> 
              that combines the precision of advanced analytics with the wisdom of human judgment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
              <CardContent className="p-8">
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Eliminate Bias, Amplify Merit</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Our proprietary algorithms don't just detect bias—they eliminate it at the source. We've mathematically proven that 
                  talent knows no demographic boundaries, and our platform ensures every candidate gets evaluated on their actual capabilities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
              <CardContent className="p-8">
                <Eye className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Radical Transparency, Unshakeable Trust
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  We don't hide behind "proprietary algorithms." Every decision we make is explainable, every process is auditable, 
                  and every candidate can see exactly why they were or weren't selected. Trust is earned through transparency, not secrecy.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/20">
              <CardContent className="p-8">
                <Rocket className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Scale Excellence, Preserve Humanity</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  We don't believe in replacing human judgment—we believe in augmenting it. Our platform helps enterprises make 
                  better decisions at scale while preserving the human touch that makes great teams. Technology should enhance humanity, not replace it.
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

        {/* Brand Values & Ethics */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Our Brand Values: The Ethical Foundation
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              At ProofOfFit, we don't just build software—we build the future of work. These values aren't just words on a wall; 
              they're the mathematical principles that guide every algorithm, every decision, and every interaction.
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
