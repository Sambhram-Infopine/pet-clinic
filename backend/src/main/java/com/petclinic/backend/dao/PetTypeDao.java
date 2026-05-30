package com.petclinic.backend.dao;

import com.petclinic.backend.entity.PetType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetTypeDao extends JpaRepository<PetType, Long> {
}
