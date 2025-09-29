import type { Metadata } from 'next'
import { Shield, Lock, Eye, Database, AlertTriangle, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Security - ProofOfFit',
  description: 'ProofOfFit Security - Enterprise-grade security measures and data protection for our hiring intelligence platform.',
}

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Security</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Enterprise-grade security for your most sensitive professional data
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <div className="grid gap-8">
          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-semibold">Security-First Architecture</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              ProofOfFit is built with security as a foundational principle, not an afterthought. 
              We implement enterprise-grade security measures to protect your professional data and ensure 
              the integrity of our hiring intelligence platform.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-slate-600 dark:text-slate-400">SOC 2 Type II Compliant</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-slate-600 dark:text-slate-400">End-to-End Encryption</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-slate-600 dark:text-slate-400">Zero-Trust Architecture</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-slate-600 dark:text-slate-400">Regular Security Audits</span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-6 w-6 text-sky-600" />
              <h2 className="text-xl font-semibold">Data Encryption</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Encryption in Transit</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  All data transmitted between your device and our servers is encrypted using TLS 1.3, 
                  the latest and most secure transport layer security protocol.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Encryption at Rest</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  All stored data is encrypted using AES-256, the industry standard for data encryption. 
                  Encryption keys are managed through a secure key management system.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Field-Level Encryption</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Sensitive fields such as personal information and professional data are encrypted 
                  at the database level for additional protection.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-semibold">Infrastructure Security</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Cloud Infrastructure</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We use enterprise-grade cloud infrastructure with built-in security controls, 
                  automated backups, and disaster recovery capabilities.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Network Security</h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                  <li>• Web Application Firewall (WAF) protection</li>
                  <li>• DDoS mitigation and traffic filtering</li>
                  <li>• Network segmentation and isolation</li>
                  <li>• Intrusion detection and prevention systems</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Access Controls</h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                  <li>• Multi-factor authentication (MFA) required</li>
                  <li>• Role-based access controls (RBAC)</li>
                  <li>• Principle of least privilege</li>
                  <li>• Regular access reviews and audits</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold">Monitoring & Auditing</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Comprehensive Logging</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  All system activities, user actions, and data access are logged and monitored. 
                  Audit logs are retained for 180 days and are tamper-evident.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Real-Time Monitoring</h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                  <li>• 24/7 security monitoring and alerting</li>
                  <li>• Automated threat detection and response</li>
                  <li>• Performance and availability monitoring</li>
                  <li>• Anomaly detection and behavioral analysis</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Compliance & Certifications</h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                  <li>• SOC 2 Type II compliance</li>
                  <li>• GDPR and CCPA compliance</li>
                  <li>• Regular third-party security assessments</li>
                  <li>• Penetration testing and vulnerability assessments</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
              <h2 className="text-xl font-semibold">Incident Response</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Response Plan</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  We maintain a comprehensive incident response plan that includes immediate containment, 
                  investigation, notification, and recovery procedures.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Notification Process</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  In the event of a security incident that may affect your data, we will notify affected 
                  users within 72 hours and provide regular updates throughout the investigation.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Reporting Security Issues</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  If you discover a security vulnerability, please report it to{' '}
                  <a href="mailto:security@proofoffit.com" className="text-sky-600 hover:underline">security@proofoffit.com</a>. 
                  We appreciate responsible disclosure and will work with you to address any issues.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-semibold">Your Security Responsibilities</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Account Security</h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                  <li>• Use strong, unique passwords</li>
                  <li>• Enable multi-factor authentication</li>
                  <li>• Keep your contact information up to date</li>
                  <li>• Log out from shared or public devices</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Data Protection</h3>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1 ml-4">
                  <li>• Only share your login credentials with authorized users</li>
                  <li>• Be cautious when accessing the platform from public networks</li>
                  <li>• Report any suspicious activity immediately</li>
                  <li>• Keep your devices and browsers updated</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}