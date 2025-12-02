import { useState } from 'react';

export default function MarketsConfig({ onSave, onCancel }) {
    const [market, setMarket] = useState(null);
    const [loading, setLoading] = useState(false);

    const popularStocks = [
        { name: "Apple", symbol: "AAPL" },
        { name: "Microsoft", symbol: "MSFT" },
        { name: "Amazon", symbol: "AMZN" },
        { name: "Alphabet (Google)", symbol: "GOOGL" },
        { name: "Meta Platforms (Facebook)", symbol: "META" },
        { name: "Tesla", symbol: "TSLA" },
        { name: "NVIDIA", symbol: "NVDA" },
        { name: "Berkshire Hathaway", symbol: "BRK.B" },
        { name: "JPMorgan Chase", symbol: "JPM" },
        { name: "Visa", symbol: "V" },
        { name: "Johnson & Johnson", symbol: "JNJ" },
        { name: "Walmart", symbol: "WMT" },
        { name: "Procter & Gamble", symbol: "PG" },
        { name: "Mastercard", symbol: "MA" },
        { name: "Home Depot", symbol: "HD" },
        { name: "Disney", symbol: "DIS" },
        { name: "PayPal", symbol: "PYPL" },
        { name: "Netflix", symbol: "NFLX" },
        { name: "Coca-Cola", symbol: "KO" },
        { name: "Intel", symbol: "INTC" },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ market });
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg w-2/3">
                <h2 className="text-2xl font-bold mb-4 text-center">Sports Widget Settings</h2>

                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">

                    {/* Stock Selection */}
                    <div className="max-h-100 overflow-y-auto border p-2 rounded-lg">
                        <div className="grid grid-cols-4 gap-2">
                            {popularStocks.map((stock, index) => (
                                <div
                                    type="button"
                                    key={index}
                                    onClick={() => setMarket(stock)}
                                    className={`flex items-center justify-between h-30 px-3 py-2 rounded-lg text-white ${stock.name === market?.name
                                        ? "bg-blue-600"
                                        : "bg-blue-300 hover:bg-blue-400"
                                        }`}
                                >
                                    <h2 className="text-4xl">{stock.name}</h2>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Save + Cancel */}
                    <div className="flex space-x-2 pt-2">
                        <button
                            type="submit"
                            disabled={!market || loading}
                            className={`flex-1 px-4 py-2 rounded-lg text-white ${!market
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