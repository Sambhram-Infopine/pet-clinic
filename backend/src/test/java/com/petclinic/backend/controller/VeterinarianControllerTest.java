package com.petclinic.backend.controller;

import com.petclinic.backend.dto.VeterinarianResponseDto;
import com.petclinic.backend.service.VeterinarianService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(VeterinarianController.class)
class VeterinarianControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private VeterinarianService veterinarianService;

    @Test
    void getAllVeterinarians_returnsList() throws Exception {
        when(veterinarianService.getAllVeterinarians()).thenReturn(List.of(VeterinarianResponseDto.builder().id(1L).firstName("Doc").build()));

        mockMvc.perform(get("/api/veterinarians"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].firstName").value("Doc"));

        verify(veterinarianService).getAllVeterinarians();
    }
}
