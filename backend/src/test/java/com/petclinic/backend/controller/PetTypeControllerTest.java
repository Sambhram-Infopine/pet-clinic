package com.petclinic.backend.controller;

import com.petclinic.backend.dto.PetTypeResponseDto;
import com.petclinic.backend.service.PetTypeService;
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

@WebMvcTest(PetTypeController.class)
class PetTypeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PetTypeService petTypeService;

    @Test
    void getAllPetTypes_returnsList() throws Exception {
        when(petTypeService.getAllPetTypes()).thenReturn(List.of(PetTypeResponseDto.builder().id(1L).name("Dog").build()));

        mockMvc.perform(get("/api/pet-types"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Dog"));

        verify(petTypeService).getAllPetTypes();
    }
}
