import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sponsor ProofOfFit Pro',
  description: 'Gift months of ProofOfFit Pro to support a job seeker.',
}

export default function GiftPage() {
  // Temporarily disabled for deployment
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col gap-8 px-4 py-8 md:py-16">
      <h1 className="text-3xl font-bold">Gift Page</h1>
      <p>This page is temporarily disabled for deployment.</p>
    </div>
  )
}

// Original page code temporarily disabled for deployment
// TODO: Re-enable after fixing displayName issues