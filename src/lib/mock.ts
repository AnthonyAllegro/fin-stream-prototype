export type FlowItem = {
  id: string;
  origem: string;
  destino?: string | undefined;
  tamanho: string;
  paginas?: number | undefined;
  status: "ok" | "erro" | "aviso";
  detalhe?: string | undefined;
};

export const PASTA_PADRAO = "C:\\Financeiro\\2026\\Entradas\\Lote-Setembro";

export const renomearValor: FlowItem[] = [
  {
    id: "1",
    origem: "boleto_0012.pdf",
    destino: "1.482,90 - Boleto - 12-09-2026.pdf",
    tamanho: "142 KB",
    paginas: 1,
    status: "ok",
  },
  {
    id: "2",
    origem: "boleto_0013.pdf",
    destino: "327,45 - Boleto - 12-09-2026.pdf",
    tamanho: "138 KB",
    paginas: 1,
    status: "ok",
  },
  {
    id: "3",
    origem: "nf_energia_setembro.pdf",
    destino: "2.910,00 - Nota Fiscal - 05-09-2026.pdf",
    tamanho: "221 KB",
    paginas: 2,
    status: "ok",
  },
  {
    id: "4",
    origem: "recibo_escaneado_07.pdf",
    tamanho: "1,2 MB",
    paginas: 1,
    status: "erro",
    detalhe:
      "Nenhum valor monetário reconhecido: o arquivo é uma imagem escaneada sem camada de texto (OCR não habilitado nesta versão).",
  },
  {
    id: "5",
    origem: "fatura_cartao_agosto.pdf",
    destino: "8.740,15 - Fatura - 28-08-2026.pdf",
    tamanho: "512 KB",
    paginas: 6,
    status: "aviso",
    detalhe:
      "Três valores encontrados na página 1. Foi usado o maior valor (R$ 8.740,15), identificado como 'Total a pagar'.",
  },
  {
    id: "6",
    origem: "boleto_0014.pdf",
    tamanho: "96 KB",
    paginas: 1,
    status: "erro",
    detalhe:
      "Já existe um arquivo chamado '1.482,90 - Boleto - 12-09-2026.pdf' na pasta de destino. Renomeie manualmente ou ative o sufixo automático.",
  },
];

export const sequenciador: FlowItem[] = [
  { id: "1", origem: "digitalizacao_a.pdf", destino: "001 - digitalizacao_a.pdf", tamanho: "88 KB", status: "ok" },
  { id: "2", origem: "digitalizacao_b.pdf", destino: "002 - digitalizacao_b.pdf", tamanho: "91 KB", status: "ok" },
  { id: "3", origem: "digitalizacao_c.pdf", destino: "003 - digitalizacao_c.pdf", tamanho: "77 KB", status: "ok" },
  {
    id: "4",
    origem: "003 - digitalizacao_d.pdf",
    destino: "004 - digitalizacao_d.pdf",
    tamanho: "120 KB",
    status: "aviso",
    detalhe: "O arquivo já possuía um prefixo numérico. O prefixo antigo será substituído pelo novo.",
  },
  {
    id: "5",
    origem: "digitalizacao_e.pdf",
    tamanho: "0 KB",
    status: "erro",
    detalhe: "Arquivo vazio (0 KB) ou corrompido. Não será renomeado.",
  },
];

export const removerPrefixos: FlowItem[] = [
  { id: "1", origem: "001 - contrato_locacao.pdf", destino: "contrato_locacao.pdf", tamanho: "310 KB", status: "ok" },
  { id: "2", origem: "002 - contrato_servico.pdf", destino: "contrato_servico.pdf", tamanho: "287 KB", status: "ok" },
  { id: "3", origem: "COPIA_relatorio_mensal.pdf", destino: "relatorio_mensal.pdf", tamanho: "155 KB", status: "ok" },
  {
    id: "4",
    origem: "scan_2026_09_08_extrato.pdf",
    destino: "extrato.pdf",
    tamanho: "402 KB",
    status: "aviso",
    detalhe: "Dois padrões de prefixo casaram ('scan_' e a data). Ambos serão removidos.",
  },
  {
    id: "5",
    origem: "001 - .pdf",
    tamanho: "12 KB",
    status: "erro",
    detalhe: "Remover o prefixo deixaria o nome vazio. O arquivo será ignorado.",
  },
];

