package com.petclinic.backend.dao;

import com.petclinic.backend.entity.Pet;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PetDao extends JpaRepository<Pet, Long> {

    @Query("""
            select p
            from Pet p
            join fetch p.owner o
            join fetch p.petType pt
            where lower(p.name) like lower(concat('%', :name, '%'))
            order by p.name asc, p.id asc
            """)
    List<Pet> searchByNameWithOwner(@Param("name") String name);
}
