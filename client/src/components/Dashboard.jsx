import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewsWidget from './NewsWidget';
import MarketsWidget from './MarketsWidget';
import SportsWidget from './SportsWidget';
import WeatherWidget from './WeatherWidget';
import NewsConfig from './NewsConfig';
import MarketsConfig from './MarketsConfig';
import SportsConfig from './SportsConfig';
import WeatherConfig from './WeatherConfig';
import logoIcon from "../assets/logo2.png";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [showWidgetModal, setShowWidgetModal] = useState(false);
  const [displayedWidgetConfig, setDisplayedWidgetConfig] = useState('');

  const widgetRegistry = {
    news: NewsWidget,
    sports: SportsWidget,
    weather: WeatherWidget,
    markets: MarketsWidget,
  };

  const token = localStorage.getItem('token');

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch user");

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("fetchUser error:", err);
    }
  };

  useEffect(() => {
    if (token) fetchUser();
  }, [token]);


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login'; //force page reload and redirect to login
  };

  const addWidget = (widget) => {

  };

  const removeWidget = (id) => {

  };



  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-green-100 p-6 flex flex-col items-center">
      {/* Header */}
      <header className="mb-6 w-full max-w-8xl flex justify-between items-center">
        <div className='flex item-center gap-2'>
          <img src={logoIcon} alt="Dashboard Icon" className="w-12 h-12 mx-auto rounded-full" />
          <p className="text-5xl font-bold text-blue-700 text-center">
            DashBoard!
          </p>
        </div>
        <p className="text-5xl font-bold text-blue-700 text-center">
          {user ? `${user.first_name} ${user.last_name}` : ''}
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-400 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Logout
        </button>
      </header>

      {/*widget area*/}
      <main className="relative w-full max-w-8xl h-180 bg-blue-50 rounded-xl shadow-md border-2 border-blue-300 flex flex-wrap items-start justify-start">
        {user.widgets.map((widget) => {
          const WidgetComponent = widgetRegistry[widget.type];
          if (!WidgetComponent) return null; //unknown type

          return (
            <div key={widget.id} style={widget.layout}>
              <WidgetComponent {...widget.props} />
            </div>
          );
        })}
        <button
          onClick={() => setShowWidgetModal(true)}
          className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-400 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Add Widget
        </button>
      </main>

      {/*widget type selection modal*/}
      {showWidgetModal && (
        displayedWidgetConfig ? (
          <div>
            {displayedWidgetConfig === "sports" && (
              <SportsConfig
                onSave={async ({ league, team }) => {
                  try {
                    const res = await fetch("http://localhost:3001/api/widgets", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                      body: JSON.stringify({
                        widget_type: "sports",
                        props: { league, team },
                        pos_x: 0,
                        pos_y: 0,
                        width: 4,
                        height: 3,
                      }),
                    });

                    if (!res.ok) throw new Error("Widget save failed");

                    await fetchUser(); //refresh widgets
                    setShowWidgetModal(false);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                onCancel={() => setDisplayedWidgetConfig('')}
              />
            )}

            {displayedWidgetConfig === "weather" && (
              <WeatherConfig
                onSave={async ({ city }) => {
                  try {
                    const res = await fetch("http://localhost:3001/api/widgets", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                      body: JSON.stringify({
                        widget_type: "weather",
                        props: { city },
                        pos_x: 0,
                        pos_y: 0,
                        width: 4,
                        height: 3,
                      }),
                    });

                    if (!res.ok) throw new Error("Widget save failed");

                    await fetchUser(); //refresh widgets
                    setShowWidgetModal(false);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                onCancel={() => setDisplayedWidgetConfig('')}
              />
            )}

            {displayedWidgetConfig === "news" && (
              <NewsConfig
                onSave={async ({ category, region }) => {
                  try {
                    const res = await fetch("http://localhost:3001/api/widgets", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                      body: JSON.stringify({
                        widget_type: "news",
                        props: { category, region },
                        pos_x: 0,
                        pos_y: 0,
                        width: 4,
                        height: 3,
                      }),
                    });

                    if (!res.ok) throw new Error("Widget save failed");

                    await fetchUser(); //refresh widgets
                    setShowWidgetModal(false);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                onCancel={() => setDisplayedWidgetConfig('')}
              />
            )}

            {displayedWidgetConfig === "markets" && (
              <MarketsConfig
                onSave={async ({ market }) => {
                  try {
                    const res = await fetch("http://localhost:3001/api/widgets", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                      body: JSON.stringify({
                        widget_type: "markets",
                        props: { market },
                        pos_x: 0,
                        pos_y: 0,
                        width: 4,
                        height: 3,
                      }),
                    });

                    if (!res.ok) throw new Error("Widget save failed");

                    await fetchUser(); //refresh widgets
                    setShowWidgetModal(false);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                onCancel={() => setDisplayedWidgetConfig('')}
              />
            )}
          </div>
        ) : (
          //config type selection
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg w-96">
              <h2 className="text-2xl font-bold mb-4">Select Widget Type</h2>
              <div className="flex flex-col space-y-2">
                <button
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg"
                  onClick={() => { setDisplayedWidgetConfig('sports') }}
                >
                  Sports
                </button>

                <button
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg"
                  onClick={() => { setDisplayedWidgetConfig('weather') }}
                >
                  Weather
                </button>

                <button
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg"
                  onClick={() => { setDisplayedWidgetConfig('news') }}
                >
                  News
                </button>

                <button
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg"
                  onClick={() => { setDisplayedWidgetConfig('markets') }}
                >
                  Markets
                </button>

                <button
                  onClick={() => setShowWidgetModal(false)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        )
      )}

    </div>
  );
}
