'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Upload, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Globe, 
  Linkedin, 
  Github, 
  Twitter,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'

// Simple toast implementation
const toast = {
  // eslint-disable-next-line no-console
  success: (message: string) => console.log('Success:', message),
  // eslint-disable-next-line no-console
  error: (message: string) => console.error('Error:', message)
}

type Experience = {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

type Education = {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  current: boolean
}

type Skill = {
  id: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

export default function CandidateProfilePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  // Profile data
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Experienced software developer with 5+ years of expertise in full-stack development. Passionate about building scalable applications and leading development teams.',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    website: 'https://johndoe.dev'
  })
  
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: '1',
      company: 'TechCorp Inc.',
      position: 'Senior Software Engineer',
      startDate: '2022-01',
      endDate: '',
      current: true,
      description: 'Led development of React-based applications serving 100K+ users. Implemented modern state management solutions and mentored junior developers.'
    },
    {
      id: '2',
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      startDate: '2020-03',
      endDate: '2021-12',
      current: false,
      description: 'Built responsive web applications using React and Node.js. Optimized application performance resulting in 40% faster load times.'
    }
  ])
  
  const [educations, setEducations] = useState<Education[]>([
    {
      id: '1',
      institution: 'University of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2016-09',
      endDate: '2020-05',
      current: false
    }
  ])
  
  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', name: 'React', level: 'expert' },
    { id: '2', name: 'TypeScript', level: 'advanced' },
    { id: '3', name: 'Node.js', level: 'advanced' },
    { id: '4', name: 'Python', level: 'intermediate' },
    { id: '5', name: 'AWS', level: 'intermediate' }
  ])

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth-token')
        if (token) {
          setIsAuthenticated(true)
        } else {
          router.push('/auth/signin?redirect=/candidate/profile&type=seeker')
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Auth check failed:', error)
        router.push('/auth/signin?redirect=/candidate/profile&type=seeker')
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [router])

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Don't render the main content if not authenticated
  if (!isAuthenticated) {
    return null
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
    setExperiences([...experiences, newExperience])
  }

  const handleUpdateExperience = (id: string, field: keyof Experience, value: any) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ))
  }

  const handleRemoveExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id))
  }

  const handleAddEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false
    }
    setEducations([...educations, newEducation])
  }

  const handleUpdateEducation = (id: string, field: keyof Education, value: any) => {
    setEducations(educations.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ))
  }

  const handleRemoveEducation = (id: string) => {
    setEducations(educations.filter(edu => edu.id !== id))
  }

  const handleAddSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 'intermediate'
    }
    setSkills([...skills, newSkill])
  }

  const handleUpdateSkill = (id: string, field: keyof Skill, value: any) => {
    setSkills(skills.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    ))
  }

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id))
  }

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-green-100 text-green-800'
      case 'advanced': return 'bg-blue-100 text-blue-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'beginner': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">ProofOfFit</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                Demo Mode
              </span>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <User className="h-4 w-4 mr-2" />
                Profile
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
              <p className="text-gray-600">Manage your professional profile and showcase your experience</p>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-6">
              <User className="h-5 w-5 mr-2" />
              <h3 className="text-lg font-semibold">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.firstName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profile.lastName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="text-gray-900">{profile.email}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-gray-900">{profile.phone}</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-gray-900">{profile.location}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              {isEditing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profile.bio}</p>
              )}
            </div>
          </div>

          {/* Professional Experience */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                <h3 className="text-lg font-semibold">Professional Experience</h3>
              </div>
              {isEditing && (
                <button
                  onClick={handleAddExperience}
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                          <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => handleUpdateExperience(exp.id, 'position', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                          <input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => handleUpdateExperience(exp.id, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                          <input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => handleUpdateExperience(exp.id, 'endDate', e.target.value)}
                            disabled={exp.current}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                          />
                          <label className="flex items-center mt-2">
                            <input
                              type="checkbox"
                              checked={exp.current}
                              onChange={(e) => {
                                handleUpdateExperience(exp.id, 'current', e.target.checked)
                                if (e.target.checked) {
                                  handleUpdateExperience(exp.id, 'endDate', '')
                                }
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Currently working here</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => handleUpdateExperience(exp.id, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleRemoveExperience(exp.id)}
                          className="inline-flex items-center px-3 py-2 text-red-600 text-sm font-medium hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{exp.position}</h4>
                          <p className="text-blue-600 font-medium">{exp.company}</p>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                        </div>
                      </div>
                      <p className="text-gray-700">{exp.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                <h3 className="text-lg font-semibold">Education</h3>
              </div>
              {isEditing && (
                <button
                  onClick={handleAddEducation}
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              {educations.map((edu) => (
                <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => handleUpdateEducation(edu.id, 'institution', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                          <input
                            type="text"
                            value={edu.field}
                            onChange={(e) => handleUpdateEducation(edu.id, 'field', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                          <input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => handleUpdateEducation(edu.id, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                          <input
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => handleUpdateEducation(edu.id, 'endDate', e.target.value)}
                            disabled={edu.current}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                          />
                          <label className="flex items-center mt-2">
                            <input
                              type="checkbox"
                              checked={edu.current}
                              onChange={(e) => {
                                handleUpdateEducation(edu.id, 'current', e.target.checked)
                                if (e.target.checked) {
                                  handleUpdateEducation(edu.id, 'endDate', '')
                                }
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Currently studying</span>
                          </label>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleRemoveEducation(edu.id)}
                          className="inline-flex items-center px-3 py-2 text-red-600 text-sm font-medium hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{edu.degree} in {edu.field}</h4>
                          <p className="text-blue-600 font-medium">{edu.institution}</p>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p>{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                <h3 className="text-lg font-semibold">Skills</h3>
              </div>
              {isEditing && (
                <button
                  onClick={handleAddSkill}
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              {isEditing ? (
                <div className="space-y-3">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => handleUpdateSkill(skill.id, 'name', e.target.value)}
                        placeholder="Skill name"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <select
                        value={skill.level}
                        onChange={(e) => handleUpdateSkill(skill.id, 'level', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                      <button
                        onClick={() => handleRemoveSkill(skill.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill.id}
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getSkillLevelColor(skill.level)}`}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-6">
              <Globe className="h-5 w-5 mr-2" />
              <h3 className="text-lg font-semibold">Social Links</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={profile.linkedin}
                    onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center">
                    <Linkedin className="h-4 w-4 text-blue-600 mr-2" />
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {profile.linkedin}
                    </a>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={profile.github}
                    onChange={(e) => setProfile({...profile, github: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center">
                    <Github className="h-4 w-4 text-gray-800 mr-2" />
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {profile.github}
                    </a>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(e) => setProfile({...profile, website: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 text-gray-400 mr-2" />
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {profile.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}