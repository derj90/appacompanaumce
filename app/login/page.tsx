import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { LoginButton } from '@/components/LoginButton';

export default async function LoginPage() {
  const supabase = createServerActionClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/asistente');
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl font-bold">Acompa\u00f1aUMCE</h1>
      <LoginButton />
    </div>
  );
}
