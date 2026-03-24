"use client";
import React, { useState } from 'react';
import { createClient } from '../../lib/supabase/client'; 
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (authError) {
      setError("Access Denied: Invalid Credentials");
      setLoading(false);
    } else {
      // 1. Refresh ensures the middleware sees the new cookie
      router.refresh(); 
      // 2. Delay slightly to let the cookie settle, then push to admin
      setTimeout(() => {
        router.push('/admin/products');
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-12">
        <div className="text-center space-y-4">
          <span className="text-[10px] uppercase tracking-[0.6em] text-gold font-bold">Security Protocol</span>
          <h1 className="text-4xl font-serif italic text-bone tracking-tighter">AETHER Login</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="ADMIN EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-b border-white/10 py-4 text-[10px] tracking-[0.3em] text-bone focus:border-gold outline-none transition-colors uppercase"
            required
          />
          <input
            type="password"
            placeholder="ACCESS KEY"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b border-white/10 py-4 text-[10px] tracking-[0.3em] text-bone focus:border-gold outline-none transition-colors uppercase"
            required
          />

          {error && <p className="text-[9px] text-red-500 uppercase tracking-widest text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-bone text-charcoal py-5 text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-gold transition-all duration-500 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Authorize Entry"}
          </button>
        </form>
      </div>
    </div>
  );
}