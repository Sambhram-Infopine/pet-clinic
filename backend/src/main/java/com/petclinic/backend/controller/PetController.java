package com.petclinic.backend.controller;

import com.petclinic.backend.dto.PetRequestDto;
import com.petclinic.backend.dto.PetResponseDto;
import com.petclinic.backend.service.PetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    @PostMapping
    public ResponseEntity<PetResponseDto> createPet(@Valid @RequestBody PetRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(petService.createPet(request));
    }
}
