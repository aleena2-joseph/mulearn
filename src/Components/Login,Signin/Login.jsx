import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowDropleft } from "react-icons/io";
import { signInWithEmailAndPassword } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase"; // Adjust path as needed
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase"; // your firestore

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user);
      navigate("/admin");
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Failed to sign in. Please try again.";
      if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setResetError("");
    setResetMessage("");
    if (!resetEmail) {
      setResetError("Please enter your email address.");
      return;
    }
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("Password reset email sent! Check your inbox.");
      setResetEmail("");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setResetError("No account found with this email.");
      } else if (error.code === "auth/invalid-email") {
        setResetError("Invalid email address.");
      } else {
        setResetError(error.message);
      }
    } finally {
      setResetLoading(false);
    }
  };

const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists() && userSnap.data().role === "admin") {
      navigate("/admin");
    } else {
      setError("You are not authorized as admin");
    }

  } catch (error) {
    console.error(error);
    setError("Google sign-in failed");
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 px-4 py-12">
      <Link to="/">
        <IoIosArrowDropleft className="absolute top-4 left-4 text-4xl text-purple-600 hover:text-indigo-600 transition-colors duration-300 cursor-pointer drop-shadow-lg" />
      </Link>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"></div>
        <div
          className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-4 border-purple-200 rounded-lg transform rotate-45 opacity-20 animate-spin-slow"></div>
        <div
          className="absolute bottom-1/4 right-1/3 w-24 h-24 border-4 border-indigo-200 transform rotate-12 opacity-20 animate-spin-slow"
          style={{ animationDirection: "reverse", animationDuration: "30s" }}
        ></div>
      </div>

      <div className="backdrop-blur-xl bg-white/70 border border-purple-100 shadow-xl rounded-xl p-10 w-full max-w-md relative z-10">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Sign in to your μlearn account
        </p>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(true);
                setResetMessage("");
                setResetError("");
                setResetEmail("");
              }}
              className="text-sm text-purple-600 hover:text-purple-800 transition-colors duration-300"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-200 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span
              className={`absolute inset-0 w-full h-full transition-all duration-500 ease-out transform ${
                isLoading ? "scale-x-100" : "scale-x-0"
              } origin-left bg-purple-700`}
            ></span>
            <span className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </span>
          </button>

          <div className="relative flex items-center mt-8">
            <div className="flex-grow border-t border-gray-200"></div>
          <button
  type="button"
  onClick={handleGoogleLogin}
  className="w-full border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition"
>
  <img 
    src="https://www.svgrepo.com/show/475656/google-color.svg" 
    alt="Google" 
    className="w-5 h-5"
  />
  Sign in with Google
</button>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
        </form>

        {/* Sign Up */}
        {/* <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-purple-600 hover:underline font-medium"
          >
            Sign up
          </a>
        </p> */}
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm relative">
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl font-light transition-colors"
            >
              &times;
            </button>

            <h3 className="text-xl font-bold text-purple-700 mb-1">Reset Password</h3>
            <p className="text-sm text-gray-500 mb-6">
              Enter your email address and we'll send you a reset link.
            </p>

            <div className="relative mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:shadow-sm focus:shadow-purple-100 transition-all duration-300"
              />
            </div>

            {resetMessage && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-700 text-sm text-center">{resetMessage}</p>
              </div>
            )}

            {resetError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm text-center">{resetError}</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {resetLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}