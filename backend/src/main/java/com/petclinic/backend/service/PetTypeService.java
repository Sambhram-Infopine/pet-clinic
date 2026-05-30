package com.petclinic.backend.service;

import com.petclinic.backend.dto.PetTypeResponseDto;
import java.util.List;

public interface PetTypeService {

    List<PetTypeResponseDto> getAllPetTypes();
}
