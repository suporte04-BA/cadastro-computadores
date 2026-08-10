package com.inventario.controller;

import com.inventario.dto.LogAtividadeDTO;
import com.inventario.dto.PageResponse;
import com.inventario.service.LogAtividadeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogAtividadeController {

    private final LogAtividadeService service;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String usuario,
            @RequestParam(required = false) String entidade) {
        page = Math.max(0, page);
        size = Math.min(Math.max(size, 1), 100);
        return ResponseEntity.ok(service.listarPaginado(page, size, usuario, entidade));
    }

    @GetMapping("/recentes")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> recentes(@RequestParam(defaultValue = "10") int limit) {
        limit = Math.min(Math.max(limit, 1), 100);
        return ResponseEntity.ok(service.ultimas(limit));
    }
}
