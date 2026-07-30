package com.inventario.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LogAtividadeDTO {
    private Long id;
    private String usuario;
    private String acao;
    private String entidade;
    private Long entidadeId;
    private String descricao;
    private LocalDateTime dataAtividade;
    private String ipAddress;
}
