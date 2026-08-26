import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-brand">
          <div className="brand-icon">
            <Sparkles size={24} />
          </div>

          <div>
            <h1>SkillSphere</h1>
            <p>Learn. Grow. Achieve.</p>
          </div>
        </div>

        <div className="auth-header">
          <h2>Create your account</h2>
          <p>Start building your skills and tracking your progress.</p>
        </div>

        <form className="auth-form">

          <div className="form-group">
            <label htmlFor="name">Full Name</label>

            <div className="input-wrapper">
              <User size={19} />

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email Address</label>

            <div className="input-wrapper">
              <Mail size={19} />

              <input
                id="register-email"
                type="email"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="register-password">Password</label>

            <div className="input-wrapper">
              <Lock size={19} />

              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>

            <div className="input-wrapper">
              <Lock size={19} />

              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button">
            Create Account
          </button>

        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;