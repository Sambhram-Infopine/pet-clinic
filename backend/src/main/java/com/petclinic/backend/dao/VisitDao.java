package com.petclinic.backend.dao;

import com.petclinic.backend.entity.Visit;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VisitDao extends JpaRepository<Visit, Long> {

    @Query("""
            select v
            from Visit v
            join fetch v.pet p
            join fetch p.owner o
            join fetch p.petType pt
            join fetch v.veterinarian vet
            where (:ownerId is null or o.id = :ownerId)
              and (:petId is null or p.id = :petId)
              and (:date is null or v.visitDate = :date)
            order by v.visitDate desc, v.id desc
            """)
    List<Visit> findVisitHistory(
            @Param("ownerId") Long ownerId,
            @Param("petId") Long petId,
            @Param("date") LocalDate date);
}
