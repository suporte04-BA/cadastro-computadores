package com.inventario.model;

import com.inventario.model.enums.StatusComputador;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "computadores", indexes = {
    @Index(name = "idx_numero_serie", columnList = "numero_serie", unique = true),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_usuario", columnList = "usuario_designado"),
    @Index(name = "idx_fornecedor", columnList = "fornecedor"),
    @Index(name = "idx_departamento", columnList = "departamento")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Computador extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome do PC e obrigatorio")
    @Size(max = 100)
    @Column(name = "nome_pc", length = 100, nullable = false)
    private String nomePc;

    @NotBlank(message = "Numero de serie e obrigatorio")
    @Size(max = 50)
    @Column(name = "numero_serie", length = 50, nullable = false, unique = true)
    private String numeroSerie;

    @NotBlank(message = "Modelo/Marca e obrigatorio")
    @Size(max = 100)
    @Column(name = "modelo_marca", length = 100, nullable = false)
    private String modeloMarca;

    @NotBlank(message = "Processador e obrigatorio")
    @Size(max = 100)
    @Column(name = "processador", length = 100, nullable = false)
    private String processador;

    @NotBlank(message = "Memoria RAM e obrigatoria")
    @Size(max = 50)
    @Column(name = "memoria_ram", length = 50, nullable = false)
    private String memoriaRam;

    @NotBlank(message = "Armazenamento e obrigatorio")
    @Size(max = 50)
    @Column(name = "armazenamento", length = 50, nullable = false)
    private String armazenamento;

    @Size(max = 100)
    @Column(name = "usuario_designado", length = 100)
    private String usuarioDesignado;

    @Size(max = 100)
    @Column(name = "fornecedor", length = 100)
    private String fornecedor;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 30, nullable = false)
    private StatusComputador status = StatusComputador.ATIVO;

    @Column(name = "foto_url", columnDefinition = "TEXT")
    private String fotoUrl;

    @Column(name = "data_ultima_manutencao")
    private LocalDateTime dataUltimaManutencao;

    @Column(name = "manutencao_concluida_semestre")
    private Boolean manutencaoConcluidaSemestre = false;

    @Column(name = "proxima_manutencao")
    private LocalDateTime proximaManutencao;

    @Column(name = "data_inicio_ciclo")
    private LocalDateTime dataInicioCiclo;

    @Column(name = "fase_ciclo", length = 20)
    private String faseCiclo;

    @Column(name = "data_aquisicao")
    private LocalDate dataAquisicao;

    @Column(name = "data_garantia")
    private LocalDate dataGarantia;

    @Size(max = 100)
    @Column(name = "departamento", length = 100)
    private String departamento;

    @Size(max = 150)
    @Column(name = "localizacao", length = 150)
    private String localizacao;

    @Size(max = 50)
    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Size(max = 50)
    @Column(name = "sistema_operacional", length = 50)
    private String sistemaOperacional;

    @Size(max = 200)
    @Column(name = "software_instalado", length = 200)
    private String softwareInstalado;

    @Column(name = "notas", columnDefinition = "TEXT")
    private String notas;

    @PrePersist
    protected void onCreate() {
        if (status == null) status = StatusComputador.ATIVO;
        if (manutencaoConcluidaSemestre == null) manutencaoConcluidaSemestre = false;
    }
}
