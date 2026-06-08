import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginApi } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validateField = (name, value) => {
    if (name === "email") {
      if (!value.trim()) return "Email is required.";
      if (!emailRegex.test(value)) return "Enter a valid email.";
      return "";
    }
    if (name === "password") {
      if (!value.trim()) return "Password is required.";
      if (value.length < 8) return "Password must be at least 8 characters.";
      return "";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: fieldValue }));
    if (name !== "remember") {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, fieldValue) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailError = validateField("email", formData.email);
    const passwordError = validateField("password", formData.password);
    setErrors({ email: emailError, password: passwordError });
    setServerError("");

    if (emailError || passwordError) return;

    try {
      const data = await loginApi({ email: formData.email, password: formData.password });
      login(data);
      navigate("/");
    } catch (error) {
      setServerError(error?.error || error?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-mark">💬</div>
          <div>
            <h1 className="login-title">ChatApp</h1>
            <p className="login-subtitle">Secure login for your realtime conversations.</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {serverError && <div className="form-alert">{serverError}</div>}
          <label className="input-label" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            className={errors.email ? "input-field invalid" : "input-field"}
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
          {errors.email && <p className="input-error">{errors.email}</p>}

          <label className="input-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            className={errors.password ? "input-field invalid" : "input-field"}
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
          {errors.password && <p className="input-error">{errors.password}</p>}

          <div className="form-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              Remember me
            </label>
            <Link className="link-button" to="/register">
              Create account
            </Link>
          </div>

          <button type="submit" className="login-button">
            Sign in
          </button>
        </form>

        <div className="login-footer">
          <p>
            New to ChatApp?
            <Link to="/register" className="register-link">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;