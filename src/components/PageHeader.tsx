import type { LucideIcon } from "lucide-react";

export function PageHeader({
  icon: Icon,
  titulo,
  descricao,
  acoes,
}: {
  icon: LucideIcon;
  titulo: string;
  descricao: string;
  acoes?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-primary">
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{titulo}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{descricao}</p>
        </div>
      </div>
      {acoes ? <div className="flex items-center gap-2">{acoes}</div> : null}
    </header>
  );
}
