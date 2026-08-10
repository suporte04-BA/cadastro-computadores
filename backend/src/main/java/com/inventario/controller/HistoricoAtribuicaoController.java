package com.inventario.controller;

import com.inventario.dto.HistoricoAtribuicaoDTO;
import com.inventario.exception.RegraNegocioException;
import com.inventario.service.HistoricoAtribuicaoService;
import com.inventario.service.LogAtividadeService;
import com.inventario.service.WebSocketEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/historico")
@RequiredArgsConstructor
public class HistoricoAtribuicaoController {

    private final HistoricoAtribuicaoService service;
    private final WebSocketEventService wsService;
    private final LogAtividadeService logService;

    @GetMapping("/computador/{computadorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> listarPorComputador(@PathVariable Long computadorId) {
        return ResponseEntity.ok(service.listarPorComputador(computadorId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> registrar(@RequestBody Map<String, Object> body, Authentication auth) {
        Object compIdObj = body.get("computadorId");
        if (compIdObj == null) throw new RegraNegocioException("computadorId e obrigatorio");
        Long computadorId;
        try { computadorId = Long.valueOf(compIdObj.toString()); }
        catch (NumberFormatException e) { throw new RegraNegocioException("computadorId invalido"); }
        String usuarioAnterior = body.get("usuarioAnterior") != null ? body.get("usuarioAnterior").toString() : null;
        String usuarioNovo = body.get("usuarioNovo") != null ? body.get("usuarioNovo").toString() : null;
        String tipoMovimentacao = body.get("tipoMovimentacao") != null ? body.get("tipoMovimentacao").toString() : "ATRIBUICAO";
        if (!tipoMovimentacao.matches("^(ATRIBUICAO|DEVOLUCAO|TROCA|TRANSFERENCIA)$")) {
            throw new RegraNegocioException("tipoMovimentacao invalido. Valores aceitos: ATRIBUICAO, DEVOLUCAO, TROCA, TRANSFERENCIA");
        }
        String observacao = body.get("observacao") != null ? body.get("observacao").toString().substring(0, Math.min(500, body.get("observacao").toString().length())) : null;
        String realizadoPor = auth.getName();

        var result = service.registrar(computadorId, usuarioAnterior, usuarioNovo,
            tipoMovimentacao, observacao, realizadoPor);
        logService.registrar(realizadoPor, "HISTORICO", "COMPUTADOR", computadorId,
            "Atribuicao registrada: " + tipoMovimentacao);
        wsService.notifyLogs("HISTORICO", result);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
}
