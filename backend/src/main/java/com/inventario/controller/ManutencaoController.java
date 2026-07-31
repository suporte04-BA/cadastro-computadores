package com.inventario.controller;

import com.inventario.dto.*;
import com.inventario.service.LogAtividadeService;
import com.inventario.service.ManutencaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

    @GetMapping
    public ResponseEntity<?> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long computadorId) {
        return ResponseEntity.ok(service.listarPaginado(page, size, status, computadorId));
    }

    @GetMapping("/computador/{computadorId}")
    public ResponseEntity<?> listarPorComputador(@PathVariable Long computadorId) {
        return ResponseEntity.ok(service.listarPorComputador(computadorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> cadastrar(@Valid @RequestBody ManutencaoDTO dto, Authentication auth) {
        var result = service.cadastrar(dto);
        logService.registrar(auth != null ? auth.getName() : "sistema", "CRIACAO", "MANUTENCAO",
            result.getId() != null ? result.getId() : null,
            "Manutencao criada: " + dto.getTipo() + " - " + (dto.getDescricao() != null ? dto.getDescricao().substring(0, Math.min(80, dto.getDescricao().length())) : ""));
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody ManutencaoDTO dto, Authentication auth) {
        var result = service.atualizar(id, dto);
        String statusMsg = dto.getStatus() != null ? " [Status: " + dto.getStatus() + "]" : "";
        logService.registrar(auth != null ? auth.getName() : "sistema", "ALTERACAO", "MANUTENCAO", id,
            "Manutencao atualizada" + statusMsg);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletar(@PathVariable Long id, Authentication auth) {
        service.deletar(id);
        logService.registrar(auth != null ? auth.getName() : "sistema", "EXCLUSAO", "MANUTENCAO", id,
            "Manutencao excluida (ID: " + id + ")");
        return ResponseEntity.ok(java.util.Map.of("mensagem", "Manutencao excluida com sucesso"));
    }

    @GetMapping("/estatisticas")
    public ResponseEntity<?> estatisticas() {
        return ResponseEntity.ok(service.estatisticas());
    }
}
