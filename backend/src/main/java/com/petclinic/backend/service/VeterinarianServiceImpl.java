package com.petclinic.backend.service;

import com.petclinic.backend.dao.VeterinarianDao;
import com.petclinic.backend.dto.VeterinarianResponseDto;
import com.petclinic.backend.entity.Veterinarian;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class VeterinarianServiceImpl implements VeterinarianService {

    private final VeterinarianDao veterinarianDao;

    public VeterinarianServiceImpl(VeterinarianDao veterinarianDao) {
        this.veterinarianDao = veterinarianDao;
    }

    @Override
    public List<VeterinarianResponseDto> getAllVeterinarians() {
        return veterinarianDao.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private VeterinarianResponseDto toResponse(Veterinarian veterinarian) {
        return VeterinarianResponseDto.builder()
                .id(veterinarian.getId())
                .firstName(veterinarian.getFirstName())
                .lastName(veterinarian.getLastName())
                .specialty(veterinarian.getSpecialty())
                .build();
    }
}
