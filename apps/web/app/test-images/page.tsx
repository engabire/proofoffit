import Image from "next/image";

export default function TestImagesPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Test Page</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Next.js Image Component</h2>
          <Image
            src="/images/illustrations/job-matching.svg"
            alt="Job matching illustration"
            width={400}
            height={300}
            className="border"
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Regular img tag</h2>
          <img
            src="/images/illustrations/job-matching.svg"
            alt="Job matching illustration"
            width={400}
            height={300}
            className="border"
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Dashboard Preview</h2>
          <Image
            src="/images/illustrations/dashboard-preview.svg"
            alt="Dashboard preview"
            width={400}
            height={300}
            className="border"
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Trust Badges</h2>
          <Image
            src="/images/ui-elements/trust-badges.svg"
            alt="Trust badges"
            width={600}
            height={100}
            className="border"
          />
        </div>
      </div>
    </div>
  );
}