export const desbloquear: FlowItem[] = [
  { id: "1", origem: "extrato_itau_agosto.pdf", destino: "extrato_itau_agosto.pdf", tamanho: "204 KB", status: "ok", detalhe: "Aberto com a senha 'CNPJ curto' (8 primeiros dígitos)." },
  { id: "2", origem: "extrato_bb_agosto.pdf", destino: "extrato_bb_agosto.pdf", tamanho: "198 KB", status: "ok", detalhe: "Aberto com a senha 'CPF do sócio' (6 primeiros dígitos)." },
  { id: "3", origem: "fatura_nubank_setembro.pdf", destino: "fatura_nubank_setembro.pdf", tamanho: "331 KB", status: "ok", detalhe: "Aberto com a senha da lista: data de nascimento." },
  {
    id: "4",
    origem: "extrato_santander_julho.pdf",
    tamanho: "176 KB",
    status: "erro",
    detalhe: "Nenhuma das 4 senhas da lista abriu o arquivo. Adicione a senha correta e execute novamente.",
  },
  {
    id: "5",
    origem: "boleto_protegido_impressao.pdf",
    destino: "boleto_protegido_impressao.pdf",
    tamanho: "64 KB",
    status: "aviso",
    detalhe: "O arquivo abre sem senha, mas tem restrição de impressão. A restrição será removida.",
  },
];

export const senhasSalvas = [
  { id: "s1", rotulo: "CNPJ curto (8 dígitos)", valor: "••••••••", usos: 34 },
  { id: "s2", rotulo: "CPF do sócio (6 dígitos)", valor: "••••••", usos: 21 },
  { id: "s3", rotulo: "Data de nascimento", valor: "••••••••", usos: 12 },
  { id: "s4", rotulo: "Senha padrão contabilidade", valor: "••••••••••", usos: 5 },
];

export type ArquivoMesclagem = {
  id: string;
  nome: string;
  tipo: "Nota Fiscal" | "Boleto" | "Comprovante" | "Outro";
  paginas: number;
  tamanho: string;
};

export const mesclagemGrupos: {
  id: string;
  fornecedor: string;
  competencia: string;
  arquivos: ArquivoMesclagem[];
  status: "ok" | "erro" | "aviso";
  detalhe?: string | undefined;
}[] = [
  {
    id: "g1",
    fornecedor: "Transportes Vale Verde LTDA",
    competencia: "09/2026",
    status: "ok",
    arquivos: [
      { id: "a1", nome: "NF-e 118420.pdf", tipo: "Nota Fiscal", paginas: 1, tamanho: "88 KB" },
      { id: "a2", nome: "boleto_118420.pdf", tipo: "Boleto", paginas: 1, tamanho: "64 KB" },
      { id: "a3", nome: "comprovante_pix.pdf", tipo: "Comprovante", paginas: 1, tamanho: "40 KB" },
    ],
  },
  {
    id: "g2",
    fornecedor: "Alfa Materiais de Escritório",
    competencia: "09/2026",
    status: "aviso",
    detalhe: "Duas notas fiscais no mesmo grupo. A de menor numeração (NF-e 4471) será a primeira página.",
    arquivos: [
      { id: "b1", nome: "NF-e 4471.pdf", tipo: "Nota Fiscal", paginas: 2, tamanho: "120 KB" },
      { id: "b2", nome: "NF-e 4472.pdf", tipo: "Nota Fiscal", paginas: 1, tamanho: "92 KB" },
      { id: "b3", nome: "boleto_alfa.pdf", tipo: "Boleto", paginas: 1, tamanho: "58 KB" },
    ],
  },
  {
    id: "g3",
    fornecedor: "Consultoria Prisma ME",
    competencia: "08/2026",
    status: "erro",
    detalhe:
      "Nenhuma nota fiscal identificada no grupo. A regra 'NF sempre primeiro' não pode ser aplicada — inclua a NF ou desmarque o grupo.",
    arquivos: [
      { id: "c1", nome: "boleto_prisma_ago.pdf", tipo: "Boleto", paginas: 1, tamanho: "51 KB" },
      { id: "c2", nome: "recibo_prisma.pdf", tipo: "Outro", paginas: 1, tamanho: "33 KB" },
    ],
  },
];

