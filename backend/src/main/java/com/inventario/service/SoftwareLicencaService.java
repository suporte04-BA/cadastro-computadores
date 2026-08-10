package com.inventario.service;

import com.inventario.dto.PageResponse;
import com.inventario.dto.SoftwareLicencaDTO;
import com.inventario.exception.RecursoNaoEncontradoException;
import com.inventario.exception.RegraNegocioException;
import com.inventario.model.SoftwareLicenca;
import com.inventario.repository.SoftwareLicencaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SoftwareLicencaService {

    private final SoftwareLicencaRepository repository;

    @Transactional(readOnly = true)
    public PageResponse<SoftwareLicencaDTO> listarPaginado(int page, int size, String termo) {
        String t = (termo != null && !termo.isEmpty()) ? termo : null;
        Page<SoftwareLicenca> pageResult = repository.filtrar(t,
            PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id")));
        List<SoftwareLicencaDTO> content = pageResult.getContent().stream().map(this::toDTO).toList();
        return PageResponse.<SoftwareLicencaDTO>builder()
            .content(content).page(pageResult.getNumber()).size(pageResult.getSize())
            .totalElements(pageResult.getTotalElements()).totalPages(pageResult.getTotalPages()).build();
    }

    @Transactional(readOnly = true)
    public SoftwareLicencaDTO buscarPorId(Long id) {
        return toDTO(repository.findById(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Software Licenca", id)));
    }

    @Transactional
    public SoftwareLicencaDTO cadastrar(SoftwareLicencaDTO dto) {
        SoftwareLicenca s = new SoftwareLicenca();
        s.setNomeSoftware(dto.getNomeSoftware());
        s.setFabricante(dto.getFabricante());
        s.setChaveLicenca(dto.getChaveLicenca());
        s.setTipoLicenca(dto.getTipoLicenca());
        s.setQuantidadeTotal(dto.getQuantidadeTotal() != null ? dto.getQuantidadeTotal() : 1);
        s.setQuantidadeUtilizada(dto.getQuantidadeUtilizada() != null ? dto.getQuantidadeUtilizada() : 0);
        if (s.getQuantidadeUtilizada() > s.getQuantidadeTotal()) {
            throw new RegraNegocioException("Quantidade utilizada nao pode exceder a quantidade total");
        }
        s.setDataAquisicao(dto.getDataAquisicao());
        s.setDataExpiracao(dto.getDataExpiracao());
        s.setObservacoes(dto.getObservacoes());
        return toDTO(repository.save(s));
    }

    @Transactional
    public SoftwareLicencaDTO atualizar(Long id, SoftwareLicencaDTO dto) {
        SoftwareLicenca s = repository.findById(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Software Licenca", id));
        if (dto.getNomeSoftware() != null) s.setNomeSoftware(dto.getNomeSoftware());
        if (dto.getFabricante() != null) s.setFabricante(dto.getFabricante());
        if (dto.getChaveLicenca() != null) s.setChaveLicenca(dto.getChaveLicenca());
        if (dto.getTipoLicenca() != null) s.setTipoLicenca(dto.getTipoLicenca());
        if (dto.getQuantidadeTotal() != null) s.setQuantidadeTotal(dto.getQuantidadeTotal());
        if (dto.getQuantidadeUtilizada() != null) s.setQuantidadeUtilizada(dto.getQuantidadeUtilizada());
        if (s.getQuantidadeUtilizada() > s.getQuantidadeTotal()) {
            throw new RegraNegocioException("Quantidade utilizada nao pode exceder a quantidade total");
        }
        if (dto.getDataAquisicao() != null) s.setDataAquisicao(dto.getDataAquisicao());
        if (dto.getDataExpiracao() != null) s.setDataExpiracao(dto.getDataExpiracao());
        if (dto.getObservacoes() != null) s.setObservacoes(dto.getObservacoes());
        return toDTO(repository.save(s));
    }

    @Transactional
    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Software Licenca", id);
        }
        repository.deleteById(id);
    }

    public SoftwareLicencaDTO toDTO(SoftwareLicenca s) {
        return SoftwareLicencaDTO.builder()
            .id(s.getId())
            .nomeSoftware(s.getNomeSoftware())
            .fabricante(s.getFabricante())
            .chaveLicenca(s.getChaveLicenca())
            .tipoLicenca(s.getTipoLicenca())
            .quantidadeTotal(s.getQuantidadeTotal())
            .quantidadeUtilizada(s.getQuantidadeUtilizada())
            .dataAquisicao(s.getDataAquisicao())
            .dataExpiracao(s.getDataExpiracao())
            .observacoes(s.getObservacoes())
            .dataCriacao(s.getDataCriacao())
            .dataAtualizacao(s.getDataAtualizacao())
            .build();
    }
}
