"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Play,
  Pause,
  RotateCcw,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
  Star,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Switch,
  Label,
  Breadcrumb,
} from "@proof-of-fit/ui"

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState("fit-report")
  const [isPlaying, setIsPlaying] = useState(false)
  const [showBiasAnalysis, setShowBiasAnalysis] = useState(false)
  const [showAuditTrail, setShowAuditTrail] = useState(false)

  const mockFitScore = 87
  const mockBiasScore = 95
  const mockDiversityScore = 88

  const getBreadcrumbItems = () => [
    { label: 'Demo', href: '/demo' },
    { label: activeTab === 'fit-report' ? 'Job Seeker Demo' : 'Employer Demo', current: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb items={getBreadcrumbItems()} />
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Interactive Demo</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience ProofOfFit&apos;s bias-reducing, explainable matching in action. 
            See how we create fair, transparent hiring decisions with immutable audit trails.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Button>
            
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="fit-report">Job Seeker Demo</TabsTrigger>
              <TabsTrigger value="candidate-slate">Employer Demo</TabsTrigger>
            </TabsList>
            
            <Button
              onClick={() => {
                const otherTab = activeTab === 'fit-report' ? 'candidate-slate' : 'fit-report';
                setActiveTab(otherTab);
              }}
              className="flex items-center gap-2"
            >
              Switch Demo
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <TabsContent value="fit-report" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Fit Report Demo</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isPlaying ? 'Pause' : 'Play'} Demo
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Demo Navigation */}
                <div className="mb-6 flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-blue-700">
                    <span className="font-medium">Demo Flow:</span>
                    <Button variant="ghost" size="sm" className="h-auto p-1 text-blue-600 hover:text-blue-800">
                      Job Analysis
                    </Button>
                    <ChevronRight className="w-3 h-3" />
                    <Button variant="ghost" size="sm" className="h-auto p-1 text-blue-600 hover:text-blue-800">
                      Fit Report
                    </Button>
                    <ChevronRight className="w-3 h-3" />
                    <Button variant="ghost" size="sm" className="h-auto p-1 text-blue-600 hover:text-blue-800">
                      Bias Analysis
                    </Button>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setActiveTab('candidate-slate')}
                    className="text-blue-600 border-blue-300"
                  >
                    Employer Demo →
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Side - Job Description */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Target Job</h3>
                    <Card className="border-2 border-blue-200">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-lg">Senior Software Engineer</h4>
                            <p className="text-gray-600">TechCorp • San Francisco, CA</p>
                          </div>
                          <div>
                            <h5 className="font-medium mb-2">Required Skills:</h5>
                            <div className="flex flex-wrap gap-2">
                              {['Python', 'React', 'Cloud', 'Docker', '5+ years'].map((skill) => (
                                <Badge key={skill} variant="default">{skill}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium mb-2">Nice to Have:</h5>
                            <div className="flex flex-wrap gap-2">
                              {['Kubernetes', 'GraphQL', 'Leadership'].map((skill) => (
                                <Badge key={skill} variant="secondary">{skill}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Side - Fit Analysis */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Your Fit Analysis</h3>
                    <Card className="border-2 border-green-200">
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          {/* Overall Score */}
                          <div className="text-center">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white mb-4">
                              <div className="text-center">
                                <div className="text-3xl font-bold">{mockFitScore}</div>
                                <div className="text-xs opacity-90">/ 100</div>
                              </div>
                            </div>
                            <h4 className="font-semibold text-lg">Overall Fit Score</h4>
                            <p className="text-gray-600">Excellent match!</p>
                          </div>

                          {/* Breakdown */}
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Skills Match</span>
                                <span className="text-sm">92%</span>
                              </div>
                              <Progress value={92} className="h-2" />
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Experience</span>
                                <span className="text-sm">85%</span>
                              </div>
                              <Progress value={85} className="h-2" />
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Cultural Fit</span>
                                <span className="text-sm">88%</span>
                              </div>
                              <Progress value={88} className="h-2" />
                            </div>
                          </div>

                          {/* Strengths */}
                          <div>
                            <h5 className="font-medium mb-2 text-green-700">Strengths:</h5>
                            <ul className="space-y-1">
                              {['Strong Python skills', 'Cloud certification', 'Team leadership experience'].map((strength) => (
                                <li key={strength} className="flex items-center text-sm">
                                  <Check className="w-3 h-3 mr-2 text-green-600" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Bias Analysis Toggle */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Bias Analysis & Audit Trail</h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="bias-analysis"
                          checked={showBiasAnalysis}
                          onCheckedChange={setShowBiasAnalysis}
                        />
                        <Label htmlFor="bias-analysis">Show Bias Analysis</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="audit-trail"
                          checked={showAuditTrail}
                          onCheckedChange={setShowAuditTrail}
                        />
                        <Label htmlFor="audit-trail">Show Audit Trail</Label>
                      </div>
                    </div>
                  </div>

                  {showBiasAnalysis && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Card className="mb-4 bg-blue-50 border-blue-200">
                        <CardContent className="p-6">
                          <div className="flex items-start">
                            <Shield className="w-6 h-6 text-blue-600 mr-3 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-blue-900 mb-2">Bias Analysis Results</h4>
                              <div className="grid md:grid-cols-3 gap-4">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-blue-600">{mockBiasScore}%</div>
                                  <div className="text-sm text-blue-800">Bias-Free Score</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-green-600">{mockDiversityScore}%</div>
                                  <div className="text-sm text-green-800">Diversity Score</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-purple-600">0</div>
                                  <div className="text-sm text-purple-800">Bias Factors Detected</div>
                                </div>
                              </div>
                              <p className="text-blue-800 text-sm mt-4">
                                This analysis was conducted using bias-reducing algorithms that focus on skills, 
                                experience, and qualifications while minimizing unconscious bias factors.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {showAuditTrail && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Card className="bg-gray-50 border-gray-200">
                        <CardContent className="p-6">
                          <div className="flex items-start">
                            <Lock className="w-6 h-6 text-gray-600 mr-3 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-2">Immutable Audit Trail</h4>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-white rounded border">
                                  <div>
                                    <div className="font-medium">Analysis ID</div>
                                    <div className="text-sm text-gray-600">audit_123456789</div>
                                  </div>
                                  <Badge variant="outline">Immutable</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white rounded border">
                                  <div>
                                    <div className="font-medium">Hash</div>
                                    <div className="text-sm text-gray-600 font-mono">abc123def456ghi789</div>
                                  </div>
                                  <Button variant="outline" size="sm">
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white rounded border">
                                  <div>
                                    <div className="font-medium">Timestamp</div>
                                    <div className="text-sm text-gray-600">2024-01-15T10:30:00.000Z</div>
                                  </div>
                                  <Button variant="outline" size="sm">
                                    <ExternalLink className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-gray-700 text-sm mt-4">
                                Every decision is cryptographically verified and cannot be altered. 
                                This ensures complete transparency and compliance with hiring regulations.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="candidate-slate" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Candidate Slate Demo</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isPlaying ? 'Pause' : 'Play'} Demo
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Demo Navigation */}
                <div className="mb-6 flex justify-between items-center p-4 bg-emerald-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-emerald-700">
                    <span className="font-medium">Demo Flow:</span>
                    <Button variant="ghost" size="sm" className="h-auto p-1 text-emerald-600 hover:text-emerald-800">
                      Requirements
                    </Button>
                    <ChevronRight className="w-3 h-3" />
                    <Button variant="ghost" size="sm" className="h-auto p-1 text-emerald-600 hover:text-emerald-800">
                      Candidate Slate
                    </Button>
                    <ChevronRight className="w-3 h-3" />
                    <Button variant="ghost" size="sm" className="h-auto p-1 text-emerald-600 hover:text-emerald-800">
                      Compliance
                    </Button>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setActiveTab('fit-report')}
                    className="text-emerald-600 border-emerald-300"
                  >
                    ← Job Seeker Demo
                  </Button>
                </div>
                <div className="space-y-6">
                  {/* Job Requirements */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Job Requirements</h3>
                    <Card className="border-2 border-emerald-200">
                      <CardContent className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-lg mb-2">Senior Software Engineer</h4>
                            <p className="text-gray-600 mb-4">TechCorp • San Francisco, CA</p>
                            <div>
                              <h5 className="font-medium mb-2">Required Skills:</h5>
                              <div className="flex flex-wrap gap-2">
                                {['Python', 'React', 'Cloud', 'Docker', '5+ years'].map((skill) => (
                                  <Badge key={skill} variant="default">{skill}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium mb-2">Diversity Goals:</h5>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Target Diversity</span>
                                <span className="text-sm font-medium">60%</span>
                              </div>
                              <Progress value={60} className="h-2" />
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Current Slate</span>
                                <span className="text-sm font-medium">75%</span>
                              </div>
                              <Progress value={75} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Candidate Slate */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Ranked Candidate Slate</h3>
                    <div className="space-y-4">
                      {[
                        { name: 'Sarah Chen', score: 92, role: 'Senior Software Engineer', company: 'TechCorp', diversity: 'Female, Asian' },
                        { name: 'Marcus Johnson', score: 85, role: 'Full Stack Developer', company: 'StartupXYZ', diversity: 'Male, African-American' },
                        { name: 'Alex Rodriguez', score: 78, role: 'Software Engineer', company: 'BigTech', diversity: 'Male, Hispanic' }
                      ].map((candidate, index) => (
                        <Card key={index} className="border-2 border-emerald-200">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                                  <span className="text-white font-medium text-lg">
                                    {candidate.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-lg">{candidate.name}</h4>
                                  <p className="text-gray-600">{candidate.role} at {candidate.company}</p>
                                  <p className="text-sm text-gray-500">{candidate.diversity}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant="outline" className="mb-2">
                                  #{index + 1} Rank
                                </Badge>
                                <div className="text-2xl font-bold text-emerald-600">{candidate.score}%</div>
                                <div className="text-sm text-gray-600">Fit Score</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Compliance Summary */}
                  <Card className="bg-emerald-50 border-emerald-200">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <Shield className="w-6 h-6 text-emerald-600 mr-3 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-emerald-900 mb-2">Compliance Summary</h4>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-emerald-600">✓</div>
                              <div className="text-sm text-emerald-800">EEOC Compliant</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-emerald-600">✓</div>
                              <div className="text-sm text-emerald-800">Audit Ready</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-emerald-600">✓</div>
                              <div className="text-sm text-emerald-800">Bias-Free</div>
                            </div>
                          </div>
                          <p className="text-emerald-800 text-sm mt-4">
                            This slate was generated using bias-reducing algorithms and maintains an immutable audit trail. 
                            All selection decisions are explainable and verifiable.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold mb-4">Ready to Experience ProofOfFit?</h2>
          <p className="text-gray-600 mb-6">
            Join thousands of job seekers and employers who trust ProofOfFit for fair, transparent hiring.
          </p>
          <div className="text-center space-y-6">
            <div className="flex justify-center space-x-4">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600" asChild>
                <Link 
                  href="/app/fit"
                  aria-label="Get your personalized fit report - analyze your job match"
                  rel="noopener"
                  className="inline-flex items-center gap-2"
                >
                  Get Your Fit Report
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link 
                  href="/app/slate"
                  aria-label="Generate candidate slate - start hiring process"
                  rel="noopener"
                  className="inline-flex items-center gap-2"
                >
                  Generate Candidate Slate
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            
            {/* Quick Navigation */}
            <div className="flex justify-center items-center space-x-4 text-sm text-gray-600">
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('fit-report')}>
                ← Job Seeker Demo
              </Button>
              <span>|</span>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('candidate-slate')}>
                Employer Demo →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}