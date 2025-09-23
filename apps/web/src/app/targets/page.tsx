// Commented out - target model doesn't exist in current schema
/*
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TargetsPage() {
  const userId = await requireUserId();

  const targets = await prisma.target.findMany({
    where: { userId },
    include: {
      weights: {
        include: {
          proof: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Targets</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Create New Target
        </button>
      </div>

      {targets.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">No targets yet</h2>
          <p className="text-gray-600 mb-6">
            Create your first target to start building your proof portfolio.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Create Your First Target
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {targets.map((target) => (
            <div key={target.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">{target.title}</h3>
              <p className="text-gray-600 mb-4">{target.role}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {target.weights.length} proofs
                </span>
                <button className="text-blue-600 hover:text-blue-800">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
*/

// Temporary placeholder
export default function TargetsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Targets</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Create New Target
        </button>
      </div>

      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">Targets Feature Coming Soon</h2>
        <p className="text-gray-600 mb-6">
          The targets feature is currently under development. Check back soon!
        </p>
      </div>
    </div>
  );
}