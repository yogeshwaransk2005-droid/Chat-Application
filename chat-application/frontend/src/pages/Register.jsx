import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup as signupApi } from "../services/authService";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validateField = (name, value) => {
    switch (name) {
      case "username":
        return value.trim() ? "" : "Username is required.";
      case "email":
        if (!value.trim()) return "Email is required.";
        if (!emailRegex.test(value)) return "Enter a valid email address.";
        return "";
      case "password":
        if (!value.trim()) return "Password is required.";
        if (value.length < 8) return "Password must be 8+ characters.";
        return "";
      case "confirmPassword":
        return value !== formData.password ? "Passwords must match." : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {
      username: validateField("username", formData.username),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      confirmPassword: validateField("confirmPassword", formData.confirmPassword)
    };

    setErrors(nextErrors);
    setServerError("");

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    try {
      await signupApi({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      navigate("/login");
    } catch (error) {
      setServerError(error?.error || error?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-mark">💬</div>
          <div>
            <h1 className="login-title">ChatApp</h1>
            <p className="login-subtitle">Create your account and join the conversation.</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {serverError && <div className="form-alert">{serverError}</div>}

          <label className="input-label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Enter your display name"
            className={errors.username ? "input-field invalid" : "input-field"}
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p className="input-error">{errors.username}</p>}

          <label className="input-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            className={errors.email ? "input-field invalid" : "input-field"}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="input-error">{errors.email}</p>}

          <label className="input-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Create a password"
            className={errors.password ? "input-field invalid" : "input-field"}
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="input-error">{errors.password}</p>}

          <label className="input-label" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Repeat your password"
            className={errors.confirmPassword ? "input-field invalid" : "input-field"}
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <p className="input-error">{errors.confirmPassword}</p>}

          <button type="submit" className="login-button">
            Create account
          </button>
        </form>

        <div className="login-footer">
          <p>
            Already have an account?
            <Link to="/login" className="register-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;