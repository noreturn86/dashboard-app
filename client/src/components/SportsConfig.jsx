import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNhlTeams } from "../features/nhlTeamsSlice";

export default function SportsConfig({ onSave, onCancel }) {
    const [league, setLeague] = useState("NHL");
    const [team, setTeam] = useState("");
    const { nhlTeams, loading, error } = useSelector(state => state.nhlTeams);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchNhlTeams());
    }, [dispatch]);


    if (loading) return <p>Loading…</p>;
    if (error) return <p>Error: {error}</p>;


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!team) return;
        onSave({ league, team });
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg w-2/3">
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


                    </div>

                    {/* Team selection */}
                    <div className="max-h-100 overflow-y-auto border p-2 rounded-lg">
                        <div className="grid grid-cols-4 gap-2">
                            {nhlTeams.map((t) => (
                                <div
                                    type="button"
                                    key={t.abbrevName} // <-- unique key
                                    onClick={() => setTeam(t.abbrevName)}
                                    className={`flex items-center justify-between h-30 px-3 py-2 rounded-lg text-white ${team === t.abbrevName
                                        ? "bg-blue-600"
                                        : "bg-blue-300 hover:bg-blue-400"
                                        }`}
                                >
                                    <h2 className="text-4xl">{t.commonName}</h2>
                                    <div className="w-28 h-28">
                                        <img className="w-full h-full" src={t.logo}></img>
                                    </div>
                                </div>
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
