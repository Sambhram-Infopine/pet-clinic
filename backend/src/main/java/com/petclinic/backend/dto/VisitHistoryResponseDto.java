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
public class VisitHistoryResponseDto {

    private Long visitId;

    private LocalDate visitDate;

    private Long ownerId;

    private String ownerName;

    private Long petId;

    private String petName;

    private String petType;

    private String visitType;

    private String description;

    private Long veterinarianId;

    private String veterinarianName;
}
