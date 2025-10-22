import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Careers - ProofOfFit",
    description: "Join our team and help build the future of hiring.",
};

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Join Our Team
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        We&apos;re building the future of hiring. Come help us
                        make it happen.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">
                            Our Mission
                        </h3>
                        <p className="text-gray-600">
                            We&apos;re creating a compliance-first,
                            criteria-driven hiring OS that helps candidates
                            prove their fitness and employers make better
                            decisions.
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">
                            Our Values
                        </h3>
                        <p className="text-gray-600">
                            Transparency, fairness, and accountability are at
                            the heart of everything we do. We believe in
                            building tools that serve both candidates and
                            employers.
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Open Positions
                    </h2>
                    <p className="text-gray-600 mb-8">
                        We&apos;re always looking for talented people to join
                        our team. Check back soon for open positions.
                    </p>
                    <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto">
                        <p className="text-blue-800">
                            Don&apos;t see a position that fits? We&apos;d love
                            to hear from you anyway. Send us your resume and
                            tell us how you&apos;d like to contribute.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
