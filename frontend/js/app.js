// ==========================================
// Cadastro de Computadores - Inventario de TI
// Complete Rewrite v4.0
// ==========================================
const API = '';
let currentPage = { computadores: 0, manutencoes: 0, ordensServico: 0, logs: 0 };
let allComputadores = [];
let selectedComputadores = new Set();
let USE_MOCK = false;
let _relData = { eq: null, man: null, os: null };
let _dashData = { eq: null, man: null, os: null, alertas: null };
let _activeStatKey = null;
let _activeKpiKey = null;
let _currentSection = 'painel';
let _currentTab = 0;
let _manFilters = { status: '', termo: '', showConcluidas: false };
let _adminData = null;
Chart.defaults.color = '#606070';
Chart.defaults.borderColor = 'rgba(255,255,255,0.04)';
Chart.defaults.font.family = "'Inter', sans-serif";

var MOCK_COMPUTADORES = [
    { id: 1, nomePc: 'PC-ADM-001', numeroSerie: 'SN-2024-001', modeloMarca: 'Dell OptiPlex 7090', processador: 'Intel Core i7-11700', memoriaRam: '16GB DDR4', armazenamento: '512GB SSD NVMe', usuarioDesignado: 'Carlos Silva', fornecedor: 'Dell Tecnologia', status: 'ATIVO', dataCadastro: '2024-01-15T10:00:00' },
    { id: 2, nomePc: 'PC-ADM-002', numeroSerie: 'SN-2024-002', modeloMarca: 'Lenovo ThinkCentre M920', processador: 'Intel Core i5-9500', memoriaRam: '8GB DDR4', armazenamento: '256GB SSD', usuarioDesignado: 'Ana Beatriz', fornecedor: 'Lenovo', status: 'ATIVO', dataCadastro: '2024-02-10T10:00:00' },
    { id: 3, nomePc: 'PC-LOG-001', numeroSerie: 'SN-2024-003', modeloMarca: 'HP ProDesk 400 G7', processador: 'Intel Core i5-10500', memoriaRam: '8GB DDR4', armazenamento: '256GB SSD', usuarioDesignado: 'Roberto Souza', fornecedor: 'HP Brasil', status: 'MANUTENCAO_PREVENTIVA', dataCadastro: '2024-01-20T10:00:00' },
    { id: 4, nomePc: 'PC-LOG-002', numeroSerie: 'SN-2024-004', modeloMarca: 'Dell Vostro 3681', processador: 'Intel Core i3-10100', memoriaRam: '4GB DDR4', armazenamento: '1TB HDD', usuarioDesignado: 'Maria Oliveira', fornecedor: 'Dell Tecnologia', status: 'MANUTENCAO_EMERGENCIAL', dataCadastro: '2024-03-05T10:00:00' },
    { id: 5, nomePc: 'PC-TI-001', numeroSerie: 'SN-2024-005', modeloMarca: 'Lenovo ThinkPad T490', processador: 'Intel Core i7-8565U', memoriaRam: '16GB DDR4', armazenamento: '512GB SSD', usuarioDesignado: 'Joao Pedro', fornecedor: 'Lenovo', status: 'ATIVO', dataCadastro: '2024-01-10T10:00:00' },
    { id: 6, nomePc: 'PC-FIN-001', numeroSerie: 'SN-2024-006', modeloMarca: 'HP EliteDesk 800 G6', processador: 'Intel Core i5-10500T', memoriaRam: '8GB DDR4', armazenamento: '256GB SSD', usuarioDesignado: 'Fernanda Lima', fornecedor: 'HP Brasil', status: 'ATIVO', dataCadastro: '2024-02-15T10:00:00' },
    { id: 7, nomePc: 'PC-FIN-002', numeroSerie: 'SN-2024-007', modeloMarca: 'Dell OptiPlex 3080', processador: 'Intel Core i3-10100', memoriaRam: '4GB DDR4', armazenamento: '500GB HDD', usuarioDesignado: 'Pedro Henrique', fornecedor: 'Dell Tecnologia', status: 'MANUTENCAO_PREDITIVA', dataCadastro: '2024-03-01T10:00:00' },
    { id: 8, nomePc: 'PC-RH-001', numeroSerie: 'SN-2024-008', modeloMarca: 'Acer Veriton M4660G', processador: 'Intel Core i5-9400', memoriaRam: '8GB DDR4', armazenamento: '256GB SSD', usuarioDesignado: 'Juliana Costa', fornecedor: 'Acer', status: 'ATIVO', dataCadastro: '2024-01-25T10:00:00' },
    { id: 9, nomePc: 'PC-VEN-001', numeroSerie: 'SN-2024-009', modeloMarca: 'Lenovo IdeaCentre 520', processador: 'AMD Ryzen 5 3500', memoriaRam: '8GB DDR4', armazenamento: '1TB HDD', usuarioDesignado: 'Lucas Almeida', fornecedor: 'Lenovo', status: 'CONCLUIDO', dataCadastro: '2024-02-20T10:00:00' },
    { id: 10, nomePc: 'PC-VEN-002', numeroSerie: 'SN-2024-010', modeloMarca: 'HP ProOne 440 G6', processador: 'Intel Core i5-9500T', memoriaRam: '8GB DDR4', armazenamento: '256GB SSD', usuarioDesignado: 'Mariana Santos', fornecedor: 'HP Brasil', status: 'ATIVO', dataCadastro: '2024-03-10T10:00:00' },
    { id: 11, nomePc: 'PC-PRD-001', numeroSerie: 'SN-2024-011', modeloMarca: 'Dell Precision 3430', processador: 'Intel Core i7-8700', memoriaRam: '32GB DDR4', armazenamento: '1TB SSD', usuarioDesignado: 'Tecnico A', fornecedor: 'Dell Tecnologia', status: 'ATIVO', dataCadastro: '2024-01-05T10:00:00' },
    { id: 12, nomePc: 'PC-PRD-002', numeroSerie: 'SN-2024-012', modeloMarca: 'Lenovo ThinkStation P330', processador: 'Intel Core i9-9900', memoriaRam: '64GB DDR4', armazenamento: '2TB SSD', usuarioDesignado: 'Tecnico B', fornecedor: 'Lenovo', status: 'ATIVO', dataCadastro: '2024-02-01T10:00:00' },
    { id: 13, nomePc: 'PC-PRD-003', numeroSerie: 'SN-2024-013', modeloMarca: 'HP Z2 Tower G4', processador: 'Intel Core i7-9700', memoriaRam: '16GB DDR4', armazenamento: '512GB SSD', usuarioDesignado: 'Tecnico C', fornecedor: 'HP Brasil', status: 'MANUTENCAO_PREVENTIVA', dataCadastro: '2024-03-15T10:00:00' },
    { id: 14, nomePc: 'PC-ADM-003', numeroSerie: 'SN-2024-014', modeloMarca: 'Dell Latitude 5520', processador: 'Intel Core i5-1135G7', memoriaRam: '8GB DDR4', armazenamento: '256GB SSD', usuarioDesignado: 'Gerente TI', fornecedor: 'Dell Tecnologia', status: 'ATIVO', dataCadastro: '2024-01-18T10:00:00' },
    { id: 15, nomePc: 'PC-ALM-001', numeroSerie: 'SN-2024-015', modeloMarca: 'Acer Aspire TC-885', processador: 'Intel Core i3-9100', memoriaRam: '4GB DDR4', armazenamento: '1TB HDD', usuarioDesignado: 'Auxiliar Almox', fornecedor: 'Acer', status: 'MANUTENCAO_EMERGENCIAL', dataCadastro: '2024-02-28T10:00:00' },
    { id: 16, nomePc: 'PC-ADM-004', numeroSerie: 'SN-2024-016', modeloMarca: 'Lenovo ThinkCentre M70s', processador: 'Intel Core i5-11400', memoriaRam: '16GB DDR4', armazenamento: '512GB SSD', usuarioDesignado: 'Assistente Adm', fornecedor: 'Lenovo', status: 'ATIVO', dataCadastro: '2024-03-20T10:00:00' },
    { id: 17, nomePc: 'PC-LOG-003', numeroSerie: 'SN-2024-017', modeloMarca: 'HP ProDesk 600 G6', processador: 'Intel Core i7-10700', memoriaRam: '16GB DDR4', armazenamento: '512GB SSD', usuarioDesignado: 'Supervisor Log', fornecedor: 'HP Brasil', status: 'CONCLUIDO', dataCadastro: '2024-01-22T10:00:00' },
    { id: 18, nomePc: 'PC-FIN-003', numeroSerie: 'SN-2024-018', modeloMarca: 'Dell OptiPlex 5090', processador: 'Intel Core i5-11500', memoriaRam: '8GB DDR4', armazenamento: '256GB SSD', usuarioDesignado: 'Analista Fin', fornecedor: 'Dell Tecnologia', status: 'ATIVO', dataCadastro: '2024-02-12T10:00:00' },
    { id: 19, nomePc: 'PC-VEN-003', numeroSerie: 'SN-2024-019', modeloMarca: 'Lenovo ThinkCentre M920t', processador: 'Intel Core i5-9500', memoriaRam: '8GB DDR4', armazenamento: '256GB SSD', usuarioDesignado: 'Consultor Vendas', fornecedor: 'Lenovo', status: 'ATIVO', dataCadastro: '2024-03-08T10:00:00' },
    { id: 20, nomePc: 'PC-TI-002', numeroSerie: 'SN-2024-020', modeloMarca: 'Dell XPS 8940', processador: 'Intel Core i9-11900', memoriaRam: '32GB DDR4', armazenamento: '1TB SSD NVMe', usuarioDesignado: 'Dev Senior', fornecedor: 'Dell Tecnologia', status: 'ATIVO', dataCadastro: '2024-01-08T10:00:00' }
];

var MOCK_MANUTENCOES = [
    { id: 1, computadorId: 3, computadorNome: 'PC-LOG-001', tipo: 'PREVENTIVA', status: 'EM_ANDAMENTO', descricao: 'Troca de pasta termica e limpeza geral', tecnicoResponsavel: 'Carlos Mendes', custo: 150.00, pecasTrocadas: 'Pasta termica Artic MX-5', observacoes: 'Agendado para manha', dataCadastro: '2024-06-10T08:00:00', dataConclusao: null },
    { id: 2, computadorId: 4, computadorNome: 'PC-LOG-002', tipo: 'EMERGENCIAL', status: 'PENDENTE', descricao: 'PC nao liga. Verificar fonte e placa mae', tecnicoResponsavel: 'Roberto Alves', custo: null, pecasTrocadas: '', observacoes: 'Prioridade alta', dataCadastro: '2024-06-12T14:30:00', dataConclusao: null },
    { id: 3, computadorId: 7, computadorNome: 'PC-FIN-002', tipo: 'PREDITIVA', status: 'CONCLUIDA', descricao: 'Atualizacao de firmware SSD', tecnicoResponsavel: 'Carlos Mendes', custo: 0, pecasTrocadas: 'Nenhuma', observacoes: 'Disco com 87% de saude', dataCadastro: '2024-05-20T09:00:00', dataConclusao: '2024-05-20T11:30:00' },
    { id: 4, computadorId: 13, computadorNome: 'PC-PRD-003', tipo: 'PREVENTIVA', status: 'PENDENTE', descricao: 'Limpeza preventiva trimestral', tecnicoResponsavel: 'Maria Ferreira', custo: 80.00, pecasTrocadas: 'Filtro de po', observacoes: 'Equipamento de producao', dataCadastro: '2024-06-01T07:00:00', dataConclusao: null },
    { id: 5, computadorId: 15, computadorNome: 'PC-ALM-001', tipo: 'CORRETIVA', status: 'EM_ANDAMENTO', descricao: 'Substituicao de HD danificado por SSD', tecnicoResponsavel: 'Roberto Alves', custo: 320.00, pecasTrocadas: 'SSD Kingston A400 240GB', observacoes: 'Backup realizado', dataCadastro: '2024-06-08T10:00:00', dataConclusao: null },
    { id: 6, computadorId: 1, computadorNome: 'PC-ADM-001', tipo: 'PREVENTIVA', status: 'CONCLUIDA', descricao: 'Atualizacao de BIOS', tecnicoResponsavel: 'Carlos Mendes', custo: 0, pecasTrocadas: 'Nenhuma', observacoes: 'BIOS atualizada v1.3 para v1.5', dataCadastro: '2024-05-15T14:00:00', dataConclusao: '2024-05-15T15:00:00' },
    { id: 7, computadorId: 2, computadorNome: 'PC-ADM-002', tipo: 'CORRETIVA', status: 'CANCELADA', descricao: 'Substituicao de teclado', tecnicoResponsavel: 'Maria Ferreira', custo: 89.90, pecasTrocadas: 'Teclado USB ABNT2', observacoes: 'Cancelado', dataCadastro: '2024-05-10T11:00:00', dataConclusao: null },
    { id: 8, computadorId: 9, computadorNome: 'PC-VEN-001', tipo: 'EMERGENCIAL', status: 'CONCLUIDA', descricao: 'Remocao de malware e formatacao', tecnicoResponsavel: 'Roberto Alves', custo: 0, pecasTrocadas: 'Nenhuma', observacoes: 'Sistema reinstalado com Windows 11 Pro', dataCadastro: '2024-05-25T08:30:00', dataConclusao: '2024-05-26T17:00:00' },
    { id: 9, computadorId: 5, computadorNome: 'PC-TI-001', tipo: 'PREDITIVA', status: 'EM_ANDAMENTO', descricao: 'Teste de estresse na memoria RAM', tecnicoResponsavel: 'Carlos Mendes', custo: 0, pecasTrocadas: '', observacoes: 'Rodando MemTest86 por 4 horas', dataCadastro: '2024-06-11T09:00:00', dataConclusao: null },
    { id: 10, computadorId: 6, computadorNome: 'PC-FIN-001', tipo: 'PREVENTIVA', status: 'PENDENTE', descricao: 'Instalacao de updates acumulados', tecnicoResponsavel: 'Maria Ferreira', custo: 0, pecasTrocadas: 'Nenhuma', observacoes: 'Agendar para horario de almoco', dataCadastro: '2024-06-13T08:00:00', dataConclusao: null },
    { id: 11, computadorId: 10, computadorNome: 'PC-VEN-002', tipo: 'CORRETIVA', status: 'CONCLUIDA', descricao: 'Reparo no ventilador cooling', tecnicoResponsavel: 'Roberto Alves', custo: 120.00, pecasTrocadas: 'Cooler fan 80mm', observacoes: 'Equipamento operando normalmente', dataCadastro: '2024-05-18T13:00:00', dataConclusao: '2024-05-18T15:30:00' },
    { id: 12, computadorId: 8, computadorNome: 'PC-RH-001', tipo: 'PREDITIVA', status: 'CONCLUIDA', descricao: 'Otimizacao do Windows e desfragmentacao do SSD', tecnicoResponsavel: 'Carlos Mendes', custo: 0, pecasTrocadas: 'Nenhuma', observacoes: 'Boot reduzido de 45s para 18s', dataCadastro: '2024-05-22T16:00:00', dataConclusao: '2024-05-22T18:00:00' }
];

var MOCK_ORDENS = [
    { id: 1, titulo: 'Instalar software de controle de acesso', descricao: 'Instalar BioAccess v3.0 nos PCs da recepcao.', computadorId: 2, computadorNome: 'PC-ADM-002', prioridade: 'ALTA', status: 'EM_EXECUCAO', solicitante: 'Gerencia de TI', tecnicoResponsavel: 'Joao Pedro', dataAbertura: '2024-06-10T09:00:00', dataPrevisao: '2024-06-20T17:00:00', dataConclusao: null, solucao: null },
    { id: 2, titulo: 'Migracao de dados para novo servidor', descricao: 'Transferir dados para novo storage NAS.', computadorId: null, computadorNome: '-', prioridade: 'CRITICA', status: 'EM_ANALISE', solicitante: 'Diretor de TI', tecnicoResponsavel: 'Joao Pedro', dataAbertura: '2024-06-08T14:00:00', dataPrevisao: '2024-06-25T17:00:00', dataConclusao: null, solucao: null },
    { id: 3, titulo: 'Substituir monitor com dead pixels', descricao: 'Monitor do PC-ADM-001 com dead pixels.', computadorId: 1, computadorNome: 'PC-ADM-001', prioridade: 'BAIXA', status: 'ABERTA', solicitante: 'Carlos Silva', tecnicoResponsavel: '', dataAbertura: '2024-06-12T10:00:00', dataPrevisao: '2024-06-30T17:00:00', dataConclusao: null, solucao: null },
    { id: 4, titulo: 'Configuracao de impressora em rede', descricao: 'Configurar HP LaserJet Pro M404dn.', computadorId: 6, computadorNome: 'PC-FIN-001', prioridade: 'MEDIA', status: 'CONCLUIDA', solicitante: 'Fernanda Lima', tecnicoResponsavel: 'Roberto Alves', dataAbertura: '2024-06-01T08:00:00', dataPrevisao: '2024-06-05T17:00:00', dataConclusao: '2024-06-03T16:00:00', solucao: 'Impressora configurada com IP estatico.' },
    { id: 5, titulo: 'Atualizar BIOS de todos PCs Dell', descricao: 'Verificar e atualizar BIOS de equipamentos Dell.', computadorId: null, computadorNome: '-', prioridade: 'MEDIA', status: 'ABERTA', solicitante: 'Carlos Mendes', tecnicoResponsavel: '', dataAbertura: '2024-06-11T11:00:00', dataPrevisao: '2024-07-15T17:00:00', dataConclusao: null, solucao: null },
    { id: 6, titulo: 'Corrigir falha de rede no PC-LOG-002', descricao: 'PC com desconexoes frequentes da rede.', computadorId: 4, computadorNome: 'PC-LOG-002', prioridade: 'ALTA', status: 'EM_EXECUCAO', solicitante: 'Maria Oliveira', tecnicoResponsavel: 'Carlos Mendes', dataAbertura: '2024-06-09T08:30:00', dataPrevisao: '2024-06-15T17:00:00', dataConclusao: null, solucao: null },
    { id: 7, titulo: 'Instalar antiviruses nos novos PCs', descricao: 'Instalar Kaspersky nos 5 novos PCs.', computadorId: 15, computadorNome: 'PC-ALM-001', prioridade: 'ALTA', status: 'ABERTA', solicitante: 'Auxiliar Almox', tecnicoResponsavel: '', dataAbertura: '2024-06-13T09:00:00', dataPrevisao: '2024-06-18T17:00:00', dataConclusao: null, solucao: null },
    { id: 8, titulo: 'Migrar Windows 10 para Windows 11', descricao: 'Atualizar OS de 3 PCs elegiveis.', computadorId: 14, computadorNome: 'PC-ADM-003', prioridade: 'BAIXA', status: 'CANCELADA', solicitante: 'Gerente TI', tecnicoResponsavel: 'Maria Ferreira', dataAbertura: '2024-05-20T10:00:00', dataPrevisao: '2024-06-10T17:00:00', dataConclusao: null, solucao: 'Cancelado - PCs nao atendem TPM 2.0.' },
    { id: 9, titulo: 'Configurar VPN corporativa', descricao: 'Configurar VPN no PC-TI-001.', computadorId: 5, computadorNome: 'PC-TI-001', prioridade: 'CRITICA', status: 'CONCLUIDA', solicitante: 'Joao Pedro', tecnicoResponsavel: 'Joao Pedro', dataAbertura: '2024-06-05T14:00:00', dataPrevisao: '2024-06-07T17:00:00', dataConclusao: '2024-06-06T11:30:00', solucao: 'VPN configurada com WireGuard.' },
    { id: 10, titulo: 'Limpeza geral dos equipamentos', descricao: 'Limpeza preventiva em todos PCs do estoque.', computadorId: null, computadorNome: '-', prioridade: 'MEDIA', status: 'EM_ANALISE', solicitante: 'Supervisor Log', tecnicoResponsavel: '', dataAbertura: '2024-06-12T08:00:00', dataPrevisao: '2024-06-22T17:00:00', dataConclusao: null, solucao: null }
];

var MOCK_USUARIOS = [
    { id: 1, nomeCompleto: 'Administrador', username: 'admin', email: 'admin@empresa.com', perfil: 'ADMIN', ativo: true, dataCadastro: '2024-01-01T00:00:00' },
    { id: 2, nomeCompleto: 'Carlos Silva', username: 'carlos', email: 'carlos@empresa.com', perfil: 'USUARIO', ativo: true, dataCadastro: '2024-01-10T08:00:00' },
    { id: 3, nomeCompleto: 'Ana Beatriz', username: 'ana', email: 'ana@empresa.com', perfil: 'USUARIO', ativo: true, dataCadastro: '2024-01-10T08:00:00' },
    { id: 4, nomeCompleto: 'Carlos Mendes', username: 'carlos.mendes', email: 'carlos.mendes@empresa.com', perfil: 'TECNICO', ativo: true, dataCadastro: '2024-01-15T08:00:00' },
    { id: 5, nomeCompleto: 'Roberto Alves', username: 'roberto', email: 'roberto@empresa.com', perfil: 'TECNICO', ativo: true, dataCadastro: '2024-01-15T08:00:00' },
    { id: 6, nomeCompleto: 'Maria Ferreira', username: 'maria', email: 'maria@empresa.com', perfil: 'TECNICO', ativo: true, dataCadastro: '2024-01-20T08:00:00' },
    { id: 7, nomeCompleto: 'Joao Pedro', username: 'joao.pedro', email: 'joao.pedro@empresa.com', perfil: 'ADMIN', ativo: true, dataCadastro: '2024-01-10T08:00:00' },
    { id: 8, nomeCompleto: 'Fernanda Lima', username: 'fernanda', email: 'fernanda@empresa.com', perfil: 'USUARIO', ativo: true, dataCadastro: '2024-02-01T08:00:00' },
    { id: 9, nomeCompleto: 'Roberto Souza', username: 'roberto.souza', email: 'roberto.souza@empresa.com', perfil: 'USUARIO', ativo: false, dataCadastro: '2024-02-05T08:00:00' }
];

var MOCK_DEPARTAMENTOS = [
    { id: 1, nome: 'TI', totalComputadores: 12 },
    { id: 2, nome: 'Financeiro', totalComputadores: 5 },
    { id: 3, nome: 'RH', totalComputadores: 3 },
    { id: 4, nome: 'Marketing', totalComputadores: 4 },
    { id: 5, nome: 'Operacoes', totalComputadores: 6 }
];

var MOCK_LOGS = [
    { id: 1, usuario: 'admin', acao: 'LOGIN', entidade: 'USUARIO', entidadeId: null, descricao: 'Login realizado com sucesso', dataAtividade: '2024-06-15T10:30:00', ipAddress: '192.168.1.100' },
    { id: 2, usuario: 'admin', acao: 'CRIACAO', entidade: 'COMPUTADOR', entidadeId: 1, descricao: 'Computador PC-ADM-001 cadastrado', dataAtividade: '2024-06-10T09:00:00', ipAddress: '192.168.1.100' },
    { id: 4, usuario: 'admin', acao: 'ALTERACAO', entidade: 'COMPUTADOR', entidadeId: 5, descricao: 'Atualizado status de PC-TI-001 para MANUTENCAO_PREDITIVA', dataAtividade: '2024-06-11T16:00:00', ipAddress: '192.168.1.100' }
];

// ==========================================
// MOCK FUNCTIONS
// ==========================================
function mockAuth(user, pass) {
    var creds = { admin: { senha: 'admin123', perfil: 'ADMIN', nome: 'Administrador' }, carlos: { senha: '123456', perfil: 'USUARIO', nome: 'Carlos Silva' }, ana: { senha: '123456', perfil: 'USUARIO', nome: 'Ana Beatriz' }, 'carlos.mendes': { senha: '123456', perfil: 'TECNICO', nome: 'Carlos Mendes' }, roberto: { senha: '123456', perfil: 'TECNICO', nome: 'Roberto Alves' }, maria: { senha: '123456', perfil: 'TECNICO', nome: 'Maria Ferreira' }, 'joao.pedro': { senha: '123456', perfil: 'ADMIN', nome: 'Joao Pedro' }, fernanda: { senha: '123456', perfil: 'USUARIO', nome: 'Fernanda Lima' } };
    var c = creds[user];
    if (!c || c.senha !== pass) return null;
    return { token: 'mock-token-' + user + '-' + Date.now(), username: user, nomeCompleto: c.nome, perfil: c.perfil, expiresIn: 1800000 };
}

