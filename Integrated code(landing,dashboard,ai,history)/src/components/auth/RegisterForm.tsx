import React, { useState } from "react";
import { Eye, EyeOff, Info, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const RegisterForm: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Password must be at least 8 characters and include an uppercase letter, number, and special character."
      );
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Signup failed");
      }

      await response.json();
      setVerificationSent(true);
    } catch (error: any) {
      console.error("Signup error", error);
      setErrorMessage(error.message || "Signup failed. Please try again.");
    }
  };

  const handleResend = async () => {
    setResendMessage("");
    setErrorMessage("");
    setIsResending(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/auth/resend-verification?email=${encodeURIComponent(email)}`,
        { method: "POST" }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Failed to resend verification email");
      }
      setResendMessage(data.message || "Verification email resent.");
    } catch (error: any) {
      setErrorMessage(error.message || "Resend failed. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="p-4 max-w-lg mx-auto">
        <h2 className="text-3xl font-bold mb-4">Verify Your Email</h2>
        <div className="p-4 bg-green-100 border border-green-400 text-green-800 rounded-lg flex items-start space-x-2">
          <CheckCircle className="w-6 h-6 mt-1" />
          <p>
            A verification email has been sent to <strong>{email}</strong>. Please check your inbox and follow the instructions.
          </p>
        </div>
        {resendMessage && <p className="text-green-600 mt-2">{resendMessage}</p>}
        {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
        <Button
          onClick={handleResend}
          className="mt-4 w-full bg-intelliclaim-orange hover:bg-intelliclaim-orange/90"
          disabled={isResending}
        >
          {isResending ? "Resending..." : "Resend Verification Email"}
        </Button>
        <p className="text-center mt-4">
          Already verified?{" "}
          <a href="/login" className="text-intelliclaim-orange hover:underline">Login</a>
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="firstName" className="block text-sm text-gray-700">First Name</label>
          <Input
            id="firstName"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter your first name"
            required
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm text-gray-700">Last Name</label>
          <Input
            id="lastName"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter your last name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm text-gray-700">Email</label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="password" className="text-sm text-gray-700">Password</label>
            <div className="relative group inline-block">
              <Info className="w-4 h-4 text-gray-500 cursor-pointer" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap">
                Must be 8+ chars, include 1 uppercase, 1 number, and 1 symbol.
              </div>
            </div>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Enter your password"
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm text-gray-700">Confirm Password</label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            required
          />
        </div>

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        <Button
          type="submit"
          className="w-full bg-intelliclaim-orange hover:bg-intelliclaim-orange/90"
        >
          Sign Up
        </Button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-intelliclaim-orange hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
