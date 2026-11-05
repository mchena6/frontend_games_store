"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Error capturado por Next.js:", error);
  }, [error]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 min-h-[75vh]">
      <div className="bg-card border border-red-500/30 max-w-md w-full p-8 rounded-2xl text-center shadow-xl relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>

        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-3xl">
          ⚠️
        </div>

        <h1 className="text-title text-2xl font-bold mb-2">
          Fallo en el sistema
        </h1>
        <p className="text-body text-sm mb-8 leading-relaxed">
          Ocurrió un error inesperado al intentar cargar esta sección. Puedes intentar reconectar o volver al inicio.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full bg-red-900/30 hover:bg-red-600 text-red-400 hover:text-white border border-red-800 hover:border-red-500 font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Intentar reconectar
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-surface hover:bg-card-hover text-muted hover:text-title border border-border-subtle hover:border-border-card font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </main>
  );
}