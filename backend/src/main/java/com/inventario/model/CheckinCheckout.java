package com.inventario.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "checkin_checkout", indexes = {
    @Index(name = "idx_cc_computador", columnList = "computador_id"),
    @Index(name = "idx_cc_usuario", columnList = "usuario_responsavel"),
    @Index(name = "idx_cc_tipo", columnList = "tipo")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CheckinCheckout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "computador_id", nullable = false)
    private Computador computador;

    @Column(name = "usuario_responsavel", length = 100, nullable = false)
    private String usuarioResponsavel;

    @Column(name = "tipo", length = 20, nullable = false)
    private String tipo;

    @Column(name = "data_operacao", nullable = false)
    private LocalDateTime dataOperacao;

    @Column(name = "observacao", columnDefinition = "TEXT")
    private String observacao;

    @Column(name = "realizado_por", length = 100)
    private String realizadoPor;

    @Column(name = "data_devolucao")
    private LocalDateTime dataDevolucao;

    @Column(name = "status", length = 20, nullable = false)
    private String status;

    @PrePersist
    protected void onCreate() {
        if (dataOperacao == null) dataOperacao = LocalDateTime.now();
        if (status == null) status = "ATIVO";
        if (tipo == null) tipo = "CHECKOUT";
    }
}