function syncManutencaoWithComputador(computadorId, manutStatus, manutTipo) {
    var comp = MOCK_COMPUTADORES.find(function(c) { return c.id === computadorId; });
    if (!comp) return;
    var statusMap = {
        'PENDENTE': manutTipo === 'EMERGENCIAL' ? 'MANUTENCAO_EMERGENCIAL' : manutTipo === 'PREDITIVA' ? 'MANUTENCAO_PREDITIVA' : 'MANUTENCAO_PREVENTIVA',
        'EM_ANDAMENTO': manutTipo === 'EMERGENCIAL' ? 'MANUTENCAO_EMERGENCIAL' : manutTipo === 'PREDITIVA' ? 'MANUTENCAO_PREDITIVA' : 'MANUTENCAO_PREVENTIVA',
        'CONCLUIDA': 'CONCLUIDO',
        'CANCELADA': 'ATIVO'
    };
    var hasActiveMaint = MOCK_MANUTENCOES.some(function(m) {
        return m.computadorId === computadorId && m.id !== undefined && m.status !== 'CONCLUIDA' && m.status !== 'CANCELADA';
    });
    if (manutStatus === 'CONCLUIDA' || manutStatus === 'CANCELADA') {
        if (!hasActiveMaint) comp.status = 'ATIVO';
    } else {
        comp.status = statusMap[manutStatus] || 'MANUTENCAO_PREVENTIVA';
    }
}

function mockFetch(url, opts) {
    opts = opts || {};
    var method = (opts.method || 'GET').toUpperCase();
    var body = opts.body ? JSON.parse(opts.body) : {};

    if (url.indexOf('/api/auth/login') !== -1) return mockAuth(body.username, body.senha);
    if (url.indexOf('/api/auth/me') !== -1) return { username: localStorage.getItem('userName') || 'admin', nomeCompleto: localStorage.getItem('userName') || 'Administrador', perfil: getPerfil() };
    if (url.indexOf('/api/historico/') !== -1) return [];
    if (url.indexOf('/api/computadores/alertas') !== -1) return { garantiaVencida: [], garantiaProxima: [], totalAlertas: 0 };

    if (url.indexOf('/api/departamentos') !== -1) {
        if (method === 'GET' && url.indexOf('/api/departamentos/') === -1) return MOCK_DEPARTAMENTOS;
        if (url.indexOf('/api/departamentos/') !== -1 && method === 'GET') {
            var dId = parseInt(url.split('/api/departamentos/')[1].split('?')[0]);
            return MOCK_DEPARTAMENTOS.find(function(d) { return d.id === dId; }) || null;
        }
        if (method === 'POST') {
            var dNewId = Math.max.apply(null, MOCK_DEPARTAMENTOS.map(function(d) { return d.id; })) + 1;
            body.id = dNewId; body.totalComputadores = 0;
            MOCK_DEPARTAMENTOS.push(body);
            return body;
        }
        if (url.indexOf('/api/departamentos/') !== -1 && method === 'DELETE') {
            MOCK_DEPARTAMENTOS = MOCK_DEPARTAMENTOS.filter(function(d) { return d.id !== parseInt(url.split('/api/departamentos/')[1]); });
            return {};
        }
    }

    if (url.indexOf('/api/logs') !== -1) {
        if (url.indexOf('/api/logs/recentes') !== -1) return MOCK_LOGS.slice(0, parseInt(new URLSearchParams(url.split('?')[1] || '').get('limit') || '10'));
        if (method === 'GET' && url.indexOf('/api/logs/') === -1) {
            var psL = new URLSearchParams(url.split('?')[1] || '');
            var lUsuarioF = psL.get('usuario') || '';
            var lEntidadeF = psL.get('entidade') || '';
            var lPage = parseInt(psL.get('page')) || 0;
            var lSize = parseInt(psL.get('size')) || 10;
            var lFiltered = MOCK_LOGS.filter(function(l) {
                if (lUsuarioF && l.usuario.toLowerCase().indexOf(lUsuarioF.toLowerCase()) === -1) return false;
                if (lEntidadeF && l.entidade !== lEntidadeF) return false;
                return true;
            });
            var lStart = lPage * lSize;
            return { content: lFiltered.slice(lStart, lStart + lSize), totalElements: lFiltered.length, totalPages: Math.ceil(lFiltered.length / lSize), number: lPage, size: lSize };
        }
    }

    if (url.indexOf('/api/computadores/export/csv') !== -1 && method === 'GET') return { message: 'CSV export simulated', count: MOCK_COMPUTADORES.length };
    if (url.indexOf('/api/computadores/import/csv') !== -1 && method === 'POST') return { importados: MOCK_COMPUTADORES.length, ignorados: 0, erros: 0 };

    if (url.indexOf('/api/computadores/estatisticas') !== -1) {
        var ativos = MOCK_COMPUTADORES.filter(function(c) { return c.status === 'ATIVO'; }).length;
        var pred = MOCK_COMPUTADORES.filter(function(c) { return c.status === 'MANUTENCAO_PREDITIVA'; }).length;
        var prev = MOCK_COMPUTADORES.filter(function(c) { return c.status === 'MANUTENCAO_PREVENTIVA'; }).length;
        var emerg = MOCK_COMPUTADORES.filter(function(c) { return c.status === 'MANUTENCAO_EMERGENCIAL'; }).length;
        var concl = MOCK_COMPUTADORES.filter(function(c) { return c.status === 'CONCLUIDO'; }).length;
        return { total: MOCK_COMPUTADORES.length, ativos: ativos, manutencaoPreditiva: pred, manutencaoPreventiva: prev, manutencaoEmergencial: emerg, concluidos: concl, manutencaoVencida: 2, porStatus: { ATIVO: ativos, MANUTENCAO_PREDITIVA: pred, MANUTENCAO_PREVENTIVA: prev, MANUTENCAO_EMERGENCIAL: emerg, CONCLUIDO: concl } };
    }

    if (url.indexOf('/api/manutencoes/estatisticas') !== -1) {
        var pend = MOCK_MANUTENCOES.filter(function(m) { return m.status === 'PENDENTE'; }).length;
        var andam = MOCK_MANUTENCOES.filter(function(m) { return m.status === 'EM_ANDAMENTO'; }).length;
        var conc = MOCK_MANUTENCOES.filter(function(m) { return m.status === 'CONCLUIDA'; }).length;
        return { total: MOCK_MANUTENCOES.length, pendentes: pend, emAndamento: andam, concluidas: conc, canceladas: MOCK_MANUTENCOES.length - pend - andam - conc, porTipo: { CORRETIVA: 3, PREVENTIVA: 4, PREDITIVA: 3, EMERGENCIAL: 2 } };
    }

    if (url.indexOf('/api/ordens-servico/estatisticas') !== -1) {
        var ab = MOCK_ORDENS.filter(function(o) { return o.status === 'ABERTA'; }).length;
        var ea = MOCK_ORDENS.filter(function(o) { return o.status === 'EM_ANALISE'; }).length;
        var ee = MOCK_ORDENS.filter(function(o) { return o.status === 'EM_EXECUCAO'; }).length;
        var co = MOCK_ORDENS.filter(function(o) { return o.status === 'CONCLUIDA'; }).length;
        return { total: MOCK_ORDENS.length, abertas: ab, emAnalise: ea, emExecucao: ee, concluidas: co, canceladas: MOCK_ORDENS.length - ab - ea - ee - co, porPrioridade: { BAIXA: 2, MEDIA: 3, ALTA: 3, CRITICA: 2 } };
    }

    if (url.indexOf('/api/computadores/paginado') !== -1) {
        var ps = new URLSearchParams(url.split('?')[1] || '');
        var termo = (ps.get('termo') || '').toLowerCase();
        var statusF = ps.get('status') || '';
        var page = parseInt(ps.get('page')) || 0;
        var size = parseInt(ps.get('size')) || 12;
        var filtered = MOCK_COMPUTADORES.filter(function(c) {
            if (statusF && c.status !== statusF) return false;
            if (termo && (c.nomePc.toLowerCase().indexOf(termo) === -1 && c.modeloMarca.toLowerCase().indexOf(termo) === -1 && c.usuarioDesignado.toLowerCase().indexOf(termo) === -1 && c.numeroSerie.toLowerCase().indexOf(termo) === -1)) return false;
            return true;
        });
        var start = page * size;
        return { content: filtered.slice(start, start + size), totalElements: filtered.length, totalPages: Math.ceil(filtered.length / size), number: page, size: size };
    }

    if (url.indexOf('/api/computadores/') !== -1 && method === 'GET') {
        return MOCK_COMPUTADORES.find(function(c) { return c.id === parseInt(url.split('/api/computadores/')[1]); }) || null;
    }
    if (url.indexOf('/api/computadores') !== -1 && method === 'POST') {
        body.id = Math.max.apply(null, MOCK_COMPUTADORES.map(function(c) { return c.id; })) + 1;
        body.dataCadastro = new Date().toISOString();
        MOCK_COMPUTADORES.push(body);
        return body;
    }
    if (url.indexOf('/api/computadores/') !== -1 && method === 'PUT') {
        var uid = parseInt(url.split('/api/computadores/')[1]);
        var idx = MOCK_COMPUTADORES.findIndex(function(c) { return c.id === uid; });
        if (idx !== -1) { Object.assign(MOCK_COMPUTADORES[idx], body); return MOCK_COMPUTADORES[idx]; }
        return null;
    }
    if (url.indexOf('/api/computadores/') !== -1 && method === 'DELETE') {
        MOCK_COMPUTADORES = MOCK_COMPUTADORES.filter(function(c) { return c.id !== parseInt(url.split('/api/computadores/')[1]); });
        return {};
    }

    if (url.indexOf('/api/manutencoes') !== -1 && url.indexOf('estatisticas') === -1) {
        var ps2 = new URLSearchParams(url.split('?')[1] || '');
        var stF = ps2.get('status') || '';
        var pg = parseInt(ps2.get('page')) || 0;
        var sz = parseInt(ps2.get('size')) || 10;
        if (method === 'GET' && url.indexOf('/api/manutencoes/') === -1) {
            var mf = MOCK_MANUTENCOES.filter(function(m) { return !stF || m.status === stF; });
            var ms = pg * sz;
            return { content: mf.slice(ms, ms + sz), totalElements: mf.length, totalPages: Math.ceil(mf.length / sz), number: pg, size: sz };
        }
        if (url.indexOf('/api/manutencoes/') !== -1 && method === 'GET') {
            return MOCK_MANUTENCOES.find(function(m) { return m.id === parseInt(url.split('/api/manutencoes/')[1]); }) || null;
        }
        if (method === 'POST') {
            body.id = Math.max.apply(null, MOCK_MANUTENCOES.map(function(m) { return m.id; })) + 1;
            var comp = MOCK_COMPUTADORES.find(function(c) { return c.id === body.computadorId; });
            body.computadorNome = comp ? comp.nomePc : '-'; body.dataCadastro = new Date().toISOString(); body.dataConclusao = null;
            MOCK_MANUTENCOES.push(body);
            syncManutencaoWithComputador(body.computadorId, body.status, body.tipo);
            return body;
        }
        if (url.indexOf('/api/manutencoes/') !== -1 && method === 'PUT') {
            var muId = parseInt(url.split('/api/manutencoes/')[1]);
            var mi = MOCK_MANUTENCOES.findIndex(function(m) { return m.id === muId; });
            if (mi !== -1) {
                var prevStatus = MOCK_MANUTENCOES[mi].status;
                Object.assign(MOCK_MANUTENCOES[mi], body);
                if (body.status && body.status !== prevStatus) {
                    syncManutencaoWithComputador(MOCK_MANUTENCOES[mi].computadorId, body.status, MOCK_MANUTENCOES[mi].tipo);
                    if (body.status === 'CONCLUIDA') MOCK_MANUTENCOES[mi].dataConclusao = new Date().toISOString();
                }
                return MOCK_MANUTENCOES[mi];
            }
            return null;
        }
        if (url.indexOf('/api/manutencoes/') !== -1 && method === 'DELETE') {
            MOCK_MANUTENCOES = MOCK_MANUTENCOES.filter(function(m) { return m.id !== parseInt(url.split('/api/manutencoes/')[1]); });
            return {};
        }
    }

    if (url.indexOf('/api/ordens-servico') !== -1) {
        var ps3 = new URLSearchParams(url.split('?')[1] || '');
        var stF3 = ps3.get('status') || '';
        var prF = ps3.get('prioridade') || '';
        var pg3 = parseInt(ps3.get('page')) || 0;
        var sz3 = parseInt(ps3.get('size')) || 10;
        if (method === 'GET' && url.indexOf('/api/ordens-servico/') === -1) {
            var of3 = MOCK_ORDENS.filter(function(o) { return (!stF3 || o.status === stF3) && (!prF || o.prioridade === prF); });
            var os3 = pg3 * sz3;
            return { content: of3.slice(os3, os3 + sz3), totalElements: of3.length, totalPages: Math.ceil(of3.length / sz3), number: pg3, size: sz3 };
        }
        if (url.indexOf('/api/ordens-servico/') !== -1 && method === 'GET') {
            return MOCK_ORDENS.find(function(o) { return o.id === parseInt(url.split('/api/ordens-servico/')[1]); }) || null;
        }
        if (method === 'POST') {
            body.id = Math.max.apply(null, MOCK_ORDENS.map(function(o) { return o.id; })) + 1;
            var comp2 = MOCK_COMPUTADORES.find(function(c) { return c.id === body.computadorId; });
            body.computadorNome = comp2 ? comp2.nomePc : '-'; body.dataAbertura = new Date().toISOString(); body.dataConclusao = null; body.solucao = null;
            MOCK_ORDENS.push(body); return body;
        }
        if (url.indexOf('/api/ordens-servico/') !== -1 && method === 'PUT') {
            var ouId = parseInt(url.split('/api/ordens-servico/')[1]);
            var oi2 = MOCK_ORDENS.findIndex(function(o) { return o.id === ouId; });
            if (oi2 !== -1) { Object.assign(MOCK_ORDENS[oi2], body); return MOCK_ORDENS[oi2]; }
            return null;
        }
        if (url.indexOf('/api/ordens-servico/') !== -1 && method === 'DELETE') {
            MOCK_ORDENS = MOCK_ORDENS.filter(function(o) { return o.id !== parseInt(url.split('/api/ordens-servico/')[1]); });
            return {};
        }
    }

    if (url.indexOf('/api/usuarios') !== -1) {
        if (method === 'GET' && url.indexOf('/api/usuarios/') === -1) return MOCK_USUARIOS;
        if (url.indexOf('/api/usuarios/') !== -1 && method === 'GET') {
            return MOCK_USUARIOS.find(function(u) { return u.id === parseInt(url.split('/api/usuarios/')[1]); }) || null;
        }
        if (method === 'POST') {
            body.id = Math.max.apply(null, MOCK_USUARIOS.map(function(u) { return u.id; })) + 1;
            body.ativo = true; body.dataCadastro = new Date().toISOString();
            MOCK_USUARIOS.push(body); return body;
        }
        if (url.indexOf('/api/usuarios/') !== -1 && method === 'PUT') {
            var uuId = parseInt(url.split('/api/usuarios/')[1]);
            var ui2 = MOCK_USUARIOS.findIndex(function(u) { return u.id === uuId; });
            if (ui2 !== -1) { Object.assign(MOCK_USUARIOS[ui2], body); return MOCK_USUARIOS[ui2]; }
            return null;
        }
        if (url.indexOf('/api/usuarios/') !== -1 && method === 'DELETE') {
            MOCK_USUARIOS = MOCK_USUARIOS.filter(function(u) { return u.id !== parseInt(url.split('/api/usuarios/')[1]); });
            return {};
        }
    }

    return null;
}

// ==========================================
// AUTH & API
// ==========================================
function getToken() { return localStorage.getItem('authToken'); }
function getPerfil() { return localStorage.getItem('userPerfil') || 'USUARIO'; }
function apiHeaders() { var t = getToken(); var h = { 'Content-Type': 'application/json' }; if (t) h['Authorization'] = 'Bearer ' + t; return h; }

async function apiFetch(url, opts) {
    opts = opts || {};
    opts.headers = Object.assign({}, apiHeaders(), opts.headers || {});
    if (!USE_MOCK) {
        try {
            var res = await fetch(API + url, opts);
            if (res.status === 401 || res.status === 403) { localStorage.clear(); window.location.href = 'login.html'; return; }
            var data = await res.json();
            if (!res.ok) throw new Error(data.erro || data.mensagem || 'Erro na requisicao');
            return data;
        } catch (e) {
            if (e.name === 'TypeError' && e.message === 'Failed to fetch') {
                console.warn('API indisponivel, usando mock:', e.message);
                USE_MOCK = true;
            } else { throw e; }
        }
    }
    var mockResult = mockFetch(url, opts);
    if (mockResult === null) throw new Error('Recurso nao encontrado (mock)');
    return mockResult;
}

function handleLogout() { localStorage.clear(); window.location.href = 'login.html'; }
function checkAuth() {
    if (!getToken()) { window.location.href = 'login.html'; return; }
    var n = localStorage.getItem('userName') || 'Usuario', p = getPerfil();
    var el = function(id) { return document.getElementById(id); };
    if (el('sidebarUserName')) el('sidebarUserName').textContent = n;
    if (el('sidebarUserRole')) el('sidebarUserRole').textContent = p;
    if (el('header-user-name')) el('header-user-name').textContent = n;
    var adminBtn = document.querySelector('[data-section="admin"]');
    if (adminBtn) adminBtn.style.display = (p === 'ADMIN') ? '' : 'none';
}

// ==========================================
// NAVIGATION
// ==========================================
function showSection(id) {
    _currentSection = id;
    document.querySelectorAll('.section-content').forEach(function(s) { s.classList.add('hidden'); });
    var sec = document.getElementById(id);
    if (sec) sec.classList.remove('hidden');
    document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); if (b.dataset.section === id) b.classList.add('active'); });
    closeStatDetail(); closeKpiDetail(); closeManKpiDetail(); closeOsKpiDetail();
    var t = {
        'painel': ['Dashboard', 'Visao geral do sistema'],
        'computadores': ['Computadores', 'Gerenciamento de computadores'],
        'manutencoes': ['Manutencoes', 'Controle de manutencoes'],
        'ordens-servico': ['Ordens de Servico', 'Gestao de OS'],
        'departamentos': ['Setores', 'Gestao de setores'],
        'logs': ['Historico', 'Historico de operacoes'],
        'relatorios': ['Relatorios', 'Estatisticas e graficos'],
        'usuarios': ['Usuarios', 'Gerenciamento de usuarios'],
        'admin': ['Ferramentas', 'Painel administrativo']
    };
    var d = t[id] || ['', ''];
    var el2 = function(x) { return document.getElementById(x); };
    if (el2('page-title')) el2('page-title').textContent = d[0];
    if (el2('page-subtitle')) el2('page-subtitle').textContent = d[1];
    switch (id) {
        case 'painel': loadDashboard(); break;
        case 'computadores': loadComputadores(0); break;
        case 'manutencoes': loadManutencoes(0); break;
        case 'ordens-servico': loadOrdensServico(0); break;
        case 'departamentos': loadDepartamentos(); break;
        case 'logs': loadLogs(0); break;
        case 'relatorios': loadRelatorios(); break;
        case 'usuarios': loadUsuarios(); break;
        case 'admin': loadAdmin(); break;
    }
    if (window.innerWidth < 1024) { var sb = document.getElementById('sidebar'); if (sb && sb.classList.contains('open')) toggleSidebar(); }
}

function toggleSidebar() { var s = document.getElementById('sidebar'), o = document.getElementById('sidebar-overlay'); s.classList.toggle('open'); o.style.display = s.classList.contains('open') ? 'block' : 'none'; }

async function loadAdmin() {
    var el = document.getElementById('admin-db-info');
    var elTotal = document.getElementById('admin-total-comps');
    var elAtivos = document.getElementById('admin-ativos-comps');
    var elManut = document.getElementById('admin-manut-comps');
    var elStatComps = document.getElementById('admin-stat-comps');
    try {
        var stats = await apiFetch('/api/computadores/estatisticas');
        var total = stats.total || 0;
        var ativos = stats.ativos || 0;
        var manut = (stats.manutencaoPreditiva || 0) + (stats.manutencaoPreventiva || 0) + (stats.manutencaoEmergencial || 0);
        if (el) {
            el.innerHTML =
                '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);"><span>Servidor</span><span style="color:var(--green);font-weight:600;">Online</span></div>' +
                '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);"><span>Banco de Dados</span><span style="font-weight:600;color:var(--cyan);">H2 (arquivo)</span></div>' +
                '<div style="display:flex;justify-content:space-between;padding:6px 0;"><span>Computadores</span><span style="font-weight:600;color:var(--cyan);">' + total + '</span></div>';
        }
        if (elTotal) elTotal.textContent = total;
        if (elAtivos) elAtivos.textContent = ativos;
        if (elManut) elManut.textContent = manut;
        if (elStatComps) elStatComps.textContent = total + ' registrados';
    } catch (e) {
        if (el) el.innerHTML = '<span style="color:var(--red);">Erro ao carregar</span>';
    }
}

// ==========================================
// DASHBOARD
// ==========================================
async function loadDashboard() {
    renderSkeletonKpis(7);
    try {
        var r = await Promise.all([
            apiFetch('/api/computadores/estatisticas').catch(function() { return null; }),
            apiFetch('/api/manutencoes/estatisticas').catch(function() { return null; }),
            apiFetch('/api/ordens-servico/estatisticas').catch(function() { return null; }),
            apiFetch('/api/computadores/alertas').catch(function() { return null; })
        ]);
        renderDashboardKpis(r[0], r[1], r[2], r[3]);
        renderChartStatus(r[0]); renderChartManutencoes(r[1]); renderChartOrdens(r[2]); renderAlertas(r[3]);
    } catch (e) { console.error('Erro dashboard:', e); }
}

function renderDashboardKpis(eq, man, os, alertas) {
    eq = eq || {}; man = man || {}; os = os || {}; alertas = alertas || {};
    _dashData = { eq: eq, man: man, os: os, alertas: alertas };
    var totalAlertas = (alertas.totalAlertas || 0);
    var k = [
        { i: 'fa-desktop', l: 'Total Computadores', v: eq.total || 0, c: 'cyan', t: 'TOTAL', key: 'dsh-eq-total' },
        { i: 'fa-bolt', l: 'Ativos', v: eq.ativos || 0, c: 'green', t: 'ATIVOS', key: 'dsh-eq-ativos' },
        { i: 'fa-tools', l: 'Em Manutencao', v: (eq.manutencaoPreditiva || 0) + (eq.manutencaoPreventiva || 0) + (eq.manutencaoEmergencial || 0), c: 'yellow', t: 'MANUT', key: 'dsh-eq-manut' },
        { i: 'fa-check-circle', l: 'Concluidos', v: eq.concluidos || 0, c: 'green', t: 'CONCLUIDO', key: 'dsh-eq-concluidos' },
        { i: 'fa-exclamation-triangle', l: 'Manut. Vencida', v: eq.manutencaoVencida || 0, c: 'red', t: 'VENCIDA', key: 'dsh-man-vencida' },
        { i: 'fa-shield-alt', l: 'Garantia Vencida', v: (alertas.garantiaVencida || []).length, c: 'red', t: 'GARANTIA', key: 'dsh-garantia' },
        { i: 'fa-clipboard-list', l: 'OS Abertas', v: (os.abertas || 0) + (os.emAnalise || 0), c: 'orange', t: 'OS', key: 'dsh-os-abertas' }
    ];
    document.getElementById('dashboardKpis').innerHTML = k.map(function(x) {
        return '<div class="kpi-card kpi-card-' + x.c + '" onclick="toggleKpiDetail(\'' + x.key + '\')" data-key="' + x.key + '"><div class="kpi-header"><div class="kpi-icon kpi-icon-' + x.c + '"><i class="fas ' + x.i + '"></i></div><span class="kpi-tag kpi-tag-' + x.c + '">' + x.t + '</span></div><p class="kpi-value"><span class="kpi-value-shine">' + x.v + '</span></p><p class="kpi-label">' + x.l + '</p></div>';
    }).join('');
    var resumo = document.getElementById('dashboardResumo');
    if (resumo) {
        var rItems = [
            { l: 'Computadores Ativos', v: eq.ativos || 0, c: 'var(--green)' },
            { l: 'Computadores Inativos', v: (eq.total || 0) - (eq.ativos || 0) - (eq.manutencaoPreditiva || 0) - (eq.manutencaoPreventiva || 0) - (eq.manutencaoEmergencial || 0) - (eq.concluidos || 0), c: 'var(--text-muted)' },
            { l: 'Manutencoes Pendentes', v: man.pendentes || 0, c: 'var(--yellow)' },
            { l: 'Manutencoes Em Andamento', v: man.emAndamento || 0, c: 'var(--cyan)' },
            { l: 'Manutencoes Concluidas', v: man.concluidas || 0, c: 'var(--green)' },
            { l: 'OS Abertas', v: os.abertas || 0, c: 'var(--orange)' },
            { l: 'Total Alertas', v: totalAlertas, c: totalAlertas > 0 ? 'var(--red)' : 'var(--green)' }
        ];
        resumo.innerHTML = rItems.map(function(x) { return '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);"><span style="color:var(--text-secondary);font-size:13px;">' + x.l + '</span><span style="font-weight:700;font-size:15px;color:' + x.c + ';">' + x.v + '</span></div>'; }).join('');
    }
}

