"use client"

import React from "react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Get in touch with our team. We&apos;ll get back to you soon.
          </p>
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <h2 className="text-2xl font-semibold mb-4">Enterprise Sales</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Ready to transform your hiring process? Contact our enterprise team.
            </p>
            <div className="space-y-4">
              <div>
                <strong>Email:</strong> enterprise@proofoffit.com
              </div>
              <div>
                <strong>Phone:</strong> +1 (555) 123-4567
              </div>
              <div>
                <strong>Hours:</strong> 9 AM - 6 PM CST, Mon-Fri
              </div>
            </div>
            <div className="mt-8">
              <a 
                href="mailto:enterprise@proofoffit.com" 
                className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Contact Sales Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}