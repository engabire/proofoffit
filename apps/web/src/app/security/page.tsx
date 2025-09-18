"use client"

import React from "react"
import {
  Shield,
  Lock,
  ShieldCheck,
  Eye,
  Server,
  Key,
  FileText,
  AlertTriangle,
  CheckCircle,
  Globe,
  Database,
  Users,
  Building2,
  Mail,
  Phone,
  ExternalLink,
  Award,
  Zap,
  Clock,
  Target,
  UserCheck,
  CloudLock,
  Fingerprint,
  Activity
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button
} from "@proof-of-fit/ui"

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Security & Trust</h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
            Enterprise-grade security, privacy, and compliance built into every layer of ProofOfFit. 
            Your data is protected by industry-leading standards and practices.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 space-y-16">
        
        {/* Security Overview */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Built with Security-First Principles
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              From architecture to deployment, every component is designed with enterprise security requirements in mind.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CloudLock className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-blue-900 dark:text-blue-100">Zero Trust Architecture</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  Every request is authenticated, authorized, and encrypted. No implicit trust assumptions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-green-600" />
                  <CardTitle className="text-green-900 dark:text-green-100">End-to-End Encryption</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-green-800 dark:text-green-200 text-sm">
                  AES-256 encryption in transit and at rest. TLS 1.3 for all communications.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Activity className="h-6 w-6 text-purple-600" />
                  <CardTitle className="text-purple-900 dark:text-purple-100">Continuous Monitoring</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-purple-800 dark:text-purple-200 text-sm">
                  24/7 threat detection, anomaly detection, and automated incident response.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Compliance & Certifications */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            Compliance & Certifications
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">SOC 2 Type II</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Certified</Badge>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  Annual security, availability, and confidentiality audits
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Globe className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">GDPR Compliant</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Compliant</Badge>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  Full EU data protection regulation compliance
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">ISO 27001</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  Information security management certification
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <UserCheck className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">CCPA Compliant</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Compliant</Badge>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  California Consumer Privacy Act compliance
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-50 dark:bg-slate-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Audit Reports & Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Our compliance reports and security documentation are available to enterprise customers under NDA.
              </p>
              <Button variant="outline" className="gap-2">
                <Mail className="h-4 w-4" />
                Request Documentation
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Data Protection */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            Data Protection & Privacy
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    Data Encryption
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">AES-256 encryption at rest</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">TLS 1.3 encryption in transit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Hardware Security Modules (HSM)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Key rotation every 90 days</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    Data Access Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Role-based access control (RBAC)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Multi-factor authentication required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Audit logs for all data access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Principle of least privilege</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-blue-600" />
                    Infrastructure Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">SOC 2 certified cloud infrastructure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Multi-region redundancy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Automated security patching</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Network segmentation</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Privacy by Design
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Data minimization principles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Automated data retention policies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Right to be forgotten compliance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Consent management system</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Security Operations */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            Security Operations
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-600" />
                  Threat Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li>• SIEM with ML-powered anomaly detection</li>
                  <li>• Real-time security monitoring</li>
                  <li>• Behavioral analysis and profiling</li>
                  <li>• Automated incident response</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-600" />
                  Incident Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li>• 24/7 security operations center</li>
                  <li>• <4 hour response time</li>
                  <li>• Dedicated incident response team</li>
                  <li>• Post-incident analysis and reporting</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Security Testing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li>• Quarterly penetration testing</li>
                  <li>• Continuous vulnerability scanning</li>
                  <li>• Code security reviews</li>
                  <li>• Third-party security assessments</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Business Continuity */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            Business Continuity & Disaster Recovery
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Availability & Uptime</CardTitle>
                <CardDescription>Enterprise-grade reliability guarantees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">SLA Uptime Guarantee</span>
                  <Badge className="bg-green-100 text-green-800">99.9%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Recovery Time Objective (RTO)</span>
                  <Badge variant="outline">< 4 hours</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Recovery Point Objective (RPO)</span>
                  <Badge variant="outline">< 1 hour</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Backup Frequency</span>
                  <Badge variant="outline">Every 15 minutes</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disaster Recovery</CardTitle>
                <CardDescription>Multi-region redundancy and failover</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Automated failover across regions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Real-time data replication</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Quarterly DR testing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Immutable backup storage</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Vulnerability Reporting */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            Security Contact & Vulnerability Reporting
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Report a Security Issue
                </CardTitle>
                <CardDescription>
                  Help us keep ProofOfFit secure by reporting vulnerabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  If you discover a security vulnerability, please report it to our security team immediately.
                </p>
                <div className="space-y-2">
                  <Button className="w-full gap-2" variant="outline">
                    <Mail className="h-4 w-4" />
                    security@proofoffit.com
                  </Button>
                  <p className="text-xs text-slate-500 text-center">
                    PGP Key: 0x1234567890ABCDEF
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  Responsible Disclosure
                </CardTitle>
                <CardDescription>
                  Our commitment to security researchers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Coordinated vulnerability disclosure</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Security researcher recognition</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Response within 24 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Bug bounty program (enterprise)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Enterprise Security Consultation
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
              Need more details about our security practices? Schedule a consultation with our security team 
              to discuss your specific requirements and compliance needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="gap-2">
                <Building2 className="h-4 w-4" />
                Schedule Security Review
              </Button>
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Download Security Whitepaper
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}