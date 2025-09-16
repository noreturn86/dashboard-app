import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '' });
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUsername('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3001/api/register', form);
      setUsername(res.data.username);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
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
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-6">Register</h2>

        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          name="first_name"
          placeholder="First name"
          value={form.first_name}
          onChange={handleChange}
          required
        />
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          name="last_name"
          placeholder="Last name"
          value={form.last_name}
          onChange={handleChange}
          required
        />
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
          {loading ? 'Registering...' : 'Register'}
        </button>

        <hr className="border-gray-300" />

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="w-full bg-blue-200 hover:bg-blue-100 text-blue-800 font-semibold py-3 rounded-lg transition-colors duration-200"
        >
          Already have an account? Login
        </button>

        {username && (
          <p className="mt-4 text-green-600 text-center font-medium">
            Your username: <strong>{username}</strong> (redirecting to login…)
          </p>
        )}

        {error && (
          <p className="mt-4 text-red-600 text-center font-medium">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
