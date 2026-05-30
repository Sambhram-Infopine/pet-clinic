package com.petclinic.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitRequestDto {

    @NotNull(message = "Visit date is required")
    private LocalDate visitDate;

    @NotBlank(message = "Description is required")
    @Size(min = 2, max = 255, message = "Description must be between 2 and 255 characters")
    private String description;

    @NotNull(message = "Pet id is required")
    @Positive(message = "Pet id must be positive")
    private Long petId;

    @NotNull(message = "Veterinarian id is required")
    @Positive(message = "Veterinarian id must be positive")
    private Long veterinarianId;
}
