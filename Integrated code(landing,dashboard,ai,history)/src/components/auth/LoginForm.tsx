import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  const navigate = useNavigate();
  const adminEmailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showAdminModal) {
      setTimeout(() => adminEmailRef.current?.focus(), 100);
    }
  }, [showAdminModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch("http://127.0.0.1:8000/api/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      navigate("/dashboard");
    } catch (error: any) {
      setErrorMessage(error.message || "Login failed. Please try again.");
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", adminEmail);
      formData.append("password", adminPassword);

      const response = await fetch("http://127.0.0.1:8000/admin-token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Admin login failed");
      }

      const data = await response.json();
      localStorage.setItem("admin_token", data.access_token);
      navigate("/admin-dashboard");
    } catch (error: any) {
      setAdminError(error.message || "Admin login failed.");
    }
  };

  return (
    <>
      {/* Main Login Form */}
      <div className={clsx("transition-all duration-300", showAdminModal && "blur-sm pointer-events-none select-none")}>
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <label htmlFor="remember" className="text-sm font-medium text-gray-600">Remember me</label>
            </div>
            <a href="/forgot-password" className="text-sm text-intelliclaim-orange hover:underline">Forgot password?</a>
          </div>

          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

          <Button type="submit" className="w-full bg-intelliclaim-orange hover:bg-intelliclaim-orange/90">Sign In</Button>

          <div className="text-center mt-4">
            <p className="text-sm">
              Don't have an account?{" "}
              <a href="/register" className="text-intelliclaim-orange hover:underline">Sign up</a>
            </p>
            <button
              type="button"
              onClick={() => setShowAdminModal(true)}
              className="mt-3 text-sm text-intelliclaim-orange hover:underline"
            >
              Admin Login
            </button>
          </div>
        </form>
      </div>

      {/* Admin Login Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm relative">
            <button
              onClick={() => setShowAdminModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Close admin login"
            >
              <X />
            </button>
            <h3 className="text-xl font-semibold mb-6 text-center">Admin Login</h3>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <Input
                placeholder="Admin Email"
                type="email"
                ref={adminEmailRef}
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                autoComplete="username"
              />
              <Input
                placeholder="Admin Password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              {adminError && <p className="text-red-500 text-sm">{adminError}</p>}
              <Button type="submit" className="w-full bg-intelliclaim-orange hover:bg-intelliclaim-orange/90">Login as Admin</Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginForm;
