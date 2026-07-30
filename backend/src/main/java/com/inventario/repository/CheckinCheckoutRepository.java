package com.inventario.repository;

import com.inventario.model.CheckinCheckout;
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
public interface CheckinCheckoutRepository extends JpaRepository<CheckinCheckout, Long> {

    @EntityGraph(attributePaths = {"computador"})
    List<CheckinCheckout> findByComputadorIdAndStatusOrderByDataOperacaoDesc(Long computadorId, String status);

    @EntityGraph(attributePaths = {"computador"})
    Page<CheckinCheckout> findByStatusOrderByDataOperacaoDesc(String status, Pageable pageable);

    @EntityGraph(attributePaths = {"computador"})
    @Query("SELECT c FROM CheckinCheckout c WHERE " +
           "(:status IS NULL OR :status = '' OR c.status = :status) AND " +
           "(:usuario IS NULL OR :usuario = '' OR c.usuarioResponsavel LIKE '%' || :usuario || '%')")
    Page<CheckinCheckout> filtrar(@Param("status") String status,
                                  @Param("usuario") String usuario,
                                  Pageable pageable);

    long countByStatus(String status);

    @EntityGraph(attributePaths = {"computador"})
    Optional<CheckinCheckout> findById(Long id);
}
