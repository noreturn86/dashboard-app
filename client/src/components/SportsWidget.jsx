import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNhlTeams } from "../features/nhlTeamsSlice";

export default function SportsWidget({ league, team }) { //team is a 3-letter team code passed from a config component
    const dispatch = useDispatch();
    const { nhlTeams, loading, error } = useSelector(state => state.nhlTeams);

    useEffect(() => {
        dispatch(fetchNhlTeams());
    }, [dispatch]);

    if (loading) return <p>Loading…</p>;
    if (error) return <p>Error: {error}</p>;

    const selectedTeam = nhlTeams.find(t => t.abbrevName === team);

    if (!selectedTeam) return <p>Team not found</p>;

    return (
        <div className="flex border p-3 rounded-xl bg-blue-50 w-144 h-80 shadow-md gap-6">
            {/* LEFT PANEL */}
            <div className="flex flex-col items-center justify-between w-1/3 h-full">
                <h2 className="text-xl font-bold">{league}</h2>

                <img
                    src={selectedTeam.logo}
                    className="h-32 w-32 object-contain"
                    alt="Team Logo"
                />

                <div className="text-center space-y-1">
                    <h2 className="text-2xl font-semibold">{selectedTeam.commonName}</h2>

                    <p className="text-lg">
                        {selectedTeam.wins}-{selectedTeam.losses}-{selectedTeam.otLosses}{" "}
                        <strong>{selectedTeam.points} Pts</strong> (
                        {selectedTeam.pointsPercentage.toFixed(2) * 100}%)
                    </p>
                </div>

                <div className="flex gap-6 mt-2">
                    <div className="flex flex-col items-center">
                        <div className="text-sm text-gray-600">Div</div>
                        <div className="text-xl font-semibold">{selectedTeam.divRank}</div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="text-sm text-gray-600">Conf</div>
                        <div className="text-xl font-semibold">{selectedTeam.confRank}</div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="text-sm text-gray-600">League</div>
                        <div className="text-xl font-semibold">{selectedTeam.leagueRank}</div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex flex-col w-2/3 h-full border rounded-xl p-1 shadow-sm bg-white">

                <div className="w-full flex items-center justify-evenly">
                    <div className="w-1/3 text-center py-1 border rounded-t-xl bg-gray-100 font-medium">
                        Forwards
                    </div>
                    <div className="w-1/3 text-center py-1 border rounded-t-xl bg-gray-100 font-medium">
                        Defencemen
                    </div>
                    <div className="w-1/3 text-center py-1 border rounded-t-xl bg-gray-100 font-medium">
                        Goalies
                    </div>
                </div>
            </div>
        </div>

    );
}