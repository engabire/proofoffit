import { Metadata } from "next";

export const metadata: Metadata = {
    title: "EEOC Compliance - ProofOfFit",
    description:
        "Equal Employment Opportunity Commission compliance information for ProofOfFit",
};

export default function EEOCPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">EEOC Compliance</h1>

            <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">
                        Equal Employment Opportunity
                    </h2>
                    <p className="mb-4">
                        ProofOfFit is committed to providing equal employment
                        opportunities to all individuals regardless of race,
                        color, religion, sex, national origin, age, disability,
                        or veteran status.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">
                        Non-Discrimination Policy
                    </h2>
                    <p className="mb-4">
                        We do not discriminate in employment practices,
                        including hiring, promotion, compensation, benefits, and
                        termination, based on any protected characteristic.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">
                        Reasonable Accommodation
                    </h2>
                    <p className="mb-4">
                        ProofOfFit provides reasonable accommodations to
                        qualified individuals with disabilities to enable them
                        to perform the essential functions of their positions.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">
                        Reporting Discrimination
                    </h2>
                    <p className="mb-4">
                        If you believe you have been subjected to
                        discrimination, please contact our HR department at
                        <a
                            href="mailto:hr@proofoffit.com"
                            className="text-blue-600 hover:underline"
                        >
                            hr@proofoffit.com
                        </a>
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">
                        Contact Information
                    </h2>
                    <p className="mb-4">
                        For questions about our EEOC compliance, please contact
                        us at
                        <a
                            href="mailto:compliance@proofoffit.com"
                            className="text-blue-600 hover:underline"
                        >
                            compliance@proofoffit.com
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
}
