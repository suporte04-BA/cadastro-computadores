package com.inventario.repository;

import com.inventario.model.HistoricoAtribuicao;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HistoricoAtribuicaoRepository extends JpaRepository<HistoricoAtribuicao, Long> {
    @EntityGraph(attributePaths = {"computador"})
    List<HistoricoAtribuicao> findByComputadorIdOrderByDataTrocaDesc(Long computadorId);
}
