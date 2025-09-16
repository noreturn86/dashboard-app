import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const navigateToRegister = () => {
    navigate('/register');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');

      const res = await axios.post('http://localhost:3001/api/login', form);

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role || 'user');
        navigate('/dashboard');
      } else {
        setError('Login failed: No token received');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <form
        onSubmit={handleSubmit}
        className="bg-blue-500 p-10 rounded-xl shadow-lg max-w-md w-full space-y-6 border-2 border-blue-700"
      >
        <img src={logo} alt="Dashboard Logo" className="w-128 h-64 mx-auto mb-6" />

        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors duration-200"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <hr className="border-gray-300" />

        <button
          type="button"
          onClick={navigateToRegister}
          className="w-full bg-blue-200 hover:bg-blue-100 text-blue-800 font-semibold py-3 rounded-lg transition-colors duration-200"
        >
          Create Account
        </button>

        {error && (
          <p className="mt-4 text-red-600 text-center font-medium">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

export default Login;
