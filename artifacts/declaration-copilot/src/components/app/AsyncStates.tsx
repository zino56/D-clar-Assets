import { AlertCircle, Inbox, Loader2 } from "lucide-react";

export function LoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-2 animate-pulse" role="status" aria-label="Chargement">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 bg-[#ECE8E1]/80 rounded-xl" />
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
}: {
  title: string;
  description?: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[#ECE8E1] flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-[#6B6966]" aria-hidden />
      </div>
      <p className="text-[14px] font-semibold text-[#1C1A16]">{title}</p>
      {description && <p className="text-[13px] text-[#6B6966] mt-1 max-w-sm">{description}</p>}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <AlertCircle className="w-10 h-10 text-[#B83232] mb-3" aria-hidden />
      <p className="text-[14px] font-semibold text-[#1C1A16]">Erreur de chargement</p>
      <p className="text-[13px] text-[#6B6966] mt-1 max-w-md">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 text-[13px] font-medium text-white bg-[#1A6B5E] hover:bg-[#145549] px-4 py-2 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6B5E] focus-visible:ring-offset-2"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24 gap-2 text-[#6B6966]" role="status">
      <Loader2 className="w-5 h-5 animate-spin text-[#1A6B5E]" aria-hidden />
      <span className="text-[13px] font-medium">Chargement…</span>
    </div>
  );
}
