package com.inventario.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserDTO {

    private Long id;

    @NotBlank(message = "Username e obrigatorio")
    @Size(min = 3, max = 50)
    private String username;

    private String senha;

    @NotBlank(message = "Nome completo e obrigatorio")
    @Size(max = 100)
    private String nomeCompleto;

    @Email(message = "Email invalido")
    private String email;

    private String perfil;
    private String fotoUrl;
    private Boolean ativo;
    private LocalDateTime dataCadastro;
}
