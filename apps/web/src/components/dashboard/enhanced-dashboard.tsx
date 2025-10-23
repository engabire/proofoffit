"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Target, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Award,
  Calendar,
  MessageSquare,
  FileText,
  Settings,
  Bell
} from 'lucide-react';

interface DashboardMetrics {
  totalApplications: number;
  activeJobs: number;
  fitScore: number;
  interviewsScheduled: number;
  profileCompleteness: number;
  weeklyApplications: number;
  responseRate: number;
  averageResponseTime: number;
}

interface RecentActivity {
  id: string;
  type: 'application' | 'interview' | 'message' | 'profile_update';
  title: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'warning' | 'info';
}

interface JobMatch {
  id: string;
  title: string;
  company: string;
  fitScore: number;
  location: string;
  salary: string;
  postedDate: Date;
  status: 'new' | 'applied' | 'interview' | 'rejected';
}

export function EnhancedDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalApplications: 0,
    activeJobs: 0,
    fitScore: 0,
    interviewsScheduled: 0,
    profileCompleteness: 0,
    weeklyApplications: 0,
    responseRate: 0,
    averageResponseTime: 0,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch metrics
        const metricsResponse = await fetch('/api/dashboard/metrics');
        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json();
          setMetrics(metricsData);
        }

        // Fetch recent activity
        const activityResponse = await fetch('/api/dashboard/activity');
        if (activityResponse.ok) {
          const activityData = await activityResponse.json();
          setRecentActivity(activityData);
        }

        // Fetch job matches
        const matchesResponse = await fetch('/api/dashboard/matches');
        if (matchesResponse.ok) {
          const matchesData = await matchesResponse.json();
          setJobMatches(matchesData);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set mock data for demo
        setMetrics({
          totalApplications: 24,
          activeJobs: 156,
          fitScore: 87,
          interviewsScheduled: 5,
          profileCompleteness: 92,
          weeklyApplications: 8,
          responseRate: 68,
          averageResponseTime: 2.4,
        });

        setRecentActivity([
          {
            id: '1',
            type: 'application',
            title: 'Applied to Senior Developer at TechCorp',
            description: 'Your application was submitted successfully',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            status: 'success',
          },
          {
            id: '2',
            type: 'interview',
            title: 'Interview scheduled with InnovateLabs',
            description: 'Technical interview scheduled for tomorrow at 2 PM',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            status: 'info',
          },
          {
            id: '3',
            type: 'message',
            title: 'New message from recruiter',
            description: 'Sarah from TalentCo sent you a message',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
            status: 'pending',
          },
        ]);

        setJobMatches([
          {
            id: '1',
            title: 'Senior Full Stack Developer',
            company: 'TechCorp',
            fitScore: 94,
            location: 'San Francisco, CA',
            salary: '$120k - $150k',
            postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            status: 'new',
          },
          {
            id: '2',
            title: 'Lead Frontend Engineer',
            company: 'InnovateLabs',
            fitScore: 89,
            location: 'Remote',
            salary: '$110k - $140k',
            postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            status: 'applied',
          },
          {
            id: '3',
            title: 'React Developer',
            company: 'StartupXYZ',
            fitScore: 76,
            location: 'New York, NY',
            salary: '$90k - $120k',
            postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            status: 'new',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'info':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'warning':
        return 'text-orange-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalApplications}</p>
                <p className="text-xs text-green-600">+{metrics.weeklyApplications} this week</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fit Score</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.fitScore}%</p>
                <p className="text-xs text-green-600">Above average</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.interviewsScheduled}</p>
                <p className="text-xs text-blue-600">Scheduled</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.responseRate}%</p>
                <p className="text-xs text-green-600">+5% this month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Matches */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Top Job Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobMatches.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          job.fitScore >= 90 ? 'bg-green-100 text-green-800' :
                          job.fitScore >= 80 ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {job.fitScore}% fit
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{job.company} • {job.location}</p>
                      <p className="text-sm text-gray-500">{job.salary}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        job.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        job.status === 'applied' ? 'bg-green-100 text-green-800' :
                        job.status === 'interview' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status}
                      </span>
                      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                        Apply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(activity.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile Completion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Profile Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Complete your profile to get better matches</span>
            <span className="text-sm font-bold text-gray-900">{metrics.profileCompleteness}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${metrics.profileCompleteness}%` }}
            ></div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Complete Profile
            </button>
            <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
              View Details
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
