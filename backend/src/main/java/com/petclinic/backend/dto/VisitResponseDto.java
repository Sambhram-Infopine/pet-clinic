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
public class VisitResponseDto {

    private Long id;

    private LocalDate visitDate;

    private String description;

    private Long petId;

    private String petName;

    private Long veterinarianId;

    private String veterinarianName;
}
