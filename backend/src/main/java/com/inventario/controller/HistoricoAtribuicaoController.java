package com.inventario.controller;

import com.inventario.dto.HistoricoAtribuicaoDTO;
import com.inventario.service.HistoricoAtribuicaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/historico")
@RequiredArgsConstructor
public class HistoricoAtribuicaoController {

    private final HistoricoAtribuicaoService service;

    @GetMapping("/computador/{computadorId}")
    public ResponseEntity<?> listarPorComputador(@PathVariable Long computadorId) {
        return ResponseEntity.ok(service.listarPorComputador(computadorId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> registrar(@RequestBody Map<String, Object> body) {
        Long computadorId = Long.valueOf(body.get("computadorId").toString());
        String usuarioAnterior = (String) body.getOrDefault("usuarioAnterior", null);
        String usuarioNovo = (String) body.getOrDefault("usuarioNovo", null);
        String tipoMovimentacao = (String) body.getOrDefault("tipoMovimentacao", "ATRIBUICAO");
        String observacao = (String) body.getOrDefault("observacao", null);
        String realizadoPor = (String) body.getOrDefault("realizadoPor", null);

        return ResponseEntity.ok(service.registrar(computadorId, usuarioAnterior, usuarioNovo,
            tipoMovimentacao, observacao, realizadoPor));
    }
}
