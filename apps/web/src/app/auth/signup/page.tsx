import { SimpleLogin } from '@/components/auth/simple-login'
import { SimpleAuthGuard } from '@/components/auth/simple-auth-guard'

export default function SignUpPage() {
  return (
    <SimpleAuthGuard requireAuth={false}>
      <SimpleLogin mode="signup" />
    </SimpleAuthGuard>
  )
}