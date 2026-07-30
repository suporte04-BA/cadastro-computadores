package com.inventario.repository;

import com.inventario.model.OrdemServico;
import com.inventario.model.enums.StatusOrdemServico;
import com.inventario.model.enums.PrioridadeOrdemServico;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrdemServicoRepository extends JpaRepository<OrdemServico, Long> {

    long countByStatus(StatusOrdemServico status);

    long countByPrioridade(PrioridadeOrdemServico prioridade);

    @EntityGraph(attributePaths = {"computador"})
    @Query("SELECT o FROM OrdemServico o WHERE " +
           "(:status IS NULL OR o.status = :status) AND " +
           "(:prioridade IS NULL OR o.prioridade = :prioridade) AND " +
           "(:computadorId IS NULL OR o.computador.id = :computadorId)")
    Page<OrdemServico> filtrar(@Param("status") StatusOrdemServico status,
                                @Param("prioridade") PrioridadeOrdemServico prioridade,
                                @Param("computadorId") Long computadorId,
                                Pageable pageable);

    @EntityGraph(attributePaths = {"computador"})
    Optional<OrdemServico> findById(Long id);

    @Query("SELECT o.prioridade, COUNT(o) FROM OrdemServico o GROUP BY o.prioridade")
    List<Object[]> countGroupByPrioridade();

    @Query("SELECT o.status, COUNT(o) FROM OrdemServico o GROUP BY o.status")
    List<Object[]> countGroupByStatus();
}
