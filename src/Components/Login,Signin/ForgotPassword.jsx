import React, { useState } from "react";
import { HiCheck } from "react-icons/hi";
import { IoIosArrowDropleft } from "react-icons/io";
import { Link } from "react-router-dom";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };
  return (
    <div>
      <div className="backdrop-blur-xl bg-white/70 border border-purple-100 shadow-xl rounded-xl p-10 w-full max-w-md">
        <Link to="/">
          {" "}
          <IoIosArrowDropleft className="absolute top-4 left-4 text-4xl text-purple-600 hover:text-indigo-600 transition-colors duration-300 cursor-pointer drop-shadow-lg" />
        </Link>
        {!isSubmitted ? (
          <>
            <h2 className="text-3xl font-bold text-center text-purple-700 mb-2">
              Forgot Password
            </h2>
            <p>
              Enter your email and we'll send you a link to reset your password
            </p>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Email Address</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
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
                  {isLoading ? <>Sending reset link...</> : "Send Reset Link"}
                </span>
              </button>
            </form>
            <p>
              Remember your password?
              <a
                href="/login"
                className="text-purple-600 hover:underline font-medium"
              >
                Back to login
              </a>
            </p>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16  h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiCheck className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Check Your Email
            </h2>
            <p></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
