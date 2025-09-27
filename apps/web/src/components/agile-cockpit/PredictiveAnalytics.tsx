"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { Progress } from '@proof-of-fit/ui'
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Calendar,
  Award
} from 'lucide-react'

interface Prediction {
  id: string
  type: 'velocity' | 'completion' | 'risk' | 'capacity' | 'quality'
  title: string
  description: string
  confidence: number
  timeframe: string
  currentValue: number
  predictedValue: number
  trend: 'up' | 'down' | 'stable'
  impact: 'high' | 'medium' | 'low'
  recommendations: string[]
  lastUpdated: Date
}

interface RiskAssessment {
  id: string
  risk: string
  probability: number
  impact: 'high' | 'medium' | 'low'
  mitigation: string
  owner: string
  status: 'active' | 'mitigated' | 'resolved'
  dueDate: Date
}

interface Forecast {
  period: string
  velocity: number
  confidence: number
  factors: string[]
}

export function PredictiveAnalytics() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [risks, setRisks] = useState<RiskAssessment[]>([])
  const [forecasts, setForecasts] = useState<Forecast[]>([])
  const [activeTab, setActiveTab] = useState<'predictions' | 'risks' | 'forecasts' | 'insights'>('predictions')
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month')

  useEffect(() => {
    loadPredictiveData()
  }, [selectedTimeframe])

  const loadPredictiveData = () => {
    // Mock predictions
    const mockPredictions: Prediction[] = [
      {
        id: '1',
        type: 'velocity',
        title: 'Sprint Velocity Forecast',
        description: 'Predicted velocity for next 4 sprints based on historical data',
        confidence: 87,
        timeframe: 'Next 4 sprints',
        currentValue: 8.5,
        predictedValue: 9.2,
        trend: 'up',
        impact: 'high',
        recommendations: [
          'Continue current team composition',
          'Focus on story sizing accuracy',
          'Address technical debt to improve velocity'
        ],
        lastUpdated: new Date()
      },
      {
        id: '2',
        type: 'completion',
        title: 'Sprint Completion Probability',
        description: 'Likelihood of completing current sprint goals',
        confidence: 73,
        timeframe: 'Current sprint',
        currentValue: 65,
        predictedValue: 78,
        trend: 'up',
        impact: 'high',
        recommendations: [
          'Reduce scope by 2 story points',
          'Increase team focus time',
          'Resolve 2 blocked items this week'
        ],
        lastUpdated: new Date()
      },
      {
        id: '3',
        type: 'risk',
        title: 'Technical Debt Impact',
        description: 'Predicted impact of technical debt on future velocity',
        confidence: 91,
        timeframe: 'Next 3 months',
        currentValue: 15,
        predictedValue: 22,
        trend: 'down',
        impact: 'high',
        recommendations: [
          'Allocate 20% of sprint capacity to tech debt',
          'Prioritize refactoring critical components',
          'Implement code quality gates'
        ],
        lastUpdated: new Date()
      },
      {
        id: '4',
        type: 'capacity',
        title: 'Team Capacity Forecast',
        description: 'Predicted team capacity considering holidays and time off',
        confidence: 82,
        timeframe: 'Next quarter',
        currentValue: 100,
        predictedValue: 85,
        trend: 'down',
        impact: 'medium',
        recommendations: [
          'Plan for reduced capacity in December',
          'Cross-train team members',
          'Consider temporary contractors'
        ],
        lastUpdated: new Date()
      },
      {
        id: '5',
        type: 'quality',
        title: 'Quality Score Prediction',
        description: 'Predicted quality metrics based on current trends',
        confidence: 76,
        timeframe: 'Next 2 sprints',
        currentValue: 94,
        predictedValue: 96,
        trend: 'up',
        impact: 'medium',
        recommendations: [
          'Maintain current testing practices',
          'Increase code review coverage',
          'Implement automated quality checks'
        ],
        lastUpdated: new Date()
      }
    ]

    // Mock risk assessments
    const mockRisks: RiskAssessment[] = [
      {
        id: '1',
        risk: 'Key team member departure',
        probability: 25,
        impact: 'high',
        mitigation: 'Cross-train team members and document knowledge',
        owner: 'Sarah Johnson',
        status: 'active',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        risk: 'Technical debt accumulation',
        probability: 80,
        impact: 'medium',
        mitigation: 'Allocate dedicated time for refactoring',
        owner: 'Mike Chen',
        status: 'active',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        risk: 'Scope creep in current sprint',
        probability: 60,
        impact: 'medium',
        mitigation: 'Strict scope management and change control',
        owner: 'Lisa Wang',
        status: 'mitigated',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    ]

    // Mock forecasts
    const mockForecasts: Forecast[] = [
      {
        period: 'Sprint 1',
        velocity: 8.5,
        confidence: 90,
        factors: ['Historical data', 'Team capacity', 'Story complexity']
      },
      {
        period: 'Sprint 2',
        velocity: 9.2,
        confidence: 85,
        factors: ['Improved processes', 'Reduced blockers', 'Team learning']
      },
      {
        period: 'Sprint 3',
        velocity: 8.8,
        confidence: 80,
        factors: ['Holiday impact', 'Technical debt', 'New features']
      },
      {
        period: 'Sprint 4',
        velocity: 9.5,
        confidence: 75,
        factors: ['Team optimization', 'Process improvements', 'Tool upgrades']
      }
    ]

    setPredictions(mockPredictions)
    setRisks(mockRisks)
    setForecasts(mockForecasts)
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />
      default: return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskColor = (probability: number, impact: string) => {
    const riskScore = probability * (impact === 'high' ? 3 : impact === 'medium' ? 2 : 1)
    if (riskScore >= 150) return 'bg-red-100 text-red-800'
    if (riskScore >= 100) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const renderPredictions = () => (
    <div className="space-y-4">
      {predictions.map(prediction => (
        <Card key={prediction.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Brain className="w-5 h-5 text-blue-500" />
                  <h3 className="font-medium">{prediction.title}</h3>
                  <Badge className={getImpactColor(prediction.impact)}>
                    {prediction.impact} impact
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{prediction.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <span className="font-medium">Current:</span>
                    <div className={getTrendColor(prediction.trend)}>{prediction.currentValue}</div>
                  </div>
                  <div>
                    <span className="font-medium">Predicted:</span>
                    <div className={getTrendColor(prediction.trend)}>{prediction.predictedValue}</div>
                  </div>
                  <div>
                    <span className="font-medium">Confidence:</span>
                    <div>{prediction.confidence}%</div>
                  </div>
                  <div>
                    <span className="font-medium">Timeframe:</span>
                    <div>{prediction.timeframe}</div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Confidence Level</span>
                    <span>{prediction.confidence}%</span>
                  </div>
                  <Progress value={prediction.confidence} className="h-2" />
                </div>
                
                <div>
                  <span className="font-medium text-sm mb-2 block">Recommendations:</span>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {prediction.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-blue-500 rounded-full mt-2"></div>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {getTrendIcon(prediction.trend)}
                <Button variant="outline" size="sm">
                  <Target className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderRisks = () => (
    <div className="space-y-4">
      {risks.map(risk => (
        <Card key={risk.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <h3 className="font-medium">{risk.risk}</h3>
                  <Badge className={getRiskColor(risk.probability, risk.impact)}>
                    {risk.probability}% probability
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <span className="font-medium">Probability:</span>
                    <div>{risk.probability}%</div>
                  </div>
                  <div>
                    <span className="font-medium">Impact:</span>
                    <div className="capitalize">{risk.impact}</div>
                  </div>
                  <div>
                    <span className="font-medium">Owner:</span>
                    <div>{risk.owner}</div>
                  </div>
                  <div>
                    <span className="font-medium">Due:</span>
                    <div>{risk.dueDate.toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Risk Level</span>
                    <span>{risk.probability}%</span>
                  </div>
                  <Progress value={risk.probability} className="h-2" />
                </div>
                
                <div>
                  <span className="font-medium text-sm mb-2 block">Mitigation:</span>
                  <p className="text-sm text-gray-600">{risk.mitigation}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge className={getImpactColor(risk.impact)}>
                  {risk.status}
                </Badge>
                <Button variant="outline" size="sm">
                  <CheckCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderForecasts = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Velocity Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {forecasts.map((forecast, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium">{forecast.period}</div>
                    <div className="text-sm text-gray-600">
                      {forecast.factors.join(' • ')}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium">{forecast.velocity} points</div>
                    <div className="text-sm text-gray-600">{forecast.confidence}% confidence</div>
                  </div>
                  <div className="w-16">
                    <Progress value={forecast.confidence} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderInsights = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { icon: <TrendingUp className="w-4 h-4 text-green-500" />, text: 'Velocity trending upward by 8%' },
                { icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />, text: 'Technical debt risk increasing' },
                { icon: <Users className="w-4 h-4 text-blue-500" />, text: 'Team capacity will decrease 15% in Q4' },
                { icon: <Award className="w-4 h-4 text-purple-500" />, text: 'Quality scores improving consistently' }
              ].map((insight, index) => (
                <div key={index} className="flex items-center space-x-3">
                  {insight.icon}
                  <span className="text-sm">{insight.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Action Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { priority: 'high', text: 'Address technical debt before Q4' },
                { priority: 'medium', text: 'Cross-train team members' },
                { priority: 'low', text: 'Implement automated quality checks' },
                { priority: 'high', text: 'Plan for reduced capacity in December' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    item.priority === 'high' ? 'bg-red-500' :
                    item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Predictive Analytics</h2>
          <p className="text-gray-600">AI-powered insights and forecasts for your agile processes</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <Button>
            <Brain className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{predictions.length}</div>
                <div className="text-sm text-gray-600">Active Predictions</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{risks.length}</div>
                <div className="text-sm text-gray-600">Risk Assessments</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">87%</div>
                <div className="text-sm text-gray-600">Avg Confidence</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Zap className="w-8 h-8 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-gray-600">Insights Generated</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'predictions', label: 'Predictions', icon: <Brain className="w-4 h-4" /> },
          { key: 'risks', label: 'Risk Assessment', icon: <AlertTriangle className="w-4 h-4" /> },
          { key: 'forecasts', label: 'Forecasts', icon: <BarChart3 className="w-4 h-4" /> },
          { key: 'insights', label: 'Insights', icon: <Zap className="w-4 h-4" /> }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'predictions' && renderPredictions()}
      {activeTab === 'risks' && renderRisks()}
      {activeTab === 'forecasts' && renderForecasts()}
      {activeTab === 'insights' && renderInsights()}
    </div>
  )
}
