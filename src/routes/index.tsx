import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Tag,
  ListOrdered,
  Scissors,
  Unlock,
  Combine,
  LayoutGrid,
  Users,
  FolderOpen,
  FileCheck2,
  AlertTriangle,
  Clock,
} from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ProcessFlow";
import { atividadeRecente, volumeSemanal } from "@/lib/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Suíte Financeira" },
      {
        name: "description",
        content: "Visão geral dos módulos de organização de arquivos, PDFs e holerites da Suíte Financeira.",
      },
      { property: "og:title", content: "Dashboard — Suíte Financeira" },
      {
        property: "og:description",
        content: "Visão geral dos módulos de organização de arquivos, PDFs e holerites.",
      },
    ],
  }),
  component: Dashboard,
});

const indicadores = [
  { rotulo: "Arquivos processados (mês)", valor: "1.284", icone: FileCheck2 },
  { rotulo: "Pastas monitoradas", valor: "6", icone: FolderOpen },
  { rotulo: "Pendências de revisão", valor: "9", icone: AlertTriangle },
  { rotulo: "Tempo médio por lote", valor: "00:01:12", icone: Clock },
];

const modulos = [
  { to: "/renomear-por-valor", nome: "Renomear por valor", desc: "Lê o valor do documento e renomeia com data e tipo.", icon: Tag },
  { to: "/sequenciador", nome: "Sequenciador", desc: "Aplica prefixos numéricos contínuos em lote.", icon: ListOrdered },
  { to: "/remover-prefixos", nome: "Remover prefixos", desc: "Limpa prefixos numéricos, 'COPIA_' e datas de scanner.", icon: Scissors },
  { to: "/desbloquear", nome: "Desbloquear com senhas", desc: "Testa a lista de senhas salvas e remove restrições.", icon: Unlock },
  { to: "/mesclar", nome: "Mesclar (NF primeiro)", desc: "Agrupa por fornecedor com a nota fiscal na primeira página.", icon: Combine },
  { to: "/organizar-paginas", nome: "Organizar páginas", desc: "Miniaturas, arrastar, girar e excluir páginas.", icon: LayoutGrid },
  { to: "/holerites", nome: "Separar holerites", desc: "Detecta colaboradores e permite revisão manual.", icon: Users },
] as const;

function Dashboard() {
  const maximo = Math.max(...volumeSemanal.map((d) => d.arquivos));

  return (
    <>
      <PageHeader
        icon={LayoutDashboard}
        titulo="Dashboard"
        descricao="Protótipo navegável da Suíte Financeira. Nenhum arquivo é lido, alterado ou armazenado — os dados são fictícios."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {indicadores.map((ind) => (
          <div key={ind.rotulo} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{ind.rotulo}</p>
              <ind.icone className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{ind.valor}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card titulo="Módulos" descricao="Cada módulo segue o mesmo fluxo de segurança em cinco etapas.">
            <ul className="grid gap-3 sm:grid-cols-2">
              {modulos.map((m) => (
                <li key={m.to}>
                  <Link
                    to={m.to}
                    className="flex h-full items-start gap-3 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <m.icon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" aria-hidden="true" />
                    <span>
                      <span className="block text-sm font-medium text-foreground">{m.nome}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">{m.desc}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-4">
          <Card titulo="Volume da semana" descricao="Arquivos processados por dia.">
            <ul className="space-y-2">
              {volumeSemanal.map((d) => (
                <li key={d.dia} className="flex items-center gap-3 text-xs">
                  <span className="w-8 text-muted-foreground">{d.dia}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-accent">
                    <span
                      className="block h-full rounded-full bg-primary"
                      style={{ width: `${(d.arquivos / maximo) * 100}%` }}
                    />
                  </span>
                  <span className="w-8 text-right font-medium text-foreground">{d.arquivos}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Card titulo="Atividade recente">
        <ul className="divide-y divide-border">
          {atividadeRecente.map((a) => (
            <li key={a.hora} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-foreground">{a.modulo}</p>
                <p className="text-xs text-muted-foreground">{a.resumo}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">{a.hora}</span>
                <span
                  className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${
                    a.status === "ok"
                      ? "border-success/40 bg-success/10 text-success"
                      : a.status === "aviso"
                        ? "border-warning/50 bg-warning/10 text-warning-foreground"
                        : "border-destructive/40 bg-destructive/10 text-destructive"
                  }`}
                >
                  {a.status === "ok" ? "Concluído" : a.status === "aviso" ? "Com avisos" : "Interrompido"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
