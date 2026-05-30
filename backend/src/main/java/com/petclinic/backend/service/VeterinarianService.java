package com.petclinic.backend.service;

import com.petclinic.backend.dto.VeterinarianResponseDto;
import java.util.List;

public interface VeterinarianService {

    List<VeterinarianResponseDto> getAllVeterinarians();
}
