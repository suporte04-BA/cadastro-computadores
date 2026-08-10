package com.inventario.controller;

import com.inventario.dto.*;
import com.inventario.service.LogAtividadeService;
import com.inventario.service.ManutencaoService;
import com.inventario.service.WebSocketEventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manutencoes")
@RequiredArgsConstructor
public class ManutencaoController {

    private final ManutencaoService service;
    private final LogAtividadeService logService;
    private final WebSocketEventService wsService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO', 'USUARIO')")
    public ResponseEntity<?> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long computadorId) {
        page = Math.max(0, page);
        size = Math.min(Math.max(size, 1), 100);
        return ResponseEntity.ok(service.listarPaginado(page, size, status, computadorId));
    }

    @GetMapping("/computador/{computadorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO', 'USUARIO')")
    public ResponseEntity<?> listarPorComputador(@PathVariable Long computadorId) {
        return ResponseEntity.ok(service.listarPorComputador(computadorId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO', 'USUARIO')")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> cadastrar(@Valid @RequestBody ManutencaoDTO dto, Authentication auth) {
        var result = service.cadastrar(dto);
        String desc = dto.getDescricao() != null ? sanitizeLog(dto.getDescricao()) : "";
        logService.registrar(auth.getName(), "CRIACAO", "MANUTENCAO",
            result.getId() != null ? result.getId() : null,
            "Manutencao criada: " + sanitizeLog(dto.getTipo()) + " - " + desc);
        wsService.notifyManutencoes("CRIACAO", result);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody ManutencaoDTO dto, Authentication auth) {
        var result = service.atualizar(id, dto);
        String statusMsg = dto.getStatus() != null ? " [Status: " + sanitizeLog(dto.getStatus()) + "]" : "";
        logService.registrar(auth.getName(), "ALTERACAO", "MANUTENCAO", id,
            "Manutencao atualizada" + statusMsg);
        wsService.notifyManutencoes("ALTERACAO", result);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletar(@PathVariable Long id, Authentication auth) {
        service.deletar(id);
        logService.registrar(auth.getName(), "EXCLUSAO", "MANUTENCAO", id,
            "Manutencao excluida (ID: " + id + ")");
        wsService.notifyManutencoes("EXCLUSAO", java.util.Map.of("id", id));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/estatisticas")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO', 'USUARIO')")
    public ResponseEntity<?> estatisticas() {
        return ResponseEntity.ok(service.estatisticas());
    }

    private String sanitizeLog(String input) {
        if (input == null) return "";
        return input.replaceAll("[\\p{Cntrl}\\u2028\\u2029]", "_").substring(0, Math.min(80, input.length()));
    }
}
