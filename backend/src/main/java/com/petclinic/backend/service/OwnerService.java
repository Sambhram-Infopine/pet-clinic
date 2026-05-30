package com.petclinic.backend.service;

import com.petclinic.backend.dto.OwnerRequestDto;
import com.petclinic.backend.dto.OwnerResponseDto;

public interface OwnerService {

    OwnerResponseDto createOwner(OwnerRequestDto request);
}
