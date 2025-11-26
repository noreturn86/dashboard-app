import { useState } from "react";

const CITY_LIST = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
  "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose",
  "Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa",
  "London", "Paris", "Berlin", "Rome", "Madrid",
  "Tokyo", "Osaka", "Seoul", "Beijing", "Shanghai",
  "Sydney", "Melbourne", "Brisbane", "Perth", "Auckland",
  "Mexico City", "Buenos Aires", "Santiago", "Lima", "Bogotá",
  "Rio de Janeiro", "São Paulo", "Johannesburg", "Cairo", "Nairobi",
  "Dubai", "Abu Dhabi", "Doha", "Mumbai", "Delhi",
  "Bangalore", "Chennai", "Karachi", "Istanbul", "Moscow",
  "Warsaw", "Prague", "Vienna", "Budapest", "Copenhagen",
  "Stockholm", "Oslo", "Helsinki", "Reykjavik", "Dublin",
  "Edinburgh", "Glasgow", "Lisbon", "Zurich", "Geneva",
  "Brussels", "Amsterdam", "Rotterdam", "Antwerp", "Luxembourg",
  "Manila", "Jakarta", "Bangkok", "Kuala Lumpur", "Singapore"
].sort();

export default function WeatherConfig({ onSave, onCancel }) {
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCity) return;

    onSave({ city: selectedCity });
  };

  const filteredCities = CITY_LIST.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Weather Widget Settings</h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">

          {/* Search input */}
          <input
            type="text"
            placeholder="Search for a city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border rounded-lg p-2 w-full"
          />

          {/* City dropdown list */}
          <div className="max-h-60 overflow-y-auto border p-2 rounded-lg">
            {filteredCities.map((city) => (
              <button
                type="button"
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`block w-full text-left px-3 py-2 rounded-lg ${
                  selectedCity === city
                    ? "bg-blue-600 text-white"
                    : "bg-blue-300 text-white hover:bg-blue-400"
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Save + Cancel */}
          <div className="flex space-x-2 pt-2">
            <button
              type="submit"
              disabled={!selectedCity}
              className={`flex-1 px-4 py-2 rounded-lg text-white ${
                !selectedCity
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              Save
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
