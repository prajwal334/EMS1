import React, { useState } from "react";
import axios from "axios";
import Logo from "../assets/HRLOGO.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        const user = response.data.user;
        const token = response.data.token;

        // Store token and user globally
        localStorage.setItem("token", token);
        login(user);

        // Role-based redirection
        if (user.role === "admin") {
          navigate("/admin-dashboard");
        } else if (user.role === "hr") {
          navigate("/hr-dashboard");
        } else if (user.role === "employee") {
          // ✅ Check if employee is logging in for the first time
          if (user.firstLogin) {
            navigate("/set-new-password"); // redirect to reset password screen
          } else {
            navigate("/employee-dashboard");
          }
        } else {
          setError("Unauthorized role. Please contact support.");
        }
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        setError(error.response.data.error);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-blue-500 from-50% to-blue-100 to-50% text-white space-y-4">
      <img src={Logo} alt="Logo" className="w-52 h-52" />
      <div className="border shadow p-6 w-80 bg-white text-black rounded-lg">
        <h2 className="text-center text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <p className="text-center text-sm">Please enter your credentials</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border"
              placeholder="***********"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <label className="inline-flex items-center">
              <input type="checkbox" id="remember" className="mr-2 form-checkbox" />
              <span className="text-sm">Remember me</span>
            </label>
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="mt-4">
            <button type="submit" className="w-full bg-blue-600 text-white py-2">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
