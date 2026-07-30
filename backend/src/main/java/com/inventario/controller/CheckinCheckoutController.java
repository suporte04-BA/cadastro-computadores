package com.inventario.controller;

import com.inventario.dto.*;
import com.inventario.service.CheckinCheckoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/checkin-checkout")
@RequiredArgsConstructor
public class CheckinCheckoutController {

    private final CheckinCheckoutService service;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String usuario) {
        return ResponseEntity.ok(service.listarPaginado(page, size, status, usuario));
    }

    @GetMapping("/ativos")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> ativos() {
        return ResponseEntity.ok(service.listarAtivos());
    }

    @GetMapping("/computador/{computadorId}")
    public ResponseEntity<?> porComputador(@PathVariable Long computadorId) {
        return ResponseEntity.ok(service.listarPorComputador(computadorId));
    }

    @PostMapping("/checkout")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> checkout(@RequestBody Map<String, Object> body, Authentication auth) {
        Long computadorId = Long.valueOf(body.get("computadorId").toString());
        String usuario = (String) body.get("usuario");
        String observacao = (String) body.getOrDefault("observacao", null);
        return ResponseEntity.ok(service.checkout(computadorId, usuario, observacao, auth.getName()));
    }

    @PostMapping("/checkin/{checkoutId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> checkin(@PathVariable Long checkoutId, @RequestBody Map<String, Object> body, Authentication auth) {
        String observacao = (String) body.getOrDefault("observacao", null);
        return ResponseEntity.ok(service.checkin(checkoutId, observacao, auth.getName()));
    }

    @GetMapping("/estatisticas")
    public ResponseEntity<?> estatisticas() {
        return ResponseEntity.ok(service.estatisticas());
    }
}
