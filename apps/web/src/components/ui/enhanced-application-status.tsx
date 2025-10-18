"use client";

import { Badge } from "@proof-of-fit/ui";
import { Progress } from "@proof-of-fit/ui";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  MessageSquare, 
  Handshake,
  FileText,
  AlertCircle
} from "lucide-react";

export type ApplicationStatus = "draft" | "submitted" | "review" | "interview" | "offer" | "rejected";

export interface ApplicationStatusProps {
  status: ApplicationStatus;
  showProgress?: boolean;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const statusConfig = {
  draft: {
    label: "Draft",
    color: "bg-gray-100 text-gray-800",
    icon: FileText,
    progress: 10,
    description: "Application is being prepared"
  },
  submitted: {
    label: "Submitted",
    color: "bg-blue-100 text-blue-800",
    icon: Clock,
    progress: 25,
    description: "Application submitted successfully"
  },
  review: {
    label: "Under Review",
    color: "bg-yellow-100 text-yellow-800",
    icon: Eye,
    progress: 50,
    description: "Employer is reviewing your application"
  },
  interview: {
    label: "Interview",
    color: "bg-purple-100 text-purple-800",
    icon: MessageSquare,
    progress: 75,
    description: "Interview process in progress"
  },
  offer: {
    label: "Offer",
    color: "bg-green-100 text-green-800",
    icon: Handshake,
    progress: 100,
    description: "Congratulations! You received an offer"
  },
  rejected: {
    label: "Not Selected",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    progress: 0,
    description: "Application was not selected"
  }
};

export function EnhancedApplicationStatus({ 
  status, 
  showProgress = false, 
  showIcon = true,
  size = "md",
  className = ""
}: ApplicationStatusProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          badge: "text-xs px-2 py-1",
          icon: "h-3 w-3",
          progress: "h-1"
        };
      case "lg":
        return {
          badge: "text-sm px-3 py-1.5",
          icon: "h-5 w-5",
          progress: "h-2"
        };
      default:
        return {
          badge: "text-xs px-2.5 py-1",
          icon: "h-4 w-4",
          progress: "h-1.5"
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className={`flex flex-col gap-2 ${className}`} data-testid={`application-status-${status}`}>
      <div className="flex items-center gap-2">
        {showIcon && (
          <Icon className={`${sizeClasses.icon} ${config.color.split(' ')[1]}`} />
        )}
        <Badge 
          className={`${config.color} ${sizeClasses.badge} font-medium`}
          data-testid={`badge-status-${status}`}
        >
          {config.label}
        </Badge>
      </div>
      
      {showProgress && (
        <div className="space-y-1">
          <Progress 
            value={config.progress} 
            className={`w-full ${sizeClasses.progress}`}
            data-testid={`progress-${status}`}
          />
          <p className="text-xs text-muted-foreground" data-testid={`description-${status}`}>
            {config.description}
          </p>
        </div>
      )}
    </div>
  );
}

// Application timeline component
export interface ApplicationTimelineProps {
  status: ApplicationStatus;
  submittedAt?: string;
  reviewedAt?: string;
  interviewedAt?: string;
  offeredAt?: string;
  rejectedAt?: string;
  className?: string;
}

export function ApplicationTimeline({
  status,
  submittedAt,
  reviewedAt,
  interviewedAt,
  offeredAt,
  rejectedAt,
  className = ""
}: ApplicationTimelineProps) {
  const steps = [
    {
      key: "submitted" as const,
      label: "Submitted",
      icon: Clock,
      date: submittedAt,
      completed: ["submitted", "review", "interview", "offer"].includes(status),
      current: status === "submitted"
    },
    {
      key: "review" as const,
      label: "Under Review",
      icon: Eye,
      date: reviewedAt,
      completed: ["review", "interview", "offer"].includes(status),
      current: status === "review"
    },
    {
      key: "interview" as const,
      label: "Interview",
      icon: MessageSquare,
      date: interviewedAt,
      completed: ["interview", "offer"].includes(status),
      current: status === "interview"
    },
    {
      key: "offer" as const,
      label: "Decision",
      icon: status === "offer" ? Handshake : status === "rejected" ? XCircle : AlertCircle,
      date: offeredAt || rejectedAt,
      completed: ["offer", "rejected"].includes(status),
      current: ["offer", "rejected"].includes(status)
    }
  ];

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className={`space-y-4 ${className}`} data-testid="application-timeline">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isLast = index === steps.length - 1;
        
        return (
          <div key={step.key} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full border-2
                ${step.completed 
                  ? 'bg-green-100 border-green-500 text-green-600' 
                  : step.current 
                    ? 'bg-blue-100 border-blue-500 text-blue-600'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }
              `}>
                <Icon className="h-4 w-4" />
              </div>
              {!isLast && (
                <div className={`
                  w-0.5 h-8 mt-2
                  ${step.completed ? 'bg-green-500' : 'bg-gray-300'}
                `} />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className={`
                  text-sm font-medium
                  ${step.completed ? 'text-green-900' : step.current ? 'text-blue-900' : 'text-gray-500'}
                `}>
                  {step.label}
                </h4>
                {step.date && (
                  <span className="text-xs text-muted-foreground">
                    {formatDate(step.date)}
                  </span>
                )}
              </div>
              {step.current && !step.completed && (
                <p className="text-xs text-muted-foreground mt-1">
                  {statusConfig[status].description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
