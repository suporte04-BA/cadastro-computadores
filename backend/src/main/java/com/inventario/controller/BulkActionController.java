package com.inventario.controller;

import com.inventario.exception.RegraNegocioException;
import com.inventario.model.enums.StatusComputador;
import com.inventario.repository.ComputadorRepository;
import com.inventario.service.LogAtividadeService;
import com.inventario.service.WebSocketEventService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/computadores")
@RequiredArgsConstructor
public class BulkActionController {

    private final ComputadorRepository computadorRepository;
    private final LogAtividadeService logService;
    private final WebSocketEventService wsService;

    @PatchMapping("/bulk-status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    @Transactional
    public ResponseEntity<?> bulkStatusUpdate(@RequestBody @Valid BulkStatusRequest request, Authentication auth) {
        if (request.getIds() == null || request.getIds().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Nenhum ID fornecido"));
        }
        if (request.getStatus() == null || request.getStatus().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Status obrigatorio"));
        }
        StatusComputador status;
        try { status = StatusComputador.valueOf(request.getStatus()); }
        catch (IllegalArgumentException e) {
            throw new RegraNegocioException("Status invalido. Valores aceitos: " + Arrays.toString(StatusComputador.values()));
        }
        int updated = 0;
        var computadores = computadorRepository.findAllById(request.getIds());
        for (var c : computadores) {
            c.setStatus(status);
            computadorRepository.save(c);
            logService.registrar(auth.getName(), "ALTERACAO_EM_MASSA", "COMPUTADOR", c.getId(),
                "Status alterado para " + status + " em acao em massa");
            updated++;
        }
        wsService.notifyComputadores("ALTERACAO_EM_MASSA", Map.of("total", updated, "status", request.getStatus()));
        return ResponseEntity.ok(Map.of(
            "mensagem", updated + " computadores atualizados",
            "total", updated,
            "status", request.getStatus()
        ));
    }

    @DeleteMapping("/bulk-delete")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> bulkDelete(@RequestBody @Valid BulkIdsRequest request, Authentication auth) {
        if (request.getIds() == null || request.getIds().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Nenhum ID fornecido"));
        }
        int deleted = 0;
        var computadores = computadorRepository.findAllById(request.getIds());
        for (var c : computadores) {
            computadorRepository.deleteById(c.getId());
            logService.registrar(auth.getName(), "EXCLUSAO_EM_MASSA", "COMPUTADOR", c.getId(),
                "Computador excluido em acao em massa");
            deleted++;
        }
        wsService.notifyComputadores("EXCLUSAO_EM_MASSA", Map.of("total", deleted));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/bulk-check")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> bulkCheck(@RequestBody @Valid BulkIdsRequest request) {
        if (request.getIds() == null || request.getIds().isEmpty()) {
            return ResponseEntity.ok(Map.of("existem", 0, "naoExistem", 0, "idsValidos", List.of()));
        }
        List<Long> validos = request.getIds().stream()
            .filter(id -> id != null && computadorRepository.existsById(id))
            .toList();
        return ResponseEntity.ok(Map.of(
            "existem", validos.size(),
            "naoExistem", request.getIds().size() - validos.size(),
            "idsValidos", validos
        ));
    }

    @lombok.Getter @lombok.Setter
    public static class BulkStatusRequest {
        @NotEmpty(message = "Lista de IDs e obrigatoria")
        private List<Long> ids;
        @jakarta.validation.constraints.NotBlank(message = "Status e obrigatorio")
        private String status;
    }

    @lombok.Getter @lombok.Setter
    public static class BulkIdsRequest {
        @NotEmpty(message = "Lista de IDs e obrigatoria")
        private List<Long> ids;
    }
}
