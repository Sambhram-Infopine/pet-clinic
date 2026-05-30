package com.petclinic.backend.service;

import com.petclinic.backend.dao.OwnerDao;
import com.petclinic.backend.dao.PetDao;
import com.petclinic.backend.dao.PetTypeDao;
import com.petclinic.backend.dto.PetRequestDto;
import com.petclinic.backend.dto.PetResponseDto;
import com.petclinic.backend.entity.Owner;
import com.petclinic.backend.entity.Pet;
import com.petclinic.backend.entity.PetType;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PetServiceImplTest {

    @Mock
    private PetDao petDao;

    @Mock
    private OwnerDao ownerDao;

    @Mock
    private PetTypeDao petTypeDao;

    @InjectMocks
    private PetServiceImpl petService;

    private Owner owner;
    private PetType petType;
    private Pet samplePet;

    @BeforeEach
    void setUp() {
        owner = Owner.builder().id(1L).firstName("A").build();
        petType = PetType.builder().id(2L).name("Cat").build();

        samplePet = Pet.builder()
                .id(5L)
                .name("Whiskers")
                .birthDate(LocalDate.of(2020,1,1))
                .owner(owner)
                .petType(petType)
                .build();
    }

    @Test
    void createPet_success_returnsDto() {
        PetRequestDto req = PetRequestDto.builder()
                .name("Whiskers")
                .birthDate(LocalDate.of(2020,1,1))
                .ownerId(1L)
                .petTypeId(2L)
                .build();

        when(ownerDao.findById(1L)).thenReturn(Optional.of(owner));
        when(petTypeDao.findById(2L)).thenReturn(Optional.of(petType));
        when(petDao.save(any())).thenReturn(samplePet);

        PetResponseDto res = petService.createPet(req);

        assertEquals(5L, res.getId());
        assertEquals("Whiskers", res.getName());
        assertEquals(1L, res.getOwnerId());
        verify(petDao).save(any());
    }

    @Test
    void createPet_ownerNotFound_throws() {
        PetRequestDto req = PetRequestDto.builder().ownerId(99L).petTypeId(2L).build();
        when(ownerDao.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> petService.createPet(req));
    }

    @Test
    void getPetById_found_returnsDto() {
        when(petDao.findById(5L)).thenReturn(Optional.of(samplePet));

        PetResponseDto res = petService.getPetById(5L);

        assertEquals(5L, res.getId());
    }

    @Test
    void getPetById_notFound_throws() {
        when(petDao.findById(10L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> petService.getPetById(10L));
    }
}
