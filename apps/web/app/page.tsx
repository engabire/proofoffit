import React from "react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to ProofOfFit
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          A compliance-first, criteria-driven hiring OS
        </p>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Site is working! This is a minimal test page.
          </p>
          <a 
            href="/api/health" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Check API Health
          </a>
        </div>
      </div>
    </div>
  );
}
