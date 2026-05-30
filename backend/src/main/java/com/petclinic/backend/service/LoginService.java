package com.petclinic.backend.service;

import com.petclinic.backend.dto.LoginRequestDto;
import com.petclinic.backend.dto.LoginResponseDto;

public interface LoginService {

    LoginResponseDto login(LoginRequestDto request);
}
