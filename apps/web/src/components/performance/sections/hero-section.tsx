"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Check,
  Globe,
  Lock,
  Shield,
  Star,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";

interface HeroSectionProps {
  locale: string;
  translations: any;
}

export default function HeroSection(
  { locale, translations }: HeroSectionProps,
) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 mb-4">
          <Star className="h-3 w-3 mr-1" />
          Trusted by 500+ Companies
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          {translations.homepage?.hero?.title ||
            "Compliance-First Hiring OS for the Modern Enterprise"}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          {translations.homepage?.hero?.subtitle ||
            "Streamline your hiring process with AI-powered matching, compliance checks, and explainable slates. Reduce bias, save time, and hire the best talent."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/auth/signup?type=seeker"
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <UserCheck className="mr-2 h-5 w-5" />
            {translations.homepage?.hero?.seekingJob || "I am seeking a job"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/auth/signup?type=employer"
            className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-gray-700 text-lg font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            <Briefcase className="mr-2 h-5 w-5" />
            {translations.homepage?.hero?.hiring || "I am hiring"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <p className="text-sm text-gray-500 mb-8">
          No card • 2 minutes to first Fit Report
        </p>

        {/* Proof Signals */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-lg border max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">3.2×</div>
              <div className="text-sm text-gray-600">
                Average interview lift
              </div>
              <div className="text-xs text-gray-500">
                After 30 days on ProofOfFit
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">90s</div>
              <div className="text-sm text-gray-600">
                Time to tailored resume
              </div>
              <div className="text-xs text-gray-500">
                Expert-guided, human controlled
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                100%
              </div>
              <div className="text-sm text-gray-600">Audit-ready trails</div>
              <div className="text-xs text-gray-500">
                Cryptographically chained decisions
              </div>
            </div>
          </div>
        </div>

        {/* Live Fit Report Preview */}
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse">
              </div>
              <span className="text-sm font-medium text-gray-700">
                Fit Report
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                Live
              </span>
            </div>
            <div className="text-sm text-gray-500">Audit trail</div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-2">
                Candidate Match
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Technical Skills
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    95%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cultural Fit</span>
                  <span className="text-sm font-medium text-blue-600">88%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Experience Level
                  </span>
                  <span className="text-sm font-medium text-purple-600">
                    92%
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-2">
                Compliance Check
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">EEOC Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">
                    Audit Trail Complete
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
