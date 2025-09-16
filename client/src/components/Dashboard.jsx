import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [showWidgetModal, setShowWidgetModal] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:3001/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login'; //force page reload and redirect to login
  };

  return (
    <div className="min-h-screen bg-green-100 p-6 flex flex-col items-center">
      {/* Header */}
      <header className="mb-6 w-full max-w-4xl flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-700 text-center">
          Dashboard {user ? `- ${user.first_name} ${user.last_name} ${user.email}` : ''}
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-400 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Logout
        </button>
      </header>

      {/* Widget area */}
        <main className="relative w-full max-w-6xl h-156 bg-blue-50 rounded-xl shadow-md border-2 border-blue-300 flex items-center justify-center">
            <button
                onClick={() => setShowWidgetModal(true)}
                className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-400 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
            >
                Add Widget
            </button>
        </main>


      {/* Widget selection modal */}
      {showWidgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Select Widget Type</h2>
            <div className="flex flex-col space-y-2">
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg">Sports</button>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg">Weather</button>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg">News</button>
              <button
                onClick={() => setShowWidgetModal(false)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg">Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
