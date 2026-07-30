package com.inventario.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historico_atribuicao", indexes = {
    @Index(name = "idx_ha_computador", columnList = "computador_id"),
    @Index(name = "idx_ha_data", columnList = "data_troca")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HistoricoAtribuicao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "computador_id", nullable = false)
    private Computador computador;

    @Column(name = "usuario_anterior", length = 100)
    private String usuarioAnterior;

    @Column(name = "usuario_novo", length = 100)
    private String usuarioNovo;

    @Column(name = "data_troca", nullable = false)
    private LocalDateTime dataTroca;

    @Column(name = "observacao", columnDefinition = "TEXT")
    private String observacao;

    @Column(name = "tipo_movimentacao", length = 30, nullable = false)
    private String tipoMovimentacao;

    @Column(name = "realizado_por", length = 100)
    private String realizadoPor;

    @PrePersist
    protected void onCreate() {
        if (dataTroca == null) dataTroca = LocalDateTime.now();
        if (tipoMovimentacao == null) tipoMovimentacao = "ATRIBUICAO";
    }
}
