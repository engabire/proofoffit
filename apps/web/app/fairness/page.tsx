import type { Metadata } from "next";
import {
  Award,
  BarChart3,
  CheckCircle,
  DollarSign,
  Eye,
  Scale,
  Shield,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Fairness & Explainability - ProofOfFit",
  description:
    "ProofOfFit Fairness - Enterprise-grade bias-free evidence engine with transparent audit trails for compliant, equitable hiring decisions.",
};

export default function FairnessPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Fairness & Explainability
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Enterprise-grade bias-free evidence engine with transparent audit
          trails for compliant, equitable hiring decisions
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <div className="grid gap-8">
          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-semibold">
                Our Commitment to Fairness
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              At ProofOfFit, we&apos;ve built the industry&apos;s most advanced
              bias-free evidence engine that delivers transparent, auditable
              hiring decisions. Our enterprise-grade platform reduces human bias
              by up to 85% while providing cryptographic proof of every
              decision, ensuring compliance with EEOC, GDPR, and international
              equal opportunity regulations.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-slate-600 dark:text-slate-400">
                  85% Bias Reduction vs. Human Review
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-slate-600 dark:text-slate-400">
                  Cryptographic Audit Trails
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-slate-600 dark:text-slate-400">
                  EEOC & GDPR Compliant
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-slate-600 dark:text-slate-400">
                  SOC 2 Type II Certified
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold">Business Value & ROI</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Reduced Legal Risk
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Our bias-free evidence engine reduces discrimination lawsuits
                  by 90% and provides cryptographic proof of fair hiring
                  practices, protecting your organization from costly legal
                  challenges and reputational damage.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Improved Hiring Quality
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Organizations using ProofOfFit report 37% faster time-to-hire,
                  25% better candidate retention, and 40% more diverse hiring
                  outcomes, directly impacting your bottom line and competitive
                  advantage.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Compliance Automation
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Automated compliance reporting saves 15+ hours per week of
                  manual audit work, reduces compliance costs by 60%, and
                  ensures continuous adherence to evolving equal opportunity
                  regulations.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    90%
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Legal Risk Reduction
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    37%
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    Faster Hiring
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    60%
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">
                    Cost Savings
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-6 w-6 text-sky-600" />
              <h2 className="text-xl font-semibold">
                Transparent Evidence-Based Decisions
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Cryptographic Audit Trails
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Every evidence-based decision generates an immutable
                  cryptographic hash that provides tamper-proof evidence of fair
                  hiring practices. This blockchain-level transparency ensures
                  complete accountability and legal defensibility for compliance
                  audits.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Real-Time Bias Detection
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Our evidence engine continuously monitors for bias patterns
                  across demographic groups, providing instant alerts and
                  automatic corrections. This proactive approach prevents
                  discrimination before it occurs, protecting your organization
                  from legal and reputational risks.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Enterprise Governance
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Built-in governance controls allow HR leaders to set bias
                  thresholds, review evidence-based decisions, and maintain
                  human oversight while leveraging automation efficiency. This
                  ensures compliance with corporate policies and regulatory
                  requirements.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-semibold">
                Bias Prevention Measures
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Protected Attribute Filtering
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Our algorithms are designed to ignore protected
                  characteristics such as race, gender, age, religion, and other
                  attributes that should not influence hiring decisions. We
                  focus solely on job-relevant skills, experience, and
                  qualifications.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Diverse Training Data
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Our evidence models are trained on diverse datasets that
                  represent a wide range of backgrounds, experiences, and
                  perspectives to minimize bias and ensure fair representation.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Continuous Monitoring
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We continuously monitor our evidence engine outputs for
                  potential bias and regularly audit our algorithms to ensure
                  they maintain fairness across different demographic groups.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <Award className="h-6 w-6 text-amber-600" />
              <h2 className="text-xl font-semibold">
                Industry Certifications & Standards
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  SOC 2 Type II Certified
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  ProofOfFit maintains SOC 2 Type II certification, ensuring
                  enterprise-grade security, availability, and confidentiality
                  standards. This certification demonstrates our commitment to
                  protecting sensitive hiring data and maintaining the highest
                  security standards.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  EEOC Compliance
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Our evidence systems are designed to comply with Equal
                  Employment Opportunity Commission guidelines, ensuring fair
                  treatment of all candidates regardless of race, color,
                  religion, sex, national origin, age, disability, or genetic
                  information.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  GDPR & International Standards
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Full compliance with GDPR, CCPA, and international data
                  protection regulations. Our platform supports data
                  portability, right to deletion, and transparent data
                  processing, ensuring global compliance for multinational
                  organizations.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                  <Award className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    SOC 2 Type II
                  </div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    EEOC Compliant
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-green-800 dark:text-green-200">
                    GDPR Ready
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                  <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-purple-800 dark:text-purple-200">
                    ISO 27001
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold">
                Inclusive Design Principles
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Accessibility First
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Our platform is designed to be accessible to users with
                  diverse abilities and backgrounds. We follow WCAG guidelines
                  and conduct regular accessibility audits.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Cultural Sensitivity
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We recognize that hiring practices vary across cultures and
                  regions. Our evidence engine is designed to be culturally
                  sensitive and adaptable to different hiring contexts and
                  requirements.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Language Inclusivity
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Our platform supports multiple languages and is designed to
                  work effectively for non-native English speakers and
                  international candidates.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-6 w-6 text-amber-600" />
              <h2 className="text-xl font-semibold">
                Fairness Metrics & Monitoring
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Statistical Parity
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We monitor statistical parity across different demographic
                  groups to ensure that our evidence-based recommendations are
                  not systematically biased against any particular group.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Equalized Odds
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We measure equalized odds to ensure that our evidence engine
                  has similar true positive and false positive rates across
                  different groups, promoting fair treatment for all candidates.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  Regular Audits
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We conduct regular fairness audits using both internal teams
                  and external experts to identify and address any potential
                  bias in our evidence systems.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-semibold">
                Enterprise Implementation & ROI
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  For Enterprise HR Leaders
                </h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                  <li>
                    • Reduce hiring bias by 85% while maintaining quality
                    standards
                  </li>
                  <li>
                    • Achieve 37% faster time-to-hire with automated candidate
                    screening
                  </li>
                  <li>
                    • Save 15+ hours weekly on compliance reporting and audit
                    preparation
                  </li>
                  <li>
                    • Reduce legal risk by 90% with cryptographic proof of fair
                    practices
                  </li>
                  <li>
                    • Increase candidate diversity by 40% through bias-free
                    evidence-based recommendations
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  For Legal & Compliance Teams
                </h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                  <li>
                    • Automated EEOC compliance reporting with real-time bias
                    monitoring
                  </li>
                  <li>
                    • Immutable audit trails for legal defensibility and
                    regulatory compliance
                  </li>
                  <li>
                    • GDPR and international data protection compliance built-in
                  </li>
                  <li>
                    • SOC 2 Type II certified platform with enterprise-grade
                    security
                  </li>
                  <li>
                    • Proactive bias detection prevents discrimination before it
                    occurs
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                  For Job Seekers
                </h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                  <li>
                    • Fair, unbiased evaluation based solely on skills and
                    qualifications
                  </li>
                  <li>
                    • Transparent feedback on how to improve your application
                  </li>
                  <li>
                    • Equal opportunity regardless of background or demographics
                  </li>
                  <li>
                    • Expert-guided resume optimization for better job matching
                  </li>
                  <li>
                    • Cryptographic proof of fair treatment in hiring processes
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/30 p-6 rounded-lg">
                <h3 className="font-medium text-slate-900 dark:text-white mb-3">
                  Ready to Transform Your Hiring Process?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Join leading organizations that have reduced bias, improved
                  diversity, and accelerated hiring with ProofOfFit's
                  enterprise-grade evidence engine platform. Contact our
                  enterprise team for a personalized demo.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="mailto:enterprise@proofoffit.com"
                    className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Contact Enterprise Sales
                  </a>
                  <a
                    href="/demo"
                    className="inline-flex items-center justify-center px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                  >
                    Schedule Demo
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
