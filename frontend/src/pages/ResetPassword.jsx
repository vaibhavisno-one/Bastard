import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { IoMdCheckmark } from 'react-icons/io';
import API from '../api/client';
import { AuthContext } from '../context/AuthContext';
import './ResetPassword.scss';

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

const ResetPassword = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { data } = await API.put(`/auth/reset-password/${resetToken}`, {
        password: formData.password,
      });

      login(data.token, data.user);
      toast.success('Password reset successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
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
            <h1>New <br /><span>Password</span></h1>
            <p>Create a strong password to secure your account.</p>
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
            <h2 className="title">Reset Password</h2>
            <p className="subtitle">Enter your new password below</p>

            <form onSubmit={handleSubmit}>
              <AnimatedInputWithCheck
                label="New Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter new password"
                isPassword={true}
                showPassword={showPassword}
                togglePassword={() => setShowPassword(!showPassword)}
              />

              <AnimatedInputWithCheck
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm new password"
                isPassword={true}
                showPassword={showConfirmPassword}
                togglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              />

              <motion.button
                className="primary-btn"
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.02 }}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;