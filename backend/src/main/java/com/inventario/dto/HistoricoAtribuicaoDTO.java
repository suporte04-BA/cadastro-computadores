package com.inventario.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HistoricoAtribuicaoDTO {

    private Long id;
    private Long computadorId;
    private String computadorNome;
    private String usuarioAnterior;
    private String usuarioNovo;
    private LocalDateTime dataTroca;
    private String observacao;
    private String tipoMovimentacao;
    private String realizadoPor;
}
