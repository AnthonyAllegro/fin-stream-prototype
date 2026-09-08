import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ScrollText, Download, Search } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { Card, StatusBadge } from "@/components/ProcessFlow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { atividadeRecente } from "@/lib/mock";

export const Route = createFileRoute("/logs")({
  head: () => ({
    meta: [
      { title: "Logs e histórico — Suíte Financeira" },
      { name: "description", content: "Histórico de execuções com timestamps, resumo por lote e exportação." },
      { property: "og:title", content: "Logs e histórico — Suíte Financeira" },
      { property: "og:description", content: "Histórico de execuções com timestamps e resumo por lote." },
    ],
  }),
  component: Pagina,
});

const detalhe = [
  "[08/09/2026 16:31:02] Início da operação: renomear por valor",
  "[08/09/2026 16:31:02] Pasta de origem: C:\\Financeiro\\2026\\Entradas\\Lote-Setembro",
  "[08/09/2026 16:31:03] Backup criado em: ...\\_backup_08-09-2026",
  "[08/09/2026 16:31:04] OK  boleto_0012.pdf → 1.482,90 - Boleto - 12-09-2026.pdf",
  "[08/09/2026 16:31:04] OK  boleto_0013.pdf → 327,45 - Boleto - 12-09-2026.pdf",
  "[08/09/2026 16:31:05] AVISO  fatura_cartao_agosto.pdf — três valores encontrados, usado R$ 8.740,15",
  "[08/09/2026 16:31:06] ERRO  recibo_escaneado_07.pdf — nenhum valor reconhecido (sem camada de texto)",
  "[08/09/2026 16:31:07] Resumo: 24 processados · 1 aviso · 2 falhas",
  "[08/09/2026 16:31:07] Fim da operação. Duração 00:00:05",
];

function Pagina() {
  const [busca, setBusca] = useState("");
  const filtradas = atividadeRecente.filter((a) =>
    `${a.modulo} ${a.resumo}`.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        icon={ScrollText}
        titulo="Logs e histórico"
        descricao="Toda execução gera um log com timestamps e um resumo final. No protótipo o histórico é fictício e não persiste."
        acoes={
          <Button variant="outline">
            <Download className="h-4 w-4" aria-hidden="true" />
            Exportar histórico
          </Button>
        }
      />

      <Card titulo="Execuções">
        <div className="relative mb-4 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            aria-label="Buscar execuções"
            placeholder="Buscar por módulo ou resumo"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9"
          />
        </div>
        <ul className="divide-y divide-border">
          {filtradas.map((a) => (
            <li key={a.hora} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-foreground">{a.modulo}</p>
                <p className="text-xs text-muted-foreground">{a.resumo}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">{a.hora}</span>
                <StatusBadge status={a.status} />
              </div>
            </li>
          ))}
          {filtradas.length === 0 ? (
            <li className="py-6 text-center text-sm text-muted-foreground">Nenhuma execução encontrada.</li>
          ) : null}
        </ul>
      </Card>

      <Card titulo="Log detalhado" descricao="Execução de 08/09/2026 16:31 — Renomear por valor">
        <pre className="max-h-96 overflow-auto rounded-lg border border-border bg-background p-4 font-mono text-xs leading-relaxed text-foreground">
          {detalhe.join("\n")}
        </pre>
      </Card>
    </>
  );
}
