import React, { useState } from "react";
import { FaCheck, FaXmark } from "react-icons/fa6";
import Button from "../../../../shared/components/Button";
import TextField from "../../../../shared/components/TextField";

type Topic = { id: string; name: string; description?: string };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreateTopic: (name: string, description?: string) => Promise<Topic>;
  onTopicCreated: (topic: Topic) => void;
}

const TopicCreatorWindow: React.FC<Props> = ({ isOpen, onClose, onCreateTopic, onTopicCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const newTopic = await onCreateTopic(name.trim(), description.trim());
      onTopicCreated(newTopic);
      setName("");
      setDescription("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-indigo-600 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-indigo-200 hover:text-white transition-colors"
            type="button"
          >
            <FaXmark size={20} />
          </button>
          <h2 className="text-2xl font-black uppercase tracking-tight">Nuevo Tópico</h2>
          <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mt-1">
            Categoriza tus palabras para el juego
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <TextField
            label="Nombre del Tópico"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            placeholder="Ej: Anatomía, Historia..."
            required
            disabled={isSubmitting}
          />

          {/* Solución al Error: Reemplazado TextField por textarea nativo con estilos equivalentes */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Descripción (Opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descripción de la categoría"
              rows={3}
              disabled={isSubmitting}
              className="px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold text-sm text-slate-700 resize-none transition-all duration-300"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              label="Cancelar"
              variant="secondary"
              onClick={onClose}
              className="flex-1 bg-slate-100 text-slate-500 hover:bg-slate-200"
              disabled={isSubmitting}
            />
            <Button
              label={isSubmitting ? "Creando..." : "Crear Tópico"}
              type="submit"
              imgSrc={<FaCheck />}
              className="flex-1 bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 shadow-indigo-100"
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default TopicCreatorWindow;