package com.petclinic.backend.dao;

import com.petclinic.backend.entity.Owner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OwnerDao extends JpaRepository<Owner, Long> {
}
