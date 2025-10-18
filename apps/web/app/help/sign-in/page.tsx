import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In Help - ProofOfFit',
  description: 'Help with signing in to ProofOfFit platform',
};

export default function SignInHelpPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Sign In Help</h1>
      
      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Trouble Signing In?</h2>
          <p className="mb-4">
            If you&apos;re having trouble signing in to your ProofOfFit account, here are some 
            common solutions:
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Email Authentication</h2>
          <p className="mb-4">
            If you signed up with email, check your inbox for a magic link. Click the link 
            to sign in without a password.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">OAuth Providers</h2>
          <p className="mb-4">
            If you signed up with Google, Microsoft, or GitHub, make sure you&apos;re using the 
            same account you originally registered with.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Account Recovery</h2>
          <p className="mb-4">
            If you can&apos;t access your account, try the &quot;Forgot Password&quot; option or 
            contact our support team for assistance.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
          <p className="mb-4">
            Contact our support team at 
            <a href="mailto:support@proofoffit.com" className="text-blue-600 hover:underline">
              support@proofoffit.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
