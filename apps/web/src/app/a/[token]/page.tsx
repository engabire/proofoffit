import { notFound } from "next/navigation";

interface AuditPageProps {
  params: {
    token: string;
  };
}

export default function AuditPage({ params }: AuditPageProps) {
  // TODO: Implement audit page when auditLink and target models are available
  
  if (!params.token) {
    notFound();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Audit Link Coming Soon
        </h1>
        <p className="text-gray-600 mb-4">
          This feature is currently being developed.
        </p>
        <p className="text-sm text-gray-500">
          Token: {params.token.substring(0, 8)}...
        </p>
      </div>
    </div>
  );
}