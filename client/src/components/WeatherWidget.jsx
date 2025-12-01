import { useEffect, useState } from "react";

export default function WeatherWidget({ city }) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadWeather() {
            try {
                setLoading(true);
                setError(null);

                const token = localStorage.getItem("token");

                const res = await fetch(`http://localhost:3001/api/weather?city=${city}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!res.ok) throw new Error("Weather fetch failed");

                const data = await res.json();
                setWeather(data);
            } catch (err) {
                console.error(err);
                setError("Could not load weather");
            } finally {
                setLoading(false);  // ← ensures loading ends
            }
        }
        console.log("WeatherWidget city:", city);
        loadWeather();
    }, [city]);

    if (loading) return <div className="border-2 p-4">Loading weather...</div>;

    if (error) return <div className="border-2 p-4 text-red-600">{error}</div>;

    return (
        <div className="flex flex-col items-center border-2 p-4 rounded-lg bg-blue-100 w-72">
            <h2 className="text-xl font-bold">{weather.name}</h2>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
            <p className="text-lg">{weather.weather[0].description}</p>
            <p className="text-2xl font-bold">{Math.round(weather.main.temp)}°C</p>
        </div>
    );
}
