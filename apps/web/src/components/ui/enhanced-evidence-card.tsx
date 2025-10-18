"use client";

import { Card, CardContent, CardHeader } from "@proof-of-fit/ui";
import { Badge } from "@proof-of-fit/ui";
import { Button } from "@proof-of-fit/ui";
import {
    ExternalLink,
    FileText,
    GitBranch,
    Lightbulb,
    Link2,
    MoreVertical,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@proof-of-fit/ui";

export interface EvidenceCardProps {
    id: string;
    kind: "link" | "file" | "repo" | "case";
    title: string;
    url?: string;
    description?: string;
    skills?: string[];
    impact?: string;
    isPublic?: boolean;
    created_at: string;
    onEdit?: (id: string) => void;
    onShare?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const kindConfig = {
    link: { icon: Link2, label: "Link", color: "text-blue-600 bg-blue-50" },
    file: {
        icon: FileText,
        label: "File",
        color: "text-purple-600 bg-purple-50",
    },
    repo: {
        icon: GitBranch,
        label: "Repository",
        color: "text-green-600 bg-green-50",
    },
    case: {
        icon: Lightbulb,
        label: "Case Study",
        color: "text-orange-600 bg-orange-50",
    },
};

export function EnhancedEvidenceCard({
    id,
    kind,
    title,
    url,
    description,
    skills = [],
    impact,
    isPublic = true,
    created_at,
    onEdit,
    onShare,
    onDelete,
}: EvidenceCardProps) {
    const config = kindConfig[kind];
    const Icon = config.icon;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <Card
            className="hover:shadow-md transition-all duration-200 border-l-4 hover:border-l-8"
            style={{
                borderLeftColor: kind === "link"
                    ? "#2563eb"
                    : kind === "file"
                    ? "#9333ea"
                    : kind === "repo"
                    ? "#16a34a"
                    : "#ea580c",
            }}
            data-testid={`card-evidence-${id}`}
        >
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                        className={`p-2 rounded-md ${config.color} flex-shrink-0`}
                    >
                        <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3
                            className="font-medium line-clamp-2 mb-1"
                            data-testid={`text-evidence-title-${id}`}
                        >
                            {title}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                                variant="secondary"
                                className="text-xs"
                                data-testid={`badge-evidence-kind-${id}`}
                            >
                                {config.label}
                            </Badge>
                            {!isPublic && (
                                <Badge variant="outline" className="text-xs">
                                    Private
                                </Badge>
                            )}
                            <span
                                className="text-xs text-muted-foreground"
                                data-testid={`text-evidence-date-${id}`}
                            >
                                {formatDate(created_at)}
                            </span>
                        </div>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            data-testid={`button-evidence-menu-${id}`}
                        >
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {onEdit && (
                            <DropdownMenuItem
                                data-testid={`menu-edit-evidence-${id}`}
                                onClick={() => onEdit(id)}
                            >
                                Edit
                            </DropdownMenuItem>
                        )}
                        {onShare && (
                            <DropdownMenuItem
                                data-testid={`menu-share-evidence-${id}`}
                                onClick={() => onShare(id)}
                            >
                                Share
                            </DropdownMenuItem>
                        )}
                        {onDelete && (
                            <DropdownMenuItem
                                className="text-destructive"
                                data-testid={`menu-delete-evidence-${id}`}
                                onClick={() => onDelete(id)}
                            >
                                Delete
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>

            {description && (
                <CardContent className="pb-3">
                    <p
                        className="text-sm text-muted-foreground line-clamp-2"
                        data-testid={`text-evidence-description-${id}`}
                    >
                        {description}
                    </p>
                </CardContent>
            )}

            {skills && skills.length > 0 && (
                <CardContent className="pb-3">
                    <div className="flex flex-wrap gap-1">
                        {skills.slice(0, 3).map((skill, idx) => (
                            <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs"
                                data-testid={`badge-skill-${id}-${idx}`}
                            >
                                {skill}
                            </Badge>
                        ))}
                        {skills.length > 3 && (
                            <Badge
                                variant="outline"
                                className="text-xs"
                                data-testid={`badge-more-skills-${id}`}
                            >
                                +{skills.length - 3} more
                            </Badge>
                        )}
                    </div>
                </CardContent>
            )}

            {impact && (
                <CardContent className="pb-3">
                    <div className="text-sm">
                        <span className="font-medium text-muted-foreground">
                            Impact:
                        </span>
                        <span
                            className="text-foreground"
                            data-testid={`text-evidence-impact-${id}`}
                        >
                            {impact}
                        </span>
                    </div>
                </CardContent>
            )}

            {url && (
                <CardContent className="pt-0 pb-4">
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-mono"
                        data-testid={`link-evidence-url-${id}`}
                    >
                        <ExternalLink className="h-3 w-3" />
                        {url.length > 50 ? url.substring(0, 50) + "..." : url}
                    </a>
                </CardContent>
            )}
        </Card>
    );
}
