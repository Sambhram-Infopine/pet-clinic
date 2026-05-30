package com.petclinic.backend.service;

import com.petclinic.backend.dto.PetRequestDto;
import com.petclinic.backend.dto.PetResponseDto;

public interface PetService {

    PetResponseDto createPet(PetRequestDto request);
}
