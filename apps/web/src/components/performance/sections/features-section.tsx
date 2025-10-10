'use client'

import React from 'react'
import { Shield, Zap, Users } from 'lucide-react'

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Features that empower your hiring</h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          ProofOfFit provides a comprehensive suite of tools designed to make hiring fair, efficient, and effective.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-100">
            <Shield className="h-10 w-10 text-blue-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Compliance-First Design</h3>
            <p className="text-gray-600">Ensure every hire meets regulatory standards with built-in compliance checks and audit trails.</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-100">
            <Zap className="h-10 w-10 text-indigo-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Matching</h3>
            <p className="text-gray-600">Intelligently match candidates to roles, reducing bias and improving fit with advanced algorithms.</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-100">
            <Users className="h-10 w-10 text-green-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Explainable Slates</h3>
            <p className="text-gray-600">Understand why candidates are ranked the way they are with transparent, data-driven insights.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
