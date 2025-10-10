'use client'

import React from 'react'
import { Star } from 'lucide-react'

export default function TestimonialsSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">What our customers say</h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Hear from leading companies who have transformed their hiring with ProofOfFit.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-left">
            <Star className="h-5 w-5 text-yellow-500 mb-4" />
            <p className="text-gray-700 italic mb-4">"ProofOfFit has revolutionized our hiring process. The AI matching is incredibly accurate, and the compliance features give us peace of mind."</p>
            <p className="font-semibold text-gray-900">- Jane Doe, HR Director at Acme Corp</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-left">
            <Star className="h-5 w-5 text-yellow-500 mb-4" />
            <p className="text-gray-700 italic mb-4">"We've cut down our time-to-hire by 30% and significantly improved candidate quality. ProofOfFit is a game-changer!"</p>
            <p className="font-semibold text-gray-900">- John Smith, CEO of Global Tech</p>
          </div>
        </div>
      </div>
    </section>
  )
}
