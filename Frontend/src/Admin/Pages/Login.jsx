import { useState } from "react";
import { Mail, Lock } from "lucide-react";

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    // TODO: wire up to your auth API
    alert(`Email: ${email}\nPassword: ${password}`);
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-700 to-purple-700 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-[420px] max-w-[92vw]">
        <form onSubmit={onSubmit} className="p-10">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-purple-700">Login</h1>
            <div className="w-16 h-1.5 bg-purple-600 rounded-full mx-auto mt-2" />
          </div>

          {/* Inputs */}
          <div className="mt-10 space-y-5">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-600" />
              <input
                type="email"
                placeholder="Email id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-xl bg-gray-100 pl-12 pr-4 text-[15px] text-gray-700 outline-none border border-transparent focus:border-purple-500 focus:bg-white transition"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-600" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full rounded-xl bg-gray-100 pl-12 pr-4 text-[15px] text-gray-700 outline-none border border-transparent focus:border-purple-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Forgot password */}
          <p className="mt-4 text-sm text-gray-500">
            Lost password?{" "}
            <a href="#" className="text-purple-700 font-medium hover:underline">
              Click here!
            </a>
          </p>

          {/* Actions */}
          <div className="mt-8 grid grid-cols-2 gap-6">
            <button
              type="button"
              className="h-12 rounded-full bg-gray-200 text-gray-600 font-medium hover:bg-gray-300 transition shadow-sm"
              onClick={() => alert("Route to Sign Up")}
            >
              Sign Up
            </button>

            <button
              type="submit"
              className="h-12 rounded-full bg-purple-700 text-white font-semibold shadow hover:bg-purple-800 transition"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
