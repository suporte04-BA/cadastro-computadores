package com.inventario.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "log_atividade", indexes = {
    @Index(name = "idx_la_usuario", columnList = "usuario"),
    @Index(name = "idx_la_entidade", columnList = "entidade"),
    @Index(name = "idx_la_data", columnList = "data_atividade")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LogAtividade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario", length = 100, nullable = false)
    private String usuario;

    @Column(name = "acao", length = 30, nullable = false)
    private String acao;

    @Column(name = "entidade", length = 50, nullable = false)
    private String entidade;

    @Column(name = "entidade_id")
    private Long entidadeId;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "data_atividade", nullable = false)
    private LocalDateTime dataAtividade;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @PrePersist
    protected void onCreate() {
        if (dataAtividade == null) dataAtividade = LocalDateTime.now();
    }
}
