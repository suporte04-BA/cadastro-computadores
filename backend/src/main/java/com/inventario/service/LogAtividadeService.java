package com.inventario.service;

import com.inventario.dto.LogAtividadeDTO;
import com.inventario.dto.PageResponse;
import com.inventario.model.LogAtividade;
import com.inventario.repository.LogAtividadeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LogAtividadeService {

    private final LogAtividadeRepository repository;

    @Transactional
    public void registrar(String usuario, String acao, String entidade, Long entidadeId, String descricao) {
        LogAtividade log = LogAtividade.builder()
            .usuario(usuario)
            .acao(acao)
            .entidade(entidade)
            .entidadeId(entidadeId)
            .descricao(descricao)
            .dataAtividade(LocalDateTime.now())
            .build();
        repository.save(log);
    }

    @Transactional(readOnly = true)
    public PageResponse<LogAtividadeDTO> listarPaginado(int page, int size, String usuario, String entidade) {
        String u = (usuario != null && !usuario.isEmpty()) ? usuario : null;
        String e = (entidade != null && !entidade.isEmpty()) ? entidade : null;
        Page<LogAtividade> pageResult = repository.filtrar(u, e,
            PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "dataAtividade")));

        List<LogAtividadeDTO> content = pageResult.getContent().stream()
            .map(this::toDTO).toList();

        return PageResponse.<LogAtividadeDTO>builder()
            .content(content)
            .page(pageResult.getNumber())
            .size(pageResult.getSize())
            .totalElements(pageResult.getTotalElements())
            .totalPages(pageResult.getTotalPages())
            .build();
    }

    @Transactional(readOnly = true)
    public List<LogAtividadeDTO> ultimas(int limit) {
        return repository.findAll(PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "dataAtividade")))
            .getContent().stream().map(this::toDTO).toList();
    }

    private LogAtividadeDTO toDTO(LogAtividade l) {
        return LogAtividadeDTO.builder()
            .id(l.getId())
            .usuario(l.getUsuario())
            .acao(l.getAcao())
            .entidade(l.getEntidade())
            .entidadeId(l.getEntidadeId())
            .descricao(l.getDescricao())
            .dataAtividade(l.getDataAtividade())
            .ipAddress(l.getIpAddress())
            .build();
    }
}
