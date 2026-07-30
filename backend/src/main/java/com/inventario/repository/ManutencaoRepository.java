package com.inventario.repository;

import com.inventario.model.Manutencao;
import com.inventario.model.enums.StatusManutencao;
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
public interface ManutencaoRepository extends JpaRepository<Manutencao, Long> {

    @EntityGraph(attributePaths = {"computador"})
    List<Manutencao> findByComputadorIdOrderByDataInicioDesc(Long computadorId);

    long countByStatus(StatusManutencao status);

    @EntityGraph(attributePaths = {"computador"})
    @Query("SELECT m FROM Manutencao m WHERE " +
           "(:status IS NULL OR m.status = :status) AND " +
           "(:computadorId IS NULL OR m.computador.id = :computadorId)")
    Page<Manutencao> filtrar(@Param("status") StatusManutencao status,
                             @Param("computadorId") Long computadorId,
                             Pageable pageable);

    @EntityGraph(attributePaths = {"computador"})
    Optional<Manutencao> findById(Long id);

    @Query("SELECT m.tipo, COUNT(m) FROM Manutencao m GROUP BY m.tipo")
    List<Object[]> countGroupByTipo();

    @Query("SELECT COALESCE(SUM(m.custo), 0) FROM Manutencao m WHERE m.custo IS NOT NULL")
    Double sumTotalCusto();

    @Query("SELECT FUNCTION('YEAR', m.dataInicio), FUNCTION('MONTH', m.dataInicio), COUNT(m) FROM Manutencao m WHERE m.dataInicio IS NOT NULL GROUP BY FUNCTION('YEAR', m.dataInicio), FUNCTION('MONTH', m.dataInicio) ORDER BY FUNCTION('YEAR', m.dataInicio), FUNCTION('MONTH', m.dataInicio)")
    List<Object[]> countByMes();
}
