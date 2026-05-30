package com.petclinic.backend.service;

import com.petclinic.backend.dao.LoginDao;
import com.petclinic.backend.dto.LoginRequestDto;
import com.petclinic.backend.dto.LoginResponseDto;
import com.petclinic.backend.entity.Login;
import com.petclinic.backend.exception.InvalidCredentialsException;
import com.petclinic.backend.security.JwtUtil;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoginServiceImplTest {

    @Mock
    private LoginDao loginDao;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private LoginServiceImpl loginService;

    private Login sampleLogin;

    @BeforeEach
    void setUp() {
        sampleLogin = Login.builder()
                .id(1L)
                .username("jdoe")
                .email("jdoe@example.com")
                .password("secret")
                .build();
    }

    @Test
    void login_success_returnsToken() {
        LoginRequestDto request = LoginRequestDto.builder()
                .usernameOrEmail("jdoe")
                .password("secret")
                .build();

        when(loginDao.findByUsernameOrEmail("jdoe", "jdoe")).thenReturn(Optional.of(sampleLogin));
        when(jwtUtil.generateToken(sampleLogin)).thenReturn("tok-123");

        LoginResponseDto response = loginService.login(request);

        assertTrue(response.isSuccess());
        assertEquals("tok-123", response.getAccessToken());
        verify(loginDao).findByUsernameOrEmail("jdoe", "jdoe");
        verify(jwtUtil).generateToken(sampleLogin);
    }

    @Test
    void login_nullRequest_throwsInvalidCredentials() {
        assertThrows(InvalidCredentialsException.class, () -> loginService.login(null));
    }

    @Test
    void login_unknownUser_throwsInvalidCredentials() {
        LoginRequestDto request = LoginRequestDto.builder()
                .usernameOrEmail("unknown")
                .password("x")
                .build();

        when(loginDao.findByUsernameOrEmail("unknown", "unknown")).thenReturn(Optional.empty());

        assertThrows(InvalidCredentialsException.class, () -> loginService.login(request));
    }

    @Test
    void login_wrongPassword_throwsInvalidCredentials() {
        LoginRequestDto request = LoginRequestDto.builder()
                .usernameOrEmail("jdoe")
                .password("wrong")
                .build();

        when(loginDao.findByUsernameOrEmail("jdoe", "jdoe")).thenReturn(Optional.of(sampleLogin));

        assertThrows(InvalidCredentialsException.class, () -> loginService.login(request));
    }
}
