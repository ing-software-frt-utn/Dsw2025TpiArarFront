import React from "react";

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = "Cargando..." }) => {
  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        {/* Spinner animado */}
        <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
        {/* Logo pequeño en el centro (opcional) */}
        <div className="absolute w-6 h-6 bg-violet-600 rounded-full animate-pulse"></div>
      </div>
      <p className="mt-4 text-violet-800 font-black text-sm uppercase tracking-widest animate-bounce">
        {message}
      </p>
    </div>
  );
};

export default LoadingOverlay;