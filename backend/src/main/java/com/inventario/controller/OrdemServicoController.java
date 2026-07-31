package com.inventario.controller;

import com.inventario.dto.*;
import com.inventario.service.LogAtividadeService;
import com.inventario.service.OrdemServicoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

    @GetMapping
    public ResponseEntity<?> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String prioridade,
            @RequestParam(required = false) Long computadorId) {
        return ResponseEntity.ok(service.listarPaginado(page, size, status, prioridade, computadorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> cadastrar(@Valid @RequestBody OrdemServicoDTO dto, Authentication auth) {
        var result = service.cadastrar(dto);
        logService.registrar(auth != null ? auth.getName() : "sistema", "CRIACAO", "ORDEM_SERVICO",
            result.getId() != null ? result.getId() : null,
            "OS criada: " + dto.getTitulo());
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody OrdemServicoDTO dto, Authentication auth) {
        var result = service.atualizar(id, dto);
        String statusMsg = dto.getStatus() != null ? " [Status: " + dto.getStatus() + "]" : "";
        logService.registrar(auth != null ? auth.getName() : "sistema", "ALTERACAO", "ORDEM_SERVICO", id,
            "OS atualizada" + statusMsg);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletar(@PathVariable Long id, Authentication auth) {
        service.deletar(id);
        logService.registrar(auth != null ? auth.getName() : "sistema", "EXCLUSAO", "ORDEM_SERVICO", id,
            "OS excluida (ID: " + id + ")");
        return ResponseEntity.ok(java.util.Map.of("mensagem", "Ordem de servico excluida com sucesso"));
    }

    @GetMapping("/estatisticas")
    public ResponseEntity<?> estatisticas() {
        return ResponseEntity.ok(service.estatisticas());
    }
}
