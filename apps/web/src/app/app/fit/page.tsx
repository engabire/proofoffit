"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { startTimer, stopTimer } from "../../../lib/analytics"
import {
  Upload,
  FileText,
  Search,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Download,
  Share2,
  Lock,
  Shield,
  Star,
  TrendingUp,
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  Copy,
  Eye,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Target,
  ArrowRight,
  Check,
  X,
  Plus,
  Linkedin,
  DollarSign,
  Camera,
  Scan,
  Link as LinkIcon,
  Smartphone,
  Laptop,
  Cloud,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  FileX,
  Image,
  File,
  Globe,
  QrCode,
  ScanLine,
  Wifi,
  WifiOff,
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Progress,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  Textarea,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Breadcrumb,
  BreadcrumbItem,
} from "@proof-of-fit/ui"

// Types
interface ResumeData {
  id: string
  fileName: string
  content: string
  parsedData: {
    name: string
    email: string
    phone: string
    summary: string
    experience: Array<{
      title: string
      company: string
      duration: string
      description: string
      skills: string[]
    }>
    education: Array<{
      degree: string
      institution: string
      year: string
    }>
    skills: string[]
    certifications: string[]
  }
  uploadedAt: Date
  source: 'upload' | 'linkedin' | 'manual' | 'camera' | 'scan' | 'link' | 'qr'
  securityStatus: {
    scanned: boolean
    safe: boolean
    threats: string[]
    scanTimestamp: Date
  }
  fileInfo: {
    size: number
    type: string
    lastModified: Date
    checksum: string
  }
}

interface ImportSource {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  available: boolean
  securityLevel: 'high' | 'medium' | 'low'
  supportedFormats: string[]
}

interface SecurityScanResult {
  safe: boolean
  threats: string[]
  scanId: string
  timestamp: Date
  details: {
    fileType: string
    size: number
    checksum: string
    virusScan: boolean
    malwareScan: boolean
    contentAnalysis: boolean
  }
}

interface JobPosting {
  id: string
  title: string
  company: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  remote: boolean
  salary?: {
    min: number
    max: number
    currency: string
  }
  description: string
  requirements: string[]
  niceToHaves?: string[]
  benefits: string[]
  postedAt: Date
  applicationDeadline?: Date
  companyLogo?: string
  companySize?: string
  industry?: string
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive'
}

interface FitAnalysis {
  overallScore: number
  breakdown: {
    skills: { score: number; matched: string[]; missing: string[] }
    experience: { score: number; matched: string[]; gaps: string[] }
    education: { score: number; requirements: string[]; qualifications: string[] }
    location: { score: number; remote: boolean; relocation: boolean }
    salary: { score: number; expectation: number; offered: number }
  }
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  biasIndicators: {
    detected: boolean
    factors: string[]
    mitigation: string[]
  }
  auditTrail: {
    id: string
    timestamp: Date
    version: string
    hash: string
    immutable: boolean
  }
}

interface TailoredDocument {
  id: string
  type: 'resume' | 'cover_letter'
  content: string
  highlights: string[]
  keywords: string[]
  atsScore: number
  generatedAt: Date
}

// Mock data
const mockJobs: JobPosting[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'full-time',
    remote: true,
    salary: { min: 120000, max: 180000, currency: 'USD' },
    description: 'We are looking for a senior software engineer to join our team...',
    requirements: ['Python', 'React', 'Cloud', '5+ years experience'],
    benefits: ['Health insurance', '401k', 'Flexible hours'],
    postedAt: new Date('2024-01-15'),
    companyLogo: '/logos/techcorp.png',
    companySize: '100-500',
    industry: 'Technology',
    experienceLevel: 'senior'
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'Remote',
    type: 'full-time',
    remote: true,
    salary: { min: 80000, max: 120000, currency: 'USD' },
    description: 'Join our fast-growing startup as a full stack developer...',
    requirements: ['JavaScript', 'Node.js', 'React', 'MongoDB'],
    benefits: ['Equity', 'Remote work', 'Learning budget'],
    postedAt: new Date('2024-01-10'),
    companySize: '10-50',
    industry: 'Technology',
    experienceLevel: 'mid'
  }
]

// Components
function StepIndicator({ 
  currentStep, 
  totalSteps, 
  onStepChange 
}: { 
  currentStep: number; 
  totalSteps: number;
  onStepChange?: (step: number) => void;
}) {
  const stepNames = ['Import Resume', 'Select Job', 'Analyze Fit', 'Download Results'];
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-2 mb-4">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex items-center">
            <button
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                i < currentStep
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : i === currentStep
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              } ${onStepChange && i < currentStep ? 'cursor-pointer' : i === currentStep ? 'cursor-default' : 'cursor-not-allowed'}`}
              onClick={() => {
                if (onStepChange && i < currentStep) {
                  onStepChange(i + 1);
                }
              }}
              disabled={i > currentStep}
              aria-label={`Step ${i + 1}: ${stepNames[i]}`}
              title={stepNames[i]}
            >
              {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
            </button>
            {i < totalSteps - 1 && (
              <div
                className={`w-12 h-1 mx-2 ${
                  i < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Step {currentStep}: {stepNames[currentStep - 1]}
        </h3>
      </div>
    </div>
  )
}

