package com.inventario.controller;

import com.inventario.dto.*;
import com.inventario.exception.RegraNegocioException;
import com.inventario.model.User;
import com.inventario.repository.UserRepository;
import com.inventario.security.JwtTokenProvider;
import com.inventario.service.LogAtividadeService;
import com.inventario.service.UserService;
import com.inventario.service.WebSocketEventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final WebSocketEventService wsService;
    private final LogAtividadeService logService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new BadCredentialsException("Credenciais invalidas"));

        if (userService.isBloqueado(user)) {
            throw new BadCredentialsException("Conta bloqueada. Tente novamente mais tarde.");
        }

        if (!user.getAtivo()) {
            throw new BadCredentialsException("Usuario desativado");
        }

        if (!passwordEncoder.matches(request.getSenha(), user.getSenha())) {
            userService.registrarLoginFalha(user);
            throw new BadCredentialsException("Credenciais invalidas");
        }

        userService.registrarLoginSucesso(user);
        logService.registrar(user.getUsername(), "LOGIN", "USUARIO", user.getId(), "Login realizado com sucesso");

        String perfil = user.getPerfil() != null ? user.getPerfil().name() : "USUARIO";
        String token = tokenProvider.generateToken(user.getUsername(), perfil, user.getNomeCompleto());
        String refreshToken = tokenProvider.generateRefreshToken(user.getUsername());

        return ResponseEntity.ok(LoginResponse.builder()
            .token(token)
            .refreshToken(refreshToken)
            .username(user.getUsername())
            .nomeCompleto(user.getNomeCompleto())
            .perfil(perfil)
            .expiresIn(tokenProvider.getJwtExpiration())
            .build());
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (refreshToken == null || refreshToken.isBlank() || !tokenProvider.validateToken(refreshToken)) {
            throw new RegraNegocioException("Refresh token invalido");
        }
        if (!tokenProvider.isRefreshToken(refreshToken)) {
            throw new RegraNegocioException("Token fornecido nao e um refresh token");
        }

        String username = tokenProvider.getUsernameFromToken(refreshToken);
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RegraNegocioException("Usuario nao encontrado"));

        if (userService.isBloqueado(user)) {
            throw new RegraNegocioException("Conta bloqueada. Tente novamente mais tarde.");
        }
        if (!user.getAtivo()) {
            throw new RegraNegocioException("Usuario desativado");
        }

        String perfil = user.getPerfil() != null ? user.getPerfil().name() : "USUARIO";
        String newToken = tokenProvider.generateToken(user.getUsername(), perfil, user.getNomeCompleto());

        return ResponseEntity.ok(Map.of("token", newToken, "expiresIn", tokenProvider.getJwtExpiration()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ") || authHeader.length() <= 7) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("erro", "Token nao fornecido"));
        }
        String token = authHeader.substring(7);
        if (!tokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("erro", "Token invalido ou expirado"));
        }
        String username = tokenProvider.getUsernameFromToken(token);
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RegraNegocioException("Usuario nao encontrado"));
        return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "username", user.getUsername(),
            "nomeCompleto", user.getNomeCompleto(),
            "perfil", user.getPerfil() != null ? user.getPerfil().name() : "USUARIO",
            "email", user.getEmail() != null ? user.getEmail() : ""
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        com.inventario.dto.UserDTO dto = com.inventario.dto.UserDTO.builder()
            .username(request.getUsername())
            .senha(request.getSenha())
            .nomeCompleto(request.getNomeCompleto())
            .email(request.getEmail())
            .build();
        userService.cadastrar(dto, true);
        logService.registrar(request.getUsername(), "CRIACAO", "USUARIO", null,
            "Conta criada: " + request.getUsername());
        wsService.notifyUsuarios("CRIACAO", Map.of("username", request.getUsername(), "nomeCompleto", request.getNomeCompleto()));
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("mensagem", "Conta criada com sucesso"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("mensagem", "Logout realizado com sucesso"));
    }

    @lombok.Getter @lombok.Setter
    public static class RegisterRequest {
        @jakarta.validation.constraints.NotBlank(message = "Nome completo e obrigatorio")
        private String nomeCompleto;

        @jakarta.validation.constraints.NotBlank(message = "Username e obrigatorio")
        @jakarta.validation.constraints.Size(min = 3, max = 50)
        private String username;

        @jakarta.validation.constraints.Email(message = "Email invalido")
        private String email;

        @jakarta.validation.constraints.NotBlank(message = "Senha e obrigatoria")
        @jakarta.validation.constraints.Size(min = 6, message = "Senha deve ter no minimo 6 caracteres")
        private String senha;
    }
}