function toggleKpiDetail(key) {
    if (_activeKpiKey === key) { closeKpiDetail(); return; }
    _activeKpiKey = key;
    document.querySelectorAll('.kpi-card').forEach(function(el) { el.classList.toggle('active', el.dataset.key === key); });
    renderKpiDetailPanel(key);
}

function closeKpiDetail() {
    _activeKpiKey = null;
    document.querySelectorAll('.kpi-card').forEach(function(el) { el.classList.remove('active'); });
    var ov = document.getElementById('sdOverlay'); if (ov) ov.remove();
    var ct = document.getElementById('sdContainer'); if (ct) ct.remove();
}

function renderKpiDetailPanel(key) {
    var container = document.getElementById('kpiDetail');
    if (!container) return;
    var title = '', icon = '', color = '';
    var sm = { 'ATIVO': { c: 'badge-ativo', i: 'fa-check-circle' }, 'MANUTENCAO_PREDITIVA': { c: 'badge-preditiva', i: 'fa-search' }, 'MANUTENCAO_PREVENTIVA': { c: 'badge-preventiva', i: 'fa-shield-alt' }, 'MANUTENCAO_EMERGENCIAL': { c: 'badge-emergencial', i: 'fa-exclamation-triangle' }, 'CONCLUIDO': { c: 'badge-concluido', i: 'fa-check-double' } };

    if (key === 'dsh-eq-total') {
        title = 'Todos os Computadores'; icon = 'fa-desktop'; color = 'cyan';
        apiFetch('/api/computadores/paginado?page=0&size=100&status=&termo=').then(function(d) {
            var list = d.content || d || [];
            renderKpiDetailHTML(container, title, icon, color, list.map(function(eq) {
                var s = sm[eq.status] || { c: 'badge-inativo', i: 'fa-circle' };
                var sl = eq.status.replace('MANUTENCAO_', 'Man. ').replace('_', ' ');
                return '<div class="stat-detail-item" onclick="showComputadorDetail(' + eq.id + ')"><div class="stat-detail-item-icon" style="background:var(--cyan-bg);color:var(--cyan);"><i class="fas fa-desktop"></i></div><div class="stat-detail-item-info"><div class="stat-detail-item-name">' + escapeHtml(eq.nomePc) + '</div><div class="stat-detail-item-sub">' + escapeHtml(eq.modeloMarca) + ' - ' + escapeHtml(eq.usuarioDesignado || '') + '</div></div><div class="stat-detail-item-badge"><span class="badge ' + s.c + '">' + sl + '</span></div></div>';
            }).join(''));
        });
    } else if (key === 'dsh-eq-ativos') {
        title = 'Computadores Ativos'; icon = 'fa-check-circle'; color = 'green';
        apiFetch('/api/computadores/paginado?page=0&size=100&status=ATIVO&termo=').then(function(d) {
            var list = d.content || d || [];
            renderKpiDetailHTML(container, title, icon, color, list.map(function(eq) {
                return '<div class="stat-detail-item" onclick="showComputadorDetail(' + eq.id + ')"><div class="stat-detail-item-icon" style="background:var(--green-bg);color:var(--green);"><i class="fas fa-check-circle"></i></div><div class="stat-detail-item-info"><div class="stat-detail-item-name">' + escapeHtml(eq.nomePc) + '</div><div class="stat-detail-item-sub">' + escapeHtml(eq.modeloMarca) + ' - ' + escapeHtml(eq.usuarioDesignado || '') + '</div></div><div class="stat-detail-item-badge"><span class="badge badge-ativo">Ativo</span></div></div>';
            }).join(''));
        });
    } else if (key === 'dsh-eq-manut') {
        title = 'Computadores em Manutencao'; icon = 'fa-wrench'; color = 'yellow';
        Promise.all([
            apiFetch('/api/computadores/paginado?page=0&size=100&status=MANUTENCAO_PREDITIVA&termo='),
            apiFetch('/api/computadores/paginado?page=0&size=100&status=MANUTENCAO_PREVENTIVA&termo='),
            apiFetch('/api/computadores/paginado?page=0&size=100&status=MANUTENCAO_EMERGENCIAL&termo=')
        ]).then(function(results) {
            var list = [];
            results.forEach(function(d) { list = list.concat(d.content || d || []); });
            list.sort(function(a, b) { return a.id - b.id; });
            renderKpiDetailHTML(container, title, icon, color, list.map(function(eq) {
                var s = sm[eq.status] || { c: 'badge-inativo', i: 'fa-circle' };
                var sl = eq.status.replace('MANUTENCAO_', 'Man. ').replace('_', ' ');
                return '<div class="stat-detail-item" onclick="showComputadorDetail(' + eq.id + ')"><div class="stat-detail-item-icon" style="background:var(--yellow-bg);color:var(--yellow);"><i class="fas fa-wrench"></i></div><div class="stat-detail-item-info"><div class="stat-detail-item-name">' + escapeHtml(eq.nomePc) + '</div><div class="stat-detail-item-sub">' + escapeHtml(eq.modeloMarca) + ' - ' + escapeHtml(eq.usuarioDesignado || '') + '</div></div><div class="stat-detail-item-badge"><span class="badge ' + s.c + '">' + sl + '</span></div></div>';
            }).join(''));
        });
    } else if (key === 'dsh-os-abertas') {
        title = 'OS Abertas'; icon = 'fa-clipboard-list'; color = 'orange';
        Promise.all([
            apiFetch('/api/ordens-servico?page=0&size=100&status=ABERTA'),
            apiFetch('/api/ordens-servico?page=0&size=100&status=EM_ANALISE')
        ]).then(function(results) {
            var list = [];
            results.forEach(function(d) { list = list.concat(d.content || d || []); });
            renderKpiDetailHTML(container, title, icon, color, list.map(function(o) {
                return '<div class="stat-detail-item"><div class="stat-detail-item-icon" style="background:var(--orange-bg);color:var(--orange);"><i class="fas fa-clipboard-list"></i></div><div class="stat-detail-item-info"><div class="stat-detail-item-name">' + escapeHtml(o.titulo) + '</div><div class="stat-detail-item-sub">' + escapeHtml(o.computadorNome || 'Sem vinculo') + ' - ' + escapeHtml(o.solicitante || '') + '</div></div><div class="stat-detail-item-badge"><span class="badge badge-pendente">' + o.status.replace(/_/g, ' ') + '</span></div></div>';
            }).join(''));
        });
    } else {
        var detailMap = {
            'dsh-eq-concluidos': { title: 'Computadores Concluidos', icon: 'fa-check-circle', color: 'green', filter: 'CONCLUIDO' },
            'dsh-man-vencida': { title: 'Manutencoes Vencidas', icon: 'fa-exclamation-triangle', color: 'red' },
            'dsh-garantia': { title: 'Garantia Vencida', icon: 'fa-shield-alt', color: 'red' }
        };
        var cfg = detailMap[key];
        if (cfg) {
            title = cfg.title; icon = cfg.icon; color = cfg.color;
            if (cfg.filter) {
                apiFetch('/api/computadores/paginado?page=0&size=100&status=' + cfg.filter + '&termo=').then(function(d) {
                    var list = d.content || d || [];
                    renderKpiDetailHTML(container, title, icon, color, list.map(function(eq) {
                        var s = sm[eq.status] || { c: 'badge-inativo', i: 'fa-circle' };
                        var sl = eq.status.replace('MANUTENCAO_', 'Man. ').replace('_', ' ');
                        return '<div class="stat-detail-item" onclick="showComputadorDetail(' + eq.id + ')"><div class="stat-detail-item-icon" style="background:var(--red-bg);color:var(--red);"><i class="fas fa-check-circle"></i></div><div class="stat-detail-item-info"><div class="stat-detail-item-name">' + escapeHtml(eq.nomePc) + '</div><div class="stat-detail-item-sub">' + escapeHtml(eq.modeloMarca) + '</div></div><div class="stat-detail-item-badge"><span class="badge ' + s.c + '">' + sl + '</span></div></div>';
                    }).join(''));
                });
            } else if (key === 'dsh-garantia') {
                var alertas2 = _dashData.alertas || {};
                var vencidas = alertas2.garantiaVencida || [];
                renderKpiDetailHTML(container, title, icon, color, vencidas.map(function(a) {
                    return '<div class="stat-detail-item"><div class="stat-detail-item-icon" style="background:var(--red-bg);color:var(--red);"><i class="fas fa-exclamation-triangle"></i></div><div class="stat-detail-item-info"><div class="stat-detail-item-name">' + escapeHtml(a.nomePc) + '</div><div class="stat-detail-item-sub">Vencida ha ' + a.dias + ' dias</div></div></div>';
                }).join(''));
            } else {
                renderKpiDetailHTML(container, title, icon, color, '');
            }
        }
    }
}

function renderKpiDetailHTML(container, title, icon, color, itemsHtml) {
    if (!itemsHtml) itemsHtml = '<div class="stat-detail-empty"><i class="fas fa-inbox"></i> Nenhum item encontrado</div>';
    var count = (itemsHtml.match(/class="stat-detail-item"/g) || []).length;
    closeKpiDetail();
    var ov = document.createElement('div'); ov.id = 'sdOverlay'; ov.className = 'sd-overlay'; ov.onclick = closeKpiDetail;
    var ct = document.createElement('div'); ct.id = 'sdContainer'; ct.className = 'sd-container';
    ct.innerHTML = '<div class="stat-detail-header"><h4><i class="fas ' + icon + '" style="color:var(--' + color + ');"></i> ' + title + ' <span style="font-weight:400;font-size:11px;color:var(--text-muted);">(' + count + ' itens)</span></h4><button class="stat-detail-close" onclick="closeKpiDetail()"><i class="fas fa-times"></i> Fechar</button></div><div class="stat-detail-body">' + itemsHtml + '</div>';
    document.body.appendChild(ov); document.body.appendChild(ct);
}

