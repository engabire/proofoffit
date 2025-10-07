import { SimpleAuthGuard } from '@/components/auth/simple-auth-guard'
import EnhancedEnterpriseLoginV2 from '@/components/auth/enhanced-enterprise-login-v2'

export default function EnhancedSignInPage() {
  return (
    <SimpleAuthGuard requireAuth={false}>
      <EnhancedEnterpriseLoginV2 
        mode="signin"
        redirectTo="/dashboard"
      />
    </SimpleAuthGuard>
  )
}
