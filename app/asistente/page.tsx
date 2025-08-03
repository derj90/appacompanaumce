"use client";

import { useEffect, useState, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface Message {
  id?: string;
  pregunta: string;
  respuesta: string | null;
  created_at?: string;
}

export default function AsistentePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState("");
  const [userName, setUserName] = useState("");
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      setUserName(
        session.user.user_metadata.full_name || session.user.email || "Usuario"
      );

      const { data, error } = await supabase
        .from("messages")
        .select("id, pregunta, respuesta, created_at")
        .eq("usuario_id", session.user.id)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data as Message[]);
      }
    };

    loadSession();
  }, [router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const prompt = question.trim();
    if (!prompt) return;

    setStatus("Procesando respuesta...");

    // add the user's question immediately
    setMessages([
      ...messages,
      { pregunta: prompt, respuesta: null, created_at: new Date().toISOString() },
    ]);
    setQuestion("");

    const { data, error } = await supabase.functions.invoke("askAI", {
      body: { prompt },
    });

    if (error || !data) {
      setStatus(
        "Hubo un problema al obtener la respuesta. Intenta nuevamente."
      );
      return;
    }

    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1].respuesta = data.answer;
      return updated;
    });
    setStatus("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hola, {userName}</h1>
      <div className="space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="bg-white shadow p-4 rounded">
            <p className="font-semibold">🧑 {msg.pregunta}</p>
            {msg.respuesta && <p className="mt-2">🤖 {msg.respuesta}</p>}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Escribe tu pregunta..."
          className="flex-1 border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded">
          Enviar
        </button>
      </form>
      {status && <p className="mt-2 text-center">{status}</p>}
    </div>
  );
}
