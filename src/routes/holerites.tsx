import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Users, AlertTriangle, XCircle, Pencil } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { ProcessFlow, StatusBadge } from "@/components/ProcessFlow";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { holerites, type FlowItem, type Holerite } from "@/lib/mock";

export const Route = createFileRoute("/holerites")({
  head: () => ({
    meta: [
      { title: "Separar holerites — Suíte Financeira" },
      { name: "description", content: "Separe um PDF de folha em holerites individuais com revisão manual dos casos duvidosos." },
      { property: "og:title", content: "Separar holerites — Suíte Financeira" },
      { property: "og:description", content: "Separação de holerites por colaborador com revisão manual." },
    ],
  }),
  component: Pagina,
});

const itens: FlowItem[] = holerites.map((h) => ({
  id: h.id,
  origem: `folha_agosto_2026.pdf · pág. ${h.paginas}`,
  destino: h.status === "erro" ? undefined : `${h.matricula} - ${h.colaborador} - ${h.competencia}.pdf`,
  tamanho: `${h.paginas.includes("-") ? 2 : 1} pág.`,
  status: h.status,
  detalhe: h.detalhe,
}));

function Preview() {
  const [linhas, setLinhas] = useState<Holerite[]>(holerites);

  function editar(id: string, campo: keyof Holerite, valor: string) {
    setLinhas((atual) => atual.map((l) => (l.id === id ? { ...l, [campo]: valor } : l)));
  }

  return (
    <div className="space-y-3">
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
        Os campos abaixo são editáveis: corrija manualmente os holerites com baixa confiança antes de separar.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="py-2 pr-3 font-medium">Págs.</th>
              <th scope="col" className="py-2 pr-3 font-medium">Colaborador</th>
              <th scope="col" className="py-2 pr-3 font-medium">Matrícula</th>
              <th scope="col" className="py-2 pr-3 font-medium">CPF</th>
              <th scope="col" className="py-2 pr-3 font-medium">Líquido</th>
              <th scope="col" className="py-2 pr-3 font-medium">Confiança</th>
              <th scope="col" className="py-2 font-medium">Situação</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((h) => (
              <tr key={h.id} className="border-b border-border align-top last:border-0">
                <td className="py-3 pr-3 font-mono text-xs">{h.paginas}</td>
                <td className="py-3 pr-3">
                  <Input
                    aria-label={`Colaborador da página ${h.paginas}`}
                    value={h.colaborador}
                    onChange={(e) => editar(h.id, "colaborador", e.target.value)}
                    className="h-8 min-w-44 text-xs"
                  />
                  {h.detalhe ? (
                    <p
                      className={`mt-1.5 flex items-start gap-1.5 text-xs ${
                        h.status === "erro" ? "text-destructive" : "text-muted-foreground"
                      }`}
                    >
                      {h.status === "erro" ? (
                        <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      ) : (
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      )}
                      {h.detalhe}
                    </p>
                  ) : null}
                </td>
                <td className="py-3 pr-3">
                  <Input
                    aria-label={`Matrícula da página ${h.paginas}`}
                    value={h.matricula}
                    onChange={(e) => editar(h.id, "matricula", e.target.value)}
                    className="h-8 w-24 text-xs"
                  />
                </td>
                <td className="py-3 pr-3 font-mono text-xs text-muted-foreground">{h.cpf}</td>
                <td className="py-3 pr-3 text-xs">{h.liquido}</td>
                <td className="py-3 pr-3">
                  <span className="flex items-center gap-2 text-xs">
                    <span className="h-1.5 w-16 overflow-hidden rounded-full bg-accent">
                      <span
                        className={`block h-full rounded-full ${h.confianca < 0.6 ? "bg-destructive" : h.confianca < 0.95 ? "bg-warning" : "bg-success"}`}
                        style={{ width: `${h.confianca * 100}%` }}
                      />
                    </span>
                    {Math.round(h.confianca * 100)}%
                  </span>
                </td>
                <td className="py-3">
                  <StatusBadge status={h.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Pagina() {
  return (
    <>
      <PageHeader
        icon={Users}
        titulo="Separar holerites"
        descricao="Divide o PDF único da folha em um arquivo por colaborador. Páginas com leitura duvidosa entram em revisão manual e só são separadas depois de corrigidas."
      />
      <ProcessFlow
        operacao="separar holerites por colaborador"
        extensoes="PDF de folha"
        itens={itens}
        unidade="holerites"
        previewCustomizado={<Preview />}
        logExtra={[
          "1 holerite enviado para revisão manual",
          "Nomeação aplicada: matrícula - colaborador - competência",
        ]}
        opcoes={
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome-saida">Padrão do nome de saída</Label>
              <Select defaultValue="matricula">
                <SelectTrigger id="nome-saida" className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matricula">matrícula - nome - competência</SelectItem>
                  <SelectItem value="nome">nome - competência</SelectItem>
                  <SelectItem value="cpf">CPF - competência</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="corte">Critério de corte</Label>
              <Select defaultValue="colaborador">
                <SelectTrigger id="corte" className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="colaborador">Mudança de colaborador</SelectItem>
                  <SelectItem value="fixo">Número fixo de páginas</SelectItem>
                  <SelectItem value="texto">Texto marcador na página</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="limite">Confiança mínima para separar sem revisão</Label>
              <Input id="limite" className="mt-1.5" defaultValue="95%" />
            </div>
            <label className="flex items-start gap-2.5 text-sm">
              <Checkbox defaultChecked aria-label="Exigir revisão manual" />
              <span>Exigir revisão manual abaixo da confiança mínima</span>
            </label>
            <label className="flex items-start gap-2.5 text-sm">
              <Checkbox aria-label="Criar subpasta por colaborador" />
              <span>Criar uma subpasta por colaborador</span>
            </label>
          </div>
        }
      />
    </>
  );
}
