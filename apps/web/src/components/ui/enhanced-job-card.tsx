"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@proof-of-fit/ui";
import { Badge } from "@proof-of-fit/ui";
import { Button } from "@proof-of-fit/ui";
import {
    Building2,
    Calendar,
    Clock,
    DollarSign,
    ExternalLink,
    MapPin,
} from "lucide-react";
import Link from "next/link";

export interface JobCardProps {
    id: string;
    title: string;
    company: string;
    location: string;
    source: string;
    posted_at: string;
    skills?: string[];
    compensation_range?: string;
    work_type?: string;
    is_remote?: boolean;
    fit_score?: number;
    onApply?: (jobId: string) => void;
    onSave?: (jobId: string) => void;
}

export function EnhancedJobCard({
    id,
    title,
    company,
    location,
    source,
    posted_at,
    skills = [],
    compensation_range,
    work_type,
    is_remote,
    fit_score,
    onApply,
    onSave,
}: JobCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    const getFitScoreColor = (score?: number) => {
        if (!score) return "text-muted-foreground";
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    const getFitScoreLabel = (score?: number) => {
        if (!score) return "No score";
        if (score >= 80) return "Excellent fit";
        if (score >= 60) return "Good fit";
        return "Fair fit";
    };

    return (
        <Card
            className="hover:shadow-lg transition-all duration-200 group"
            data-testid={`card-job-${id}`}
        >
            <CardHeader className="gap-2 space-y-0 pb-3">
                <Link href={`/jobs/${id}`}>
                    <h3
                        className="text-lg font-semibold tracking-tight line-clamp-2 hover:text-primary transition-colors group-hover:text-primary"
                        data-testid={`text-job-title-${id}`}
                    >
                        {title}
                    </h3>
                </Link>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        <span data-testid={`text-company-${id}`}>
                            {company}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span data-testid={`text-location-${id}`}>
                            {location}
                            {is_remote && (
                                <span className="text-green-600 ml-1">
                                    (Remote)
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span data-testid={`text-posted-${id}`}>
                            {formatDate(posted_at)}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    {compensation_range && (
                        <div
                            className="flex items-center gap-1 text-sm font-medium text-green-600"
                            data-testid={`text-compensation-${id}`}
                        >
                            <DollarSign className="h-4 w-4" />
                            {compensation_range}
                        </div>
                    )}

                    {fit_score && (
                        <div
                            className={`text-sm font-medium ${
                                getFitScoreColor(fit_score)
                            }`}
                            data-testid={`text-fit-score-${id}`}
                        >
                            {fit_score}% - {getFitScoreLabel(fit_score)}
                        </div>
                    )}
                </div>

                {work_type && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span data-testid={`text-work-type-${id}`}>
                            {work_type}
                        </span>
                    </div>
                )}
            </CardHeader>

            {skills && skills.length > 0 && (
                <CardContent className="pb-3">
                    <div className="flex flex-wrap gap-2">
                        {skills.slice(0, 4).map((skill, idx) => (
                            <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs"
                                data-testid={`badge-skill-${id}-${idx}`}
                            >
                                {skill}
                            </Badge>
                        ))}
                        {skills.length > 4 && (
                            <Badge
                                variant="secondary"
                                className="text-xs"
                                data-testid={`badge-more-skills-${id}`}
                            >
                                +{skills.length - 4} more
                            </Badge>
                        )}
                    </div>
                </CardContent>
            )}

            <CardFooter className="flex items-center justify-between gap-4 pt-3">
                <div className="flex items-center gap-2">
                    <span
                        className="text-xs text-muted-foreground"
                        data-testid={`text-via-${id}`}
                    >
                        via {source}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {onSave && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onSave(id)}
                            data-testid={`button-save-job-${id}`}
                        >
                            Save
                        </Button>
                    )}

                    <Link href={`/jobs/${id}`}>
                        <Button
                            variant="default"
                            size="sm"
                            data-testid={`button-view-job-${id}`}
                        >
                            View Job
                            <ExternalLink className="ml-2 h-3 w-3" />
                        </Button>
                    </Link>

                    {onApply && fit_score && fit_score >= 60 && (
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => onApply(id)}
                            data-testid={`button-apply-job-${id}`}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Quick Apply
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
