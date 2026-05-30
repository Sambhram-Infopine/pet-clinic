package com.petclinic.backend.service;

import com.petclinic.backend.dao.VeterinarianDao;
import com.petclinic.backend.dto.VeterinarianResponseDto;
import com.petclinic.backend.entity.Veterinarian;
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
class VeterinarianServiceImplTest {

    @Mock
    private VeterinarianDao veterinarianDao;

    @InjectMocks
    private VeterinarianServiceImpl veterinarianService;

    private Veterinarian v1;

    @BeforeEach
    void setUp() {
        v1 = Veterinarian.builder().id(1L).firstName("Doc").lastName("Smith").specialty("Surgery").build();
    }

    @Test
    void getAllVeterinarians_returnsMappedList() {
        when(veterinarianDao.findAll()).thenReturn(List.of(v1));

        List<VeterinarianResponseDto> res = veterinarianService.getAllVeterinarians();

        assertEquals(1, res.size());
        assertEquals("Doc", res.get(0).getFirstName());
    }
}
