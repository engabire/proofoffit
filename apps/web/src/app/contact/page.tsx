"use client"

import React, { useState } from "react"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Building2,
  Users,
  Headphones,
  Shield,
  Zap,
  Globe,
  Calendar,
  MessageSquare,
  FileText,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Send,
  ExternalLink,
  Linkedin,
  Twitter,
  Github,
  BookOpen,
  Video,
  Download,
  Star,
  Award,
  Target,
  Briefcase,
  GraduationCap,
  HelpCircle,
  Settings,
  Database,
  Lock,
  Sparkles
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  Input,
  Textarea,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Alert,
  AlertDescription,
  RadioGroup,
  RadioGroupItem,
  Checkbox
} from "@proof-of-fit/ui"

interface ContactForm {
  type: 'sales' | 'support' | 'demo' | 'partnership' | 'security' | 'general'
  company: string
  name: string
  email: string
  phone: string
  title: string
  employees: string
  industry: string
  useCase: string
  timeline: string
  budget: string
  message: string
  newsletter: boolean
  privacy: boolean
}

interface ContactMethod {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  primary: string
  secondary?: string
  availability: string
  responseTime: string
  badge?: string
}

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState("sales")
  const [formData, setFormData] = useState<ContactForm>({
    type: 'sales',
    company: '',
    name: '',
    email: '',
    phone: '',
    title: '',
    employees: '',
    industry: '',
    useCase: '',
    timeline: '',
    budget: '',
    message: '',
    newsletter: false,
    privacy: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const contactMethods: ContactMethod[] = [
    {
      id: 'sales',
      title: 'Enterprise Sales',
      description: 'Speak with our sales team about enterprise solutions and custom pricing',
      icon: <Briefcase className="h-6 w-6" />,
      primary: 'sales@proofoffit.com',
      secondary: '+1 (555) 123-4567',
      availability: '9 AM - 6 PM CST, Mon-Fri',
      responseTime: '< 2 hours',
      badge: 'Priority'
    },
    {
      id: 'support',
      title: 'Customer Support',
      description: 'Get help with your ProofOfFit account, integrations, and technical issues',
      icon: <Headphones className="h-6 w-6" />,
      primary: 'support@proofoffit.com',
      secondary: 'Chat available 24/7',
      availability: '24/7 Support Available',
      responseTime: '< 1 hour',
      badge: 'SLA'
    },
    {
      id: 'demo',
      title: 'Product Demo',
      description: 'Schedule a personalized demonstration of ProofOfFit for your team',
      icon: <Video className="h-6 w-6" />,
      primary: 'demo@proofoffit.com',
      secondary: 'Schedule instantly',
      availability: 'Flexible scheduling',
      responseTime: 'Same day',
      badge: 'Popular'
    },
    {
      id: 'partnerships',
      title: 'Partnerships',
      description: 'Explore integration partnerships, channel partnerships, and strategic alliances',
      icon: <Users className="h-6 w-6" />,
      primary: 'partnerships@proofoffit.com',
      availability: '9 AM - 5 PM CST, Mon-Fri',
      responseTime: '< 24 hours'
    },
    {
      id: 'security',
      title: 'Security & Compliance',
      description: 'Security inquiries, vulnerability reports, and compliance questions',
      icon: <Shield className="h-6 w-6" />,
      primary: 'security@proofoffit.com',
      availability: '24/7 for security issues',
      responseTime: '< 4 hours',
      badge: 'Secure'
    },
    {
      id: 'media',
      title: 'Media & Press',
      description: 'Press inquiries, media kits, and interview requests',
      icon: <MessageSquare className="h-6 w-6" />,
      primary: 'press@proofoffit.com',
      availability: '9 AM - 5 PM CST, Mon-Fri',
      responseTime: '< 24 hours'
    }
  ]

  const handleInputChange = (field: keyof ContactForm, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSubmitStatus('success')
      // Reset form
      setFormData({
        type: 'sales',
        company: '',
        name: '',
        email: '',
        phone: '',
        title: '',
        employees: '',
        industry: '',
        useCase: '',
        timeline: '',
        budget: '',
        message: '',
        newsletter: false,
        privacy: false
      })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }
  }

  const scheduleDemo = () => {
    // In a real implementation, this would open a calendar booking widget
    window.open('https://calendly.com/proofoffit/demo', '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
              Ready to transform your hiring process? Our team is here to help you implement 
              bias-free, audit-ready talent evaluation at enterprise scale.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <Zap className="h-3 w-3 mr-1" />
                Response within 2 hours
              </Badge>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <Shield className="h-3 w-3 mr-1" />
                SOC 2 certified team
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                <Globe className="h-3 w-3 mr-1" />
                Global enterprise support
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={scheduleDemo}>
            <CardContent className="p-8">
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Schedule a Demo</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                See ProofOfFit in action with a personalized demonstration
              </p>
              <Button className="w-full">
                Book Demo Call
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <Phone className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Call Sales</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Speak directly with our enterprise sales team
              </p>
              <Button variant="outline" className="w-full">
                <Phone className="h-4 w-4 mr-2" />
                +1 (555) 123-4567
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <Download className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Enterprise Guide</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Download our comprehensive implementation guide
              </p>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Contact Form and Methods */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Contact Methods</CardTitle>
                <CardDescription>
                  Choose the best way to reach our team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method) => (
                  <div 
                    key={method.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      activeTab === method.id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                    onClick={() => {
                      setActiveTab(method.id)
                      setFormData(prev => ({ ...prev, type: method.id as ContactForm['type'] }))
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-blue-600 mt-1">
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{method.title}</h4>
                          {method.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {method.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                          {method.description}
                        </p>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{method.primary}</span>
                          </div>
                          {method.secondary && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{method.secondary}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{method.availability}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            <span>Response: {method.responseTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Office Information */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Office Locations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Headquarters</h4>
                  <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>Chicago, IL</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>CST (UTC-6)</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold">European Office</h4>
                  <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>London, UK</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>GMT (UTC+0)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold">Asia-Pacific</h4>
                  <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>Singapore</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>SGT (UTC+8)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === 'sales' && 'Enterprise Sales Inquiry'}
                  {activeTab === 'support' && 'Support Request'}
                  {activeTab === 'demo' && 'Demo Request'}
                  {activeTab === 'partnerships' && 'Partnership Inquiry'}
                  {activeTab === 'security' && 'Security Inquiry'}
                  {activeTab === 'media' && 'Media Inquiry'}
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within our SLA timeframes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Business Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company">Company Name *</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        required
                        placeholder="Acme Corporation"
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="VP of Human Resources"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="employees">Company Size</Label>
                      <Select 
                        value={formData.employees} 
                        onValueChange={(value) => handleInputChange('employees', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-1000">201-1,000 employees</SelectItem>
                          <SelectItem value="1001-5000">1,001-5,000 employees</SelectItem>
                          <SelectItem value="5000+">5,000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Business Context */}
                  {(activeTab === 'sales' || activeTab === 'demo') && (
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="industry">Industry</Label>
                          <Select 
                            value={formData.industry} 
                            onValueChange={(value) => handleInputChange('industry', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="financial">Financial Services</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="consulting">Consulting</SelectItem>
                              <SelectItem value="government">Government</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="nonprofit">Non-profit</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="timeline">Implementation Timeline</Label>
                          <Select 
                            value={formData.timeline} 
                            onValueChange={(value) => handleInputChange('timeline', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="immediate">Immediate (< 1 month)</SelectItem>
                              <SelectItem value="short">Short-term (1-3 months)</SelectItem>
                              <SelectItem value="medium">Medium-term (3-6 months)</SelectItem>
                              <SelectItem value="long">Long-term (6+ months)</SelectItem>
                              <SelectItem value="exploring">Just exploring</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="useCase">Primary Use Case</Label>
                        <Select 
                          value={formData.useCase} 
                          onValueChange={(value) => handleInputChange('useCase', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="What's your main hiring challenge?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bias-reduction">Bias reduction & compliance</SelectItem>
                            <SelectItem value="efficiency">Hiring process efficiency</SelectItem>
                            <SelectItem value="quality">Candidate quality improvement</SelectItem>
                            <SelectItem value="audit">Audit trail & transparency</SelectItem>
                            <SelectItem value="scale">Scaling hiring operations</SelectItem>
                            <SelectItem value="diversity">Diversity & inclusion goals</SelectItem>
                            <SelectItem value="integration">ATS/HRIS integration</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {activeTab === 'sales' && (
                    <div>
                      <Label htmlFor="budget">Estimated Budget Range</Label>
                      <Select 
                        value={formData.budget} 
                        onValueChange={(value) => handleInputChange('budget', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-10k">Under $10,000</SelectItem>
                          <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                          <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                          <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                          <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                          <SelectItem value="250k+">$250,000+</SelectItem>
                          <SelectItem value="discuss">Prefer to discuss</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <Label htmlFor="message">
                      {activeTab === 'support' ? 'Describe your issue' : 'Additional Information'}
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows={4}
                      placeholder={
                        activeTab === 'support' 
                          ? "Please describe the issue you're experiencing, including any error messages and steps to reproduce..."
                          : "Tell us more about your requirements, questions, or how we can help..."
                      }
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="newsletter"
                        checked={formData.newsletter}
                        onCheckedChange={(checked) => handleInputChange('newsletter', checked as boolean)}
                      />
                      <Label htmlFor="newsletter" className="text-sm">
                        Subscribe to ProofOfFit newsletter for product updates and industry insights
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="privacy"
                        checked={formData.privacy}
                        onCheckedChange={(checked) => handleInputChange('privacy', checked as boolean)}
                        required
                      />
                      <Label htmlFor="privacy" className="text-sm">
                        I agree to the <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> and 
                        <a href="/terms" className="text-blue-600 hover:underline ml-1">Terms of Service</a> *
                      </Label>
                    </div>
                  </div>

                  {/* Submit Status */}
                  {submitStatus === 'success' && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Thank you! Your message has been sent successfully. We'll respond within our SLA timeframe.
                      </AlertDescription>
                    </Alert>
                  )}

                  {submitStatus === 'error' && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        There was an error sending your message. Please try again or contact us directly.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting || !formData.privacy}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardContent className="p-6">
              <BookOpen className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Documentation</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                Comprehensive guides and API documentation
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-3 w-3 mr-1" />
                View Docs
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <MessageSquare className="h-10 w-10 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                Join our user community and discussion forums
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-3 w-3 mr-1" />
                Join Community
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <HelpCircle className="h-10 w-10 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Help Center</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                Self-service help articles and tutorials
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-3 w-3 mr-1" />
                Get Help
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Settings className="h-10 w-10 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Status Page</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                Check system status and uptime
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-3 w-3 mr-1" />
                View Status
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Social Links */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <h3 className="font-semibold mb-4">Follow ProofOfFit</h3>
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="sm">
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
              <Button variant="outline" size="sm">
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button variant="outline" size="sm">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
            </div>
          </div>
        </div>

        {/* SLA Guarantee */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Award className="h-8 w-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                Enterprise SLA Guarantee
              </h3>
            </div>
            <p className="text-blue-800 dark:text-blue-200 mb-4">
              We guarantee response times and provide enterprise-grade support with 99.9% uptime SLA.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span>Sales: < 2 hours response</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span>Support: < 1 hour response</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span>Security: < 4 hours response</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}