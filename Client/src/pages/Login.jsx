import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Login.css";

// Your SkillSphere avatar
import avatar from "../assets/student-3d.png";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(formData);

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* =========================
          BACKGROUND DECORATIONS
      ========================= */}

      <div className="login-orb login-orb-one"></div>
      <div className="login-orb login-orb-two"></div>
      <div className="login-orb login-orb-three"></div>

      <div className="login-grid login-grid-left"></div>
      <div className="login-grid login-grid-right"></div>

      <div className="login-floating-shape shape-one"></div>
      <div className="login-floating-shape shape-two"></div>
      <div className="login-floating-shape shape-three"></div>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <div className="login-container">

        {/* =========================
            LOGIN SECTION
        ========================= */}

        <div className="login-form-section">

          {/* Brand */}

          <div className="login-brand">
            <div className="login-brand-icon">
              <Sparkles size={21} />
            </div>

            <div>
              <h1>SkillSphere</h1>
              <p>Learn. Grow. Achieve.</p>
            </div>
          </div>


          {/* Header */}

          <div className="login-header">
            <h2>Welcome back!</h2>

            <p>
              Sign in to continue your learning journey.
            </p>
          </div>


          {/* Error */}

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}


          {/* Form */}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {/* Email */}

            <div className="login-form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="login-input-wrapper">

                <Mail
                  size={18}
                  className="login-input-icon"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />

              </div>

            </div>


            {/* Password */}

            <div className="login-form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="login-input-wrapper">

                <Lock
                  size={18}
                  className="login-input-icon"
                />

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
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

            </div>


            {/* Options */}

            <div className="login-form-options">

              <label className="login-remember">

                <input type="checkbox" />

                <span>
                  Remember me
                </span>

              </label>

              <button
                type="button"
                className="login-forgot"
                onClick={() => {}}
              >
                Forgot password?
              </button>

            </div>


            {/* Submit */}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>


          {/* Footer */}

          <div className="login-footer">

            <p>
              Don't have an account?{" "}

              <Link to="/register">
                Create an account
              </Link>
            </p>

          </div>

        </div>


        {/* =========================
            RIGHT VISUAL SECTION
        ========================= */}

        <div className="login-visual-section">

          {/* Decorative circle */}

          <div className="visual-glow"></div>


          {/* Main learning illustration */}

          <div className="learning-illustration">

            <div className="illustration-sparkle sparkle-one">
              ✦
            </div>

            <div className="illustration-sparkle sparkle-two">
              ✦
            </div>


            {/* YOUR AVATAR */}

            <img
              src={avatar}
              alt="SkillSphere learner"
              className="login-avatar"
            />

          </div>


          {/* Text */}

          <div className="visual-content">

            <div className="visual-icon">
              <GraduationCap size={22} />
            </div>

            <h3>
              Build skills.
              <br />
              Achieve your goals.
            </h3>

            <p>
              Track your progress, explore learning
              paths and grow your skills with SkillSphere.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;