package com.inventario.repository;

import com.inventario.model.Computador;
import com.inventario.model.enums.StatusComputador;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComputadorRepository extends JpaRepository<Computador, Long> {

    boolean existsByNumeroSerie(String numeroSerie);

    boolean existsByNumeroSerieAndIdNot(String numeroSerie, Long id);

    long countByStatus(StatusComputador status);

    List<Computador> findAllByOrderByIdDesc();

    @Query("SELECT c FROM Computador c WHERE " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:padrao IS NULL OR " +
           "LOWER(c.nomePc) LIKE :padrao OR " +
           "LOWER(c.modeloMarca) LIKE :padrao OR " +
           "LOWER(c.numeroSerie) LIKE :padrao OR " +
           "LOWER(c.usuarioDesignado) LIKE :padrao OR " +
           "LOWER(c.fornecedor) LIKE :padrao)")
    Page<Computador> filtrar(@Param("status") StatusComputador status,
                             @Param("padrao") String padrao,
                             Pageable pageable);

    @Query("SELECT COUNT(c) FROM Computador c WHERE c.dataInicioCiclo IS NOT NULL AND c.dataInicioCiclo < :limite")
    long countManutencaoVencida(@Param("limite") java.time.LocalDateTime limite);

    @Query("SELECT c FROM Computador c WHERE c.dataInicioCiclo IS NOT NULL AND c.dataInicioCiclo < :limite ORDER BY c.dataInicioCiclo ASC")
    List<Computador> findManutencaoVencida(@Param("limite") java.time.LocalDateTime limite);

    @Query("SELECT c.status, COUNT(c) FROM Computador c GROUP BY c.status")
    List<Object[]> countGroupByStatus();

    @Query("SELECT c.id, c.nomePc, c.dataGarantia FROM Computador c WHERE c.dataGarantia IS NOT NULL AND c.dataGarantia < CURRENT_DATE")
    List<Object[]> findGarantiaVencida();

    @Query("SELECT c.id, c.nomePc, c.dataGarantia FROM Computador c WHERE c.dataGarantia IS NOT NULL AND c.dataGarantia >= CURRENT_DATE")
    List<Object[]> findGarantiaProxima();

    long countByDepartamento(String departamento);

    @Query("SELECT c.departamento, COUNT(c) FROM Computador c WHERE c.departamento IS NOT NULL GROUP BY c.departamento")
    List<Object[]> countGroupByDepartamento();

    long countByFornecedor(String fornecedor);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM Computador c WHERE c.id = :id")
    Optional<Computador> findByIdWithPessimisticLock(@Param("id") Long id);
}
