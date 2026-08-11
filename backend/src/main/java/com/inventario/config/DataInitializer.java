package com.inventario.config;

import com.inventario.model.*;
import com.inventario.model.enums.*;
import com.inventario.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ComputadorRepository computadorRepository;
    private final ManutencaoRepository manutencaoRepository;
    private final OrdemServicoRepository ordemServicoRepository;
    private final DepartamentoRepository departamentoRepository;
    private final CheckinCheckoutRepository checkinCheckoutRepository;
    private final LogAtividadeRepository logAtividadeRepository;
    private final SoftwareLicencaRepository softwareLicencaRepository;
    private final FornecedorRepository fornecedorRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("Criando usuarios iniciais...");
            createUser("admin", "admin123", "Administrador", "admin@sistema.com", PerfilUsuario.ADMIN);
            createUser("tecnico", "tecnico123", "Tecnico de TI", "tecnico@sistema.com", PerfilUsuario.TECNICO);
            createUser("usuario", "usuario123", "Usuario Comum", "usuario@sistema.com", PerfilUsuario.USUARIO);
            createUser("joao.silva", "joao123", "Joao Silva", "joao@sistema.com", PerfilUsuario.USUARIO);
            createUser("maria.santos", "maria123", "Maria Santos", "maria@sistema.com", PerfilUsuario.USUARIO);
            createUser("pedro.costa", "pedro123", "Pedro Costa", "pedro@sistema.com", PerfilUsuario.TECNICO);
            createUser("ana.oliveira", "ana123", "Ana Oliveira", "ana@sistema.com", PerfilUsuario.USUARIO);
            createUser("carlos.pereira", "carlos123", "Carlos Pereira", "carlos@sistema.com", PerfilUsuario.TECNICO);
            createUser("lucia.ferreira", "lucia123", "Lucia Ferreira", "lucia@sistema.com", PerfilUsuario.USUARIO);
            log.info("9 usuarios criados com sucesso!");
        }

        if (computadorRepository.count() == 0) {
            log.info("Criando equipamentos iniciais...");
            createComputador("PC-TI-001", "SN-2024-001", "Dell Optiplex 7090", "Intel Core i7-11700", "16GB", "512GB SSD", "Joao Silva", "Dell", StatusComputador.ATIVO, LocalDateTime.now().minusMonths(1));
            createComputador("PC-TI-002", "SN-2024-002", "HP ProDesk 400 G7", "Intel Core i5-10500", "8GB", "256GB SSD", "Maria Santos", "HP", StatusComputador.ATIVO, LocalDateTime.now().minusMonths(2));
            createComputador("PC-TI-003", "SN-2024-003", "Lenovo ThinkCentre M70s", "Intel Core i5-11500", "16GB", "512GB SSD", "Pedro Costa", "Lenovo", StatusComputador.ATIVO, LocalDateTime.now().minusMonths(5));
            createComputador("PC-TI-004", "SN-2024-004", "Dell Latitude 5520", "Intel Core i7-1165G7", "16GB", "1TB SSD", "Ana Oliveira", "Dell", StatusComputador.ATIVO, LocalDateTime.now().minusMonths(3));
            createComputador("PC-TI-005", "SN-2024-005", "HP EliteDesk 800 G5", "Intel Core i7-9700", "32GB", "512GB SSD", "Carlos Pereira", "HP", StatusComputador.MANUTENCAO_EMERGENCIAL, LocalDateTime.now().minusMonths(11));
            createComputador("PC-TI-006", "SN-2024-006", "Lenovo ThinkPad T480", "Intel Core i5-8250U", "8GB", "256GB SSD", "Lucia Ferreira", "Lenovo", StatusComputador.ATIVO, LocalDateTime.now().minusMonths(6));
            createComputador("PC-TI-007", "SN-2024-007", "Acer Aspire TC-780", "Intel Core i3-7100", "4GB", "1TB HDD", "Roberto Almeida", "Acer", StatusComputador.ATIVO, LocalDateTime.now().minusMonths(7));
            createComputador("PC-TI-008", "SN-2024-008", "Dell Inspiron 3670", "Intel Core i5-8400", "8GB", "1TB HDD", "Fernanda Lima", "Dell", StatusComputador.ATIVO, LocalDateTime.now().minusMonths(4));
            createComputador("PC-TI-009", "SN-2024-009", "HP Pavilion 590", "Intel Core i5-8500", "12GB", "256GB SSD + 1TB HDD", "Ricardo Souza", "HP", StatusComputador.ATIVO, LocalDateTime.now().minusMonths(10));
            createComputador("PC-TI-010", "SN-2024-010", "Lenovo IdeaCentre 510", "AMD Ryzen 5 3600", "8GB", "512GB SSD", "Juliana Martins", "Lenovo", StatusComputador.ATIVO, LocalDateTime.now().minusMonths(1));
            createComputador("PC-TI-011", "SN-2024-011", "Dell OptiPlex 3080", "Intel Core i3-10100", "4GB", "128GB SSD", "Marcos Ribeiro", "Dell", StatusComputador.MANUTENCAO_PREVENTIVA, LocalDateTime.now().minusMonths(7));
            createComputador("PC-TI-012", "SN-2024-012", "HP ProBook 450 G7", "Intel Core i5-10210U", "8GB", "512GB SSD", "Patricia Gomes", "HP", StatusComputador.ATIVO, LocalDateTime.now().minusMonths(2));
            createComputador("PC-TI-013", "SN-2024-013", "Lenovo V530", "Intel Core i7-8700", "16GB", "256GB SSD", "Thiago Nunes", "Lenovo", StatusComputador.ATIVO, LocalDateTime.now().minusMonths(12));
            createComputador("PC-TI-014", "SN-2024-014", "Acer Veriton M4660G", "Intel Core i5-9400", "8GB", "1TB HDD", "Camila Araujo", "Acer", StatusComputador.ATIVO, LocalDateTime.now().minusMonths(9));
            createComputador("PC-TI-015", "SN-2024-015", "Dell Vostro 3670", "Intel Core i3-9100", "4GB", "1TB HDD", "Eduardo Barbosa", "Dell", StatusComputador.ATIVO, LocalDateTime.now().minusMonths(3));
            createComputador("PC-TI-016", "SN-2024-016", "HP 280 G3", "Intel Core i5-8500", "8GB", "256GB SSD", "Vanessa Dias", "HP", StatusComputador.ATIVO, LocalDateTime.now().minusMonths(5));
            createComputador("PC-TI-017", "SN-2024-017", "Lenovo ThinkCentre M920t", "Intel Core i7-8700", "32GB", "512GB SSD", "Leonardo Cardoso", "Lenovo", StatusComputador.MANUTENCAO_PREDITIVA, LocalDateTime.now().minusMonths(6));
            createComputador("PC-TI-018", "SN-2024-018", "Dell Precision 3630", "Intel Xeon E-2124", "16GB", "256GB SSD", "Amanda Rocha", "Dell", StatusComputador.ATIVO, LocalDateTime.now().minusMonths(4));
            createComputador("PC-TI-019", "SN-2024-019", "HP Z240 Tower", "Intel Core i5-7500", "8GB", "512GB SSD", "Bruno Carvalho", "HP", StatusComputador.ATIVO, LocalDateTime.now().minusMonths(8));
            createComputador("PC-TI-020", "SN-2024-020", "Lenovo ThinkStation P330", "Intel Core i7-8700", "32GB", "1TB SSD", "Sabrina Melo", "Lenovo", StatusComputador.ATIVO, LocalDateTime.now().minusMonths(1));
            log.info("20 equipamentos criados com sucesso!");
        }

        if (manutencaoRepository.count() == 0 && computadorRepository.count() > 0) {
            log.info("Criando manutencoes iniciais...");
            var computadores = computadorRepository.findAll();
            if (computadores.size() >= 5) {
                createManutencao(computadores.get(0), TipoManutencao.PREVENTIVA, StatusManutencao.CONCLUIDA,
                    "Troca de pasta termica e limpeza geral do equipamento",
                    "Carlos Pereira", "Pasta termica Artic MX-5",
                    "Equipamento operando normalmente");
                createManutencao(computadores.get(1), TipoManutencao.CORRETIVA, StatusManutencao.EM_ANDAMENTO,
                    "Substituicao de HD danificado por SSD de 240GB",
                    "Pedro Costa", "SSD Kingston A400 240GB",
                    "Backup realizado. Aguardando instalacao do SO");
                createManutencao(computadores.get(2), TipoManutencao.PREDITIVA, StatusManutencao.PENDENTE,
                    "Atualizacao de firmware e verificacao de saude do disco",
                    "Carlos Pereira", "", "");
                createManutencao(computadores.get(3), TipoManutencao.EMERGENCIAL, StatusManutencao.CONCLUIDA,
                    "Remocao de malware e formatacao completa do sistema",
                    "Pedro Costa", "Nenhuma",
                    "Sistema reinstalado com Windows 11 Pro");
                createManutencao(computadores.get(4), TipoManutencao.PREVENTIVA, StatusManutencao.PENDENTE,
                    "Limpeza preventiva trimestral e verificacao de drivers",
                    "Carlos Pereira", "Filtro de po",
                    "Agendar para horario comercial");
                log.info("5 manutencoes criadas com sucesso!");
            }
        }

        if (ordemServicoRepository.count() == 0 && computadorRepository.count() > 0) {
            log.info("Criando ordens de servico iniciais...");
            var computadores = computadorRepository.findAll();
            if (computadores.size() >= 5) {
                createOrdemServico("Instalar novo software de controle de acesso",
                    "Solicitar instalacao do software BioAccess v3.0 nos PCs da recepcao. Licencas ja adquiridas.",
                    computadores.get(1), PrioridadeOrdemServico.ALTA, StatusOrdemServico.EM_EXECUCAO,
                    "Gerencia de TI", "Joao Silva",
                    LocalDateTime.now().plusDays(10));
                createOrdemServico("Corrigir falha de rede cabethada",
                    "PC apresenta desconexoes frequentes da rede. Verificar placa de rede e cabos.",
                    computadores.get(3), PrioridadeOrdemServico.CRITICA, StatusOrdemServico.EM_ANALISE,
                    "Maria Santos", "Carlos Pereira",
                    LocalDateTime.now().plusDays(3));
                createOrdemServico("Configurar impressora em rede",
                    "Instalar e configurar impressora HP LaserJet Pro na rede do setor financeiro.",
                    computadores.get(5), PrioridadeOrdemServico.MEDIA, StatusOrdemServico.CONCLUIDA,
                    "Lucia Ferreira", "Pedro Costa",
                    LocalDateTime.now().minusDays(2));
                createOrdemServico("Atualizar BIOS de todos PCs Dell",
                    "Verificar e atualizar BIOS de todos equipamentos Dell para versao mais recente.",
                    computadores.get(10), PrioridadeOrdemServico.BAIXA, StatusOrdemServico.ABERTA,
                    "Carlos Pereira", "",
                    LocalDateTime.now().plusDays(30));
                createOrdemServico("Configurar VPN corporativa",
                    "Configurar conexao VPN para acesso remoto ao servidor de desenvolvimento.",
                    computadores.get(0), PrioridadeOrdemServico.ALTA, StatusOrdemServico.CONCLUIDA,
                    "Joao Silva", "Joao Silva",
                    LocalDateTime.now().minusDays(5));
                log.info("5 ordens de servico criadas com sucesso!");
            }
        }

        if (departamentoRepository.count() == 0) {
            log.info("Criando departamentos iniciais...");
            createDepartamento("TI", "Departamento de Tecnologia da Informacao", "Joao Silva");
            createDepartamento("Financeiro", "Departamento Financeiro", "Ana Oliveira");
            createDepartamento("RH", "Departamento de Recursos Humanos", "Lucia Ferreira");
            createDepartamento("Marketing", "Departamento de Marketing", "Juliana Martins");
            createDepartamento("Operacoes", "Departamento de Operacoes", "Marcos Ribeiro");
            log.info("5 departamentos criados com sucesso!");
        }

        if (checkinCheckoutRepository.count() == 0 && computadorRepository.count() >= 3) {
            log.info("Criando checkouts iniciais...");
            var computadores = computadorRepository.findAll();
            createCheckout(computadores.get(0), "Joao Silva", "Equipamento para novo funcionario", "admin");
            createCheckout(computadores.get(1), "Maria Santos", "Equipamento para estagiario", "tecnico");
            createCheckout(computadores.get(3), "Ana Oliveira", "Substituicao de equipamento antigo", "admin");
            log.info("3 checkouts criados com sucesso!");
        }

        if (logAtividadeRepository.count() == 0) {
            log.info("Criando logs iniciais...");
            logAtividadeRepository.save(LogAtividade.builder()
                .usuario("admin").acao("LOGIN").entidade("USUARIO").descricao("Login realizado com sucesso")
                .dataAtividade(LocalDateTime.now().minusHours(2)).build());
            logAtividadeRepository.save(LogAtividade.builder()
                .usuario("admin").acao("CRIACAO").entidade("COMPUTADOR").entidadeId(1L).descricao("Computador PC-TI-001 cadastrado")
                .dataAtividade(LocalDateTime.now().minusHours(1)).build());
            log.info("Logs iniciais criados com sucesso!");
        }

        if (softwareLicencaRepository.count() == 0) {
            log.info("Criando licencas de software iniciais...");
            createSoftwareLicenca("Microsoft Office 365", "Microsoft", "XXXXX-XXXXX-XXXXX", "assinatura", 50, 35, LocalDate.of(2024, 1, 1), LocalDate.of(2025, 1, 1));
            createSoftwareLicenca("Windows 11 Pro", "Microsoft", "XXXXX-XXXXX-XXXXX", "volume", 50, 20, LocalDate.of(2024, 1, 1), null);
            createSoftwareLicenca("Adobe Creative Cloud", "Adobe", "XXXXX-XXXXX-XXXXX", "assinatura", 10, 8, LocalDate.of(2024, 3, 1), LocalDate.of(2025, 3, 1));
            createSoftwareLicenca("Kaspersky Endpoint Security", "Kaspersky", "XXXXX-XXXXX-XXXXX", "volume", 50, 20, LocalDate.of(2024, 1, 1), LocalDate.of(2025, 1, 1));
            createSoftwareLicenca("AutoCAD", "Autodesk", "XXXXX-XXXXX-XXXXX", "assinatura", 5, 3, LocalDate.of(2024, 6, 1), LocalDate.of(2025, 6, 1));
            log.info("5 licencas de software criadas com sucesso!");
        }

        if (fornecedorRepository.count() == 0) {
            log.info("Criando fornecedores iniciais...");
            createFornecedor("Dell Technologies", "12.345.678/0001-00", "contato@dell.com.br", "(11) 3000-1000", "Carlos Vendas", "Av Paulista 1000, SP");
            createFornecedor("Lenovo Brasil", "12.345.678/0002-00", "vendas@lenovo.com.br", "(11) 4000-2000", "Ana Comercial", "Rua Augusta 500, SP");
            createFornecedor("HP Brasil", "12.345.678/0003-00", "vendas@hp.com.br", "(11) 5000-3000", "Pedro Vendas", "Av Faria Lima 200, SP");
            createFornecedor("Microsiga (Software)", "12.345.678/0004-00", "contato@microsiga.com", "(11) 6000-4000", "Joao Comercial", "Rua Vergueiro 300, SP");
            createFornecedor("TechData Distribuidora", "12.345.678/0005-00", "vendas@techdata.com.br", "(11) 7000-5000", "Lucia Vendas", "Rua Liberdade 400, SP");
            log.info("5 fornecedores criados com sucesso!");
        }
    }

    private void createDepartamento(String nome, String descricao, String responsavel) {
        Departamento d = Departamento.builder()
            .nome(nome).build();
        departamentoRepository.save(d);
    }

    private void createCheckout(Computador comp, String usuario, String obs, String realizadoPor) {
        CheckinCheckout cc = CheckinCheckout.builder()
            .computador(comp).usuarioResponsavel(usuario).tipo("CHECKOUT")
            .observacao(obs).realizadoPor(realizadoPor).status("ATIVO").build();
        checkinCheckoutRepository.save(cc);
        comp.setUsuarioDesignado(usuario);
        computadorRepository.save(comp);
    }

    private void createSoftwareLicenca(String nome, String fabricante, String chave, String tipo, int total, int usados, LocalDate aquisicao, LocalDate expiracao) {
        SoftwareLicenca s = SoftwareLicenca.builder()
            .nomeSoftware(nome).fabricante(fabricante).chaveLicenca(chave)
            .tipoLicenca(tipo).quantidadeTotal(total).quantidadeUtilizada(usados)
            .dataAquisicao(aquisicao).dataExpiracao(expiracao)
            .build();
        softwareLicencaRepository.save(s);
    }

    private void createFornecedor(String nome, String cnpj, String email, String telefone, String contato, String endereco) {
        Fornecedor f = Fornecedor.builder()
            .nome(nome).cnpj(cnpj).email(email).telefone(telefone)
            .contato(contato).endereco(endereco).build();
        fornecedorRepository.save(f);
    }

    private void createUser(String username, String senha, String nome, String email, PerfilUsuario perfil) {
        User user = User.builder()
            .username(username)
            .senha(passwordEncoder.encode(senha))
            .nomeCompleto(nome)
            .email(email)
            .perfil(perfil)
            .ativo(true)
            .tentativasLogin(0)
            .build();
        userRepository.save(user);
    }

    private void createComputador(String nomePc, String numeroSerie, String modeloMarca, String processador,
                                   String memoriaRam, String armazenamento, String usuarioDesignado,
                                   String fornecedor, StatusComputador status, LocalDateTime dataInicioCiclo) {
        Computador c = Computador.builder()
            .nomePc(nomePc)
            .numeroSerie(numeroSerie)
            .modeloMarca(modeloMarca)
            .processador(processador)
            .memoriaRam(memoriaRam)
            .armazenamento(armazenamento)
            .usuarioDesignado(usuarioDesignado)
            .fornecedor(fornecedor)
            .status(status)
            .manutencaoConcluidaSemestre(false)
            .dataInicioCiclo(dataInicioCiclo)
            .build();
        computadorRepository.save(c);
    }

    private void createManutencao(Computador computador, TipoManutencao tipo, StatusManutencao status,
                                   String descricao, String tecnico,
                                   String pecas, String observacoes) {
        Manutencao m = Manutencao.builder()
            .computador(computador)
            .tipo(tipo)
            .status(status)
            .descricao(descricao)
            .tecnicoResponsavel(tecnico)
            .pecasTrocadas(pecas)
            .observacoes(observacoes)
            .build();
        if (status == StatusManutencao.EM_ANDAMENTO) m.setDataInicio(LocalDateTime.now().minusDays(3));
        if (status == StatusManutencao.CONCLUIDA) {
            m.setDataInicio(LocalDateTime.now().minusDays(10));
            m.setDataConclusao(LocalDateTime.now().minusDays(5));
        }
        manutencaoRepository.save(m);
    }

    private void createOrdemServico(String titulo, String descricao, Computador computador,
                                     PrioridadeOrdemServico prioridade, StatusOrdemServico status,
                                     String solicitante, String tecnico, LocalDateTime dataPrevisao) {
        OrdemServico os = OrdemServico.builder()
            .titulo(titulo)
            .descricao(descricao)
            .computador(computador)
            .prioridade(prioridade)
            .status(status)
            .solicitante(solicitante)
            .tecnicoResponsavel(tecnico)
            .dataPrevisao(dataPrevisao)
            .build();
        if (status == StatusOrdemServico.CONCLUIDA) {
            os.setDataConclusao(LocalDateTime.now().minusDays(1));
            os.setSolucao("Ordem concluida com sucesso.");
        }
        ordemServicoRepository.save(os);
    }
}
