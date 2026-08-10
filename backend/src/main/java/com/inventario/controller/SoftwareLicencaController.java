package com.inventario.controller;

import com.inventario.dto.PageResponse;
import com.inventario.dto.SoftwareLicencaDTO;
import com.inventario.service.LogAtividadeService;
import com.inventario.service.SoftwareLicencaService;
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
@RequestMapping("/api/software-licencas")
@RequiredArgsConstructor
public class SoftwareLicencaController {

    private final SoftwareLicencaService service;
    private final WebSocketEventService wsService;
    private final LogAtividadeService logService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String termo) {
        page = Math.max(0, page);
        size = Math.min(Math.max(size, 1), 100);
        return ResponseEntity.ok(service.listarPaginado(page, size, termo));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> cadastrar(@Valid @RequestBody SoftwareLicencaDTO dto, Authentication auth) {
        var result = service.cadastrar(dto);
        logService.registrar(auth.getName(), "CRIACAO", "SOFTWARE_LICENCA", result.getId(),
            "Software licenca criado: " + (result.getNomeSoftware() != null ? result.getNomeSoftware() : ""));
        wsService.notifySoftwareLicencas("CRIACAO", result);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody SoftwareLicencaDTO dto, Authentication auth) {
        var result = service.atualizar(id, dto);
        logService.registrar(auth.getName(), "ALTERACAO", "SOFTWARE_LICENCA", id,
            "Software licenca atualizado: " + (result.getNomeSoftware() != null ? result.getNomeSoftware() : ""));
        wsService.notifySoftwareLicencas("ALTERACAO", result);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletar(@PathVariable Long id, Authentication auth) {
        service.deletar(id);
        logService.registrar(auth.getName(), "EXCLUSAO", "SOFTWARE_LICENCA", id,
            "Software licenca removido (ID: " + id + ")");
        wsService.notifySoftwareLicencas("EXCLUSAO", Map.of("id", id));
        return ResponseEntity.noContent().build();
    }
}
