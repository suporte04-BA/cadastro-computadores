package com.inventario.controller;

import com.inventario.dto.*;
import com.inventario.service.LogAtividadeService;
import com.inventario.service.OrdemServicoService;
import com.inventario.service.WebSocketEventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ordens-servico")
@RequiredArgsConstructor
public class OrdemServicoController {

    private final OrdemServicoService service;
    private final LogAtividadeService logService;
    private final WebSocketEventService wsService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO', 'USUARIO')")
    public ResponseEntity<?> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String prioridade,
            @RequestParam(required = false) Long computadorId) {
        page = Math.max(0, page);
        size = Math.min(Math.max(size, 1), 100);
        return ResponseEntity.ok(service.listarPaginado(page, size, status, prioridade, computadorId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO', 'USUARIO')")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> cadastrar(@Valid @RequestBody OrdemServicoDTO dto, Authentication auth) {
        var result = service.cadastrar(dto);
        logService.registrar(auth != null ? auth.getName() : "sistema", "CRIACAO", "ORDEM_SERVICO",
            result.getId() != null ? result.getId() : null,
            "OS criada: " + sanitizeLog(dto.getTitulo()));
        wsService.notifyOrdensServico("CRIACAO", result);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody OrdemServicoDTO dto, Authentication auth) {
        var result = service.atualizar(id, dto);
        String statusMsg = dto.getStatus() != null ? " [Status: " + sanitizeLog(dto.getStatus()) + "]" : "";
        logService.registrar(auth.getName(), "ALTERACAO", "ORDEM_SERVICO", id,
            "OS atualizada" + statusMsg);
        wsService.notifyOrdensServico("ALTERACAO", result);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletar(@PathVariable Long id, Authentication auth) {
        service.deletar(id);
        logService.registrar(auth.getName(), "EXCLUSAO", "ORDEM_SERVICO", id,
            "OS excluida (ID: " + id + ")");
        wsService.notifyOrdensServico("EXCLUSAO", java.util.Map.of("id", id));
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
