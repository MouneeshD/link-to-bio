import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  AtSign,
  Mail,
  Lock,
  UserPlus,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "../styles/Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await signup(
        formData.name,
        formData.username,
        formData.email,
        formData.password
      );

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">

        {/* Brand */}
        <div className="signup-brand">
          <div className="signup-brand-icon">
            <UserPlus size={22} />
          </div>

          <span>LinkBio</span>
        </div>

        {/* Header */}
        <div className="signup-header">
          <h1>Create your account</h1>

          <p>
            Start building your personalized Link-in-Bio page.
          </p>
        </div>

        {/* Form Card */}
        <div className="signup-card">

          {/* Error */}
          {error && (
            <div className="signup-alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div className="signup-field">
              <label htmlFor="name">
                Name
              </label>

              <div className="signup-input-wrapper">
                <User size={18} />

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  autoComplete="name"
                  maxLength={50}
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div className="signup-field">
              <label htmlFor="username">
                Username
              </label>

              <div className="signup-input-wrapper">
                <AtSign size={18} />

                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  autoComplete="username"
                  minLength={3}
                  maxLength={30}
                  pattern="[a-zA-Z0-9_]+"
                  required
                />
              </div>

              <div className="signup-input-hint">
                Your public URL: /
                {formData.username || "username"}
              </div>
            </div>

            {/* Email */}
            <div className="signup-field">
              <label htmlFor="email">
                Email address
              </label>

              <div className="signup-input-wrapper">
                <Mail size={18} />

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="signup-field">
              <label htmlFor="password">
                Password
              </label>

              <div className="signup-input-wrapper">
                <Lock size={18} />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  className="signup-password-toggle"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <div className="signup-password-note">
                Password must be at least 6 characters.
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="signup-submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="signup-spinner" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Login */}
          <div className="signup-footer">
            <span>Already have an account?</span>

            <Link to="/login">
              Sign in
            </Link>
          </div>
        </div>

        {/* Bottom text */}
        <p className="signup-bottom-text">
          Create, customize and share your personal Link-in-Bio page.
        </p>
      </div>
    </div>
  );
};

export default Signup;