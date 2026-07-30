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

    public List<DepartamentoDTO> listarTodos() {
        return repository.findAll().stream().map(this::toDTO).toList();
    }

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
        if (dto.getNome() != null) d.setNome(dto.getNome());
        return toDTO(repository.save(d));
    }

    @Transactional
    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Departamento", id);
        }
        repository.deleteById(id);
    }

    private DepartamentoDTO toDTO(Departamento d) {
        return DepartamentoDTO.builder()
            .id(d.getId())
            .nome(d.getNome())
            .totalComputadores(d.getNome() != null ? computadorRepository.countByDepartamento(d.getNome()) : 0L)
            .build();
    }
}
