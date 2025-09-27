"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { Progress } from '@proof-of-fit/ui'
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Users, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  Clock,
  AlertTriangle,
  Award,
  BarChart3
} from 'lucide-react'

interface Objective {
  id: string
  title: string
  description: string
  owner: string
  team: string
  quarter: string
  status: 'on-track' | 'at-risk' | 'behind' | 'completed'
  progress: number
  startDate: Date
  endDate: Date
  keyResults: KeyResult[]
  dependencies: string[]
  risks: string[]
}

interface KeyResult {
  id: string
  title: string
  description: string
  target: number
  current: number
  unit: string
  status: 'on-track' | 'at-risk' | 'behind' | 'completed'
  progress: number
  owner: string
  lastUpdated: Date
}

interface Team {
  id: string
  name: string
  members: string[]
  objectives: number
  completed: number
  onTrack: number
  atRisk: number
}

export function GoalTracking() {
  const [objectives, setObjectives] = useState<Objective[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedQuarter, setSelectedQuarter] = useState('Q1 2024')
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [showCreateObjective, setShowCreateObjective] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGoalData()
  }, [selectedQuarter])

  const fetchGoalData = async () => {
    try {
      setLoading(true)
      
      // Mock objectives data
      const mockObjectives: Objective[] = [
        {
          id: '1',
          title: 'Improve Product Quality',
          description: 'Enhance overall product quality and reduce defects',
          owner: 'Sarah Johnson',
          team: 'Engineering',
          quarter: 'Q1 2024',
          status: 'on-track',
          progress: 75,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-03-31'),
          keyResults: [
            {
              id: '1-1',
              title: 'Reduce bug count by 50%',
              description: 'Decrease production bugs from 20 to 10 per month',
              target: 10,
              current: 12,
              unit: 'bugs/month',
              status: 'on-track',
              progress: 80,
              owner: 'QA Team',
              lastUpdated: new Date()
            },
            {
              id: '1-2',
              title: 'Increase test coverage to 90%',
              description: 'Achieve 90% code coverage across all modules',
              target: 90,
              current: 85,
              unit: '%',
              status: 'on-track',
              progress: 94,
              owner: 'Dev Team',
              lastUpdated: new Date()
            },
            {
              id: '1-3',
              title: 'Reduce customer complaints by 30%',
              description: 'Decrease support tickets related to quality issues',
              target: 30,
              current: 25,
              unit: '%',
              status: 'on-track',
              progress: 83,
              owner: 'Support Team',
              lastUpdated: new Date()
            }
          ],
          dependencies: ['New testing framework', 'Customer feedback system'],
          risks: ['Resource constraints', 'Technical debt']
        },
        {
          id: '2',
          title: 'Increase Team Velocity',
          description: 'Improve development speed and delivery efficiency',
          owner: 'Mike Chen',
          team: 'Engineering',
          quarter: 'Q1 2024',
          status: 'at-risk',
          progress: 45,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-03-31'),
          keyResults: [
            {
              id: '2-1',
              title: 'Increase story points per sprint to 15',
              description: 'Deliver 15 story points per 2-week sprint',
              target: 15,
              current: 12,
              unit: 'points/sprint',
              status: 'at-risk',
              progress: 80,
              owner: 'Scrum Master',
              lastUpdated: new Date()
            },
            {
              id: '2-2',
              title: 'Reduce cycle time to 3 days',
              description: 'Complete stories from start to finish in 3 days',
              target: 3,
              current: 4.5,
              unit: 'days',
              status: 'behind',
              progress: 67,
              owner: 'Dev Team',
              lastUpdated: new Date()
            }
          ],
          dependencies: ['Process improvements', 'Tool upgrades'],
          risks: ['Team capacity', 'Complex requirements']
        },
        {
          id: '3',
          title: 'Enhance User Experience',
          description: 'Improve user satisfaction and engagement',
          owner: 'Lisa Wang',
          team: 'Product',
          quarter: 'Q1 2024',
          status: 'completed',
          progress: 100,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-03-31'),
          keyResults: [
            {
              id: '3-1',
              title: 'Achieve NPS score of 70',
              description: 'Reach Net Promoter Score of 70 or higher',
              target: 70,
              current: 72,
              unit: 'NPS',
              status: 'completed',
              progress: 100,
              owner: 'UX Team',
              lastUpdated: new Date()
            },
            {
              id: '3-2',
              title: 'Reduce user onboarding time by 40%',
              description: 'Decrease time to first value from 30 to 18 minutes',
              target: 18,
              current: 16,
              unit: 'minutes',
              status: 'completed',
              progress: 100,
              owner: 'Product Team',
              lastUpdated: new Date()
            }
          ],
          dependencies: ['User research', 'Design system'],
          risks: ['User adoption', 'Feature complexity']
        }
      ]

      const mockTeams: Team[] = [
        {
          id: '1',
          name: 'Engineering',
          members: ['Sarah Johnson', 'Mike Chen', 'Alex Rodriguez', 'Emma Davis'],
          objectives: 2,
          completed: 0,
          onTrack: 1,
          atRisk: 1
        },
        {
          id: '2',
          name: 'Product',
          members: ['Lisa Wang', 'David Kim', 'Maria Garcia'],
          objectives: 1,
          completed: 1,
          onTrack: 0,
          atRisk: 0
        },
        {
          id: '3',
          name: 'Design',
          members: ['Tom Wilson', 'Anna Lee'],
          objectives: 0,
          completed: 0,
          onTrack: 0,
          atRisk: 0
        }
      ]

      setObjectives(mockObjectives)
      setTeams(mockTeams)

    } catch (error) {
      console.error('Error fetching goal data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'on-track': return 'bg-blue-100 text-blue-800'
      case 'at-risk': return 'bg-yellow-100 text-yellow-800'
      case 'behind': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'on-track': return <TrendingUp className="w-4 h-4 text-blue-500" />
      case 'at-risk': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'behind': return <TrendingDown className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500'
    if (progress >= 75) return 'bg-blue-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const filteredObjectives = objectives.filter(obj => {
    const quarterMatch = obj.quarter === selectedQuarter
    const teamMatch = !selectedTeam || obj.team === selectedTeam
    return quarterMatch && teamMatch
  })

  const overallProgress = objectives.length > 0 
    ? objectives.reduce((sum, obj) => sum + obj.progress, 0) / objectives.length 
    : 0

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Goal Tracking (OKRs)</h2>
          <p className="text-gray-600">Track objectives and key results across teams and quarters</p>
        </div>
        <Button onClick={() => setShowCreateObjective(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Objective
        </Button>
      </div>

      {/* Filters and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="flex space-x-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Quarter</label>
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="Q1 2024">Q1 2024</option>
                <option value="Q2 2024">Q2 2024</option>
                <option value="Q3 2024">Q3 2024</option>
                <option value="Q4 2024">Q4 2024</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Team</label>
              <select
                value={selectedTeam || ''}
                onChange={(e) => setSelectedTeam(e.target.value || null)}
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Teams</option>
                {teams.map(team => (
                  <option key={team.id} value={team.name}>{team.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{overallProgress.toFixed(0)}%</div>
                <div className="text-sm text-gray-600">Overall Progress</div>
                <Progress value={overallProgress} className="mt-2 h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {teams.map(team => (
          <Card key={team.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">{team.name}</h3>
                <Users className="w-4 h-4 text-gray-500" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Objectives</span>
                  <span>{team.objectives}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Completed</span>
                  <span className="text-green-600">{team.completed}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>On Track</span>
                  <span className="text-blue-600">{team.onTrack}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>At Risk</span>
                  <span className="text-yellow-600">{team.atRisk}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Objectives List */}
      <div className="space-y-4">
        {filteredObjectives.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Objectives</h3>
              <p className="text-gray-600">No objectives found for the selected quarter and team.</p>
            </CardContent>
          </Card>
        ) : (
          filteredObjectives.map(objective => (
            <Card key={objective.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{objective.title}</h3>
                      <Badge className={getStatusColor(objective.status)}>
                        {objective.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{objective.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{objective.owner}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{objective.quarter}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="w-4 h-4" />
                        <span>{objective.keyResults.length} Key Results</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall Progress</span>
                    <span>{objective.progress}%</span>
                  </div>
                  <Progress value={objective.progress} className="h-3" />
                </div>

                {/* Key Results */}
                <div className="space-y-3">
                  <h4 className="font-medium">Key Results</h4>
                  {objective.keyResults.map(kr => (
                    <div key={kr.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(kr.status)}
                          <span className="font-medium text-sm">{kr.title}</span>
                        </div>
                        <Badge className={getStatusColor(kr.status)}>
                          {kr.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{kr.description}</p>
                      
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Progress: {kr.current}/{kr.target} {kr.unit}</span>
                        <span className="text-gray-500">Owner: {kr.owner}</span>
                      </div>
                      
                      <Progress value={kr.progress} className="h-2" />
                    </div>
                  ))}
                </div>

                {/* Dependencies and Risks */}
                {(objective.dependencies.length > 0 || objective.risks.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {objective.dependencies.length > 0 && (
                      <div>
                        <h5 className="font-medium text-sm mb-2">Dependencies</h5>
                        <div className="space-y-1">
                          {objective.dependencies.map((dep, index) => (
                            <div key={index} className="text-sm text-gray-600 flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{dep}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {objective.risks.length > 0 && (
                      <div>
                        <h5 className="font-medium text-sm mb-2">Risks</h5>
                        <div className="space-y-1">
                          {objective.risks.map((risk, index) => (
                            <div key={index} className="text-sm text-gray-600 flex items-center space-x-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>{risk}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
