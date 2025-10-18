import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help for Candidates - ProofOfFit',
  description: 'Help and support information for job candidates using ProofOfFit',
};

export default function HelpCandidatesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Help for Candidates</h1>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <p className="mb-4">
            Welcome to ProofOfFit! This guide will help you get started with creating your profile 
            and finding the right job opportunities.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Creating Your Profile</h2>
          <p className="mb-4">
            To get started, create your candidate profile by providing your work experience, 
            skills, and career preferences. This helps us match you with relevant opportunities.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Job Matching</h2>
          <p className="mb-4">
            Our AI-powered matching system analyzes your profile and matches you with jobs 
            that align with your skills and career goals.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Application Process</h2>
          <p className="mb-4">
            When you find a job you&apos;re interested in, you can apply directly through our platform. 
            We&apos;ll help you prepare your application materials.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Need More Help?</h2>
          <p className="mb-4">
            If you have additional questions, please contact our support team at 
            <a href="mailto:support@proofoffit.com" className="text-blue-600 hover:underline">
              support@proofoffit.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
