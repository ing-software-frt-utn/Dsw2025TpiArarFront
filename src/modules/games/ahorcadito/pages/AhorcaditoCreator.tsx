import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFloppyDisk,
  FaArrowLeft,
  FaCircleCheck,
  FaRegCircle,
  FaMagnifyingGlass,
  FaPlus,
} from "react-icons/fa6";

import Button from "../../../../shared/components/Button";
import TextField from "../../../../shared/components/TextField";
import LoadingOverlay from "../../../../shared/components/LoadingOverlay";
import Popup from "../../../../shared/components/Popup";
import { instance } from "../../../../shared/api/axiosInstance";
import CreateWordWindow from "./createWordWindow";
import TopicCreatorWindow from "./TopicCreatorWindow"; 
import { getTeacherClassrooms } from "../../../classes/services/classService";
import { useTopics } from "../hooks/useTopics"; 

type Classroom = { id: string; name: string };
type Word = { id: string; text: string; hint: string; level?: number };

const normalizeList = <T,>(data: any): T[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.$values)) return data.$values;
  return [];
};

const extractProblemDetails = (err: any): string => {
  const data = err?.response?.data;
  if (data?.errors && typeof data.errors === "object") {
    return Object.entries<any>(data.errors)
      .map(([field, val]) => `${field}: ${Array.isArray(val) ? val.join(" | ") : String(val)}`)
      .join("\n");
  }
  return data?.detail || data?.title || data?.message || err?.message || "Error desconocido";
};

export default function AhorcaditoCreator() {
  const navigate = useNavigate();

  const { topics, loading: topicsLoading, error: topicsError, fetchTopics, createTopic } = useTopics();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loadingClassrooms, setLoadingClassrooms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClassrooms = async () => {
      setLoadingClassrooms(true);
      try {
        const cls = await getTeacherClassrooms();
        setClassrooms(normalizeList<any>(cls).map(c => ({
          id: String(c?.id ?? c?.Id ?? ""),
          name: String(c?.name ?? c?.Name ?? ""),
        })).filter(c => c.id));
      } catch (err) {
        setError(extractProblemDetails(err));
      } finally {
        setLoadingClassrooms(false);
      }
    };
    loadClassrooms();
  }, []);

  useEffect(() => {
    if (topicsError) setError(topicsError);
  }, [topicsError]);

  const loadingInit = loadingClassrooms || topicsLoading;
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("MEDIUM");
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<Word[]>([]);
  const [loadingWords, setLoadingWords] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);

  const difficultyLevel = useMemo(() => 
    difficulty === "EASY" ? 0 : difficulty === "MEDIUM" ? 1 : 2, [difficulty]);

  const fetchWordsFromApi = useCallback(async () => {
    if (!selectedTopicId) return;
    
    setLoadingWords(true);
    try {
      const res = await instance.get(`api/games/hangman/words/${selectedTopicId}`);
      setAvailableWords(normalizeList<any>(res.data).map(w => ({
        id: String(w?.id ?? w?.Id ?? ""),
        text: String(w?.text ?? w?.Text ?? ""),
        hint: String(w?.hint ?? w?.Hint ?? ""),
        level: typeof (w?.level ?? w?.Level) === "number" ? (w.level ?? w.Level) : undefined,
      })).filter(w => w.id));
    } catch { 
      setAvailableWords([]); 
    } finally { 
      setLoadingWords(false); 
    }
  }, [selectedTopicId]);

  useEffect(() => {
    if (!selectedTopicId) {
      setAvailableWords([]);
      setSelectedWordIds([]);
      return;
    }
    fetchWordsFromApi();
    setSelectedWordIds([]);
  }, [selectedTopicId, fetchWordsFromApi]);

  const wordsForUI = useMemo(() => {
    const q = searchTerm.toLowerCase();
    const byLevel = availableWords.some(w => typeof w.level === "number")
      ? availableWords.filter(w => w.level === difficultyLevel)
      : availableWords;
    return q ? byLevel.filter(w => w.text.toLowerCase().includes(q)) : byLevel;
  }, [availableWords, difficultyLevel, searchTerm]);

  const handleSave = async () => {
    if (!title.trim() || !selectedClassId || !selectedTopicId || !selectedWordIds.length) {
      setError("Completa todos los campos obligatorios.");
      return;
    }
    setSaving(true);
    try {
      const topicObj = topics.find(t => t.id === selectedTopicId);
      const createdRes = await instance.post("api/games/hangman", {
        title: title.trim(),
        description: description.trim(),
        instructions: description.trim() || "Adiviná la palabra.",
        maxAttempts: 6,
        wordId: selectedWordIds[0],
        topicId: selectedTopicId,
      });

      const gameId = createdRes.data?.id || createdRes.data?.Id;
      await instance.post(`api/classroom/${selectedClassId}/publish-game`, {
        title: title.trim(),
        description: description.trim(),
        level: difficultyLevel,
        topic: topicObj?.name ?? "SIN_TOPICO",
        gameId,
        startDate: null,
        endDate: null,
      });
      navigate("/profesor");
    } catch (err) { setError(extractProblemDetails(err)); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-slate-50 font-sans text-slate-900">
      {(saving || loadingInit) && <LoadingOverlay message="Procesando..." />}
      <div className="max-w-6xl mx-auto mb-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-3 bg-white hover:bg-slate-100 rounded-2xl text-slate-400 shadow-sm border border-slate-100 active:scale-90 transition-all">
          <FaArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Configurar Ahorcadito</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Actividad por Clase</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-6">
            <h2 className="text-lg font-black uppercase tracking-tight mb-4">Ajustes</h2>
            
            <TextField label="Título" value={title} onChange={(e: any) => setTitle(e.target.value)} placeholder="Ej: Repaso de Células" required />
            <TextField label="Pista General" value={description} onChange={(e: any) => setDescription(e.target.value)} placeholder="Breve descripción" />

            <SelectField label="Clase Destino" value={selectedClassId} onChange={setSelectedClassId} options={classrooms} placeholder={loadingInit ? "Cargando..." : "Seleccionar clase..."} disabled={loadingInit} />
            
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-center">Tópico</label>
               <div className="flex gap-2">
                  <select value={selectedTopicId} onChange={e => setSelectedTopicId(e.target.value)} className="grow px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm">
                    <option value="">Seleccionar tópico...</option>
                    {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                  <button onClick={() => setIsTopicModalOpen(true)} className="px-4 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition-all"><FaPlus size={14} /></button>
               </div>
            </div>

            <DifficultySelector current={difficulty} onChange={setDifficulty} />
          </div>

          <Button label="GUARDAR JUEGO" onClick={handleSave} imgSrc={<FaFloppyDisk />} className="w-full py-6 rounded-4xl shadow-xl font-black text-xl" disabled={saving || loadingInit} />
        </div>

        <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col min-h-[500px]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">Banco de Palabras</h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase mt-1">Seleccionada: <span className="text-indigo-600">{selectedWordIds.length}</span></p>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative grow md:w-64">
                <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input type="text" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none text-sm font-bold" />
              </div>
              <button onClick={() => selectedTopicId ? setIsWordModalOpen(true) : setError("Selecciona un tópico primero.")} className="px-4 py-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all"><FaPlus /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {loadingWords ? (
              <div className="h-full flex flex-col items-center justify-center gap-2"><div className="w-8 h-8 border-4 border-t-indigo-500 rounded-full animate-spin"></div></div>
            ) : wordsForUI.map(word => (
              <WordItem key={word.id} word={word} isSelected={selectedWordIds.includes(word.id)} onToggle={() => setSelectedWordIds(prev => prev.includes(word.id) ? [] : [word.id])} />
            ))}
          </div>
        </div>
      </div>

      {isTopicModalOpen && (
        <TopicCreatorWindow 
          isOpen 
          onClose={() => setIsTopicModalOpen(false)} 
          onCreateTopic={createTopic}
          onTopicCreated={t => { 
            setSelectedTopicId(t.id); 
            setIsTopicModalOpen(false); 
          }} 
        />
      )}
      {isWordModalOpen && (
        <CreateWordWindow 
          isOpen 
          onClose={() => setIsWordModalOpen(false)} 
          onWordCreated={() => {
            fetchWordsFromApi(); 
          }} 
          defaultTopicId={selectedTopicId} 
        />
      )}

      {error && <Popup message={error} onClose={() => setError(null)} />}
    </div>
  );
}

const SelectField = ({ label, value, onChange, options, placeholder, disabled }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-center">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled} className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm appearance-none">
      <option value="">{placeholder}</option>
      {options.map((o: any) => <option key={o.id} value={o.id}>{o.name}</option>)}
    </select>
  </div>
);

const DifficultySelector = ({ current, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-center">Dificultad</label>
    <div className="flex gap-2">
      {["EASY", "MEDIUM", "HARD"].map(lvl => (
        <Button key={lvl} label={lvl === "EASY" ? "Fácil" : lvl === "MEDIUM" ? "Medio" : "Difícil"} variant={current === lvl ? "primary" : "secondary"} onClick={() => onChange(lvl)} className="flex-1 text-[10px] py-2 rounded-xl shadow-none" />
      ))}
    </div>
  </div>
);

const WordItem = ({ word, isSelected, onToggle }: any) => (
  <div onClick={onToggle} className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group ${isSelected ? "bg-indigo-50 border-indigo-500 shadow-md" : "bg-white border-slate-50 hover:border-slate-200"}`}>
    <div>
      <p className={`font-black uppercase tracking-widest text-sm ${isSelected ? "text-indigo-700" : "text-slate-700"}`}>{word.text}</p>
      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 italic">Pista: {word.hint || "Sin descripción"}</p>
    </div>
    <div className="text-2xl">{isSelected ? <FaCircleCheck className="text-indigo-600" /> : <FaRegCircle className="text-slate-200" />}</div>
  </div>
);