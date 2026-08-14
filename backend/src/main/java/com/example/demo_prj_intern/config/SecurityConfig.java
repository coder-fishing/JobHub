package com.example.demo_prj_intern.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // Dùng bản Servlet/MVC, KHÔNG dùng reactive
import com.example.demo_prj_intern.security.OAuth2LoginSuccessHandler;
import com.example.demo_prj_intern.security.OAuth2LoginFailureHandler;
import lombok.RequiredArgsConstructor;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.example.demo_prj_intern.security.JwtAuthenticationFilter;

import java.util.List;

@Configuration
@EnableWebSecurity // BẮT BUỘC có annotation này để Spring Security nhận cấu hình
@RequiredArgsConstructor
public class SecurityConfig {

    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final OAuth2LoginFailureHandler oAuth2LoginFailureHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Tắt CSRF (Bắt buộc với REST API)
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Kích hoạt CORS theo bean corsConfigurationSource bên dưới
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 3. Chuyển Session sang STATELESS
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 4. Phân quyền Request
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/error").permitAll() // Cho phép truy cập tự do vào /api/auth/* và /error
                        .requestMatchers("/oauth2/**").permitAll() // Cho phép oauth2 flow
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/freelancer/profile", "/api/freelancer/profile/*").permitAll() // Cho phép xem hồ sơ freelancer tự do
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/projects", "/api/projects/*").permitAll() // Cho phép xem dự án tự do
                        .requestMatchers("/api/project/stats", "/api/project/search", "/api/project/**").permitAll()
                        .anyRequest().authenticated()               // Các API còn lại bắt buộc đăng nhập
                )
                
                // 5. Cấu hình OAuth2 Login
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oAuth2LoginSuccessHandler)
                        .failureHandler(oAuth2LoginFailureHandler)
                )
                
                // 6. Thêm JWT Filter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Cho phép Frontend Next.js / ReactJS và Postman truy cập
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source; // Không cần cast kiểu nữa vì đã import đúng class!
    }
}