package com.petclinic.backend.controller;

import com.petclinic.backend.dto.PetSearchResponseDto;
import com.petclinic.backend.service.PetService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pets-search")
public class PetSearchController {

    private final PetService petService;

    public PetSearchController(PetService petService) {
        this.petService = petService;
    }

    @GetMapping
    public ResponseEntity<List<PetSearchResponseDto>> searchPetsByName(@RequestParam String name) {
        return ResponseEntity.ok(petService.searchPetsByName(name));
    }
}
