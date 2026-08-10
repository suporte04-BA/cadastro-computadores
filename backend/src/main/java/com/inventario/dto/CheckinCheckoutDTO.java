package com.inventario.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CheckinCheckoutDTO {
    private Long id;

    @NotNull(message = "computadorId e obrigatorio")
    private Long computadorId;

    private String computadorNome;
    private String numeroSerie;

    @NotBlank(message = "usuarioResponsavel e obrigatorio")
    @Size(max = 100)
    private String usuarioResponsavel;

    @NotBlank(message = "tipo e obrigatorio")
    private String tipo;

    private java.time.LocalDateTime dataOperacao;

    @Size(max = 500)
    private String observacao;

    private String realizadoPor;
    private java.time.LocalDateTime dataDevolucao;
    private String status;
}
