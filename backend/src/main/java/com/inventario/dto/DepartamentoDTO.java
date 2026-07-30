package com.inventario.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DepartamentoDTO {
    private Long id;

    @NotBlank(message = "Nome e obrigatorio")
    @Size(max = 100)
    private String nome;

    private Long totalComputadores;
}
