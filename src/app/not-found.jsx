import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 min-h-[75vh]">
      <div className="bg-card border border-card-border max-w-md w-full p-10 rounded-2xl text-center shadow-xl">
        
        <div className="text-primary text-7xl mb-2 font-black tracking-tighter drop-shadow-neon-cyan">
          404
        </div>
        <div className="text-accent text-sm font-mono font-bold mb-6 tracking-widest uppercase">
          [ Ruta no encontrada ]
        </div>

        <h1 className="text-title text-2xl font-bold mb-3">
          Error de conexión
        </h1>
        <p className="text-body text-sm mb-8 leading-relaxed">
          Parece que te has perdido en el servidor. La pagina o el componente de hardware que estás buscando no existe o fue desconectado.
        </p>

        <Link
          href="/"
          className="inline-block w-full bg-primary hover:bg-primary-hover text-primary-fg font-extrabold py-3.5 px-6 rounded-xl transition-all shadow-neon-cyan"
        >
          Volver a la base
        </Link>
      </div>
    </main>
  );
}