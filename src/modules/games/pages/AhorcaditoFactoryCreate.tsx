function AhorcaditoFactoryCreate() {
    return (<>
        <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50 p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">Ahorcadito</h1>
            <h2 className="text-2xl font-semibold text-gray-600 mb-8 text-center">Nivel Difícil</h2>

            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl">
                <label className="block text-lg font-medium text-gray-700 mb-2">Título:</label>
                <input
                    type="text"
                    placeholder="Nombre del juego"
                    className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />

                {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                        <input
                            type="text"
                            placeholder={`Palabra ${num}`}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                        <input
                            type="text"
                            placeholder={`Pista ${num}`}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                    </div>
                ))}

                <div className="flex justify-end mt-6">
                    <button className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition">
                        Crear juego
                    </button>
                </div>
            </div>

            <div className="mt-auto pt-10">
                <button
                    // onClick={() => navigate("/")}
                    className="text-blue-600 hover:text-blue-800 text-lg flex items-center justify-center gap-2"
                >
                    <span className="text-2xl">←</span> Volver
                </button>
            </div>
        </div></>)
}
export default AhorcaditoFactoryCreate;