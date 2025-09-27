"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { Progress } from '@proof-of-fit/ui'

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string[]
    borderWidth?: number
  }[]
}

interface VelocityData {
  sprint: string
  completed: number
  planned: number
  velocity: number
}

interface CycleTimeData {
  date: string
  cycleTime: number
  items: number
}

export function AdvancedCharts() {
  const [velocityData, setVelocityData] = useState<VelocityData[]>([])
  const [cycleTimeData, setCycleTimeData] = useState<CycleTimeData[]>([])
  const [wipData, setWipData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeChart, setActiveChart] = useState<'velocity' | 'cycle-time' | 'wip' | 'burndown'>('velocity')

  useEffect(() => {
    fetchChartData()
  }, [])

  const fetchChartData = async () => {
    try {
      setLoading(true)
      
      // Mock data - in real implementation, fetch from API
      const mockVelocityData: VelocityData[] = [
        { sprint: 'Sprint 1', completed: 8, planned: 10, velocity: 8 },
        { sprint: 'Sprint 2', completed: 12, planned: 10, velocity: 12 },
        { sprint: 'Sprint 3', completed: 9, planned: 10, velocity: 9 },
        { sprint: 'Sprint 4', completed: 11, planned: 10, velocity: 11 },
        { sprint: 'Sprint 5', completed: 10, planned: 10, velocity: 10 }
      ]

      const mockCycleTimeData: CycleTimeData[] = [
        { date: '2024-01-01', cycleTime: 2.5, items: 3 },
        { date: '2024-01-08', cycleTime: 2.1, items: 4 },
        { date: '2024-01-15', cycleTime: 1.8, items: 5 },
        { date: '2024-01-22', cycleTime: 2.3, items: 3 },
        { date: '2024-01-29', cycleTime: 1.9, items: 6 }
      ]

      const mockWipData: ChartData = {
        labels: ['Backlog', 'This Sprint', 'In Progress', 'Done'],
    datasets: [
      {
        label: 'Items',
        data: [15, 5, 3, 12],
        backgroundColor: [
          'rgba(156, 163, 175, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ],
        borderColor: [
          'rgba(156, 163, 175, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(34, 197, 94, 1)'
        ],
        borderWidth: 2
      }
    ]
  }

      setVelocityData(mockVelocityData)
      setCycleTimeData(mockCycleTimeData)
      setWipData(mockWipData)

    } catch (error) {
      console.error('Error fetching chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderVelocityChart = () => {
    if (loading) return <div className="animate-pulse h-64 bg-gray-200 rounded"></div>

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {velocityData.map((sprint, index) => (
            <Card key={sprint.sprint} className="relative">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{sprint.sprint}</h3>
                  <Badge variant={sprint.completed >= sprint.planned ? "default" : "secondary"}>
                    {sprint.velocity} items
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completed</span>
                    <span>{sprint.completed}/{sprint.planned}</span>
                  </div>
                  <Progress 
                    value={(sprint.completed / sprint.planned) * 100} 
                    className="h-2"
                  />
                  <div className="text-xs text-gray-500">
                    {sprint.completed >= sprint.planned ? '✅ On target' : '⚠️ Behind target'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Velocity Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Velocity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              {velocityData.map((sprint, index) => (
                <div key={sprint.sprint} className="flex flex-col items-center">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ 
                      backgroundColor: sprint.velocity >= 10 ? '#22c55e' : sprint.velocity >= 8 ? '#3b82f6' : '#f59e0b'
                    }}
                  >
                    {sprint.velocity}
                  </div>
                  <span className="text-xs mt-1">{sprint.sprint}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderCycleTimeChart = () => {
    if (loading) return <div className="animate-pulse h-64 bg-gray-200 rounded"></div>

    const avgCycleTime = cycleTimeData.reduce((sum, item) => sum + item.cycleTime, 0) / cycleTimeData.length
    const targetCycleTime = 2.0

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Cycle Time Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{avgCycleTime.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Average Cycle Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{targetCycleTime}</div>
                <div className="text-sm text-gray-600">Target Cycle Time</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${avgCycleTime <= targetCycleTime ? 'text-green-600' : 'text-red-600'}`}>
                  {avgCycleTime <= targetCycleTime ? '✅' : '⚠️'}
                </div>
                <div className="text-sm text-gray-600">Status</div>
              </div>
            </div>
            
            <div className="space-y-2">
              {cycleTimeData.map((item, index) => (
                <div key={item.date} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">{item.cycleTime} days</span>
                    <Badge variant="outline">{item.items} items</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderWipChart = () => {
    if (loading) return <div className="animate-pulse h-64 bg-gray-200 rounded"></div>

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Work in Progress Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {wipData?.labels.map((label, index) => {
                const value = wipData.datasets[0].data[index]
                const total = wipData.datasets[0].data.reduce((sum, val) => sum + val, 0)
                const percentage = (value / total) * 100
                
                return (
                  <div key={label} className="text-center">
                    <div 
                      className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white font-bold text-lg mb-2"
                      style={{ backgroundColor: wipData.datasets[0].backgroundColor[index] }}
                    >
                      {value}
                    </div>
                    <div className="text-sm font-medium">{label}</div>
                    <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                  </div>
                )
              })}
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>WIP Status</span>
                <span>5/8 items</span>
              </div>
              <Progress value={62.5} className="h-2" />
              <div className="text-xs text-green-600 mt-1">✅ Within healthy limits</div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderBurndownChart = () => {
    if (loading) return <div className="animate-pulse h-64 bg-gray-200 rounded"></div>

    const sprintDays = 14
    const totalItems = 20
    const idealBurndown = Array.from({ length: sprintDays }, (_, i) => 
      totalItems - (totalItems / sprintDays) * i
    )
    const actualBurndown = [20, 18, 17, 15, 14, 12, 11, 10, 9, 8, 7, 6, 4, 2]

    return (
      <Card>
        <CardHeader>
          <CardTitle>Sprint Burndown Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Ideal Burndown</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Actual Burndown</span>
              </div>
            </div>
            
            <div className="relative h-64">
              <div className="absolute inset-0 flex items-end space-x-1">
                {idealBurndown.map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-200 rounded-t"
                      style={{ height: `${(value / totalItems) * 200}px` }}
                    ></div>
                    <div className="text-xs mt-1">{index + 1}</div>
                  </div>
                ))}
              </div>
              
              <div className="absolute inset-0 flex items-end space-x-1">
                {actualBurndown.map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-green-500 rounded-t opacity-80"
                      style={{ height: `${(value / totalItems) * 200}px` }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">{totalItems}</div>
                <div className="text-xs text-gray-600">Total Items</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">{actualBurndown[actualBurndown.length - 1]}</div>
                <div className="text-xs text-gray-600">Remaining</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">
                  {((totalItems - actualBurndown[actualBurndown.length - 1]) / totalItems * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-600">Complete</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Chart Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveChart('velocity')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeChart === 'velocity'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Velocity
        </button>
        <button
          onClick={() => setActiveChart('cycle-time')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeChart === 'cycle-time'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Cycle Time
        </button>
        <button
          onClick={() => setActiveChart('wip')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeChart === 'wip'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          WIP
        </button>
        <button
          onClick={() => setActiveChart('burndown')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeChart === 'burndown'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Burndown
        </button>
      </div>

      {/* Chart Content */}
      {activeChart === 'velocity' && renderVelocityChart()}
      {activeChart === 'cycle-time' && renderCycleTimeChart()}
      {activeChart === 'wip' && renderWipChart()}
      {activeChart === 'burndown' && renderBurndownChart()}

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Charts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              📊 Export as PNG
            </Button>
            <Button variant="outline" size="sm">
              📄 Export as PDF
            </Button>
            <Button variant="outline" size="sm">
              📈 Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