function renderChartStatus(s) {
    var ctx = document.getElementById('chartStatus'); if (!ctx) return; if (ctx._chart) ctx._chart.destroy();
    var d = (s && s.porStatus) || {}, lb = Object.keys(d).map(function(k) { return k.replace('MANUTENCAO_', 'Man. ').replace('_', ' '); }), vl = Object.values(d);
    var palette = [['#7dfce4','#30c8a8','#0affdc'],['#a0f0b0','#50c870','#70ff90'],['#f8e070','#d8b830','#ffe840'],['#f0b060','#d09040','#ffb840'],['#b080f0','#9060d0','#c090ff'],['#f080b0','#d06090','#ff70a0']];
    var cg = lb.map(function(_, i) { var p = palette[i % palette.length]; var g = ctx.getContext('2d').createRadialGradient(90,90,5,90,90,160); g.addColorStop(0,'#ffffff'); g.addColorStop(0.08,p[2]); g.addColorStop(0.25,p[0]); g.addColorStop(0.65,p[0]); g.addColorStop(1,p[1]); return g; });
    ctx._chart = new Chart(ctx, { type: 'doughnut', data: { labels: lb, datasets: [{ data: vl, backgroundColor: cg, borderWidth: 3, borderColor: 'rgba(8,12,24,0.9)', hoverOffset: 10, hoverBorderWidth: 4, hoverBorderColor: 'rgba(0,229,199,0.6)' }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '68%', layout: { padding: 8 }, plugins: { legend: { position: 'bottom', labels: { color: '#8892a8', padding: 14, usePointStyle: true, pointStyle: 'circle', font: { size: 10, family: 'Inter' } } }, tooltip: { backgroundColor: 'rgba(10,16,32,0.95)', titleColor: '#00e5c7', bodyColor: '#e4e8f1', borderColor: 'rgba(0,229,199,0.25)', borderWidth: 1, cornerRadius: 8, padding: 12, displayColors: true, boxPadding: 4 } } } });
}

function renderChartManutencoes(s) {
    var ctx = document.getElementById('chartManutencoes'); if (!ctx) return; if (ctx._chart) ctx._chart.destroy();
    var d = (s && s.porTipo) || {}; var labels = Object.keys(d); var vals = Object.values(d);
    if (labels.length === 0) { labels = ['Sem dados']; vals = [0]; }
    var palette = [['#7dfce4','#30c8a8','#0affdc'],['#b090f0','#9070d0','#c0a0ff'],['#f080b0','#d06090','#ff70a0'],['#f0b060','#d09040','#ffb840'],['#70e8a0','#40c880','#60ffb0'],['#70b0f0','#5090d0','#60c0ff']];
    var cg = labels.map(function(_, i) { var p = palette[i % palette.length]; var g = ctx.getContext('2d').createRadialGradient(90,90,5,90,90,160); g.addColorStop(0,'#ffffff'); g.addColorStop(0.08,p[2]); g.addColorStop(0.25,p[0]); g.addColorStop(0.65,p[0]); g.addColorStop(1,p[1]); return g; });
    ctx._chart = new Chart(ctx, { type: 'doughnut', data: { labels: labels, datasets: [{ data: vals, backgroundColor: cg, borderWidth: 2, borderColor: 'rgba(8,12,24,0.9)', hoverOffset: 8 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '65%', layout: { padding: 8 }, plugins: { legend: { position: 'bottom', labels: { color: '#8892a8', padding: 12, usePointStyle: true, pointStyle: 'circle', font: { size: 10, family: 'Inter' } } }, tooltip: { backgroundColor: 'rgba(10,16,32,0.95)', titleColor: '#00e5c7', bodyColor: '#e4e8f1', borderColor: 'rgba(0,229,199,0.25)', borderWidth: 1, cornerRadius: 8, padding: 10 } } } });
}

function renderChartOrdens(s) {
    var ctx = document.getElementById('chartOrdens'); if (!ctx) return; if (ctx._chart) ctx._chart.destroy();
    var d = (s && s.porPrioridade) || {}; var labels = Object.keys(d); var vals = Object.values(d);
    var palette = [['#70e8a0','#40c880','#80ffb0'],['#f8e070','#d8b830','#ffe840'],['#f0b060','#d09040','#ffb840'],['#f080b0','#d06090','#ff70a0'],['#b080f0','#9060d0','#c0a0ff']];
    var cArr = labels.map(function(_, i) { var p = palette[i % palette.length]; var g = ctx.getContext('2d').createLinearGradient(0,0,0,260); g.addColorStop(0,'#ffffff'); g.addColorStop(0.05,p[2]); g.addColorStop(0.15,p[0]); g.addColorStop(0.6,p[0]); g.addColorStop(1,p[1]); return g; });
    ctx._chart = new Chart(ctx, { type: 'bar', data: { labels: labels, datasets: [{ label: 'Ordens', data: vals, backgroundColor: cArr, borderRadius: 6, borderSkipped: false, barPercentage: 0.6 }] }, options: { responsive: true, maintainAspectRatio: false, layout: { padding: { top: 8 } }, plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(10,16,32,0.95)', titleColor: '#00e5c7', bodyColor: '#e4e8f1', borderColor: 'rgba(0,229,199,0.25)', borderWidth: 1, cornerRadius: 8, padding: 10 } }, scales: { y: { beginAtZero: true, ticks: { color: '#4e5a72', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.03)', lineWidth: 1 } }, x: { ticks: { color: '#8892a8', font: { size: 10 } }, grid: { display: false } } } } });
}

function renderAlertas(alertas) {
    var container = document.getElementById('dashboardAlertas');
    if (!container) return;
    alertas = alertas || {};
    var vencidas = alertas.garantiaVencida || [];
    var proximas = alertas.garantiaProxima || [];
    if (vencidas.length === 0 && proximas.length === 0) {
        container.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px;"><i class="fas fa-check-circle" style="color:var(--green);font-size:20px;margin-bottom:8px;display:block;"></i>Nenhum alerta no momento</div>';
        return;
    }
    var html = '';
    if (vencidas.length > 0) {
        html += '<div style="margin-bottom:12px;"><p style="font-size:11px;color:var(--red);font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;"><i class="fas fa-exclamation-circle"></i> Garantia Vencida (' + vencidas.length + ')</p>';
        vencidas.forEach(function(a) { html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.1);border-radius:8px;margin-bottom:6px;font-size:12px;"><span style="color:var(--text-primary);font-weight:500;">' + escapeHtml(a.nomePc) + '</span><span style="color:var(--red);font-size:11px;">Vencida ha ' + a.dias + ' dias</span></div>'; });
        html += '</div>';
    }
    if (proximas.length > 0) {
        html += '<div><p style="font-size:11px;color:var(--yellow);font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;"><i class="fas fa-clock"></i> Garantia Vencendo (' + proximas.length + ')</p>';
        proximas.forEach(function(a) { html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:rgba(245,158,11,0.05);border:1px solid rgba(245,158,11,0.1);border-radius:8px;margin-bottom:6px;font-size:12px;"><span style="color:var(--text-primary);font-weight:500;">' + escapeHtml(a.nomePc) + '</span><span style="color:var(--yellow);font-size:11px;">Vence em ' + a.diasRestantes + ' dias</span></div>'; });
        html += '</div>';
    }
    container.innerHTML = html;
}

// ==========================================
// COMPUTERS
// ==========================================
async function loadComputadores(page) {
    if (page !== undefined) currentPage.computadores = page;
    renderSkeletonCards(6);
    var s = (document.getElementById('busca-input') || {}).value || '', st = (document.getElementById('filtro-status') || {}).value || '';
    try {
        var d = await apiFetch('/api/computadores/paginado?page=' + currentPage.computadores + '&size=12&status=' + st + '&termo=' + encodeURIComponent(s));
        renderComputadoresCards(d);
    } catch (e) {
        document.getElementById('pc-cards-grid').innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><i class="fas fa-inbox"></i><p>Nenhum computador encontrado</p></div>';
    }
}

function renderComputadoresCards(data) {
    var grid = document.getElementById('pc-cards-grid');
    document.getElementById('nav-total').textContent = data.totalElements || 0;
    if (!data.content || data.content.length === 0) {
        grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><i class="fas fa-inbox"></i><p>Nenhum computador encontrado</p></div>';
        document.getElementById('cards-pagination').innerHTML = '';
        return;
    }
    var sm = { 'ATIVO': { c: 'badge-ativo', i: 'fa-check-circle' }, 'MANUTENCAO_PREDITIVA': { c: 'badge-preditiva', i: 'fa-search' }, 'MANUTENCAO_PREVENTIVA': { c: 'badge-preventiva', i: 'fa-shield-alt' }, 'MANUTENCAO_EMERGENCIAL': { c: 'badge-emergencial', i: 'fa-exclamation-triangle' }, 'CONCLUIDO': { c: 'badge-concluido', i: 'fa-check-double' } };
    grid.innerHTML = data.content.map(function(eq) {
        var isSelected = selectedComputadores.has(eq.id);
        var s = sm[eq.status] || { c: 'badge-inativo', i: 'fa-circle' }, sl = eq.status.replace('MANUTENCAO_', 'Man. ').replace('_', ' ');
        var admin = getPerfil() === 'ADMIN' ? '<button onclick="event.stopPropagation();confirmDelete(\'computador\',' + eq.id + ',\'' + escapeAttr(eq.nomePc) + '\')" class="action-btn action-btn-delete" title="Excluir"><i class="fas fa-trash"></i></button>' : '';
        var checkHtml = getPerfil() === 'ADMIN' ? '<input type="checkbox" class="bulk-check" ' + (isSelected ? 'checked' : '') + ' onclick="event.stopPropagation();toggleSelection(' + eq.id + ',this.checked)" title="Selecionar">' : '';
        return '<div class="pc-card' + (isSelected ? ' selected' : '') + '" onclick="showComputadorDetail(' + eq.id + ')">' + checkHtml + '<div class="pc-card-foto" style="height:160px;">' + getComputerPhoto(eq, { w: 280, h: 160 }) + '<div class="pc-card-status-bar"><span class="badge ' + s.c + '"><i class="fas ' + s.i + '" style="font-size:9px;"></i> ' + sl + '</span></div></div><div class="pc-card-body"><div class="pc-card-name">' + escapeHtml(eq.nomePc) + '</div><div class="pc-card-model">' + escapeHtml(eq.modeloMarca) + '</div><div class="pc-card-specs"><span class="pc-card-spec">' + escapeHtml(eq.processador) + '</span><span class="pc-card-spec">' + escapeHtml(eq.memoriaRam) + '</span><span class="pc-card-spec">' + escapeHtml(eq.armazenamento) + '</span></div><div class="pc-card-footer"><span class="pc-card-user"><i class="fas fa-user"></i> ' + escapeHtml(eq.usuarioDesignado || 'Sem usuario') + '</span><div class="pc-card-actions" onclick="event.stopPropagation()"><button onclick="event.stopPropagation();showComputadorForm(' + eq.id + ')" class="action-btn action-btn-edit" title="Editar"><i class="fas fa-pen"></i></button>' + admin + '</div></div></div></div>';
    }).join('');
    renderPagination('cards-pagination', data.totalPages, data.number, loadComputadores);
}

async function showComputadorDetail(id) {
    try {
        var eq = await apiFetch('/api/computadores/' + id);
        var sm = { 'ATIVO': { c: 'badge-ativo', i: 'fa-check-circle' }, 'MANUTENCAO_PREDITIVA': { c: 'badge-preditiva', i: 'fa-search' }, 'MANUTENCAO_PREVENTIVA': { c: 'badge-preventiva', i: 'fa-shield-alt' }, 'MANUTENCAO_EMERGENCIAL': { c: 'badge-emergencial', i: 'fa-exclamation-triangle' }, 'CONCLUIDO': { c: 'badge-concluido', i: 'fa-check-double' } };
        var s = sm[eq.status] || { c: 'badge-inativo', i: 'fa-circle' }, sl = eq.status.replace('MANUTENCAO_', 'Man. ').replace('_', ' ');
        var fotoHtml = '<div class="detail-foto" style="overflow:hidden;width:200px;height:200px;border-radius:12px;flex-shrink:0;">' + getComputerPhoto(eq, { w: 200, h: 200 }) + '</div>';
        var manutHtml = '';
        try {
            var manutData = await apiFetch('/api/manutencoes?computadorId=' + id + '&page=0&size=100');
            var manutList = manutData.content || manutData;
            if (manutList.length > 0) {
                manutHtml = '<div style="margin-top:20px;"><h4 style="font-size:13px;color:var(--text-secondary);margin-bottom:10px;"><i class="fas fa-wrench" style="color:var(--primary-light);margin-right:6px;"></i>Historico de Manutencao</h4>';
                manutList.forEach(function(m) {
                    var ms = m.status.replace('_', ' ');
                    manutHtml += '<div style="padding:10px;background:rgba(255,255,255,0.02);border:1px solid var(--border);border-radius:8px;margin-bottom:8px;"><div style="display:flex;justify-content:space-between;align-items:center;"><span class="badge badge-' + m.tipo.toLowerCase() + '">' + m.tipo + '</span><span class="badge badge-' + m.status.toLowerCase().replace('_', '-') + '">' + ms + '</span></div><p style="font-size:12px;color:var(--text-secondary);margin-top:6px;">' + escapeHtml(m.descricao || '') + '</p>' + (m.tecnicoResponsavel ? '<p style="font-size:11px;color:var(--text-muted);margin-top:4px;"><i class="fas fa-user"></i> ' + escapeHtml(m.tecnicoResponsavel) + '</p>' : '') + '</div>';
                });
                manutHtml += '</div>';
            }
        } catch (e) { }
        var extraHtml = '';
        var extraItems = [];
        if (eq.departamento) extraItems.push(['Setor', eq.departamento]);
        if (eq.localizacao) extraItems.push(['Localizacao', eq.localizacao]);
        if (eq.ipAddress) extraItems.push(['Endereco IP', eq.ipAddress]);
        if (eq.sistemaOperacional) extraItems.push(['Sistema Operacional', eq.sistemaOperacional]);
        if (eq.softwareInstalado) extraItems.push(['Software Instalado', eq.softwareInstalado]);
        if (eq.dataAquisicao) extraItems.push(['Data Aquisicao', new Date(eq.dataAquisicao + 'T00:00:00').toLocaleDateString('pt-BR')]);
        if (eq.dataGarantia) {
            var garDate = new Date(eq.dataGarantia + 'T00:00:00');
            var garLabel = garDate.toLocaleDateString('pt-BR');
            var garStatus = garDate > new Date() ? '<span style="color:var(--green);font-size:11px;">(Ativa)</span>' : '<span style="color:var(--red);font-size:11px;">(Vencida)</span>';
            extraItems.push(['Garantia', garLabel + ' ' + garStatus]);
        }
        if (eq.notas) extraItems.push(['Notas', escapeHtml(eq.notas)]);
        if (extraItems.length > 0) {
            extraHtml = '<div style="margin-top:20px;"><h4 style="font-size:13px;color:var(--text-secondary);margin-bottom:10px;"><i class="fas fa-info-circle" style="color:var(--primary-light);margin-right:6px;"></i>Detalhes Adicionais</h4><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">';
            extraItems.forEach(function(item) { extraHtml += '<div><label style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;">' + escapeHtml(item[0]) + '</label><p style="font-size:13px;color:var(--text-primary);font-weight:500;margin-top:2px;">' + item[1] + '</p></div>'; });
            extraHtml += '</div></div>';
        }
        openModal('Detalhes do Computador', '<div class="detail-header">' + fotoHtml + '<div class="detail-info"><h2>' + escapeHtml(eq.nomePc) + '</h2><p>' + escapeHtml(eq.modeloMarca) + ' &mdash; ' + escapeHtml(eq.numeroSerie) + '</p><span class="badge ' + s.c + '"><i class="fas ' + s.i + '" style="font-size:9px;"></i> ' + sl + '</span></div></div><div class="detail-specs"><div class="detail-spec-item"><label>Processador</label><p>' + escapeHtml(eq.processador) + '</p></div><div class="detail-spec-item"><label>Memoria RAM</label><p>' + escapeHtml(eq.memoriaRam) + '</p></div><div class="detail-spec-item"><label>Armazenamento</label><p>' + escapeHtml(eq.armazenamento) + '</p></div><div class="detail-spec-item"><label>Usuario Designado</label><p>' + escapeHtml(eq.usuarioDesignado || 'Nao atribuido') + '</p></div><div class="detail-spec-item"><label>Numero de Serie</label><p>' + escapeHtml(eq.numeroSerie) + '</p></div></div>' + extraHtml + manutHtml, '<button onclick="closeModal()" class="btn btn-ghost btn-sm">Fechar</button><button onclick="closeModal();showComputadorForm(' + eq.id + ')" class="btn btn-primary btn-sm"><i class="fas fa-pen"></i> Editar</button>');
    } catch (e) { showToast(e.message, 'error'); }
}

function renderSkeletonCards(count) {
    var grid = document.getElementById('pc-cards-grid');
    if (!grid) return;
    var html = '';
    for (var i = 0; i < (count || 6); i++) { html += '<div class="pc-card"><div class="skeleton skeleton-card"></div></div>'; }
    grid.innerHTML = html;
}

function renderSkeletonTableRows(count) {
    var html = '';
    for (var i = 0; i < (count || 5); i++) { html += '<tr><td colspan="100%"><div class="skeleton skeleton-row"></div></td></tr>'; }
    return html;
}

function renderSkeletonKpis(count) {
    var container = document.getElementById('dashboardKpis');
    if (!container) return;
    var html = '';
    for (var i = 0; i < (count || 4); i++) { html += '<div class="kpi-card"><div class="skeleton" style="height:40px;width:60px;margin-bottom:8px;"></div><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text short"></div></div>'; }
    container.innerHTML = html;
}

function toggleSelection(id, checked) {
    if (checked !== undefined) {
        if (checked) selectedComputadores.add(id); else selectedComputadores.delete(id);
    } else {
        if (selectedComputadores.has(id)) selectedComputadores.delete(id); else selectedComputadores.add(id);
    }
    var count = selectedComputadores.size;
    var toolbar = document.getElementById('bulk-toolbar');
    var countEl = document.getElementById('bulk-count');
    if (toolbar) toolbar.classList.toggle('active', count > 0);
    if (countEl) countEl.textContent = count + ' selecionado' + (count !== 1 ? 's' : '');
}

function clearBulkSelection() {
    selectedComputadores.clear();
    var toolbar = document.getElementById('bulk-toolbar');
    if (toolbar) toolbar.classList.remove('active');
    var countEl = document.getElementById('bulk-count');
    if (countEl) countEl.textContent = '0 selecionados';
    document.querySelectorAll('.pc-card.selected').forEach(function(c) { c.classList.remove('selected'); });
    document.querySelectorAll('.bulk-check:checked').forEach(function(c) { c.checked = false; });
    document.getElementById('bulk-status').value = '';
}

async function applyBulkStatus() {
    var status = document.getElementById('bulk-status').value;
    if (!status || selectedComputadores.size === 0) { showToast('Selecione um status e ao menos um computador', 'error'); return; }
    try {
        var res = await apiFetch('/api/computadores/bulk-status', { method: 'PATCH', body: JSON.stringify({ ids: Array.from(selectedComputadores), status: status }) });
        showToast(res.mensagem, 'success');
        clearBulkSelection();
        loadComputadores(currentPage.computadores);
        refreshAllData();
    } catch (e) { showToast(e.message, 'error'); }
}

async function showComputadorForm(id) {
    var eq = { nomePc: '', numeroSerie: '', modeloMarca: '', processador: '', memoriaRam: '', armazenamento: '', usuarioDesignado: '', status: 'ATIVO', fotoUrl: '' };
    if (id) { try { eq = await apiFetch('/api/computadores/' + id); } catch (e) { } }
    var fotoHtml = '<div class="photo-upload-area" id="photoUploadArea"><input type="file" id="eqFotoFile" accept="image/*,.heic,.heif,.avif" style="display:none;"><div id="fotoDropZone" class="foto-drop-zone"><div id="fotoPreview" class="foto-preview">' + (eq.fotoUrl && eq.fotoUrl.trim() ? '<div style="position:relative;display:inline-block;"><img src="' + escapeHtml(eq.fotoUrl) + '" style="max-height:240px;object-fit:contain;border-radius:8px;border:1px solid var(--border);" onload="this.style.display=\'block\';" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';"><div style="display:none;flex-direction:column;align-items:center;color:var(--red);padding:10px;"><i class="fas fa-exclamation-triangle" style="font-size:16px;"></i><p style="font-size:11px;margin-top:4px;">Imagem nao encontrada</p></div></div><div style="display:flex;gap:4px;margin-top:8px;"><button type="button" onclick="event.stopPropagation();document.getElementById(\'eqFotoFile\').click();" class="btn btn-primary btn-sm"><i class="fas fa-upload"></i> Trocar Foto</button><button type="button" onclick="event.stopPropagation();removePhoto()" class="btn btn-ghost btn-sm"><i class="fas fa-trash"></i> Remover</button></div>' : '<i class="fas fa-image" style="font-size:36px;color:var(--text-muted);margin-bottom:12px;opacity:0.4;"></i><p style="font-size:14px;color:var(--text-secondary);margin-bottom:12px;">Arraste fotos ou clique para selecionar</p><button id="fotoUploadBtn" onclick="event.stopPropagation();document.getElementById(\'eqFotoFile\').click();" class="btn btn-primary btn-sm"><i class="fas fa-upload"></i> Importar Foto</button><p style="font-size:11px;color:var(--text-muted);margin-top:10px;">JPG, PNG, GIF, WebP, HEIC, AVIF, BMP, TIFF (max 100MB)</p>') + '</div></div><input type="hidden" id="eqFotoUrlFinal" value="' + escapeAttr(eq.fotoUrl || '') + '"></div>';
    var statusOpts = ['ATIVO', 'MANUTENCAO_PREDITIVA', 'MANUTENCAO_PREVENTIVA', 'MANUTENCAO_EMERGENCIAL', 'CONCLUIDO'].map(function(st) {
        var labels = { 'ATIVO': 'Ativo', 'MANUTENCAO_PREDITIVA': 'Manutencao Preditiva', 'MANUTENCAO_PREVENTIVA': 'Manutencao Preventiva', 'MANUTENCAO_EMERGENCIAL': 'Manutencao Emergencial', 'CONCLUIDO': 'Concluido' };
        return '<option value="' + st + '"' + (eq.status === st ? ' selected' : '') + '>' + labels[st] + '</option>';
    }).join('');
    var soOpts = ['', 'Windows 10', 'Windows 11', 'Linux Ubuntu', 'Linux Mint', 'macOS', 'Outro'].map(function(so) {
        return '<option value="' + so + '"' + (eq.sistemaOperacional === so ? ' selected' : '') + '>' + (so || 'Selecione...') + '</option>';
    }).join('');
    var detHtml = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">' +
        '<div class="form-group"><label class="form-label">Setor</label><div class="searchable-dropdown" id="setorDropdown"><input type="text" id="eqDeptoSearch" class="form-input" placeholder="Buscar setor..." autocomplete="off" value="' + escapeAttr(eq.departamento || '') + '"><input type="hidden" id="eqDepto" value="' + escapeAttr(eq.departamento || '') + '"><div id="setorDropdownList" class="searchable-dropdown-list" style="display:none;"></div></div></div>' +
        '<div class="form-group"><label class="form-label">Localizacao</label><input id="eqLocal" value="' + escapeAttr(eq.localizacao || '') + '" class="form-input" placeholder="Ex: Sala 101, 2o andar" maxlength="150"></div>' +
        '<div class="form-group"><label class="form-label">Endereco IP</label><input id="eqIP" value="' + escapeAttr(eq.ipAddress || '') + '" class="form-input" placeholder="Ex: 192.168.1.100" maxlength="50"></div>' +
        '<div class="form-group"><label class="form-label">Sistema Operacional</label><select id="eqSO" class="form-input">' + soOpts + '</select></div>' +
        '<div class="form-group"><label class="form-label">Data Aquisicao</label><input type="date" id="eqDataAq" value="' + (eq.dataAquisicao || '') + '" class="form-input"></div>' +
        '<div class="form-group"><label class="form-label">Data Garantia</label><input type="date" id="eqDataGar" value="' + (eq.dataGarantia || '') + '" class="form-input"></div>' +
        '<div class="form-group"><label class="form-label">Software Instalado</label><input id="eqSoftware" value="' + escapeAttr(eq.softwareInstalado || '') + '" class="form-input" placeholder="Ex: Office 365, Adobe CC" maxlength="200"></div>' +
        '</div>' +
        '<div class="form-group" style="margin-top:14px;"><label class="form-label">Notas</label><textarea id="eqNotas" class="form-input" style="min-height:60px;resize:vertical;" maxlength="2000">' + escapeHtml(eq.notas || '') + '</textarea></div>';
    var tabIdx = id ? _currentTab : 0;
    var tabClasses = ['form-tab' + (tabIdx === 0 ? ' active' : ''), 'form-tab' + (tabIdx === 1 ? ' active' : ''), 'form-tab' + (tabIdx === 2 ? ' active' : '')];
    var tabDisplays = [tabIdx === 0 ? '' : 'display:none;', tabIdx === 1 ? '' : 'display:none;', tabIdx === 2 ? '' : 'display:none;'];
    var tabActives = [tabIdx === 0 ? 'active' : '', tabIdx === 1 ? 'active' : '', tabIdx === 2 ? 'active' : ''];
    openModal(id ? 'Editar Computador' : 'Novo Computador',
        '<form id="eqForm">' +
        '<div class="form-tabs" id="eqTabs">' +
        '<button type="button" class="' + tabClasses[0] + '" data-tab="tabgeral"><i class="fas fa-desktop"></i> Geral</button>' +
        '<button type="button" class="' + tabClasses[1] + '" data-tab="tabfoto"><i class="fas fa-camera"></i> Foto</button>' +
        '<button type="button" class="' + tabClasses[2] + '" data-tab="tabdet"><i class="fas fa-cog"></i> Detalhes</button>' +
        '</div>' +
        '<div id="tabgeral" class="form-tab-content ' + tabActives[0] + '" style="' + tabDisplays[0] + '">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">' +
        '<div class="form-group"><label class="form-label">Nome PC *</label><input id="eqNome" value="' + escapeAttr(eq.nomePc) + '" required class="form-input" maxlength="100"></div>' +
        '<div class="form-group"><label class="form-label">Numero Serie *</label><input id="eqSerie" value="' + escapeAttr(eq.numeroSerie) + '" required class="form-input" maxlength="50"></div>' +
        '<div class="form-group"><label class="form-label">Modelo/Marca *</label><input id="eqModelo" value="' + escapeAttr(eq.modeloMarca) + '" required class="form-input" maxlength="100"></div>' +
        '<div class="form-group"><label class="form-label">Processador *</label><input id="eqProc" value="' + escapeAttr(eq.processador) + '" required class="form-input" maxlength="100"></div>' +
        '<div class="form-group"><label class="form-label">Memoria RAM *</label><input id="eqRam" value="' + escapeAttr(eq.memoriaRam) + '" required class="form-input" maxlength="50"></div>' +
        '<div class="form-group"><label class="form-label">Armazenamento *</label><input id="eqArm" value="' + escapeAttr(eq.armazenamento) + '" required class="form-input" maxlength="50"></div>' +
        '<div class="form-group"><label class="form-label">Usuario Designado</label><input id="eqUsuario" value="' + escapeAttr(eq.usuarioDesignado || '') + '" class="form-input" maxlength="100"></div>' +
        '</div>' +
        '<div class="form-group" style="margin-top:14px;"><label class="form-label">Status</label><select id="eqStatus" class="form-input">' + statusOpts + '</select></div>' +
        '</div>' +
        '<div id="tabfoto" class="form-tab-content ' + tabActives[1] + '" style="' + tabDisplays[1] + '">' + fotoHtml + '</div>' +
        '<div id="tabdet" class="form-tab-content ' + tabActives[2] + '" style="' + tabDisplays[2] + '">' + detHtml + '</div>' +
        '</form>',
        '<button onclick="closeModal()" class="btn btn-ghost btn-sm">Cancelar</button><button onclick="document.getElementById(\'eqForm\').requestSubmit()" class="btn btn-primary btn-sm"><i class="fas fa-save"></i> ' + (id ? 'Salvar' : 'Cadastrar') + '</button>'
    );
    setupPhotoUpload();
    setupFormTabs();
    setupSetorSearchableDropdown(eq.departamento || '');
    document.getElementById('eqForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        var p = {
            nomePc: document.getElementById('eqNome').value,
            numeroSerie: document.getElementById('eqSerie').value,
            modeloMarca: document.getElementById('eqModelo').value,
            processador: document.getElementById('eqProc').value,
            memoriaRam: document.getElementById('eqRam').value,
            armazenamento: document.getElementById('eqArm').value,
            usuarioDesignado: document.getElementById('eqUsuario').value,
            status: document.getElementById('eqStatus').value,
            fotoUrl: document.getElementById('eqFotoUrlFinal').value || null,
            departamento: document.getElementById('eqDepto').value || null,
            localizacao: document.getElementById('eqLocal').value || null,
            ipAddress: document.getElementById('eqIP').value || null,
            sistemaOperacional: document.getElementById('eqSO').value || null,
            dataAquisicao: document.getElementById('eqDataAq').value || null,
            dataGarantia: document.getElementById('eqDataGar').value || null,
            softwareInstalado: document.getElementById('eqSoftware').value || null,
            notas: document.getElementById('eqNotas').value || null
        };
        try {
            if (id) {
                await apiFetch('/api/computadores/' + id, { method: 'PUT', body: JSON.stringify(p) });
                showToast('Computador atualizado!');
                closeModal();
                showComputadorForm(id);
                loadComputadores(currentPage.computadores);
                refreshAllData();
            } else {
                var res = await apiFetch('/api/computadores', { method: 'POST', body: JSON.stringify(p) });
                showToast('Computador cadastrado!');
                closeModal(); loadComputadores(0); _currentTab = 0;
                refreshAllData();
            }
        } catch (e) { showToast(e.message, 'error'); }
    });
}

function setupFormTabs() {
    var tabs = document.querySelectorAll('.form-tab');
    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            tabs.forEach(function(t) { t.classList.remove('active'); });
            document.querySelectorAll('.form-tab-content').forEach(function(c) { c.style.display = 'none'; c.classList.remove('active'); });
            tab.classList.add('active');
            var target = document.getElementById(tab.dataset.tab);
            if (target) { target.style.display = ''; target.classList.add('active'); }
            var tabMap = { 'tabgeral': 0, 'tabfoto': 1, 'tabdet': 2 };
            _currentTab = tabMap[tab.dataset.tab] || 0;
        });
    });
}

function setupSetorSearchableDropdown(currentValue) {
    var searchInput = document.getElementById('eqDeptoSearch');
    var hiddenInput = document.getElementById('eqDepto');
    var listEl = document.getElementById('setorDropdownList');
    if (!searchInput || !listEl) return;
    var setores = [];
    async function loadSetores() {
        try { setores = await apiFetch('/api/departamentos'); } catch (e) { setores = []; }
    }
    function filterAndShow(term) {
        var filtered = setores.filter(function(s) { return (s.nome || '').toLowerCase().indexOf(term.toLowerCase()) !== -1; });
        if (filtered.length === 0 || term === '') { listEl.style.display = 'none'; return; }
        listEl.innerHTML = filtered.map(function(s) {
            return '<div class="searchable-dropdown-item" data-value="' + escapeAttr(s.nome) + '">' + escapeHtml(s.nome) + ' <span style="color:var(--text-muted);font-size:11px;">(' + (s.totalComputadores || 0) + ' PCs)</span></div>';
        }).join('');
        listEl.style.display = 'block';
        listEl.querySelectorAll('.searchable-dropdown-item').forEach(function(item) {
            item.addEventListener('click', function() {
                hiddenInput.value = item.dataset.value;
                searchInput.value = item.dataset.value;
                listEl.style.display = 'none';
            });
        });
    }
    searchInput.addEventListener('focus', function() {
        if (setores.length === 0) loadSetores().then(function() { filterAndShow(searchInput.value); });
        else filterAndShow(searchInput.value);
    });
    searchInput.addEventListener('input', function() { hiddenInput.value = searchInput.value; filterAndShow(searchInput.value); });
    searchInput.addEventListener('blur', function() { setTimeout(function() { listEl.style.display = 'none'; }, 200); });
}

// ==========================================
// PHOTO UPLOAD
// ==========================================
function setupPhotoUpload() {
    var dropZone = document.getElementById('fotoDropZone');
    var fileInput = document.getElementById('eqFotoFile');
    var urlFinal = document.getElementById('eqFotoUrlFinal');
    var preview = document.getElementById('fotoPreview');
    if (!dropZone) return;
    dropZone.addEventListener('click', function(e) { if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'I') fileInput.click(); });
    dropZone.addEventListener('dragover', function(e) { e.preventDefault(); e.stopPropagation(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', function(e) { e.preventDefault(); e.stopPropagation(); dropZone.classList.remove('drag-over'); });
    dropZone.addEventListener('drop', function(e) { e.preventDefault(); e.stopPropagation(); dropZone.classList.remove('drag-over'); if (e.dataTransfer.files.length) handlePhotoFile(e.dataTransfer.files[0]); });
    fileInput.addEventListener('change', function() { if (this.files.length) handlePhotoFile(this.files[0]); });
    function isImageFile(file) {
        if (file.type && file.type.startsWith('image/')) return true;
        var n = (file.name || '').toLowerCase();
        return !!n.match(/\.(jpe?g|png|gif|webp|bmp|tiff?|heic|heif|ico|avif|svg)$/);
    }
    function handlePhotoFile(file) {
        if (!isImageFile(file)) { showToast('Formato nao suportado.', 'error'); return; }
        if (file.size > 100 * 1024 * 1024) { showToast('Arquivo excede 100MB.', 'error'); return; }
        preview.innerHTML = '<div style="text-align:center;padding:30px;"><div class="spinner"></div><p style="font-size:12px;color:var(--text-muted);margin-top:10px;">Enviando ' + formatFileSize(file.size) + '...</p></div>';
        var fd = new FormData();
        fd.append('file', file);
        fetch(API + '/api/upload', { method: 'POST', headers: { 'Authorization': 'Bearer ' + getToken() }, body: fd })
            .then(function(r) {
                if (r.status === 413) throw new Error('Arquivo muito grande.');
                if (r.status === 415) throw new Error('Tipo nao suportado.');
                if (r.status === 401 || r.status === 403) throw new Error('Sessao expirada.');
                if (!r.ok) return r.json().then(function(err) { throw new Error(err.erro || err.mensagem || 'Erro'); }).catch(function(e) { if (e.message !== 'Erro') throw e; throw new Error('Erro no servidor'); });
                return r.json();
            })
            .then(function(data) {
                if (data.url) {
                    urlFinal.value = data.url;
                    preview.innerHTML = '<div style="position:relative;display:inline-block;"><img src="' + escapeHtml(data.url) + '" style="max-height:240px;object-fit:contain;border-radius:8px;border:1px solid var(--border);" onload="this.style.display=\'block\';" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';"><div style="display:none;flex-direction:column;align-items:center;justify-content:center;padding:20px;color:var(--red);"><i class="fas fa-exclamation-triangle" style="font-size:20px;"></i><p style="font-size:11px;margin-top:4px;">Foto salva mas nao carregou</p></div></div><div style="display:flex;gap:4px;margin-top:8px;"><button type="button" onclick="event.stopPropagation();document.getElementById(\'eqFotoFile\').click();" class="btn btn-primary btn-sm"><i class="fas fa-upload"></i> Trocar</button><button type="button" onclick="event.stopPropagation();removePhoto()" class="btn btn-ghost btn-sm"><i class="fas fa-trash"></i> Remover</button></div>';
                    preview.style.position = 'relative';
                    showToast('Foto enviada com sucesso!', 'success');
                } else { throw new Error(data.erro || 'Erro no upload'); }
            })
            .catch(function(err) {
                showToast('Erro no upload: ' + err.message, 'error');
                preview.innerHTML = '<div style="text-align:center;padding:20px;"><i class="fas fa-exclamation-triangle" style="font-size:28px;color:var(--red);"></i><p style="font-size:12px;color:var(--red);margin-top:8px;max-width:220px;">' + escapeHtml(err.message) + '</p><button type="button" onclick="event.stopPropagation();document.getElementById(\'eqFotoFile\').click();" class="btn btn-ghost btn-sm" style="margin-top:8px;"><i class="fas fa-redo"></i> Tentar novamente</button></div>';
            });
    }
}

function removePhoto() {
    var preview = document.getElementById('fotoPreview');
    var urlFinal = document.getElementById('eqFotoUrlFinal');
    var fileInput = document.getElementById('eqFotoFile');
    if (urlFinal) urlFinal.value = '';
    if (fileInput) fileInput.value = '';
    if (preview) {
        preview.style.position = '';
        preview.innerHTML = '<i class="fas fa-image" style="font-size:36px;color:var(--text-muted);margin-bottom:12px;opacity:0.4;"></i><p style="font-size:14px;color:var(--text-secondary);margin-bottom:12px;">Arraste fotos ou clique para selecionar</p><button id="fotoUploadBtn" onclick="event.stopPropagation();document.getElementById(\'eqFotoFile\').click();" class="btn btn-primary btn-sm"><i class="fas fa-upload"></i> Importar Foto</button><p style="font-size:11px;color:var(--text-muted);margin-top:10px;">JPG, PNG, GIF, WebP, HEIC, AVIF, BMP (max 100MB)</p>';
    }
}

function setupManutencaoPhotoUpload() {
    var dropZone = document.getElementById('manFotoDropZone');
    var fileInput = document.getElementById('manFotoFile');
    var urlFinal = document.getElementById('manFotoUrlFinal');
    var preview = document.getElementById('manFotoPreview');
    if (!dropZone) return;
    dropZone.addEventListener('click', function(e) { if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'I') fileInput.click(); });
    dropZone.addEventListener('dragover', function(e) { e.preventDefault(); e.stopPropagation(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', function(e) { e.preventDefault(); e.stopPropagation(); dropZone.classList.remove('drag-over'); });
    dropZone.addEventListener('drop', function(e) { e.preventDefault(); e.stopPropagation(); dropZone.classList.remove('drag-over'); if (e.dataTransfer.files.length) handleManPhotoFile(e.dataTransfer.files[0]); });
    fileInput.addEventListener('change', function() { if (this.files.length) handleManPhotoFile(this.files[0]); });
    function isManImageFile(file) {
        if (file.type && file.type.startsWith('image/')) return true;
        var n = (file.name || '').toLowerCase();
        return !!n.match(/\.(jpe?g|png|gif|webp|bmp|tiff?|heic|heif|ico|avif|svg)$/);
    }
    function handleManPhotoFile(file) {
        if (!isManImageFile(file)) { showToast('Formato nao suportado.', 'error'); return; }
        if (file.size > 100 * 1024 * 1024) { showToast('Arquivo excede 100MB.', 'error'); return; }
        preview.innerHTML = '<div style="text-align:center;padding:16px;"><div class="spinner"></div><p style="font-size:11px;color:var(--text-muted);margin-top:6px;">Enviando...</p></div>';
        var fd = new FormData();
        fd.append('file', file);
        fetch(API + '/api/upload', { method: 'POST', headers: { 'Authorization': 'Bearer ' + getToken() }, body: fd })
            .then(function(r) {
                if (!r.ok) throw new Error('Erro no upload');
                return r.json();
            })
            .then(function(data) {
                if (data.url) {
                    urlFinal.value = data.url;
                    preview.innerHTML = '<img src="' + escapeHtml(data.url) + '" style="max-height:100px;object-fit:contain;border-radius:8px;border:1px solid var(--border);" onload="this.style.display=\'block\';" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';"><div style="display:none;color:var(--red);font-size:11px;">Falha ao carregar</div><div style="display:flex;gap:4px;margin-top:6px;"><button type="button" onclick="event.stopPropagation();document.getElementById(\'manFotoFile\').click();" class="btn btn-primary btn-sm"><i class="fas fa-upload"></i> Trocar</button><button type="button" onclick="event.stopPropagation();removeManFoto()" class="btn btn-ghost btn-sm"><i class="fas fa-trash"></i> Remover</button></div>';
                    showToast('Foto enviada!', 'success');
                } else { throw new Error(data.erro || 'Erro no upload'); }
            })
            .catch(function(err) {
                showToast('Erro no upload: ' + err.message, 'error');
                preview.innerHTML = '<div style="text-align:center;padding:12px;"><i class="fas fa-exclamation-triangle" style="font-size:20px;color:var(--red);"></i><p style="font-size:11px;color:var(--red);margin-top:4px;">' + escapeHtml(err.message) + '</p><button type="button" onclick="event.stopPropagation();document.getElementById(\'manFotoFile\').click();" class="btn btn-ghost btn-sm" style="margin-top:4px;"><i class="fas fa-redo"></i> Tentar</button></div>';
            });
    }
}

function removeManFoto() {
    var preview = document.getElementById('manFotoPreview');
    var urlFinal = document.getElementById('manFotoUrlFinal');
    var fileInput = document.getElementById('manFotoFile');
    if (urlFinal) urlFinal.value = '';
    if (fileInput) fileInput.value = '';
    if (preview) {
        preview.innerHTML = '<i class="fas fa-camera" style="font-size:24px;color:var(--text-muted);margin-bottom:8px;opacity:0.4;"></i><p style="font-size:12px;color:var(--text-secondary);margin-bottom:8px;">Arraste ou clique para adicionar foto</p><button type="button" onclick="event.stopPropagation();document.getElementById(\'manFotoFile\').click();" class="btn btn-primary btn-sm"><i class="fas fa-upload"></i> Importar</button>';
    }
}

// ==========================================
// MAINTENANCE
// ==========================================
async function loadManutencoes(page) {
    if (page !== undefined) currentPage.manutencoes = page;
    var st = (document.getElementById('man-filtro-status') || {}).value || '';
    var sb = (document.getElementById('man-busca-input') || {}).value || '';
    _manFilters.status = st;
    _manFilters.termo = sb;
    try {
        var allUrl = '/api/manutencoes?page=' + currentPage.manutencoes + '&size=10';
        if (st) allUrl += '&status=' + st;
        var d = await apiFetch(allUrl);
        renderManutencoes(d, sb);
        renderManKpis();
    } catch (e) {
        document.querySelector('#manutencoesTable tbody').innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted)"><i class="fas fa-inbox"></i> Nenhuma manutencao encontrada</td></tr>';
    }
}

async function renderManKpis() {
    try {
        var stats = await apiFetch('/api/manutencoes/estatisticas');
        stats = stats || {};
        var k = [
            { i: 'fa-tools', l: 'Total', v: stats.total || 0, c: 'cyan', t: 'TOTAL', key: 'man-kpi-total' },
            { i: 'fa-clock', l: 'Pendentes', v: stats.pendentes || 0, c: 'yellow', t: 'PENDENTE', key: 'man-kpi-pendentes' },
            { i: 'fa-spinner', l: 'Em Andamento', v: stats.emAndamento || 0, c: 'orange', t: 'ANDAMENTO', key: 'man-kpi-andamento' },
            { i: 'fa-check-double', l: 'Concluidas', v: stats.concluidas || 0, c: 'green', t: 'CONCLUIDA', key: 'man-kpi-concluidas' },
            { i: 'fa-times-circle', l: 'Canceladas', v: stats.canceladas || 0, c: 'red', t: 'CANCELADA', key: 'man-kpi-canceladas' }
        ];
        var el = document.getElementById('manKpis');
        if (el) el.innerHTML = k.map(function(x) {
            return '<div class="kpi-card kpi-card-' + x.c + '" onclick="toggleManKpiDetail(\'' + x.key + '\')" data-key="' + x.key + '"><div class="kpi-header"><div class="kpi-icon kpi-icon-' + x.c + '"><i class="fas ' + x.i + '"></i></div><span class="kpi-tag kpi-tag-' + x.c + '">' + x.t + '</span></div><p class="kpi-value"><span class="kpi-value-shine">' + x.v + '</span></p><p class="kpi-label">' + x.l + '</p></div>';
        }).join('');
    } catch (e) { }
}

var _activeManKpiKey = null;
function toggleManKpiDetail(key) {
    if (_activeManKpiKey === key) { closeManKpiDetail(); return; }
    _activeManKpiKey = key;
    document.querySelectorAll('#manKpis .kpi-card').forEach(function(el) { el.classList.toggle('active', el.dataset.key === key); });
    renderManKpiDetail(key);
}
function closeManKpiDetail() {
    _activeManKpiKey = null;
    document.querySelectorAll('#manKpis .kpi-card').forEach(function(el) { el.classList.remove('active'); });
    var ov = document.getElementById('sdOverlay'); if (ov) ov.remove();
    var ct = document.getElementById('sdContainer'); if (ct) ct.remove();
}
function renderManKpiDetail(key) {
    var container = document.getElementById('manKpiDetail');
    if (!container) return;
    var title = '', icon = '', color = '', statusFilter = '';
    if (key === 'man-kpi-total') { title = 'Todas as Manutencoes'; icon = 'fa-tools'; color = 'cyan'; statusFilter = ''; }
    else if (key === 'man-kpi-pendentes') { title = 'Manutencoes Pendentes'; icon = 'fa-clock'; color = 'yellow'; statusFilter = '&status=PENDENTE'; }
    else if (key === 'man-kpi-andamento') { title = 'Manutencoes Em Andamento'; icon = 'fa-spinner'; color = 'orange'; statusFilter = '&status=EM_ANDAMENTO'; }
    else if (key === 'man-kpi-concluidas') { title = 'Manutencoes Concluidas'; icon = 'fa-check-double'; color = 'green'; statusFilter = '&status=CONCLUIDA'; }
    else if (key === 'man-kpi-canceladas') { title = 'Manutencoes Canceladas'; icon = 'fa-times-circle'; color = 'red'; statusFilter = '&status=CANCELADA'; }
    apiFetch('/api/manutencoes?page=0&size=100' + statusFilter).then(function(d) {
        var list = (d.content || d || []);
        closeManKpiDetail();
        var count = list.length;
        var ov = document.createElement('div'); ov.id = 'sdOverlay'; ov.className = 'sd-overlay'; ov.onclick = closeManKpiDetail;
        var ct = document.createElement('div'); ct.id = 'sdContainer'; ct.className = 'sd-container';
        var itemsHtml = list.map(function(m) {
            return '<div class="stat-detail-item" onclick="showManutencaoForm(' + m.id + ')"><div class="stat-detail-item-icon" style="background:var(--' + color + '-bg);color:var(--' + color + ');"><i class="fas fa-wrench"></i></div><div class="stat-detail-item-info"><div class="stat-detail-item-name">' + escapeHtml(m.computadorNome || 'PC #' + m.computadorId) + '</div><div class="stat-detail-item-sub">' + escapeHtml(m.tipo) + ' - ' + escapeHtml(m.tecnicoResponsavel || 'Sem tecnico') + '</div></div><div class="stat-detail-item-badge"><span class="badge badge-' + m.status.toLowerCase().replace('_', '-') + '">' + m.status.replace(/_/g, ' ') + '</span></div></div>';
        }).join('');
        if (!itemsHtml) itemsHtml = '<div class="stat-detail-empty"><i class="fas fa-inbox"></i> Nenhum item encontrado</div>';
        ct.innerHTML = '<div class="stat-detail-header"><h4><i class="fas ' + icon + '" style="color:var(--' + color + ');"></i> ' + title + ' <span style="font-weight:400;font-size:11px;color:var(--text-muted);">(' + count + ' itens)</span></h4><button class="stat-detail-close" onclick="closeManKpiDetail()"><i class="fas fa-times"></i> Fechar</button></div><div class="stat-detail-body">' + itemsHtml + '</div>';
        document.body.appendChild(ov); document.body.appendChild(ct);
    });
}

function renderManutencoes(data, searchTerm) {
    var tb = document.querySelector('#manutencoesTable tbody');
    if (!data.content || data.content.length === 0) {
        tb.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted)"><i class="fas fa-inbox"></i> Nenhuma manutencao encontrada</td></tr>';
        document.getElementById('man-pagination').innerHTML = '';
        return;
    }
    var items = data.content;
    if (!_manFilters.showConcluidas) {
        items = items.filter(function(m) { return m.status !== 'CONCLUIDA' && m.status !== 'CANCELADA'; });
    }
    if (searchTerm) {
        var sl = searchTerm.toLowerCase();
        items = items.filter(function(m) { return (m.computadorNome || '').toLowerCase().indexOf(sl) !== -1 || (m.tecnicoResponsavel || '').toLowerCase().indexOf(sl) !== -1 || (m.descricao || '').toLowerCase().indexOf(sl) !== -1; });
    }
    if (items.length === 0) {
        tb.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted)"><i class="fas fa-inbox"></i> Nenhuma manutencao encontrada</td></tr>';
        document.getElementById('man-pagination').innerHTML = '';
        return;
    }
    tb.innerHTML = items.map(function(m) {
        var isCompleted = m.status === 'CONCLUIDA';
        var rowStyle = isCompleted ? 'opacity:0.55;' : '';
        var checkIcon = isCompleted ? '<i class="fas fa-check-circle" style="color:var(--green);margin-right:4px;"></i>' : '';
        return '<tr style="' + rowStyle + '"><td class="font-medium">' + checkIcon + m.id + '</td><td>' + escapeHtml(m.computadorNome) + '</td><td><span class="badge badge-' + m.tipo.toLowerCase() + '">' + m.tipo + '</span></td><td><span class="badge badge-' + m.status.toLowerCase().replace('_', '-') + '">' + m.status.replace('_', ' ') + '</span></td><td>' + escapeHtml(m.tecnicoResponsavel || '-') + '</td><td><div style="display:flex;gap:4px;"><button onclick="showManutencaoForm(' + m.id + ')" class="action-btn action-btn-edit"><i class="fas fa-pen"></i></button><button onclick="confirmDelete(\'manutencao\',' + m.id + ',\'Manutencao #' + m.id + '\')" class="action-btn action-btn-delete"><i class="fas fa-trash"></i></button></div></td></tr>';
    }).join('');
    renderPagination('man-pagination', data.totalPages, data.number, loadManutencoes);
}

async function showManutencaoForm(id) {
    var m = { tipo: 'CORRETIVA', status: 'PENDENTE', descricao: '' };
    if (id) { try { m = await apiFetch('/api/manutencoes/' + id); } catch (e) { } }
    if (allComputadores.length === 0) { try { allComputadores = await apiFetch('/api/computadores/paginado?page=0&size=100&status=&termo='); } catch (e) { } }
    var compList = allComputadores.content || allComputadores;
    var opts = compList.map(function(c) { return '<option value="' + c.id + '"' + (m.computadorId == c.id ? ' selected' : '') + '>' + escapeHtml(c.nomePc) + ' (' + escapeHtml(c.numeroSerie) + ')</option>'; }).join('');
    var usuarios = [];
    try { usuarios = await apiFetch('/api/usuarios'); } catch (e) { }
    var tecnicos = usuarios.filter(function(u) { return u.perfil === 'ADMIN' || u.perfil === 'TECNICO'; });
    var tecnicoOpts = tecnicos.map(function(u) { return '<option value="' + escapeHtml(u.nomeCompleto) + '"' + (m.tecnicoResponsavel === u.nomeCompleto ? ' selected' : '') + '>' + escapeHtml(u.nomeCompleto) + ' (' + u.perfil + ')</option>'; }).join('');
    openModal(id ? 'Editar Manutencao' : 'Nova Manutencao',
        '<form id="manForm"><div class="form-group"><label class="form-label">Computador</label><select id="manComputador" required class="form-input">' + opts + '</select></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px;"><div class="form-group"><label class="form-label">Tipo</label><select id="manTipo" class="form-input"><option value="CORRETIVA"' + (m.tipo === 'CORRETIVA' ? ' selected' : '') + '>Corretiva</option><option value="PREVENTIVA"' + (m.tipo === 'PREVENTIVA' ? ' selected' : '') + '>Preventiva</option><option value="PREDITIVA"' + (m.tipo === 'PREDITIVA' ? ' selected' : '') + '>Preditiva</option><option value="EMERGENCIAL"' + (m.tipo === 'EMERGENCIAL' ? ' selected' : '') + '>Emergencial</option></select></div>' +
        '<div class="form-group"><label class="form-label">Status</label><select id="manStatus" class="form-input"><option value="PENDENTE"' + (m.status === 'PENDENTE' ? ' selected' : '') + '>Pendente</option><option value="EM_ANDAMENTO"' + (m.status === 'EM_ANDAMENTO' ? ' selected' : '') + '>Em Andamento</option><option value="CONCLUIDA"' + (m.status === 'CONCLUIDA' ? ' selected' : '') + '>Concluida</option><option value="CANCELADA"' + (m.status === 'CANCELADA' ? ' selected' : '') + '>Cancelada</option></select></div></div>' +
        '<div class="form-group" style="margin-top:14px;"><label class="form-label">Descricao</label><textarea id="manDescricao" required class="form-input" style="min-height:80px;resize:vertical;">' + escapeHtml(m.descricao || '') + '</textarea></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px;"><div class="form-group"><label class="form-label">Tecnico Responsavel</label><select id="manTecnico" class="form-input"><option value="">Selecione...</option>' + tecnicoOpts + '</select></div>' +
        '<div class="form-group"><label class="form-label">Custo (R$)</label><input type="number" step="0.01" id="manCusto" value="' + (m.custo || '') + '" class="form-input"></div></div>' +
        '<div class="form-group" style="margin-top:14px;"><label class="form-label">Pecas Trocadas</label><input id="manPecas" value="' + escapeAttr(m.pecasTrocadas || '') + '" class="form-input"></div>' +
        '<div class="form-group" style="margin-top:14px;"><label class="form-label">Observacoes</label><textarea id="manObs" class="form-input" style="min-height:60px;resize:vertical;">' + escapeHtml(m.observacoes || '') + '</textarea></div>' +
        '<div class="photo-upload-area" style="margin-top:14px;"><input type="file" id="manFotoFile" accept="image/*" style="display:none;"><div id="manFotoDropZone" class="foto-drop-zone" style="min-height:80px;"><div id="manFotoPreview" class="foto-preview"><i class="fas fa-camera" style="font-size:24px;color:var(--text-muted);margin-bottom:8px;opacity:0.4;"></i><p style="font-size:12px;color:var(--text-secondary);margin-bottom:8px;">Arraste ou clique para adicionar foto</p><button type="button" onclick="event.stopPropagation();document.getElementById(\'manFotoFile\').click();" class="btn btn-primary btn-sm"><i class="fas fa-upload"></i> Importar</button></div></div><input type="hidden" id="manFotoUrlFinal" value="' + escapeAttr(m.fotoUrl || '') + '"></div></form>',
        '<button onclick="closeModal()" class="btn btn-ghost btn-sm">Cancelar</button><button onclick="document.getElementById(\'manForm\').requestSubmit()" class="btn btn-primary btn-sm"><i class="fas fa-save"></i> ' + (id ? 'Salvar' : 'Cadastrar') + '</button>'
    );
    document.getElementById('manForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        var p = {
            computadorId: parseInt(document.getElementById('manComputador').value),
            tipo: document.getElementById('manTipo').value,
            status: document.getElementById('manStatus').value,
            descricao: document.getElementById('manDescricao').value,
            tecnicoResponsavel: document.getElementById('manTecnico').value,
            custo: document.getElementById('manCusto').value ? parseFloat(document.getElementById('manCusto').value) : null,
            pecasTrocadas: document.getElementById('manPecas').value,
            observacoes: document.getElementById('manObs').value,
            fotoUrl: document.getElementById('manFotoUrlFinal').value || null
        };
        try {
            if (id) {
                await apiFetch('/api/manutencoes/' + id, { method: 'PUT', body: JSON.stringify(p) });
                showToast('Manutencao atualizada!');
                if (p.computadorId) {
                    try {
                        var statusMapU = { 'PENDENTE': 'MANUTENCAO_PREVENTIVA', 'EM_ANDAMENTO': 'MANUTENCAO_EMERGENCIAL', 'CONCLUIDA': 'ATIVO', 'CANCELADA': 'ATIVO' };
                        var newStatusU = statusMapU[p.status] || 'ATIVO';
                        var compData = await apiFetch('/api/computadores/' + p.computadorId);
                        await apiFetch('/api/computadores/' + p.computadorId, { method: 'PUT', body: JSON.stringify({ ...compData, status: newStatusU }) });
                    } catch (e) { }
                }
            } else {
                var res = await apiFetch('/api/manutencoes', { method: 'POST', body: JSON.stringify(p) });
                showToast('Manutencao cadastrada!');
                if (res && res.id) {
                    var comp = compList.find(function(c) { return c.id === p.computadorId; });
                    try {
                        await apiFetch('/api/ordens-servico', { method: 'POST', body: JSON.stringify({ titulo: 'OS - Manutencao #' + res.id + ' - ' + (comp ? comp.nomePc : ''), descricao: 'Ordem aberta automaticamente para manutencao #' + res.id, computadorId: p.computadorId, prioridade: 'MEDIA', status: 'ABERTA', solicitante: p.tecnicoResponsavel || '', tecnicoResponsavel: p.tecnicoResponsavel || '', solucao: 'Aguardando inicio da manutencao ' + res.id }) });
                    } catch (e) { }
                }
                if (p.computadorId) {
                    try {
                        var statusMap = { 'PENDENTE': 'MANUTENCAO_PREVENTIVA', 'EM_ANDAMENTO': 'MANUTENCAO_EMERGENCIAL', 'CONCLUIDA': 'ATIVO', 'CANCELADA': 'ATIVO' };
                        var newStatus = statusMap[p.status] || 'ATIVO';
                        var compData2 = await apiFetch('/api/computadores/' + p.computadorId);
                        await apiFetch('/api/computadores/' + p.computadorId, { method: 'PUT', body: JSON.stringify({ ...compData2, status: newStatus }) });
                    } catch (e) { }
                }
            }
            closeModal(); loadManutencoes(0); refreshAllData();
        } catch (e) { showToast(e.message, 'error'); }
    });
    setupManutencaoPhotoUpload();
}

// ==========================================
// ORDENS DE SERVICO (Helpdesk Style)
// ==========================================
async function loadOrdensServico(page) {
    if (page !== undefined) currentPage.ordensServico = page;
    var st = (document.getElementById('os-filtro-status') || {}).value || '';
    var pr = (document.getElementById('os-filtro-prioridade') || {}).value || '';
    var sb = (document.getElementById('os-busca-input') || {}).value || '';
    try {
        var d = await apiFetch('/api/ordens-servico?page=' + currentPage.ordensServico + '&size=10&status=' + st + '&prioridade=' + pr);
        renderOrdensServico(d, sb);
        renderOsKpis();
    } catch (e) {
        document.querySelector('#ordensTable tbody').innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text-muted)"><i class="fas fa-inbox"></i> Nenhuma ordem encontrada</td></tr>';
    }
}

async function renderOsKpis() {
    try {
        var stats = await apiFetch('/api/ordens-servico/estatisticas');
        stats = stats || {};
        var k = [
            { i: 'fa-clipboard-list', l: 'Total', v: stats.total || 0, c: 'cyan', t: 'TOTAL', key: 'os-kpi-total' },
            { i: 'fa-folder-open', l: 'Abertas', v: stats.abertas || 0, c: 'orange', t: 'ABERTA', key: 'os-kpi-abertas' },
            { i: 'fa-search', l: 'Em Analise', v: stats.emAnalise || 0, c: 'yellow', t: 'ANALISE', key: 'os-kpi-analise' },
            { i: 'fa-cogs', l: 'Em Execucao', v: stats.emExecucao || 0, c: 'green', t: 'EXECUCAO', key: 'os-kpi-execucao' },
            { i: 'fa-check-circle', l: 'Concluidas', v: stats.concluidas || 0, c: 'green', t: 'CONCLUIDA', key: 'os-kpi-concluidas' }
        ];
        var el = document.getElementById('osKpis');
        if (el) el.innerHTML = k.map(function(x) {
            return '<div class="kpi-card kpi-card-' + x.c + '" onclick="toggleOsKpiDetail(\'' + x.key + '\')" data-key="' + x.key + '"><div class="kpi-header"><div class="kpi-icon kpi-icon-' + x.c + '"><i class="fas ' + x.i + '"></i></div><span class="kpi-tag kpi-tag-' + x.c + '">' + x.t + '</span></div><p class="kpi-value"><span class="kpi-value-shine">' + x.v + '</span></p><p class="kpi-label">' + x.l + '</p></div>';
        }).join('');
    } catch (e) { }
}

var _activeOsKpiKey = null;
function toggleOsKpiDetail(key) {
    if (_activeOsKpiKey === key) { closeOsKpiDetail(); return; }
    _activeOsKpiKey = key;
    document.querySelectorAll('#osKpis .kpi-card').forEach(function(el) { el.classList.toggle('active', el.dataset.key === key); });
    renderOsKpiDetail(key);
}
function closeOsKpiDetail() {
    _activeOsKpiKey = null;
    document.querySelectorAll('#osKpis .kpi-card').forEach(function(el) { el.classList.remove('active'); });
    var ov = document.getElementById('sdOverlay'); if (ov) ov.remove();
    var ct = document.getElementById('sdContainer'); if (ct) ct.remove();
}
function renderOsKpiDetail(key) {
    var container = document.getElementById('osKpiDetail');
    if (!container) return;
    var title = '', icon = '', color = '', statusFilter = '';
    if (key === 'os-kpi-total') { title = 'Todas as OS'; icon = 'fa-clipboard-list'; color = 'cyan'; statusFilter = ''; }
    else if (key === 'os-kpi-abertas') { title = 'OS Abertas'; icon = 'fa-folder-open'; color = 'orange'; statusFilter = '&status=ABERTA'; }
    else if (key === 'os-kpi-analise') { title = 'OS Em Analise'; icon = 'fa-search'; color = 'yellow'; statusFilter = '&status=EM_ANALISE'; }
    else if (key === 'os-kpi-execucao') { title = 'OS Em Execucao'; icon = 'fa-cogs'; color = 'green'; statusFilter = '&status=EM_EXECUCAO'; }
    else if (key === 'os-kpi-concluidas') { title = 'OS Concluidas'; icon = 'fa-check-circle'; color = 'green'; statusFilter = '&status=CONCLUIDA'; }
    apiFetch('/api/ordens-servico?page=0&size=100' + statusFilter).then(function(d) {
        var list = (d.content || d || []);
        closeOsKpiDetail();
        var count = list.length;
        var ov = document.createElement('div'); ov.id = 'sdOverlay'; ov.className = 'sd-overlay'; ov.onclick = closeOsKpiDetail;
        var ct = document.createElement('div'); ct.id = 'sdContainer'; ct.className = 'sd-container';
        var itemsHtml = list.map(function(o) {
            return '<div class="stat-detail-item" onclick="showOrdemForm(' + o.id + ')"><div class="stat-detail-item-icon" style="background:var(--' + color + '-bg);color:var(--' + color + ');"><i class="fas fa-clipboard-list"></i></div><div class="stat-detail-item-info"><div class="stat-detail-item-name">' + escapeHtml(o.titulo) + '</div><div class="stat-detail-item-sub">' + escapeHtml(o.computadorNome || 'Sem vinculo') + ' - ' + escapeHtml(o.solicitante || '') + '</div></div><div class="stat-detail-item-badge"><span class="badge badge-' + o.status.toLowerCase().replace('_', '-') + '">' + o.status.replace(/_/g, ' ') + '</span></div></div>';
        }).join('');
        if (!itemsHtml) itemsHtml = '<div class="stat-detail-empty"><i class="fas fa-inbox"></i> Nenhum item encontrado</div>';
        ct.innerHTML = '<div class="stat-detail-header"><h4><i class="fas ' + icon + '" style="color:var(--' + color + ');"></i> ' + title + ' <span style="font-weight:400;font-size:11px;color:var(--text-muted);">(' + count + ' itens)</span></h4><button class="stat-detail-close" onclick="closeOsKpiDetail()"><i class="fas fa-times"></i> Fechar</button></div><div class="stat-detail-body">' + itemsHtml + '</div>';
        document.body.appendChild(ov); document.body.appendChild(ct);
    });
}

function renderOrdensServico(data, searchTerm) {
    var tb = document.querySelector('#ordensTable tbody');
    if (!data.content || data.content.length === 0) {
        tb.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text-muted)"><i class="fas fa-inbox"></i> Nenhuma ordem encontrada</td></tr>';
        document.getElementById('os-pagination').innerHTML = '';
        return;
    }
    var items = data.content;
    if (searchTerm) {
        var sl = searchTerm.toLowerCase();
        items = items.filter(function(o) { return (o.titulo || '').toLowerCase().indexOf(sl) !== -1 || (o.solicitante || '').toLowerCase().indexOf(sl) !== -1 || (o.computadorNome || '').toLowerCase().indexOf(sl) !== -1; });
    }
    var priorityColors = { 'BAIXA': 'var(--green)', 'MEDIA': 'var(--yellow)', 'ALTA': 'var(--orange)', 'CRITICA': 'var(--red)' };
    var statusColors = { 'ABERTA': 'badge-aberta', 'EM_ANALISE': 'badge-em-analise', 'EM_EXECUCAO': 'badge-em-execucao', 'CONCLUIDA': 'badge-concluida', 'CANCELADA': 'badge-cancelada' };
    tb.innerHTML = items.map(function(o) {
        var dt = o.dataPrevisao ? new Date(o.dataPrevisao).toLocaleDateString('pt-BR') : '-';
        var pColor = priorityColors[o.prioridade] || 'var(--text-muted)';
        var pDot = '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + pColor + ';margin-right:6px;vertical-align:middle;" title="' + o.prioridade + '"></span>';
        return '<tr style="cursor:pointer;" onclick="showOrdemForm(' + o.id + ')"><td class="font-medium">' + o.id + '</td><td>' + pDot + escapeHtml(o.titulo) + '</td><td>' + escapeHtml(o.computadorNome || '-') + '</td><td><span class="badge badge-' + o.prioridade.toLowerCase() + '">' + o.prioridade + '</span></td><td><span class="badge ' + (statusColors[o.status] || 'badge-pendente') + '">' + o.status.replace('_', ' ') + '</span></td><td>' + escapeHtml(o.solicitante || '-') + '</td><td>' + dt + '</td><td><div style="display:flex;gap:4px;" onclick="event.stopPropagation()"><button onclick="showOrdemForm(' + o.id + ')" class="action-btn action-btn-edit"><i class="fas fa-pen"></i></button><button onclick="confirmDelete(\'ordem\',' + o.id + ',\'' + escapeAttr(o.titulo) + '\')" class="action-btn action-btn-delete"><i class="fas fa-trash"></i></button></div></td></tr>';
    }).join('');
    renderPagination('os-pagination', data.totalPages, data.number, loadOrdensServico);
}

async function showOrdemForm(id) {
    var o = { titulo: '', descricao: '', prioridade: 'MEDIA', status: 'ABERTA', solicitante: '', tecnicoResponsavel: '' };
    if (id) { try { o = await apiFetch('/api/ordens-servico/' + id); } catch (e) { } }
    if (allComputadores.length === 0) { try { allComputadores = await apiFetch('/api/computadores/paginado?page=0&size=100&status=&termo='); } catch (e) { } }
    var compList = allComputadores.content || allComputadores;
    var opts = compList.map(function(c) { return '<option value="' + c.id + '"' + (o.computadorId == c.id ? ' selected' : '') + '>' + escapeHtml(c.nomePc) + '</option>'; }).join('');
    var usuarios = [];
    try { usuarios = await apiFetch('/api/usuarios'); } catch (e) { }
    var tecnicos = usuarios.filter(function(u) { return u.perfil === 'ADMIN' || u.perfil === 'TECNICO'; });
    var tecnicoOpts = tecnicos.map(function(u) { return '<option value="' + escapeHtml(u.nomeCompleto) + '"' + (o.tecnicoResponsavel === u.nomeCompleto ? ' selected' : '') + '>' + escapeHtml(u.nomeCompleto) + ' (' + u.perfil + ')</option>'; }).join('');
    var dataPrevisao = o.dataPrevisao ? o.dataPrevisao.substring(0, 10) : '';
    openModal(id ? 'Editar Ordem de Servico' : 'Nova Ordem de Servico',
        '<form id="osForm"><div class="form-group"><label class="form-label">Titulo *</label><input id="osTitulo" value="' + escapeAttr(o.titulo) + '" required class="form-input"></div>' +
        '<div class="form-group" style="margin-top:14px;"><label class="form-label">Descricao</label><textarea id="osDescricao" class="form-input" style="min-height:80px;resize:vertical;">' + escapeHtml(o.descricao || '') + '</textarea></div>' +
        '<div class="form-group" style="margin-top:14px;"><label class="form-label">Equipamento</label><select id="osComputador" class="form-input"><option value="">Nenhum</option>' + opts + '</select></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px;"><div class="form-group"><label class="form-label">Prioridade</label><select id="osPrioridade" class="form-input"><option value="BAIXA"' + (o.prioridade === 'BAIXA' ? ' selected' : '') + '>Baixa</option><option value="MEDIA"' + (o.prioridade === 'MEDIA' ? ' selected' : '') + '>Media</option><option value="ALTA"' + (o.prioridade === 'ALTA' ? ' selected' : '') + '>Alta</option><option value="CRITICA"' + (o.prioridade === 'CRITICA' ? ' selected' : '') + '>Critica</option></select></div>' +
        '<div class="form-group"><label class="form-label">Status</label><select id="osStatus" class="form-input"><option value="ABERTA"' + (o.status === 'ABERTA' ? ' selected' : '') + '>Aberta</option><option value="EM_ANALISE"' + (o.status === 'EM_ANALISE' ? ' selected' : '') + '>Em Analise</option><option value="EM_EXECUCAO"' + (o.status === 'EM_EXECUCAO' ? ' selected' : '') + '>Em Execucao</option><option value="CONCLUIDA"' + (o.status === 'CONCLUIDA' ? ' selected' : '') + '>Concluida</option><option value="CANCELADA"' + (o.status === 'CANCELADA' ? ' selected' : '') + '>Cancelada</option></select></div></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px;"><div class="form-group"><label class="form-label">Solicitante</label><input id="osSolicitante" value="' + escapeAttr(o.solicitante || '') + '" class="form-input"></div>' +
        '<div class="form-group"><label class="form-label">Responsavel</label><select id="osTecnico" class="form-input"><option value="">Nenhum</option>' + tecnicoOpts + '</select></div></div>' +
        '<div class="form-group" style="margin-top:14px;"><label class="form-label">Data Previsao</label><input type="date" id="osDataPrevisao" value="' + dataPrevisao + '" class="form-input"></div>' +
        '<div class="form-group" style="margin-top:14px;"><label class="form-label">Solucao</label><textarea id="osSolucao" class="form-input" style="min-height:60px;resize:vertical;">' + escapeHtml(o.solucao || '') + '</textarea></div></form>',
        '<button onclick="closeModal()" class="btn btn-ghost btn-sm">Cancelar</button><button onclick="document.getElementById(\'osForm\').requestSubmit()" class="btn btn-primary btn-sm"><i class="fas fa-save"></i> ' + (id ? 'Salvar' : 'Cadastrar') + '</button>'
    );
    document.getElementById('osForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        var p = {
            titulo: document.getElementById('osTitulo').value,
            descricao: document.getElementById('osDescricao').value,
            computadorId: document.getElementById('osComputador').value ? parseInt(document.getElementById('osComputador').value) : null,
            prioridade: document.getElementById('osPrioridade').value,
            status: document.getElementById('osStatus').value,
            solicitante: document.getElementById('osSolicitante').value,
            tecnicoResponsavel: document.getElementById('osTecnico').value,
            dataPrevisao: document.getElementById('osDataPrevisao').value ? document.getElementById('osDataPrevisao').value + 'T17:00:00' : null,
            solucao: document.getElementById('osSolucao').value
        };
        try {
            if (id) {
                await apiFetch('/api/ordens-servico/' + id, { method: 'PUT', body: JSON.stringify(p) });
                showToast('Ordem atualizada!');
            } else {
                await apiFetch('/api/ordens-servico', { method: 'POST', body: JSON.stringify(p) });
                showToast('Ordem criada!');
            }
            closeModal(); loadOrdensServico(0); refreshAllData();
        } catch (e) { showToast(e.message, 'error'); }
    });
}

// ==========================================
// REPORTS
// ==========================================
async function loadRelatorios() {
    try {
        var eqData = await apiFetch('/api/computadores/paginado?page=0&size=100&status=&termo=');
        var eqList = eqData.content || eqData;
        var r2 = await Promise.all([apiFetch('/api/computadores/estatisticas').catch(function() { return null; }), apiFetch('/api/manutencoes/estatisticas').catch(function() { return null; }), apiFetch('/api/ordens-servico/estatisticas').catch(function() { return null; })]);
        renderChartMarcas(eqList); renderChartManTipos(r2[1]); renderChartManutencoesMes(r2[1]); renderChartOSPrioridade(r2[2]); renderChartOSStatus(r2[2]); renderChartManStatus(r2[1]); renderStatsGerais(r2[0], r2[1], r2[2]);
    } catch (e) { console.error('Erro relatorios:', e); }
}

function renderChartMarcas(eq) {
    var ctx = document.getElementById('chartMarcas'); if (!ctx) return; if (ctx._chart) ctx._chart.destroy();
    var m = {}; (eq || []).forEach(function(e) { var k = e.modeloMarca.split(' ')[0] || 'Outro'; m[k] = (m[k] || 0) + 1; });
    var s = Object.entries(m).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 10);
    if (s.length === 0) s = [['Sem dados', 0]];
    var palette = [['#7dfce4','#30c8a8','#0affdc'],['#b090f0','#9070d0','#c0a0ff'],['#f080b0','#d06090','#ff70a0'],['#f0b060','#d09040','#ffb840'],['#70e8a0','#40c880','#60ffb0'],['#70b0f0','#5090d0','#60c0ff'],['#f08080','#d06060','#ff7070'],['#f8e070','#d8b830','#ffe840'],['#50d0d0','#30b0c0','#60e8e8'],['#a090e0','#8070c0','#b0a0ff']];
    var cArr = s.map(function(_, i) { var p = palette[i % palette.length]; var g = ctx.getContext('2d').createLinearGradient(0,0,400,0); g.addColorStop(0,'#ffffff'); g.addColorStop(0.05,p[2]); g.addColorStop(0.15,p[0]); g.addColorStop(0.55,p[0]); g.addColorStop(1,p[1]); return g; });
    ctx._chart = new Chart(ctx, { type: 'bar', data: { labels: s.map(function(x) { return x[0]; }), datasets: [{ label: 'Quantidade', data: s.map(function(x) { return x[1]; }), backgroundColor: cArr, borderRadius: 6, borderSkipped: false, barPercentage: 0.65 }] }, options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, layout: { padding: { right: 16 } }, plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(10,16,32,0.95)', titleColor: '#00e5c7', bodyColor: '#e4e8f1', borderColor: 'rgba(0,229,199,0.25)', borderWidth: 1, cornerRadius: 8, padding: 10, callbacks: { label: function(c) { return c.raw + ' equipamento(s)'; } } } }, scales: { x: { beginAtZero: true, ticks: { color: '#4e5a72', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.03)', lineWidth: 1 } }, y: { ticks: { color: '#8892a8', font: { size: 10, weight: '500' } }, grid: { display: false } } } } });
}

function renderChartManutencoesMes(s) {
    var ctx = document.getElementById('chartManutencoesMes'); if (!ctx) return; if (ctx._chart) ctx._chart.destroy();
    var d = (s && s.porMes) || {}; var keys = Object.keys(d).sort().slice(-8);
    var lb = keys.map(function(k) { var p = k.split('-'); return p[1] + '/' + p[0].slice(2); });
    var vl = keys.map(function(k) { return d[k]; });
    if (lb.length === 0) { lb = ['Sem dados']; vl = [0]; }
    var gFill = ctx.getContext('2d').createLinearGradient(0,0,0,260); gFill.addColorStop(0,'rgba(125,252,228,0.25)'); gFill.addColorStop(0.5,'rgba(125,252,228,0.08)'); gFill.addColorStop(1,'rgba(125,252,228,0.01)');
    var gLine = ctx.getContext('2d').createLinearGradient(0,0,400,0); gLine.addColorStop(0,'#7dfce4'); gLine.addColorStop(0.5,'#50e8d0'); gLine.addColorStop(1,'#30c8b0');
    ctx._chart = new Chart(ctx, { type: 'line', data: { labels: lb, datasets: [{ label: 'Manutencoes', data: vl, borderColor: gLine, backgroundColor: gFill, fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#00e5c7', pointBorderColor: '#0c1022', pointBorderWidth: 2, pointHoverRadius: 7, pointHoverBackgroundColor: '#00e5c7', pointHoverBorderColor: '#fff', pointHoverBorderWidth: 2, borderWidth: 2.5 }] }, options: { responsive: true, maintainAspectRatio: false, layout: { padding: { top: 8, bottom: 4 } }, plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(10,16,32,0.95)', titleColor: '#00e5c7', bodyColor: '#e4e8f1', borderColor: 'rgba(0,229,199,0.25)', borderWidth: 1, cornerRadius: 8, padding: 10, callbacks: { label: function(c) { return c.raw + ' manutencao(oes)'; } } } }, scales: { y: { beginAtZero: true, ticks: { color: '#4e5a72', font: { size: 10 }, stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.03)', lineWidth: 1 } }, x: { ticks: { color: '#8892a8', font: { size: 10 } }, grid: { display: false } } } } });
}

function renderChartManTipos(man) {
    var ctx = document.getElementById('chartManTipo'); if (!ctx) return; if (ctx._chart) ctx._chart.destroy();
    var d = (man && man.porTipo) || {}; var labels = Object.keys(d); var vals = Object.values(d);
    if (labels.length === 0) { labels = ['Sem dados']; vals = [0]; }
    var palette = [['#7dfce4','#30c8a8','#0affdc'],['#b090f0','#9070d0','#c0a0ff'],['#f080b0','#d06090','#ff70a0'],['#f0b060','#d09040','#ffb840'],['#70e8a0','#40c880','#60ffb0'],['#70b0f0','#5090d0','#60c0ff']];
    var cArr = labels.map(function(_, i) { var p = palette[i % palette.length]; var g = ctx.getContext('2d').createRadialGradient(90,90,5,90,90,160); g.addColorStop(0,'#ffffff'); g.addColorStop(0.08,p[2]); g.addColorStop(0.25,p[0]); g.addColorStop(0.65,p[0]); g.addColorStop(1,p[1]); return g; });
    ctx._chart = new Chart(ctx, { type: 'doughnut', data: { labels: labels, datasets: [{ data: vals, backgroundColor: cArr, borderWidth: 2, borderColor: 'rgba(8,12,24,0.9)', hoverOffset: 8 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '65%', layout: { padding: 8 }, plugins: { legend: { position: 'bottom', labels: { color: '#8892a8', padding: 12, usePointStyle: true, pointStyle: 'circle', font: { size: 10, family: 'Inter' } } }, tooltip: { backgroundColor: 'rgba(10,16,32,0.95)', titleColor: '#00e5c7', bodyColor: '#e4e8f1', borderColor: 'rgba(0,229,199,0.25)', borderWidth: 1, cornerRadius: 8, padding: 10, callbacks: { label: function(c) { var total = c.dataset.data.reduce(function(a, b) { return a + b; }, 0); var pct = total > 0 ? Math.round(c.raw / total * 100) : 0; return c.label + ': ' + c.raw + ' (' + pct + '%)'; } } } } });
}

function renderChartOSPrioridade(os) {
    var ctx = document.getElementById('chartOSPrioridade'); if (!ctx) return; if (ctx._chart) ctx._chart.destroy();
    var d = (os && os.porPrioridade) || {}; var labels = Object.keys(d); var vals = Object.values(d);
    if (labels.length === 0) { labels = ['Sem dados']; vals = [0]; }
    var palette = [['#70e8a0','#40c880','#60ffb0'],['#f8e070','#d8b830','#ffe840'],['#f0b060','#d09040','#ffb840'],['#f080b0','#d06090','#ff70a0'],['#b080f0','#9060d0','#c0a0ff']];
    var cArr = labels.map(function(_, i) { var p = palette[i % palette.length]; var g = ctx.getContext('2d').createRadialGradient(90,90,5,90,90,160); g.addColorStop(0,'#ffffff'); g.addColorStop(0.08,p[2]); g.addColorStop(0.25,p[0]); g.addColorStop(0.65,p[0]); g.addColorStop(1,p[1]); return g; });
    ctx._chart = new Chart(ctx, { type: 'doughnut', data: { labels: labels, datasets: [{ data: vals, backgroundColor: cArr, borderWidth: 2, borderColor: 'rgba(8,12,24,0.9)', hoverOffset: 8 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '65%', layout: { padding: 8 }, plugins: { legend: { position: 'bottom', labels: { color: '#8892a8', padding: 12, usePointStyle: true, pointStyle: 'circle', font: { size: 10, family: 'Inter' } } }, tooltip: { backgroundColor: 'rgba(10,16,32,0.95)', titleColor: '#00e5c7', bodyColor: '#e4e8f1', borderColor: 'rgba(0,229,199,0.25)', borderWidth: 1, cornerRadius: 8, padding: 10, callbacks: { label: function(c) { var total = c.dataset.data.reduce(function(a, b) { return a + b; }, 0); var pct = total > 0 ? Math.round(c.raw / total * 100) : 0; return c.label + ': ' + c.raw + ' (' + pct + '%)'; } } } } });
}

function renderChartOSStatus(os) {
    var ctx = document.getElementById('chartOSStatus'); if (!ctx) return; if (ctx._chart) ctx._chart.destroy();
    var labels = ['Aberta', 'Em Analise', 'Em Execucao', 'Concluida', 'Cancelada'];
    var vals = [os.abertas || 0, os.emAnalise || 0, os.emExecucao || 0, os.concluidas || 0, os.canceladas || 0];
    var palette = [['#70b0f0','#5090d0','#60c0ff'],['#f8e070','#d8b830','#ffe840'],['#7dfce4','#30c8a8','#0affdc'],['#70e8a0','#40c880','#60ffb0'],['#f08080','#d06060','#ff7070']];
    var cArr = labels.map(function(_, i) { var p = palette[i]; var g = ctx.getContext('2d').createRadialGradient(90,90,5,90,90,160); g.addColorStop(0,'#ffffff'); g.addColorStop(0.08,p[2]); g.addColorStop(0.25,p[0]); g.addColorStop(0.65,p[0]); g.addColorStop(1,p[1]); return g; });
    ctx._chart = new Chart(ctx, { type: 'doughnut', data: { labels: labels, datasets: [{ data: vals, backgroundColor: cArr, borderWidth: 0, hoverOffset: 8 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '65%', layout: { padding: 8 }, plugins: { legend: { position: 'bottom', labels: { color: '#8892a8', padding: 12, usePointStyle: true, pointStyle: 'circle', font: { size: 10, family: 'Inter' } } }, tooltip: { backgroundColor: 'rgba(10,16,32,0.95)', titleColor: '#00e5c7', bodyColor: '#e4e8f1', borderColor: 'rgba(0,229,199,0.25)', borderWidth: 1, cornerRadius: 8, padding: 10, callbacks: { label: function(c) { var total = c.dataset.data.reduce(function(a, b) { return a + b; }, 0); var pct = total > 0 ? Math.round(c.raw / total * 100) : 0; return c.label + ': ' + c.raw + ' (' + pct + '%)'; } } } } });
}

function renderChartManStatus(man) {
    var ctx = document.getElementById('chartManStatus'); if (!ctx) return; if (ctx._chart) ctx._chart.destroy();
    var d = (man && man.porStatus) || {}; var labels = Object.keys(d); var vals = Object.values(d);
    if (labels.length === 0) { labels = ['Sem dados']; vals = [0]; }
    var palette = [['#f8e070','#d8b830','#ffe840'],['#7dfce4','#30c8a8','#0affdc'],['#70e8a0','#40c880','#60ffb0'],['#f08080','#d06060','#ff7070'],['#909098','#707078','#b0b0b8']];
    var cArr = labels.map(function(_, i) { var p = palette[i % palette.length]; var g = ctx.getContext('2d').createLinearGradient(0,0,0,260); g.addColorStop(0,'#ffffff'); g.addColorStop(0.05,p[2]); g.addColorStop(0.15,p[0]); g.addColorStop(0.6,p[0]); g.addColorStop(1,p[1]); return g; });
    ctx._chart = new Chart(ctx, { type: 'bar', data: { labels: labels, datasets: [{ label: 'Quantidade', data: vals, backgroundColor: cArr, borderRadius: 6, borderSkipped: false, barPercentage: 0.6 }] }, options: { responsive: true, maintainAspectRatio: false, layout: { padding: { top: 8 } }, plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(10,16,32,0.95)', titleColor: '#00e5c7', bodyColor: '#e4e8f1', borderColor: 'rgba(0,229,199,0.25)', borderWidth: 1, cornerRadius: 8, padding: 10 } }, scales: { x: { ticks: { color: '#8892a8', font: { size: 10 } }, grid: { display: false } }, y: { beginAtZero: true, ticks: { color: '#4e5a72', font: { size: 10 }, stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.03)', lineWidth: 1 } } } } });
}

function exportRelatoriosCSV() {
    var rows = [];
    rows.push(['BA ELETRICA - Relatorio de Estatisticas']);
    rows.push(['Data: ' + new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR')]);
    rows.push([]);
    rows.push(['Categoria', 'Metrica', 'Valor']);
    var gc = document.getElementById('statsGerais');
    if (gc) {
        var groups = gc.querySelectorAll('.stat-card-group');
        groups.forEach(function(gr) {
            var title = gr.querySelector('.stat-card-group-title');
            var grpName = title ? title.textContent.trim() : '';
            var items = gr.querySelectorAll('.stat-card-item');
            items.forEach(function(item) {
                var val = item.querySelector('.stat-card-value');
                var lbl = item.querySelector('.stat-card-label');
                if (val && lbl) rows.push([grpName, lbl.textContent.trim(), val.textContent.trim()]);
            });
        });
    }
    var blob = new Blob([rows.map(function(r) { return r.join(';'); }).join('\n')], { type: 'text/csv;charset=utf-8;' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'relatorios_ba_eletrica_' + new Date().toISOString().slice(0, 10) + '.csv'; a.click();
    showToast('Relatorio exportado!');
}

function renderStatsGerais(eq, man, os) {
    var div = document.getElementById('statsGerais'); if (!div) return; eq = eq || {}; man = man || {}; os = os || {};
    _relData = { eq: eq, man: man, os: os };
    var totalMan = (eq.manutencaoPreditiva || 0) + (eq.manutencaoPreventiva || 0) + (eq.manutencaoEmergencial || 0);
    var html = '';
    html += '<div class="stat-card-group"><div class="stat-card-group-title"><i class="fas fa-desktop"></i> COMPUTADORES</div><div class="stat-card-items">';
    html += '<div class="stat-card-item" onclick="toggleStatDetail(\'eq-total\')" data-key="eq-total"><div class="stat-card-icon cyan"><i class="fas fa-desktop"></i></div><div><div class="stat-card-value">' + (eq.total || 0) + '</div><div class="stat-card-label">Total Computadores</div></div></div>';
    html += '<div class="stat-card-item" onclick="toggleStatDetail(\'eq-ativos\')" data-key="eq-ativos"><div class="stat-card-icon green"><i class="fas fa-check-circle"></i></div><div><div class="stat-card-value">' + (eq.ativos || 0) + '</div><div class="stat-card-label">Ativos</div></div></div>';
    html += '<div class="stat-card-item" onclick="toggleStatDetail(\'eq-manut\')" data-key="eq-manut"><div class="stat-card-icon yellow"><i class="fas fa-wrench"></i></div><div><div class="stat-card-value">' + totalMan + '</div><div class="stat-card-label">Em Manutencao</div></div></div>';
    html += '</div></div>';
    html += '<div class="stat-card-group" style="margin-top:14px;"><div class="stat-card-group-title"><i class="fas fa-wrench"></i> MANUTENCOES</div><div class="stat-card-items">';
    html += '<div class="stat-card-item" onclick="toggleStatDetail(\'man-total\')" data-key="man-total"><div class="stat-card-icon orange"><i class="fas fa-tools"></i></div><div><div class="stat-card-value">' + (man.total || 0) + '</div><div class="stat-card-label">Total Manutencoes</div></div></div>';
    html += '<div class="stat-card-item" onclick="toggleStatDetail(\'man-pendentes\')" data-key="man-pendentes"><div class="stat-card-icon yellow"><i class="fas fa-clock"></i></div><div><div class="stat-card-value">' + (man.pendentes || 0) + '</div><div class="stat-card-label">Pendentes</div></div></div>';
    html += '<div class="stat-card-item" onclick="toggleStatDetail(\'man-concluidas\')" data-key="man-concluidas"><div class="stat-card-icon green"><i class="fas fa-check-double"></i></div><div><div class="stat-card-value">' + (man.concluidas || 0) + '</div><div class="stat-card-label">Concluidas</div></div></div>';
    html += '</div></div>';
    html += '<div class="stat-card-group" style="margin-top:14px;"><div class="stat-card-group-title"><i class="fas fa-clipboard-list"></i> ORDENS DE SERVICO</div><div class="stat-card-items">';
    html += '<div class="stat-card-item" onclick="toggleStatDetail(\'os-total\')" data-key="os-total"><div class="stat-card-icon purple"><i class="fas fa-clipboard-list"></i></div><div><div class="stat-card-value">' + (os.total || 0) + '</div><div class="stat-card-label">Total OS</div></div></div>';
    html += '<div class="stat-card-item" onclick="toggleStatDetail(\'os-abertas\')" data-key="os-abertas"><div class="stat-card-icon red"><i class="fas fa-folder-open"></i></div><div><div class="stat-card-value">' + (os.abertas || 0) + '</div><div class="stat-card-label">OS Abertas</div></div></div>';
    html += '<div class="stat-card-item" onclick="toggleStatDetail(\'os-execucao\')" data-key="os-execucao"><div class="stat-card-icon cyan"><i class="fas fa-cogs"></i></div><div><div class="stat-card-value">' + (os.emExecucao || 0) + '</div><div class="stat-card-label">OS Em Execucao</div></div></div>';
    html += '<div class="stat-card-item" onclick="toggleStatDetail(\'os-concluidas\')" data-key="os-concluidas"><div class="stat-card-icon green"><i class="fas fa-check-circle"></i></div><div><div class="stat-card-value">' + (os.concluidas || 0) + '</div><div class="stat-card-label">OS Concluidas</div></div></div>';
    html += '</div></div>';
    div.innerHTML = html;
    var ts = document.getElementById('relatorioTimestamp');
    if (ts) ts.textContent = 'Atualizado: ' + new Date().toLocaleString('pt-BR');
    var pd = document.getElementById('printDate');
    if (pd) pd.textContent = new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR');
    var pfd = document.getElementById('printFooterDate');
    if (pfd) pfd.textContent = new Date().toLocaleDateString('pt-BR');
}

// ==========================================
// STAT DETAIL PANELS (Reports)
// ==========================================
function toggleStatDetail(key) {
    if (_activeStatKey === key) { closeStatDetail(); return; }
    _activeStatKey = key;
    document.querySelectorAll('.stat-card-item').forEach(function(el) { el.classList.toggle('active', el.dataset.key === key); });
    renderStatDetailPanel(key);
}

function closeStatDetail() {
    _activeStatKey = null;
    document.querySelectorAll('.stat-card-item').forEach(function(el) { el.classList.remove('active'); });
    var ov = document.getElementById('sdOverlay'); if (ov) ov.remove();
    var ct = document.getElementById('sdContainer'); if (ct) ct.remove();
}

function renderStatDetailPanel(key) {
    var container = document.getElementById('statDetail');
    if (!container) return;
    var title = '', icon = '', color = '';
    var sm = { 'ATIVO': { c: 'badge-ativo', i: 'fa-check-circle' }, 'MANUTENCAO_PREDITIVA': { c: 'badge-preditiva', i: 'fa-search' }, 'MANUTENCAO_PREVENTIVA': { c: 'badge-preventiva', i: 'fa-shield-alt' }, 'MANUTENCAO_EMERGENCIAL': { c: 'badge-emergencial', i: 'fa-exclamation-triangle' }, 'CONCLUIDO': { c: 'badge-concluido', i: 'fa-check-double' } };
    var statusMap = { 'PENDENTE': 'badge-pendente', 'EM_ANDAMENTO': 'badge-em_andamento', 'CONCLUIDA': 'badge-concluida', 'CANCELADA': 'badge-cancelada', 'ABERTA': 'badge-aberta', 'EM_ANALISE': 'badge-em-analise', 'EM_EXECUCAO': 'badge-em-execucao' };

    if (key === 'eq-total') {
        title = 'Todos os Computadores'; icon = 'fa-desktop'; color = 'cyan';
        apiFetch('/api/computadores/paginado?page=0&size=100&status=&termo=').then(function(d) {
            var list = d.content || d || [];
            renderStatDetailHTML(container, title, icon, color, list.map(function(eq) {
                var s = sm[eq.status] || { c: 'badge-inativo', i: 'fa-circle' };
                var sl = eq.status.replace('MANUTENCAO_', 'Man. ').replace('_', ' ');
                return '<div class="stat-detail-item" onclick="showComputadorDetail(' + eq.id + ')"><div class="stat-detail-item-icon" style="background:var(--cyan-bg);color:var(--cyan);"><i class="fas fa-desktop"></i></div><div class="stat-detail-item-info"><div class="stat-detail-item-name">' + escapeHtml(eq.nomePc) + '</div><div class="stat-detail-item-sub">' + escapeHtml(eq.modeloMarca) + ' - ' + escapeHtml(eq.usuarioDesignado || 'Sem usuario') + '</div></div><div class="stat-detail-item-badge"><span class="badge ' + s.c + '"><i class="fas ' + s.i + '"></i> ' + sl + '</span></div></div>';
            }).join(''));
        });
    } else if (key === 'eq-ativos') {
        title = 'Computadores Ativos'; icon = 'fa-check-circle'; color = 'green';
        apiFetch('/api/computadores/paginado?page=0&size=100&status=ATIVO&termo=').then(function(d) {
            var list = d.content || d || [];
            renderStatDetailHTML(container, title, icon, color, list.map(function(eq) {
                return '<div class="stat-detail-item" onclick="showComputadorDetail(' + eq.id + ')"><div class="stat-detail-item-icon" style="background:var(--green-bg);color:var(--green);"><i class="fas fa-desktop"></i></div><div class="stat-detail-item-info"><div class="stat-detail-item-name">' + escapeHtml(eq.nomePc) + '</div><div class="stat-detail-item-sub">' + escapeHtml(eq.modeloMarca) + ' - ' + escapeHtml(eq.usuarioDesignado || 'Sem usuario') + '</div></div><div class="stat-detail-item-badge"><span class="badge badge-ativo"><i class="fas fa-check-circle"></i> Ativo</span></div></div>';
            }).join(''));
        });
    } else if (key === 'eq-manut') {
        title = 'Computadores em Manutencao'; icon = 'fa-wrench'; color = 'yellow';
        Promise.all([
            apiFetch('/api/computadores/paginado?page=0&size=100&status=MANUTENCAO_PREDITIVA&termo='),
            apiFetch('/api/computadores/paginado?page=0&size=100&status=MANUTENCAO_PREVENTIVA&termo='),
            apiFetch('/api/computadores/paginado?page=0&size=100&status=MANUTENCAO_EMERGENCIAL&termo=')
        ]).then(function(results) {
            var list = [];
            results.forEach(function(d) { list = list.concat(d.content || d || []); });
            list.sort(function(a, b) { return a.id - b.id; });
            renderStatDetailHTML(container, title, icon, color, list.map(function(eq) {
                var s = sm[eq.status] || { c: 'badge-inativo', i: 'fa-circle' };
                var sl = eq.status.replace('MANUTENCAO_', 'Man. ').replace('_', ' ');
                return '<div class="stat-detail-item" onclick="showComputadorDetail(' + eq.id + ')"><div class="stat-detail-item-icon" style="background:var(--yellow-bg);color:var(--yellow);"><i class="fas fa-desktop"></i></div><div class="stat-detail-item-info"><div class="stat-detail-item-name">' + escapeHtml(eq.nomePc) + '</div><div class="stat-detail-item-sub">' + escapeHtml(eq.modeloMarca) + ' - ' + escapeHtml(eq.usuarioDesignado || 'Sem usuario') + '</div></div><div class="stat-detail-item-badge"><span class="badge ' + s.c + '"><i class="fas ' + s.i + '"></i> ' + sl + '</span></div></div>';
            }).join(''));
        });
    } else if (key === 'man-total') {
        title = 'Todas as Manutencoes'; icon = 'fa-wrench'; color = 'orange';
        apiFetch('/api/manutencoes?page=0&size=100').then(function(d) {
            var list = d.content || d || [];
            renderStatDetailHTML(container, title, icon, color, list.map(function(m) {
                var st = statusMap[m.status] || 'badge-pendente';
                return '<div class="stat-detail-item"><div class="stat-detail-item-icon" style="background:var(--orange-bg);color:var(--orange);"><i class="fas fa-wrench"></i></div><div class="stat-detail-item-info"><div class="stat-detail-item-name">' + escapeHtml(m.computadorNome || 'PC #' + m.computadorId) + '</div><div class="stat-detail-item-sub">' + escapeHtml(m.tipo) + ' - ' + escapeHtml(m.tecnicoResponsavel || 'Sem tecnico') + '</div></div><div class="stat-detail-item-badge"><span class="badge ' + st + '">' + m.status.replace(/_/g, ' ') + '</span></div></div>';
            }).join(''));
        });
    } else if (key === 'man-pendentes') {
        title = 'Manutencoes Pendentes'; icon = 'fa-clock'; color = 'yellow';
        apiFetch('/api/manutencoes?page=0&size=100&status=PENDENTE').then(function(d) {
            var list = d.content || d || [];
            renderStatDetailHTML(container, title, icon, color, list.map(function(m) {
                return '<div class="stat-detail-item"><div class="stat-detail-item-icon" style="background:var(--yellow-bg);color:var(--yellow);"><i class="fas fa-clock"></i></div><div class="stat-detail-item-info"><div class="stat-detail-item-name">' + escapeHtml(m.computadorNome || 'PC #' + m.computadorId) + '</div><div class="stat-detail-item-sub">' + escapeHtml(m.tipo) + ' - ' + escapeHtml(m.tecnicoResponsavel || 'Sem tecnico') + '</div></div><div class="stat-detail-item-badge"><span class="badge badge-pendente">PENDENTE</span></div></div>';
            }).join(''));
        });
    } else if (key === 'man-concluidas') {
        title = 'Manutencoes Concluidas'; icon = 'fa-check-double'; color = 'green';
        apiFetch('/api/manutencoes?page=0&size=100&status=CONCLUIDA').then(function(d) {
            var list = d.content || d || [];
            renderStatDetailHTML(container, title, icon, color, list.map(function(m) {
                return '<div class="stat-detail-item"><div class="stat-detail-item-icon" style="background:var(--green-bg);color:var(--green);"><i class="fas fa-check-double"></i></div><div class="stat-detail-item-info"><div class="stat-detail-item-name">' + escapeHtml(m.computadorNome || 'PC #' + m.computadorId) + '</div><div class="stat-detail-item-sub">' + escapeHtml(m.tipo) + ' - ' + escapeHtml(m.tecnicoResponsavel || 'Sem tecnico') + '</div></div><div class="stat-detail-item-badge"><span class="badge badge-concluida">CONCLUIDA</span></div></div>';
            }).join(''));
        });
    } else if (key === 'os-total') {
        title = 'Todas as Ordens de Servico'; icon = 'fa-clipboard-list'; color = 'purple';
        apiFetch('/api/ordens-servico?page=0&size=100').then(function(d) {
            var list = d.content || d || [];
            renderStatDetailHTML(container, title, icon, color, list.map(function(o) {
                var st = statusMap[o.status] || 'badge-pendente';
                return '<div class="stat-detail-item"><div class="stat-detail-item-icon" style="background:var(--purple-bg);color:var(--purple);"><i class="fas fa-clipboard-list"></i></div><div class="stat-detail-item-info"><div class="stat-detail-item-name">' + escapeHtml(o.titulo) + '</div><div class="stat-detail-item-sub">' + escapeHtml(o.computadorNome || 'Sem vinculo') + ' - ' + escapeHtml(o.solicitante || '') + '</div></div><div class="stat-detail-item-badge"><span class="badge ' + st + '">' + o.status.replace(/_/g, ' ') + '</span></div></div>';
            }).join(''));
        });
    } else if (key === 'os-abertas') {
        title = 'OS Abertas'; icon = 'fa-folder-open'; color = 'red';
        Promise.all([apiFetch('/api/ordens-servico?page=0&size=100&status=ABERTA'), apiFetch('/api/ordens-servico?page=0&size=100&status=EM_ANALISE')]).then(function(results) {
            var list = [];
            results.forEach(function(d) { list = list.concat(d.content || d || []); });
            renderStatDetailHTML(container, title, icon, color, list.map(function(o) {
                var st = statusMap[o.status] || 'badge-pendente';
                return '<div class="stat-detail-item"><div class="stat-detail-item-icon" style="background:var(--red-bg);color:var(--red);"><i class="fas fa-folder-open"></i></div><div class="stat-detail-item-info"><div class="stat-detail-item-name">' + escapeHtml(o.titulo) + '</div><div class="stat-detail-item-sub">' + escapeHtml(o.computadorNome || 'Sem vinculo') + ' - ' + escapeHtml(o.solicitante || '') + '</div></div><div class="stat-detail-item-badge"><span class="badge ' + st + '">' + o.status.replace(/_/g, ' ') + '</span></div></div>';
            }).join(''));
        });
    } else if (key === 'os-execucao') {
        title = 'OS em Execucao'; icon = 'fa-cogs'; color = 'cyan';
        apiFetch('/api/ordens-servico?page=0&size=100&status=EM_EXECUCAO').then(function(d) {
            var list = d.content || d || [];
            renderStatDetailHTML(container, title, icon, color, list.map(function(o) {
                return '<div class="stat-detail-item"><div class="stat-detail-item-icon" style="background:var(--cyan-bg);color:var(--cyan);"><i class="fas fa-cogs"></i></div><div class="stat-detail-item-info"><div class="stat-detail-item-name">' + escapeHtml(o.titulo) + '</div><div class="stat-detail-item-sub">' + escapeHtml(o.computadorNome || 'Sem vinculo') + ' - ' + escapeHtml(o.tecnicoResponsavel || 'Sem tecnico') + '</div></div><div class="stat-detail-item-badge"><span class="badge badge-em-execucao">EM EXECUCAO</span></div></div>';
            }).join(''));
        });
    } else if (key === 'os-concluidas') {
        title = 'OS Concluidas'; icon = 'fa-check-circle'; color = 'green';
        apiFetch('/api/ordens-servico?page=0&size=100&status=CONCLUIDA').then(function(d) {
            var list = d.content || d || [];
            renderStatDetailHTML(container, title, icon, color, list.map(function(o) {
                return '<div class="stat-detail-item"><div class="stat-detail-item-icon" style="background:var(--green-bg);color:var(--green);"><i class="fas fa-check-circle"></i></div><div class="stat-detail-item-info"><div class="stat-detail-item-name">' + escapeHtml(o.titulo) + '</div><div class="stat-detail-item-sub">' + escapeHtml(o.computadorNome || 'Sem vinculo') + ' - ' + escapeHtml(o.tecnicoResponsavel || '') + '</div></div><div class="stat-detail-item-badge"><span class="badge badge-concluida">CONCLUIDA</span></div></div>';
            }).join(''));
        });
    }
}

function renderStatDetailHTML(container, title, icon, color, itemsHtml) {
    if (!itemsHtml) itemsHtml = '<div class="stat-detail-empty"><i class="fas fa-inbox"></i> Nenhum item encontrado</div>';
    var count = (itemsHtml.match(/class="stat-detail-item"/g) || []).length;
    closeStatDetail();
    var ov = document.createElement('div'); ov.id = 'sdOverlay'; ov.className = 'sd-overlay'; ov.onclick = closeStatDetail;
    var ct = document.createElement('div'); ct.id = 'sdContainer'; ct.className = 'sd-container';
    ct.innerHTML = '<div class="stat-detail-header"><h4><i class="fas ' + icon + '" style="color:var(--' + color + ');"></i> ' + title + ' <span style="font-weight:400;font-size:11px;color:var(--text-muted);">(' + count + ' itens)</span></h4><button class="stat-detail-close" onclick="closeStatDetail()"><i class="fas fa-times"></i> Fechar</button></div><div class="stat-detail-body">' + itemsHtml + '</div>';
    document.body.appendChild(ov); document.body.appendChild(ct);
}

// ==========================================
// DEPARTMENTS (Setores)
// ==========================================
async function loadDepartamentos() {
    try {
        var d = await apiFetch('/api/departamentos');
        var s = (document.getElementById('depto-busca-input') || {}).value || '';
        if (s) { var sl = s.toLowerCase(); d = (d || []).filter(function(x) { return (x.nome || '').toLowerCase().indexOf(sl) !== -1; }); }
        renderDepartamentos(d);
    } catch (e) {
        var tb = document.querySelector('#departamentosTable tbody');
        if (tb) tb.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted)"><i class="fas fa-inbox"></i> Erro ao carregar setores</td></tr>';
    }
}

function renderDepartamentos(deptos) {
    var tb = document.querySelector('#departamentosTable tbody');
    if (!tb) return;
    if (!deptos || deptos.length === 0) {
        tb.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:24px;"><i class="fas fa-inbox"></i> Nenhum setor encontrado</td></tr>';
        return;
    }
    tb.innerHTML = deptos.map(function(d) {
        return '<tr style="cursor:pointer;" onclick="showSetorDetail(' + d.id + ',\'' + escapeAttr(d.nome) + '\',' + (d.totalComputadores || 0) + ')"><td style="font-weight:600;color:var(--text-primary);"><i class="fas fa-sitemap" style="color:var(--cyan);margin-right:8px;"></i>' + escapeHtml(d.nome) + '</td><td><span style="font-weight:700;color:var(--cyan);">' + (d.totalComputadores || 0) + '</span> <span style="color:var(--text-muted);font-size:11px;">computadores</span></td><td><button onclick="event.stopPropagation();confirmDelete(\'departamento\',' + d.id + ',\'' + escapeAttr(d.nome) + '\')" class="action-btn action-btn-delete"><i class="fas fa-trash"></i></button></td></tr>';
    }).join('');
}

function showSetorDetail(id, nome, count) {
    openModal('Setor: ' + nome,
        '<div style="padding:10px;text-align:center;">' +
        '<div style="font-size:48px;font-weight:800;color:var(--cyan);margin-bottom:8px;">' + count + '</div>' +
        '<p style="color:var(--text-muted);font-size:13px;">computadores vinculados a este setor</p>' +
        '<div style="margin-top:16px;text-align:left;">' +
        '<p style="font-size:12px;color:var(--text-secondary);">Para vincular computadores a este setor, edite o computador na aba <b>Detalhes</b> e selecione o setor.</p>' +
        '</div></div>',
        '<button onclick="closeModal()" class="btn btn-ghost btn-sm">Fechar</button>'
    );
}

async function showDeptoForm(id) {
    var d = { nome: '' };
    if (id) { try { d = await apiFetch('/api/departamentos/' + id); } catch (e) { } }
    openModal(id ? 'Editar Setor' : 'Novo Setor',
        '<form id="deptoForm"><div class="form-group"><label class="form-label">Nome *</label><input id="deptoNome" value="' + escapeAttr(d.nome) + '" required class="form-input" placeholder="Ex: TI, Financeiro, RH"></div></form>',
        '<button onclick="closeModal()" class="btn btn-ghost btn-sm">Cancelar</button><button onclick="document.getElementById(\'deptoForm\').requestSubmit()" class="btn btn-primary btn-sm"><i class="fas fa-save"></i> Criar</button>'
    );
    document.getElementById('deptoForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        var p = { nome: document.getElementById('deptoNome').value };
        try {
            await apiFetch('/api/departamentos', { method: 'POST', body: JSON.stringify(p) });
            showToast('Setor criado!');
            closeModal(); loadDepartamentos(); refreshAllData();
        } catch (e) { showToast(e.message, 'error'); }
    });
}

// ==========================================
// LOGS (Historico)
// ==========================================
async function loadLogs(page) {
    if (page !== undefined) currentPage.logs = page;
    var usuario = (document.getElementById('log-busca-usuario') || {}).value || '';
    var entidade = (document.getElementById('log-filtro-entidade') || {}).value || '';
    try {
        var d = await apiFetch('/api/logs?page=' + currentPage.logs + '&size=15&usuario=' + encodeURIComponent(usuario) + '&entidade=' + encodeURIComponent(entidade));
        renderLogs(d);
    } catch (e) {
        var tb = document.querySelector('#logsTable tbody');
        if (tb) tb.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted)"><i class="fas fa-inbox"></i> Erro ao carregar historico</td></tr>';
    }
}

function renderLogs(data) {
    var tb = document.querySelector('#logsTable tbody');
    if (!tb) return;
    var items = data.content || data || [];
    if (items.length === 0) {
        tb.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted)"><i class="fas fa-inbox"></i> Nenhum log encontrado</td></tr>';
        document.getElementById('logs-pagination').innerHTML = '';
        return;
    }
    var acoes = { 'LOGIN': 'badge-em_andamento', 'CRIACAO': 'badge-concluida', 'ALTERACAO': 'badge-pendente', 'EXCLUSAO': 'badge-cancelada', 'EXPORTACAO': 'badge-em_andamento', 'IMPORTACAO': 'badge-concluida' };
    var entityIcons = { 'COMPUTADOR': 'fa-desktop', 'MANUTENCAO': 'fa-wrench', 'ORDEM_SERVICO': 'fa-clipboard-list', 'USUARIO': 'fa-user', 'DEPARTAMENTO': 'fa-building', 'SISTEMA': 'fa-cog' };
    tb.innerHTML = items.map(function(l) {
        var dt = l.dataAtividade ? new Date(l.dataAtividade).toLocaleDateString('pt-BR') + ' ' + new Date(l.dataAtividade).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '-';
        var badge = acoes[l.acao] || 'badge-inativo';
        var eIcon = entityIcons[l.entidade] || 'fa-circle';
        return '<tr><td class="font-medium">' + (l.id || '-') + '</td><td><span class="badge ' + badge + '">' + (l.acao || '-') + '</span></td><td><i class="fas ' + eIcon + '" style="margin-right:4px;color:var(--text-muted);"></i>' + escapeHtml(l.entidade || '-') + '</td><td>' + escapeHtml(l.usuario || '-') + '</td><td style="max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + escapeAttr(l.descricao || '') + '">' + escapeHtml(l.descricao || '-') + '</td><td style="white-space:nowrap;">' + dt + '</td></tr>';
    }).join('');
    var totalPages = data.totalPages || 1;
    renderPagination('logs-pagination', totalPages, data.number || 0, loadLogs);
}

// ==========================================
// USERS
// ==========================================
async function loadUsuarios() {
    try {
        var d = await apiFetch('/api/usuarios');
        var s = (document.getElementById('user-busca-input') || {}).value || '';
        if (s) { var sl = s.toLowerCase(); d = (d || []).filter(function(x) { return (x.nomeCompleto || '').toLowerCase().indexOf(sl) !== -1 || (x.username || '').toLowerCase().indexOf(sl) !== -1 || (x.email || '').toLowerCase().indexOf(sl) !== -1; }); }
        renderUsuarios(d);
    } catch (e) {
        document.querySelector('#usuariosTable tbody').innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted)"><i class="fas fa-inbox"></i> Erro ao carregar</td></tr>';
    }
}

function renderUsuarios(usuarios) {
    document.querySelector('#usuariosTable tbody').innerHTML = usuarios.map(function(u) {
        return '<tr><td class="font-medium">' + u.id + '</td><td>' + escapeHtml(u.nomeCompleto) + '</td><td class="font-mono">' + escapeHtml(u.username) + '</td><td>' + escapeHtml(u.email || '-') + '</td><td><span class="badge badge-' + u.perfil.toLowerCase() + '">' + u.perfil + '</span></td><td><span class="badge badge-' + (u.ativo ? 'ativo' : 'cancelada') + '">' + (u.ativo ? 'Ativo' : 'Inativo') + '</span></td><td><div style="display:flex;gap:4px;"><button onclick="showUsuarioForm(' + u.id + ')" class="action-btn action-btn-edit"><i class="fas fa-pen"></i></button><button onclick="confirmDelete(\'usuario\',' + u.id + ',\'' + escapeAttr(u.nomeCompleto) + '\')" class="action-btn action-btn-delete"><i class="fas fa-trash"></i></button></div></td></tr>';
    }).join('');
}

async function showUsuarioForm(id) {
    var u = { username: '', nomeCompleto: '', email: '', perfil: 'USUARIO', senha: '' };
    if (id) { try { u = await apiFetch('/api/usuarios/' + id); } catch (e) { } }
    openModal(id ? 'Editar Usuario' : 'Novo Usuario',
        '<form id="userForm"><div class="form-group"><label class="form-label">Nome Completo *</label><input id="userNome" value="' + escapeAttr(u.nomeCompleto) + '" required class="form-input"></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px;"><div class="form-group"><label class="form-label">Username *</label><input id="userUsername" value="' + escapeAttr(u.username) + '" ' + (id ? 'disabled' : '') + ' required class="form-input"></div>' +
        '<div class="form-group"><label class="form-label">Email</label><input type="email" id="userEmail" value="' + escapeAttr(u.email || '') + '" class="form-input"></div></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px;"><div class="form-group"><label class="form-label">Perfil</label><select id="userPerfil" class="form-input"><option value="USUARIO"' + (u.perfil === 'USUARIO' ? ' selected' : '') + '>Usuario</option><option value="TECNICO"' + (u.perfil === 'TECNICO' ? ' selected' : '') + '>Tecnico</option><option value="ADMIN"' + (u.perfil === 'ADMIN' ? ' selected' : '') + '>Admin</option></select></div>' +
        '<div class="form-group"><label class="form-label">' + (id ? 'Nova Senha (opcional)' : 'Senha *') + '</label><input type="password" id="userSenha" ' + (id ? '' : 'required') + ' minlength="6" class="form-input"></div></div></form>',
        '<button onclick="closeModal()" class="btn btn-ghost btn-sm">Cancelar</button><button onclick="document.getElementById(\'userForm\').requestSubmit()" class="btn btn-primary btn-sm"><i class="fas fa-save"></i> ' + (id ? 'Salvar' : 'Cadastrar') + '</button>'
    );
    document.getElementById('userForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        var p = { nomeCompleto: document.getElementById('userNome').value, email: document.getElementById('userEmail').value, perfil: document.getElementById('userPerfil').value };
        var pw = document.getElementById('userSenha').value; if (pw) p.senha = pw;
        if (!id) p.username = document.getElementById('userUsername').value;
        try {
            if (id) {
                await apiFetch('/api/usuarios/' + id, { method: 'PUT', body: JSON.stringify(p) });
                showToast('Usuario atualizado!');
            } else {
                await apiFetch('/api/usuarios', { method: 'POST', body: JSON.stringify(p) });
                showToast('Usuario cadastrado!');
            }
            closeModal(); loadUsuarios(); refreshAllData();
        } catch (e) { showToast(e.message, 'error'); }
    });
}

// ==========================================
// MODAL, CONFIRM, TOAST
// ==========================================
function openModal(title, body, footer) {
    document.getElementById('modal-title').innerHTML = '<i class="fas fa-desktop"></i> ' + title;
    document.getElementById('modal-body').innerHTML = body;
    document.getElementById('modal-footer').innerHTML = footer || '';
    document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() { document.getElementById('modal-overlay').classList.remove('active'); }

function confirmDelete(type, id, name) {
    document.getElementById('confirm-text').textContent = 'Tem certeza que deseja excluir "' + name + '"?';
    document.getElementById('confirm-overlay').classList.add('active');
    document.getElementById('confirm-yes-btn').onclick = async function() {
        try {
            if (type === 'computador') await apiFetch('/api/computadores/' + id, { method: 'DELETE' });
            else if (type === 'manutencao') await apiFetch('/api/manutencoes/' + id, { method: 'DELETE' });
            else if (type === 'ordem') await apiFetch('/api/ordens-servico/' + id, { method: 'DELETE' });
            else if (type === 'usuario') await apiFetch('/api/usuarios/' + id, { method: 'DELETE' });
            else if (type === 'departamento') await apiFetch('/api/departamentos/' + id, { method: 'DELETE' });
            showToast('Excluido com sucesso!');
            closeConfirm();
            refreshAllData();
        } catch (e) { showToast(e.message, 'error'); }
    };
}

function closeConfirm() { document.getElementById('confirm-overlay').classList.remove('active'); }

function showToast(message, type) {
    type = type || 'info';
    var c = document.getElementById('toast-container'), t = document.createElement('div');
    t.className = 'toast toast-' + type;
    var icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
    t.innerHTML = '<i class="fas ' + (icons[type] || icons.info) + '"></i><span>' + escapeHtml(message) + '</span>';
    c.appendChild(t);
    setTimeout(function() { t.classList.add('toast-out'); setTimeout(function() { t.remove(); }, 300); }, type === 'error' ? 5000 : 3500);
}

// ==========================================
// PAGINATION
// ==========================================
function renderPagination(containerId, totalPages, curPage, loadFn) {
    var c = document.getElementById(containerId);
    if (!c || totalPages <= 1) { if (c) c.innerHTML = ''; return; }
    var html = '<button class="pagination-btn" data-page="' + (curPage - 1) + '" ' + (curPage === 0 ? 'disabled' : '') + '><i class="fas fa-chevron-left"></i></button>';
    for (var i = 0; i < totalPages; i++) { html += '<button class="pagination-btn ' + (i === curPage ? 'active' : '') + '" data-page="' + i + '">' + (i + 1) + '</button>'; }
    html += '<button class="pagination-btn" data-page="' + (curPage + 1) + '" ' + (curPage >= totalPages - 1 ? 'disabled' : '') + '><i class="fas fa-chevron-right"></i></button>';
    c.innerHTML = html;
    c.querySelectorAll('.pagination-btn').forEach(function(btn) {
        btn.addEventListener('click', function() { var p = parseInt(btn.dataset.page); if (!isNaN(p) && p >= 0 && p < totalPages) loadFn(p); });
    });
}

// ==========================================
// UTILITIES
// ==========================================
function escapeHtml(t) { if (!t) return ''; var m = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }; return String(t).replace(/[&<>"']/g, function(c) { return m[c]; }); }
function escapeAttr(t) { if (!t) return ''; return String(t).replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
function formatNumber(num) { return Number(num).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function formatFileSize(bytes) { if (bytes < 1024) return bytes + ' B'; if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB'; return (bytes / (1024 * 1024)).toFixed(1) + ' MB'; }
function debounce(fn, delay) { var t; return function() { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function() { fn.apply(c, a); }, delay); }; }

function getComputerPhoto(eq, size) {
    size = size || {};
    var w = size.w || 200, h = size.h || 150;
    var brand = (eq && eq.modeloMarca) ? eq.modeloMarca.split(' ')[0].toUpperCase() : 'PC';
    var svg = generatePlaceholderSVG(eq ? eq.modeloMarca : 'PC', w, h);
    if (eq && eq.fotoUrl && eq.fotoUrl.trim() !== '') {
        return '<div class="pc-photo-container"><img src="' + escapeHtml(eq.fotoUrl) + '" alt="' + escapeHtml(eq.nomePc) + '" style="width:100%;height:100%;object-fit:contain;" onload="this.style.display=\'block\';var fb=this.nextElementSibling;if(fb)fb.style.display=\'none\';" onerror="this.style.display=\'none\';var fb=this.nextElementSibling;if(fb)fb.style.display=\'flex\';"><div class="pc-photo-fallback" style="display:flex;width:100%;height:100%;align-items:center;justify-content:center;">' + svg + '</div></div>';
    }
    return svg;
}

function generatePlaceholderSVG(modelo, w, h) {
    w = w || 200; h = h || 150;
    var brand = (modelo || 'PC').split(' ')[0].toUpperCase();
    var colorMap = { 'DELL': '#3b82f6', 'LENOVO': '#34d399', 'HP': '#ff9f43', 'ACER': '#b24dff', 'SAMSUNG': '#00e5c7', 'POSITIVO': '#fbbf24', 'APPLE': '#9ca3af' };
    var color = '#4e5a72';
    for (var k in colorMap) { if (brand.indexOf(k) !== -1) { color = colorMap[k]; break; } }
    var isLaptop = modelo && (modelo.toLowerCase().indexOf('thinkpad') !== -1 || modelo.toLowerCase().indexOf('latitude') !== -1 || modelo.toLowerCase().indexOf('proone') !== -1 || modelo.toLowerCase().indexOf('notebook') !== -1);
    if (isLaptop) {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '"><rect width="' + w + '" height="' + h + '" fill="#1f2937"/><rect x="' + Math.round(w * 0.15) + '" y="' + Math.round(h * 0.1) + '" width="' + Math.round(w * 0.7) + '" height="' + Math.round(h * 0.5) + '" rx="6" fill="#374151" stroke="#4b5563"/><rect x="' + Math.round(w * 0.18) + '" y="' + Math.round(h * 0.14) + '" width="' + Math.round(w * 0.64) + '" height="' + Math.round(h * 0.4) + '" rx="3" fill="#111827"/><rect x="' + Math.round(w * 0.25) + '" y="' + Math.round(h * 0.62) + '" width="' + Math.round(w * 0.5) + '" height="' + Math.round(h * 0.04) + '" rx="2" fill="#4b5563"/><rect x="' + Math.round(w * 0.2) + '" y="' + Math.round(h * 0.68) + '" width="' + Math.round(w * 0.6) + '" height="' + Math.round(h * 0.03) + '" rx="2" fill="#4b5563"/><text x="' + Math.round(w / 2) + '" y="' + Math.round(h * 0.4) + '" text-anchor="middle" fill="' + color + '" font-size="' + Math.round(h * 0.08) + '" font-family="Arial,sans-serif" font-weight="bold">' + escapeHtml(brand) + '</text></svg>';
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '"><rect width="' + w + '" height="' + h + '" fill="#1f2937"/><rect x="' + Math.round(w * 0.25) + '" y="' + Math.round(h * 0.08) + '" width="' + Math.round(w * 0.5) + '" height="' + Math.round(h * 0.52) + '" rx="6" fill="#374151" stroke="#4b5563"/><rect x="' + Math.round(w * 0.28) + '" y="' + Math.round(h * 0.12) + '" width="' + Math.round(w * 0.44) + '" height="' + Math.round(h * 0.4) + '" rx="3" fill="#111827"/><rect x="' + Math.round(w * 0.38) + '" y="' + Math.round(h * 0.62) + '" width="' + Math.round(w * 0.24) + '" height="' + Math.round(h * 0.06) + '" rx="2" fill="#4b5563"/><rect x="' + Math.round(w * 0.3) + '" y="' + Math.round(h * 0.7) + '" width="' + Math.round(w * 0.4) + '" height="' + Math.round(h * 0.03) + '" rx="2" fill="#4b5563"/><text x="' + Math.round(w / 2) + '" y="' + Math.round(h * 0.38) + '" text-anchor="middle" fill="' + color + '" font-size="' + Math.round(h * 0.09) + '" font-family="Arial,sans-serif" font-weight="bold">' + escapeHtml(brand) + '</text></svg>';
}

// ==========================================
// MANUAL
// ==========================================
function showManual() {
    openModal('Manual do Sistema',
        '<div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">' +
        '<h3 style="color:var(--cyan);font-size:15px;margin-bottom:10px;">1. Visao Geral</h3>' +
        '<p>O sistema de Inventario de TI permite gerenciar computadores, manutencoes, ordens de servico, setores e usuarios. O dashboard fornece uma visao completa do inventario.</p>' +
        '<h3 style="color:var(--cyan);font-size:15px;margin:14px 0 10px;">2. Computadores</h3>' +
        '<p>Cadastre equipamentos com tres abas: <b>Geral</b> (dados basicos), <b>Foto</b> (upload de imagem) e <b>Detalhes</b> (setor, IP, SO, etc). Use os filtros e busca para encontrar equipamentos. Acoes em massa disponiveis para usuarios ADMIN.</p>' +
        '<h3 style="color:var(--cyan);font-size:15px;margin:14px 0 10px;">3. Manutencoes</h3>' +
        '<p>Registre manutencoes corretivas, preventivas, preditivas ou emergenciais. Ao cadastrar uma manutencao, uma OS e criada automaticamente. Ao concluir, o status do computador e atualizado.</p>' +
        '<h3 style="color:var(--cyan);font-size:15px;margin:14px 0 10px;">4. Ordens de Servico</h3>' +
        '<p>Gerencie tickets de suporte com prioridade, status, responsavel e solucao. Clique em uma OS na tabela para editar. Use filtros por status e prioridade.</p>' +
        '<h3 style="color:var(--cyan);font-size:15px;margin:14px 0 10px;">5. Setores</h3>' +
        '<p>Gerencie os setores da empresa. Apenas nome e necessario. O numero de computadores vinculados e exibido automaticamente.</p>' +
        '<h3 style="color:var(--cyan);font-size:15px;margin:14px 0 10px;">6. Historico</h3>' +
        '<p>Visualize todas as operacoes realizadas no sistema com filtros por entidade (Computador, Manutencao, OS, etc).</p>' +
        '<h3 style="color:var(--cyan);font-size:15px;margin:14px 0 10px;">7. Relatorios</h3>' +
        '<p>Visualize graficos e estatisticas detalhadas. Clique nos cards de estatisticas para ver os itens individuais. Exporte em CSV ou imprima em PDF.</p>' +
        '<h3 style="color:var(--cyan);font-size:15px;margin:14px 0 10px;">8. Ferramentas</h3>' +
        '<p>Painel administrativo com status do sistema, H2 Console, Swagger, Actuator e metricas. Apenas usuarios ADMIN tem acesso.</p>' +
        '</div>',
        '<button onclick="closeModal()" class="btn btn-ghost btn-sm">Fechar</button>'
    );
}

// ==========================================
// ADMIN TOOLS FUNCTIONS
// ==========================================
function showSystemInfo() {
    apiFetch('/actuator/health').then(function(data) {
        var status = (data && data.status) ? data.status : 'UNKNOWN';
        var dbStatus = 'H2 (embedded)';
        if (data && data.components && data.components.db) {
            dbStatus = data.components.db.details ? (data.components.db.details.database || dbStatus) : dbStatus;
        }
        openModal('Status do Sistema',
            '<div style="padding:10px;">' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">' +
            '<div class="stat-card" style="text-align:center;padding:16px;"><div class="stat-card-value" style="color:var(--cyan);font-size:20px;">' + status + '</div><div class="stat-card-label">Status Geral</div></div>' +
            '<div class="stat-card" style="text-align:center;padding:16px;"><div class="stat-card-value" style="color:var(--green);font-size:20px;">' + dbStatus + '</div><div class="stat-card-label">Banco de Dados</div></div>' +
            '</div>' +
            '<div style="font-size:12px;color:var(--text-muted);">' +
            '<p><b>Servidor:</b> Spring Boot 3.2.5 + Java 21</p>' +
            '<p><b>Banco:</b> H2 Database (arquivo ./data/inventario_db)</p>' +
            '<p><b>Porta:</b> 3030</p>' +
            '<p><b>URL:</b> localhost:3030</p>' +
            '</div></div>',
            '<button onclick="closeModal()" class="btn btn-ghost btn-sm">Fechar</button>'
        );
    }).catch(function() {
        openModal('Status do Sistema',
            '<div style="padding:10px;text-align:center;"><p style="color:var(--red);font-size:14px;">Nao foi possivel obter informacoes do sistema.</p></div>',
            '<button onclick="closeModal()" class="btn btn-ghost btn-sm">Fechar</button>'
        );
    });
}

function clearSystemCache() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('currentTab');
    showToast('Cache limpo com sucesso!', 'success');
    setTimeout(function() { location.reload(); }, 800);
}

function showBackupInfo() {
    openModal('Backup do Banco de Dados',
        '<div style="padding:10px;font-size:13px;color:var(--text-secondary);line-height:1.8;">' +
        '<p>O banco de dados e armazenado em arquivo local no servidor:</p>' +
        '<div style="background:rgba(0,0,0,0.3);padding:12px;border-radius:8px;margin:10px 0;font-family:monospace;font-size:12px;color:var(--cyan);">./data/inventario_db.mv.db</div>' +
        '<p><b>Como fazer backup:</b></p>' +
        '<ol style="padding-left:18px;margin:6px 0;">' +
        '<li>Pare o servidor</li>' +
        '<li>Copie o arquivo <code style="color:var(--cyan);">inventario_db.mv.db</code> da pasta <code style="color:var(--cyan);">data/</code></li>' +
        '<li>Salve o arquivo em local seguro</li>' +
        '<li>Reinicie o servidor</li>' +
        '</ol>' +
        '<p style="color:var(--red);margin-top:10px;"><b>Importante:</b> O arquivo de banco e o unico necessario para restaurar todos os dados do sistema.</p>' +
        '</div>',
        '<button onclick="closeModal()" class="btn btn-ghost btn-sm">Fechar</button>'
    );
}

// ==========================================
// CSV EXPORT/IMPORT
// ==========================================
function exportComputadoresCSV() {
    apiFetch('/api/computadores/export/csv').then(function(r) { showToast(r.mensagem || 'Exportacao concluida!', 'success'); }).catch(function(e) { showToast(e.message, 'error'); });
}

function importComputadoresCSV(event) {
    var file = event.target.files[0];
    if (!file) return;
    var fd = new FormData();
    fd.append('file', file);
    fetch(API + '/api/computadores/import/csv', { method: 'POST', headers: { 'Authorization': 'Bearer ' + getToken() }, body: fd })
        .then(function(r) { return r.json(); })
        .then(function(d) { showToast('Importados: ' + (d.importados || 0) + ' | Ignorados: ' + (d.ignorados || 0), 'success'); loadComputadores(0); })
        .catch(function(e) { showToast('Erro na importacao', 'error'); });
    event.target.value = '';
}

// ==========================================
// FILTERS & INIT
// ==========================================
function initFilters() {
    var b = document.getElementById('busca-input'), f = document.getElementById('filtro-status');
    if (b) b.addEventListener('input', debounce(function() { loadComputadores(0); }, 400));
    if (f) f.addEventListener('change', function() { loadComputadores(0); });
    var mf = document.getElementById('man-filtro-status'); if (mf) mf.addEventListener('change', function() { loadManutencoes(0); });
    var mb = document.getElementById('man-busca-input'); if (mb) mb.addEventListener('input', debounce(function() { loadManutencoes(0); }, 400));
    var osf = document.getElementById('os-filtro-status'), opf = document.getElementById('os-filtro-prioridade');
    if (osf) osf.addEventListener('change', function() { loadOrdensServico(0); });
    if (opf) opf.addEventListener('change', function() { loadOrdensServico(0); });
    var osb = document.getElementById('os-busca-input'); if (osb) osb.addEventListener('input', debounce(function() { loadOrdensServico(0); }, 400));
    var db = document.getElementById('depto-busca-input'); if (db) db.addEventListener('input', debounce(function() { loadDepartamentos(); }, 400));
    var ub = document.getElementById('user-busca-input'); if (ub) ub.addEventListener('input', debounce(function() { loadUsuarios(); }, 400));
    var lu = document.getElementById('log-busca-usuario'); if (lu) lu.addEventListener('input', debounce(function() { loadLogs(0); }, 400));
    var le = document.getElementById('log-filtro-entidade'); if (le) le.addEventListener('change', function() { loadLogs(0); });
}

// GLOBAL REFRESH HELPER
function refreshCurrentSection() {
    switch (_currentSection) {
        case 'painel': loadDashboard(); break;
        case 'computadores': loadComputadores(currentPage.computadores); break;
        case 'manutencoes': loadManutencoes(currentPage.manutencoes); break;
        case 'ordens-servico': loadOrdensServico(currentPage.ordensServico); break;
        case 'departamentos': loadDepartamentos(); break;
        case 'logs': loadLogs(currentPage.logs); break;
        case 'relatorios': loadRelatorios(); break;
        case 'usuarios': loadUsuarios(); break;
        case 'admin': loadAdmin(); break;
    }
}

function refreshAllData() {
    loadDashboard().catch(function() {});
    refreshCurrentSection();
    closeManKpiDetail();
    closeOsKpiDetail();
}

// OVERLAY CLICK
document.getElementById('modal-overlay')?.addEventListener('click', function(e) { if (e.target === e.currentTarget) closeModal(); });
document.getElementById('confirm-overlay')?.addEventListener('click', function(e) { if (e.target === e.currentTarget) closeConfirm(); });

// ESCAPE KEY
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (_activeStatKey) closeStatDetail();
        if (_activeKpiKey) closeKpiDetail();
        if (_activeManKpiKey) closeManKpiDetail();
        if (_activeOsKpiKey) closeOsKpiDetail();
        closeModal();
        closeConfirm();
    }
});

// INIT
document.addEventListener('DOMContentLoaded', function() { checkAuth(); initFilters(); showSection('painel'); });
