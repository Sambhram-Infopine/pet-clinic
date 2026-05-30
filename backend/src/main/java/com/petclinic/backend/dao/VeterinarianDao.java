package com.petclinic.backend.dao;

import com.petclinic.backend.entity.Veterinarian;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VeterinarianDao extends JpaRepository<Veterinarian, Long> {
}
