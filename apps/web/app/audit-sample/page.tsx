"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@proof-of-fit/ui"
import { Shield, CheckCircle, AlertTriangle, Download, Copy } from "lucide-react"

export default function AuditSamplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Audit Sample
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Cryptographic audit trail for hiring decisions
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-600" />
                Audit Trail Sample
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium text-emerald-800 dark:text-emerald-200">
                      Decision Verified
                    </span>
                  </div>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    Hash: 0x1a2b3c4d5e6f7890abcdef1234567890abcdef12
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800 dark:text-blue-200">
                      Bias Check Passed
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    No protected attributes detected in decision process
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-800 dark:text-purple-200">
                      Compliance Verified
                    </span>
                  </div>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    EEOC and GDPR compliance confirmed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audit Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <pre className="text-sm text-slate-600 dark:text-slate-400">
{`{
  "auditId": "audit_2024_001",
  "timestamp": "2024-01-15T14:30:22.000Z",
  "decision": "CANDIDATE_APPROVED",
  "hash": "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
  "biasScore": 0.02,
  "compliance": "FULL",
  "verified": true
}`}
                  </pre>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      const reportData = {
                        auditId: "audit_2024_001",
                        timestamp: "2024-01-15T14:30:22.000Z",
                        decision: "CANDIDATE_APPROVED",
                        hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
                        biasScore: 0.02,
                        compliance: "FULL",
                        verified: true
                      };
                      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'audit-report-2024-001.json';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download Report
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText('0x1a2b3c4d5e6f7890abcdef1234567890abcdef12');
                      // You could add a toast notification here
                      alert('Hash copied to clipboard!');
                    }}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Hash
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}