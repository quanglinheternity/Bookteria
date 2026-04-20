import { AuthLayout } from "@/features/auth/components/auth-layout"
import { RegisterForm } from "@/features/auth/components/register-form"

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Join the community"
      subtitle="Create an account to start scouting and sharing photo spots"
    >
      <RegisterForm />
    </AuthLayout>
  )
}
