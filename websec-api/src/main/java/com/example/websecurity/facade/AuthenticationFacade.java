package com.example.websecurity.facade;

import com.example.websecurity.api.dto.AuthenticationRequest;
import com.example.websecurity.api.dto.AuthenticationResponse;
import com.example.websecurity.security.JwtService;
import com.example.websecurity.service.UserService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import com.example.websecurity.persistence.User;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationFacade {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;

    private static final int MAX_FAILED_ATTEMPTS = 3;
    private static final long LOCK_DURATION_SECONDS = 60;

    @Transactional(noRollbackFor = BadCredentialsException.class)
    public AuthenticationResponse authenticate(@NotNull AuthenticationRequest request) {
        User user = userService.getUserByEmail(request.getEmail());

        if (user.getAccountLockedUntil() != null && user.getAccountLockedUntil().isAfter(LocalDateTime.now())) {
            throw new LockedException("Account is locked.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            user.setUnsuccessfulLoginAttempts(0);
            user.setAccountLockedUntil(null);
            userService.save(user);

            String accessToken = jwtService.generateAccessToken(user);
            return AuthenticationResponse.builder()
                    .accessToken(accessToken)
                    .build();

        } catch (BadCredentialsException e) {
            int attempts = user.getUnsuccessfulLoginAttempts() + 1;
            user.setUnsuccessfulLoginAttempts(attempts);
            if (attempts >= MAX_FAILED_ATTEMPTS) {
                user.setAccountLockedUntil(LocalDateTime.now().plusSeconds(LOCK_DURATION_SECONDS));
            }

            userService.save(user);

            throw new BadCredentialsException("Invalid email or password"); 
        }
    }
}
