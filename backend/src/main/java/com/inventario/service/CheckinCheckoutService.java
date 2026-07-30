package com.inventario.service;

import com.inventario.dto.*;
import com.inventario.exception.*;
import com.inventario.model.*;
import com.inventario.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CheckinCheckoutService {

    private final CheckinCheckoutRepository repository;
    private final ComputadorRepository computadorRepository;
    private final LogAtividadeService logService;

    public PageResponse<CheckinCheckoutDTO> listarPaginado(int page, int size, String status, String usuario) {
        Page<CheckinCheckout> pageResult = repository.filtrar(status, usuario,
            PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "dataOperacao")));
        List<CheckinCheckoutDTO> content = pageResult.getContent().stream().map(this::toDTO).toList();
        return PageResponse.<CheckinCheckoutDTO>builder()
            .content(content).page(pageResult.getNumber()).size(pageResult.getSize())
            .totalElements(pageResult.getTotalElements()).totalPages(pageResult.getTotalPages()).build();
    }

    public List<CheckinCheckoutDTO> listarPorComputador(Long computadorId) {
        return repository.findByComputadorIdAndStatusOrderByDataOperacaoDesc(computadorId, "ATIVO")
            .stream().map(this::toDTO).toList();
    }

    public List<CheckinCheckoutDTO> listarAtivos() {
        return repository.findByStatusOrderByDataOperacaoDesc("ATIVO",
            PageRequest.of(0, 100)).getContent().stream().map(this::toDTO).toList();
    }

    @Transactional
    public CheckinCheckoutDTO checkout(Long computadorId, String usuario, String observacao, String realizadoPor) {
        Computador comp = computadorRepository.findById(computadorId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Computador", computadorId));

        CheckinCheckout cc = CheckinCheckout.builder()
            .computador(comp)
            .usuarioResponsavel(usuario)
            .tipo("CHECKOUT")
            .observacao(observacao)
            .realizadoPor(realizadoPor)
            .status("ATIVO")
            .build();

        comp.setUsuarioDesignado(usuario);
        computadorRepository.save(comp);

        logService.registrar(realizadoPor, "CHECKOUT", "COMPUTADOR", computadorId,
            "Checkout: " + comp.getNomePc() + " para " + usuario);

        return toDTO(repository.save(cc));
    }

    @Transactional
    public CheckinCheckoutDTO checkin(Long checkoutId, String observacao, String realizadoPor) {
        CheckinCheckout cc = repository.findById(checkoutId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Checkout", checkoutId));

        cc.setStatus("DEVOLVIDO");
        cc.setDataDevolucao(java.time.LocalDateTime.now());
        if (observacao != null) cc.setObservacao(cc.getObservacao() != null ? cc.getObservacao() + " | Devolucao: " + observacao : "Devolucao: " + observacao);

        Computador comp = cc.getComputador();
        comp.setUsuarioDesignado(null);
        computadorRepository.save(comp);
        logService.registrar(realizadoPor, "CHECKIN", "COMPUTADOR", comp.getId(),
            "Devolucao: " + comp.getNomePc() + " de " + cc.getUsuarioResponsavel());

        return toDTO(repository.save(cc));
    }

    public java.util.Map<String, Object> estatisticas() {
        java.util.Map<String, Object> stats = new java.util.LinkedHashMap<>();
        stats.put("ativos", repository.countByStatus("ATIVO"));
        stats.put("devolvidos", repository.countByStatus("DEVOLVIDO"));
        return stats;
    }

    private CheckinCheckoutDTO toDTO(CheckinCheckout cc) {
        return CheckinCheckoutDTO.builder()
            .id(cc.getId())
            .computadorId(cc.getComputador().getId())
            .computadorNome(cc.getComputador().getNomePc())
            .numeroSerie(cc.getComputador().getNumeroSerie())
            .usuarioResponsavel(cc.getUsuarioResponsavel())
            .tipo(cc.getTipo())
            .dataOperacao(cc.getDataOperacao())
            .observacao(cc.getObservacao())
            .realizadoPor(cc.getRealizadoPor())
            .dataDevolucao(cc.getDataDevolucao())
            .status(cc.getStatus())
            .build();
    }
}
