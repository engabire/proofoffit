import { EnhancedEnterpriseLogin } from '@/components/auth/enhanced-enterprise-login'
import { AuthGuard } from '@/components/auth/auth-guard'

export default function SignInPage() {
  return (
    <AuthGuard requireAuth={false}>
      <EnhancedEnterpriseLogin mode="signin" />
    </AuthGuard>
  )
}