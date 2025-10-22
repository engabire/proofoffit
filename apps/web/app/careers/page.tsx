import { Metadata } from "next";
import Link from "next/link";
import { 
    Brain, 
    Shield, 
    Users, 
    Zap, 
    Target, 
    CheckCircle, 
    ArrowRight, 
    Star,
    Globe,
    Heart,
    Lightbulb,
    Award,
    Clock,
    Mail,
    MapPin,
    DollarSign,
    BookOpen,
    Code,
    BarChart3,
    MessageSquare,
    Briefcase
} from "lucide-react";

export const metadata: Metadata = {
    title: "Careers - ProofOfFit",
    description: "Join our mission to revolutionize hiring through evidence-based matching and ethical AI. We're building the future of work.",
};

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Hero Section */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Build the Future of
                            <span className="text-blue-600"> Hiring</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                            Join a mission-driven team building the world's first evidence-based hiring platform. 
                            We're creating technology that eliminates bias, ensures transparency, and helps people 
                            find their perfect career matches.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="#open-positions"
                                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                View Open Positions
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                href="#our-process"
                                className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-600 text-blue-600 text-lg font-medium rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                            >
                                Our Hiring Process
                            </Link>
                        </div>
                    </div>

                    {/* Mission & Vision */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 border border-blue-200">
                            <div className="flex items-center mb-4">
                                <Target className="h-8 w-8 text-blue-600 mr-3" />
                                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                            </div>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                To eliminate bias in hiring through evidence-based matching, creating a world where 
                                talent is recognized regardless of background, and every hiring decision is transparent, 
                                auditable, and fair.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-8 border border-green-200">
                            <div className="flex items-center mb-4">
                                <Lightbulb className="h-8 w-8 text-green-600 mr-3" />
                                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                            </div>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                A future where hiring is purely merit-based, where candidates can prove their fit 
                                with concrete evidence, and where employers make decisions backed by data, not bias.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            These principles guide everything we do, from our hiring process to our product development.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Transparency First</h3>
                            <p className="text-gray-600">
                                Every algorithm is explainable, every decision is auditable, and every process is open to scrutiny.
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Human-Centered</h3>
                            <p className="text-gray-600">
                                Technology should augment human judgment, not replace it. We build tools that serve people.
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Brain className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Evidence-Based</h3>
                            <p className="text-gray-600">
                                Every claim is backed by data, every decision is supported by evidence, every outcome is measurable.
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="h-8 w-8 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Inclusive Excellence</h3>
                            <p className="text-gray-600">
                                We believe the best teams are diverse teams. Excellence comes from different perspectives.
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Zap className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Bias Elimination</h3>
                            <p className="text-gray-600">
                                We don't just detect bias—we eliminate it at the source through careful design and constant vigilance.
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Globe className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Global Impact</h3>
                            <p className="text-gray-600">
                                We're building technology that can transform hiring practices worldwide, creating opportunity for all.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Process Section */}
            <section id="our-process" className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Hiring Process</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Inspired by the best practices of Anthropic, OpenAI, and Y Combinator, 
                            our process is designed to find exceptional people who share our mission.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                1
                            </div>
                            <h3 className="text-lg font-semibold mb-3">Application Review</h3>
                            <p className="text-gray-600 text-sm">
                                We review every application carefully, looking for mission alignment, 
                                exceptional skills, and growth potential.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                2
                            </div>
                            <h3 className="text-lg font-semibold mb-3">Initial Interview</h3>
                            <p className="text-gray-600 text-sm">
                                A 30-minute conversation to discuss your background, interests, 
                                and how you'd contribute to our mission.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                3
                            </div>
                            <h3 className="text-lg font-semibold mb-3">Technical Assessment</h3>
                            <p className="text-gray-600 text-sm">
                                Role-specific challenges that test your skills in a real-world context, 
                                not just theoretical knowledge.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                4
                            </div>
                            <h3 className="text-lg font-semibold mb-3">Team Interviews</h3>
                            <p className="text-gray-600 text-sm">
                                Meet with potential teammates to assess cultural fit, 
                                collaboration skills, and shared values.
                            </p>
                        </div>
                    </div>

                    <div className="mt-16 bg-white rounded-xl p-8 border border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">What We Look For</h3>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-lg font-semibold mb-4 text-blue-600">Technical Excellence</h4>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        Deep expertise in your domain
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        Ability to learn and adapt quickly
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        Strong problem-solving skills
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        Experience with complex systems
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-4 text-green-600">Mission Alignment</h4>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        Passion for fair hiring practices
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        Commitment to transparency
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        Desire to make a positive impact
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        Long-term thinking and vision
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Open Positions Section */}
            <section id="open-positions" className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Open Positions</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            We're looking for exceptional people to join our mission. 
                            Each role is critical to building the future of hiring.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* Senior Full-Stack Engineer */}
                        <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Senior Full-Stack Engineer</h3>
                                    <div className="flex items-center text-gray-600 mb-4">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        <span className="text-sm">Remote / San Francisco</span>
                                    </div>
                                </div>
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    Full-time
                                </span>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Build the core platform that powers evidence-based hiring. You'll work on everything 
                                from our matching algorithms to our user interfaces.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">React</span>
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">TypeScript</span>
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Node.js</span>
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">PostgreSQL</span>
                            </div>
                            <Link
                                href="/auth/signup?type=candidate&role=senior-engineer"
                                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Apply Now
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </div>

                        {/* AI/ML Engineer */}
                        <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">AI/ML Engineer</h3>
                                    <div className="flex items-center text-gray-600 mb-4">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        <span className="text-sm">Remote / San Francisco</span>
                                    </div>
                                </div>
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    Full-time
                                </span>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Develop and improve our bias-detection algorithms and matching systems. 
                                Help us build AI that truly serves human potential.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Python</span>
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">TensorFlow</span>
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">PyTorch</span>
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">MLOps</span>
                            </div>
                            <Link
                                href="/auth/signup?type=candidate&role=ml-engineer"
                                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Apply Now
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </div>

                        {/* Product Manager */}
                        <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Senior Product Manager</h3>
                                    <div className="flex items-center text-gray-600 mb-4">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        <span className="text-sm">Remote / San Francisco</span>
                                    </div>
                                </div>
                                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    Full-time
                                </span>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Lead product strategy for our hiring platform. Work with engineering, design, 
                                and customers to build features that eliminate bias and improve outcomes.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Strategy</span>
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Analytics</span>
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">User Research</span>
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">B2B SaaS</span>
                            </div>
                            <Link
                                href="/auth/signup?type=candidate&role=product-manager"
                                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Apply Now
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </div>

                        {/* UX Designer */}
                        <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Senior UX Designer</h3>
                                    <div className="flex items-center text-gray-600 mb-4">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        <span className="text-sm">Remote / San Francisco</span>
                                    </div>
                                </div>
                                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    Full-time
                                </span>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Design interfaces that make complex hiring data accessible and actionable. 
                                Create experiences that build trust and transparency.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Figma</span>
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Research</span>
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Prototyping</span>
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Accessibility</span>
                            </div>
                            <Link
                                href="/auth/signup?type=candidate&role=ux-designer"
                                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Apply Now
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* General Application */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Don't See Your Role?</h3>
                            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                                We're always looking for exceptional people who share our mission. 
                                If you're passionate about fair hiring and want to make a difference, 
                                we'd love to hear from you.
                            </p>
                            <Link
                                href="/auth/signup?type=candidate&role=general"
                                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Send Us Your Resume
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits & Culture */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Join ProofOfFit?</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            We offer more than just a job—we offer a chance to be part of something meaningful.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <DollarSign className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3">Competitive Compensation</h3>
                            <p className="text-gray-600 text-sm">
                                Top-of-market salaries, equity participation, and performance bonuses 
                                that reflect your contribution to our mission.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <Heart className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3">Health & Wellness</h3>
                            <p className="text-gray-600 text-sm">
                                Comprehensive health, dental, and vision coverage, plus mental health support 
                                and wellness stipends.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <BookOpen className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3">Learning & Growth</h3>
                            <p className="text-gray-600 text-sm">
                                Annual learning budget, conference attendance, mentorship programs, 
                                and opportunities to work with cutting-edge technology.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                <Clock className="h-6 w-6 text-orange-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3">Flexible Work</h3>
                            <p className="text-gray-600 text-sm">
                                Remote-first culture with flexible hours, unlimited PTO, 
                                and the freedom to work from anywhere.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                                <Users className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3">Inclusive Culture</h3>
                            <p className="text-gray-600 text-sm">
                                Diverse team from around the world, inclusive policies, 
                                and a culture that celebrates different perspectives.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                <Award className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3">Mission Impact</h3>
                            <p className="text-gray-600 text-sm">
                                Work on technology that's changing how the world hires, 
                                creating opportunities for millions of people.
                            </p>
                        </div>
                    </div>

                    {/* Team Stats */}
                    <div className="bg-white rounded-xl p-8 border border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Team</h3>
                        <div className="grid md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
                                <div className="text-gray-600">Team Members</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-green-600 mb-2">8</div>
                                <div className="text-gray-600">Countries</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-purple-600 mb-2">50%</div>
                                <div className="text-gray-600">Women</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
                                <div className="text-gray-600">Mission-Driven</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-blue-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Ready to Change the Future of Hiring?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join a team that's building technology to eliminate bias, ensure fairness, 
                        and create opportunities for everyone.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/auth/signup?type=candidate&role=general"
                            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 text-lg font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Apply Now
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white text-lg font-medium rounded-lg hover:bg-white hover:text-blue-600 transition-all"
                        >
                            Get in Touch
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
