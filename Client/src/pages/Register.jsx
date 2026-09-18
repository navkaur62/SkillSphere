import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  User,
  GraduationCap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import authService from "../services/authService";
import { useAuth } from "../context/useAuth";

import studentImage from "../assets/student-3d.png";

import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Register the student
      await authService.register({
        name,
        email,
        password,
      });

      // Mark user as newly registered
      sessionStorage.setItem("newUser", "true");

      // Automatically login
      await login({
        email,
        password,
      });

      // Go to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* =========================
          BACKGROUND DECORATIONS
      ========================= */}

      <div className="register-orb register-orb-one"></div>
      <div className="register-orb register-orb-two"></div>
      <div className="register-orb register-orb-three"></div>

      <div className="register-grid register-grid-left"></div>
      <div className="register-grid register-grid-right"></div>

      <div className="register-floating-shape register-shape-one"></div>
      <div className="register-floating-shape register-shape-two"></div>
      <div className="register-floating-shape register-shape-three"></div>


      {/* =========================
          MAIN CONTAINER
      ========================= */}

      <div className="register-container">

        {/* =========================
            REGISTER FORM SECTION
        ========================= */}

        <div className="register-form-section">

          {/* Brand */}

          <div className="register-brand">

            <div className="register-brand-icon">
              <Sparkles size={21} />
            </div>

            <div>
              <h1>SkillSphere</h1>
              <p>Learn. Grow. Achieve.</p>
            </div>

          </div>


          {/* Header */}

          <div className="register-header">

            <h2>Create your account</h2>

            <p>
              Start building your skills and tracking your
              progress.
            </p>

          </div>


          {/* Error */}

          {error && (
            <div className="register-error">
              {error}
            </div>
          )}


          {/* Form */}

          <form
            className="register-form"
            onSubmit={handleRegister}
          >

            {/* Full Name */}

            <div className="register-form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <div className="register-input-wrapper">

                <User
                  size={18}
                  className="register-input-icon"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  autoComplete="name"
                  required
                />

              </div>

            </div>


            {/* Email */}

            <div className="register-form-group">

              <label htmlFor="register-email">
                Email Address
              </label>

              <div className="register-input-wrapper">

                <Mail
                  size={18}
                  className="register-input-icon"
                />

                <input
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                  required
                />

              </div>

            </div>


            {/* Password */}

            <div className="register-form-group">

              <label htmlFor="register-password">
                Password
              </label>

              <div className="register-input-wrapper">

                <Lock
                  size={18}
                  className="register-input-icon"
                />

                <input
                  id="register-password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="register-password-toggle"
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


            {/* Confirm Password */}

            <div className="register-form-group">

              <label htmlFor="confirm-password">
                Confirm Password
              </label>

              <div className="register-input-wrapper">

                <Lock
                  size={18}
                  className="register-input-icon"
                />

                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* Create Account */}

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>


          {/* Footer */}

          <div className="register-footer">

            <p>
              Already have an account?{" "}

              <Link to="/login">
                Sign in
              </Link>
            </p>

          </div>

        </div>


        {/* =========================
            RIGHT VISUAL SECTION
        ========================= */}

        <div className="register-visual-section">

          {/* Decorative glow */}

          <div className="register-visual-glow"></div>


          {/* Sparkles */}

          <div className="register-illustration-sparkle register-sparkle-one">
            ✦
          </div>

          <div className="register-illustration-sparkle register-sparkle-two">
            ✦
          </div>


          {/* YOUR ACTUAL STUDENT IMAGE */}

          <div className="register-student-image-wrapper">

            <img
              src={studentImage}
              alt="Student learning with laptop"
              className="register-student-image"
            />

          </div>


          {/* Visual Text */}

          <div className="register-visual-content">

            <div className="register-visual-icon">
              <GraduationCap size={22} />
            </div>

            <h3>
              Start your journey.
              <br />
              Build your future.
            </h3>

            <p>
              Create your SkillSphere account and start
              tracking your skills, learning paths and
              goals.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;