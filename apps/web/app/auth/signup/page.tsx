import { SimpleLogin } from '@/components/auth/simple-login'
import { SimpleAuthGuard } from '@/components/auth/simple-auth-guard'
import EnhancedEnterpriseLoginV2 from '@/components/auth/enhanced-enterprise-login-v2'

export default function SignUpPage() {
  // Use enhanced version if enabled via environment variable
  const useEnhancedAuth = process.env.NEXT_PUBLIC_USE_ENHANCED_AUTH === 'true'
  
  if (useEnhancedAuth) {
    return (
      <SimpleAuthGuard requireAuth={false}>
        <EnhancedEnterpriseLoginV2 
          mode="signup"
          redirectTo="/dashboard"
        />
      </SimpleAuthGuard>
    )
  }

  return (
    <SimpleAuthGuard requireAuth={false}>
      <SimpleLogin mode="signup" />
    </SimpleAuthGuard>
  )
}