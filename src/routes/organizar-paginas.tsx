import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LayoutGrid, RotateCw, RotateCcw, Trash2, Undo2, GripVertical, FileText } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { ProcessFlow } from "@/components/ProcessFlow";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { paginasIniciais, type FlowItem, type Pagina as PaginaPdf } from "@/lib/mock";

export const Route = createFileRoute("/organizar-paginas")({
  head: () => ({
    meta: [
      { title: "Organizar páginas — Suíte Financeira" },
      { name: "description", content: "Reordene, gire e exclua páginas de um PDF por miniaturas antes de salvar." },
      { property: "og:title", content: "Organizar páginas — Suíte Financeira" },
      { property: "og:description", content: "Miniaturas com arrastar, girar e excluir páginas de um PDF." },
    ],
  }),
  component: Pagina,
});

const itens: FlowItem[] = [
  {
    id: "1",
    origem: "NF 118420 - completo.pdf (6 páginas)",
    destino: "NF 118420 - completo.pdf (5 páginas, 2 giradas)",
    tamanho: "1,4 MB",
    status: "ok",
  },
  {
    id: "2",
    origem: "Página 3 — verso em branco",
    tamanho: "8 KB",
    status: "aviso",
    detalhe: "Página detectada como em branco e marcada para exclusão. Desmarque se quiser mantê-la.",
  },
];

function Organizador() {
  const [paginas, setPaginas] = useState<PaginaPdf[]>(paginasIniciais);
  const [arrastando, setArrastando] = useState<string | null>(null);

  function mover(origemId: string, destinoId: string) {
    setPaginas((atual) => {
      const copia = [...atual];
      const de = copia.findIndex((p) => p.id === origemId);
      const para = copia.findIndex((p) => p.id === destinoId);
      if (de < 0 || para < 0) return atual;
      const [item] = copia.splice(de, 1);
      copia.splice(para, 0, item);
      return copia;
    });
  }

  function girar(id: string, graus: number) {
    setPaginas((atual) =>
      atual.map((p) => (p.id === id ? { ...p, rotacao: (p.rotacao + graus + 360) % 360 } : p)),
    );
  }

  function alternarExclusao(id: string) {
    setPaginas((atual) => atual.map((p) => (p.id === id ? { ...p, excluida: !p.excluida } : p)));
  }

  const restantes = paginas.filter((p) => !p.excluida).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Arraste as miniaturas para reordenar. {restantes} de {paginas.length} páginas serão mantidas.
        </p>
        <Button variant="outline" size="sm" onClick={() => setPaginas(paginasIniciais)}>
          <Undo2 className="h-4 w-4" aria-hidden="true" />
          Restaurar ordem original
        </Button>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {paginas.map((p, i) => (
          <li
            key={p.id}
            draggable
            onDragStart={() => setArrastando(p.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (arrastando) mover(arrastando, p.id);
              setArrastando(null);
            }}
            className={`rounded-lg border bg-surface p-2 transition-colors ${
              p.excluida ? "border-destructive/40 opacity-60" : "border-border"
            } ${arrastando === p.id ? "border-primary" : ""}`}
          >
            <div className="flex items-center justify-between px-1 pb-1.5">
              <span className="flex items-center gap-1 text-xs font-medium text-foreground">
                <GripVertical className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                {i + 1}
              </span>
              <span className="text-[11px] text-muted-foreground">{p.rotacao}°</span>
            </div>

            <div className="flex aspect-[3/4] items-center justify-center rounded-md border border-border bg-background">
              <div
                className="flex flex-col items-center gap-1.5 transition-transform"
                style={{ transform: `rotate(${p.rotacao}deg)` }}
              >
                <FileText className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                <span className="max-w-24 text-center text-[11px] leading-tight text-muted-foreground">
                  {p.origem}
                </span>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between gap-1">
              <Button variant="ghost" size="icon" aria-label={`Girar ${p.rotulo} à esquerda`} onClick={() => girar(p.id, -90)}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="icon" aria-label={`Girar ${p.rotulo} à direita`} onClick={() => girar(p.id, 90)}>
                <RotateCw className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={p.excluida ? `Restaurar ${p.rotulo}` : `Excluir ${p.rotulo}`}
                onClick={() => alternarExclusao(p.id)}
              >
                {p.excluida ? <Undo2 className="h-4 w-4" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Pagina() {
  return (
    <>
      <PageHeader
        icon={LayoutGrid}
        titulo="Organizar páginas"
        descricao="Visualize o documento em miniaturas, arraste para reordenar, gire em 90° e marque páginas para exclusão. Nada é salvo até a confirmação final."
      />
      <ProcessFlow
        operacao="salvar a nova ordem das páginas"
        extensoes="PDF"
        itens={itens}
        unidade="documentos"
        previewCustomizado={<Organizador />}
        logExtra={["1 página em branco excluída", "2 páginas giradas em 90°", "Ordem final: 1, 2, 4, 5, 6"]}
        opcoes={
          <div className="space-y-4">
            <div>
              <Label htmlFor="salvar-como">Salvar como</Label>
              <Select defaultValue="copia">
                <SelectTrigger id="salvar-como" className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="copia">Nova cópia (sufixo _organizado)</SelectItem>
                  <SelectItem value="sobrescrever">Sobrescrever o original</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-start gap-2.5 text-sm">
              <Checkbox defaultChecked aria-label="Detectar páginas em branco" />
              <span>Detectar e sugerir exclusão de páginas em branco</span>
            </label>
            <label className="flex items-start gap-2.5 text-sm">
              <Checkbox defaultChecked aria-label="Corrigir orientação" />
              <span>Sugerir correção automática de orientação</span>
            </label>
          </div>
        }
      />
    </>
  );
}
