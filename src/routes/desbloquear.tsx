import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Unlock, Plus, Trash2, KeyRound } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { ProcessFlow } from "@/components/ProcessFlow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { desbloquear, senhasSalvas } from "@/lib/mock";

export const Route = createFileRoute("/desbloquear")({
  head: () => ({
    meta: [
      { title: "Desbloquear PDFs — Suíte Financeira" },
      { name: "description", content: "Teste uma lista de senhas salvas para abrir extratos e faturas protegidos." },
      { property: "og:title", content: "Desbloquear PDFs — Suíte Financeira" },
      { property: "og:description", content: "Lista de senhas salvas aplicada em lote a PDFs protegidos." },
    ],
  }),
  component: Pagina,
});

function Pagina() {
  const [senhas, setSenhas] = useState(senhasSalvas);
  const [novoRotulo, setNovoRotulo] = useState("");

  return (
    <>
      <PageHeader
        icon={Unlock}
        titulo="Desbloquear com senhas"
        descricao="Cada arquivo é testado contra a lista de senhas, na ordem definida. O primeiro acerto desbloqueia; se nenhuma senha abrir, o arquivo é marcado como bloqueado e explicado na pré-visualização."
      />
      <ProcessFlow
        operacao="desbloquear PDFs"
        extensoes="PDF protegidos"
        itens={desbloquear}
        logExtra={[
          "Senha 'CNPJ curto' abriu 1 arquivo",
          "Senha 'CPF do sócio' abriu 1 arquivo",
          "1 arquivo permanece bloqueado",
        ]}
        opcoes={
          <div className="space-y-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <KeyRound className="h-4 w-4 text-primary" aria-hidden="true" />
                Lista de senhas ({senhas.length})
              </p>
              <ul className="mt-2 space-y-2">
                {senhas.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-foreground">{s.rotulo}</span>
                      <span className="block font-mono text-xs text-muted-foreground">
                        {s.valor} · usada {s.usos}×
                      </span>
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remover senha ${s.rotulo}`}
                      onClick={() => setSenhas((atual) => atual.filter((x) => x.id !== s.id))}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Label htmlFor="nova-senha">Adicionar senha à lista</Label>
              <div className="mt-1.5 flex gap-2">
                <Input
                  id="nova-senha"
                  placeholder="Rótulo da senha"
                  value={novoRotulo}
                  onChange={(e) => setNovoRotulo(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Adicionar senha"
                  onClick={() => {
                    if (!novoRotulo.trim()) return;
                    setSenhas((atual) => [
                      ...atual,
                      { id: crypto.randomUUID(), rotulo: novoRotulo.trim(), valor: "••••••", usos: 0 },
                    ]);
                    setNovoRotulo("");
                  }}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                No protótipo as senhas não são armazenadas nem enviadas.
              </p>
            </div>

            <label className="flex items-start gap-2.5 text-sm">
              <Checkbox defaultChecked aria-label="Remover restrições" />
              <span>Remover também restrições de impressão e cópia</span>
            </label>
            <label className="flex items-start gap-2.5 text-sm">
              <Checkbox defaultChecked aria-label="Salvar cópia desbloqueada" />
              <span>Salvar cópia desbloqueada mantendo o original</span>
            </label>
          </div>
        }
      />
    </>
  );
}
