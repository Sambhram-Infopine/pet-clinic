package com.petclinic.backend.service;

import com.petclinic.backend.dao.OwnerDao;
import com.petclinic.backend.dao.PetDao;
import com.petclinic.backend.dao.PetTypeDao;
import com.petclinic.backend.dto.PetRequestDto;
import com.petclinic.backend.dto.PetResponseDto;
import com.petclinic.backend.dto.PetSearchResponseDto;
import com.petclinic.backend.entity.Owner;
import com.petclinic.backend.entity.Pet;
import com.petclinic.backend.entity.PetType;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PetServiceImpl implements PetService {

    private final PetDao petDao;
    private final OwnerDao ownerDao;
    private final PetTypeDao petTypeDao;

    public PetServiceImpl(PetDao petDao, OwnerDao ownerDao, PetTypeDao petTypeDao) {
        this.petDao = petDao;
        this.ownerDao = ownerDao;
        this.petTypeDao = petTypeDao;
    }

    @Override
    public PetResponseDto createPet(PetRequestDto request) {
        Owner owner = ownerDao.findById(request.getOwnerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found"));
        PetType petType = petTypeDao.findById(request.getPetTypeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet type not found"));

        Pet pet = Pet.builder()
                .name(request.getName())
                .birthDate(request.getBirthDate())
                .owner(owner)
                .petType(petType)
                .build();

        return toResponse(petDao.save(pet));
    }

    @Override
    public PetResponseDto getPetById(Long id) {
        Pet pet = petDao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet not found"));

        return toResponse(pet);
    }

    @Override
    public List<PetSearchResponseDto> searchPetsByName(String name) {
        if (name == null || name.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pet name is required");
        }

        return petDao.searchByNameWithOwner(name.trim())
                .stream()
                .map(this::toSearchResponse)
                .toList();
    }

    private PetResponseDto toResponse(Pet pet) {
        return PetResponseDto.builder()
                .id(pet.getId())
                .name(pet.getName())
                .birthDate(pet.getBirthDate())
                .ownerId(pet.getOwner().getId())
                .petTypeId(pet.getPetType().getId())
                .petTypeName(pet.getPetType().getName())
                .build();
    }

    private PetSearchResponseDto toSearchResponse(Pet pet) {
        Owner owner = pet.getOwner();

        return PetSearchResponseDto.builder()
                .petId(pet.getId())
                .petName(pet.getName())
                .birthDate(pet.getBirthDate())
                .petTypeId(pet.getPetType().getId())
                .petTypeName(pet.getPetType().getName())
                .ownerId(owner.getId())
                .ownerName(owner.getFirstName() + " " + owner.getLastName())
                .ownerTelephoneNumber(owner.getTelephoneNumber())
                .build();
    }
}
