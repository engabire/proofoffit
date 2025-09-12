import Link from 'next/link'

export default function SimpleDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">PF</span>
              </div>
              <span className="font-bold text-xl text-gray-900">ProofOfFit</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Demo Mode</span>
              <Link 
                href="/" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Back to Landing
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl font-bold text-gray-900">
            ProofOfFit.com Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of hiring with AI-powered matching, explainable results, and bias-free recruitment.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/demo/candidate"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>👤</span>
              <span>Try as Candidate</span>
            </Link>
            <Link 
              href="/demo/employer"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <span>🏢</span>
              <span>Try as Employer</span>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🎯</span>
              <h3 className="text-lg font-semibold text-gray-900">AI-Powered Matching</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Advanced algorithms match candidates to jobs with explainable fit scores
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Evidence-based matching</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Fit score explanations</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Strength identification</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">📄</span>
              <h3 className="text-lg font-semibold text-gray-900">Document Tailoring</h3>
            </div>
            <p className="text-gray-600 mb-4">
              AI generates tailored resumes and cover letters for each application
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Job-specific resumes</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Evidence citations</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Professional formatting</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🛡️</span>
              <h3 className="text-lg font-semibold text-gray-900">Compliance & Audit</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Built-in compliance checking and immutable audit trails
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Policy enforcement</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Audit trails</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Bias monitoring</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">👥</span>
              <h3 className="text-lg font-semibold text-gray-900">Candidate Slates</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Employers get ranked candidate recommendations with explanations
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Ranked recommendations</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Match explanations</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Audit URLs</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">⚡</span>
              <h3 className="text-lg font-semibold text-gray-900">Automation Engine</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Smart automation with human oversight and policy compliance
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Auto-apply decisions</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>CAPTCHA detection</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Prep-and-confirm flows</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">📊</span>
              <h3 className="text-lg font-semibold text-gray-900">Analytics & Insights</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Comprehensive analytics for both candidates and employers
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Application tracking</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Performance metrics</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Usage analytics</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Demo Sections */}
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Try the Demo</h2>
            <p className="text-gray-600 mb-8">
              Experience the key features of ProofOfFit.com
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Candidate Demo */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-green-200">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">👤</span>
                <h3 className="text-xl font-semibold text-green-800">Candidate Experience</h3>
              </div>
              <p className="text-gray-600 mb-6">
                See how candidates manage their profiles and find matching jobs
              </p>
              <div className="space-y-2 mb-6">
                <h4 className="font-medium text-gray-900">Features to explore:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Profile management with evidence bullets</li>
                  <li>• AI-powered job matching with fit scores</li>
                  <li>• Application tracking and status updates</li>
                  <li>• Resume tailoring and document generation</li>
                </ul>
              </div>
              <Link 
                href="/demo/candidate"
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Try Candidate Demo</span>
                <span>→</span>
              </Link>
            </div>

            {/* Employer Demo */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-blue-200">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🏢</span>
                <h3 className="text-xl font-semibold text-blue-800">Employer Experience</h3>
              </div>
              <p className="text-gray-600 mb-6">
                See how employers create job intakes and receive candidate slates
              </p>
              <div className="space-y-2 mb-6">
                <h4 className="font-medium text-gray-900">Features to explore:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Job intake creation with requirements</li>
                  <li>• AI-generated candidate slates</li>
                  <li>• Match explanations and audit trails</li>
                  <li>• Analytics and performance tracking</li>
                </ul>
              </div>
              <Link 
                href="/demo/employer"
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Try Employer Demo</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-16 bg-purple-50 border border-purple-200 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-purple-800 mb-4">Technical Architecture</h3>
          <p className="text-purple-600 mb-6">
            Built with modern technologies and best practices
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-purple-800 mb-2">Frontend</h4>
              <ul className="text-sm space-y-1 text-purple-700">
                <li>• Next.js 14 with App Router</li>
                <li>• React Server Components</li>
                <li>• Tailwind CSS + shadcn/ui</li>
                <li>• TypeScript for type safety</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-purple-800 mb-2">Backend</h4>
              <ul className="text-sm space-y-1 text-purple-700">
                <li>• Supabase (PostgreSQL + Auth)</li>
                <li>• Row-level security (RLS)</li>
                <li>• Immutable action logs</li>
                <li>• Multi-tenant architecture</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}