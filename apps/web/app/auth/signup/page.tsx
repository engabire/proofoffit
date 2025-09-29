import { EnhancedEnterpriseLogin } from '@/components/auth/enhanced-enterprise-login'
import { AuthGuard } from '@/components/auth/auth-guard'

export default function SignUpPage() {
  return (
    <AuthGuard requireAuth={false}>
      <EnhancedEnterpriseLogin mode="signup" />
    </AuthGuard>
  )
}