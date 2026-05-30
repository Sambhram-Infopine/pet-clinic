package com.petclinic.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OwnerResponseDto {

    private Long id;

    private String firstName;

    private String lastName;

    private String address;

    private String city;

    private String telephoneNumber;
}
