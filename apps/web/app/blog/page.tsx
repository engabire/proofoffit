import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Blog - ProofOfFit",
    description: "Insights, updates, and thoughts on the future of hiring.",
};

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        ProofOfFit Blog
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Insights, updates, and thoughts on the future of hiring.
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-2">
                            Coming Soon: The Future of Hiring
                        </h3>
                        <p className="text-gray-600 mb-4">
                            We&apos;re working on some exciting content about
                            the future of hiring, compliance, and how AI can
                            help make the process more fair and transparent.
                        </p>
                        <div className="text-sm text-gray-500">
                            Stay tuned for our first blog post!
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-2">
                            Why We Built ProofOfFit
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Learn about our mission to create a more
                            transparent, fair, and efficient hiring process for
                            everyone involved.
                        </p>
                        <div className="text-sm text-gray-500">
                            Coming soon...
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-2">
                            Compliance in Hiring: What You Need to Know
                        </h3>
                        <p className="text-gray-600 mb-4">
                            A deep dive into hiring compliance requirements and
                            how to build systems that meet them from day one.
                        </p>
                        <div className="text-sm text-gray-500">
                            Coming soon...
                        </div>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <p className="text-gray-600">
                        Want to be notified when we publish new content?
                        <Link
                            href="/auth/signup"
                            className="text-blue-600 hover:text-blue-800 ml-1"
                        >
                            Sign up for updates
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
