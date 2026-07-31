package com.inventario.controller;

import com.inventario.dto.DepartamentoDTO;
import com.inventario.service.DepartamentoService;
import com.inventario.service.LogAtividadeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> cadastrar(@Valid @RequestBody DepartamentoDTO dto, Authentication auth) {
        var result = service.cadastrar(dto);
        logService.registrar(auth != null ? auth.getName() : "sistema", "CRIACAO", "SETOR",
            result.getId() != null ? result.getId() : null,
            "Setor criado: " + dto.getNome());
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody DepartamentoDTO dto, Authentication auth) {
        var result = service.atualizar(id, dto);
        logService.registrar(auth != null ? auth.getName() : "sistema", "ALTERACAO", "SETOR", id,
            "Setor atualizado: " + dto.getNome());
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletar(@PathVariable Long id, Authentication auth) {
        service.deletar(id);
        logService.registrar(auth != null ? auth.getName() : "sistema", "EXCLUSAO", "SETOR", id,
            "Setor excluido (ID: " + id + ")");
        return ResponseEntity.ok(Map.of("mensagem", "Departamento excluido com sucesso"));
    }
}
