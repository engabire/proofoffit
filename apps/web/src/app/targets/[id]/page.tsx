// Commented out - target model doesn't exist in current schema
/*
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { notFound } from "next/navigation";

interface TargetPageProps {
  params: { id: string };
}

export default async function TargetPage({ params }: TargetPageProps) {
  const userId = await requireUserId();
  const { id } = params;

  const target = await prisma.target.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      weights: {
        include: {
          proof: true,
        },
      },
    },
  });

  if (!target) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{target.title}</h1>
        <p className="text-gray-600">{target.role}</p>
        {target.companyHint && (
          <p className="text-sm text-gray-500 mt-1">
            Target company: {target.companyHint}
          </p>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Proofs</h2>
          {target.weights.length === 0 ? (
            <p className="text-gray-600">No proofs added yet.</p>
          ) : (
            <div className="space-y-4">
              {target.weights.map((weight) => (
                <div key={weight.id} className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-semibold">{weight.proof.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {weight.proof.summary}
                  </p>
                  <div className="mt-2">
                    <span className="text-sm text-gray-500">
                      Weight: {weight.weight}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Rubric</h2>
          <div className="bg-white rounded-lg shadow-md p-4">
            <pre className="text-sm text-gray-600 whitespace-pre-wrap">
              {JSON.stringify(target.rubricJson, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
*/

// Temporary placeholder
interface TargetPageProps {
  params: { id: string };
}

export default function TargetPage({ params }: TargetPageProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Target Details</h1>
        <p className="text-gray-600">Target ID: {params.id}</p>
      </div>

      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">Target Feature Coming Soon</h2>
        <p className="text-gray-600 mb-6">
          The target details feature is currently under development. Check back soon!
        </p>
      </div>
    </div>
  );
}