import { serve } from 'https://deno.land/std@0.192.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { prompt } = await req.json()
    if (!prompt) {
      return new Response('Missing prompt', { status: 400 })
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: { headers: { Authorization: req.headers.get('Authorization')! } },
      }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!openaiRes.ok) {
      const errorText = await openaiRes.text()
      console.error('OpenAI error', errorText)
      return new Response('Error with OpenAI', { status: 500 })
    }

    const completion = await openaiRes.json()
    const answer: string = completion.choices?.[0]?.message?.content?.trim() || ''

    const { error } = await supabaseClient.from('messages').insert({
      usuario_id: user.id,
      pregunta: prompt,
      respuesta: answer,
      fecha: new Date().toISOString(),
      categoria: 'general',
    })

    if (error) {
      console.error('DB insert error', error.message)
    }

    return new Response(JSON.stringify({ answer }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Unexpected error', err)
    return new Response('Server error', { status: 500 })
  }
})
