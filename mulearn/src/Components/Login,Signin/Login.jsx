import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { IoIosArrowDropleft } from "react-icons/io";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Here you would typically handle login logic
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 px-4 py-12">
      <Link to="/">
        {" "}
        <IoIosArrowDropleft className="absolute top-4 left-4 text-4xl text-purple-600 hover:text-indigo-600 transition-colors duration-300 cursor-pointer drop-shadow-lg" />
      </Link>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Purple circle */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"></div>

        {/* Indigo circle */}
        <div
          className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Small circles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-purple-500 rounded-full opacity-20"
            style={{
              width: `${20 + Math.random() * 30}px`,
              height: `${20 + Math.random() * 30}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${10 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}

        {/* Geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-4 border-purple-200 rounded-lg transform rotate-45 opacity-20 animate-spin-slow"></div>
        <div
          className="absolute bottom-1/4 right-1/3 w-24 h-24 border-4 border-indigo-200 transform rotate-12 opacity-20 animate-spin-slow"
          style={{ animationDirection: "reverse", animationDuration: "30s" }}
        ></div>
      </div>

      {/* Login Container */}
      <div className="backdrop-blur-xl bg-white/70 border border-purple-100 shadow-xl rounded-xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Sign in to your μlearn account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <label
              className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                focusedField === "email" || email
                  ? "-top-2 text-xs bg-white px-2 text-purple-600 font-medium"
                  : "top-3 text-gray-500"
              }`}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              className={`w-full p-3 border rounded-lg focus:outline-none transition-all duration-300 ${
                focusedField === "email"
                  ? "border-purple-500 shadow-sm shadow-purple-100"
                  : "border-gray-300"
              }`}
              required
            />
            <div
              className={`absolute bottom-0 left-0 h-0.5 bg-purple-600 transition-all duration-300 ${
                focusedField === "email" ? "w-full" : "w-0"
              }`}
            ></div>
          </div>

          {/* Password Field */}
          <div className="relative">
            <label
              className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                focusedField === "password" || password
                  ? "-top-2 text-xs bg-white px-2 text-purple-600 font-medium"
                  : "top-3 text-gray-500"
              }`}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              className={`w-full p-3 border rounded-lg focus:outline-none transition-all duration-300 ${
                focusedField === "password"
                  ? "border-purple-500 shadow-sm shadow-purple-100"
                  : "border-gray-300"
              }`}
              required
            />
            <div
              className={`absolute bottom-0 left-0 h-0.5 bg-purple-600 transition-all duration-300 ${
                focusedField === "password" ? "w-full" : "w-0"
              }`}
            ></div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            {" "}
            <a
              href="/forgotPassword"
              className="text-sm text-purple-600 hover:text-purple-800 transition-colors duration-300"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-200 relative overflow-hidden group"
          >
            <span
              className={`absolute inset-0 w-full h-full transition-all duration-500 ease-out transform ${
                isLoading ? "scale-x-100" : "scale-x-0"
              } origin-left bg-purple-700`}
            ></span>
            <span className="relative flex items-center justify-center gap-2">
              {isLoading ? <>Signing in...</> : "Sign In"}
            </span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center mt-8">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid gap-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
            >
              <FcGoogle />
              Google
            </button>
          </div>
        </form>

        {/* Sign Up */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-purple-600 hover:underline font-medium"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
