package com.example.demo_prj_intern.security;

import com.example.demo_prj_intern.dto.request.Oauth2LoginRequest;
import com.example.demo_prj_intern.dto.respone.AuthResponse;
import com.example.demo_prj_intern.service.AuthService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final AuthService authService;

    @Value("${app.frontend.redirect-uri}")
    private String frontendRedirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        if (email == null || email.isEmpty()) {
            getRedirectStrategy().sendRedirect(request, response, frontendRedirectUri + "?error=missing_email");
            return;
        }

        try {
            // Reuse existing auth logic
            Oauth2LoginRequest loginRequest = new Oauth2LoginRequest();
            loginRequest.setEmail(email);
            loginRequest.setProvider("GOOGLE");

            AuthResponse authResponse = authService.oauth2Login(loginRequest);

            // Redirect back to frontend with the token
            String targetUrl = UriComponentsBuilder.fromUriString(frontendRedirectUri)
                    .queryParam("token", authResponse.getToken())
                    .build().toUriString();

            getRedirectStrategy().sendRedirect(request, response, targetUrl);

        } catch (Exception ex) {
            getRedirectStrategy().sendRedirect(request, response, frontendRedirectUri + "?error=" + ex.getMessage());
        }
    }
}
