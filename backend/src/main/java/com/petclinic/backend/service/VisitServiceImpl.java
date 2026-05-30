package com.petclinic.backend.service;

import com.petclinic.backend.dao.PetDao;
import com.petclinic.backend.dao.VeterinarianDao;
import com.petclinic.backend.dao.VisitDao;
import com.petclinic.backend.dto.VisitHistoryResponseDto;
import com.petclinic.backend.dto.VisitRequestDto;
import com.petclinic.backend.dto.VisitResponseDto;
import com.petclinic.backend.entity.Owner;
import com.petclinic.backend.entity.Pet;
import com.petclinic.backend.entity.Veterinarian;
import com.petclinic.backend.entity.Visit;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class VisitServiceImpl implements VisitService {

    private final VisitDao visitDao;
    private final PetDao petDao;
    private final VeterinarianDao veterinarianDao;

    public VisitServiceImpl(VisitDao visitDao, PetDao petDao, VeterinarianDao veterinarianDao) {
        this.visitDao = visitDao;
        this.petDao = petDao;
        this.veterinarianDao = veterinarianDao;
    }

    @Override
    public VisitResponseDto createVisit(VisitRequestDto request) {
        Pet pet = petDao.findById(request.getPetId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet not found"));
        Veterinarian veterinarian = veterinarianDao.findById(request.getVeterinarianId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Veterinarian not found"));

        Visit visit = Visit.builder()
                .visitDate(request.getVisitDate())
                .description(request.getDescription())
                .pet(pet)
                .veterinarian(veterinarian)
                .build();

        return toResponse(visitDao.save(visit));
    }

    @Override
    public List<VisitHistoryResponseDto> getVisitHistory(Long ownerId, Long petId, LocalDate date) {
        if (ownerId == null && petId == null && date == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "At least one filter is required: ownerId, petId, or date");
        }

        return visitDao.findVisitHistory(ownerId, petId, date)
                .stream()
                .map(this::toHistoryResponse)
                .toList();
    }

    private VisitResponseDto toResponse(Visit visit) {
        Veterinarian veterinarian = visit.getVeterinarian();

        return VisitResponseDto.builder()
                .id(visit.getId())
                .visitDate(visit.getVisitDate())
                .description(visit.getDescription())
                .petId(visit.getPet().getId())
                .petName(visit.getPet().getName())
                .veterinarianId(veterinarian.getId())
                .veterinarianName(veterinarian.getFirstName() + " " + veterinarian.getLastName())
                .build();
    }

    private VisitHistoryResponseDto toHistoryResponse(Visit visit) {
        Pet pet = visit.getPet();
        Owner owner = pet.getOwner();
        Veterinarian veterinarian = visit.getVeterinarian();

        return VisitHistoryResponseDto.builder()
                .visitId(visit.getId())
                .visitDate(visit.getVisitDate())
                .ownerId(owner.getId())
                .ownerName(owner.getFirstName() + " " + owner.getLastName())
                .petId(pet.getId())
                .petName(pet.getName())
                .petType(pet.getPetType().getName())
                .visitType(veterinarian.getSpecialty())
                .description(visit.getDescription())
                .veterinarianId(veterinarian.getId())
                .veterinarianName(veterinarian.getFirstName() + " " + veterinarian.getLastName())
                .build();
    }
}
