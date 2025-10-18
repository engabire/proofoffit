"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@proof-of-fit/ui";
import { Badge } from "@proof-of-fit/ui";
import { Button } from "@proof-of-fit/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@proof-of-fit/ui";
import { 
  User, 
  MapPin, 
  Linkedin, 
  Github, 
  Globe, 
  Edit, 
  ExternalLink,
  Briefcase,
  GraduationCap,
  Award
} from "lucide-react";

export interface ProfileData {
  id: string;
  displayName?: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  headline?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  role: "candidate" | "employer";
  plan: "FREE" | "PRO" | "PREMIUM";
  createdAt: string;
  updatedAt: string;
}

export interface EnhancedProfileCardProps {
  profile: ProfileData;
  onEdit?: () => void;
  showActions?: boolean;
  compact?: boolean;
}

export function EnhancedProfileCard({ 
  profile, 
  onEdit, 
  showActions = true,
  compact = false 
}: EnhancedProfileCardProps) {
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'PREMIUM': return 'bg-purple-100 text-purple-800';
      case 'PRO': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    return role === 'employer' ? Briefcase : User;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const RoleIcon = getRoleIcon(profile.role);

  return (
    <Card className="w-full" data-testid={`card-profile-${profile.id}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.avatarUrl} alt={profile.displayName || profile.email} />
              <AvatarFallback className="text-lg">
                {getInitials(profile.displayName, profile.email)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-semibold truncate" data-testid={`text-profile-name-${profile.id}`}>
                  {profile.displayName || profile.email}
                </h2>
                <Badge className={getPlanColor(profile.plan)} data-testid={`badge-plan-${profile.id}`}>
                  {profile.plan}
                </Badge>
              </div>
              
              {profile.headline && (
                <p className="text-muted-foreground text-sm mb-2" data-testid={`text-profile-headline-${profile.id}`}>
                  {profile.headline}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <RoleIcon className="h-4 w-4" />
                  <span data-testid={`text-profile-role-${profile.id}`}>
                    {profile.role === 'employer' ? 'Employer' : 'Job Seeker'}
                  </span>
                </div>
                
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span data-testid={`text-profile-location-${profile.id}`}>
                      {profile.location}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {showActions && onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onEdit}
              data-testid={`button-edit-profile-${profile.id}`}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      
      {!compact && (
        <CardContent className="space-y-4">
          {profile.bio && (
            <div>
              <h3 className="text-sm font-medium mb-2">About</h3>
              <p className="text-sm text-muted-foreground" data-testid={`text-profile-bio-${profile.id}`}>
                {profile.bio}
              </p>
            </div>
          )}
          
          {(profile.linkedinUrl || profile.githubUrl || profile.portfolioUrl) && (
            <div>
              <h3 className="text-sm font-medium mb-2">Links</h3>
              <div className="flex flex-wrap gap-2">
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                    data-testid={`link-linkedin-${profile.id}`}
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                
                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-gray-600 hover:underline"
                    data-testid={`link-github-${profile.id}`}
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                
                {profile.portfolioUrl && (
                  <a
                    href={profile.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-green-600 hover:underline"
                    data-testid={`link-portfolio-${profile.id}`}
                  >
                    <Globe className="h-4 w-4" />
                    Portfolio
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground">
            <span data-testid={`text-profile-joined-${profile.id}`}>
              Joined {formatDate(profile.createdAt)}
            </span>
            {profile.updatedAt !== profile.createdAt && (
              <span className="ml-2" data-testid={`text-profile-updated-${profile.id}`}>
                • Updated {formatDate(profile.updatedAt)}
              </span>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
