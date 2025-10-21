"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
    Search, 
    MapPin, 
    Building, 
    DollarSign, 
    Clock, 
    Filter,
    ExternalLink,
    Heart,
    Share2
} from "lucide-react";

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    remote: boolean;
    salaryMin?: number;
    salaryMax?: number;
    experienceRequired?: number;
    requiredSkills?: string[];
    industry?: string;
    jobType?: string;
    postedAt?: string;
    description?: string;
}

interface JobSearchProps {
    onJobSelect?: (job: Job) => void;
    showFilters?: boolean;
}

export function JobSearch({ onJobSelect, showFilters = true }: JobSearchProps) {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
    
    // Search filters
    const [filters, setFilters] = useState({
        query: "",
        location: "",
        remote: false,
        salaryMin: "",
        salaryMax: "",
        experience: "",
        industry: "",
        jobType: "",
    });

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        totalJobs: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
    });

    const searchJobs = useCallback(async (page = 1) => {
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

            const response = await fetch(`/api/jobs/search?${params}`);
            
            if (!response.ok) {
                throw new Error("Failed to search jobs");
            }

            const data = await response.json();
            setJobs(data.data.jobs);
            setPagination(data.data.pagination);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [filters, pagination.limit]);

    useEffect(() => {
        searchJobs();
    }, [searchJobs]);

    const handleFilterChange = (key: string, value: string | boolean) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSearch = () => {
        searchJobs(1);
    };

    const handlePageChange = (newPage: number) => {
        searchJobs(newPage);
    };

    const toggleSaveJob = (jobId: string) => {
        setSavedJobs(prev => {
            const newSet = new Set(prev);
            if (newSet.has(jobId)) {
                newSet.delete(jobId);
            } else {
                newSet.add(jobId);
            }
            return newSet;
        });
    };

    const formatSalary = (min?: number, max?: number) => {
        if (!min || !max) return "Salary not specified";
        return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return "1 day ago";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="space-y-6">
            {/* Search and Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Job Search
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Search Bar */}
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Input
                                placeholder="Search jobs, companies, or keywords..."
                                value={filters.query}
                                onChange={(e) => handleFilterChange("query", e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>
                        <Button onClick={handleSearch} disabled={loading}>
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    placeholder="City, State"
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange("location", e.target.value)}
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="salaryMin">Min Salary</Label>
                                <Input
                                    id="salaryMin"
                                    type="number"
                                    placeholder="50000"
                                    value={filters.salaryMin}
                                    onChange={(e) => handleFilterChange("salaryMin", e.target.value)}
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="salaryMax">Max Salary</Label>
                                <Input
                                    id="salaryMax"
                                    type="number"
                                    placeholder="150000"
                                    value={filters.salaryMax}
                                    onChange={(e) => handleFilterChange("salaryMax", e.target.value)}
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="experience">Experience</Label>
                                <Select
                                    value={filters.experience}
                                    onValueChange={(value) => handleFilterChange("experience", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select experience" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Entry Level (0-1 years)</SelectItem>
                                        <SelectItem value="2">Junior (2-3 years)</SelectItem>
                                        <SelectItem value="4">Mid Level (4-6 years)</SelectItem>
                                        <SelectItem value="7">Senior (7+ years)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div>
                                <Label htmlFor="industry">Industry</Label>
                                <Select
                                    value={filters.industry}
                                    onValueChange={(value) => handleFilterChange("industry", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select industry" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Technology">Technology</SelectItem>
                                        <SelectItem value="Finance">Finance</SelectItem>
                                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                                        <SelectItem value="Education">Education</SelectItem>
                                        <SelectItem value="Marketing">Marketing</SelectItem>
                                        <SelectItem value="Data Science">Data Science</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div>
                                <Label htmlFor="jobType">Job Type</Label>
                                <Select
                                    value={filters.jobType}
                                    onValueChange={(value) => handleFilterChange("jobType", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select job type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Full-time">Full-time</SelectItem>
                                        <SelectItem value="Part-time">Part-time</SelectItem>
                                        <SelectItem value="Contract">Contract</SelectItem>
                                        <SelectItem value="Internship">Internship</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remote"
                                    checked={filters.remote}
                                    onCheckedChange={(checked) => handleFilterChange("remote", checked as boolean)}
                                />
                                <Label htmlFor="remote">Remote only</Label>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Results */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="text-center py-8">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={() => searchJobs()}>Try Again</Button>
                </div>
            ) : (
                <>
                    {/* Results Count */}
                    <div className="flex justify-between items-center">
                        <p className="text-gray-600">
                            {pagination.totalJobs} jobs found
                        </p>
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <span className="text-sm text-gray-600">Filtered results</span>
                        </div>
                    </div>

                    {/* Job Listings */}
                    <div className="space-y-4">
                        {jobs.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600">No jobs found matching your criteria.</p>
                                <Button 
                                    variant="outline" 
                                    className="mt-4"
                                    onClick={() => {
                                        setFilters({
                                            query: "",
                                            location: "",
                                            remote: false,
                                            salaryMin: "",
                                            salaryMax: "",
                                            experience: "",
                                            industry: "",
                                            jobType: "",
                                        });
                                        searchJobs();
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        ) : (
                            jobs.map((job) => (
                                <Card key={job.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-lg font-semibold">
                                                        {job.title}
                                                    </h3>
                                                    {job.remote && (
                                                        <Badge variant="secondary">Remote</Badge>
                                                    )}
                                                </div>
                                                
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <Building className="h-4 w-4" />
                                                        {job.company}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        {job.location}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <DollarSign className="h-4 w-4" />
                                                        {formatSalary(job.salaryMin, job.salaryMax)}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        {job.postedAt ? formatDate(job.postedAt) : "Unknown"}
                                                    </div>
                                                </div>

                                                {/* Skills */}
                                                {job.requiredSkills && job.requiredSkills.length > 0 && (
                                                    <div className="mb-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            {job.requiredSkills.slice(0, 5).map((skill) => (
                                                                <Badge key={skill} variant="secondary" className="text-xs">
                                                                    {skill}
                                                                </Badge>
                                                            ))}
                                                            {job.requiredSkills.length > 5 && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    +{job.requiredSkills.length - 5} more
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Description Preview */}
                                                {job.description && (
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        {job.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2 ml-4">
                                                <Button 
                                                    size="sm" 
                                                    className="w-full"
                                                    onClick={() => onJobSelect?.(job)}
                                                >
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    View Details
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    className="w-full"
                                                    onClick={() => toggleSaveJob(job.id)}
                                                >
                                                    <Heart className={`h-4 w-4 mr-2 ${savedJobs.has(job.id) ? 'fill-red-500 text-red-500' : ''}`} />
                                                    {savedJobs.has(job.id) ? 'Saved' : 'Save'}
                                                </Button>
                                                <Button size="sm" variant="ghost" className="w-full">
                                                    <Share2 className="h-4 w-4 mr-2" />
                                                    Share
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
                                disabled={!pagination.hasPrevPage}
                                onClick={() => handlePageChange(pagination.page - 1)}
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
                                            onClick={() => handlePageChange(pageNum)}
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                })}
                            </div>
                            
                            <Button
                                variant="outline"
                                disabled={!pagination.hasNextPage}
                                onClick={() => handlePageChange(pagination.page + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
