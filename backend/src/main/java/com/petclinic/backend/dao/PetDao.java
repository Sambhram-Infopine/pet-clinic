package com.petclinic.backend.dao;

import com.petclinic.backend.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetDao extends JpaRepository<Pet, Long> {
}
