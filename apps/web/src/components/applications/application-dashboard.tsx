"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
    Briefcase, 
    Calendar, 
    FileText, 
    MessageSquare, 
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Plus,
    Filter,
    Search,
    Eye,
    Edit,
    Trash2,
    Download,
    Upload,
    Phone,
    Video,
    MapPin,
    User
} from "lucide-react";

interface ApplicationStatus {
    status: 'draft' | 'submitted' | 'under-review' | 'interview-scheduled' | 'interview-completed' | 'offer-received' | 'rejected' | 'withdrawn' | 'hired';
    timestamp: Date;
    notes?: string;
    updatedBy: 'user' | 'system' | 'employer';
}

interface JobApplication {
    id: string;
    userId: string;
    job: {
        id: string;
        title: string;
        company: string;
        location: string;
        remote?: boolean;
        salaryMin?: number;
        salaryMax?: number;
    };
    status: ApplicationStatus;
    statusHistory: ApplicationStatus[];
    documents: any[];
    notes: any[];
    events: any[];
    appliedAt: Date;
    source: 'direct' | 'recommendation' | 'auto-apply' | 'referral';
    lastActivityAt: Date;
    interviewCount: number;
    nextAction?: {
        type: 'follow-up' | 'interview-prep' | 'document-submission' | 'salary-negotiation';
        dueDate: Date;
        description: string;
    };
    responseTime?: number;
    createdAt: Date;
    updatedAt: Date;
}

interface ApplicationStats {
    totalApplications: number;
    byStatus: Record<string, number>;
    bySource: Record<string, number>;
    averageResponseTime: number;
    interviewRate: number;
    offerRate: number;
    rejectionRate: number;
    topCompanies: Array<{ company: string; count: number }>;
    topJobTitles: Array<{ title: string; count: number }>;
    successRate: number;
}

interface ApplicationDashboardProps {
    userId?: string;
}

