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
        return ResponseEntity.ok(service.listarPaginado(page, size, usuario, entidade));
    }

    @GetMapping("/recentes")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> recentes(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(service.ultimas(limit));
    }
}
