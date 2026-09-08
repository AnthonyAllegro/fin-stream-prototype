import { useState, type ReactNode } from "react";
import {
  FolderOpen,
  UploadCloud,
  Eye,
  ShieldAlert,
  CheckCircle2,
  ScrollText,
  AlertTriangle,
  XCircle,
  RotateCcw,
  ArrowRight,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PASTA_PADRAO, type FlowItem } from "@/lib/mock";

const PASSOS = [
  { id: 1, label: "Seleção", icon: FolderOpen },
  { id: 2, label: "Pré-visualização", icon: Eye },
  { id: 3, label: "Backup", icon: ShieldAlert },
  { id: 4, label: "Confirmação", icon: CheckCircle2 },
  { id: 5, label: "Log", icon: ScrollText },
] as const;

export function StatusBadge({ status }: { status: FlowItem["status"] }) {
  const mapa = {
    ok: { texto: "Elegível", classe: "border-success/40 bg-success/10 text-success" },
    aviso: { texto: "Atenção", classe: "border-warning/50 bg-warning/10 text-warning-foreground" },
    erro: { texto: "Bloqueado", classe: "border-destructive/40 bg-destructive/10 text-destructive" },
  }[status];
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${mapa.classe}`}>
      {mapa.texto}
    </span>
  );
}

export function Card({
  titulo,
  descricao,
  children,
  acoes,
}: {
  titulo?: string;
  descricao?: string;
  children: ReactNode;
  acoes?: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-surface">
      {titulo ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3.5">
          <div>
            <h2 className="text-sm font-semibold text-foreground">{titulo}</h2>
            {descricao ? <p className="mt-0.5 text-xs text-muted-foreground">{descricao}</p> : null}
          </div>
          {acoes}
        </div>
      ) : null}
      <div className="p-5">{children}</div>
    </section>
  );
}

function Stepper({ atual }: { atual: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-2" aria-label="Etapas do fluxo">
      {PASSOS.map((p, i) => {
        const feito = atual > p.id;
        const ativo = atual === p.id;
        return (
          <li key={p.id} className="flex items-center gap-2">
            <span
              aria-current={ativo ? "step" : undefined}
              className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-medium ${
                ativo
                  ? "border-primary bg-primary text-primary-foreground"
                  : feito
                    ? "border-primary/30 bg-primary/5 text-primary"
                    : "border-border bg-surface text-muted-foreground"
              }`}
            >
              <p.icon className="h-3.5 w-3.5" aria-hidden="true" />
              {p.id}. {p.label}
            </span>
            {i < PASSOS.length - 1 ? (
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export type ProcessFlowProps = {
  /** Nome curto da operação, ex. "renomear por valor" */
  operacao: string;
  /** Extensões aceitas, ex. "PDF" */
  extensoes: string;
  /** Itens encontrados na pasta */
  itens: FlowItem[];
  /** Painel de opções específicas do módulo (aparece na etapa 1) */
  opcoes?: ReactNode;
  /** Pré-visualização customizada (substitui a tabela padrão) */
  previewCustomizado?: ReactNode;
  /** Linhas extras no log final */
  logExtra?: string[];
  /** Unidade contada na confirmação, ex. "arquivos", "grupos", "holerites" */
  unidade?: string;
  /** Contagem elegível customizada (quando a unidade não é 1 por item) */
  elegiveisCustom?: number;
  /** Total encontrado customizado */
  totalCustom?: number;
};

export function ProcessFlow({
  operacao,
  extensoes,
  itens,
  opcoes,
  previewCustomizado,
  logExtra = [],
  unidade = "arquivos",
  elegiveisCustom,
  totalCustom,
}: ProcessFlowProps) {
  const [passo, setPasso] = useState(1);
  const [pasta, setPasta] = useState<string | null>(null);
  const [arrastando, setArrastando] = useState(false);
  const [backupOk, setBackupOk] = useState(false);
  const [confirmacao, setConfirmacao] = useState("");
  const [log, setLog] = useState<string[]>([]);

  const total = totalCustom ?? itens.length;
  const elegiveis = elegiveisCustom ?? itens.filter((i) => i.status !== "erro").length;
  const bloqueados = total - elegiveis;
  const avisos = itens.filter((i) => i.status === "aviso").length;

  function selecionarPasta(caminho = PASTA_PADRAO) {
    setPasta(caminho);
  }

  function gerarLog() {
    const base = new Date();
    const carimbo = (s: number) =>
      new Date(base.getTime() + s * 1000).toLocaleTimeString("pt-BR", { hour12: false });
    const linhas = [
      `[${carimbo(0)}] Início da operação: ${operacao}`,
      `[${carimbo(0)}] Pasta de origem: ${pasta}`,
      `[${carimbo(1)}] Backup criado em: ${pasta}\\_backup_${base.toLocaleDateString("pt-BR").replaceAll("/", "-")}`,
      ...itens
        .filter((i) => i.status !== "erro")
        .map((i, idx) => `[${carimbo(2 + idx)}] OK  ${i.origem}${i.destino ? ` → ${i.destino}` : ""}`),
      ...itens
        .filter((i) => i.status === "erro")
        .map((i, idx) => `[${carimbo(2 + elegiveis + idx)}] ERRO  ${i.origem} — ${i.detalhe ?? "não processado"}`),
      ...logExtra.map((l, idx) => `[${carimbo(3 + total + idx)}] ${l}`),
      `[${carimbo(4 + total)}] Fim da operação.`,
    ];
    setLog(linhas);
  }

  function reiniciar() {
    setPasso(1);
    setPasta(null);
    setBackupOk(false);
    setConfirmacao("");
    setLog([]);
  }

  return (
    <div className="space-y-4">
      <Stepper atual={passo} />

      {passo === 1 ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card titulo="1. Seleção de pasta" descricao={`Somente arquivos ${extensoes} são considerados.`}>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setArrastando(true);
                }}
                onDragLeave={() => setArrastando(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setArrastando(false);
                  selecionarPasta();
                }}
                className={`flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-10 text-center transition-colors ${
                  arrastando ? "border-primary bg-primary/5" : "border-border bg-background"
                }`}
              >
                <UploadCloud className="h-7 w-7 text-primary" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium text-foreground">
                  Arraste uma pasta aqui ou selecione manualmente
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Nenhum arquivo é enviado: este protótipo apenas demonstra o fluxo.
                </p>
                <Button className="mt-4" onClick={() => selecionarPasta()}>
                  <FolderOpen className="h-4 w-4" aria-hidden="true" />
                  Selecionar pasta
                </Button>
              </div>

              {pasta ? (
                <div className="mt-4 rounded-lg border border-border bg-background p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Pasta selecionada</p>
                  <p className="mt-1 break-all font-mono text-sm text-foreground">{pasta}</p>
                  <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-lg border border-border bg-surface p-3">
                      <dt className="text-xs text-muted-foreground">Encontrados</dt>
                      <dd className="text-lg font-semibold text-foreground">{total}</dd>
                    </div>
                    <div className="rounded-lg border border-border bg-surface p-3">
                      <dt className="text-xs text-muted-foreground">Elegíveis</dt>
                      <dd className="text-lg font-semibold text-primary">{elegiveis}</dd>
                    </div>
                    <div className="rounded-lg border border-border bg-surface p-3">
                      <dt className="text-xs text-muted-foreground">Bloqueados</dt>
                      <dd className="text-lg font-semibold text-destructive">{bloqueados}</dd>
                    </div>
                  </dl>
                </div>
              ) : null}
            </Card>
          </div>

          <div className="space-y-4">
            {opcoes ? <Card titulo="Opções da operação">{opcoes}</Card> : null}
            <Button className="w-full" disabled={!pasta} onClick={() => setPasso(2)}>
              Pré-visualizar {elegiveis} {unidade}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      ) : null}

      {passo === 2 ? (
        <Card
          titulo="2. Pré-visualização"
          descricao={`${elegiveis} ${unidade} serão processados · ${avisos} com atenção · ${bloqueados} bloqueados`}
          acoes={
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPasso(1)}>
                Voltar
              </Button>
              <Button disabled={elegiveis === 0} onClick={() => setPasso(3)}>
                Continuar
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          }
        >
          {previewCustomizado ?? <TabelaPreview itens={itens} />}
        </Card>
      ) : null}

      {passo === 3 ? (
        <Card titulo="3. Aviso de backup" descricao="Etapa obrigatória antes de qualquer alteração em disco.">
          <div className="flex gap-3 rounded-lg border border-warning/50 bg-warning/10 p-4">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning-foreground" aria-hidden="true" />
            <div className="text-sm text-foreground">
              <p className="font-semibold">Esta operação altera arquivos de forma permanente.</p>
              <p className="mt-1 text-muted-foreground">
                Uma cópia de segurança será criada automaticamente em{" "}
                <span className="font-mono text-foreground">{pasta}\_backup_08-09-2026</span>. Ainda assim,
                recomenda-se manter um backup próprio dos originais. O protótipo não grava nada.
              </p>
            </div>
          </div>

          <label className="mt-4 flex items-start gap-3 rounded-lg border border-border bg-background p-4 text-sm">
            <Checkbox
              checked={backupOk}
              onCheckedChange={(v) => setBackupOk(v === true)}
              aria-label="Confirmo que possuo backup"
            />
            <span>
              Confirmo que li o aviso e que possuo backup dos arquivos originais desta pasta.
            </span>
          </label>

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPasso(2)}>
              Voltar
            </Button>
            <Button disabled={!backupOk} onClick={() => setPasso(4)}>
              Continuar
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </Card>
      ) : null}

      {passo === 4 ? (
        <Card titulo="4. Confirmação específica por quantidade">
          <p className="text-sm text-foreground">
            Você está prestes a <strong>{operacao}</strong> em{" "}
            <strong>
              {elegiveis} {unidade}
            </strong>
            . Para confirmar, digite o número <strong>{elegiveis}</strong> no campo abaixo.
          </p>
          <div className="mt-4 max-w-xs">
            <Label htmlFor="confirmar-qtd">Quantidade a confirmar</Label>
            <Input
              id="confirmar-qtd"
              inputMode="numeric"
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              placeholder={String(elegiveis)}
              className="mt-1.5"
            />
            {confirmacao && confirmacao.trim() !== String(elegiveis) ? (
              <p className="mt-1.5 text-xs text-destructive">
                O número digitado não corresponde à quantidade de {unidade} elegíveis.
              </p>
            ) : null}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPasso(3)}>
              Voltar
            </Button>
            <Button
              disabled={confirmacao.trim() !== String(elegiveis)}
              onClick={() => {
                gerarLog();
                setPasso(5);
              }}
            >
              Executar operação
            </Button>
          </div>
        </Card>
      ) : null}

      {passo === 5 ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card titulo="5. Log da execução" descricao="Registro com timestamps, gerado em memória.">
              <pre className="max-h-96 overflow-auto rounded-lg border border-border bg-background p-4 font-mono text-xs leading-relaxed text-foreground">
                {log.join("\n")}
              </pre>
            </Card>
          </div>
          <div className="space-y-4">
            <Card titulo="Resumo final">
              <dl className="space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Encontrados</dt>
                  <dd className="font-semibold">{total}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Processados</dt>
                  <dd className="font-semibold text-success">{elegiveis}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Com atenção</dt>
                  <dd className="font-semibold text-warning-foreground">{avisos}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Falhas</dt>
                  <dd className="font-semibold text-destructive">{bloqueados}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-2.5">
                  <dt className="text-muted-foreground">Duração</dt>
                  <dd className="font-semibold">00:00:0{Math.min(9, total)}</dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-col gap-2">
                <Button variant="outline" onClick={() => window.print()}>
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  Exportar log (.txt)
                </Button>
                <Button variant="outline" onClick={reiniciar}>
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Nova operação
                </Button>
              </div>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function TabelaPreview({ itens }: { itens: FlowItem[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="py-2 pr-4 font-medium">
              Arquivo original
            </th>
            <th scope="col" className="py-2 pr-4 font-medium">
              Resultado
            </th>
            <th scope="col" className="py-2 pr-4 font-medium">
              Tamanho
            </th>
            <th scope="col" className="py-2 font-medium">
              Situação
            </th>
          </tr>
        </thead>
        <tbody>
          {itens.map((item) => (
            <tr key={item.id} className="border-b border-border align-top last:border-0">
              <td className="py-3 pr-4 font-mono text-xs">{item.origem}</td>
              <td className="py-3 pr-4">
                {item.destino ? (
                  <span className="font-mono text-xs text-foreground">{item.destino}</span>
                ) : (
                  <span className="text-xs text-muted-foreground">— não será alterado —</span>
                )}
                {item.detalhe ? (
                  <p
                    className={`mt-1.5 flex items-start gap-1.5 text-xs ${
                      item.status === "erro" ? "text-destructive" : "text-muted-foreground"
                    }`}
                  >
                    {item.status === "erro" ? (
                      <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    ) : (
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    )}
                    {item.detalhe}
                  </p>
                ) : null}
              </td>
              <td className="py-3 pr-4 text-xs text-muted-foreground">{item.tamanho}</td>
              <td className="py-3">
                <StatusBadge status={item.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