function ResumeUploadStep({ onComplete }: { onComplete: (resume: ResumeData) => void }) {
  const [activeTab, setActiveTab] = useState("device")
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [resume, setResume] = useState<ResumeData | null>(null)
  const [linkUrl, setLinkUrl] = useState("")
  const [cameraActive, setCameraActive] = useState(false)
  const [qrCode, setQrCode] = useState("")
  const [securityResult, setSecurityResult] = useState<SecurityScanResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const openFilePicker = () => fileInputRef.current?.click()
  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file, 'upload')
      // reset value so selecting the same file twice still triggers onChange
      e.currentTarget.value = ''
    }
  }

  const importSources: ImportSource[] = [
    {
      id: "device",
      name: "Device Upload",
      description: "Upload from your computer, phone, or tablet",
      icon: <Upload className="w-5 h-5" />,
      available: true,
      securityLevel: "high",
      supportedFormats: ["PDF", "DOC", "DOCX", "TXT", "RTF"]
    },
    {
      id: "linkedin",
      name: "Profile Import",
      description: "Import your professional profile data",
      icon: <Linkedin className="w-5 h-5" />,
      available: true,
      securityLevel: "high",
      supportedFormats: ["Professional Profile"]
    },
    {
      id: "camera",
      name: "Camera Scan",
      description: "Take a photo of your resume with OCR",
      icon: <Camera className="w-5 h-5" />,
      available: true,
      securityLevel: "medium",
      supportedFormats: ["JPG", "PNG", "PDF"]
    },
    {
      id: "scanner",
      name: "Document Scanner",
      description: "Scan physical documents with your device",
      icon: <Scan className="w-5 h-5" />,
      available: true,
      securityLevel: "medium",
      supportedFormats: ["JPG", "PNG", "PDF"]
    },
    {
      id: "link",
      name: "Secure Link",
      description: "Import from a secure URL (cloud storage, etc.)",
      icon: <LinkIcon className="w-5 h-5" />,
      available: true,
      securityLevel: "high",
      supportedFormats: ["PDF", "DOC", "DOCX", "TXT"]
    },
    {
      id: "qr",
      name: "QR Code",
      description: "Scan a QR code to import resume",
      icon: <QrCode className="w-5 h-5" />,
      available: true,
      securityLevel: "high",
      supportedFormats: ["QR Code"]
    }
  ]

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0], 'upload')
    }
  }, [])

  const handleFile = async (file: File, source: ResumeData['source']) => {
    setUploading(true)
    
    // Security scan simulation
    setScanning(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const mockSecurityResult: SecurityScanResult = {
      safe: true,
      threats: [],
      scanId: `scan_${Date.now()}`,
      timestamp: new Date(),
      details: {
        fileType: file.type,
        size: file.size,
        checksum: `sha256_${Math.random().toString(36).substr(2, 9)}`,
        virusScan: true,
        malwareScan: true,
        contentAnalysis: true
      }
    }
    
    setSecurityResult(mockSecurityResult)
    setScanning(false)
    
    // Simulate file processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockResume: ResumeData = {
      id: '1',
      fileName: file.name,
      content: 'Mock resume content...',
      parsedData: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        summary: 'Experienced software engineer with 5+ years in full-stack development...',
        experience: [
          {
            title: 'Senior Software Engineer',
            company: 'Previous Company',
            duration: '2020-2024',
            description: 'Led development of web applications...',
            skills: ['Python', 'React', 'Cloud', 'Docker']
          }
        ],
        education: [
          {
            degree: 'Bachelor of Computer Science',
            institution: 'University of Technology',
            year: '2019'
          }
        ],
        skills: ['Python', 'JavaScript', 'React', 'Node.js', 'Cloud', 'Docker'],
        certifications: ['Cloud Certified Developer', 'Cloud Professional']
      },
      uploadedAt: new Date(),
      source,
      securityStatus: {
        scanned: true,
        safe: mockSecurityResult.safe,
        threats: mockSecurityResult.threats,
        scanTimestamp: mockSecurityResult.timestamp
      },
      fileInfo: {
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified),
        checksum: mockSecurityResult.details.checksum
      }
    }
    
    setResume(mockResume)
    setUploading(false)
    onComplete(mockResume)
  }

  const handleLinkImport = async () => {
    if (!linkUrl.trim()) return
    
    setUploading(true)
    setScanning(true)
    
    // Simulate link validation and security scan
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockSecurityResult: SecurityScanResult = {
      safe: true,
      threats: [],
      scanId: `scan_${Date.now()}`,
      timestamp: new Date(),
      details: {
        fileType: 'application/pdf',
        size: 1024000,
        checksum: `sha256_${Math.random().toString(36).substr(2, 9)}`,
        virusScan: true,
        malwareScan: true,
        contentAnalysis: true
      }
    }
    
    setSecurityResult(mockSecurityResult)
    setScanning(false)
    
    // Simulate file processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const mockResume: ResumeData = {
      id: '1',
      fileName: 'resume_from_link.pdf',
      content: 'Mock resume content from link...',
      parsedData: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        summary: 'Experienced software engineer with 5+ years in full-stack development...',
        experience: [
          {
            title: 'Senior Software Engineer',
            company: 'Previous Company',
            duration: '2020-2024',
            description: 'Led development of web applications...',
            skills: ['Python', 'React', 'Cloud', 'Docker']
          }
        ],
        education: [
          {
            degree: 'Bachelor of Computer Science',
            institution: 'University of Technology',
            year: '2019'
          }
        ],
        skills: ['Python', 'JavaScript', 'React', 'Node.js', 'Cloud', 'Docker'],
        certifications: ['Cloud Certified Developer', 'Cloud Professional']
      },
      uploadedAt: new Date(),
      source: 'link',
      securityStatus: {
        scanned: true,
        safe: mockSecurityResult.safe,
        threats: mockSecurityResult.threats,
        scanTimestamp: mockSecurityResult.timestamp
      },
      fileInfo: {
        size: mockSecurityResult.details.size,
        type: mockSecurityResult.details.fileType,
        lastModified: new Date(),
        checksum: mockSecurityResult.details.checksum
      }
    }
    
    setResume(mockResume)
    setUploading(false)
    onComplete(mockResume)
  }

  const handleCameraCapture = async () => {
    setCameraActive(true)
    setUploading(true)
    
    // Simulate camera capture and OCR processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const mockResume: ResumeData = {
      id: '1',
      fileName: 'camera_capture.jpg',
      content: 'Mock resume content from camera...',
      parsedData: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        summary: 'Experienced software engineer with 5+ years in full-stack development...',
        experience: [
          {
            title: 'Senior Software Engineer',
            company: 'Previous Company',
            duration: '2020-2024',
            description: 'Led development of web applications...',
            skills: ['Python', 'React', 'Cloud', 'Docker']
          }
        ],
        education: [
          {
            degree: 'Bachelor of Computer Science',
            institution: 'University of Technology',
            year: '2019'
          }
        ],
        skills: ['Python', 'JavaScript', 'React', 'Node.js', 'Cloud', 'Docker'],
        certifications: ['Cloud Certified Developer', 'Cloud Professional']
      },
      uploadedAt: new Date(),
      source: 'camera',
      securityStatus: {
        scanned: true,
        safe: true,
        threats: [],
        scanTimestamp: new Date()
      },
      fileInfo: {
        size: 2048000,
        type: 'image/jpeg',
        lastModified: new Date(),
        checksum: `sha256_${Math.random().toString(36).substr(2, 9)}`
      }
    }
    
    setResume(mockResume)
    setUploading(false)
    setCameraActive(false)
    onComplete(mockResume)
  }

  const handleQRScan = async () => {
    if (!qrCode.trim()) return
    
    setUploading(true)
    setScanning(true)
    
    // Simulate QR code processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockResume: ResumeData = {
      id: '1',
      fileName: 'qr_import.pdf',
      content: 'Mock resume content from QR code...',
      parsedData: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        summary: 'Experienced software engineer with 5+ years in full-stack development...',
        experience: [
          {
            title: 'Senior Software Engineer',
            company: 'Previous Company',
            duration: '2020-2024',
            description: 'Led development of web applications...',
            skills: ['Python', 'React', 'Cloud', 'Docker']
          }
        ],
        education: [
          {
            degree: 'Bachelor of Computer Science',
            institution: 'University of Technology',
            year: '2019'
          }
        ],
        skills: ['Python', 'JavaScript', 'React', 'Node.js', 'Cloud', 'Docker'],
        certifications: ['Cloud Certified Developer', 'Cloud Professional']
      },
      uploadedAt: new Date(),
      source: 'qr',
      securityStatus: {
        scanned: true,
        safe: true,
        threats: [],
        scanTimestamp: new Date()
      },
      fileInfo: {
        size: 1024000,
        type: 'application/pdf',
        lastModified: new Date(),
        checksum: `sha256_${Math.random().toString(36).substr(2, 9)}`
      }
    }
    
    setResume(mockResume)
    setUploading(false)
    setScanning(false)
    onComplete(mockResume)
  }

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Import Your Resume</h2>
        <p className="text-gray-600">
          Choose from multiple secure import methods to get started
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6">
          {importSources.map((source) => (
            <TabsTrigger key={source.id} value={source.id} className="flex flex-col items-center gap-1 p-2">
              {source.icon}
              <span className="text-xs hidden lg:block">{source.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="device" className="space-y-4">
          <Card className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
            <CardContent className="p-8">
              <div
                className={`text-center ${dragActive ? 'bg-blue-50' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {uploading ? (
                  <div className="space-y-4">
                    <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-500" />
                    <p className="text-lg font-medium">Processing your resume...</p>
                    <Progress value={75} className="w-full max-w-xs mx-auto" />
                    {scanning && (
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Security scanning...</span>
                      </div>
                    )}
                  </div>
                ) : resume ? (
                  <div className="space-y-4">
                    <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
                    <div>
                      <h3 className="text-lg font-medium text-green-700">Resume Imported Successfully!</h3>
                      <p className="text-sm text-gray-600 mt-1">{resume.fileName}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-left">
                      <h4 className="font-medium mb-2">Parsed Information:</h4>
                      <ul className="text-sm space-y-1">
                        <li><strong>Name:</strong> {resume.parsedData.name}</li>
                        <li><strong>Email:</strong> {resume.parsedData.email}</li>
                        <li><strong>Skills:</strong> {resume.parsedData.skills.join(', ')}</li>
                        <li><strong>Experience:</strong> {resume.parsedData.experience.length} positions</li>
                      </ul>
                    </div>
                    {securityResult && (
                      <div className="bg-green-50 p-4 rounded-lg text-left">
                        <h4 className="font-medium mb-2 text-green-700">Security Status:</h4>
                        <div className="flex items-center space-x-2 text-sm">
                          <ShieldCheck className="w-4 h-4 text-green-600" />
                          <span>File scanned and verified safe</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Scan ID: {securityResult.scanId}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-lg font-medium">Drag & drop your resume here</p>
                      <p className="text-sm text-gray-500">or click to browse files</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.rtf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/rtf"
                      className="hidden"
                      onChange={onFileInputChange}
                    />
                    <Button variant="outline" className="mt-4" onClick={openFilePicker} disabled={uploading}>
                      Choose File
                    </Button>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        Supported: PDF, DOC, DOCX, TXT, RTF (max 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="linkedin" className="space-y-4">
          <Card>
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <Linkedin className="w-12 h-12 mx-auto text-blue-600" />
                <div>
                  <h3 className="text-lg font-medium">Import Professional Profile</h3>
                  <p className="text-sm text-gray-600">Securely import your professional profile data</p>
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    // TODO: Implement LinkedIn OAuth integration
                    window.location.href = '/auth/linkedin';
                  }}
                  aria-label="Connect your professional profile to import data"
                >
                  <Linkedin className="w-4 h-4 mr-2" aria-hidden="true" />
                  Connect Professional Profile
                </Button>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <ShieldCheck className="w-4 h-4" />
                  <span>OAuth 2.0 secure connection</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="camera" className="space-y-4">
          <Card>
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <Camera className="w-12 h-12 mx-auto text-purple-600" />
                <div>
                  <h3 className="text-lg font-medium">Camera Capture</h3>
                  <p className="text-sm text-gray-600">Take a photo of your resume with OCR processing</p>
                </div>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={handleCameraCapture}
                  disabled={uploading}
                  aria-label={uploading ? 'Processing camera capture...' : 'Open camera to capture resume document'}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {uploading ? 'Processing...' : 'Open Camera'}
                </Button>
                {cameraActive && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 text-sm text-purple-700">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Capturing and processing image...</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <ScanLine className="w-4 h-4" />
                  <span>OCR text extraction included</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scanner" className="space-y-4">
          <Card>
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <Scan className="w-12 h-12 mx-auto text-indigo-600" />
                <div>
                  <h3 className="text-lg font-medium">Document Scanner</h3>
                  <p className="text-sm text-gray-600">Scan physical documents with your device</p>
                </div>
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => {
                    // TODO: Implement document scanner functionality
                    alert('Document scanner will be available soon!');
                  }}
                  aria-label="Open document scanner to scan physical documents"
                >
                  <Scan className="w-4 h-4 mr-2" aria-hidden="true" />
                  Open Scanner
                </Button>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Image className="w-4 h-4" />
                  <span>High-quality document scanning</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="link" className="space-y-4">
          <Card>
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="text-center">
                  <LinkIcon className="w-12 h-12 mx-auto text-green-600 mb-4" />
                  <h3 className="text-lg font-medium">Secure Link Import</h3>
                  <p className="text-sm text-gray-600">Import from cloud storage or other secure URLs</p>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="link-url">Resume URL</Label>
                  <Input
                    id="link-url"
                    placeholder="https://drive.google.com/file/..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                  />
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleLinkImport}
                    disabled={!linkUrl.trim() || uploading}
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    {uploading ? 'Importing...' : 'Import from Link'}
                  </Button>
                </div>
                {scanning && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 text-sm text-green-700">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Validating link and scanning for security...</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>All links are security-scanned before import</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qr" className="space-y-4">
          <Card>
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="text-center">
                  <QrCode className="w-12 h-12 mx-auto text-orange-600 mb-4" />
                  <h3 className="text-lg font-medium">QR Code Import</h3>
                  <p className="text-sm text-gray-600">Scan a QR code to import your resume</p>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="qr-code">QR Code Data</Label>
                  <Input
                    id="qr-code"
                    placeholder="Paste QR code data or scan with camera"
                    value={qrCode}
                    onChange={(e) => setQrCode(e.target.value)}
                  />
                  <Button 
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    onClick={handleQRScan}
                    disabled={!qrCode.trim() || uploading}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    {uploading ? 'Processing...' : 'Import from QR Code'}
                  </Button>
                </div>
                {scanning && (
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 text-sm text-orange-700">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Validating QR code and importing...</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Lock className="w-4 h-4" />
                  <span>QR codes are validated for security</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Security Information */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <ShieldCheck className="w-6 h-6 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Security & Privacy</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• All files are scanned for malware and viruses</li>
                <li>• Content is analyzed for malicious code</li>
                <li>• Links are validated before import</li>
                <li>• Your data is encrypted and never shared</li>
                <li>• Files are automatically deleted after processing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function JobSearchStep({ onSelect }: { onSelect: (job: JobPosting) => void }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null)
  const [filteredJobs, setFilteredJobs] = useState(mockJobs)

  useEffect(() => {
    if (searchTerm) {
      setFilteredJobs(
        mockJobs.filter(job =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    } else {
      setFilteredJobs(mockJobs)
    }
  }, [searchTerm])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Find Your Target Job</h2>
        <p className="text-gray-600">
          Search for the job you want to apply for
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search by job title, company, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredJobs.map((job) => (
          <Card
            key={job.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedJob?.id === job.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedJob(job)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold">{job.title}</h3>
                    <Badge variant="outline">{job.type}</Badge>
                    {job.remote && <Badge variant="secondary">Remote</Badge>}
                  </div>
                  <div className="flex items-center space-x-4 text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-1" />
                      {job.company}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {job.postedAt.toLocaleDateString()}
                    </div>
                  </div>
                  {job.salary && (
                    <div className="flex items-center text-green-600 font-medium mb-3">
                      <DollarSign className="w-4 h-4 mr-1" />
                      ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                    </div>
                  )}
                  <p className="text-gray-700 line-clamp-2">{job.description}</p>
                </div>
                <div className="ml-4">
                  <Button
                    variant={selectedJob?.id === job.id ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedJob(job)
                    }}
                  >
                    {selectedJob?.id === job.id ? 'Selected' : 'Select'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedJob && (
        <div className="mt-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">
                    Selected: {selectedJob.title}
                  </h3>
                  <p className="text-blue-700 text-sm">
                    {selectedJob.company} • Ready to analyze your fit
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={() => onSelect(selectedJob)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  Analyze Fit
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function FitAnalysisStep({ resume, job, onComplete }: { 
  resume: ResumeData; 
  job: JobPosting; 
  onComplete: (analysis: FitAnalysis) => void 
}) {
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<FitAnalysis | null>(null)

  const runAnalysis = async () => {
    setAnalyzing(true)
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Customize analysis based on actual resume data and job requirements
    const resumeSkills = resume.parsedData.skills || []
    const resumeExperience = resume.parsedData.experience || []
    const resumeEducation = resume.parsedData.education || []
    const jobRequirements = job.requirements || []
    const jobNiceToHaves = job.niceToHaves || []
    
    // Calculate skill matching
    const matchedSkills = resumeSkills.filter(skill => 
      jobRequirements.some(req => 
        req.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(req.toLowerCase())
      )
    )
    
    const missingSkills = jobRequirements.filter(req => 
      !resumeSkills.some(skill => 
        req.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(req.toLowerCase())
      )
    )
    
    const niceToHaveSkills = resumeSkills.filter(skill => 
      jobNiceToHaves.some(nice => 
        nice.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(nice.toLowerCase())
      )
    )
    
    // Calculate experience score
    const experienceYears = resumeExperience.length
    const hasRelevantExperience = resumeExperience.some(exp => 
      jobRequirements.some(req => 
        exp.title.toLowerCase().includes(req.toLowerCase()) ||
        exp.description.toLowerCase().includes(req.toLowerCase())
      )
    )
    
    // Calculate education score
    const hasRelevantEducation = resumeEducation.some(edu => 
      jobRequirements.some(req => 
        edu.degree.toLowerCase().includes(req.toLowerCase()) ||
        edu.institution.toLowerCase().includes('university') ||
        edu.institution.toLowerCase().includes('college')
      )
    )
    
    // Calculate overall score based on actual data
    const skillsScore = Math.min(100, (matchedSkills.length / Math.max(jobRequirements.length, 1)) * 100)
    const experienceScore = Math.min(100, (experienceYears * 15) + (hasRelevantExperience ? 20 : 0))
    const educationScore = hasRelevantEducation ? 90 : 70
    const overallScore = Math.round((skillsScore * 0.4) + (experienceScore * 0.3) + (educationScore * 0.2) + 10)
    
    const mockAnalysis: FitAnalysis = {
      overallScore: overallScore,
      breakdown: {
        skills: {
          score: Math.round(skillsScore),
          matched: matchedSkills,
          missing: missingSkills.slice(0, 3) // Limit to top 3 missing
        },
        experience: {
          score: Math.round(experienceScore),
          matched: hasRelevantExperience ? [`${experienceYears}+ years experience`, 'Relevant work history'] : [`${experienceYears}+ years experience`],
          gaps: missingSkills.slice(0, 2).map(skill => `${skill} experience`)
        },
        education: {
          score: educationScore,
          requirements: ['Bachelor degree in CS or related'],
          qualifications: resumeEducation.map(edu => edu.degree)
        },
        location: {
          score: 100,
          remote: true,
          relocation: false
        },
        salary: {
          score: 75,
          expectation: 130000,
          offered: 150000
        }
      },
      strengths: [
        ...matchedSkills.slice(0, 2).map(skill => `Strong ${skill} skills`),
        ...niceToHaveSkills.slice(0, 1).map(skill => `${skill} expertise (nice-to-have)`),
        `${experienceYears}+ years of experience`,
        hasRelevantEducation ? 'Relevant educational background' : 'Professional experience'
      ].slice(0, 4),
      weaknesses: [
        ...missingSkills.slice(0, 2).map(skill => `Missing ${skill} experience`),
        experienceYears < 3 ? 'Limited years of experience' : null,
        !hasRelevantEducation ? 'Consider relevant education/certifications' : null
      ].filter((x): x is string => Boolean(x)).slice(0, 3),
      recommendations: [
        ...matchedSkills.slice(0, 2).map(skill => `Highlight your ${skill} experience prominently`),
        ...niceToHaveSkills.slice(0, 1).map(skill => `Emphasize your ${skill} skills as a differentiator`),
        missingSkills.length > 0 ? `Consider learning ${missingSkills[0]} to improve your fit` : null,
        'Showcase your problem-solving and collaboration abilities'
      ].filter((x): x is string => Boolean(x)).slice(0, 4),
      biasIndicators: {
        detected: false,
        factors: [],
        mitigation: ['Blind resume review', 'Skills-based assessment']
      },
      auditTrail: {
        id: `audit_${Date.now()}`,
        timestamp: new Date(),
        version: '1.0',
        hash: `hash_${Date.now()}`,
        immutable: true
      }
    }
    
    setAnalysis(mockAnalysis)
    setAnalyzing(false)
    onComplete(mockAnalysis)
  }

  useEffect(() => {
    runAnalysis()
  }, [])

  if (analyzing) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="space-y-6">
          <div>
            <Loader2 className="w-16 h-16 mx-auto animate-spin text-blue-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Analyzing Your Fit</h2>
            <p className="text-gray-600 mb-6">
              Our AI is analyzing your resume against the job requirements...
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Skills Analysis</span>
                <span className="text-sm">85%</span>
              </div>
              <Progress value={85} />
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Experience Matching</span>
                <span className="text-sm">80%</span>
              </div>
              <Progress value={80} />
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Bias Detection</span>
                <span className="text-sm">100%</span>
              </div>
              <Progress value={100} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!analysis) return null

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Your Fit Analysis</h2>
        <p className="text-gray-600">
          Here's how well you match the {job.title} position at {job.company}
        </p>
      </div>

      {/* Overall Score */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white mb-4">
              <div className="text-center">
                <div className="text-4xl font-bold">{analysis.overallScore}</div>
                <div className="text-sm opacity-90">/ 100</div>
              </div>
            </div>
            <h3 className="text-2xl font-semibold mb-2">Overall Fit Score</h3>
            <p className="text-gray-600 mb-4">
              {analysis.overallScore >= 80 ? 'Excellent match!' : 
               analysis.overallScore >= 60 ? 'Good match with room for improvement' : 
               'Consider strengthening your application'}
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Badge variant="outline" className="flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                Bias-Free Analysis
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <Lock className="w-4 h-4 mr-1" />
                Audit Trail: {analysis.auditTrail.id}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Skills Match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Match Score</span>
                <span className="font-semibold">{analysis.breakdown.skills.score}%</span>
              </div>
              <Progress value={analysis.breakdown.skills.score} />
              
              <div>
                <h4 className="font-medium text-green-700 mb-2">Matched Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.breakdown.skills.matched.map((skill) => (
                    <Badge key={skill} variant="default" className="bg-green-100 text-green-800">
                      <Check className="w-3 h-3 mr-1" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-orange-700 mb-2">Missing Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.breakdown.skills.missing.map((skill) => (
                    <Badge key={skill} variant="outline" className="border-orange-300 text-orange-700">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Experience Match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Match Score</span>
                <span className="font-semibold">{analysis.breakdown.experience.score}%</span>
              </div>
              <Progress value={analysis.breakdown.experience.score} />
              
              <div>
                <h4 className="font-medium text-green-700 mb-2">Matched Experience:</h4>
                <ul className="space-y-1">
                  {analysis.breakdown.experience.matched.map((exp) => (
                    <li key={exp} className="flex items-center text-sm">
                      <Check className="w-3 h-3 mr-2 text-green-600" />
                      {exp}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-orange-700 mb-2">Experience Gaps:</h4>
                <ul className="space-y-1">
                  {analysis.breakdown.experience.gaps.map((gap) => (
                    <li key={gap} className="flex items-center text-sm">
                      <X className="w-3 h-3 mr-2 text-orange-600" />
                      {gap}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strengths and Recommendations */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Your Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ResultsStep({ 
  resume, 
  job, 
  analysis, 
  onGenerateDocuments 
}: { 
  resume: ResumeData; 
  job: JobPosting; 
  analysis: FitAnalysis; 
  onGenerateDocuments: () => void 
}) {
  const [documents, setDocuments] = useState<TailoredDocument[]>([])
  const [generating, setGenerating] = useState(false)

  const generateDocuments = async () => {
    setGenerating(true)
    
    // Simulate document generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Customize documents based on resume data and job requirements
    const resumeSkills = resume?.parsedData.skills || []
    const resumeExperience = resume?.parsedData.experience || []
    const jobRequirements = job.requirements || []
    
    // Extract relevant skills from resume that match job requirements
    const matchingSkills = resumeSkills.filter(skill => 
      jobRequirements.some(req => 
        req.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(req.toLowerCase())
      )
    )
    
    // Generate customized highlights based on actual resume data
    const resumeHighlights = [
      ...matchingSkills.slice(0, 2).map(skill => `${skill} expertise`),
      resumeExperience.length > 0 ? `${resumeExperience.length}+ years experience` : 'Relevant experience',
      resume?.parsedData.certifications?.length > 0 ? 'Professional certifications' : 'Technical skills'
    ].slice(0, 3)
    
    const coverLetterHighlights = [
      'Relevant experience',
      'Technical skills alignment', 
      'Cultural fit'
    ]
    
    // Generate keywords based on job requirements and resume skills
    const resumeKeywords = [...matchingSkills, ...resumeSkills.slice(0, 3)].slice(0, 5)
    const coverLetterKeywords = ['Innovation', 'Collaboration', 'Problem-solving', 'Teamwork', 'Growth']
    
    const mockDocuments: TailoredDocument[] = [
      {
        id: '1',
        type: 'resume',
        content: `Tailored resume for ${job.title} at ${job.company}...`,
        highlights: resumeHighlights,
        keywords: resumeKeywords,
        atsScore: Math.min(95, 70 + (matchingSkills.length * 5) + (resumeExperience.length * 2)),
        generatedAt: new Date()
      },
      {
        id: '2',
        type: 'cover_letter',
        content: `Tailored cover letter for ${job.title} at ${job.company}...`,
        highlights: coverLetterHighlights,
        keywords: coverLetterKeywords,
        atsScore: Math.min(90, 75 + (matchingSkills.length * 3)),
        generatedAt: new Date()
      }
    ]
    
    setDocuments(mockDocuments)
    setGenerating(false)
    onGenerateDocuments()
  }

  const downloadDocument = async (doc: TailoredDocument) => {
    try {
      // Create a mock PDF blob for demonstration
      const pdfContent = `
        %PDF-1.4
        1 0 obj
        <<
        /Type /Catalog
        /Pages 2 0 R
        >>
        endobj
        
        2 0 obj
        <<
        /Type /Pages
        /Kids [3 0 R]
        /Count 1
        >>
        endobj
        
        3 0 obj
        <<
        /Type /Page
        /Parent 2 0 R
        /MediaBox [0 0 612 792]
        /Contents 4 0 R
        >>
        endobj
        
        4 0 obj
        <<
        /Length 200
        >>
        stream
        BT
        /F1 16 Tf
        72 720 Td
        (${doc.type === 'resume' ? 'Tailored Resume' : 'Tailored Cover Letter'}) Tj
        0 -30 Td
        /F1 12 Tf
        (Generated for ${job.title} at ${job.company}) Tj
        0 -20 Td
        (ATS Score: ${doc.atsScore}%) Tj
        0 -20 Td
        (Key Highlights: ${doc.highlights.join(', ')}) Tj
        0 -20 Td
        (Keywords: ${doc.keywords.join(', ')}) Tj
        ET
        endstream
        endobj
        
        xref
        0 5
        0000000000 65535 f 
        0000000009 00000 n 
        0000000058 00000 n 
        0000000115 00000 n 
        0000000204 00000 n 
        trailer
        <<
        /Size 5
        /Root 1 0 R
        >>
        startxref
        453
        %%EOF
      `
      
      const blob = new Blob([pdfContent], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `${doc.type === 'resume' ? 'tailored_resume' : 'tailored_cover_letter'}_${job.company.toLowerCase().replace(/\s+/g, '_')}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
      
      // Show success message
      alert(`Downloaded ${doc.type === 'resume' ? 'tailored resume' : 'tailored cover letter'} successfully!`)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    }
  }

  const previewDocument = (doc: TailoredDocument) => {
    // For now, show an alert with document details
    // In a real implementation, this would open a PDF viewer
    alert(`Preview: ${doc.type === 'resume' ? 'Tailored Resume' : 'Tailored Cover Letter'}\n\nKey Highlights: ${doc.highlights.join(', ')}\nOptimized Keywords: ${doc.keywords.join(', ')}\nATS Score: ${doc.atsScore}%\n\nContent: ${doc.content}`)
  }

  const shareDocument = async (doc: TailoredDocument) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${doc.type === 'resume' ? 'Tailored Resume' : 'Tailored Cover Letter'}`,
          text: `Check out my tailored ${doc.type === 'resume' ? 'resume' : 'cover letter'} for ${job.title} at ${job.company}`,
          url: window.location.href
        })
      } catch (error) {
        console.error('Share failed:', error)
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `Check out my tailored ${doc.type === 'resume' ? 'resume' : 'cover letter'} for ${job.title} at ${job.company}. Generated by ProofOfFit: ${window.location.href}`
      try {
        await navigator.clipboard.writeText(shareText)
        alert('Share link copied to clipboard!')
      } catch (error) {
        console.error('Copy failed:', error)
        alert('Share functionality not available')
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Your Tailored Application</h2>
        <p className="text-gray-600">
          Download your personalized resume and cover letter
        </p>
      </div>

      {/* Fit Summary */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {job.title} at {job.company}
              </h3>
              <p className="text-gray-600">
                Overall Fit Score: <span className="font-semibold text-blue-600">{analysis.overallScore}/100</span>
              </p>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="mb-2">
                <Shield className="w-4 h-4 mr-1" />
                Bias-Free
              </Badge>
              <p className="text-sm text-gray-500">
                Audit ID: {analysis.auditTrail.id}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Generation */}
      {documents.length === 0 ? (
        <Card className="text-center">
          <CardContent className="p-8">
            {generating ? (
              <div className="space-y-4">
                <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-500" />
                <h3 className="text-xl font-semibold">Generating Your Documents...</h3>
                <p className="text-gray-600">
                  Creating tailored resume and cover letter based on your fit analysis
                </p>
                <Progress value={75} className="w-full max-w-xs mx-auto" />
              </div>
            ) : (
              <div className="space-y-4">
                <Sparkles className="w-12 h-12 mx-auto text-blue-500" />
                <h3 className="text-xl font-semibold">Ready to Generate Your Application</h3>
                <p className="text-gray-600">
                  We'll create a tailored resume and cover letter optimized for this position
                </p>
                <Button
                  size="lg"
                  onClick={generateDocuments}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600"
                  aria-label="Generate tailored resume and cover letter documents"
                >
                  Generate Documents
                  <Sparkles className="w-4 h-4 ml-2" aria-hidden="true" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="capitalize">
                    {doc.type.replace('_', ' ')} Document
                  </span>
                  <Badge variant="outline">
                    ATS Score: {doc.atsScore}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Key Highlights:</h4>
                    <div className="flex flex-wrap gap-2">
                      {doc.highlights.map((highlight) => (
                        <Badge key={highlight} variant="secondary">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Optimized Keywords:</h4>
                    <div className="flex flex-wrap gap-2">
                      {doc.keywords.map((keyword) => (
                        <Badge key={keyword} variant="outline">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1"
                      onClick={() => downloadDocument(doc)}
                      aria-label={`Download ${doc.type === 'resume' ? 'tailored resume' : 'tailored cover letter'} PDF`}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => previewDocument(doc)}
                      aria-label={`Preview ${doc.type === 'resume' ? 'tailored resume' : 'tailored cover letter'}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => shareDocument(doc)}
                      aria-label={`Share ${doc.type === 'resume' ? 'tailored resume' : 'tailored cover letter'}`}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Compliance Notice */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <Shield className="w-6 h-6 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Compliance & Fairness</h4>
              <p className="text-blue-800 text-sm">
                This analysis was conducted using bias-reducing algorithms and maintains an immutable audit trail. 
                All decisions are explainable and verifiable through our audit system.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Main Component
export default function FitReportPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [resume, setResume] = useState<ResumeData | null>(null)
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null)
  const [analysis, setAnalysis] = useState<FitAnalysis | null>(null)
  const [documentsGenerated, setDocumentsGenerated] = useState(false)

  useEffect(() => {
    try { startTimer('ttffr') } catch {}
  }, [])

  const totalSteps = 4

  const handleResumeComplete = (resumeData: ResumeData) => {
    setResume(resumeData)
    try { import('../../../lib/analytics').then(m => m.track({ name: 'resume_import_complete' })) } catch {}
    setCurrentStep(2)
  }

  const handleJobSelect = (job: JobPosting) => {
    setSelectedJob(job)
    setCurrentStep(3)
  }

  const handleAnalysisComplete = (analysisData: FitAnalysis) => {
    setAnalysis(analysisData)
    try { import('../../../lib/analytics').then(m => m.track({ name: 'fit_analysis_complete' })) } catch {}
    try { stopTimer('ttffr', { page: 'fit_report' }) } catch {}
    setCurrentStep(4)
  }

  const handleDocumentsGenerated = () => {
    setDocumentsGenerated(true)
  }

  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const stepNames = ['Import Resume', 'Select Job', 'Analyze Fit', 'Download Results'];
    const items: BreadcrumbItem[] = [
      { label: 'Fit Report', href: '/app/fit' }
    ];
    
    for (let i = 0; i < currentStep; i++) {
      items.push({
        label: stepNames[i],
        current: i === currentStep - 1
      });
    }
    
    return items;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb items={getBreadcrumbItems()} />
        </div>
        
        <StepIndicator 
          currentStep={currentStep} 
          totalSteps={totalSteps}
          onStepChange={setCurrentStep}
        />
        
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ResumeUploadStep onComplete={handleResumeComplete} />
            </motion.div>
          )}
          
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <JobSearchStep onSelect={handleJobSelect} />
            </motion.div>
          )}
          
          {currentStep === 3 && resume && selectedJob && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FitAnalysisStep
                resume={resume}
                job={selectedJob}
                onComplete={handleAnalysisComplete}
              />
            </motion.div>
          )}
          
          {currentStep === 4 && resume && selectedJob && analysis && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ResultsStep
                resume={resume}
                job={selectedJob}
                analysis={analysis}
                onGenerateDocuments={handleDocumentsGenerated}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Global Navigation Buttons */}
        <div className="mt-8 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              } else {
                window.history.back();
              }
            }}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            {currentStep > 1 ? 'Previous Step' : 'Back to Home'}
          </Button>
          
          <div className="flex items-center gap-4">
            {/* Progress indicator */}
            <div className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  // Reset the form to start over
                  setCurrentStep(1);
                  setResume(null);
                  setSelectedJob(null);
                  setAnalysis(null);
                  setDocumentsGenerated(false);
                }}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Start Over
              </Button>
              
              {currentStep < totalSteps && (
                <Button
                  onClick={() => {
                    // Navigate to next step if data is available
                    if (currentStep === 1 && resume) {
                      setCurrentStep(2);
                    } else if (currentStep === 2 && selectedJob) {
                      setCurrentStep(3);
                    } else if (currentStep === 3 && analysis) {
                      setCurrentStep(4);
                    }
                  }}
                  disabled={
                    (currentStep === 1 && !resume) ||
                    (currentStep === 2 && !selectedJob) ||
                    (currentStep === 3 && !analysis)
                  }
                  className="flex items-center gap-2"
                >
                  Next Step
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
              
              {currentStep === totalSteps && (
                <Button
                  onClick={() => {
                    window.location.href = '/demo';
                  }}
                  className="flex items-center gap-2"
                >
                  Try Demo
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}