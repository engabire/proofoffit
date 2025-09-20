import { Target, Proof } from "@prisma/client";

interface OnePagerLayoutProps {
  target: Target & {
    weights: Array<{
      proof: Proof;
      weight: number;
    }>;
  };
  proofs: Proof[];
}

export function OnePagerLayout({ target, proofs }: OnePagerLayoutProps) {
  const topProofs = proofs.slice(0, 6); // Show top 6 proofs for one-pager

  return (
    <div className="max-w-3xl mx-auto p-6 print:p-4 print:max-w-none">
      <header className="mb-6 print:mb-4">
        <h1 className="text-2xl font-bold text-gray-900 print:text-xl">
          {target.title}
        </h1>
        <p className="text-base text-gray-600 print:text-sm">
          {target.role} {target.companyHint && `at ${target.companyHint}`}
        </p>
      </header>

      <main className="space-y-6 print:space-y-4">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 print:text-base">
            Key Evidence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
            {topProofs.map((proof, index) => (
              <div key={proof.id} className="bg-gray-50 p-4 rounded-lg print:bg-white print:border">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 text-sm print:text-xs">
                    {proof.title}
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 print:bg-gray-100 print:text-gray-800">
                    {proof.kind}
                  </span>
                </div>
                
                {proof.summary && (
                  <p className="text-xs text-gray-600 mb-2 print:text-xs">
                    {proof.summary.length > 100 
                      ? `${proof.summary.substring(0, 100)}...`
                      : proof.summary
                    }
                  </p>
                )}
                
                {proof.url && (
                  <div className="flex items-center text-xs text-blue-600 print:text-blue-800">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <a href={proof.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      View
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {proofs.length > 6 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 print:text-base">
              Additional Evidence ({proofs.length - 6} more)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 print:grid-cols-3">
              {proofs.slice(6).map((proof) => (
                <div key={proof.id} className="text-xs text-gray-600 print:text-xs">
                  <div className="font-medium text-gray-900">{proof.title}</div>
                  <div className="text-gray-500 capitalize">{proof.kind}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="mt-8 pt-4 border-t border-gray-200 print:mt-6 print:pt-3 print:border-gray-300">
        <div className="text-center text-xs text-gray-500">
          <p>ProofOfFit Evidence Board • {new Date().toLocaleDateString()}</p>
        </div>
      </footer>
    </div>
  );
}