export type Pagina = { id: string; rotulo: string; origem: string; rotacao: number; excluida: boolean };

export const paginasIniciais: Pagina[] = [
  { id: "p1", rotulo: "Página 1", origem: "NF-e 118420", rotacao: 0, excluida: false },
  { id: "p2", rotulo: "Página 2", origem: "Boleto", rotacao: 0, excluida: false },
  { id: "p3", rotulo: "Página 3", origem: "Boleto (verso em branco)", rotacao: 0, excluida: false },
  { id: "p4", rotulo: "Página 4", origem: "Comprovante PIX", rotacao: 90, excluida: false },
  { id: "p5", rotulo: "Página 5", origem: "Canhoto de entrega", rotacao: 180, excluida: false },
  { id: "p6", rotulo: "Página 6", origem: "Anexo contrato", rotacao: 0, excluida: false },
];

export type Holerite = {
  id: string;
  paginas: string;
  colaborador: string;
  matricula: string;
  cpf: string;
  competencia: string;
  liquido: string;
  confianca: number;
  status: "ok" | "erro" | "aviso";
  detalhe?: string | undefined;
};

export const holerites: Holerite[] = [
  { id: "h1", paginas: "1", colaborador: "Ana Carolina Souza", matricula: "0421", cpf: "***.412.880-**", competencia: "08/2026", liquido: "R$ 4.312,77", confianca: 0.99, status: "ok" },
  { id: "h2", paginas: "2", colaborador: "Bruno Ferreira Lima", matricula: "0433", cpf: "***.019.204-**", competencia: "08/2026", liquido: "R$ 3.187,40", confianca: 0.98, status: "ok" },
  { id: "h3", paginas: "3-4", colaborador: "Carla Mendes Ribeiro", matricula: "0448", cpf: "***.771.330-**", competencia: "08/2026", liquido: "R$ 6.905,12", confianca: 0.86, status: "aviso", detalhe: "Holerite ocupa duas páginas (verbas rescisórias). Confirme se o corte está correto." },
  { id: "h4", paginas: "5", colaborador: "Diego Nascimento", matricula: "0450", cpf: "***.556.101-**", competencia: "08/2026", liquido: "R$ 2.740,00", confianca: 0.94, status: "ok" },
  { id: "h5", paginas: "6", colaborador: "(não identificado)", matricula: "—", cpf: "—", competencia: "08/2026", liquido: "—", confianca: 0.41, status: "erro", detalhe: "Nome e matrícula ilegíveis nesta página. Preencha manualmente antes de separar." },
  { id: "h6", paginas: "7", colaborador: "Eduarda Prado Alves", matricula: "0455", cpf: "***.334.909-**", competencia: "08/2026", liquido: "R$ 5.120,33", confianca: 0.97, status: "ok" },
];

export const atividadeRecente = [
  { hora: "08/09/2026 16:31", modulo: "Renomear por valor", resumo: "24 arquivos renomeados, 2 ignorados", status: "ok" as const },
  { hora: "08/09/2026 15:04", modulo: "Desbloquear PDFs", resumo: "11 desbloqueados, 1 senha não encontrada", status: "aviso" as const },
  { hora: "08/09/2026 11:47", modulo: "Mesclar (NF primeiro)", resumo: "7 grupos mesclados", status: "ok" as const },
  { hora: "07/09/2026 18:12", modulo: "Separar holerites", resumo: "63 holerites separados, 3 revisados manualmente", status: "ok" as const },
  { hora: "07/09/2026 09:20", modulo: "Remover prefixos", resumo: "Cancelado pelo usuário na confirmação", status: "erro" as const },
];

export const volumeSemanal = [
  { dia: "Seg", arquivos: 42 },
  { dia: "Ter", arquivos: 65 },
  { dia: "Qua", arquivos: 38 },
  { dia: "Qui", arquivos: 81 },
  { dia: "Sex", arquivos: 57 },
  { dia: "Sáb", arquivos: 12 },
  { dia: "Dom", arquivos: 4 },
];
