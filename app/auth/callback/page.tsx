'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Procesando autenticación...');

  useEffect(() => {
    const handleRedirect = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setMessage('Error: no se pudo obtener la sesión.');
        return;
      }

      const { user } = session;
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) {
        setMessage('Error al leer usuario.');
        return;
      }

      if (!existingUser) {
        const { error: insertError } = await supabase.from('users').insert({
          id: user.id,
          email: user.email,
          nombre: user.user_metadata.full_name,
          rol: 'estudiante',
        });

        if (insertError) {
          setMessage('Error al registrar usuario.');
          return;
        }
      }

      router.replace('/asistente');
    };

    handleRedirect();
  }, [router]);

  return <p className="p-4 text-center">{message}</p>;
}
