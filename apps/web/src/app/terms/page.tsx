import type { Metadata } from 'next'
import { Scale, FileText, AlertTriangle, Shield, Users, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service - ProofOfFit',
  description: 'ProofOfFit Terms of Service - Legal terms and conditions for using our hiring intelligence platform.',
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Terms of Service</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Last updated: {new Date().toLocaleDateString()}
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
              By accessing or using ProofOfFit ("the Service"), you agree to be bound by these Terms of Service 
              ("Terms"). If you disagree with any part of these terms, you may not access the Service.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-sky-600" />
              <h2 className="text-xl font-semibold">Service Description</h2>
            </div>
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                ProofOfFit provides AI-powered hiring intelligence services including:
              </p>
              <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                <li>• Personalized Fit Reports for job seekers</li>
                <li>• Ranked candidate slates for employers</li>
                <li>• Explainable AI recommendations with audit trails</li>
                <li>• Bias-reducing hiring insights and analytics</li>
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
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Account Security</h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                  <li>• Maintain the confidentiality of your account credentials</li>
                  <li>• Provide accurate and up-to-date information</li>
                  <li>• Notify us immediately of any unauthorized access</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Acceptable Use</h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                  <li>• Use the Service only for lawful purposes</li>
                  <li>• Respect intellectual property rights</li>
                  <li>• Do not attempt to reverse engineer or compromise the Service</li>
                  <li>• Do not use the Service to discriminate or violate equal opportunity laws</li>
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
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Our Rights</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  ProofOfFit and its original content, features, and functionality are owned by ProofOfFit Inc. 
                  and are protected by international copyright, trademark, and other intellectual property laws.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Your Content</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  You retain ownership of your professional data and content. By using the Service, you grant us 
                  a limited license to process your data to provide our services and improve our algorithms.
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
                ProofOfFit provides hiring intelligence and recommendations, but does not guarantee employment outcomes. 
                Users are responsible for their own hiring decisions and should use our insights as one factor among many.
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                To the maximum extent permitted by law, ProofOfFit shall not be liable for any indirect, incidental, 
                special, consequential, or punitive damages resulting from your use of the Service.
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
                We strive to maintain high service availability but cannot guarantee uninterrupted access. 
                We may temporarily suspend the Service for maintenance, updates, or security reasons.
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                We reserve the right to modify or discontinue the Service with reasonable notice to users.
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
                We may update these Terms from time to time. We will notify users of material changes via email 
                or through the platform. Continued use of the Service constitutes acceptance of the updated Terms.
              </p>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Contact Information</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Questions about these Terms? Contact us at{' '}
                  <a href="mailto:legal@proofoffit.com" className="text-sky-600 hover:underline">legal@proofoffit.com</a>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
