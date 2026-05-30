package com.petclinic.backend.service;

import com.petclinic.backend.dao.OwnerDao;
import com.petclinic.backend.dto.OwnerRequestDto;
import com.petclinic.backend.dto.OwnerResponseDto;
import com.petclinic.backend.entity.Owner;
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
class OwnerServiceImplTest {

    @Mock
    private OwnerDao ownerDao;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private OwnerServiceImpl ownerService;

    private Owner sampleOwner;

    @BeforeEach
    void setUp() {
        sampleOwner = Owner.builder()
                .id(1L)
                .firstName("Jane")
                .lastName("Doe")
                .address("1 Main St")
                .city("Town")
                .telephoneNumber("1234567890")
                .build();
    }

    @Test
    void createOwner_success_returnsDto() {
        OwnerRequestDto req = OwnerRequestDto.builder()
                .firstName("Jane")
                .lastName("Doe")
                .address("1 Main St")
                .city("Town")
                .telephoneNumber("1234567890")
                .build();

        when(ownerDao.save(any())).thenReturn(sampleOwner);

        OwnerResponseDto res = ownerService.createOwner(req);

        assertEquals(sampleOwner.getId(), res.getId());
        assertEquals("Jane", res.getFirstName());
        verify(ownerDao).save(any());
        verify(notificationService).sendOwnerRegistrationNotification("1234567890");
    }

    @Test
    void getOwnerById_found_returnsDto() {
        when(ownerDao.findById(1L)).thenReturn(Optional.of(sampleOwner));

        OwnerResponseDto res = ownerService.getOwnerById(1L);

        assertEquals(1L, res.getId());
        assertEquals("Jane", res.getFirstName());
    }

    @Test
    void getOwnerById_notFound_throws() {
        when(ownerDao.findById(2L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> ownerService.getOwnerById(2L));
    }
}
