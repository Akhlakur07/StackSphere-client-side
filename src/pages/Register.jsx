import React, { useState, useContext } from "react";
import Lottie from "lottie-react";
import registerLottie from "../assets/lottie/Register.json";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:3000";

const Register = () => {
  const navigate = useNavigate();
  const { createUser, updateUser, googleSignin } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    photoURL: "",
    bio: "",
  });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFocus = (field) => setFocusedField(field);
  const handleBlur = () => setFocusedField("");

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Enter a valid email.";
    if (form.password.length < 6) {
      next.password = "Password must be at least 6 characters.";
    } else {
      if (!/[A-Z]/.test(form.password))
        next.password = "Include at least one uppercase letter.";
      if (!/[a-z]/.test(form.password))
        next.password =
          (next.password ? next.password + " " : "") +
          "Include at least one lowercase letter.";
    }
    return next;
  };

  const saveUserToBackend = async (payload) => {
    const res = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to save user");
    }
    return res.json();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    try {
      setSubmitting(true);
      await createUser(form.email, form.password);
      await updateUser({
        displayName: form.name,
        photoURL: form.photoURL || undefined,
      });

      await saveUserToBackend({
        name: form.name,
        email: form.email,
        photo: form.photoURL,
        bio: form.bio,
        role: "user",
        membership: { status: "none" },
        authProvider: "password",
        createdAt: new Date().toISOString(),
      });

      toast.success("🎉 Account created successfully!", {
        autoClose: 1200,
        onClose: () => navigate("/"),
      });
    } catch (err) {
      toast.error(err?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setSubmitting(true);
      const { user } = await googleSignin();

      await saveUserToBackend({
        name: user?.displayName || "",
        email: user?.email || "",
        photo: user?.photoURL || "",
        bio: "",
        role: "user",
        membership: { status: "none" },
        authProvider: "google",
        createdAt: new Date().toISOString(),
      });

      toast.success("✅ Signed in with Google!", {
        autoClose: 1200,
        onClose: () => navigate("/"),
      });
    } catch (err) {
      toast.error(err?.message || "Google sign-in failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-100/50 via-transparent to-transparent"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="relative rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl shadow-purple-500/10 border border-white/20 overflow-hidden">
          {/* Header Section */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-violet-500"></div>
          
          <div className="grid lg:grid-cols-2 min-h-[85vh]">
            {/* Lottie Animation Side */}
            <div className="hidden lg:flex items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-violet-50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-300/50 to-transparent"></div>
              <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                    Join StackSphere
                  </h2>
                  <p className="text-gray-600 mt-2">Where developers build amazing things together</p>
                </div>
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-100 to-violet-100 rounded-2xl blur-lg opacity-75"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/50">
                    <Lottie
                      animationData={registerLottie}
                      loop
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                  {["🚀 Fast", "🔒 Secure", "💡 Innovative"].map((item, idx) => (
                    <div key={idx} className="bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/30 shadow-sm">
                      <p className="text-sm font-medium text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12 mt-10">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl shadow-lg shadow-purple-500/25 mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Create Account
                  </h1>
                  <p className="mt-2 text-gray-600">
                    Join thousands of developers in our community
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                  {/* Name Field */}
                  <div className="relative">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name
                    </label>
                    <div className={`relative transition-all duration-300 ${
                      focusedField === 'name' ? 'transform scale-105' : ''
                    }`}>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        onFocus={() => handleFocus('name')}
                        onBlur={handleBlur}
                        placeholder="Enter your full name"
                        className="w-full rounded-2xl border border-gray-200 bg-white/80 px-4 py-3.5 shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none transition-all duration-300 backdrop-blur-sm"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-violet-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </div>
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <div className={`relative transition-all duration-300 ${
                      focusedField === 'email' ? 'transform scale-105' : ''
                    }`}>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        onFocus={() => handleFocus('email')}
                        onBlur={handleBlur}
                        placeholder="you@example.com"
                        className="w-full rounded-2xl border border-gray-200 bg-white/80 px-4 py-3.5 shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none transition-all duration-300 backdrop-blur-sm"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-violet-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Photo URL Field */}
                  <div className="relative">
                    <label
                      htmlFor="photoURL"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Profile Photo URL <span className="text-gray-400">(Optional)</span>
                    </label>
                    <div className={`relative transition-all duration-300 ${
                      focusedField === 'photoURL' ? 'transform scale-105' : ''
                    }`}>
                      <input
                        id="photoURL"
                        name="photoURL"
                        type="url"
                        value={form.photoURL}
                        onChange={handleChange}
                        onFocus={() => handleFocus('photoURL')}
                        onBlur={handleBlur}
                        placeholder="https://example.com/photo.jpg"
                        className="w-full rounded-2xl border border-gray-200 bg-white/80 px-4 py-3.5 shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none transition-all duration-300 backdrop-blur-sm"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-violet-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </div>
                  </div>

                  {/* Bio Field */}
                  <div className="relative">
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Bio <span className="text-gray-400">(Optional)</span>
                    </label>
                    <div className={`relative transition-all duration-300 ${
                      focusedField === 'bio' ? 'transform scale-105' : ''
                    }`}>
                      <textarea
                        id="bio"
                        name="bio"
                        rows="3"
                        value={form.bio}
                        onChange={handleChange}
                        onFocus={() => handleFocus('bio')}
                        onBlur={handleBlur}
                        placeholder="Tell us about yourself..."
                        className="w-full rounded-2xl border border-gray-200 bg-white/80 px-4 py-3.5 shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none transition-all duration-300 resize-none backdrop-blur-sm"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-violet-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Password
                    </label>
                    <div className={`relative transition-all duration-300 ${
                      focusedField === 'password' ? 'transform scale-105' : ''
                    }`}>
                      <input
                        id="password"
                        name="password"
                        type={showPass ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        onFocus={() => handleFocus('password')}
                        onBlur={handleBlur}
                        placeholder="••••••••"
                        className="w-full rounded-2xl border border-gray-200 bg-white/80 px-4 py-3.5 pr-12 shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none transition-all duration-300 backdrop-blur-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((s) => !s)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
                      >
                        {showPass ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-violet-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        {errors.password}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500 bg-gray-50/80 rounded-lg p-2 backdrop-blur-sm">
                      🔒 Must include at least 6 characters, one uppercase (A-Z), and one lowercase (a-z).
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <span className="relative">
                      {submitting ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating your account...
                        </div>
                      ) : (
                        "Create Account"
                      )}
                    </span>
                  </button>

                  {/* Divider */}
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white/80 backdrop-blur-sm px-4 text-sm text-gray-500 rounded-full border border-gray-200">
                        or continue with
                      </span>
                    </div>
                  </div>

                  {/* Google Login */}
                  <button
                    type="button"
                    onClick={handleGoogle}
                    disabled={submitting}
                    className="w-full rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed text-gray-700 font-semibold py-3.5 shadow-sm hover:shadow-md inline-flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-[1.02] group"
                  >
                    <svg
                      viewBox="0 0 533.5 544.3"
                      className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="#4285F4"
                        d="M533.5 278.4c0-18.6-1.7-37-5.2-54.8H272.1v103.7h147c-6.3 34-25 62.7-53.5 81.9v67h86.5c50.6-46.6 81.4-115.3 81.4-197.8z"
                      />
                      <path
                        fill="#34A853"
                        d="M272.1 544.3c72.3 0 133.1-23.9 177.5-65.1l-86.5-67c-24 16.1-54.7 25.6-91 25.6-69.9 0-129.3-47.2-150.5-110.6H32.7v69.6c44.6 88.4 136.5 147.5 239.4 147.5z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M121.6 327.2c-10.1-29.9-10.1-62.1 0-92l.1-69.6H32.7c-42.9 85-42.9 186.2 0 271.2l88.9-69.6z"
                      />
                      <path
                        fill="#EA4335"
                        d="M272.1 107.7c39.3-.6 77.4 13.6 106.9 39.9l79.6-79.6C410.8 24.2 343.6-0.3 272.1 0 169.2 0 77.3 59.1 32.7 147.5l88.9 69.6C143 153.7 202.3 107.7 272.1 107.7z"
                      />
                    </svg>
                    Continue with Google
                  </button>

                  {/* Login Link */}
                  <p className="text-center text-sm text-gray-600 pt-4">
                    Already have an account?{" "}
                    <Link to="/login">
                      <span className="font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-violet-700 transition-all duration-300 underline underline-offset-4">
                        Log in here
                      </span>
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default Register;