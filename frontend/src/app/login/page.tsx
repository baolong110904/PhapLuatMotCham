"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserAuth } from "@/components/Context/AuthContext";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const { signInUser } = UserAuth();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const result = await signInUser(user, pass);

    if (result.success) {
      // Optionally store session or token if needed
      router.push("/"); // redirect to homepage
    } else {
      setError(result.error || "Invalid credentials");
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col max-w-sm mx-auto p-4"
    >
      <h1 className="text-xl font-bold mb-2">Login</h1>

      <input
        type="text"
        placeholder="Email"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        className="border p-2 mb-2 rounded-2xl"
      />

      <input
        type="password"
        placeholder="Password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        className="border p-2 mb-2 rounded-2xl"
      />

      <button
        type="submit"
        className="bg-blue-500 text-white font-bold p-2 rounded-2xl cursor-pointer"
      >
        Login
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}