"use client"

import React, { useState } from "react"
import {
  Users,
  Heart,
  Award,
  Target,
  Globe,
  TrendingUp,
  CheckCircle,
  Star,
  Eye,
  Lock,
  BarChart3,
  Clock,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ArrowRight,
  Zap,
  Compass,
  Layers,
  Brain,
  Rocket,
  DollarSign,
  Trophy,
  Flag,
  Calendar,
  BookOpen,
  Lightbulb,
  Scale,
  Sparkles,
  ChevronRight,
  Quote,
  Briefcase,
  GraduationCap,
  User,
  Linkedin,
  Twitter,
  Github,
  Building2,
  Shield,
  MessageSquare,
  Headphones,
  FileText,
  Send,
  Plus,
  Minus,
  Search,
  Filter,
  MapPin as LocationIcon,
  Clock as TimeIcon,
  DollarSign as SalaryIcon,
  Briefcase as JobTypeIcon
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Input,
  Textarea,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@proof-of-fit/ui"

export default function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const companyValues = [
    {
      icon: <Scale className="h-8 w-8" />,
      title: "Fairness First",
      description: "We believe in creating an inclusive workplace where everyone has equal opportunities to grow and succeed."
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Transparency",
      description: "Open communication, clear feedback, and honest conversations are the foundation of our culture."
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Continuous Learning",
      description: "We invest in your growth with learning budgets, conferences, and mentorship opportunities."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Work-Life Balance",
      description: "Flexible schedules, unlimited PTO, and remote-first culture support your well-being."
    }
  ]

  const benefits = [
    {
      category: "Health & Wellness",
      items: [
        "Comprehensive health, dental, and vision insurance",
        "Mental health support and counseling services",
        "Gym membership and wellness stipend",
        "Flexible work arrangements and remote options"
      ]
    },
    {
      category: "Professional Development",
      items: [
        "$5,000 annual learning and development budget",
        "Conference attendance and speaking opportunities",
        "Internal mentorship and coaching programs",
        "Access to premium online courses and certifications"
      ]
    },
    {
      category: "Financial Benefits",
      items: [
        "Competitive salary and equity packages",
        "401(k) with company matching up to 6%",
        "Performance bonuses and profit sharing",
        "Commuter benefits and home office stipend"
      ]
    },
    {
      category: "Work Environment",
      items: [
        "Modern office spaces with top-tier equipment",
        "Unlimited PTO and flexible holiday schedule",
        "Team building events and company retreats",
        "Pet-friendly offices and bring-your-dog days"
      ]
    }
  ]

  const openPositions = [
    {
      id: 1,
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      level: "Senior",
      salary: "$140,000 - $180,000",
      description: "Join our core engineering team to build scalable, secure systems that power fair hiring decisions for millions of candidates worldwide.",
      requirements: [
        "5+ years of software engineering experience",
        "Expertise in TypeScript, React, and Node.js",
        "Experience with distributed systems and microservices",
        "Strong understanding of security and privacy principles"
      ],
      benefits: ["Equity package", "Health insurance", "Learning budget", "Flexible PTO"],
      posted: "2 days ago"
    },
    {
      id: 2,
      title: "Machine Learning Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      level: "Mid-Senior",
      salary: "$130,000 - $160,000",
      description: "Develop and deploy ML models that detect bias and ensure fair hiring practices across diverse candidate populations.",
      requirements: [
        "3+ years of ML engineering experience",
        "Proficiency in Python, TensorFlow, and PyTorch",
        "Experience with bias detection and fairness metrics",
        "Strong background in statistics and data science"
      ],
      benefits: ["Equity package", "Health insurance", "Learning budget", "Remote work"],
      posted: "1 week ago"
    },
    {
      id: 3,
      title: "Product Manager",
      department: "Product",
      location: "New York, NY",
      type: "Full-time",
      level: "Senior",
      salary: "$120,000 - $150,000",
      description: "Lead product strategy and roadmap for our enterprise hiring platform, working closely with engineering and design teams.",
      requirements: [
        "4+ years of product management experience",
        "Experience with B2B SaaS products",
        "Strong analytical and communication skills",
        "Background in HR tech or enterprise software preferred"
      ],
      benefits: ["Equity package", "Health insurance", "Learning budget", "Flexible PTO"],
      posted: "3 days ago"
    },
    {
      id: 4,
      title: "Enterprise Sales Representative",
      department: "Sales",
      location: "Austin, TX",
      type: "Full-time",
      level: "Mid-Senior",
      salary: "$90,000 - $120,000 + Commission",
      description: "Drive enterprise sales growth by building relationships with Fortune 500 companies and closing large deals.",
      requirements: [
        "3+ years of enterprise sales experience",
        "Track record of exceeding quota targets",
        "Experience selling to HR and talent acquisition teams",
        "Strong presentation and negotiation skills"
      ],
      benefits: ["Commission structure", "Health insurance", "Learning budget", "Travel opportunities"],
      posted: "5 days ago"
    },
    {
      id: 5,
      title: "UX Designer",
      department: "Design",
      location: "San Francisco, CA",
      type: "Full-time",
      level: "Mid-Senior",
      salary: "$100,000 - $130,000",
      description: "Design intuitive, accessible interfaces that make complex hiring analytics understandable for all users.",
      requirements: [
        "3+ years of UX design experience",
        "Proficiency in Figma and design systems",
        "Experience with data visualization and analytics dashboards",
        "Strong understanding of accessibility principles"
      ],
      benefits: ["Equity package", "Health insurance", "Learning budget", "Design tools"],
      posted: "1 week ago"
    },
    {
      id: 6,
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      level: "Mid-Senior",
      salary: "$80,000 - $100,000",
      description: "Ensure customer satisfaction and drive adoption of our platform through proactive support and strategic guidance.",
      requirements: [
        "3+ years of customer success experience",
        "Experience with enterprise software implementations",
        "Strong project management and communication skills",
        "Background in HR or talent acquisition preferred"
      ],
      benefits: ["Equity package", "Health insurance", "Learning budget", "Remote work"],
      posted: "4 days ago"
    }
  ]

  const departments = ["all", "Engineering", "Product", "Sales", "Design", "Customer Success", "Marketing", "Operations"]
  const locations = ["all", "San Francisco, CA", "New York, NY", "Austin, TX", "Remote"]

  const filteredPositions = openPositions.filter(position => {
    const matchesDepartment = selectedDepartment === "all" || position.department === selectedDepartment
    const matchesLocation = selectedLocation === "all" || position.location === selectedLocation
    const matchesSearch = position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         position.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesDepartment && matchesLocation && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10" />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Join Our
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Mission</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-8">
              Help us build the future of fair hiring. We&apos;re looking for passionate individuals 
              who share our commitment to eliminating bias and creating equal opportunities for all.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
                <CheckCircle className="h-4 w-4 mr-2" />
                Remote-First Culture
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-4 py-2">
                <Award className="h-4 w-4 mr-2" />
                Equity Packages
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                Learning Budget
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 space-y-24">
        {/* Company Culture */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Our Culture</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We&apos;re building more than a company—we&apos;re creating a movement for fair hiring. 
              Join a team that values diversity, transparency, and making a real impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="text-blue-600 mb-4 flex justify-center">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Benefits & Perks</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We invest in our team&apos;s success with comprehensive benefits and unique perks 
              that support both personal and professional growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-6 w-6 text-blue-600" />
                    {benefit.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {benefit.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-600 dark:text-slate-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Open Positions</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Find your next role and help us build the future of fair hiring. 
              We're always looking for exceptional talent who share our mission.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search positions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept === "all" ? "All Departments" : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location === "all" ? "All Locations" : location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-6">
            {filteredPositions.map((position) => (
              <Card key={position.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{position.title}</h3>
                        <Badge variant="outline">{position.level}</Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300 mb-3">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {position.department}
                        </div>
                        <div className="flex items-center gap-1">
                          <LocationIcon className="h-4 w-4" />
                          {position.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <JobTypeIcon className="h-4 w-4" />
                          {position.type}
                        </div>
                        <div className="flex items-center gap-1">
                          <SalaryIcon className="h-4 w-4" />
                          {position.salary}
                        </div>
                        <div className="flex items-center gap-1">
                          <TimeIcon className="h-4 w-4" />
                          {position.posted}
                        </div>
                      </div>

                      <p className="text-slate-600 dark:text-slate-300 mb-4">{position.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {position.benefits.map((benefit, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>

                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Key Requirements:</h4>
                        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                          {position.requirements.slice(0, 3).map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <ArrowRight className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                              {req}
                            </li>
                          ))}
                          {position.requirements.length > 3 && (
                            <li className="text-blue-600 text-sm">+{position.requirements.length - 3} more requirements</li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 lg:min-w-48">
                      <Button className="w-full">
                        Apply Now
                      </Button>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPositions.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Briefcase className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No positions found</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Try adjusting your search criteria or check back later for new opportunities.
                </p>
                <Button variant="outline">
                  View All Positions
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Application Process */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Our Hiring Process</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We believe in a fair, transparent hiring process that gives every candidate 
              an equal opportunity to showcase their skills and potential.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Application</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Submit your application with resume and cover letter. We review every application carefully.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Initial Review</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Our team reviews your application and may reach out for a brief phone screening.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Interview Process</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Technical interviews, culture fit discussions, and team collaboration exercises.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Decision</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                We make our decision and extend an offer to the best candidate for the role.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Don't See Your Role?</h2>
              <p className="text-xl mb-8 opacity-90">
                We're always looking for exceptional talent. Send us your resume and tell us how you'd like to contribute to our mission.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  <Mail className="h-5 w-5 mr-2" />
                  Send Your Resume
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Heart className="h-5 w-5 mr-2" />
                  Learn About Our Culture
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
