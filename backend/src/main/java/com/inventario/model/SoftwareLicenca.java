package com.inventario.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "software_licencas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SoftwareLicenca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_software", length = 150, nullable = false)
    private String nomeSoftware;

    @Column(name = "fabricante", length = 100)
    private String fabricante;

    @Column(name = "chave_licenca", length = 200)
    private String chaveLicenca;

    @Column(name = "tipo_licenca", length = 50)
    private String tipoLicenca;

    @Column(name = "quantidade_total")
    private Integer quantidadeTotal;

    @Column(name = "quantidade_utilizada")
    private Integer quantidadeUtilizada;

    @Column(name = "data_aquisicao")
    private LocalDate dataAquisicao;

    @Column(name = "data_expiracao")
    private LocalDate dataExpiracao;

    @Column(name = "custo_anual")
    private Double custoAnual;

    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
        dataAtualizacao = LocalDateTime.now();
        if (quantidadeUtilizada == null) quantidadeUtilizada = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        dataAtualizacao = LocalDateTime.now();
    }
}
