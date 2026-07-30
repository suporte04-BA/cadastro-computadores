package com.inventario.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SoftwareLicencaDTO {
    private Long id;

    @NotBlank(message = "Nome do software e obrigatorio")
    @Size(max = 100)
    private String nomeSoftware;

    @Size(max = 100)
    private String fabricante;

    private String chaveLicenca;

    @Size(max = 50)
    private String tipoLicenca;

    @Min(value = 0, message = "Quantidade total deve ser >= 0")
    private Integer quantidadeTotal;

    @Min(value = 0, message = "Quantidade utilizada deve ser >= 0")
    private Integer quantidadeUtilizada;

    private LocalDate dataAquisicao;
    private LocalDate dataExpiracao;

    @Min(value = 0, message = "Custo anual deve ser >= 0")
    private Double custoAnual;

    private String observacoes;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
}
