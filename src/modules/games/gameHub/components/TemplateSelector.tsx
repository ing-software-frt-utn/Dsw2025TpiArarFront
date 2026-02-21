import { FaTimes } from "react-icons/fa";

interface Props {
    onClose: () => void;
    onSelect: (templateType: string) => void;
}

export default function TemplateSelectorModal({ onClose, onSelect }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in duration-200">
                
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800">Elige una plantilla</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-gray-50">
                    
                    <div 
                        onClick={() => onSelect('Ahorcadito')}
                        className="bg-white p-6 rounded-xl border-2 border-transparent hover:border-green-500 hover:shadow-lg cursor-pointer transition-all group flex flex-col items-center text-center"
                    >
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform p-3">
                            <img 
                                src="/ahorcadito.png" 
                                alt="Icono Ahorcadito" 
                                className="w-full h-full object-contain drop-shadow-sm" 
                            />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Ahorcadito</h3>
                        <p className="text-gray-500 text-sm">Crea una lista de palabras con pistas para que tus alumnos adivinen.</p>
                    </div>

                    <div 
                        onClick={() => onSelect('Memotest')}
                        className="bg-white p-6 rounded-xl border-2 border-transparent hover:border-blue-500 hover:shadow-lg cursor-pointer transition-all group flex flex-col items-center text-center"
                    >
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform p-3">
                            <img 
                                src="https://cdn-icons-png.flaticon.com/512/3965/3965108.png" 
                                alt="Icono Memotest" 
                                className="w-full h-full object-contain drop-shadow-sm" 
                            />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Memotest</h3>
                        <p className="text-gray-500 text-sm">Carga pares de cartas (texto o imágenes) para entrenar la memoria.</p>
                    </div>

                    <div 
                        onClick={() => onSelect('Trivia')}
                        className="bg-white p-6 rounded-xl border-2 border-transparent hover:border-violet-500 hover:shadow-lg cursor-pointer transition-all group flex flex-col items-center text-center"
                    >
                        <div className="w-20 h-20 bg-violet-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform p-3">
                            <img 
                                src="/trivia.webp" 
                                alt="Icono Trivia" 
                                className="w-full h-full object-contain drop-shadow-sm" 
                            />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Trivia</h3>
                        <p className="text-gray-500 text-sm">Crea cuestionarios de preguntas y respuestas con múltiples opciones.</p>
                    </div>

                </div>
            </div>
        </div>
    );
}