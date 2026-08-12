package com.example.demo_prj_intern.security;

import com.example.demo_prj_intern.entity.UserEntity;
import com.example.demo_prj_intern.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with email: " + email));

        boolean isEnabled = "ACTIVE".equalsIgnoreCase(user.getStatus());
        boolean isAccountNonLocked = !"BLOCKED".equalsIgnoreCase(user.getStatus());

        java.util.List<SimpleGrantedAuthority> authorities;
        if (user.getRole() != null && !user.getRole().trim().isEmpty()) {
            authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
        } else {
            authorities = Collections.emptyList();
        }

        return new User(
                user.getEmail(),
                user.getPassword() != null ? user.getPassword() : "",
                isEnabled, // enabled
                true, // accountNonExpired
                true, // credentialsNonExpired
                isAccountNonLocked, // accountNonLocked
                authorities
        );
    }
}
