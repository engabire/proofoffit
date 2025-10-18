import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - ProofOfFit',
  description: 'Terms of service for ProofOfFit platform',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using ProofOfFit, you accept and agree to be bound by the terms 
            and provision of this agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Use License</h2>
          <p className="mb-4">
            Permission is granted to temporarily download one copy of ProofOfFit for personal, 
            non-commercial transitory viewing only.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
          <p className="mb-4">
            The materials on ProofOfFit are provided on an 'as is' basis. ProofOfFit makes no 
            warranties, expressed or implied, and hereby disclaims and negates all other warranties.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Limitations</h2>
          <p className="mb-4">
            In no event shall ProofOfFit or its suppliers be liable for any damages arising out 
            of the use or inability to use the materials on ProofOfFit.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p className="mb-4">
            If you have any questions about these Terms of Service, please contact us at 
            <a href="mailto:legal@proofoffit.com" className="text-blue-600 hover:underline">
              legal@proofoffit.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
