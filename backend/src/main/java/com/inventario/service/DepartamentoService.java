package com.inventario.service;

import com.inventario.dto.DepartamentoDTO;
import com.inventario.exception.*;
import com.inventario.model.Departamento;
import com.inventario.repository.ComputadorRepository;
import com.inventario.repository.DepartamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartamentoService {

    private final DepartamentoRepository repository;
    private final ComputadorRepository computadorRepository;

    @Transactional(readOnly = true)
    public List<DepartamentoDTO> listarTodos() {
        List<Departamento> depts = repository.findAll();
        java.util.Map<String, Long> counts = new java.util.HashMap<>();
        List<Object[]> rawCounts = computadorRepository.countGroupByDepartamento();
        for (Object[] row : rawCounts) {
            counts.put((String) row[0], (Long) row[1]);
        }
        return depts.stream().map(d -> toDTO(d, counts.getOrDefault(d.getNome(), 0L))).toList();
    }

    @Transactional(readOnly = true)
    public DepartamentoDTO buscarPorId(Long id) {
        Departamento d = repository.findById(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Departamento", id));
        return toDTO(d);
    }

    @Transactional
    public DepartamentoDTO cadastrar(DepartamentoDTO dto) {
        if (repository.existsByNome(dto.getNome())) {
            throw new RegraNegocioException("Departamento ja existe");
        }
        Departamento d = new Departamento();
        d.setNome(dto.getNome());
        return toDTO(repository.save(d));
    }

    @Transactional
    public DepartamentoDTO atualizar(Long id, DepartamentoDTO dto) {
        Departamento d = repository.findById(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Departamento", id));
        if (dto.getNome() != null) {
            if (!d.getNome().equals(dto.getNome()) && repository.existsByNome(dto.getNome())) {
                throw new RegraNegocioException("Departamento ja existe");
            }
            d.setNome(dto.getNome());
        }
        return toDTO(repository.save(d));
    }

    @Transactional
    public void deletar(Long id) {
        Departamento d = repository.findById(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Departamento", id));
        if (d.getNome() != null) {
            long count = computadorRepository.countByDepartamento(d.getNome());
            if (count > 0) {
                throw new RegraNegocioException("Nao e possivel excluir departamento com " + count + " computador(es) vinculado(s)");
            }
        }
        repository.deleteById(id);
    }

    private DepartamentoDTO toDTO(Departamento d) {
        return toDTO(d, d.getNome() != null ? computadorRepository.countByDepartamento(d.getNome()) : 0L);
    }

    private DepartamentoDTO toDTO(Departamento d, long totalComputadores) {
        return DepartamentoDTO.builder()
            .id(d.getId())
            .nome(d.getNome())
            .totalComputadores(totalComputadores)
            .build();
    }
}
