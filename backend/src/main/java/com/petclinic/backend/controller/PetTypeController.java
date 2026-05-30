package com.petclinic.backend.controller;

import com.petclinic.backend.dto.PetTypeResponseDto;
import com.petclinic.backend.service.PetTypeService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pet-types")
public class PetTypeController {

    private final PetTypeService petTypeService;

    public PetTypeController(PetTypeService petTypeService) {
        this.petTypeService = petTypeService;
    }

    @GetMapping
    public ResponseEntity<List<PetTypeResponseDto>> getAllPetTypes() {
        return ResponseEntity.ok(petTypeService.getAllPetTypes());
    }
}
