import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaArrowLeft, FaCheckCircle, FaRegCircle, FaSearch, FaSpinner } from "react-icons/fa";
import { instance } from "../../../../shared/api/axiosInstance";
import { mockClasses } from "../../../../mockData";

interface Topic {
  id: number;
  name: string;
}

interface Word {
  id: number;
  text: string;
  hint: string;
  difficulty: string;
}

export default function AhorcaditoCreator() {
  const navigate = useNavigate();
  
  const [loadingWords, setLoadingWords] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [availableWords, setAvailableWords] = useState<Word[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState<number | "">("");
  const [selectedClassId, setSelectedClassId] = useState<number | "">("");
  const [difficulty, setDifficulty] = useState<string>("MEDIUM");
  const [selectedWordIds, setSelectedWordIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await instance.get("/api/topics");
        setTopics(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTopics();
  }, []);

  useEffect(() => {
    if (selectedTopicId !== "") {
      const fetchWords = async () => {
        setLoadingWords(true);
        try {
          const res = await instance.get(`/api/words`, {
            params: { topicId: selectedTopicId, difficulty: difficulty }
          });
          setAvailableWords(res.data);
          setSelectedWordIds([]); 
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingWords(false);
        }
      };
      fetchWords();
    } else {
      setAvailableWords([]);
    }
  }, [selectedTopicId, difficulty]);

  const toggleWordSelection = (id: number) => {
    setSelectedWordIds(prev => 
      prev.includes(id) ? prev.filter(wordId => wordId !== id) : [...prev, id]
    );
  };

  const filteredWords = availableWords.filter(w => 
    w.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async () => {
    if (!title || !selectedTopicId || selectedWordIds.length === 0) {
      alert("Faltan datos obligatorios");
      return;
    }

    const payload = {
      title,
      description,
      templateId: 2,
      topicId: selectedTopicId,
      classId: selectedClassId !== "" ? selectedClassId : null,
      difficulty,
      wordIds: selectedWordIds
    };

    try {
      await instance.post("/api/games/ahorcadito", payload);
      navigate("/profesor/juegos");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:px-5 md:py-4 bg-white rounded-[2rem] shadow-2xl border border-gray-100 font-sans transition-all">
      
      {/* Header compactado */}
      <div className="flex items-center gap-3 mb-3 border-b border-gray-50 pb-2">
        <button onClick={() => navigate(-1)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 transition-all active:scale-90">
          <FaArrowLeft size={12} />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">Configurar Ahorcadito</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Editor de juego</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        
        {/* Panel Izquierdo: Configuración */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="flex flex-col gap-0.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-slate-50 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 text-sm"
              placeholder="Ej: Repaso de Geometría"
            />
          </div>

          <div className="flex flex-col gap-0.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Asociar a Clase</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(Number(e.target.value))}
              className="w-full px-4 py-2.5 border-2 border-slate-50 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 cursor-pointer text-sm"
            >
              <option value="">Ninguna clase</option>
              {mockClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-0.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Tópico</label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(Number(e.target.value))}
              className="w-full px-4 py-2.5 border-2 border-slate-50 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 cursor-pointer text-sm"
            >
              <option value="">Seleccionar...</option>
              {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Dificultad</label>
            <div className="flex gap-2">
              {["EASY", "MEDIUM", "HARD"].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`flex-1 py-2 rounded-xl font-black text-[9px] uppercase border-2 transition-all active:scale-95 ${
                    difficulty === level ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white border-slate-50 text-slate-300 hover:border-slate-100"
                  }`}
                >
                  {level === "EASY" ? "Fácil" : level === "MEDIUM" ? "Medio" : "Difícil"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel Derecho: Selección de Palabras */}
        <div className="lg:col-span-6 bg-slate-50/50 rounded-3xl p-4 border-2 border-slate-50 flex flex-col h-[350px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
            <h2 className="text-sm font-black text-slate-800 tracking-tight uppercase">Seleccionadas: {selectedWordIds.length}</h2>
            <div className="relative w-full sm:w-auto">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-sm" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar..."
                className="w-full sm:w-48 pl-10 pr-4 py-2 rounded-xl border-none shadow-sm outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-600 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
            {loadingWords ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300">
                <FaSpinner className="animate-spin text-xl mb-1" />
                <span className="font-black text-[8px] uppercase tracking-widest">Cargando...</span>
              </div>
            ) : filteredWords.length > 0 ? (
              filteredWords.map(word => (
                <div 
                  key={word.id}
                  onClick={() => toggleWordSelection(word.id)}
                  className={`group p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    selectedWordIds.includes(word.id) ? "bg-white border-blue-500 shadow-md" : "bg-white border-transparent hover:border-slate-200"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-700 tracking-tight leading-tight">{word.text}</span>
                    <span className="text-[9px] font-bold text-slate-400 italic">Pista: {word.hint}</span>
                  </div>
                  <div className="text-base transition-transform group-active:scale-90">
                    {selectedWordIds.includes(word.id) ? <FaCheckCircle className="text-blue-500" /> : <FaRegCircle className="text-slate-100" />}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-200">
                <span className="font-black text-[8px] uppercase tracking-widest text-center">
                  {selectedTopicId === "" ? "Elige un tópico" : "Sin resultados"}
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
            >
              <FaSave /> GUARDAR JUEGO
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}