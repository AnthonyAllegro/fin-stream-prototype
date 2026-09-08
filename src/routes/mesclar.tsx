import { createFileRoute } from "@tanstack/react-router";
import { Combine, FileText, AlertTriangle, XCircle } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { ProcessFlow, StatusBadge } from "@/components/ProcessFlow";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mesclagemGrupos, type FlowItem } from "@/lib/mock";

export const Route = createFileRoute("/mesclar")({
  head: () => ({
    meta: [
      { title: "Mesclar PDFs (NF primeiro) — Suíte Financeira" },
      { name: "description", content: "Agrupe documentos por fornecedor com a nota fiscal sempre na primeira página." },
      { property: "og:title", content: "Mesclar PDFs (NF primeiro) — Suíte Financeira" },
      { property: "og:description", content: "Mesclagem por fornecedor com a nota fiscal na primeira página." },
    ],
  }),
  component: Pagina,
});

const ordemTipo = { "Nota Fiscal": 0, Boleto: 1, Comprovante: 2, Outro: 3 } as const;

const itens: FlowItem[] = mesclagemGrupos.map((g) => ({
  id: g.id,
  origem: `${g.fornecedor} · ${g.arquivos.length} arquivos`,
  destino: g.status === "erro" ? undefined : `${g.fornecedor} - ${g.competencia}.pdf`,
  tamanho: `${g.arquivos.reduce((s, a) => s + a.paginas, 0)} págs.`,
  status: g.status,
  detalhe: g.detalhe,
}));

function Preview() {
  return (
    <div className="space-y-4">
      {mesclagemGrupos.map((g) => {
        const ordenados = [...g.arquivos].sort((a, b) => ordemTipo[a.tipo] - ordemTipo[b.tipo]);
        return (
          <article key={g.id} className="rounded-lg border border-border bg-background p-4">
            <header className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{g.fornecedor}</h3>
                <p className="text-xs text-muted-foreground">
                  Competência {g.competencia} · saída:{" "}
                  <span className="font-mono">
                    {g.status === "erro" ? "não será gerada" : `${g.fornecedor} - ${g.competencia}.pdf`}
                  </span>
                </p>
              </div>
              <StatusBadge status={g.status} />
            </header>

            <ol className="mt-3 space-y-1.5">
              {ordenados.map((a, i) => (
                <li
                  key={a.id}
                  className={`flex items-center gap-3 rounded-md border px-3 py-2 text-xs ${
                    a.tipo === "Nota Fiscal" ? "border-primary/40 bg-primary/5" : "border-border bg-surface"
                  }`}
                >
                  <span className="w-5 shrink-0 text-center font-semibold text-muted-foreground">{i + 1}</span>
                  <FileText className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="flex-1 truncate font-mono text-foreground">{a.nome}</span>
                  <span className="shrink-0 text-muted-foreground">{a.tipo}</span>
                  <span className="w-16 shrink-0 text-right text-muted-foreground">{a.paginas} pág.</span>
                </li>
              ))}
            </ol>

            {g.detalhe ? (
              <p
                className={`mt-3 flex items-start gap-1.5 text-xs ${
                  g.status === "erro" ? "text-destructive" : "text-muted-foreground"
                }`}
              >
                {g.status === "erro" ? (
                  <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                )}
                {g.detalhe}
              </p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

function Pagina() {
  return (
    <>
      <PageHeader
        icon={Combine}
        titulo="Mesclar (NF primeiro)"
        descricao="Agrupa os arquivos por fornecedor e competência e monta um único PDF por grupo, sempre com a nota fiscal como primeira página. Grupos sem nota fiscal são bloqueados."
      />
      <ProcessFlow
        operacao="mesclar grupos de documentos"
        extensoes="PDF"
        itens={itens}
        unidade="grupos"
        previewCustomizado={<Preview />}
        logExtra={["Regra 'NF sempre primeiro' aplicada em 2 grupos", "1 grupo ignorado por falta de nota fiscal"]}
        opcoes={
          <div className="space-y-4">
            <div>
              <Label htmlFor="agrupar">Agrupar por</Label>
              <Select defaultValue="fornecedor">
                <SelectTrigger id="agrupar" className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fornecedor">Fornecedor + competência</SelectItem>
                  <SelectItem value="pasta">Subpasta</SelectItem>
                  <SelectItem value="prefixo">Prefixo do nome</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ordem-restante">Ordem após a nota fiscal</Label>
              <Select defaultValue="boleto">
                <SelectTrigger id="ordem-restante" className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boleto">Boleto, comprovante, demais</SelectItem>
                  <SelectItem value="alfabetica">Ordem alfabética</SelectItem>
                  <SelectItem value="data">Data do arquivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-start gap-2.5 text-sm">
              <Checkbox defaultChecked aria-label="Bloquear grupos sem NF" />
              <span>Bloquear grupos sem nota fiscal identificada</span>
            </label>
            <label className="flex items-start gap-2.5 text-sm">
              <Checkbox defaultChecked aria-label="Manter originais" />
              <span>Manter os arquivos originais após a mesclagem</span>
            </label>
          </div>
        }
      />
    </>
  );
}
