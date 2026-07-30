package com.inventario.repository;

import com.inventario.model.LogAtividade;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LogAtividadeRepository extends JpaRepository<LogAtividade, Long> {

    @Query("SELECT l FROM LogAtividade l WHERE " +
           "(:usuario IS NULL OR :usuario = '' OR l.usuario = :usuario) AND " +
           "(:entidade IS NULL OR :entidade = '' OR l.entidade = :entidade)")
    Page<LogAtividade> filtrar(@Param("usuario") String usuario,
                               @Param("entidade") String entidade,
                               Pageable pageable);
}
