import type { Metadata } from 'next'
import { Scale, Eye, Shield, Users, Target, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Fairness & Explainability - ProofOfFit',
  description: 'ProofOfFit Fairness - Our commitment to bias-free, explainable AI for equitable hiring decisions.',
}

export default function FairnessPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Fairness & Explainability</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Building AI that promotes equity and transparency in hiring
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <div className="grid gap-8">
          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-semibold">Our Commitment to Fairness</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              At ProofOfFit, we believe that AI should be a force for equity in hiring, not a source of bias. 
              Our platform is designed to reduce human bias while providing transparent, explainable recommendations 
              that help create more inclusive and fair hiring processes.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-slate-600 dark:text-slate-400">Bias Detection & Mitigation</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-slate-600 dark:text-slate-400">Explainable AI Decisions</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-slate-600 dark:text-slate-400">Diverse Training Data</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-slate-600 dark:text-slate-400">Regular Fairness Audits</span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-6 w-6 text-sky-600" />
              <h2 className="text-xl font-semibold">Transparent AI Decisions</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Explainable Recommendations</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Every recommendation we make comes with a clear explanation of why it was generated. 
                  You can see exactly which factors contributed to a candidate's fit score and how different 
                  criteria were weighted in the decision.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Audit Trails</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  All AI decisions are logged with complete audit trails, including the data inputs, 
                  processing steps, and reasoning behind each recommendation. This ensures accountability 
                  and enables review of decision-making processes.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Human Oversight</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Our AI augments human decision-making rather than replacing it. We provide insights 
                  and recommendations, but final hiring decisions remain with human recruiters and hiring managers.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-semibold">Bias Prevention Measures</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Protected Attribute Filtering</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Our algorithms are designed to ignore protected characteristics such as race, gender, 
                  age, religion, and other attributes that should not influence hiring decisions. 
                  We focus solely on job-relevant skills, experience, and qualifications.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Diverse Training Data</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Our AI models are trained on diverse datasets that represent a wide range of backgrounds, 
                  experiences, and perspectives to minimize bias and ensure fair representation.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Continuous Monitoring</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We continuously monitor our AI outputs for potential bias and regularly audit our 
                  algorithms to ensure they maintain fairness across different demographic groups.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold">Inclusive Design Principles</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Accessibility First</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Our platform is designed to be accessible to users with diverse abilities and backgrounds. 
                  We follow WCAG guidelines and conduct regular accessibility audits.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Cultural Sensitivity</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We recognize that hiring practices vary across cultures and regions. Our AI is designed 
                  to be culturally sensitive and adaptable to different hiring contexts and requirements.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Language Inclusivity</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Our platform supports multiple languages and is designed to work effectively for 
                  non-native English speakers and international candidates.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-6 w-6 text-amber-600" />
              <h2 className="text-xl font-semibold">Fairness Metrics & Monitoring</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Statistical Parity</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We monitor statistical parity across different demographic groups to ensure that 
                  our AI recommendations are not systematically biased against any particular group.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Equalized Odds</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We measure equalized odds to ensure that our AI has similar true positive and 
                  false positive rates across different groups, promoting fair treatment for all candidates.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Regular Audits</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We conduct regular fairness audits using both internal teams and external experts 
                  to identify and address any potential bias in our AI systems.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-semibold">Your Role in Fair Hiring</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">For Employers</h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                  <li>• Review AI recommendations with human judgment</li>
                  <li>• Ensure job requirements are truly necessary</li>
                  <li>• Consider diverse perspectives in hiring decisions</li>
                  <li>• Provide feedback on AI recommendations</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">For Job Seekers</h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                  <li>• Focus on highlighting relevant skills and experience</li>
                  <li>• Provide clear, specific examples of your achievements</li>
                  <li>• Use our platform to understand what employers value</li>
                  <li>• Report any concerns about bias or unfair treatment</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Feedback & Reporting</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We encourage users to report any concerns about bias or unfair treatment. 
                  Contact us at{' '}
                  <a href="mailto:fairness@proofoffit.com" className="text-sky-600 hover:underline">fairness@proofoffit.com</a>{' '}
                  to share feedback or report issues.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
