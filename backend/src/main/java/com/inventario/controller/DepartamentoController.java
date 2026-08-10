package com.inventario.controller;

import com.inventario.dto.DepartamentoDTO;
import com.inventario.service.DepartamentoService;
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
@RequestMapping("/api/departamentos")
@RequiredArgsConstructor
public class DepartamentoController {

    private final DepartamentoService service;
    private final LogAtividadeService logService;
    private final WebSocketEventService wsService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO', 'USUARIO')")
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO', 'USUARIO')")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> cadastrar(@Valid @RequestBody DepartamentoDTO dto, Authentication auth) {
        var result = service.cadastrar(dto);
        logService.registrar(auth != null ? auth.getName() : "sistema", "CRIACAO", "SETOR",
            result.getId() != null ? result.getId() : null,
            "Setor criado: " + sanitizeLog(dto.getNome()));
        wsService.notifyDepartamentos("CRIACAO", result);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody DepartamentoDTO dto, Authentication auth) {
        var result = service.atualizar(id, dto);
        logService.registrar(auth != null ? auth.getName() : "sistema", "ALTERACAO", "SETOR", id,
            "Setor atualizado: " + sanitizeLog(dto.getNome()));
        wsService.notifyDepartamentos("ALTERACAO", result);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletar(@PathVariable Long id, Authentication auth) {
        service.deletar(id);
        logService.registrar(auth != null ? auth.getName() : "sistema", "EXCLUSAO", "SETOR", id,
            "Setor excluido (ID: " + id + ")");
        wsService.notifyDepartamentos("EXCLUSAO", Map.of("id", id));
        return ResponseEntity.noContent().build();
    }

    private String sanitizeLog(String input) {
        if (input == null) return "";
        return input.replaceAll("[\\p{Cntrl}\\u2028\\u2029]", "_").substring(0, Math.min(50, input.length()));
    }
}
