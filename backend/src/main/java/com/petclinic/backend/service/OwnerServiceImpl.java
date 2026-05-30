package com.petclinic.backend.service;

import com.petclinic.backend.dao.OwnerDao;
import com.petclinic.backend.dto.OwnerRequestDto;
import com.petclinic.backend.dto.OwnerResponseDto;
import com.petclinic.backend.entity.Owner;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class OwnerServiceImpl implements OwnerService {

    private final OwnerDao ownerDao;

    public OwnerServiceImpl(OwnerDao ownerDao) {
        this.ownerDao = ownerDao;
    }

    @Override
    public OwnerResponseDto createOwner(OwnerRequestDto request) {
        Owner owner = Owner.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .address(request.getAddress())
                .city(request.getCity())
                .telephoneNumber(request.getTelephoneNumber())
                .build();

        return toResponse(ownerDao.save(owner));
    }

    @Override
    public OwnerResponseDto getOwnerById(Long id) {
        Owner owner = ownerDao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found"));

        return toResponse(owner);
    }

    private OwnerResponseDto toResponse(Owner owner) {
        return OwnerResponseDto.builder()
                .id(owner.getId())
                .firstName(owner.getFirstName())
                .lastName(owner.getLastName())
                .address(owner.getAddress())
                .city(owner.getCity())
                .telephoneNumber(owner.getTelephoneNumber())
                .build();
    }
}
