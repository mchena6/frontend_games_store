export default function Loading() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-surface border-t-primary rounded-full animate-spin"></div>
        <p className="text-primary font-semibold animate-pulse tracking-widest uppercase text-sm">
          Cargando datos...
        </p>
      </div>
    </div>
  );
}