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

import java.util.List;

@Configuration
@EnableWebSecurity // BẮT BUỘC có annotation này để Spring Security nhận cấu hình
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

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
                        .requestMatchers("/api/**", "/error").permitAll() // Cho phép truy cập tự do vào /api/auth/* và /error                     .anyRequest().authenticated()               // Các API còn lại bắt buộc đăng nhập
                );

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