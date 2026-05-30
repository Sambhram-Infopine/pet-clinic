package com.petclinic.backend.controller;

import com.petclinic.backend.dto.VeterinarianResponseDto;
import com.petclinic.backend.service.VeterinarianService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/veterinarians")
public class VeterinarianController {

    private final VeterinarianService veterinarianService;

    public VeterinarianController(VeterinarianService veterinarianService) {
        this.veterinarianService = veterinarianService;
    }

    @GetMapping
    public ResponseEntity<List<VeterinarianResponseDto>> getAllVeterinarians() {
        return ResponseEntity.ok(veterinarianService.getAllVeterinarians());
    }
}
