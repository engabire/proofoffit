"use client"

import React, { useState } from "react"
import {
  Shield,
  Lock,
  FileText,
  CheckCircle,
  Download,
  ExternalLink,
  Eye,
  Calendar,
  Clock,
  User,
  Building2,
  Hash,
  Key,
  Fingerprint,
  Database,
  AlertTriangle,
  TrendingUp,
  Target,
  Users,
  Gavel,
  BarChart3,
  Layers,
  Copy,
  Verified,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  ScanLine,
  Globe,
  Award,
  BookOpen,
  Scale,
  Activity
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Input,
  Textarea,
  Alert,
  AlertDescription,
  Progress,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@proof-of-fit/ui"

interface AuditEntry {
  id: string
  timestamp: Date
  action: string
  user: string
  details: Record<string, any>
  hash: string
  previousHash: string
  signature: string
  verified: boolean
}

interface BiasAnalysis {
  detected: boolean
  factors: string[]
  mitigation: string[]
  confidence: number
  evidence: string[]
}

interface ComplianceReport {
  id: string
  type: 'SOC2' | 'GDPR' | 'EEOC' | 'ISO27001'
  status: 'compliant' | 'non-compliant' | 'partial'
  lastAudit: Date
  findings: string[]
  recommendations: string[]
  evidence: string[]
}

export default function AuditSamplePage() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [verificationResult, setVerificationResult] = useState<string | null>(null)
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)

  // Sample audit trail data
  const auditTrail: AuditEntry[] = [
    {
      id: "audit_2024_001_0001",
      timestamp: new Date("2024-01-15T14:30:22.000Z"),
      action: "CANDIDATE_EVALUATION_INITIATED",
      user: "system@proofoffit.com",
      details: {
        candidateId: "cand_abc123",
        jobPostingId: "job_xyz789",
        evaluatorId: "eval_def456",
        algorithm: "FitAnalysis_v2.3.1",
        datapoints: 47
      },
      hash: "0x8f4a2b9c3d1e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b",
      previousHash: "0x7e3a1b8c2d0e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
      signature: "RS256_signed_with_HSM_key_v3",
      verified: true
    },
    {
      id: "audit_2024_001_0002",
      timestamp: new Date("2024-01-15T14:30:45.000Z"),
      action: "BIAS_DETECTION_ANALYSIS",
      user: "bias-detector@proofoffit.com",
      details: {
        biasFactors: ["gender", "age", "ethnicity", "education_pedigree"],
        detectedBias: false,
        confidenceScore: 0.97,
        mitigationApplied: ["name_anonymization", "education_normalization"],
        auditFlags: []
      },
      hash: "0x9f5a3c0d4e2f6a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
      previousHash: "0x8f4a2b9c3d1e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b",
      signature: "RS256_signed_with_HSM_key_v3",
      verified: true
    },
    {
      id: "audit_2024_001_0003",
      timestamp: new Date("2024-01-15T14:31:12.000Z"),
      action: "SKILLS_MATCHING_COMPLETED",
      user: "ml-engine@proofoffit.com",
      details: {
        skillsMatched: 8,
        skillsTotal: 12,
        matchingScore: 0.83,
        algorithm: "SkillMatcher_v1.7.2",
        evidenceLinks: ["resume_section_2", "portfolio_project_3"],
        confidenceInterval: [0.78, 0.88]
      },
      hash: "0xa6b4c2e0f3a5b7c9d1e3f5a7b9c0d2e4f6a8b0c2d4e6f8a9b1c3d5e7f9a0b2c4d",
      previousHash: "0x9f5a3c0d4e2f6a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
      signature: "RS256_signed_with_HSM_key_v3",
      verified: true
    },
    {
      id: "audit_2024_001_0004",
      timestamp: new Date("2024-01-15T14:31:45.000Z"),
      action: "COMPLIANCE_CHECK_EXECUTED",
      user: "compliance@proofoffit.com",
      details: {
        frameworks: ["EEOC", "GDPR", "SOC2"],
        complianceStatus: "COMPLIANT",
        violations: [],
        riskScore: 0.02,
        mitigationActions: ["data_anonymization", "audit_trail_immutable"]
      },
      hash: "0xb7c5d3f1e4a6b8c0d2e4f6a8b0c2d4e6f8a9b1c3d5e7f9a0b2c4d6e8f0a1b3c5d",
      previousHash: "0xa6b4c2e0f3a5b7c9d1e3f5a7b9c0d2e4f6a8b0c2d4e6f8a9b1c3d5e7f9a0b2c4d",
      signature: "RS256_signed_with_HSM_key_v3",
      verified: true
    },
    {
      id: "audit_2024_001_0005",
      timestamp: new Date("2024-01-15T14:32:18.000Z"),
      action: "FIT_REPORT_GENERATED",
      user: "report-engine@proofoffit.com",
      details: {
        overallScore: 83,
        components: {
          skills: 0.83,
          experience: 0.78,
          culture: 0.89,
          growth: 0.85
        },
        reportFormat: "PDF_v2.1",
        auditURL: "https://audit.proofoffit.com/verify/audit_2024_001",
        expiryDate: "2025-01-15T14:32:18.000Z"
      },
      hash: "0xc8d6e4f2a5b7c9d1e3f5a7b9c0d2e4f6a8b0c2d4e6f8a9b1c3d5e7f9a0b2c4d6e",
      previousHash: "0xb7c5d3f1e4a6b8c0d2e4f6a8b0c2d4e6f8a9b1c3d5e7f9a0b2c4d6e8f0a1b3c5d",
      signature: "RS256_signed_with_HSM_key_v3",
      verified: true
    }
  ]

  const biasAnalysis: BiasAnalysis = {
    detected: false,
    factors: ["gender", "age", "ethnicity", "university_tier", "geographic_location"],
    mitigation: [
      "Name anonymization during initial screening",
      "Education institution normalization",
      "Geographic bias compensation",
      "Age-blind evaluation criteria",
      "Diverse algorithm training data"
    ],
    confidence: 0.97,
    evidence: [
      "Statistical parity analysis: p-value = 0.89",
      "Equalized odds verification: passed",
      "Demographic parity check: within 5% threshold",
      "Individual fairness test: 94% consistency"
    ]
  }

  const complianceReports: ComplianceReport[] = [
    {
      id: "SOC2_2024_Q1",
      type: "SOC2",
      status: "compliant",
      lastAudit: new Date("2024-01-10"),
      findings: [
        "Audit trail immutability verified",
        "Access controls properly implemented",
        "Data encryption standards exceeded"
      ],
      recommendations: [
        "Continue quarterly security reviews",
        "Enhance monitoring for API endpoints"
      ],
      evidence: [
        "Cryptographic hash verification: 100% success",
        "Access log analysis: no unauthorized access",
        "Encryption compliance: AES-256 verified"
      ]
    },
    {
      id: "GDPR_2024_Q1",
      type: "GDPR",
      status: "compliant",
      lastAudit: new Date("2024-01-12"),
      findings: [
        "Data minimization principles applied",
        "Right to be forgotten mechanism operational",
        "Consent management system verified"
      ],
      recommendations: [
        "Update privacy notices for clarity",
        "Conduct data mapping exercise"
      ],
      evidence: [
        "Data retention policy compliance: 100%",
        "Consent withdrawal system: operational",
        "Cross-border data transfer: lawful basis verified"
      ]
    },
    {
      id: "EEOC_2024_Q1",
      type: "EEOC",
      status: "compliant",
      lastAudit: new Date("2024-01-08"),
      findings: [
        "No adverse impact detected in hiring decisions",
        "Bias mitigation controls effective",
        "Equal opportunity reporting accurate"
      ],
      recommendations: [
        "Expand bias testing to include emerging factors",
        "Enhance training data diversity"
      ],
      evidence: [
        "4/5ths rule compliance: 94% pass rate",
        "Statistical significance tests: all passed",
        "Demographic representation: within expected ranges"
      ]
    }
  ]

  const verifyHash = (hash: string) => {
    // Simulate hash verification
    setVerificationResult(`✓ Hash ${hash.substring(0, 20)}... verified successfully`)
    setTimeout(() => setVerificationResult(null), 3000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadAuditReport = () => {
    // Create a mock PDF download
    const auditData = JSON.stringify({
      auditId: "audit_2024_001",
      timestamp: new Date().toISOString(),
      entries: auditTrail.length,
      verified: true,
      compliance: "FULL"
    }, null, 2)
    
    const blob = new Blob([auditData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'proofoffit_audit_sample_2024_001.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Layers className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Audit Trail Sample</h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
            Explore a real ProofOfFit audit trail demonstrating our immutable, cryptographically-verified 
            decision tracking system. Every hiring decision is transparent, auditable, and compliant.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Fully Compliant
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              <Shield className="h-3 w-3 mr-1" />
              Cryptographically Verified
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
              <Lock className="h-3 w-3 mr-1" />
              Immutable Record
            </Badge>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Total Entries</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{auditTrail.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Verification Status</p>
                  <p className="text-2xl font-bold text-green-600">100%</p>
                </div>
                <Verified className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Compliance Score</p>
                  <p className="text-2xl font-bold text-purple-600">AAA</p>
                </div>
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Bias Detection</p>
                  <p className="text-2xl font-bold text-emerald-600">0.0%</p>
                </div>
                <Scale className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="audit-trail">Audit Trail</TabsTrigger>
            <TabsTrigger value="bias-analysis">Bias Analysis</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Sample Case Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Sample Audit Case: Senior Software Engineer Position
                </CardTitle>
                <CardDescription>
                  This audit trail demonstrates a complete hiring decision workflow from initial evaluation to final report generation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Case Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Audit ID:</span>
                        <span className="font-mono">audit_2024_001</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Position:</span>
                        <span>Senior Software Engineer</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Company:</span>
                        <span>TechCorp Innovation</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Date:</span>
                        <span>January 15, 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Duration:</span>
                        <span>1 minute 56 seconds</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Outcome Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Overall Fit Score:</span>
                        <span className="font-semibold text-blue-600">83/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Bias Detection:</span>
                        <span className="text-green-600">✓ Clean</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Compliance Status:</span>
                        <span className="text-green-600">✓ Compliant</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Audit Verification:</span>
                        <span className="text-green-600">✓ Verified</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Report Generated:</span>
                        <span className="text-green-600">✓ Complete</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Decision Trail Highlights</h4>
                  <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                    <li>• Candidate evaluation initiated with 47 datapoints analyzed</li>
                    <li>• Bias detection performed across 5 protected characteristics - no bias detected</li>
                    <li>• Skills matching completed: 8/12 required skills matched (83% score)</li>
                    <li>• Compliance verification against EEOC, GDPR, and SOC2 standards</li>
                    <li>• Final fit report generated with cryptographic verification</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Key Features */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-blue-600" />
                    Cryptographic Integrity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    Every decision is cryptographically signed and chained, ensuring tamper-proof audit trails.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Hash Algorithm:</span>
                      <span className="font-mono">SHA-256</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Signature:</span>
                      <span className="font-mono">RS256 + HSM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chain Integrity:</span>
                      <span className="text-green-600">✓ Verified</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-purple-600" />
                    Bias-Free Decisions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    Advanced ML algorithms detect and mitigate bias across all protected characteristics.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Bias Confidence:</span>
                      <span className="text-green-600">97%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mitigation Applied:</span>
                      <span className="text-blue-600">5 methods</span>
                    </div>
                    <div className="flex justify-between">
                      <span>EEOC Compliance:</span>
                      <span className="text-green-600">✓ Passed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gavel className="h-5 w-5 text-emerald-600" />
                    Regulatory Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    Full compliance with SOC2, GDPR, EEOC, and industry-specific regulations.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>SOC2 Type II:</span>
                      <span className="text-green-600">✓ Compliant</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GDPR:</span>
                      <span className="text-green-600">✓ Compliant</span>
                    </div>
                    <div className="flex justify-between">
                      <span>EEOC:</span>
                      <span className="text-green-600">✓ Compliant</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audit-trail" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Complete Audit Trail
                  </span>
                  <Button variant="outline" onClick={downloadAuditReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Full Report
                  </Button>
                </CardTitle>
                <CardDescription>
                  Immutable, cryptographically-verified record of every decision made during the hiring process.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditTrail.map((entry, index) => (
                    <Collapsible key={entry.id}>
                      <CollapsibleTrigger asChild>
                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="text-sm font-mono text-slate-500">
                                  #{(index + 1).toString().padStart(3, '0')}
                                </div>
                                <div>
                                  <h4 className="font-semibold">{entry.action.replace(/_/g, ' ')}</h4>
                                  <p className="text-sm text-slate-600">
                                    {entry.timestamp.toLocaleString()} • {entry.user}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={entry.verified ? "default" : "destructive"}>
                                  {entry.verified ? (
                                    <>
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Verified
                                    </>
                                  ) : (
                                    <>
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                      Unverified
                                    </>
                                  )}
                                </Badge>
                                <ChevronDown className="h-4 w-4" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <Card className="mt-2 border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-semibold mb-2">Entry Details</h5>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-slate-600">Entry ID:</span>
                                    <span className="font-mono">{entry.id}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-600">Timestamp:</span>
                                    <span>{entry.timestamp.toISOString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-600">User:</span>
                                    <span>{entry.user}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h5 className="font-semibold mb-2">Cryptographic Verification</h5>
                                <div className="space-y-2">
                                  <div>
                                    <p className="text-xs text-slate-600">Current Hash:</p>
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                                        {entry.hash.substring(0, 32)}...
                                      </span>
                                      <Button 
                                        size="sm" 
                                        variant="ghost"
                                        onClick={() => verifyHash(entry.hash)}
                                      >
                                        <ScanLine className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-600">Previous Hash:</p>
                                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                                      {entry.previousHash.substring(0, 32)}...
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <h5 className="font-semibold mb-2">Detailed Data</h5>
                              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded text-xs">
                                <pre className="whitespace-pre-wrap">
                                  {JSON.stringify(entry.details, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>

                {verificationResult && (
                  <Alert className="mt-4">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{verificationResult}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bias-analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Bias Detection & Mitigation Analysis
                </CardTitle>
                <CardDescription>
                  Comprehensive analysis showing how bias is detected and mitigated throughout the evaluation process.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center p-8 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-center">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
                      No Bias Detected
                    </h3>
                    <p className="text-green-700 dark:text-green-300">
                      Confidence Score: {(biasAnalysis.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Protected Characteristics Analyzed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {biasAnalysis.factors.map((factor) => (
                          <div key={factor} className="flex items-center justify-between">
                            <span className="capitalize">{factor.replace(/_/g, ' ')}</span>
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Clean
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Mitigation Strategies Applied</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {biasAnalysis.mitigation.map((strategy, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{strategy}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Statistical Evidence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {biasAnalysis.evidence.map((evidence, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded">
                          <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
                          <span className="text-sm">{evidence}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Alert>
                  <Scale className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Fairness Guarantee:</strong> Our algorithms are continuously tested against bias using 
                    multiple fairness metrics including statistical parity, equalized odds, and individual fairness. 
                    All evaluations undergo real-time bias detection with 97%+ confidence.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {complianceReports.map((report) => (
                <Card key={report.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{report.type}</span>
                      <Badge 
                        className={
                          report.status === 'compliant' 
                            ? 'bg-green-100 text-green-800'
                            : report.status === 'partial'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {report.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Last audit: {report.lastAudit.toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Key Findings</h4>
                        <ul className="space-y-1">
                          {report.findings.map((finding, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                              {finding}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Evidence</h4>
                        <ul className="space-y-1">
                          {report.evidence.slice(0, 2).map((evidence, index) => (
                            <li key={index} className="text-xs text-slate-600">
                              • {evidence}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Dashboard</CardTitle>
                <CardDescription>
                  Real-time compliance monitoring across all regulatory frameworks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Compliance Scores</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">SOC 2 Type II</span>
                          <span className="text-sm font-semibold">98%</span>
                        </div>
                        <Progress value={98} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">GDPR</span>
                          <span className="text-sm font-semibold">96%</span>
                        </div>
                        <Progress value={96} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">EEOC</span>
                          <span className="text-sm font-semibold">94%</span>
                        </div>
                        <Progress value={94} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">ISO 27001</span>
                          <span className="text-sm font-semibold">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-4">Risk Assessment</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded">
                        <span className="text-sm">Data Protection Risk</span>
                        <Badge className="bg-green-100 text-green-800">Low</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded">
                        <span className="text-sm">Bias Detection Risk</span>
                        <Badge className="bg-green-100 text-green-800">Low</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded">
                        <span className="text-sm">Regulatory Change Risk</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded">
                        <span className="text-sm">Audit Trail Risk</span>
                        <Badge className="bg-green-100 text-green-800">Low</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fingerprint className="h-5 w-5" />
                  Cryptographic Verification Tools
                </CardTitle>
                <CardDescription>
                  Verify the integrity and authenticity of any ProofOfFit audit record
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Hash Verification</h4>
                    <div className="space-y-3">
                      <Input 
                        placeholder="Enter hash to verify..."
                        className="font-mono text-sm"
                      />
                      <Button className="w-full">
                        <ScanLine className="h-4 w-4 mr-2" />
                        Verify Hash
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Digital Signature Verification</h4>
                    <div className="space-y-3">
                      <Input 
                        placeholder="Enter signature to verify..."
                        className="font-mono text-sm"
                      />
                      <Button className="w-full">
                        <Key className="h-4 w-4 mr-2" />
                        Verify Signature
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">Verification Methods</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <Hash className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h5 className="font-semibold">SHA-256 Hashing</h5>
                      <p className="text-sm text-slate-600">Cryptographic integrity verification</p>
                    </div>
                    <div className="text-center">
                      <Key className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <h5 className="font-semibold">RSA-256 Signatures</h5>
                      <p className="text-sm text-slate-600">Digital authenticity verification</p>
                    </div>
                    <div className="text-center">
                      <Database className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h5 className="font-semibold">Blockchain Anchoring</h5>
                      <p className="text-sm text-slate-600">Immutable timestamp verification</p>
                    </div>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Public Verification API</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 mb-4">
                      Programmatically verify any ProofOfFit audit record using our public API endpoint:
                    </p>
                    <div className="bg-slate-900 text-green-400 p-4 rounded font-mono text-sm">
                      <div>POST https://api.proofoffit.com/v1/verify</div>
                      <div className="mt-2">{"{"}</div>
                      <div>  "audit_id": "audit_2024_001",</div>
                      <div>  "hash": "0x8f4a2b9c...",</div>
                      <div>  "signature": "RS256_signed..."</div>
                      <div>{"}"}</div>
                    </div>
                    <Button className="mt-4" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View API Documentation
                    </Button>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <Button size="lg" onClick={downloadAuditReport}>
            <Download className="h-5 w-5 mr-2" />
            Download Complete Audit Report
          </Button>
          <Button size="lg" variant="outline">
            <ExternalLink className="h-5 w-5 mr-2" />
            Schedule Audit Demo
          </Button>
          <Button size="lg" variant="outline">
            <BookOpen className="h-5 w-5 mr-2" />
            View Documentation
          </Button>
        </div>
      </div>
    </div>
  )
}