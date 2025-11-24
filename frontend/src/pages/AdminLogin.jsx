import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IoMdCheckmark } from "react-icons/io";
import { toast } from "react-toastify";
import API from "../api/client";
import { AuthContext } from "../context/AuthContext";
import "./Login.scss";

const AnimatedInputWithProgress = ({
  label,
  value,
  name,
  type,
  onChange,
  placeholder,
  required,
  minLength = 3,
}) => {
  const radius = 10;
  const circumference = 2 * Math.PI * radius;

  const progress = Math.min(value.length / minLength, 1);
  const strokeOffset = circumference * (1 - progress);

  const isComplete = progress === 1;

  return (
    <motion.div className="animated-input-box">
      <label>{label}</label>

      <div className="input-with-check">
        <motion.input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="animated-input"
          whileFocus={{ scale: 1.02 }}
        />

        
      </div>
    </motion.div>
  );
};

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/auth/admin/login", formData);
      login(data.token, data.user);
      toast.success("Admin login successful!");
      navigate("/admin");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid admin credentials"
      );
    }
  };

  return (
    <div className="animated-login-page">
      <motion.div
        className="animated-card"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
      >
        <h2 className="title">Admin Login</h2>
        <p className="subtitle">Access the admin dashboard</p>

        <form onSubmit={handleSubmit}>
          <AnimatedInputWithProgress
            label="Admin Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter admin email"
            minLength={5}
            required
          />

          <AnimatedInputWithProgress
            label="Admin Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter admin password"
            minLength={6}
            required
          />

          <motion.button
            className="primary-btn"
            whileTap={{ scale: 0.97 }}
            type="submit"
          >
            Login as Admin
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
