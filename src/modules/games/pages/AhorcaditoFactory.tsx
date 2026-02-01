
function AhorcaditoFactory() {
    return (
        <>
            <div className="flex flex-col  bg-indigo-50 p-7 h-full ">
                <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
                    Elegí la dificultad 🎯
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 h-screen place-items-center">
                    {[
                        { nivel: "Fácil", palabras: "1 palabra", color: "green", id: "facil" },
                        { nivel: "Medio", palabras: "2 palabras", color: "yellow", id: "medio" },
                        { nivel: "Difícil", palabras: "4 palabras", color: "red", id: "dificil" },
                    ].map(({ nivel, palabras, color, id }) => (
                        <div
                            key={id}
                            className={`bg-white rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer border-5 border-transparent hover:border-${color}-300 w-80 h-48 flex flex-col justify-center`}
                        >
                            <div className="p-6 text-center">
                                <h2 className="text-3xl font-bold text-gray-800">{nivel}</h2>
                                <p className="text-gray-500 text-xl">{palabras}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto text-center pt-10">
                    <button
                        // onClick={() => navigate("/")}
                        className="text-blue-600 hover:text-blue-800 text-lg flex items-center justify-center gap-2"
                    >
                        <span className="text-2xl">←</span> Volver
                    </button>
                </div>
            </div>
        </>
    );

}
export default AhorcaditoFactory;