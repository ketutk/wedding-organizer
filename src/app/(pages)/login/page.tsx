"use client";

import { use, useState } from "react";
import { useMessage } from "../../messageContext";
import { useRouter } from "next/navigation";
import { FetchData } from "@/lib/fetch";
import { useAuth } from "@/app/authContext";
import { User } from "@/app/_lib/type";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showMessage } = useMessage();
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const res = (await FetchData("/api/login", "POST", { email, password })) as { success: true; data: User };
      login(res.data);
      router.push("/admin/dashboard");
    } catch (error) {
      if (typeof error == "string") {
        showMessage(error, "error");
      } else if (error instanceof Error) {
        showMessage(error.message, "error");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
        <h1 className="text-3xl font-bold text-black text-center mb-6">Login</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="w-full py-2 px-4 bg-black hover:bg-gray-800 text-white rounded-md font-semibold transition" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="/register" className="text-black hover:underline">
            Register here
          </a>
        </p>

        <p className="mt-4 text-center text-sm text-gray-500">
          Forgot your password?{" "}
          <a href="#" className="text-black hover:underline">
            Reset here
          </a>
        </p>
      </div>
    </div>
  );
}
