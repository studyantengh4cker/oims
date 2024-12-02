"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await signIn("google");  // Trigger Google sign-in
    setLoading(false);
  };

  return (
    <main className="h-screen w-full flex">
      <section
        className="hidden md:block flex-1 bg-blue-600"
        style={{
          background: `linear-gradient(rgba(255, 0, 0, 0.089), rgba(0, 0, 0, 0.473)), url("/0.jpg") no-repeat center center / cover`,
        }}
      ></section>
      <section className="w-full md:w-[40rem] bg-primary flex flex-col justify-center items-center p-8 space-y-6 text-center">
        <h1 className="text-primary-foreground text-4xl font-black">
          OFFICE OF STUDENT AFFAIRS AND SERVICES
        </h1>
        <button
          onClick={handleLogin}
          className="bg-white text-primary py-2 px-6 rounded-lg mt-4"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
      </section>
    </main>
  );
}
