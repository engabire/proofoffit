import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, MapPin, DollarSign, Clock, Building } from 'lucide-react'

interface JobSearchCardProps {
  job: {
    id: string
    title: string
    company: string
    location: string
    salary?: {
      min: number
      max: number
      currency: string
    }
    description: string
    postedAt: Date
    remote: boolean
    type: string
    source: string
    url?: string
    applyUrl?: string
    skills?: string[]
    benefits?: string[]
    companySize?: string
    industry?: string
  }
  onAutoApply?: (job: any) => void
  onViewDetails?: (job: any) => void
  isApplying?: boolean
}

export function JobSearchCard({ 
  job, 
  onAutoApply, 
  onViewDetails, 
  isApplying = false 
}: JobSearchCardProps) {
  const formatSalary = (salary: { min: number; max: number; currency: string }) => {
    if (salary.min && salary.max) {
      return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`
    }
    if (salary.min) {
      return `$${salary.min.toLocaleString()}+`
    }
    return 'Salary not specified'
  }

  const formatPostedDate = (date: Date) => {
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200" data-testid={`job-card-${job.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            {/* Company Logo Placeholder */}
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Building className="w-6 h-6 text-primary-foreground" />
            </div>
            
            {/* Job Details */}
            <div className="flex-1 min-w-0">
              <h3 
                className="font-semibold text-lg text-foreground mb-1 line-clamp-2" 
                data-testid={`job-title-${job.id}`}
              >
                {job.title}
              </h3>
              
              <p 
                className="text-muted-foreground text-sm mb-2 font-medium" 
                data-testid={`job-company-${job.id}`}
              >
                {job.company}
              </p>

              {/* Job Meta Information */}
              <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                  {job.remote && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      Remote
                    </Badge>
                  )}
                </div>
                
                {job.salary && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span data-testid={`job-salary-${job.id}`}>
                      {formatSalary(job.salary)}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span data-testid={`job-posted-${job.id}`}>
                    {formatPostedDate(job.postedAt)}
                  </span>
                </div>
              </div>

              {/* Job Description */}
              <p 
                className="text-sm text-foreground mb-3 line-clamp-2 leading-relaxed" 
                data-testid={`job-description-${job.id}`}
              >
                {job.description}
              </p>

              {/* Tags and Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="outline" data-testid={`job-type-${job.id}`}>
                  {job.type}
                </Badge>
                <Badge variant="secondary" data-testid={`job-source-${job.id}`}>
                  {job.source}
                </Badge>
                {job.industry && (
                  <Badge variant="outline">
                    {job.industry}
                  </Badge>
                )}
                {job.companySize && (
                  <Badge variant="outline">
                    {job.companySize}
                  </Badge>
                )}
              </div>

              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {job.skills.slice(0, 5).map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {job.skills.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{job.skills.length - 5} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            {onAutoApply && (
              <Button 
                onClick={() => onAutoApply(job)}
                disabled={isApplying}
                className="min-w-[100px]"
                data-testid={`auto-apply-${job.id}`}
              >
                {isApplying ? 'Applying...' : 'Auto-Apply'}
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => {
                if (job.url || job.applyUrl) {
                  window.open(job.url || job.applyUrl, '_blank', 'noopener,noreferrer')
                } else if (onViewDetails) {
                  onViewDetails(job)
                }
              }}
              className="min-w-[100px]"
              data-testid={`view-details-${job.id}`}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}