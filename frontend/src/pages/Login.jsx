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

  // Check for Google auth errors on component mount
  React.useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'google_auth_failed') {
      toast.error('Google authentication failed. Please try again or use email/password.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const { data } = await API.post(
        endpoint,
        {
          email: formData.email,
          password: formData.password,
          ...(isLogin ? {} : { name: formData.name }),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );


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
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Left Side - Visual */}
        <motion.div
          className="auth-visual"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="visual-content">
            <h1>Welcome to <br /><span>Bastard</span></h1>
            <p>Discover the latest trends and exclusive collections.</p>
            <div className="visual-decoration"></div>
          </div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          className="auth-form-container"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="form-content">
            <h2 className="title">{isLogin ? "Welcome Back!" : "Create Account"}</h2>
            <p className="subtitle">
              {isLogin ? "Please login to your account" : "Get started with your free account"}
            </p>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <AnimatedInputWithCheck
                  label="Full Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  placeholder="John Doe"
                  showCheck={showNameCheck}
                />
              )}

              <AnimatedInputWithCheck
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                showCheck={false}
              />

              <AnimatedInputWithCheck
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
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
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.02 }}
              >
                {isLogin ? "Sign In" : "Sign Up"}
              </motion.button>
            </form>

            <div className="divider">
              <span>OR CONTINUE WITH</span>
            </div>

            <motion.button
              className="google-btn"
              onClick={handleGoogle}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
              Google
            </motion.button>

            <p className="bottom-text">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
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

            {/* <Link to="/admin/login" className="admin-link">
              Admin Access
            </Link> */}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;