package com.petclinic.backend.controller;

import com.petclinic.backend.dto.LoginRequestDto;
import com.petclinic.backend.dto.LoginResponseDto;
import com.petclinic.backend.exception.InvalidCredentialsException;
import com.petclinic.backend.service.LoginService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto request) {
        return ResponseEntity.ok(loginService.login(request));
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<LoginResponseDto> handleInvalidCredentials(InvalidCredentialsException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(LoginResponseDto.builder()
                        .success(false)
                        .message(exception.getMessage())
                        .build());
    }
}
