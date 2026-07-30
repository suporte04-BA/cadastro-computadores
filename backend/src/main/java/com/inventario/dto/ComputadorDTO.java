package com.inventario.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ComputadorDTO {

    private Long id;

    @NotBlank(message = "Nome do PC e obrigatorio")
    @Size(max = 100)
    private String nomePc;

    @NotBlank(message = "Numero de serie e obrigatorio")
    @Size(max = 50)
    private String numeroSerie;

    @NotBlank(message = "Modelo/Marca e obrigatorio")
    @Size(max = 100)
    private String modeloMarca;

    @NotBlank(message = "Processador e obrigatorio")
    @Size(max = 100)
    private String processador;

    @NotBlank(message = "Memoria RAM e obrigatoria")
    @Size(max = 50)
    private String memoriaRam;

    @NotBlank(message = "Armazenamento e obrigatorio")
    @Size(max = 50)
    private String armazenamento;

    @Size(max = 100)
    private String usuarioDesignado;

    @Size(max = 100)
    private String fornecedor;

    private String status;
    private String fotoUrl;
    private Boolean manutencaoConcluidaSemestre;

    private LocalDate dataAquisicao;
    private LocalDate dataGarantia;

    @Size(max = 100)
    private String departamento;

    @Size(max = 150)
    private String localizacao;

    @Size(max = 50)
    private String ipAddress;

    @Size(max = 50)
    private String sistemaOperacional;

    @Size(max = 200)
    private String softwareInstalado;

    private String notas;
}