export function ApplicationDashboard({ userId }: ApplicationDashboardProps) {
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [stats, setStats] = useState<ApplicationStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [filters, setFilters] = useState({
        status: "",
        source: "",
        company: "",
        jobTitle: "",
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    });

    const fetchApplications = async (page = 1) => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: pagination.limit.toString(),
                ...Object.fromEntries(
                    Object.entries(filters).filter(([_, value]) => value !== "")
                ),
            });

            const response = await fetch(`/api/applications?${params}`);
            
            if (!response.ok) {
                throw new Error("Failed to fetch applications");
            }

            const data = await response.json();
            setApplications(data.data.applications);
            setStats(data.data.stats);
            setPagination(data.data.pagination);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [filters]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'under-review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'interview-scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'interview-completed': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'offer-received': return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            case 'hired': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'submitted': return <Upload className="h-4 w-4" />;
            case 'under-review': return <Eye className="h-4 w-4" />;
            case 'interview-scheduled': return <Calendar className="h-4 w-4" />;
            case 'interview-completed': return <CheckCircle className="h-4 w-4" />;
            case 'offer-received': return <TrendingUp className="h-4 w-4" />;
            case 'rejected': return <XCircle className="h-4 w-4" />;
            case 'hired': return <CheckCircle className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4" />;
        }
    };

    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString();
    };

    const formatTimeAgo = (date: string | Date) => {
        const now = new Date();
        const past = new Date(date);
        const diffTime = Math.abs(now.getTime() - past.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return "1 day ago";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return past.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => fetchApplications()}>Try Again</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">{stats.totalApplications}</div>
                            <div className="text-sm text-gray-600">Total Applications</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">{Math.round(stats.interviewRate)}%</div>
                            <div className="text-sm text-gray-600">Interview Rate</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">{Math.round(stats.offerRate)}%</div>
                            <div className="text-sm text-gray-600">Offer Rate</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-orange-600">{Math.round(stats.averageResponseTime)}h</div>
                            <div className="text-sm text-gray-600">Avg Response Time</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    {/* Recent Applications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-5 w-5" />
                                    Recent Applications
                                </div>
                                <Button size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    New Application
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {applications.slice(0, 5).map((application) => (
                                    <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="font-semibold">{application.job.title}</h4>
                                                <Badge className={getStatusColor(application.status.status)}>
                                                    {application.status.status.replace('-', ' ')}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Briefcase className="h-4 w-4" />
                                                    {application.job.company}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {application.job.location}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {formatTimeAgo(application.appliedAt)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button size="sm" variant="outline">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Breakdown */}
                    {stats && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Application Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {Object.entries(stats.byStatus).map(([status, count]) => (
                                        <div key={status} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(status)}
                                                <span className="capitalize">{status.replace('-', ' ')}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-20">
                                                    <Progress 
                                                        value={(count / stats.totalApplications) * 100} 
                                                        className="h-2"
                                                    />
                                                </div>
                                                <span className="text-sm font-medium w-8">{count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="applications" className="space-y-4">
                    {/* Filters */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Filters
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Status</label>
                                    <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All statuses</SelectItem>
                                            <SelectItem value="submitted">Submitted</SelectItem>
                                            <SelectItem value="under-review">Under Review</SelectItem>
                                            <SelectItem value="interview-scheduled">Interview Scheduled</SelectItem>
                                            <SelectItem value="offer-received">Offer Received</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-2">Source</label>
                                    <Select value={filters.source} onValueChange={(value) => setFilters(prev => ({ ...prev, source: value }))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All sources" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All sources</SelectItem>
                                            <SelectItem value="direct">Direct</SelectItem>
                                            <SelectItem value="recommendation">Recommendation</SelectItem>
                                            <SelectItem value="auto-apply">Auto Apply</SelectItem>
                                            <SelectItem value="referral">Referral</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-2">Company</label>
                                    <Input
                                        placeholder="Search companies..."
                                        value={filters.company}
                                        onChange={(e) => setFilters(prev => ({ ...prev, company: e.target.value }))}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-2">Job Title</label>
                                    <Input
                                        placeholder="Search job titles..."
                                        value={filters.jobTitle}
                                        onChange={(e) => setFilters(prev => ({ ...prev, jobTitle: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Applications List */}
                    <div className="space-y-4">
                        {applications.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600">No applications found matching your criteria.</p>
                            </div>
                        ) : (
                            applications.map((application) => (
                                <Card key={application.id}>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-lg font-semibold">{application.job.title}</h3>
                                                    <Badge className={getStatusColor(application.status.status)}>
                                                        {application.status.status.replace('-', ' ')}
                                                    </Badge>
                                                </div>
                                                
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <Briefcase className="h-4 w-4" />
                                                        {application.job.company}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        {application.job.location}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        Applied {formatTimeAgo(application.appliedAt)}
                                                    </div>
                                                    {application.responseTime && (
                                                        <div className="flex items-center gap-1">
                                                            <TrendingUp className="h-4 w-4" />
                                                            {application.responseTime}h response
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Next Action */}
                                                {application.nextAction && (
                                                    <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <AlertCircle className="h-4 w-4 text-blue-500" />
                                                            <span className="font-medium">Next Action:</span>
                                                            <span>{application.nextAction.description}</span>
                                                            <span className="text-gray-500">
                                                                (Due: {formatDate(application.nextAction.dueDate)})
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Status History */}
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <span>Status History:</span>
                                                    <div className="flex gap-1">
                                                        {application.statusHistory.slice(-3).map((status, index) => (
                                                            <Badge key={index} variant="outline" className="text-xs">
                                                                {status.status.replace('-', ' ')}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 ml-4">
                                                <Button size="sm" variant="outline">
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Update
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    <MessageSquare className="h-4 w-4 mr-2" />
                                                    Add Note
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2">
                            <Button
                                variant="outline"
                                disabled={pagination.page === 1}
                                onClick={() => fetchApplications(pagination.page - 1)}
                            >
                                Previous
                            </Button>
                            
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={pageNum === pagination.page ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => fetchApplications(pageNum)}
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                })}
                            </div>
                            
                            <Button
                                variant="outline"
                                disabled={pagination.page === pagination.totalPages}
                                onClick={() => fetchApplications(pagination.page + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                    {stats && (
                        <>
                            {/* Success Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Interview Rate</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-green-600">
                                            {Math.round(stats.interviewRate)}%
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">
                                            Applications that led to interviews
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Offer Rate</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-purple-600">
                                            {Math.round(stats.offerRate)}%
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">
                                            Applications that resulted in offers
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Success Rate</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-blue-600">
                                            {Math.round(stats.successRate)}%
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">
                                            Overall application success rate
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Top Companies and Job Titles */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Top Companies</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {stats.topCompanies.map((company, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <span className="text-sm">{company.company}</span>
                                                    <Badge variant="secondary">{company.count}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Top Job Titles</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {stats.topJobTitles.map((title, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <span className="text-sm">{title.title}</span>
                                                    <Badge variant="secondary">{title.count}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
