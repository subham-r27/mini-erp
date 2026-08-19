import {
    Eye,
    EyeOff,
    LockKeyhole,
    LogIn,
    Mail,
    ShieldCheck,
  } from "lucide-react";
  
  import {
    useState,
    type FormEvent,
  } from "react";
  
  import {
    useLocation,
    useNavigate,
  } from "react-router";
  
  import {
    useAuth,
  } from "../context/AuthContext";
  
  export default function Login() {
    const navigate =
      useNavigate();
  
    const location =
      useLocation();
  
    const {
      login,
    } = useAuth();
  
    const [email, setEmail] =
      useState("");
  
    const [password, setPassword] =
      useState("");
  
    const [showPassword, setShowPassword] =
      useState(false);
  
    const [loading, setLoading] =
      useState(false);
  
    const [error, setError] =
      useState("");
  
    const from =
      (
        location.state as
          | {
              from?: string;
            }
          | undefined
      )?.from ||
      "/dashboard";
  
    const handleSubmit = async (
      event: FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();
  
      setError("");
      setLoading(true);
  
      try {
        await login(
          email.trim(),
          password,
        );

        navigate(from, {
          replace: true,
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Invalid email or password.";

        setError(message);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="grid min-h-screen lg:grid-cols-2">
          {/* Left branding */}
  
          <div className="hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-lg font-bold backdrop-blur">
                  M
                </div>
  
                <div>
                  <p className="font-bold tracking-wide">
                    MINI ERP
                  </p>
  
                  <p className="text-xs text-indigo-200">
                    Business Management
                  </p>
                </div>
              </div>
            </div>
  
            <div className="max-w-lg">
              <p className="mb-4 text-sm font-medium text-indigo-200">
                BUSINESS MANAGEMENT PLATFORM
              </p>
  
              <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
                Manage your business from one place.
              </h1>
  
              <p className="mt-5 max-w-md text-sm leading-6 text-indigo-100">
                Manage customers, products,
                inventory, challans and
                invoices with a unified ERP
                workspace.
              </p>
            </div>
  
            <div className="flex items-center gap-2 text-xs text-indigo-200">
              <ShieldCheck className="h-4 w-4" />
              Secure business workspace
            </div>
          </div>
  
          {/* Login */}
  
          <div className="flex items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-md">
              {/* Mobile logo */}
  
              <div className="mb-10 lg:hidden">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
                    M
                  </div>
  
                  <div>
                    <p className="font-bold text-slate-900">
                      MINI ERP
                    </p>
  
                    <p className="text-xs text-slate-400">
                      Business Management
                    </p>
                  </div>
                </div>
              </div>
  
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-7">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <LogIn className="h-5 w-5" />
                  </div>
  
                  <h2 className="text-2xl font-bold text-slate-900">
                    Welcome back
                  </h2>
  
                  <p className="mt-1.5 text-sm text-slate-500">
                    Sign in to continue to
                    your ERP workspace.
                  </p>
                </div>
  
                {error && (
                  <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}
  
                <form
                  onSubmit={
                    handleSubmit
                  }
                  className="space-y-5"
                >
                  {/* Email */}
  
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                      Email Address
                    </label>
  
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
  
                      <input
                        type="email"
                        value={email}
                        onChange={(
                          event,
                        ) =>
                          setEmail(
                            event.target
                              .value,
                          )
                        }
                        placeholder="you@company.com"
                        autoComplete="email"
                        required
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                      />
                    </div>
                  </div>
  
                  {/* Password */}
  
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                      Password
                    </label>
  
                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
  
                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={password}
                        onChange={(
                          event,
                        ) =>
                          setPassword(
                            event.target
                              .value,
                          )
                        }
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                      />
  
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (value) =>
                              !value,
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
  
                  {/* Submit */}
  
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </>
                    )}
                  </button>
                </form>
  
                {/* Development credentials */}
  
                <div className="mt-6 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-700">
                    Development login
                  </p>
  
                  <p className="mt-1 text-xs text-slate-500">
                    Email: subham@minierp.com
                  </p>
  
                  <p className="text-xs text-slate-500">
                    Password: admin123
                  </p>
                </div>
              </div>
  
              <p className="mt-6 text-center text-xs text-slate-400">
                © 2026 Mini ERP. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }