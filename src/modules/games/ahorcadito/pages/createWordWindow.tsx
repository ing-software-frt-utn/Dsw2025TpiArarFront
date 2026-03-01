import React, { useState } from "react";
import { FaCheck, FaXmark, FaPlus } from "react-icons/fa6";
import * as ahorcaditoApi from "../services/ahorcaditoApi";

import Button from "../../../../shared/components/Button";
import LoadingOverlay from "../../../../shared/components/LoadingOverlay";
import Popup from "../../../../shared/components/Popup";
import TextField from "../../../../shared/components/TextField";

export interface CreateWordWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onWordCreated: () => void | Promise<void>;
  defaultTopicId: string;
}

const CreateWordWindow: React.FC<CreateWordWindowProps> = ({
  isOpen,
  onClose,
  onWordCreated,
  defaultTopicId,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [text, setText] = useState("");
  const [hint, setHint] = useState("");
  const [level, setLevel] = useState<number>(1); // 0 fácil, 1 medio, 2 hard

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("La palabra secreta es obligatoria.");
      return;
    }
    if (!defaultTopicId) {
      setError("No se ha detectado un tópico seleccionado.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await ahorcaditoApi.createWord({
        text: text.toUpperCase().trim(),
        hint: hint.trim(),
        level,
        topicId: defaultTopicId,
      });

      setText("");
      setHint("");
      await onWordCreated();
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.title ||
        err?.response?.data?.message ||
        err?.message;
      setError(msg || "Error al intentar añadir la palabra al banco.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-110 flex items-center justify-center p-4 font-sans text-slate-900">
      {loading && <LoadingOverlay message="Guardando en el banco de datos..." />}

      <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in duration-200">
        <div className="bg-indigo-600 p-8 text-white text-center relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 text-indigo-200 hover:text-white transition-colors"
          >
            <FaXmark size={24} />
          </button>
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaPlus size={30} />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight leading-none">
            Nueva Palabra
          </h2>
          <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
            Añadiendo al tópico seleccionado
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <TextField
            label="Palabra Secreta"
            value={text}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
            placeholder="Ej: FOTOSINTESIS"
            required
            autoFocus
          />

          <TextField
            label="Pista o Definición"
            value={hint}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHint(e.target.value)}
            placeholder="Pista breve para el alumno..."
            required
          />

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">
              Nivel de Dificultad
            </label>
            <div className="flex bg-slate-50 p-1 rounded-xl border-2 border-slate-100 max-w-xs mx-auto">
              {[0, 1, 2].map((lv) => (
                <button
                  key={lv}
                  type="button"
                  onClick={() => setLevel(lv)}
                  className={`flex-1 py-2.5 rounded-lg font-black text-[10px] uppercase transition-all ${
                    level === lv ? "bg-white text-indigo-600 shadow-sm" : "text-slate-300 hover:text-slate-400"
                  }`}
                >
                  {lv === 0 ? "Fácil" : lv === 1 ? "Medio" : "Difícil"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              label="Cancelar"
              variant="secondary"
              onClick={onClose}
              className="flex-1 py-4 text-sm"
            />
            <Button
              label="Añadir"
              type="submit"
              imgSrc={<FaCheck />}
              className="flex-1 py-4 text-sm font-black"
            />
          </div>
        </form>
      </div>

      {error && <Popup message={error} onClose={() => setError(null)} />}
    </div>
  );
};

export default CreateWordWindow;