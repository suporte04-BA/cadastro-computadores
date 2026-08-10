package com.inventario.controller;

import com.inventario.dto.*;
import com.inventario.service.ComputadorService;
import com.inventario.service.LogAtividadeService;
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
@RequestMapping("/api/computadores")
@RequiredArgsConstructor
public class ComputadorController {

    private final ComputadorService service;
    private final LogAtividadeService logService;
    private final WebSocketEventService wsService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO', 'USUARIO')")
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/paginado")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO', 'USUARIO')")
    public ResponseEntity<?> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String termo) {
        page = Math.max(0, page);
        size = Math.min(Math.max(size, 1), 100);
        return ResponseEntity.ok(service.listarPaginado(page, size, status, termo));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO', 'USUARIO')")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> cadastrar(@Valid @RequestBody ComputadorDTO dto, Authentication auth) {
        var result = service.cadastrar(dto);
        logService.registrar(auth != null ? auth.getName() : "sistema", "CRIACAO", "COMPUTADOR",
            result.getId() != null ? result.getId() : null,
            "Computador cadastrado: " + sanitizeLog(dto.getNomePc()));
        wsService.notifyComputadores("CRIACAO", result);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody ComputadorDTO dto, Authentication auth) {
        var result = service.atualizar(id, dto);
        logService.registrar(auth != null ? auth.getName() : "sistema", "ALTERACAO", "COMPUTADOR", id,
            "Computador atualizado: " + sanitizeLog(dto.getNomePc()));
        wsService.notifyComputadores("ALTERACAO", result);
        return ResponseEntity.ok(result);
    }

    @PatchMapping("/{id}/manutencao")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> registrarManutencao(@PathVariable Long id, Authentication auth) {
        var result = service.registrarManutencao(id);
        logService.registrar(auth.getName(), "ALTERACAO", "COMPUTADOR", id,
            "Manutencao registrada: " + sanitizeLog(result.getNomePc()));
        wsService.notifyComputadores("ALTERACAO", result);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletar(@PathVariable Long id, Authentication auth) {
        service.deletar(id);
        logService.registrar(auth != null ? auth.getName() : "sistema", "EXCLUSAO", "COMPUTADOR", id,
            "Computador excluido (ID: " + id + ")");
        wsService.notifyComputadores("EXCLUSAO", Map.of("id", id));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/manutencao-vencida")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO', 'USUARIO')")
    public ResponseEntity<?> listarManutencaoVencida() {
        return ResponseEntity.ok(service.listarManutencaoVencida());
    }

    @GetMapping("/estatisticas")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO', 'USUARIO')")
    public ResponseEntity<?> estatisticas() {
        return ResponseEntity.ok(service.estatisticas());
    }

    @GetMapping("/alertas")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> alertas() {
        return ResponseEntity.ok(service.alertas());
    }

    private String sanitizeLog(String input) {
        if (input == null) return "";
        return input.replaceAll("[\\p{Cntrl}\\u2028\\u2029]", "_").substring(0, Math.min(80, input.length()));
    }
}
