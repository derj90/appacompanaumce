'use client';
import { supabase } from '@/lib/supabaseClient';

export function LoginButton() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <button onClick={handleLogin} className="p-2 bg-blue-500 text-white rounded">
      Iniciar sesi\u00f3n con Google
    </button>
  );
}
