"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@proof-of-fit/ui";
import { Badge } from "@proof-of-fit/ui";
import { Button } from "@proof-of-fit/ui";
import { Progress } from "@proof-of-fit/ui";
import {
  Activity,
  AlertCircle,
  Award,
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  PieChart,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

interface BusinessMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: "up" | "down" | "stable";
  change: number;
  period: string;
}

interface TeamPerformance {
  team: string;
  velocity: number;
  quality: number;
  satisfaction: number;
  efficiency: number;
}

interface CostAnalysis {
  category: string;
  amount: number;
  percentage: number;
  trend: "up" | "down" | "stable";
}

export function BusinessIntelligence() {
  const [metrics, setMetrics] = useState<BusinessMetric[]>([]);
  const [teamPerformance, setTeamPerformance] = useState<TeamPerformance[]>([]);
  const [costAnalysis, setCostAnalysis] = useState<CostAnalysis[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "quarter" | "year"
  >("month");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinessData();
  }, [selectedPeriod, fetchBusinessData]);

  const fetchBusinessData = useCallback(async () => {
    try {
      setLoading(true);

      // Mock business metrics
      const mockMetrics: BusinessMetric[] = [
        {
          id: "1",
          name: "Delivery Velocity",
          value: 8.5,
          target: 10,
          unit: "points/sprint",
          trend: "down",
          change: -7.6,
          period: selectedPeriod,
        },
        {
          id: "2",
          name: "Cycle Time",
          value: 2.3,
          target: 2.0,
          unit: "days",
          trend: "up",
          change: 15.0,
          period: selectedPeriod,
        },
        {
          id: "3",
          name: "Quality Score",
          value: 94,
          target: 95,
          unit: "%",
          trend: "stable",
          change: 0.5,
          period: selectedPeriod,
        },
        {
          id: "4",
          name: "Team Satisfaction",
          value: 8.2,
          target: 8.5,
          unit: "/10",
          trend: "up",
          change: 2.4,
          period: selectedPeriod,
        },
        {
          id: "5",
          name: "Cost per Story Point",
          value: 1250,
          target: 1200,
          unit: "$",
          trend: "up",
          change: 4.2,
          period: selectedPeriod,
        },
        {
          id: "6",
          name: "Time to Market",
          value: 12,
          target: 10,
          unit: "days",
          trend: "up",
          change: 20.0,
          period: selectedPeriod,
        },
      ];

      const mockTeamPerformance: TeamPerformance[] = [
        {
          team: "Frontend",
          velocity: 9.2,
          quality: 96,
          satisfaction: 8.5,
          efficiency: 87,
        },
        {
          team: "Backend",
          velocity: 8.8,
          quality: 94,
          satisfaction: 8.1,
          efficiency: 82,
        },
        {
          team: "DevOps",
          velocity: 7.5,
          quality: 98,
          satisfaction: 8.8,
          efficiency: 91,
        },
        {
          team: "QA",
          velocity: 6.8,
          quality: 99,
          satisfaction: 8.3,
          efficiency: 89,
        },
      ];

      const mockCostAnalysis: CostAnalysis[] = [
        {
          category: "Development",
          amount: 45000,
          percentage: 60,
          trend: "stable",
        },
        {
          category: "Infrastructure",
          amount: 12000,
          percentage: 16,
          trend: "down",
        },
        {
          category: "Tools & Licenses",
          amount: 8000,
          percentage: 11,
          trend: "up",
        },
        {
          category: "Training",
          amount: 5000,
          percentage: 7,
          trend: "up",
        },
        {
          category: "Other",
          amount: 5000,
          percentage: 6,
          trend: "stable",
        },
      ];

      setMetrics(mockMetrics);
      setTeamPerformance(mockTeamPerformance);
      setCostAnalysis(mockCostAnalysis);
    } catch (error) {
      console.error("Error fetching business data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string, metric: BusinessMetric) => {
    if (
      metric.name === "Cycle Time" || metric.name === "Cost per Story Point" ||
      metric.name === "Time to Market"
    ) {
      // For these metrics, down is good
      return trend === "down"
        ? "text-green-500"
        : trend === "up"
        ? "text-red-500"
        : "text-gray-500";
    } else {
      // For other metrics, up is good
      return trend === "up"
        ? "text-green-500"
        : trend === "down"
        ? "text-red-500"
        : "text-gray-500";
    }
  };

  const getPerformanceColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 100) return "text-green-600";
    if (percentage >= 90) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Business Intelligence Dashboard</h2>
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: "week", label: "Week" },
            { key: "month", label: "Month" },
            { key: "quarter", label: "Quarter" },
            { key: "year", label: "Year" },
          ].map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key as any)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === period.key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{metric.name}</h3>
                {getTrendIcon(metric.trend)}
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline space-x-2">
                  <span
                    className={`text-2xl font-bold ${
                      getPerformanceColor(metric.value, metric.target)
                    }`}
                  >
                    {metric.value}
                  </span>
                  <span className="text-sm text-gray-600">{metric.unit}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Target: {metric.target} {metric.unit}
                  </span>
                  <span
                    className={`font-medium ${
                      getTrendColor(metric.trend, metric)
                    }`}
                  >
                    {metric.change > 0 ? "+" : ""}
                    {metric.change}%
                  </span>
                </div>

                <Progress
                  value={(metric.value / metric.target) * 100}
                  className="h-2"
                />

                <div className="text-xs text-gray-500">
                  {metric.value >= metric.target
                    ? "✅ Target achieved"
                    : "⚠️ Below target"}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Team Performance Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {teamPerformance.map((team) => (
              <div key={team.team} className="space-y-3">
                <h4 className="font-medium text-center">{team.team}</h4>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Velocity</span>
                    <span className={getPerformanceColor(team.velocity, 8)}>
                      {team.velocity}
                    </span>
                  </div>
                  <Progress
                    value={(team.velocity / 10) * 100}
                    className="h-1"
                  />

                  <div className="flex justify-between text-sm">
                    <span>Quality</span>
                    <span className={getPerformanceColor(team.quality, 95)}>
                      {team.quality}%
                    </span>
                  </div>
                  <Progress value={team.quality} className="h-1" />

                  <div className="flex justify-between text-sm">
                    <span>Satisfaction</span>
                    <span className={getPerformanceColor(team.satisfaction, 8)}>
                      {team.satisfaction}/10
                    </span>
                  </div>
                  <Progress
                    value={(team.satisfaction / 10) * 100}
                    className="h-1"
                  />

                  <div className="flex justify-between text-sm">
                    <span>Efficiency</span>
                    <span className={getPerformanceColor(team.efficiency, 85)}>
                      {team.efficiency}%
                    </span>
                  </div>
                  <Progress value={team.efficiency} className="h-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cost Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Cost Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {costAnalysis.map((cost, index) => (
                <div key={cost.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{cost.category}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        ${cost.amount.toLocaleString()}
                      </span>
                      {getTrendIcon(cost.trend)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={cost.percentage} className="flex-1 h-2" />
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {cost.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>ROI Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">$2.4M</div>
                  <div className="text-sm text-gray-600">Revenue Generated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">$75K</div>
                  <div className="text-sm text-gray-600">Total Investment</div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">3,200%</div>
                <div className="text-sm text-gray-600">ROI</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Cost per Feature</span>
                  <span>$1,250</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Revenue per Feature</span>
                  <span>$40,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Payback Period</span>
                  <span>2.1 days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Strategic Insights & Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-green-600">✅ Strengths</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>High quality scores across all teams (94-99%)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Strong team satisfaction (8.1-8.8/10)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Excellent ROI (3,200%)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Infrastructure costs trending down</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-orange-600">
                ⚠️ Areas for Improvement
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2">
                  </div>
                  <span>Velocity declining (-7.6%) - review story sizing</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2">
                  </div>
                  <span>Cycle time increasing (+15%) - optimize process</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2">
                  </div>
                  <span>Time to market above target (+20%)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2">
                  </div>
                  <span>Tools & training costs increasing</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              🎯 Strategic Recommendations
            </h4>
            <ol className="space-y-2 text-sm text-blue-800">
              <li>
                1. <strong>Process Optimization:</strong>{" "}
                Implement cycle time reduction initiatives focusing on
                automation and parallel work streams
              </li>
              <li>
                2. <strong>Capacity Planning:</strong>{" "}
                Review team capacity and consider cross-training to improve
                velocity
              </li>
              <li>
                3. <strong>Quality Focus:</strong>{" "}
                Maintain high quality standards while optimizing for speed
              </li>
              <li>
                4. <strong>Cost Management:</strong>{" "}
                Monitor tools and training ROI, optimize infrastructure spending
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
