import { createFileRoute } from "@tanstack/react-router";
import { ListOrdered } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { ProcessFlow } from "@/components/ProcessFlow";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sequenciador } from "@/lib/mock";

export const Route = createFileRoute("/sequenciador")({
  head: () => ({
    meta: [
      { title: "Sequenciador — Suíte Financeira" },
      { name: "description", content: "Aplique prefixos numéricos contínuos a lotes de arquivos digitalizados." },
      { property: "og:title", content: "Sequenciador — Suíte Financeira" },
      { property: "og:description", content: "Prefixos numéricos contínuos em lotes de arquivos." },
    ],
  }),
  component: Pagina,
});

function Pagina() {
  return (
    <>
      <PageHeader
        icon={ListOrdered}
        titulo="Sequenciador"
        descricao="Numera os arquivos da pasta na ordem escolhida, com número inicial, passo e quantidade de dígitos configuráveis. Prefixos numéricos já existentes são substituídos."
      />
      <ProcessFlow
        operacao="aplicar numeração sequencial"
        extensoes="PDF, JPG e PNG"
        itens={sequenciador}
        logExtra={["Numeração aplicada de 001 a 004 (passo 1)", "1 prefixo antigo substituído"]}
        opcoes={
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="inicio">Número inicial</Label>
                <Input id="inicio" className="mt-1.5" defaultValue="1" inputMode="numeric" />
              </div>
              <div>
                <Label htmlFor="passo">Passo</Label>
                <Input id="passo" className="mt-1.5" defaultValue="1" inputMode="numeric" />
              </div>
            </div>
            <div>
              <Label htmlFor="digitos">Quantidade de dígitos</Label>
              <Select defaultValue="3">
                <SelectTrigger id="digitos" className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 dígitos (01)</SelectItem>
                  <SelectItem value="3">3 dígitos (001)</SelectItem>
                  <SelectItem value="4">4 dígitos (0001)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ordem">Ordem da sequência</Label>
              <Select defaultValue="nome">
                <SelectTrigger id="ordem" className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nome">Nome do arquivo (A-Z)</SelectItem>
                  <SelectItem value="data">Data de modificação</SelectItem>
                  <SelectItem value="tamanho">Tamanho</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sep">Separador após o número</Label>
              <Input id="sep" className="mt-1.5" defaultValue=" - " />
            </div>
            <label className="flex items-start gap-2.5 text-sm">
              <Checkbox defaultChecked aria-label="Substituir prefixo existente" />
              <span>Substituir prefixo numérico já existente</span>
            </label>
          </div>
        }
      />
    </>
  );
}
