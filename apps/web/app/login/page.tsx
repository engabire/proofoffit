/**
 * ProofOfFit Login Page (Next.js App Router)
 * Enhanced authentication with Logo branding and marketing images
 * 
 * Location: apps/web/app/login/page.tsx
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ShieldCheck, 
  Building2, 
  Info, 
  Users, 
  Briefcase, 
  Mail, 
  Lock, 
  CheckCircle2, 
  Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

// Import marketing images
import constructionWorkerImage from "@/public/images/marketing/construction-worker.png";
import nurseImage from "@/public/images/marketing/nurse.png";
import chefImage from "@/public/images/marketing/chef.png";
import developerImage from "@/public/images/marketing/developer.png";

type Audience = "hirer" | "seeker";
type AuthMode = "signin" | "signup";

type MarketingImage = { 
  src: any; 
  alt: string;
  caption: string;
};

const MARKETING_IMAGES: MarketingImage[] = [
  { 
    src: constructionWorkerImage, 
    alt: "Black female construction worker reviewing blueprints on tablet",
    caption: "All professions, all backgrounds"
  },
  { 
    src: nurseImage, 
    alt: "Hispanic male nurse reviewing patient charts professionally",
    caption: "Healthcare to tech - everyone welcome"
  },
  { 
    src: chefImage, 
    alt: "Asian female chef presenting culinary excellence",
    caption: "Blue collar, white collar, service - all valued"
  },
  { 
    src: developerImage, 
    alt: "Middle Eastern software developer coding at workstation",
    caption: "Evidence-based hiring for everyone"
  },
];

function MarketingImages({ images = MARKETING_IMAGES }: { images?: MarketingImage[] }) {
  return (
    <div className="mt-8 space-y-6">
      <div className="grid grid-cols-2 gap-4" aria-label="Evidence-based hiring illustrations">
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="group relative"
          >
            <div className="overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <Image
                src={img.src}
                alt={img.alt}
                className="h-36 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                width={300}
                height={144}
                loading="lazy"
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground text-center">
              {img.caption}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [audience, setAudience] = useState<Audience>("seeker");
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const isHirer = audience === "hirer";
  const isSignUp = authMode === "signup";

  // Get redirect URL from query params
  const redirectUrl = searchParams?.get('redirect') || (isHirer ? '/employer' : '/dashboard');

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push(redirectUrl);
    }
  }, [user, redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter your email and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const role = isHirer ? 'employer' : 'candidate';
        await signUp(email, password, displayName || undefined, role);
        
        toast({
          title: "Account created!",
          description: "Welcome to ProofOfFit. Let's get started.",
        });
      } else {
        await signIn(email, password);
        toast({
          title: "Welcome back!",
          description: "Successfully signed in to your account.",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Please check your credentials and try again";
      
      const isEmailConfirmation = errorMessage.includes('check your email') || errorMessage.includes('confirmation');
      
      toast({
        title: isEmailConfirmation ? "Check your email" : (isSignUp ? "Sign up failed" : "Sign in failed"),
        description: errorMessage,
        variant: isEmailConfirmation ? "default" : "destructive",
      });
      
      if (isEmailConfirmation) {
        setPassword("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Marketing Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-muted via-muted to-muted/80 text-foreground p-12 relative overflow-hidden"
      >
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-chart-2/5 rounded-full blur-3xl" />
        
        {/* Top Section */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Logo size="xl" showText={true} />
            <div className="h-1.5 w-32 bg-gradient-to-r from-primary to-chart-2 my-4 rounded-full" />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-md text-lg text-foreground/80 leading-relaxed"
          >
            Transform hiring from gut feelings to <span className="font-semibold text-primary">evidence-based decisions</span>. 
            Showcase verified skills, real projects, and proven capabilities.
          </motion.p>
          
          <MarketingImages />
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="relative z-10 space-y-4"
        >
          <div className="flex items-center gap-3 text-sm">
            <div className="p-2 rounded-lg bg-primary/10">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <span className="text-foreground/90">Evidence-first hiring methodology</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="p-2 rounded-lg bg-chart-2/10">
              <ShieldCheck className="h-5 w-5 text-chart-2" />
            </div>
            <span className="text-foreground/90">Secure, verified credentials</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <span className="text-foreground/90">Built for modern teams</span>
          </div>
          
          <Separator className="my-4" />
          
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ProofOfFit. Privacy-first and ethical by default.
          </p>
        </motion.div>
      </motion.aside>

      {/* Auth Form */}
      <div className="flex items-center justify-center p-6 md:p-12 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-xl rounded-2xl border bg-card shadow-xl p-8 md:p-10"
        >
          {/* Header with Audience Toggle */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              {isSignUp ? 'Join ProofOfFit' : 'Sign in to ProofOfFit'}
            </h2>
            <div className="inline-flex rounded-2xl border bg-muted overflow-hidden">
              <button
                type="button"
                onClick={() => setAudience("hirer")}
                className={cn(
                  "px-3 py-1.5 text-sm flex items-center gap-1.5 transition-all duration-200",
                  isHirer 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "bg-transparent text-muted-foreground hover-elevate"
                )}
                data-testid="button-toggle-hirer"
              >
                <Briefcase className="h-4 w-4" />
                Hiring team
              </button>
              <button
                type="button"
                onClick={() => setAudience("seeker")}
                className={cn(
                  "px-3 py-1.5 text-sm flex items-center gap-1.5 transition-all duration-200",
                  !isHirer 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "bg-transparent text-muted-foreground hover-elevate"
                )}
                data-testid="button-toggle-seeker"
              >
                <Users className="h-4 w-4" />
                Job seeker
              </button>
            </div>
          </div>
          
          {/* Dynamic Subtitle */}
          <motion.p
            key={audience + authMode}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-muted-foreground mb-6"
          >
            {isSignUp
              ? isHirer
                ? "Create your company account to start reviewing evidence-based candidates."
                : "Create your account to showcase your work and apply to jobs with proof."
              : isHirer
              ? "Use your work email. If your company has SSO, we'll route you automatically."
              : "Sign in to access your applications and portfolio."}
          </motion.p>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-sm font-medium">
                  {isHirer ? "Your name" : "Display name"}
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder={isHirer ? "Jane Smith" : "Your name"}
                  className="h-12"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  data-testid="input-display-name"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder={isHirer ? "name@yourcompany.com" : "you@example.com"}
                  className="pl-10 h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="input-email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type="password"
                  placeholder={isSignUp ? "Create a strong password" : "Enter your password"}
                  className="pl-10 h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  data-testid="input-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full h-12 text-base"
              data-testid="button-submit"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignUp ? "Creating account..." : "Signing in..."}
                </>
              ) : (
                isSignUp ? "Create account" : "Sign in"
              )}
            </Button>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => setAuthMode(isSignUp ? "signin" : "signup")}
                className="text-primary hover:underline"
                data-testid="button-toggle-auth-mode"
              >
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
            </div>

            <div className="mt-6 space-y-3 text-xs text-muted-foreground border-t pt-6">
              {isHirer ? (
                <p className="flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    {isSignUp 
                      ? "Creating a company account? Your team members can join with the same domain."
                      : "Don't have access? Ask your admin to invite you as Recruiter, Reviewer, or Admin."}
                  </span>
                </p>
              ) : (
                <p className="flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    {isSignUp
                      ? "Start building your evidence-based portfolio and apply to jobs with verified proof of your skills."
                      : "Access your applications, manage your portfolio, and showcase your proven capabilities."}
                  </span>
                </p>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
