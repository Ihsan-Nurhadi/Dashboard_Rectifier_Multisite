"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Simple hardcoded credentials – replace with API call if needed
const VALID_USERNAME = "nyk_ws";
const VALID_PASSWORD = "admin123";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number; speed: number }>>([]);

  // Redirect if already logged in
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("isAuthenticated") === "true") {
      router.replace("/");
    }
  }, [router]);

  // Generate floating particles for background
  useEffect(() => {
    const generated = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      opacity: Math.random() * 0.4 + 0.1,
      speed: Math.random() * 20 + 10,
    }));
    setParticles(generated);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 600)); // simulate async

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("username", username);
      router.push("/");
    } else {
      setError("Username atau password salah. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0c1445 100%)" }}>
      {/* Animated background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-indigo-400 pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `floatParticle ${p.speed}s ease-in-out infinite alternate`,
          }}
        />
      ))}

      {/* Glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #4f46e5, transparent)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl" style={{ background: "radial-gradient(circle, #818cf8, transparent)" }} />

      {/* Login Card */}
      <div
        className="relative z-10 w-full max-w-md mx-4"
        style={{
          background: "rgba(15, 23, 42, 0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          borderRadius: "24px",
          boxShadow: "0 0 60px rgba(99, 102, 241, 0.15), 0 25px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Top accent bar */}
        <div
          className="h-1 w-full rounded-t-3xl"
          style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)" }}
        />

        <div className="p-8">
          {/* Logo / Icon */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                boxShadow: "0 0 30px rgba(99, 102, 241, 0.4)",
              }}
            >
              {/* Bolt / Power icon */}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L4.5 13H12L11 22L19.5 11H12L13 2Z" fill="white" stroke="white" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Rectifier Monitor</h1>
            <p className="text-sm mt-1" style={{ color: "rgba(148, 163, 184, 0.8)" }}>
              IoT Power System Dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "rgba(148, 163, 184, 1)" }}>
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(99,102,241,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 outline-none transition-all duration-200"
                  style={{
                    background: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid rgba(99, 102, 241, 0.25)",
                    fontSize: "14px",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.8)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.25)")}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "rgba(148, 163, 184, 1)" }}>
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(99,102,241,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-white placeholder-slate-500 outline-none transition-all duration-200"
                  style={{
                    background: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid rgba(99, 102, 241, 0.25)",
                    fontSize: "14px",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.8)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.25)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#fca5a5" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              id="login-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 relative overflow-hidden"
              style={{
                background: isLoading
                  ? "rgba(99, 102, 241, 0.5)"
                  : "linear-gradient(135deg, #6366f1, #4f46e5)",
                boxShadow: isLoading ? "none" : "0 0 20px rgba(99,102,241,0.4)",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  (e.target as HTMLButtonElement).style.transform = "translateY(-1px)";
                  (e.target as HTMLButtonElement).style.boxShadow = "0 0 30px rgba(99,102,241,0.6)";
                }
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.transform = "translateY(0)";
                (e.target as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(99,102,241,0.4)";
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Masuk...
                </span>
              ) : (
                "Masuk ke Dashboard"
              )}
            </button>
          </form>

          {/* Footer hint */}
          <p className="text-center text-xs mt-6" style={{ color: "rgba(100, 116, 139, 0.7)" }}>
            © 2025 PT NAYAKA PRATAMA MONITORING SYSTEM
          </p>
        </div>
      </div>

      <style>{`
        @keyframes floatParticle {
          0% { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-30px) scale(1.2); }
        }
      `}</style>
    </div>
  );
}
