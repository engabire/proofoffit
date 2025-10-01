import { SimpleLogin } from '@/components/auth/simple-login'
import { SimpleAuthGuard } from '@/components/auth/simple-auth-guard'

export default function SignInPage() {
  return (
    <SimpleAuthGuard requireAuth={false}>
      <SimpleLogin mode="signin" />
    </SimpleAuthGuard>
  )
}