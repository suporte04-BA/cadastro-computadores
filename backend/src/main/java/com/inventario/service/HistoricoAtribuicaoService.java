package com.inventario.service;

import com.inventario.dto.HistoricoAtribuicaoDTO;
import com.inventario.exception.RecursoNaoEncontradoException;
import com.inventario.model.Computador;
import com.inventario.model.HistoricoAtribuicao;
import com.inventario.repository.ComputadorRepository;
import com.inventario.repository.HistoricoAtribuicaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoricoAtribuicaoService {

    private final HistoricoAtribuicaoRepository repository;
    private final ComputadorRepository computadorRepository;

    public List<HistoricoAtribuicaoDTO> listarPorComputador(Long computadorId) {
        return repository.findByComputadorIdOrderByDataTrocaDesc(computadorId)
            .stream().map(this::toDTO).toList();
    }

    @Transactional
    public HistoricoAtribuicaoDTO registrar(Long computadorId, String usuarioAnterior, String usuarioNovo,
                                            String tipoMovimentacao, String observacao, String realizadoPor) {
        Computador comp = computadorRepository.findById(computadorId)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Computador", computadorId));

        HistoricoAtribuicao h = HistoricoAtribuicao.builder()
            .computador(comp)
            .usuarioAnterior(usuarioAnterior)
            .usuarioNovo(usuarioNovo)
            .dataTroca(LocalDateTime.now())
            .tipoMovimentacao(tipoMovimentacao != null ? tipoMovimentacao : "ATRIBUICAO")
            .observacao(observacao)
            .realizadoPor(realizadoPor)
            .build();

        return toDTO(repository.save(h));
    }

    private HistoricoAtribuicaoDTO toDTO(HistoricoAtribuicao h) {
        return HistoricoAtribuicaoDTO.builder()
            .id(h.getId())
            .computadorId(h.getComputador().getId())
            .computadorNome(h.getComputador().getNomePc())
            .usuarioAnterior(h.getUsuarioAnterior())
            .usuarioNovo(h.getUsuarioNovo())
            .dataTroca(h.getDataTroca())
            .observacao(h.getObservacao())
            .tipoMovimentacao(h.getTipoMovimentacao())
            .realizadoPor(h.getRealizadoPor())
            .build();
    }
}
