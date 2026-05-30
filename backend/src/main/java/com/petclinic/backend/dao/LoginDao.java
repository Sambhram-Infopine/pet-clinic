package com.petclinic.backend.dao;

import com.petclinic.backend.entity.Login;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginDao extends JpaRepository<Login, Long> {

    Optional<Login> findByUsernameOrEmail(String username, String email);
}
