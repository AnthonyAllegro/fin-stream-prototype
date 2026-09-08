import { createFileRoute } from "@tanstack/react-router";
import { Tag } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { ProcessFlow } from "@/components/ProcessFlow";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { renomearValor } from "@/lib/mock";

export const Route = createFileRoute("/renomear-por-valor")({
  head: () => ({
    meta: [
      { title: "Renomear por valor — Suíte Financeira" },
      {
        name: "description",
        content: "Renomeie boletos e notas em lote usando o valor monetário lido do documento.",
      },
      { property: "og:title", content: "Renomear por valor — Suíte Financeira" },
      { property: "og:description", content: "Renomeie boletos e notas em lote usando o valor do documento." },
    ],
  }),
  component: Pagina,
});

function Pagina() {
  return (
    <>
      <PageHeader
        icon={Tag}
        titulo="Renomear por valor"
        descricao="Lê o valor monetário de cada PDF e monta o nome final no padrão valor - tipo - data. Quando há mais de um valor na página, o maior é usado e o caso é marcado como atenção."
      />
      <ProcessFlow
        operacao="renomear por valor"
        extensoes="PDF"
        itens={renomearValor}
        logExtra={["Regra aplicada: maior valor da primeira página", "2 arquivos mantidos com o nome original"]}
        opcoes={
          <div className="space-y-4">
            <div>
              <Label htmlFor="padrao">Padrão do nome</Label>
              <Select defaultValue="valor-tipo-data">
                <SelectTrigger id="padrao" className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="valor-tipo-data">valor - tipo - data</SelectItem>
                  <SelectItem value="data-valor">data - valor</SelectItem>
                  <SelectItem value="valor-fornecedor">valor - fornecedor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="separador">Separador decimal</Label>
              <Select defaultValue="virgula">
                <SelectTrigger id="separador" className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="virgula">Vírgula (1.482,90)</SelectItem>
                  <SelectItem value="ponto">Ponto (1482.90)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="regiao">Região de busca do valor</Label>
              <Input id="regiao" className="mt-1.5" defaultValue="Página 1 — metade inferior" readOnly />
            </div>
            <label className="flex items-start gap-2.5 text-sm">
              <Checkbox defaultChecked aria-label="Usar o maior valor" />
              <span>Usar o maior valor quando houver mais de um na página</span>
            </label>
            <label className="flex items-start gap-2.5 text-sm">
              <Checkbox aria-label="Sufixo automático" />
              <span>Adicionar sufixo (1), (2) em caso de nome duplicado</span>
            </label>
          </div>
        }
      />
    </>
  );
}
