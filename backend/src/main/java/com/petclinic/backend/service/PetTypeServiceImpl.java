package com.petclinic.backend.service;

import com.petclinic.backend.dao.PetTypeDao;
import com.petclinic.backend.dto.PetTypeResponseDto;
import com.petclinic.backend.entity.PetType;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class PetTypeServiceImpl implements PetTypeService {

    private final PetTypeDao petTypeDao;

    public PetTypeServiceImpl(PetTypeDao petTypeDao) {
        this.petTypeDao = petTypeDao;
    }

    @Override
    public List<PetTypeResponseDto> getAllPetTypes() {
        return petTypeDao.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private PetTypeResponseDto toResponse(PetType petType) {
        return PetTypeResponseDto.builder()
                .id(petType.getId())
                .name(petType.getName())
                .build();
    }
}
