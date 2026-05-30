package com.petclinic.backend.service;

import com.petclinic.backend.dto.PetRequestDto;
import com.petclinic.backend.dto.PetResponseDto;
import com.petclinic.backend.dto.PetSearchResponseDto;
import java.util.List;

public interface PetService {

    PetResponseDto createPet(PetRequestDto request);

    PetResponseDto getPetById(Long id);

    List<PetSearchResponseDto> searchPetsByName(String name);
}
