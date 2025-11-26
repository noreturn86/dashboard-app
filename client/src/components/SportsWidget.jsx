export default function SportsWidget({ league, team }) {
    return (
        <div className="border-2">
            <h1 className="text-xl">{league}</h1>
            <h1 className="text-xl">{team}</h1>
        </div>
    );
}