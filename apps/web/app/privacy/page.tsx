import type { Metadata } from 'next'
import { ShieldCheck, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy - ProofOfFit',
  description: 'ProofOfFit Privacy Policy - How we collect, use, and protect your data with enterprise-grade security.',
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Privacy Policy</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <div className="grid gap-8">
          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-semibold">Our Commitment to Privacy</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              ProofOfFit is built with privacy-first principles. We believe your professional data should be protected 
              with the same rigor as your personal information. This policy explains how we collect, use, and safeguard 
              your data when you use our hiring intelligence platform.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-6 w-6 text-sky-600" />
              <h2 className="text-xl font-semibold">Information We Collect</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Professional Information</h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                  <li>• Resume and CV data</li>
                  <li>• Professional profiles and portfolios</li>
                  <li>• Skills, experience, and education</li>
                  <li>• Job application preferences</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Account Information</h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                  <li>• Email address and authentication data</li>
                  <li>• Usage analytics and platform interactions</li>
                  <li>• Communication preferences</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-semibold">How We Use Your Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Core Services</h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                  <li>• Generate personalized Fit Reports and candidate slates</li>
                  <li>• Provide explainable AI recommendations</li>
                  <li>• Create audit trails for hiring decisions</li>
                  <li>• Improve matching algorithms and accuracy</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Platform Enhancement</h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                  <li>• Analyze usage patterns to improve user experience</li>
                  <li>• Develop new features and capabilities</li>
                  <li>• Ensure platform security and reliability</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-semibold">Data Protection & Security</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Enterprise-Grade Security</h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                  <li>• End-to-end encryption for data in transit and at rest</li>
                  <li>• SOC 2 Type II compliant infrastructure</li>
                  <li>• Regular security audits and penetration testing</li>
                  <li>• Access controls and audit logging</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Data Retention</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We retain your data only as long as necessary to provide our services and comply with legal obligations. 
                  Audit logs are maintained for 180 days. You can request data deletion at any time.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold">Your Rights & Controls</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Data Rights</h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                  <li>• Access and download your data</li>
                  <li>• Correct inaccurate information</li>
                  <li>• Delete your account and data</li>
                  <li>• Export your data in standard formats</li>
                  <li>• Opt out of non-essential communications</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">How to Exercise Your Rights</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Contact us at <a href="mailto:privacy@proofoffit.com" className="text-sky-600 hover:underline">privacy@proofoffit.com</a> 
                  or use the data controls in your account settings.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-amber-600" />
              <h2 className="text-xl font-semibold">Contact & Updates</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Questions About This Policy</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  If you have questions about this privacy policy or our data practices, please contact us at{' '}
                  <a href="mailto:privacy@proofoffit.com" className="text-sky-600 hover:underline">privacy@proofoffit.com</a>
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Policy Updates</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We may update this privacy policy from time to time. We will notify you of any material changes 
                  via email or through the platform. Continued use of our services constitutes acceptance of the updated policy.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
