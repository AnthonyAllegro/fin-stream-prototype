import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Tag,
  ListOrdered,
  Scissors,
  Unlock,
  Combine,
  LayoutGrid,
  Users,
  ScrollText,
  Settings,
  Landmark,
} from "lucide-react";

const grupos = [
  {
    titulo: "Visão geral",
    itens: [{ to: "/", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    titulo: "Organização de arquivos",
    itens: [
      { to: "/renomear-por-valor", label: "Renomear por valor", icon: Tag },
      { to: "/sequenciador", label: "Sequenciador", icon: ListOrdered },
      { to: "/remover-prefixos", label: "Remover prefixos", icon: Scissors },
    ],
  },
  {
    titulo: "Documentos PDF",
    itens: [
      { to: "/desbloquear", label: "Desbloquear com senhas", icon: Unlock },
      { to: "/mesclar", label: "Mesclar (NF primeiro)", icon: Combine },
      { to: "/organizar-paginas", label: "Organizar páginas", icon: LayoutGrid },
    ],
  },
  {
    titulo: "Folha de pagamento",
    itens: [{ to: "/holerites", label: "Separar holerites", icon: Users }],
  },
  {
    titulo: "Sistema",
    itens: [
      { to: "/logs", label: "Logs e histórico", icon: ScrollText },
      { to: "/configuracoes", label: "Configurações", icon: Settings },
    ],
  },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Módulos da suíte"
      className="flex h-full w-64 shrink-0 flex-col overflow-y-auto bg-sidebar text-sidebar-foreground"
    >
      <div className="flex items-center gap-2.5 border-b border-sidebar-border px-5 py-4">
        <Landmark className="h-5 w-5" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold leading-tight">Suíte Financeira</p>
          <p className="text-xs leading-tight text-sidebar-foreground/70">Protótipo de referência</p>
        </div>
      </div>

      <div className="flex-1 px-3 py-4">
        {grupos.map((grupo) => (
          <div key={grupo.titulo} className="mb-5">
            <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/60">
              {grupo.titulo}
            </p>
            <ul className="space-y-0.5">
              {grupo.itens.map((item) => {
                const ativo = pathname === item.to;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      aria-current={ativo ? "page" : undefined}
                      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring ${
                        ativo
                          ? "bg-sidebar-primary font-medium text-sidebar-primary-foreground"
                          : "text-sidebar-foreground/90 hover:bg-sidebar-accent"
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-sidebar-border px-5 py-3 text-[11px] leading-relaxed text-sidebar-foreground/70">
        Protótipo navegável — sem processamento real nem persistência de dados.
      </div>
    </nav>
  );
}
