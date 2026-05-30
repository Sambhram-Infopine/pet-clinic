package com.petclinic.backend.service;

import com.petclinic.backend.dao.PetTypeDao;
import com.petclinic.backend.dto.PetTypeResponseDto;
import com.petclinic.backend.entity.PetType;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PetTypeServiceImplTest {

    @Mock
    private PetTypeDao petTypeDao;

    @InjectMocks
    private PetTypeServiceImpl petTypeService;

    private PetType t1;
    private PetType t2;

    @BeforeEach
    void setUp() {
        t1 = PetType.builder().id(1L).name("Dog").build();
        t2 = PetType.builder().id(2L).name("Cat").build();
    }

    @Test
    void getAllPetTypes_returnsMappedList() {
        when(petTypeDao.findAll()).thenReturn(List.of(t1, t2));

        List<PetTypeResponseDto> res = petTypeService.getAllPetTypes();

        assertEquals(2, res.size());
        assertEquals("Dog", res.get(0).getName());
    }
}
