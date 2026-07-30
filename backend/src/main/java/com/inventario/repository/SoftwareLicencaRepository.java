package com.inventario.repository;

import com.inventario.model.SoftwareLicenca;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SoftwareLicencaRepository extends JpaRepository<SoftwareLicenca, Long> {

    @Query("SELECT s FROM SoftwareLicenca s WHERE " +
           "(:termo IS NULL OR :termo = '' OR LOWER(s.nomeSoftware) LIKE LOWER('%' || :termo || '%') OR LOWER(s.fabricante) LIKE LOWER('%' || :termo || '%'))")
    Page<SoftwareLicenca> filtrar(@Param("termo") String termo, Pageable pageable);
}
