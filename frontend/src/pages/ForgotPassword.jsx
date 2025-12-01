import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { IoMdCheckmark } from 'react-icons/io';
import API from '../api/client';
import './ForgotPassword.scss';

const AnimatedInputWithCheck = ({
  label,
  value,
  name,
  type = "text",
  onChange,
  required,
  placeholder,
  showCheck = false,
}) => {
  const circleLength = 2 * Math.PI * 30;

  return (
    <motion.div className="animated-input-box">
      <label>{label}</label>
      <div className="input-with-check">
        <motion.input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="animated-input"
          whileFocus={{ scale: 1.02 }}
        />

        {showCheck && (
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

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (e.target.value.includes('@') && e.target.value.includes('.')) {
      setShowCheck(true);
    } else {
      setShowCheck(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post('/auth/forgot-password', { email });
      setEmailSent(true);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
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
            <h1>Forgot <br /><span>Password?</span></h1>
            <p>Don't worry, we'll help you get back in.</p>
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
            {!emailSent ? (
              <>
                <h2 className="title">Reset Password</h2>
                <p className="subtitle">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit}>
                  <AnimatedInputWithCheck
                    label="Email Address"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    showCheck={showCheck}
                  />

                  <motion.button
                    className="primary-btn"
                    type="submit"
                    disabled={loading}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </motion.button>
                </form>

                <div className="bottom-text">
                  <Link to="/login" className="toggle-btn" style={{ marginLeft: 0 }}>
                    Back to Login
                  </Link>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  style={{
                    width: '80px',
                    height: '80px',
                    background: '#22c55e',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 2rem'
                  }}
                >
                  <IoMdCheckmark size={40} color="#fff" />
                </motion.div>
                <h2 className="title">Check Your Email</h2>
                <p className="subtitle">
                  We've sent a password reset link to <br /><strong>{email}</strong>
                </p>
                <p className="info-text" style={{ color: '#666', marginBottom: '2rem', lineHeight: '1.6' }}>
                  Please check your inbox and click the link to reset your password.
                  The link will expire in 1 hour.
                </p>
                <Link to="/login">
                  <motion.button
                    className="primary-btn"
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    Back to Login
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;