package com.inventario.controller;

import com.inventario.dto.UserDTO;
import com.inventario.service.LogAtividadeService;
import com.inventario.service.UserService;
import com.inventario.service.WebSocketEventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;
    private final LogAtividadeService logService;
    private final WebSocketEventService wsService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/username/{username}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> buscarPorUsername(@PathVariable String username) {
        return ResponseEntity.ok(service.buscarPorUsername(username));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> cadastrar(@Valid @RequestBody UserDTO dto, Authentication auth) {
        var result = service.cadastrar(dto, false);
        logService.registrar(auth != null ? auth.getName() : "sistema", "CRIACAO", "USUARIO",
            result.getId() != null ? result.getId() : null,
            "Usuario criado: " + sanitizeLog(dto.getUsername()));
        wsService.notifyUsuarios("CRIACAO", result);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody UserDTO dto,
                                       Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        var result = service.atualizar(id, dto, isAdmin);
        logService.registrar(auth != null ? auth.getName() : "sistema", "ALTERACAO", "USUARIO", id,
            "Usuario atualizado: " + sanitizeLog(dto.getUsername()));
        wsService.notifyUsuarios("ALTERACAO", result);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletar(@PathVariable Long id, Authentication auth) {
        service.deletar(id, auth.getName());
        logService.registrar(auth != null ? auth.getName() : "sistema", "EXCLUSAO", "USUARIO", id,
            "Usuario excluido (ID: " + id + ")");
        wsService.notifyUsuarios("EXCLUSAO", Map.of("id", id));
        return ResponseEntity.noContent().build();
    }

    private String sanitizeLog(String input) {
        if (input == null) return "";
        return input.replaceAll("[\\p{Cntrl}\\u2028\\u2029]", "_").substring(0, Math.min(50, input.length()));
    }
}
