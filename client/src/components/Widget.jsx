export default function Widget({type}) {
    let content;

    switch (type) {
        case "sports":
            content = <div className="relative flex flex-col h-[90%] w-[90%] border items-center justify-evenly">
                <div className="text-2xl text-red-500 absolute right-2 top-2">X</div>
                <h1 className="text-xl">Toronto Maple Leafs</h1>
                <div className="w-[60%] h-[40%] border"></div>
                <h2>23-16-4</h2>
                <h2>Last game: </h2>
                <h2>Next game: </h2>
            </div>;
            break;

        case "news":
            content = <div>

            </div>;
            break;

        case "weather":
            content = <div>

            </div>;
            break;
        default:
            content = <p>Unknown widget type</p>;
    }

    return (
        <div className="border rounded-lg w-1/4 h-1/2 flex items-center justify-center">
            {content}
        </div>
    );
}