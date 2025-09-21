import { Target, Proof } from "@prisma/client";

interface PortfolioLayoutProps {
  target: Target & {
    weights: Array<{
      proof: Proof;
      weight: number;
    }>;
  };
  proofs: Proof[];
}

export function PortfolioLayout({ target, proofs }: PortfolioLayoutProps) {
  const groupedProofs = proofs.reduce((acc, proof) => {
    if (!acc[proof.kind]) {
      acc[proof.kind] = [];
    }
    acc[proof.kind].push(proof);
    return acc;
  }, {} as Record<string, Proof[]>);

  return (
    <div className="max-w-6xl mx-auto p-8 print:p-4">
      <header className="mb-8 print:mb-4">
        <h1 className="text-4xl font-bold text-gray-900 print:text-3xl">
          {target.title}
        </h1>
        <p className="text-xl text-gray-600 print:text-lg">
          {target.role} {target.companyHint && `at ${target.companyHint}`}
        </p>
        <div className="mt-4 text-sm text-gray-500 print:text-xs">
          Portfolio • {new Date().toLocaleDateString()}
        </div>
      </header>

      <main className="space-y-12 print:space-y-8">
        {Object.entries(groupedProofs).map(([kind, kindProofs]) => (
          <section key={kind} className="page-break">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6 print:text-2xl capitalize">
              {kind.replace("_", " ")} Portfolio
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4">
              {kindProofs.map((proof) => (
                <div key={proof.id} className="bg-white border border-gray-200 rounded-lg p-6 print:border-gray-300 print:shadow-none">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2 print:text-base">
                      {proof.title}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 print:bg-gray-100 print:text-gray-800">
                      {proof.kind}
                    </span>
                  </div>
                  
                  {proof.summary && (
                    <p className="text-gray-600 mb-4 text-sm print:text-xs">
                      {proof.summary}
                    </p>
                  )}
                  
                  {proof.url && (
                    <div className="flex items-center text-sm text-blue-600 print:text-blue-800">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <a href={proof.url} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium">
                        View Project
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="mt-16 pt-8 border-t border-gray-200 print:mt-12 print:pt-6 print:border-gray-300">
        <div className="text-center text-sm text-gray-500 print:text-xs">
          <p className="font-medium">ProofOfFit Portfolio</p>
          <p className="mt-1">Evidence-based hiring intelligence • Every claim cites a receipt</p>
        </div>
      </footer>
    </div>
  );
}




