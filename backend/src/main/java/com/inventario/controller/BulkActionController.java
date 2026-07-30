package com.inventario.controller;

import com.inventario.dto.LogAtividadeDTO;
import com.inventario.model.enums.StatusComputador;
import com.inventario.repository.ComputadorRepository;
import com.inventario.service.LogAtividadeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api/computadores")
@RequiredArgsConstructor
public class BulkActionController {

    private final ComputadorRepository computadorRepository;
    private final LogAtividadeService logService;

    @PatchMapping("/bulk-status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    @Transactional
    public ResponseEntity<?> bulkStatusUpdate(@RequestBody @Valid BulkStatusRequest request, Authentication auth) {
        if (request.getIds() == null || request.getIds().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Nenhum ID fornecido"));
        }
        if (request.getStatus() == null || request.getStatus().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Status obrigatorio"));
        }
        var status = StatusComputador.valueOf(request.getStatus());
        AtomicInteger updated = new AtomicInteger(0);
        for (Long id : request.getIds()) {
            computadorRepository.findById(id).ifPresent(c -> {
                c.setStatus(status);
                computadorRepository.save(c);
                logService.registrar(auth.getName(), "ALTERACAO_EM_MASSA", "COMPUTADOR", id,
                    "Status alterado para " + status + " em acao em massa");
                updated.incrementAndGet();
            });
        }
        return ResponseEntity.ok(Map.of(
            "mensagem", updated.get() + " computadores atualizados",
            "total", updated.get(),
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
        AtomicInteger deleted = new AtomicInteger(0);
        for (Long id : request.getIds()) {
            computadorRepository.findById(id).ifPresent(c -> {
                computadorRepository.delete(c);
                logService.registrar(auth.getName(), "EXCLUSAO_EM_MASSA", "COMPUTADOR", id,
                    "Computador excluido em acao em massa");
                deleted.incrementAndGet();
            });
        }
        return ResponseEntity.ok(Map.of(
            "mensagem", deleted.get() + " computadores excluidos",
            "total", deleted.get()
        ));
    }

    @PostMapping("/bulk-check")
    public ResponseEntity<?> bulkCheck(@RequestBody @Valid BulkIdsRequest request) {
        if (request.getIds() == null || request.getIds().isEmpty()) {
            return ResponseEntity.ok(Map.of("existem", 0, "nãoExistem", 0, "idsValidos", List.of()));
        }
        List<Long> validos = request.getIds().stream()
            .filter(id -> computadorRepository.existsById(id))
            .toList();
        return ResponseEntity.ok(Map.of(
            "existem", validos.size(),
            "naoExistem", request.getIds().size() - validos.size(),
            "idsValidos", validos
        ));
    }

    @lombok.Getter @lombok.Setter
    public static class BulkStatusRequest {
        private List<Long> ids;
        private String status;
    }

    @lombok.Getter @lombok.Setter
    public static class BulkIdsRequest {
        private List<Long> ids;
    }
}
