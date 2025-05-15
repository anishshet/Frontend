import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (email === "admin@example.com" && password === "password") {
      // Admin login
      navigate("/admin");
    } else if (email && password.length >= 6) {
      // Regular user login
      navigate("/");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-gray-900 text-gray-500">
      {/* Background Effects */}
      <div className="absolute w-52 h-52 bg-gray-500 opacity-30 top-0 right-0 rounded-[10px_30px_600px_100px] blur-3xl"></div>
      <div className="absolute w-52 h-52 bg-gray-500 opacity-30 bottom-0 left-0 rounded-[100px_30px_600px_100px] blur-3xl"></div>

      {/* Header */}
      <header className="flex flex-col items-center">
        <div className="w-16 h-16 mb-8 bg-gray-800 flex justify-center items-center rounded-lg shadow-lg">
          <img src="./clarovate.png" alt="Logo" className="w-10 h-10" />
        </div>
        <h1 className="text-white text-xl font-medium mb-2">Hi, welcome back!</h1>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[min(300px,90vw)] mt-8">
        {error && (
          <div className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded-lg bg-gray-800 border border-gray-500 text-white outline-none placeholder-gray-400"
          placeholder="Email"
          required
        />

        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded-lg bg-gray-800 border border-gray-500 text-white outline-none w-full placeholder-gray-400"
            placeholder="Password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <button
          type="submit"
          className="p-2 rounded-lg bg-white text-gray-900 font-medium hover:bg-gray-100 transition-colors duration-300"
        >
          Sign in
        </button>

        <Link
          to="/forgot-password"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300 underline text-center block"
        >
          Forgot Password?
        </Link>
      </form>
    </div>
  );
}