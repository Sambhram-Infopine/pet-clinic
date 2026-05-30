package com.petclinic.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.petclinic.backend.dto.LoginRequestDto;
import com.petclinic.backend.dto.LoginResponseDto;
import com.petclinic.backend.exception.InvalidCredentialsException;
import com.petclinic.backend.service.LoginService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(LoginController.class)
class LoginControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LoginService loginService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void postLogin_success_returns200() throws Exception {
        LoginRequestDto req = LoginRequestDto.builder()
                .usernameOrEmail("jdoe")
                .password("secret")
                .build();

        when(loginService.login(any())).thenReturn(LoginResponseDto.builder().success(true).accessToken("tok-1").build());

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.access_token").value("tok-1"));

        verify(loginService).login(any());
    }

    @Test
    void postLogin_invalidCredentials_returns401() throws Exception {
        LoginRequestDto req = LoginRequestDto.builder()
                .usernameOrEmail("jdoe")
                .password("bad")
                .build();

        when(loginService.login(any())).thenThrow(new InvalidCredentialsException("Invalid"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid"));

        verify(loginService).login(any());
    }
}
