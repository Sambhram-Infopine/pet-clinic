package com.petclinic.backend.service;

import com.petclinic.backend.dao.LoginDao;
import com.petclinic.backend.dto.LoginRequestDto;
import com.petclinic.backend.dto.LoginResponseDto;
import com.petclinic.backend.entity.Login;
import com.petclinic.backend.exception.InvalidCredentialsException;
import com.petclinic.backend.security.JwtUtil;
import java.util.Objects;
import org.springframework.stereotype.Service;

@Service
public class LoginServiceImpl implements LoginService {

    private static final String INVALID_CREDENTIALS_MESSAGE = "Invalid username/email or password";

    private final LoginDao loginDao;
    private final JwtUtil jwtUtil;

    public LoginServiceImpl(LoginDao loginDao, JwtUtil jwtUtil) {
        this.loginDao = loginDao;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public LoginResponseDto login(LoginRequestDto request) {
        if (request == null) {
            throw new InvalidCredentialsException(INVALID_CREDENTIALS_MESSAGE);
        }

        Login login = loginDao.findByUsernameOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail())
                .orElseThrow(() -> new InvalidCredentialsException(INVALID_CREDENTIALS_MESSAGE));

        if (!Objects.equals(login.getPassword(), request.getPassword())) {
            throw new InvalidCredentialsException(INVALID_CREDENTIALS_MESSAGE);
        }

        return LoginResponseDto.builder()
                .success(true)
                .accessToken(jwtUtil.generateToken(login))
                .build();
    }
}
