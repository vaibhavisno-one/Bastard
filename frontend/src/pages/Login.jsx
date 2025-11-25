import React, { useState, useContext } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { IoMdCheckmark } from "react-icons/io";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import API from "../api/client";
import { AuthContext } from "../context/AuthContext";
import "./Login.scss";

const AnimatedInputWithCheck = ({
  label,
  value,
  name,
  type = "text",
  onChange,
  required,
  placeholder,
  showCheck = false,
  isPassword = false,
  showPassword,
  togglePassword,
}) => {
  const circleLength = 2 * Math.PI * 30;
  
  return (
    <motion.div className="animated-input-box">
      <label>{label}</label>
      <div className="input-with-check">
        <motion.input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="animated-input"
          style={{ paddingRight: isPassword ? '45px' : '12px' }}
          whileFocus={{ scale: 1.02 }}
        />
        
        {isPassword && (
          <button
            type="button"
            className="password-toggle"
            onClick={togglePassword}
            tabIndex="-1"
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        )}
        
        {showCheck && !isPassword && (
          <motion.svg width="24" height="24" className="check-svg">
            <motion.circle
              cx="12"
              cy="12"
              r="10"
              stroke="#22c55e"
              strokeWidth="2"
              fill="transparent"
              strokeDasharray={circleLength}
              strokeDashoffset={circleLength}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            <motion.circle
              cx="12"
              cy="12"
              r="10"
              fill="#22c55e"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.2 }}
            />
            <motion.div
              className="check-icon"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.2 }}
            >
              <IoMdCheckmark size={14} color="#fff" />
            </motion.div>
          </motion.svg>
        )}
      </div>
    </motion.div>
  );
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showNameCheck, setShowNameCheck] = useState(false);
  const [showPassCheck, setShowPassCheck] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (!isLogin && e.target.name === "name" && e.target.value.length > 2) {
      setShowNameCheck(true);
    }
    if (e.target.name === "password" && e.target.value.length >= 6) {
      setShowPassCheck(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const { data } = await API.post(endpoint, formData);

      login(data.token, data.user);
      toast.success(isLogin ? "Logged in!" : "Account created!");
      navigate(redirect);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  const handleGoogle = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="animated-login-page">
      <motion.div
        className="animated-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="title">{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <p className="subtitle">
          {isLogin ? "Login to continue" : "Sign up to begin"}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <AnimatedInputWithCheck
              label="Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required={!isLogin}
              placeholder="Your full name"
              showCheck={showNameCheck}
            />
          )}

          <AnimatedInputWithCheck
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email address"
            showCheck={false}
          />

          <AnimatedInputWithCheck
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Password (min 6 characters)"
            showCheck={showPassCheck}
            isPassword={true}
            showPassword={showPassword}
            togglePassword={togglePasswordVisibility}
          />

          {isLogin && (
            <div className="forgot-password-link">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          )}

          <motion.button
            className="primary-btn"
            type="submit"
            whileTap={{ scale: 0.97 }}
          >
            {isLogin ? "Login" : "Sign Up"}
          </motion.button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <motion.button
          className="google-btn"
          onClick={handleGoogle}
          whileTap={{ scale: 0.97 }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          Continue with Google
        </motion.button>

        <p className="bottom-text">
          {isLogin ? "No account? " : "Have an account? "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setShowNameCheck(false);
              setShowPassCheck(false);
              setShowPassword(false);
              setFormData({ name: "", email: "", password: "" });
            }}
            className="toggle-btn"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>

        <Link to="/admin/login" className="admin-link">
          Admin Login
        </Link>
      </motion.div>
    </div>
  );
};

export default Login;