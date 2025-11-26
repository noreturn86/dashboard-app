import { useState } from "react";

export default function SportsConfig({ onSave, onCancel }) {
    const [league, setLeague] = useState("NHL");
    const [team, setTeam] = useState("");
    const [loading, setLoading] = useState(false);

    const NHL_TEAMS = [
        "Avalanche", "Blackhawks", "Blue Jackets", "Blues", "Bruins", "Canadiens",
        "Canucks", "Capitals", "Devils", "Ducks", "Flames", "Flyers", "Golden Knights",
        "Hurricanes", "Islanders", "Jets", "Kings", "Kraken", "Lightning", "Mammoth",
        "Maple Leafs", "Oilers", "Panthers", "Penguins", "Predators", "Rangers",
        "Red Wings", "Sabres", "Senators", "Sharks", "Stars", "Wild"
    ].sort();

    const NBA_TEAMS = [
        "76ers", "Bucks", "Bulls", "Cavaliers", "Celtics", "Clippers", "Grizzlies",
        "Hawks", "Heat", "Hornets", "Jazz", "Kings", "Knicks", "Lakers", "Magic",
        "Mavericks", "Nets", "Nuggets", "Pacers", "Pelicans", "Pistons", "Raptors",
        "Rockets", "Spurs", "Suns", "Thunder", "Timberwolves", "Trail Blazers",
        "Warriors", "Wizards"
    ].sort();

    const teams = league === "NHL" ? NHL_TEAMS : NBA_TEAMS;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!team) return;

        onSave({ league, team });
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Sports Widget Settings</h2>

                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">

                    {/* League Buttons */}
                    <div className="flex justify-center space-x-2">
                        <button
                            type="button"
                            onClick={() => setLeague("NHL")}
                            className={`px-4 py-2 rounded-lg text-white ${league === "NHL"
                                ? "bg-blue-600"
                                : "bg-blue-300 hover:bg-blue-400"
                                }`}
                        >
                            NHL
                        </button>

                        <button
                            type="button"
                            onClick={() => setLeague("NBA")}
                            className={`px-4 py-2 rounded-lg text-white ${league === "NBA"
                                ? "bg-blue-600"
                                : "bg-blue-300 hover:bg-blue-400"
                                }`}
                        >
                            NBA
                        </button>
                    </div>

                    {/* Team selection */}
                    <div className="max-h-60 overflow-y-auto border p-2 rounded-lg">
                        <div className="grid grid-cols-2 gap-2">
                            {teams.map((t) => (
                                <button
                                    type="button"
                                    key={t}
                                    onClick={() => setTeam(t)}
                                    className={`px-3 py-2 rounded-lg text-white ${team === t
                                        ? "bg-blue-600"
                                        : "bg-blue-300 hover:bg-blue-400"
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Save + Cancel */}
                    <div className="flex space-x-2 pt-2">
                        <button
                            type="submit"
                            disabled={!team || loading}
                            className={`flex-1 px-4 py-2 rounded-lg text-white ${!team
                                ? "bg-blue-300 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-500"
                                }`}
                        >
                            {loading ? "Saving..." : "Save"}
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
