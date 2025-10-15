import type { Metadata } from 'next'
import { Scale, FileText, AlertTriangle, Shield, Users, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service - ProofOfFit',
  description: 'ProofOfFit Terms of Service - Professional terms for enterprise hiring intelligence with audit trails and compliance.',
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Terms of Service</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Professional terms for enterprise hiring intelligence • Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <div className="grid gap-8">
          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-semibold">Agreement to Terms</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Welcome to ProofOfFit, the enterprise-grade hiring intelligence platform that delivers explainable AI 
              with cryptographic audit trails. By accessing or using our Service, you agree to these professional 
              terms designed to support your business objectives while maintaining the highest standards of compliance and security.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-sky-600" />
              <h2 className="text-xl font-semibold">Service Description</h2>
            </div>
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                ProofOfFit delivers enterprise-grade hiring intelligence that transforms how organizations make talent decisions:
              </p>
              <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                <li>• <strong>Fit Reports:</strong> Personalized, evidence-based candidate assessments with transparent scoring</li>
                <li>• <strong>Candidate Slates:</strong> Ranked, explainable recommendations with bias-reducing algorithms</li>
                <li>• <strong>Audit Trails:</strong> Cryptographic proof of every hiring decision for compliance and transparency</li>
                <li>• <strong>Enterprise Analytics:</strong> Advanced insights to optimize hiring processes and reduce time-to-hire</li>
                <li>• <strong>Compliance Tools:</strong> Built-in governance features for SOC 2, GDPR, and equal opportunity compliance</li>
              </ul>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-semibold">User Responsibilities</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Enterprise Account Management</h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                  <li>• Maintain secure access controls and user management protocols</li>
                  <li>• Provide accurate organizational and contact information</li>
                  <li>• Implement appropriate data governance and retention policies</li>
                  <li>• Notify us immediately of any security incidents or unauthorized access</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Professional Use Standards</h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                  <li>• Use the Service for legitimate business hiring purposes only</li>
                  <li>• Comply with all applicable employment and equal opportunity laws</li>
                  <li>• Respect intellectual property rights and confidential information</li>
                  <li>• Maintain professional standards in all hiring decisions and communications</li>
                  <li>• Do not attempt to reverse engineer, compromise, or misuse our AI systems</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-semibold">Intellectual Property</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">ProofOfFit Intellectual Property</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  ProofOfFit&apos;s proprietary AI algorithms, platform features, and intellectual property are protected 
                  by international copyright, trademark, and patent laws. Our explainable AI technology and audit trail 
                  systems represent significant innovation in the hiring intelligence space.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Your Data & Content Rights</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  You maintain full ownership and control of your professional data, candidate information, and 
                  organizational content. We process your data solely to deliver our services and continuously 
                  improve our AI algorithms while maintaining strict confidentiality and security standards.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
              <h2 className="text-xl font-semibold">Limitation of Liability</h2>
            </div>
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                ProofOfFit provides advanced hiring intelligence and AI-powered recommendations to support your talent 
                acquisition decisions. While our platform delivers industry-leading accuracy and transparency, final 
                hiring decisions remain your responsibility. Our insights should be considered alongside your professional 
                judgment and organizational requirements.
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                We maintain enterprise-grade service levels and continuously improve our AI accuracy. However, to the 
                maximum extent permitted by law, ProofOfFit&apos;s liability is limited to the fees paid for the Service 
                in the 12 months preceding any claim.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold">Service Availability</h2>
            </div>
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                ProofOfFit maintains enterprise-grade service availability with 99.9% uptime targets. We provide 
                advance notice for scheduled maintenance and implement redundant systems to minimize service disruptions. 
                Emergency maintenance may be performed with immediate notification to affected users.
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                We continuously enhance our platform with new features and capabilities. Significant changes to core 
                functionality will be communicated with 30 days advance notice, and we provide migration support 
                to ensure smooth transitions.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-cyan-600" />
              <h2 className="text-xl font-semibold">Changes to Terms</h2>
            </div>
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                We may update these Terms to reflect new features, legal requirements, or business practices. 
                Material changes will be communicated via email with 30 days advance notice. Continued use of 
                the Service after the effective date constitutes acceptance of the updated Terms.
              </p>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Enterprise Support & Legal Inquiries</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  For enterprise customers, dedicated support is available through your account manager. 
                  General legal inquiries: <a href="mailto:legal@proofoffit.com" className="text-sky-600 hover:underline">legal@proofoffit.com</a>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
