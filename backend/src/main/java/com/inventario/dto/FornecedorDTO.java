package com.inventario.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FornecedorDTO {
    private Long id;

    @NotBlank(message = "Nome e obrigatorio")
    @Size(max = 100)
    private String nome;

    @Size(max = 18)
    private String cnpj;

    @Email(message = "Email invalido")
    @Size(max = 100)
    private String email;

    @Size(max = 20)
    private String telefone;

    @Size(max = 100)
    private String contato;

    @Size(max = 200)
    private String endereco;

    private String observacoes;
    private LocalDateTime dataCriacao;
}
