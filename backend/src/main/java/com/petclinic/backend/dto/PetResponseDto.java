package com.petclinic.backend.dto;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetResponseDto {

    private Long id;

    private String name;

    private LocalDate birthDate;

    private Long ownerId;

    private Long petTypeId;

    private String petTypeName;
}
