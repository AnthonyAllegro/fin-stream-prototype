import { createFileRoute } from "@tanstack/react-router";
import { Scissors } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { ProcessFlow } from "@/components/ProcessFlow";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { removerPrefixos } from "@/lib/mock";

export const Route = createFileRoute("/remover-prefixos")({
  head: () => ({
    meta: [
      { title: "Remover prefixos — Suíte Financeira" },
      { name: "description", content: "Limpe prefixos numéricos, 'COPIA_' e datas de scanner dos nomes de arquivo." },
      { property: "og:title", content: "Remover prefixos — Suíte Financeira" },
      { property: "og:description", content: "Limpeza de prefixos nos nomes de arquivo em lote." },
    ],
  }),
  component: Pagina,
});

const padroes = [
  { id: "num", rotulo: "Prefixo numérico (001 - , 12_ )", marcado: true },
  { id: "copia", rotulo: "COPIA_ / Cópia de ", marcado: true },
  { id: "scan", rotulo: "scan_ e data do scanner (2026_09_08)", marcado: true },
  { id: "espaco", rotulo: "Espaços e hífens sobrando no início", marcado: true },
  { id: "final", rotulo: "Sufixos (1), (2) no final", marcado: false },
];

function Pagina() {
  return (
    <>
      <PageHeader
        icon={Scissors}
        titulo="Remover prefixos"
        descricao="Remove padrões repetidos do início dos nomes. Quando mais de um padrão casa com o mesmo arquivo, todos são removidos e o caso é marcado como atenção."
      />
      <ProcessFlow
        operacao="remover prefixos dos nomes"
        extensoes="PDF"
        itens={removerPrefixos}
        logExtra={["Padrões ativos: numérico, COPIA_, scan_ + data, espaços iniciais"]}
        opcoes={
          <div className="space-y-4">
            <fieldset>
              <legend className="text-sm font-medium text-foreground">Padrões a remover</legend>
              <div className="mt-2 space-y-2.5">
                {padroes.map((p) => (
                  <label key={p.id} className="flex items-start gap-2.5 text-sm">
                    <Checkbox defaultChecked={p.marcado} aria-label={p.rotulo} />
                    <span>{p.rotulo}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <Label htmlFor="custom">Padrão personalizado</Label>
              <Input id="custom" className="mt-1.5" placeholder="ex.: DOC_ ou ^[0-9]{4}-" />
              <p className="mt-1.5 text-xs text-muted-foreground">Aceita texto simples ou expressão regular.</p>
            </div>
            <label className="flex items-start gap-2.5 text-sm">
              <Checkbox defaultChecked aria-label="Ignorar quando o nome ficar vazio" />
              <span>Ignorar o arquivo se o nome ficar vazio</span>
            </label>
          </div>
        }
      />
    </>
  );
}
