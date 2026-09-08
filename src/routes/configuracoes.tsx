import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ProcessFlow";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PASTA_PADRAO } from "@/lib/mock";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Suíte Financeira" },
      { name: "description", content: "Pastas padrão, política de backup e preferências de confirmação da suíte." },
      { property: "og:title", content: "Configurações — Suíte Financeira" },
      { property: "og:description", content: "Pastas padrão, backup e preferências de confirmação." },
    ],
  }),
  component: Pagina,
});

function Pagina() {
  return (
    <>
      <PageHeader
        icon={Settings}
        titulo="Configurações"
        descricao="Preferências gerais aplicadas a todos os módulos. Nesta referência de design nada é salvo."
        acoes={<Button>Salvar preferências</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card titulo="Pastas">
          <div className="space-y-4">
            <div>
              <Label htmlFor="pasta-entrada">Pasta padrão de entrada</Label>
              <Input id="pasta-entrada" className="mt-1.5 font-mono text-xs" defaultValue={PASTA_PADRAO} />
            </div>
            <div>
              <Label htmlFor="pasta-saida">Pasta padrão de saída</Label>
              <Input
                id="pasta-saida"
                className="mt-1.5 font-mono text-xs"
                defaultValue="C:\\Financeiro\\2026\\Processados"
              />
            </div>
            <label className="flex items-start gap-2.5 text-sm">
              <Checkbox defaultChecked aria-label="Incluir subpastas" />
              <span>Incluir subpastas na varredura</span>
            </label>
          </div>
        </Card>

        <Card titulo="Backup e segurança">
          <div className="space-y-4">
            <div>
              <Label htmlFor="politica">Política de backup</Label>
              <Select defaultValue="sempre">
                <SelectTrigger id="politica" className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sempre">Criar backup sempre (recomendado)</SelectItem>
                  <SelectItem value="perguntar">Perguntar a cada operação</SelectItem>
                  <SelectItem value="nunca">Nunca criar backup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="retencao">Retenção dos backups (dias)</Label>
              <Input id="retencao" className="mt-1.5" defaultValue="30" inputMode="numeric" />
            </div>
            <label className="flex items-start gap-2.5 text-sm">
              <Checkbox defaultChecked aria-label="Exigir confirmação por quantidade" />
              <span>Exigir digitação da quantidade antes de executar</span>
            </label>
            <label className="flex items-start gap-2.5 text-sm">
              <Checkbox defaultChecked aria-label="Salvar log em arquivo" />
              <span>Salvar o log de cada operação em arquivo .txt</span>
            </label>
          </div>
        </Card>

        <Card titulo="Aparência e acessibilidade">
          <div className="space-y-4">
            <div>
              <Label htmlFor="fonte">Tamanho da fonte</Label>
              <Select defaultValue="padrao">
                <SelectTrigger id="fonte" className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compacta">Compacta</SelectItem>
                  <SelectItem value="padrao">Padrão</SelectItem>
                  <SelectItem value="grande">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-start gap-2.5 text-sm">
              <Checkbox defaultChecked aria-label="Alto contraste nos avisos" />
              <span>Alto contraste em avisos e erros</span>
            </label>
            <label className="flex items-start gap-2.5 text-sm">
              <Checkbox defaultChecked aria-label="Atalhos de teclado" />
              <span>Habilitar atalhos de teclado nos módulos</span>
            </label>
          </div>
        </Card>

        <Card titulo="Sobre este protótipo">
          <p className="text-sm text-muted-foreground">
            Referência de design e fluxo para a versão desktop em Tkinter. Todos os dados exibidos são fictícios;
            nenhum arquivo é lido, alterado ou armazenado. Identidade: Inter, azul #1B4E8C, cinza #A3A3A3, texto
            #2D3748, fundos branco e #F7F8FA, cards com borda de 1px e raio de 8px.
          </p>
        </Card>
      </div>
    </>
  );
}
