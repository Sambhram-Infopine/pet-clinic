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
public class PetSearchResponseDto {

    private Long petId;

    private String petName;

    private LocalDate birthDate;

    private Long petTypeId;

    private String petTypeName;

    private Long ownerId;

    private String ownerName;

    private String ownerTelephoneNumber;
}
