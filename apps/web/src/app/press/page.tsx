"use client"

import React, { useState } from "react"
import {
  MessageSquare,
  FileText,
  Download,
  ExternalLink,
  Calendar,
  User,
  Building2,
  Award,
  Star,
  TrendingUp,
  Globe,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  ArrowRight,
  Heart,
  Zap,
  Compass,
  Layers,
  Brain,
  Rocket,
  DollarSign,
  Trophy,
  Flag,
  BookOpen,
  Lightbulb,
  Scale,
  Sparkles,
  ChevronRight,
  Quote,
  Briefcase,
  GraduationCap,
  Linkedin,
  Twitter,
  Github,
  Shield,
  Eye,
  Lock,
  BarChart3,
  Target,
  Users,
  MapPin,
  Search,
  Filter,
  Plus,
  Minus,
  Send,
  Copy,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Newspaper,
  Mic,
  Video,
  Image as ImageIcon,
  File,
  Archive,
  Tag,
  Hash,
  AtSign,
  Link as LinkIcon,
  Globe2,
  Monitor,
  Smartphone,
  Tablet,
  Headphones,
  Camera,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  Settings,
  MoreHorizontal,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight as ArrowRightIcon,
  ArrowUpRight,
  ArrowDownRight,
  ArrowUpLeft,
  ArrowDownLeft,
  Move,
  MoveHorizontal,
  MoveVertical,
  RotateCw,
  RotateCcw as RotateCcwIcon,
  ZoomIn,
  ZoomOut,
  Focus,
  Crop,
  Scissors,
  Palette,
  Brush,
  Pen,
  Pencil,
  Eraser,
  Highlighter,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  List,
  ListOrdered,
  Quote as QuoteIcon,
  Code,
  Terminal,
  Database,
  Server,
  Cloud,
  Wifi,
  WifiOff,
  Bluetooth,
  BluetoothOff,
  Signal,
  SignalZero,
  SignalLow,
  SignalMedium,
  SignalHigh,
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Plug,
  Unplug,
  Power,
  PowerOff,
  RefreshCw,
  RefreshCcw as RefreshCcwIcon,
  RotateCw as RotateCwIcon,
  RotateCcw as RotateCcwIcon2,
  Rotate3d,
  FlipHorizontal,
  FlipVertical,
  FlipHorizontal2,
  FlipVertical2,
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

export default function PressPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")

  const pressReleases = [
    {
      id: 1,
      title: "ProofOfFit Raises $15M Series A to Scale Fair Hiring Technology",
      date: "2024-03-15",
      category: "Funding",
      summary: "Company announces Series A funding led by Andreessen Horowitz to accelerate development of bias-free hiring solutions.",
      content: "ProofOfFit, the leading provider of fair hiring technology, today announced it has raised $15 million in Series A funding led by Andreessen Horowitz. The funding will be used to accelerate product development, expand the engineering team, and scale operations to serve more enterprise customers worldwide.",
      tags: ["funding", "series-a", "andreessen-horowitz", "hiring-technology"],
      downloadUrl: "/press/proofofit-series-a-press-release.pdf"
    },
    {
      id: 2,
      title: "ProofOfFit Achieves SOC 2 Type II Certification",
      date: "2024-02-28",
      category: "Security",
      summary: "Company completes rigorous security audit and achieves SOC 2 Type II certification for enterprise customers.",
      content: "ProofOfFit has successfully completed its SOC 2 Type II audit, demonstrating its commitment to the highest standards of security, availability, and confidentiality. This certification provides enterprise customers with assurance that ProofOfFit's systems and processes meet rigorous security requirements.",
      tags: ["security", "soc2", "certification", "enterprise"],
      downloadUrl: "/press/proofofit-soc2-certification.pdf"
    },
    {
      id: 3,
      title: "ProofOfFit Partners with Fortune 500 Companies to Eliminate Hiring Bias",
      date: "2024-01-20",
      category: "Partnerships",
      summary: "Leading enterprise customers adopt ProofOfFit's platform to ensure fair and transparent hiring practices.",
      content: "ProofOfFit today announced partnerships with several Fortune 500 companies across technology, finance, and healthcare sectors. These partnerships represent a significant step forward in the adoption of bias-free hiring technology at enterprise scale.",
      tags: ["partnerships", "fortune-500", "enterprise", "bias-elimination"],
      downloadUrl: "/press/proofofit-enterprise-partnerships.pdf"
    }
  ]

  const mediaCoverage = [
    {
      id: 1,
      title: "How AI is Making Hiring More Fair",
      publication: "TechCrunch",
      author: "Sarah Johnson",
      date: "2024-03-10",
      category: "Feature",
      summary: "Deep dive into how ProofOfFit's technology is transforming hiring practices across industries.",
      url: "https://techcrunch.com/2024/03/10/how-ai-is-making-hiring-more-fair",
      image: "/press/techcrunch-feature.jpg"
    },
    {
      id: 2,
      title: "The Future of Bias-Free Hiring",
      publication: "Forbes",
      author: "Michael Chen",
      date: "2024-02-15",
      category: "Opinion",
      summary: "Forbes contributor explores the implications of transparent hiring algorithms for the future of work.",
      url: "https://forbes.com/2024/02/15/the-future-of-bias-free-hiring",
      image: "/press/forbes-opinion.jpg"
    },
    {
      id: 3,
      title: "ProofOfFit CEO Sarah Chen on Building Ethical AI",
      publication: "Harvard Business Review",
      author: "Dr. Lisa Wang",
      date: "2024-01-30",
      category: "Interview",
      summary: "Exclusive interview with ProofOfFit CEO about the challenges and opportunities in ethical AI development.",
      url: "https://hbr.org/2024/01/30/proofofit-ceo-sarah-chen-on-building-ethical-ai",
      image: "/press/hbr-interview.jpg"
    },
    {
      id: 4,
      title: "Startup Spotlight: ProofOfFit",
      publication: "VentureBeat",
      author: "Alex Rodriguez",
      date: "2024-01-10",
      category: "Profile",
      summary: "Comprehensive profile of ProofOfFit's mission, technology, and impact on the hiring industry.",
      url: "https://venturebeat.com/2024/01/10/startup-spotlight-proofofit",
      image: "/press/venturebeat-profile.jpg"
    }
  ]

  const awards = [
    {
      title: "Best HR Tech Innovation 2024",
      organization: "HR Technology Conference",
      date: "2024-03-20",
      description: "Recognized for breakthrough innovation in bias detection and fair hiring technology.",
      category: "Innovation"
    },
    {
      title: "Forbes 30 Under 30",
      organization: "Forbes",
      date: "2024-01-15",
      description: "CEO Sarah Chen named to Forbes 30 Under 30 list for Enterprise Technology.",
      category: "Leadership"
    },
    {
      title: "Best Startup to Work For",
      organization: "Built In",
      date: "2023-12-01",
      description: "Recognized for exceptional company culture and employee satisfaction.",
      category: "Culture"
    },
    {
      title: "SOC 2 Type II Certified",
      organization: "AICPA",
      date: "2024-02-28",
      description: "Achieved SOC 2 Type II certification for security, availability, and confidentiality.",
      category: "Security"
    }
  ]

  const leadership = [
    {
      name: "Sarah Chen",
      title: "CEO & Co-Founder",
      bio: "Former VP of Engineering at Palantir, PhD in Computer Science from Stanford. Expert in bias detection algorithms and ethical AI.",
      email: "sarah@proofoffit.com",
      linkedin: "https://linkedin.com/in/sarahchen",
      twitter: "https://twitter.com/sarahchen",
      image: "/team/sarah-chen.jpg",
      expertise: ["AI Ethics", "Bias Detection", "Enterprise Software", "Leadership"]
    },
    {
      name: "Marcus Rodriguez",
      title: "CTO & Co-Founder",
      bio: "Former Staff Engineer at major tech companies, specializing in large-scale ML systems and distributed computing.",
      email: "marcus@proofoffit.com",
      linkedin: "https://linkedin.com/in/marcusrodriguez",
      twitter: "https://twitter.com/marcusrodriguez",
      image: "/team/marcus-rodriguez.jpg",
      expertise: ["Machine Learning", "Distributed Systems", "Scalability", "Engineering Leadership"]
    },
    {
      name: "Dr. Amara Okafor",
      title: "Chief Science Officer",
      bio: "Leading researcher in algorithmic fairness and bias mitigation. Former Principal Scientist at Microsoft Research.",
      email: "amara@proofoffit.com",
      linkedin: "https://linkedin.com/in/amaraokafor",
      twitter: "https://twitter.com/amaraokafor",
      image: "/team/amara-okafor.jpg",
      expertise: ["Algorithmic Fairness", "Bias Mitigation", "Research", "Data Science"]
    }
  ]

  const pressKit = [
    {
      name: "Company Logo Package",
      description: "High-resolution logos in various formats and color schemes",
      type: "Brand Assets",
      size: "15.2 MB",
      downloadUrl: "/press/proofofit-logo-package.zip"
    },
    {
      name: "Executive Headshots",
      description: "Professional photos of leadership team members",
      type: "Images",
      size: "8.7 MB",
      downloadUrl: "/press/proofofit-executive-photos.zip"
    },
    {
      name: "Product Screenshots",
      description: "High-quality screenshots of the ProofOfFit platform",
      type: "Product Images",
      size: "12.3 MB",
      downloadUrl: "/press/proofofit-product-screenshots.zip"
    },
    {
      name: "Company Fact Sheet",
      description: "One-page overview of company, mission, and key metrics",
      type: "Documentation",
      size: "2.1 MB",
      downloadUrl: "/press/proofofit-fact-sheet.pdf"
    },
    {
      name: "Media Kit",
      description: "Complete media kit with all assets and information",
      type: "Complete Package",
      size: "45.8 MB",
      downloadUrl: "/press/proofofit-media-kit.zip"
    }
  ]

  const categories = ["all", "Funding", "Security", "Partnerships", "Product", "Leadership", "Awards"]
  const years = ["all", "2024", "2023", "2022", "2021"]

  const filteredPressReleases = pressReleases.filter(release => {
    const matchesCategory = selectedCategory === "all" || release.category === selectedCategory
    const matchesYear = selectedYear === "all" || release.date.startsWith(selectedYear)
    return matchesCategory && matchesYear
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10" />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Press & Media
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Resources</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-8">
              Stay updated with the latest news, press releases, and media coverage about ProofOfFit. 
              Access our press kit and connect with our media team.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge variant="success" className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
                <CheckCircle className="h-4 w-4 mr-2" />
                Media Kit Available
              </Badge>
              <Badge variant="info" className="bg-blue-100 text-blue-800 border-blue-200 px-4 py-2">
                <Award className="h-4 w-4 mr-2" />
                Award-Winning Technology
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200 px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                Industry Recognition
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 space-y-24">
        {/* Press Kit */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Press Kit</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Download our complete media kit with logos, images, fact sheets, and other resources for journalists and media professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pressKit.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <Download className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{item.size}</span>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Press Releases */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Press Releases</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Official announcements and news from ProofOfFit. Stay informed about our latest developments and milestones.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year === "all" ? "All Years" : year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Press Release List */}
          <div className="space-y-6">
            {filteredPressReleases.map((release) => (
              <Card key={release.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{release.title}</h3>
                        <Badge variant="outline" className="text-xs">{release.category}</Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(release.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          Press Release
                        </div>
                      </div>

                      <p className="text-slate-600 dark:text-slate-300 mb-4">{release.summary}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {release.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 lg:min-w-48">
                      <Button className="w-full" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Read More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Media Coverage */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Media Coverage</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              See what leading publications are saying about ProofOfFit and our impact on the future of hiring.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {mediaCoverage.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                      <Newspaper className="h-6 w-6 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{article.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <span>{article.publication}</span>
                        <span>•</span>
                        <span>{article.author}</span>
                      </div>
                    </div>
                        <Badge variant="outline" className="text-xs">{article.category}</Badge>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-300 mb-4">{article.summary}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      {new Date(article.date).toLocaleDateString()}
                    </span>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Read Article
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Awards & Recognition */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Awards & Recognition</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Recognition from industry leaders and organizations for our innovation and impact in fair hiring technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {awards.map((award, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{award.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <span>{award.organization}</span>
                        <span>•</span>
                        <span>{new Date(award.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">{award.category}</Badge>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-300">{award.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Leadership Team */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Leadership Team</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Meet our executive team. Available for interviews and speaking opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {leadership.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{member.name}</h3>
                      <p className="text-sm text-blue-600">{member.title}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{member.bio}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {member.expertise.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                    <Button size="sm" variant="outline">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Media Contact</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              For press inquiries, interview requests, or media partnerships, please contact our media team.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Press Inquiries</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  General press questions and media requests
                </p>
                <a href="mailto:press@proofoffit.com" className="text-blue-600 hover:text-blue-700">
                  press@proofoffit.com
                </a>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Interview Requests</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Schedule interviews with our leadership team
                </p>
                <a href="mailto:interviews@proofoffit.com" className="text-green-600 hover:text-green-700">
                  interviews@proofoffit.com
                </a>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Handshake className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Partnerships</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Media partnerships and collaboration opportunities
                </p>
                <a href="mailto:partnerships@proofoffit.com" className="text-purple-600 hover:text-purple-700">
                  partnerships@proofoffit.com
                </a>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-xl mb-8 opacity-90">
                Subscribe to our press mailing list to receive the latest news and announcements from ProofOfFit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Input 
                  placeholder="Enter your email" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                />
                <Button size="lg" variant="secondary">
                  <Send className="h-5 w-5 mr-2" />
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
