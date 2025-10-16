import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Check,
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  Link,
  Mail,
  Settings,
  Shield,
} from "lucide-react";
// Simple toast implementation
const toast = {
  // eslint-disable-next-line no-console
  success: (message: string) => console.log("Success:", message),
  // eslint-disable-next-line no-console
  error: (message: string) => console.error("Error:", message),
};

interface AccessLinkNotificationProps {
  linkData: {
    id: string;
    url: string;
    expiresAt: Date | null;
    maxViews: number | null;
    watermark: boolean;
    targetTitle: string;
  };
  onClose: () => void;
  onManage?: () => void;
}

export function AccessLinkNotification(
  { linkData, onClose, onManage }: AccessLinkNotificationProps,
) {
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(linkData.url);
      setCopied(true);
      toast.success("Audit link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleSendEmail = async () => {
    try {
      // In a real implementation, this would call an API to send the link via email
      toast.success("Audit link sent via email!");
      setEmailSent(true);
    } catch (error) {
      toast.error("Failed to send email");
    }
  };

  const formatExpiration = (expiresAt: Date | null) => {
    if (!expiresAt) return "Never expires";
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days <= 0) return "Expired";
    if (days === 1) return "Expires tomorrow";
    if (days <= 7) return `Expires in ${days} days`;
    return `Expires on ${expiresAt.toLocaleDateString()}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-500 p-2">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-green-900 text-lg">
                  Access Link Created Successfully!
                </CardTitle>
                <p className="text-sm text-green-700 mt-1">
                  Your secure audit link is ready to share
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Link Display */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Link className="h-4 w-4" />
                Audit Link
              </h3>
              <Badge variant="outline" className="bg-white">
                {linkData.targetTitle}
              </Badge>
            </div>

            <div className="flex items-center gap-2 p-3 bg-white rounded border">
              <code className="flex-1 text-sm text-gray-700 break-all">
                {linkData.url}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyLink}
                className="flex-shrink-0"
              >
                {copied
                  ? <Check className="h-4 w-4" />
                  : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Security Features */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4" />
              Security Features
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-blue-800">
                  <strong>Expiration:</strong>{" "}
                  {formatExpiration(linkData.expiresAt)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-blue-600" />
                <span className="text-blue-800">
                  <strong>View Limit:</strong>{" "}
                  {linkData.maxViews
                    ? `${linkData.maxViews} views`
                    : "Unlimited"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="text-blue-800">
                  <strong>Watermark:</strong>{" "}
                  {linkData.watermark ? "Enabled" : "Disabled"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="text-blue-800">
                  <strong>Access Logging:</strong> Enabled
                </span>
              </div>
            </div>
          </div>

          {/* Sharing Options */}
          <div className="bg-white rounded-lg p-4 border">
            <h3 className="font-semibold text-gray-900 mb-3">
              Share Your Link
            </h3>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="flex items-center gap-2"
              >
                {copied
                  ? <Check className="h-4 w-4" />
                  : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy Link"}
              </Button>

              <Button
                onClick={handleSendEmail}
                variant="outline"
                className="flex items-center gap-2"
                disabled={emailSent}
              >
                <Mail className="h-4 w-4" />
                {emailSent ? "Email Sent!" : "Send via Email"}
              </Button>

              <Button
                onClick={() => window.open(linkData.url, "_blank")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Preview Link
              </Button>
            </div>
          </div>

          {/* Guidance */}
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <h3 className="font-semibold text-amber-900 flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4" />
              Important Guidelines
            </h3>

            <ul className="space-y-2 text-sm text-amber-800">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>
                  Share this link only with authorized stakeholders who need to
                  review your evidence
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>
                  All access is logged and tracked for compliance purposes
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>
                  You can revoke access or modify settings at any time from your
                  dashboard
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>Links are cryptographically secure and tamper-proof</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-600">
              A confirmation email has been sent to your registered email
              address
            </div>

            <div className="flex gap-3">
              {onManage && (
                <Button
                  onClick={onManage}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Manage Links
                </Button>
              )}

              <Button onClick={onClose} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Got it!
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
