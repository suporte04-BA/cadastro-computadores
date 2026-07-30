package com.inventario.service;

import com.inventario.dto.FornecedorDTO;
import com.inventario.exception.RecursoNaoEncontradoException;
import com.inventario.exception.RegraNegocioException;
import com.inventario.model.Fornecedor;
import com.inventario.repository.FornecedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FornecedorService {

    private final FornecedorRepository repository;

    public List<FornecedorDTO> listarTodos() {
        return repository.findAll().stream().map(this::toDTO).toList();
    }

    public FornecedorDTO buscarPorId(Long id) {
        return toDTO(repository.findById(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Fornecedor", id)));
    }

    @Transactional
    public FornecedorDTO cadastrar(FornecedorDTO dto) {
        if (repository.existsByNome(dto.getNome())) {
            throw new RegraNegocioException("Fornecedor ja existe");
        }
        Fornecedor f = new Fornecedor();
        f.setNome(dto.getNome());
        f.setCnpj(dto.getCnpj());
        f.setEmail(dto.getEmail());
        f.setTelefone(dto.getTelefone());
        f.setContato(dto.getContato());
        f.setEndereco(dto.getEndereco());
        f.setObservacoes(dto.getObservacoes());
        return toDTO(repository.save(f));
    }

    @Transactional
    public FornecedorDTO atualizar(Long id, FornecedorDTO dto) {
        Fornecedor f = repository.findById(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Fornecedor", id));
        if (dto.getNome() != null) f.setNome(dto.getNome());
        if (dto.getCnpj() != null) f.setCnpj(dto.getCnpj());
        if (dto.getEmail() != null) f.setEmail(dto.getEmail());
        if (dto.getTelefone() != null) f.setTelefone(dto.getTelefone());
        if (dto.getContato() != null) f.setContato(dto.getContato());
        if (dto.getEndereco() != null) f.setEndereco(dto.getEndereco());
        if (dto.getObservacoes() != null) f.setObservacoes(dto.getObservacoes());
        return toDTO(repository.save(f));
    }

    @Transactional
    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Fornecedor", id);
        }
        repository.deleteById(id);
    }

    private FornecedorDTO toDTO(Fornecedor f) {
        return FornecedorDTO.builder()
            .id(f.getId())
            .nome(f.getNome())
            .cnpj(f.getCnpj())
            .email(f.getEmail())
            .telefone(f.getTelefone())
            .contato(f.getContato())
            .endereco(f.getEndereco())
            .observacoes(f.getObservacoes())
            .dataCriacao(f.getDataCriacao())
            .build();
    }
}
