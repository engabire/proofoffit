"use client"

import React, { useState } from "react"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Building2,
  Users,
  MessageSquare,
  Shield,
  CheckCircle,
  Send,
  User,
  Briefcase,
  Globe,
  Award,
  Star,
  ArrowRight,
  ExternalLink,
  Calendar,
  Headphones,
  FileText,
  Zap,
  Target,
  Heart,
  Sparkles,
  Lock,
  Eye,
  Scale,
  Brain,
  Rocket,
  Compass,
  Layers,
  BarChart3,
  TrendingUp,
  DollarSign,
  Trophy,
  Flag,
  BookOpen,
  Lightbulb,
  ChevronRight,
  Quote,
  Handshake,
  GraduationCap,
  Linkedin,
  Twitter,
  Github
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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    inquiryType: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const contactOptions = [
    {
      title: "Enterprise Sales",
      description: "Ready to transform your hiring process? Contact our enterprise team for custom solutions.",
      email: "enterprise@proofoffit.com",
      phone: "+1 (555) 123-4567",
      icon: <Building2 className="h-8 w-8" />,
      color: "blue",
      features: ["Custom pricing", "Dedicated support", "Enterprise features", "SLA guarantees"]
    },
    {
      title: "General Support",
      description: "Questions about our platform, features, or need technical assistance?",
      email: "support@proofoffit.com",
      phone: "+1 (555) 123-4568",
      icon: <Headphones className="h-8 w-8" />,
      color: "green",
      features: ["24/7 support", "Technical assistance", "Feature questions", "Account help"]
    },
    {
      title: "Media & Press",
      description: "Press inquiries, media resources, and partnership opportunities.",
      email: "press@proofoffit.com",
      phone: "+1 (555) 123-4569",
      icon: <MessageSquare className="h-8 w-8" />,
      color: "purple",
      features: ["Press kit", "Media interviews", "Partnerships", "Speaking opportunities"]
    },
    {
      title: "Partnerships",
      description: "Interested in partnering with us? Let's explore collaboration opportunities.",
      email: "partnerships@proofoffit.com",
      phone: "+1 (555) 123-4570",
      icon: <Handshake className="h-8 w-8" />,
      color: "emerald",
      features: ["Integration partners", "Channel partners", "Technology partners", "Strategic alliances"]
    }
  ]

  const officeLocations = [
    {
      city: "San Francisco",
      address: "123 Market Street, Suite 400",
      zip: "San Francisco, CA 94105",
      phone: "+1 (555) 123-4567",
      type: "Headquarters"
    },
    {
      city: "New York",
      address: "456 Broadway, Floor 12",
      zip: "New York, NY 10013",
      phone: "+1 (555) 123-4568",
      type: "Sales Office"
    },
    {
      city: "Austin",
      address: "789 Congress Avenue, Suite 200",
      zip: "Austin, TX 78701",
      phone: "+1 (555) 123-4569",
      type: "Engineering Office"
    }
  ]

  const responseTimes = [
    { type: "Enterprise Sales", time: "< 2 hours", icon: <Zap className="h-5 w-5" /> },
    { type: "General Support", time: "< 4 hours", icon: <Headphones className="h-5 w-5" /> },
    { type: "Technical Issues", time: "< 1 hour", icon: <Shield className="h-5 w-5" /> },
    { type: "Media Inquiries", time: "< 24 hours", icon: <MessageSquare className="h-5 w-5" /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10" />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Contact
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> ProofOfFit</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-8">
              Ready to transform your hiring process? Our team is here to help you get started 
              with fair, transparent, and bias-free hiring solutions.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
                <CheckCircle className="h-4 w-4 mr-2" />
                < 2 Hour Response Time
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-4 py-2">
                <Shield className="h-4 w-4 mr-2" />
                Enterprise Security
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                24/7 Support
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 space-y-24">
        {/* Contact Options */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">How Can We Help?</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Choose the right contact option for your needs. Our specialized teams are ready to assist you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactOptions.map((option, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`text-${option.color}-600 mb-4`}>{option.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{option.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">{option.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-500" />
                      <a href={`mailto:${option.email}`} className="text-sm text-blue-600 hover:text-blue-700">
                        {option.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-600">{option.phone}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {option.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full mt-4" size="sm">
                    Contact {option.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Send Us a Message</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                Fill out the form below and we'll get back to you within 2 hours during business hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      placeholder="Your job title"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="inquiryType">Inquiry Type *</Label>
                  <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange('inquiryType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enterprise">Enterprise Sales</SelectItem>
                      <SelectItem value="support">General Support</SelectItem>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="media">Media & Press</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Tell us how we can help you..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Response Times</h3>
              <div className="space-y-4 mb-8">
                {responseTimes.map((response, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-blue-600">{response.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold">{response.type}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">{response.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold mb-3">Need Immediate Assistance?</h4>
                  <p className="text-sm opacity-90 mb-4">
                    For urgent technical issues or enterprise support, call us directly.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">24/7 Enterprise Support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Office Locations */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Our Offices</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Visit us at one of our locations worldwide. We're always happy to meet in person.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {officeLocations.map((office, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="h-6 w-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">{office.city}</h3>
                      <Badge variant="outline" className="text-xs">
                        {office.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <div>{office.address}</div>
                    <div>{office.zip}</div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {office.phone}
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Business Hours */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Business Hours</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Our team is available during these hours to provide the best support experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">General Support</h3>
                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                  <div>Monday - Friday</div>
                  <div>9:00 AM - 6:00 PM CST</div>
                  <div className="text-xs text-green-600">24/7 Online Support</div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Building2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Enterprise Sales</h3>
                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                  <div>Monday - Friday</div>
                  <div>8:00 AM - 7:00 PM CST</div>
                  <div className="text-xs text-green-600">Priority Response</div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Technical Support</h3>
                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                  <div>24/7 Available</div>
                  <div>Emergency Response</div>
                  <div className="text-xs text-green-600">< 1 Hour SLA</div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <MessageSquare className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Media & Press</h3>
                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                  <div>Monday - Friday</div>
                  <div>10:00 AM - 5:00 PM CST</div>
                  <div className="text-xs text-green-600">By Appointment</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join 500+ companies already using ProofOfFit to make fairer, more transparent hiring decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule a Demo
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Heart className="h-5 w-5 mr-2" />
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}