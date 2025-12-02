import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNhlTeams, fetchNhlRoster } from "../features/nhlTeamsSlice";

export default function SportsWidget({ league, team }) { //team is a 3-letter team code passed from a config component
    const dispatch = useDispatch();
    const { nhlTeams, rosters, loading, error, rosterLoading, rosterError } = useSelector(state => state.nhlTeams);

    //get teams from redux store
    useEffect(() => {
        dispatch(fetchNhlTeams());
    }, [dispatch]);


    //get roster/player stats
    useEffect(() => {
        if (!team) return;

        if (!rosters[team]) {
            dispatch(fetchNhlRoster(team));
        }
    }, [dispatch, team, rosters]);


    if (loading) return <p>Loading…</p>;
    if (error) return <p>Error: {error}</p>;

    if (rosterLoading) return <p>Loading…</p>;
    if (rosterError) return <p>Error: {error}</p>;


    const selectedTeam = nhlTeams.find(t => t.abbrevName === team);

    if (!selectedTeam) return <p>Team not found</p>;


    const teamRoster = rosters[team] || { forwards: [], defencemen: [], goalies: [] };
    const { forwards, defencemen, goalies } = teamRoster;

    const topPointsForwards = [...forwards].sort((a, b) => b.points - a.points);
    const topPointsDefencemen = [...defencemen].sort((a, b) => b.points - a.points);



    return (
        <div className="flex border p-3 rounded-xl bg-blue-50 w-180 h-105 shadow-md gap-6">
            {/* LEFT PANEL */}
            <div className="flex flex-col items-center justify-between w-1/3 h-full">
                <h2 className="text-xl font-bold">{league}</h2>

                <img
                    src={selectedTeam.logo}
                    className="h-50 w-50 object-contain"
                    alt="Team Logo"
                />

                <div className="text-center space-y-1">
                    <h2 className="text-2xl font-semibold">{selectedTeam.commonName}</h2>

                    <p className="text-lg">
                        {selectedTeam.wins} - {selectedTeam.losses} - {selectedTeam.otLosses}{" "}
                        <strong>{selectedTeam.points} Pts</strong> (
                        {(selectedTeam.pointsPercentage * 100).toFixed(1)}%)
                    </p>
                </div>

                <p className="text-lg">Last 10 games: {selectedTeam.last10Wins} - {selectedTeam.last10Losses} - {selectedTeam.last10OtLosses}</p>

                <div className="flex gap-6 mt-2">
                    <div className="flex flex-col items-center">
                        <div className="text-lg text-gray-600 border-b-2">Div</div>
                        <div className="text-xl font-semibold">{selectedTeam.divRank}</div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="text-lg text-gray-600 border-b-2">Conf</div>
                        <div className="text-xl font-semibold">{selectedTeam.confRank}</div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="text-lg text-gray-600 border-b-2">League</div>
                        <div className="text-xl font-semibold">{selectedTeam.leagueRank}</div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex flex-col w-2/3 h-full border rounded-xl p-1 shadow-sm bg-white">
                {/* Headers */}
                <div className="w-full flex items-center justify-evenly flex-none">
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

                <div className="flex items-center justify-end border w-full flex-none">
                    <p className="mx-4 font-semibold">G</p>
                    <p className="mx-4 font-semibold">A</p>
                    <p className="mx-4 font-semibold">P</p>
                </div>

                {/* Scrollable player list */}
                <div className="flex flex-col flex-1 overflow-y-auto">
                    {topPointsForwards.map((forward, index) => (
                        <div key={index} className="flex items-center gap-1 h-20 border p-1 flex-none overflow-hidden">
                            <div className="h-full border-2 rounded-full overflow-hidden scale-132 mr-4">
                                <img
                                    src={forward.headshot}
                                    className="w-full h-full object-cover scale-120"
                                    alt={`${forward.firstName} ${forward.lastName}`}
                                />
                            </div>
                            <p className="font-bold text-2xl">#{forward.number}</p>
                            <p className="font-semibold text-2xl pl-2">
                                {forward.firstName[0]}. {forward.lastName}
                            </p>
                            <div className="flex flex-1 items-center justify-end w-full">
                                <p className="mx-4 font-semibold text-2xl">{forward.goals}</p>
                                <p className="mx-4 font-semibold text-2xl">{forward.assists}</p>
                                <p className="mx-4 font-semibold text-2xl">{forward.points}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


        </div>

    );
}