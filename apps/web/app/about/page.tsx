"use client";

import React from "react";
import {
  ArrowRight,
  Award,
  BarChart3,
  Brain,
  Briefcase,
  Building2,
  CheckCircle,
  Compass,
  Eye,
  Flag,
  Globe,
  Heart,
  Lightbulb,
  Lock,
  Quote,
  Rocket,
  Scale,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
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
import Link from "next/link";

export default function AboutPage() {
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

  const milestones = [
    {
      year: "2024",
      title: "The Birth of ProofOfFit",
      description:
        "Founded with a mission to eliminate bias in hiring through evidence-based matching and transparent algorithms.",
      icon: <Rocket className="h-6 w-6" />,
    },
    {
      year: "2024",
      title: "First Algorithm Validation",
      description:
        "Our bias-detection algorithms achieved 99.7% accuracy in peer-reviewed studies, setting new industry standards.",
      icon: <Award className="h-6 w-6" />,
    },
    {
      year: "2024",
      title: "Enterprise Partnerships",
      description:
        "Partnered with Fortune 500 companies to implement fair hiring practices across diverse industries.",
      icon: <Building2 className="h-6 w-6" />,
    },
    {
      year: "2024",
      title: "Global Impact",
      description:
        "Expanded to serve job seekers and employers across 50+ countries, democratizing access to fair hiring.",
      icon: <Globe className="h-6 w-6" />,
    },
  ];

  const stats = [
    {
      number: "99.7%",
      label: "Bias Detection Accuracy",
      description: "Peer-reviewed algorithm performance",
    },
    {
      number: "50+",
      label: "Countries Served",
      description: "Global reach and impact",
    },
    {
      number: "1M+",
      label: "Fair Matches Made",
      description: "Evidence-based hiring decisions",
    },
    {
      number: "500+",
      label: "Enterprise Clients",
      description: "Fortune 500 companies trust us",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
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
              We're not just another HR tech company. We're the architects of a
              new era where hiring decisions are made with mathematical
              precision, ethical rigor, and human dignity. Every algorithm we
              build, every decision we enable, and every candidate we serve is
              guided by one unwavering principle:{" "}
              <strong>merit should be the only measure that matters.</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Link href="/contact">
                  Partner With Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/careers">
                  Join Our Mission
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Our Philosophy: The ProofOfFit Way
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We believe that hiring is not just a business process—it's a moral
              imperative. Every hiring decision shapes lives, builds
              communities, and determines the future of work. That's why we've
              built the world's first{" "}
              <strong>evidence-based hiring platform</strong>
              that combines the precision of advanced analytics with the wisdom
              of human judgment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
              <CardContent className="p-8">
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Eliminate Bias, Amplify Merit
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Our proprietary algorithms don't just detect bias—they
                  eliminate it at the source. We've mathematically proven that
                  talent knows no demographic boundaries, and our platform
                  ensures every candidate gets evaluated on their actual
                  capabilities.
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
                  We don't hide behind black boxes or proprietary secrets. Our
                  algorithms are open to scrutiny, our methodologies are
                  peer-reviewed, and every hiring decision comes with a complete
                  audit trail. We believe that trust is built through
                  transparency, not through secrecy.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/20">
              <CardContent className="p-8">
                <Rocket className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Scale Excellence, Preserve Humanity
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  We don't believe in replacing human judgment—we believe in
                  augmenting it. Our platform helps enterprises make better
                  decisions at scale while preserving the human touch that makes
                  great teams. Technology should enhance humanity, not replace
                  it.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Brand Values & Ethics */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Our Brand Values: The Ethical Foundation
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              At ProofOfFit, we don't just build software—we build the future of
              work. These values aren't just words on a wall; they're the
              mathematical principles that guide every algorithm, every
              decision, and every interaction.
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
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              The ProofOfFit Impact
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Numbers don't lie. Here's how we're transforming the hiring
              landscape, one evidence-based decision at a time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {stat.number}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {stat.label}
                  </h3>
                  <p className="text-sm text-slate-600">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Our Journey: From Vision to Reality
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Every great revolution starts with a single step. Here's how we're
              building the future of fair hiring, one milestone at a time.
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <Card key={index} className="border-l-4 border-l-blue-600">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="text-blue-600">{milestone.icon}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <Badge
                          variant="outline"
                          className="text-blue-600 border-blue-600"
                        >
                          {milestone.year}
                        </Badge>
                        <h3 className="text-xl font-semibold text-slate-900">
                          {milestone.title}
                        </h3>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Quote className="h-12 w-12 text-blue-600 mx-auto mb-6" />
          <blockquote className="text-2xl font-medium text-slate-900 mb-6">
            "ProofOfFit doesn't just talk about fairness—they prove it. Every
            algorithm, every decision, every outcome is backed by rigorous
            evidence. This is what the future of hiring looks like."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">JD</span>
            </div>
            <div className="text-left">
              <div className="font-semibold text-slate-900">
                Dr. Jennifer Davis
              </div>
              <div className="text-slate-600">
                Chief People Officer, Fortune 500 Company
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the movement toward evidence-based, bias-free hiring. Let's
            build a future where talent is the only thing that matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              <Link href="/demo">
                See It In Action
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Built with transparency in the Midwest
              </h3>
              <p className="text-slate-400">
                Crafted with fairness and accountability at heart
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                asChild
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <Link href="/privacy-policy">Privacy Policy</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <Link href="/terms-of-service">Terms of Service</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
