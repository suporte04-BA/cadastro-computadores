package com.inventario.controller;

import com.inventario.dto.*;
import com.inventario.exception.RegraNegocioException;
import com.inventario.service.CheckinCheckoutService;
import com.inventario.service.LogAtividadeService;
import com.inventario.service.WebSocketEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    private final WebSocketEventService wsService;
    private final LogAtividadeService logService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String usuario) {
        page = Math.max(0, page);
        size = Math.min(Math.max(size, 1), 100);
        return ResponseEntity.ok(service.listarPaginado(page, size, status, usuario));
    }

    @GetMapping("/ativos")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> ativos() {
        return ResponseEntity.ok(service.listarAtivos());
    }

    @GetMapping("/computador/{computadorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> porComputador(@PathVariable Long computadorId) {
        return ResponseEntity.ok(service.listarPorComputador(computadorId));
    }

    @PostMapping("/checkout")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> checkout(@RequestBody Map<String, Object> body, Authentication auth) {
        Object compIdObj = body.get("computadorId");
        if (compIdObj == null) throw new RegraNegocioException("computadorId e obrigatorio");
        Long computadorId;
        try { computadorId = Long.valueOf(compIdObj.toString()); }
        catch (NumberFormatException e) { throw new RegraNegocioException("computadorId invalido"); }
        String usuario = body.get("usuario") != null ? body.get("usuario").toString().substring(0, Math.min(100, body.get("usuario").toString().length())) : null;
        String observacao = body.getOrDefault("observacao", null) != null ? body.getOrDefault("observacao", null).toString().substring(0, Math.min(500, body.getOrDefault("observacao", null).toString().length())) : null;
        var result = service.checkout(computadorId, usuario, observacao, auth.getName());
        logService.registrar(auth.getName(), "CHECKOUT", "CHECKIN_CHECKOUT", computadorId,
            "Checkout computador #" + computadorId + " para " + sanitizeLog(usuario));
        wsService.notifyCheckinCheckout("CHECKOUT", result);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PostMapping("/checkin/{checkoutId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> checkin(@PathVariable Long checkoutId, @RequestBody Map<String, Object> body, Authentication auth) {
        String observacao = body.getOrDefault("observacao", null) != null ? body.getOrDefault("observacao", null).toString().substring(0, Math.min(500, body.getOrDefault("observacao", null).toString().length())) : null;
        var result = service.checkin(checkoutId, observacao, auth.getName());
        logService.registrar(auth.getName(), "CHECKIN", "CHECKIN_CHECKOUT", checkoutId,
            "Checkin checkout #" + checkoutId);
        wsService.notifyCheckinCheckout("CHECKIN", result);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/estatisticas")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> estatisticas() {
        return ResponseEntity.ok(service.estatisticas());
    }

    private String sanitizeLog(String input) {
        if (input == null) return "";
        return input.replaceAll("[\\p{Cntrl}\\u2028\\u2029]", "_").substring(0, Math.min(80, input.length()));
    }
}
