"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, ExternalLink } from "lucide-react";

interface VerificationBadgeProps {
  isVerified: boolean;
  verificationType?: "github" | "doi" | "arxiv" | "scholar";
  verifiedAt?: Date;
  metadata?: Record<string, any>;
  url?: string;
}

export function VerificationBadge({
  isVerified,
  verificationType,
  verifiedAt,
  metadata,
  url,
}: VerificationBadgeProps) {
  if (!isVerified) {
    return (
      <Badge variant="outline" className="text-gray-500">
        <XCircle className="w-3 h-3 mr-1" />
        Unverified
      </Badge>
    );
  }

  const getBadgeVariant = () => {
    switch (verificationType) {
      case "github":
        return "default";
      case "doi":
        return "secondary";
      case "arxiv":
        return "outline";
      default:
        return "default";
    }
  };

  const getBadgeText = () => {
    switch (verificationType) {
      case "github":
        return "Verified Commit";
      case "doi":
        return "Verified DOI";
      case "arxiv":
        return "Verified arXiv";
      case "scholar":
        return "Verified Publication";
      default:
        return "Verified";
    }
  };

  const getIcon = () => {
    if (verifiedAt) {
      return <CheckCircle className="w-3 h-3 mr-1" />;
    }
    return <Clock className="w-3 h-3 mr-1" />;
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={getBadgeVariant()} className="text-xs">
        {getIcon()}
        {getBadgeText()}
      </Badge>
      
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-600"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}

export function VerificationTooltip({ metadata }: { metadata?: Record<string, any> }) {
  if (!metadata) return null;

  return (
    <div className="text-xs text-gray-600 space-y-1">
      {metadata.title && (
        <div>
          <strong>Title:</strong> {metadata.title}
        </div>
      )}
      {metadata.authors && (
        <div>
          <strong>Authors:</strong> {metadata.authors.join(", ")}
        </div>
      )}
      {metadata.published && (
        <div>
          <strong>Published:</strong> {metadata.published}
        </div>
      )}
      {metadata.journal && (
        <div>
          <strong>Journal:</strong> {metadata.journal}
        </div>
      )}
      {metadata.signature && (
        <div>
          <strong>Signature:</strong> {metadata.signature.substring(0, 20)}...
        </div>
      )}
    </div>
  );
}




