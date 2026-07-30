package com.inventario.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CheckinCheckoutDTO {
    private Long id;
    private Long computadorId;
    private String computadorNome;
    private String numeroSerie;
    private String usuarioResponsavel;
    private String tipo;
    private java.time.LocalDateTime dataOperacao;
    private String observacao;
    private String realizadoPor;
    private java.time.LocalDateTime dataDevolucao;
    private String status;
}
